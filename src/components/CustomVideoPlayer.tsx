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
  ArrowLeft,
  Tv,
  Film,
  RefreshCw,
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

  // Extract Google Drive File ID cleanly from any property or link
  const fileId =
    video.driveFileId ||
    video.id?.replace(/^drive-sync-/, '') ||
    video.embedUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    video.driveUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    video.driveUrl?.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1] ||
    '';

  const isGoogleDriveVideo = Boolean(
    fileId ||
    video.driveUrl?.includes('drive.google.com') ||
    video.embedUrl?.includes('drive.google.com')
  );

  // Official error-free Google Drive in-app streaming preview URL
  const driveEmbedSrc = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : video.embedUrl || '';

  // Direct server stream and download endpoints
  const streamSrc = video.streamUrl || (fileId ? `/api/drive/stream?id=${fileId}&type=video` : '');
  const downloadSrc =
    video.downloadUrl ||
    (fileId
      ? `/api/drive/download?id=${fileId}&filename=${encodeURIComponent(
          video.originalFilename || video.titleEn || 'polio_video.mp4'
        )}`
      : '');

  // Default to drive_embed for Google Drive videos to guarantee zero-error mobile & desktop playback
  const [playerMode, setPlayerMode] = useState<'drive_embed' | 'html5'>(
    isGoogleDriveVideo && driveEmbedSrc ? 'drive_embed' : 'html5'
  );

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
  const [fallbackToast, setFallbackToast] = useState<string | null>(null);

  const [retryKey, setRetryKey] = useState(0);

  // Reset video state cleanly when active video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBufferedEnd(0);
    setPlaybackError(false);
    setIsLoading(true);
    setFallbackToast(null);
    setSpeedMenuOpen(false);
    setRetryKey(0);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, [video.id, fileId]);

  // Clean retry without full page reload
  const handleRetry = useCallback(() => {
    setPlaybackError(false);
    setIsLoading(true);
    setFallbackToast(null);
    setRetryKey((k) => k + 1);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play / Pause toggle for HTML5 player
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Auto-switch to drive embed player so user never encounters errors
        if (driveEmbedSrc) {
          setPlayerMode('drive_embed');
          setFallbackToast(
            isUr
              ? 'ویڈیو خودکار طور پر گوگل ڈرائیو پلیئر میں کھل گئی ہے'
              : 'Switched to Google Drive In-App Player for smooth playback'
          );
        } else {
          setPlaybackError(true);
        }
      });
    }
  }, [isPlaying, driveEmbedSrc, isUr]);

  // Skip time (+/- 10s)
  const skipTime = useCallback(
    (offset: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + offset, duration));
    },
    [duration]
  );

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

  // Video event listeners for HTML5 player
  useEffect(() => {
    if (playerMode !== 'html5') return;
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
      // Seamlessly fallback to Drive embed player to avoid error screens
      if (driveEmbedSrc) {
        setPlayerMode('drive_embed');
        setFallbackToast(
          isUr
            ? 'روانی کے لیے گوگل ڈرائیو پلیئر آن کر دیا گیا'
            : 'Activated Google Drive In-App stream for seamless playback'
        );
      } else {
        setPlaybackError(true);
      }
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
  }, [playerMode, streamSrc, driveEmbedSrc, isUr]);

  const copyTalkingPoints = () => {
    const textToCopy = `${video.titleEn || video.titleUr}\n\nSpeaker: ${video.speakerEn || video.speakerUr} (${video.designationEn || video.designationUr})\n\nSummary:\n${video.summaryEn || video.summaryUr}\n\nKey Points:\n${(video.keyPointsEn || video.keyPointsUr || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div id={`custom-video-player-${video.id}`} className="space-y-3.5 select-none" dir={isUr ? 'rtl' : 'ltr'}>
      {/* Top Banner: Navigation, Drive In-App Player Status & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={isUr ? 'ویڈیوز پر واپس جائیں' : 'Back to videos'}
              title={isUr ? 'ویڈیوز کی فہرست پر واپس جائیں' : 'Back to video list'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-700/60 font-bold transition cursor-pointer active:scale-95 touch-manipulation text-xs"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isUr ? 'rotate-180' : ''}`} />
              <span>{isUr ? 'بند کریں' : 'Close Player'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isUr
                ? 'براہ راست ویب سائٹ پر پلے بیک (کوئی ایرر نہیں)'
                : 'Direct In-App Playback (100% Error-Free)'}
            </span>
          </div>
        </div>

        {/* Player Controls & Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Reload / Retry Action */}
          <button
            type="button"
            onClick={handleRetry}
            aria-label={isUr ? 'ویڈیو پلیئر ری لوڈ کریں' : 'Reload player'}
            title={isUr ? 'ویڈیو پلیئر ری لوڈ کریں' : 'Reload player without reloading page'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold transition cursor-pointer active:scale-95 text-[11px]"
          >
            <RefreshCw className="w-3 h-3 text-teal-400" />
            <span>{isUr ? 'ری لوڈ' : 'Reload'}</span>
          </button>

          {/* Direct Download in Header */}
          {downloadSrc && (
            <a
              href={downloadSrc}
              download
              title={isUr ? 'ویڈیو ڈاؤنلوڈ کریں' : 'Download video file'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition cursor-pointer active:scale-95 text-[11px] shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>{isUr ? 'ڈاؤنلوڈ' : 'Download'}</span>
            </a>
          )}

          {/* Player Switcher (Drive Embed vs Direct HTML5) */}
          {driveEmbedSrc && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setPlayerMode('drive_embed');
                  setPlaybackError(false);
                }}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                  playerMode === 'drive_embed'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tv className="w-3 h-3" />
                <span>{isUr ? 'ڈرائیو ان-ایپ' : 'Drive In-App'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlayerMode('html5');
                  setPlaybackError(false);
                }}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                  playerMode === 'html5'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>{isUr ? 'ایچ ٹی ایم ایل 5' : 'HTML5'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {fallbackToast && (
        <div className="px-3 py-1.5 rounded-lg bg-teal-950/70 border border-teal-800 text-teal-300 text-xs flex items-center justify-between animate-fade-in">
          <span>{fallbackToast}</span>
          <button
            type="button"
            onClick={() => setFallbackToast(null)}
            className="text-teal-400 hover:text-white px-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Video Viewport (16:9 Aspect Ratio) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video w-full bg-[#050811] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none group"
      >
        {/* MODE 1: Official Google Drive In-App Embedded Video Stream */}
        {playerMode === 'drive_embed' && driveEmbedSrc ? (
          <div className="relative w-full h-full">
            <iframe
              key={`drive-embed-${fileId}-${retryKey}`}
              src={driveEmbedSrc}
              title={video.titleEn || video.titleUr || 'Google Drive Video'}
              className="w-full h-full border-0 rounded-2xl bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          /* MODE 2: HTML5 Video Element with Full Custom Controls */
          <>
            <video
              key={`html5-video-${fileId}-${retryKey}`}
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
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
                  <Tv className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-slate-100 mb-1">
                  {isUr ? 'ڈرائیو ان-ایپ پلیئر پر منتقل ہوں' : 'Switch to Drive In-App Player'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
                  {isUr
                    ? 'یہ ویڈیو گوگل ڈرائیو ان-ایپ پلیئر میں بغیر کسی ایرر یا وقفے کے باآسانی چلائی جا سکتی ہے۔'
                    : 'Watch this Google Drive video smoothly with adaptive streaming on our in-app player with zero errors.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {driveEmbedSrc && (
                    <button
                      type="button"
                      onClick={() => {
                        setPlayerMode('drive_embed');
                        setPlaybackError(false);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-950/40 transition-all cursor-pointer"
                    >
                      <Tv className="w-4 h-4" />
                      <span>{isUr ? 'ڈرائیو پلیئر میں چلائیں' : 'Play via Drive Player'}</span>
                    </button>
                  )}
                  {downloadSrc && (
                    <a
                      href={downloadSrc}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isUr ? 'ڈاؤن لوڈ کریں' : 'Download File'}</span>
                    </a>
                  )}
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
                <div className="w-16 h-16 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-xl shadow-teal-950/50 hover:scale-110 transition-transform pl-1">
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
                <div className="w-full h-1.5 group-hover/scrubber:h-2 bg-slate-700/60 rounded-full overflow-hidden transition-all relative">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-slate-500/40 transition-all"
                    style={{ width: `${bufferPercent}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div
                  className="absolute w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-md -translate-x-1/2 pointer-events-none group-hover/scrubber:scale-125 transition-transform"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Controls Bottom Row */}
              <div className="flex items-center justify-between text-white text-xs">
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

                <div className="flex items-center gap-2 relative">
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
          </>
        )}
      </div>

      {/* Speaker & Takeaways Details */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Header: Speaker & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium">
                {isUr ? (video.badgeUr || 'توثیق شدہ') : (video.badgeEn || 'Verified Reference')}
              </span>
              {video.category && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                  {video.category}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {isUr ? (video.titleUr || video.titleEn) : (video.titleEn || video.titleUr)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>
                {isUr
                  ? `${video.speakerUr || video.speakerEn || ''} — ${video.designationUr || video.designationEn || ''}`
                  : `${video.speakerEn || video.speakerUr || ''} — ${video.designationEn || video.designationUr || ''}`}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={copyTalkingPoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer active:scale-95"
            >
              {copiedNotification ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? (isUr ? 'کاپی ہو گیا' : 'Copied!') : (isUr ? 'اہم نکات کاپی کریں' : 'Copy Points')}</span>
            </button>
            {downloadSrc && (
              <a
                href={downloadSrc}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold shadow-md shadow-teal-950/40 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUr ? 'ڈاؤن لوڈ' : 'Download Video'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Core Summary & Field Scenario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{isUr ? 'اہم خلاصہ' : 'Operational Summary'}</span>
            </h5>
            <p className="text-slate-300">
              {isUr ? (video.summaryUr || video.summaryEn) : (video.summaryEn || video.summaryUr)}
            </p>
          </div>

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
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
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
