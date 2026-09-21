import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import type { VideoItem } from '../types';

interface CustomVideoPlayerProps {
  video: VideoItem;
  language: 'en' | 'ur';
  onClose?: () => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  video,
  language,
  onClose,
}) => {
  const isUr = language === 'ur';

  // Derive direct file ID
  const fileId =
    video.driveFileId ||
    video.id?.replace(/^drive-sync-/, '') ||
    video.embedUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    video.driveUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    '';

  // Direct server stream and download endpoints (no Google sign-in or cookies)
  const streamSrc = video.streamUrl || (fileId ? `/api/drive/stream?id=${fileId}&type=video` : '');
  const downloadSrc = video.downloadUrl || (fileId ? `/api/drive/download?id=${fileId}&filename=${encodeURIComponent(video.originalFilename || video.titleEn || 'polio_video.mp4')}` : '');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        setPlaybackError(true);
      });
    }
  }, [isPlaying]);

  // Skip time (+/- 10s)
  const skipTime = useCallback((offset: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + offset, duration));
  }, [duration]);

  // Volume toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Seekbar scrub
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  // Playback speed
  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setSpeedMenuOpen(false);
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Autohide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setSpeedMenuOpen(false);
      }, 3500);
    }
  };

  // Video event listeners
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0) {
        setBufferedEnd(v.buffered.end(v.buffered.length - 1));
      }
    };
    const onLoadedMetadata = () => {
      setDuration(v.duration);
      setIsLoading(false);
      setPlaybackError(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setPlaybackError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setPlaybackError(true);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('error', onError);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('error', onError);
    };
  }, [streamSrc]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'KeyK'].includes(e.code)) {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(5);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipTime]);

  const copyTalkingPoints = () => {
    const textToCopy = `${video.titleEn || video.titleUr}\n\nSpeaker: ${video.speakerEn || video.speakerUr} (${video.designationEn || video.designationUr})\n\nSummary:\n${video.summaryEn || video.summaryUr}\n\nKey Points:\n${(video.keyPointsEn || video.keyPointsUr || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div id={`custom-video-player-${video.id}`} className="space-y-4">
      {/* Security & Direct Stream Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isUr
              ? 'سرور کے ذریعے محفوظ براہ راست ویڈیو اسٹریم — گوگل سائن ان یا کوکیز کی ضرورت نہیں'
              : 'Direct Server Video Stream — Google Sign-in & Third-Party Cookies Bypassed'}
          </span>
        </div>
        {downloadSrc && (
          <a
            href={downloadSrc}
            download
            className="flex items-center gap-1.5 font-medium text-emerald-300 hover:text-emerald-100 transition-colors ml-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isUr ? 'ڈاؤن لوڈ' : 'Download'}</span>
          </a>
        )}
      </div>

      {/* Main Video Screen Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video w-full bg-[#080d16] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none group"
      >
        {/* HTML5 Native Video Element */}
        <video
          ref={videoRef}
          src={streamSrc}
          poster={video.thumbnailUrl}
          playsInline
          preload="metadata"
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Playback Fallback Card if Video Decode Fails */}
        {playbackError && (
          <div className="absolute inset-0 bg-[#0b1120]/95 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-slate-100 mb-1">
              {isUr ? 'براہ راست ڈاؤن لوڈ یا پلے بیک' : 'Direct Stream Ready'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              {isUr
                ? 'یہ ویڈیو گوگل ڈرائیو کے اندر پروسیسنگ مرحلے میں ہے یا فارمیٹ کو کنورٹ کیا جا رہا ہے۔ آپ اسے بغیر کسی رکاوٹ کے ڈاؤن لوڈ کر کے چلا سکتے ہیں۔'
                : 'Google Drive preview embeds have been removed. You can download the video directly via our secure server proxy without any Google authentication.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {downloadSrc && (
                <a
                  href={downloadSrc}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isUr ? 'براہ راست ڈاؤن لوڈ کریں' : 'Download File Directly'}</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setPlaybackError(false);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => setPlaybackError(true));
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>{isUr ? 'دوبارہ کوشش کریں' : 'Retry Stream'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !playbackError && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-10">
            <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Big Central Play Button Overlay */}
        {!isPlaying && !isLoading && !playbackError && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-10"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl shadow-emerald-950/50 hover:scale-110 transition-transform pl-1">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </button>
        )}

        {/* Custom Video Controls Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-300 z-10 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress / Seekbar */}
          <div className="relative mb-3 flex items-center group/scrubber cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Video scrubber"
              className="absolute inset-0 w-full h-2 opacity-0 z-20 cursor-pointer"
            />
            {/* Scrubber Background Bar */}
            <div className="w-full h-1.5 group-hover/scrubber:h-2 bg-slate-700/60 rounded-full overflow-hidden transition-all relative">
              {/* Buffered Track */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-slate-500/40 transition-all"
                style={{ width: `${bufferPercent}%` }}
              />
              {/* Played Progress Track */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber Thumb */}
            <div
              className="absolute w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-md -translate-x-1/2 pointer-events-none group-hover/scrubber:scale-125 transition-transform"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left Controls: Play, Skip, Time */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => skipTime(-10)}
                aria-label="Replay 10 seconds"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => skipTime(10)}
                aria-label="Forward 10 seconds"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="text-slate-300 font-mono text-[11px] tracking-wider ml-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-500 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Volume, Speed, PiP, Fullscreen */}
            <div className="flex items-center gap-2 relative">
              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume slider"
                  className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 opacity-80 group-hover/vol:opacity-100 transition-opacity"
                />
              </div>

              {/* Speed Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                  className="px-2 py-1 rounded-lg hover:bg-white/10 transition-colors font-mono text-[11px] text-slate-200"
                  title="Playback speed"
                >
                  {playbackRate}x
                </button>
                {speedMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 py-1 px-1 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl flex flex-col gap-1 z-30 min-w-[70px]">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => changeSpeed(s)}
                        className={`px-2 py-1 rounded text-left text-[11px] font-mono transition-colors ${
                          playbackRate === s ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Speaker & Takeaways Details */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Header: Speaker & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                {isUr ? (video.badgeUr || 'توثیق شدہ') : (video.badgeEn || 'Verified Reference')}
              </span>
              {video.category && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                  {video.category}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100">
              {isUr ? (video.titleUr || video.titleEn) : (video.titleEn || video.titleUr)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {isUr
                  ? `${video.speakerUr || video.speakerEn || ''} — ${video.designationUr || video.designationEn || ''}`
                  : `${video.speakerEn || video.speakerUr || ''} — ${video.designationEn || video.designationUr || ''}`}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={copyTalkingPoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {copiedNotification ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? (isUr ? 'کاپی ہو گیا' : 'Copied!') : (isUr ? 'اہم نکات کاپی کریں' : 'Copy Points')}</span>
            </button>
            {downloadSrc && (
              <a
                href={downloadSrc}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUr ? 'ڈاؤن لوڈ' : 'Download Video'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Core Summary & Field Scenario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          {/* Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isUr ? 'اہم خلاصہ' : 'Operational Summary'}</span>
            </h5>
            <p className="text-slate-300">
              {isUr ? (video.summaryUr || video.summaryEn) : (video.summaryEn || video.summaryUr)}
            </p>
          </div>

          {/* Field Scenario */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isUr ? 'فیلڈ میں کب استعمال کریں؟' : 'When to Use in Field?'}</span>
            </h5>
            <p className="text-slate-300">
              {isUr
                ? (video.fieldScenarioUr || 'انکار کرنے والے والدین اور کمیونٹی عمائدین کے ساتھ گفتگو کے دوران فوری حوالہ کے طور پر دکھائیں۔')
                : (video.fieldScenarioEn || 'Show during refusal conversions, community jirgas, and parent counseling sessions.')}
            </p>
          </div>
        </div>

        {/* Key Points Bullet List */}
        {((isUr ? video.keyPointsUr : video.keyPointsEn) || video.keyPointsEn || []).length > 0 && (
          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-semibold text-slate-300">
              {isUr ? 'کلیدی نکات (Key Talking Points):' : 'Key Talking Points for Field Mobilizers:'}
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {((isUr ? video.keyPointsUr : video.keyPointsEn) || video.keyPointsEn || []).map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
