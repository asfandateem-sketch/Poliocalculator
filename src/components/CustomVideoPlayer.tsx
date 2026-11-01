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
  Info,
  X,
  Scaling,
  Smartphone,
  Ratio,
} from 'lucide-react';
import type { VideoItem } from '../types';
import { getStreamUrl, getDownloadUrl } from '../data/driveLiveConfig';

interface CustomVideoPlayerProps {
  video: VideoItem;
  language: 'en' | 'ur';
  onClose?: () => void;
}

type AspectRatioMode = 'auto' | '16:9' | 'fill' | '9:16';

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

  // Official error-free Google Drive in-app streaming preview URL (optional fallback)
  const driveEmbedSrc = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : video.embedUrl || '';

  // Direct server stream and download endpoints with cross-origin Cloud service support
  const streamSrc = video.streamUrl || (fileId ? getStreamUrl(fileId, 'video') : '');
  const downloadSrc =
    video.downloadUrl ||
    (fileId
      ? getDownloadUrl(
          fileId,
          video.originalFilename || video.titleEn || 'polio_video.mp4',
          'video'
        )
      : '');

  // Default to native HTML5 video player to eliminate Google third-party cookie prompts
  const [playerMode, setPlayerMode] = useState<'drive_embed' | 'html5'>('html5');

  // Video aspect ratio & layout adaptation
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>('auto');
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
    ratio: number;
    isPortrait: boolean;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; x: number } | null>(null);

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
  const [seekFeedback, setSeekFeedback] = useState<{ type: 'rewind' | 'forward'; count: number } | null>(null);

  const [retryKey, setRetryKey] = useState(0);
  const [showStreamInfoModal, setShowStreamInfoModal] = useState(false);

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
    setVideoDimensions(null);
    setAspectMode('auto');
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, [video.id, fileId]);

  // Sync fullscreen state with browser events (including mobile swipe-out)
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

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

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const hrs = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (hrs > 0) {
      return `${hrs}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play / Pause toggle for HTML5 player
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        console.warn('[VideoPlayer] Playback play() caught error:', err);
        setPlaybackError(true);
      });
    }
  }, [isPlaying]);

  // Skip time (+/- 10s)
  const skipTime = useCallback(
    (offset: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + offset, duration || 99999)
      );
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

  // Touch-friendly scrub for mobile
  const handleTouchScrub = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const target = pos * duration;
    setCurrentTime(target);
    videoRef.current.currentTime = target;
  };

  // Playback speed
  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setSpeedMenuOpen(false);
  };

  // Fullscreen with mobile Safari and Android support
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const v = videoRef.current as any;
    try {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFs) {
        if (container?.requestFullscreen) {
          await container.requestFullscreen();
          setIsFullscreen(true);
        } else if (container && (container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
          setIsFullscreen(true);
        } else if (v?.webkitEnterFullscreen) {
          // iOS Safari native fullscreen
          v.webkitEnterFullscreen();
          setIsFullscreen(true);
        } else if (v?.requestFullscreen) {
          await v.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Cycle aspect ratio mode (Auto/Fit -> 16:9 -> 9:16 -> Fill)
  const cycleAspectMode = () => {
    setAspectMode((prev) => {
      if (prev === 'auto') return '16:9';
      if (prev === '16:9') return videoDimensions?.isPortrait ? '9:16' : 'fill';
      if (prev === '9:16') return 'fill';
      return 'auto';
    });
  };

  // Autohide controls after inactivity
  const resetControlsTimeout = () => {
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

  const handleMouseMove = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  // Touch tap handler with double-tap detection for mobile (+/-10s)
  const handleVideoAreaTouchOrClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    let clientX = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
    }

    const rect = containerRef.current?.getBoundingClientRect();

    if (rect && lastTapRef.current && now - lastTapRef.current.time < 320) {
      // Double tap detected!
      const relativeX = clientX - rect.left;
      const isLeftSide = relativeX < rect.width * 0.38;
      const isRightSide = relativeX > rect.width * 0.62;

      if (isLeftSide) {
        skipTime(-10);
        setSeekFeedback({ type: 'rewind', count: 10 });
        setTimeout(() => setSeekFeedback(null), 700);
        lastTapRef.current = null;
        return;
      } else if (isRightSide) {
        skipTime(10);
        setSeekFeedback({ type: 'forward', count: 10 });
        setTimeout(() => setSeekFeedback(null), 700);
        lastTapRef.current = null;
        return;
      }
    }

    lastTapRef.current = { time: now, x: clientX };

    // Single tap behavior: if controls hidden, reveal them; if visible, toggle play/pause
    if (!showControls) {
      setShowControls(true);
      resetControlsTimeout();
    } else {
      togglePlay();
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

      // Detect intrinsic video dimensions to adapt layout
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      if (vw && vh) {
        const isPort = vh > vw * 1.05;
        setVideoDimensions({
          width: vw,
          height: vh,
          ratio: vw / vh,
          isPortrait: isPort,
        });
        if (isPort) {
          setAspectMode('9:16');
        }
      }
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setPlaybackError(false);
      resetControlsTimeout();
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onError = (e: any) => {
      setIsLoading(false);
      console.warn('[VideoPlayer] HTML5 video decoding error:', e);
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
  }, [playerMode, streamSrc, driveEmbedSrc, isUr]);

  const copyTalkingPoints = () => {
    const textToCopy = `${video.titleEn || video.titleUr}\n\nSpeaker: ${video.speakerEn || video.speakerUr} (${video.designationEn || video.designationUr})\n\nSummary:\n${video.summaryEn || video.summaryUr}\n\nKey Points:\n${(video.keyPointsEn || video.keyPointsUr || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  // Determine container styling based on aspectMode & intrinsic dimensions
  const getContainerClasses = () => {
    let base =
      'relative w-full max-w-full bg-[#030712] overflow-hidden select-none group transition-all duration-300 flex items-center justify-center';

    if (isFullscreen) {
      return `${base} w-screen h-screen rounded-none`;
    }

    if (aspectMode === '16:9') {
      return `${base} aspect-video rounded-none sm:rounded-2xl border-y sm:border border-slate-800 shadow-2xl`;
    }

    if (aspectMode === '9:16') {
      return `${base} aspect-[9/16] max-h-[72vh] mx-auto rounded-none sm:rounded-2xl border-y sm:border border-slate-800 shadow-2xl`;
    }

    if (aspectMode === 'fill') {
      return `${base} aspect-video sm:h-[480px] rounded-none sm:rounded-2xl border-y sm:border border-slate-800 shadow-2xl`;
    }

    // 'auto' mode: adapt to intrinsic video aspect ratio
    if (videoDimensions?.isPortrait) {
      return `${base} aspect-[9/16] max-h-[72vh] mx-auto rounded-none sm:rounded-2xl border-y sm:border border-slate-800 shadow-2xl`;
    }

    return `${base} aspect-video rounded-none sm:rounded-2xl border-y sm:border border-slate-800 shadow-2xl`;
  };

  return (
    <div
      id={`custom-video-player-${video.id}`}
      className="space-y-2.5 sm:space-y-4 select-none w-full max-w-full"
      dir={isUr ? 'rtl' : 'ltr'}
    >
      {/* Sleek Top Bar: Compact Single-Line on Mobile with Direct Actions */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-300">
        {/* Left: Close / Back Navigation + Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={isUr ? 'واپس جائیں' : 'Back to videos'}
              title={isUr ? 'ویڈیوز کی فہرست پر واپس جائیں' : 'Back to video list'}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-900/70 hover:bg-teal-800 text-teal-200 border border-teal-700/60 font-bold transition cursor-pointer active:scale-95 touch-manipulation text-xs shrink-0"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isUr ? 'rotate-180' : ''}`} />
              <span>{isUr ? 'واپس' : 'Back'}</span>
            </button>
          )}

          <div className="min-w-0 flex items-center gap-1 text-slate-200 font-semibold text-xs sm:text-sm truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden sm:inline" />
            <span className="truncate">
              {isUr ? (video.titleUr || video.titleEn) : (video.titleEn || video.titleUr)}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Aspect Ratio / Fit Switcher (Addresses length/width customization) */}
          <button
            type="button"
            onClick={cycleAspectMode}
            aria-label="Toggle aspect ratio"
            title={`Current: ${aspectMode.toUpperCase()} (Click to switch Fit / 16:9 / 9:16 / Fill)`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-[10px] sm:text-[11px] font-bold transition cursor-pointer active:scale-95 touch-manipulation"
          >
            <Scaling className="w-3 h-3 text-emerald-400" />
            <span className="uppercase">{aspectMode}</span>
          </button>

          {/* Direct MP4 Download */}
          {downloadSrc && (
            <a
              href={downloadSrc}
              download
              title={isUr ? 'ویڈیو ڈاؤنلوڈ کریں' : 'Download video file'}
              className="inline-flex items-center justify-center w-7 h-7 sm:w-auto sm:px-2.5 sm:py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition cursor-pointer active:scale-95 text-[11px] shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline ml-1">{isUr ? 'ڈاؤنلوڈ' : 'MP4'}</span>
            </a>
          )}

          {/* Reload / Retry Action */}
          <button
            type="button"
            onClick={handleRetry}
            aria-label={isUr ? 'ویڈیو پلیئر ری لوڈ کریں' : 'Reload player'}
            title={isUr ? 'ویڈیو پلیئر ری لوڈ کریں' : 'Reload player without reloading page'}
            className="inline-flex items-center justify-center w-7 h-7 sm:w-auto sm:px-2 sm:py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold transition cursor-pointer active:scale-95 text-[11px]"
          >
            <RefreshCw className="w-3 h-3 text-teal-400" />
            <span className="hidden lg:inline ml-1">{isUr ? 'ری لوڈ' : 'Reload'}</span>
          </button>

          {/* Stream Info & Hosting Guide */}
          <button
            type="button"
            onClick={() => setShowStreamInfoModal(true)}
            aria-label={isUr ? 'سٹریمنگ رہنمائی' : 'Streaming guide'}
            title={isUr ? 'سٹریمنگ رہنمائی و تجاویز' : 'Google Drive streaming info & free alternatives'}
            className="inline-flex items-center justify-center w-7 h-7 sm:w-auto sm:px-2 sm:py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold transition cursor-pointer active:scale-95 text-[11px]"
          >
            <Info className="w-3 h-3 text-sky-400" />
          </button>

          {/* Player Switcher (Drive Embed vs Direct HTML5) */}
          {driveEmbedSrc && (
            <button
              type="button"
              onClick={() => {
                setPlayerMode(playerMode === 'html5' ? 'drive_embed' : 'html5');
                setPlaybackError(false);
              }}
              title={playerMode === 'html5' ? 'Switch to Google Drive Embed Player' : 'Switch to Direct HTML5 Player'}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-bold cursor-pointer"
            >
              {playerMode === 'html5' ? <Film className="w-3 h-3 text-teal-400" /> : <Tv className="w-3 h-3 text-amber-400" />}
              <span className="hidden sm:inline">{playerMode === 'html5' ? 'HTML5' : 'Drive'}</span>
            </button>
          )}

          {/* Dedicated Cross button to close screen and go back */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={isUr ? 'بند کریں اور واپس جائیں' : 'Close and go back'}
              title={isUr ? 'بند کریں اور واپس جائیں' : 'Close and go back'}
              className="inline-flex items-center justify-center w-7 h-7 sm:w-auto sm:px-2.5 sm:py-1 rounded-md bg-slate-800/90 hover:bg-rose-900/70 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-white font-bold transition cursor-pointer active:scale-95 text-[11px]"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">{isUr ? 'بند کریں' : 'Close'}</span>
            </button>
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

      {/* Main Video Viewport: Responsive Length, Width & Aspect Ratio */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={getContainerClasses()}
      >
        {/* MODE 1: Official Google Drive In-App Embedded Video Stream */}
        {playerMode === 'drive_embed' && driveEmbedSrc ? (
          <div className="relative w-full h-full">
            <iframe
              key={`drive-embed-${fileId}-${retryKey}`}
              src={driveEmbedSrc}
              title={video.titleEn || video.titleUr || 'Google Drive Video'}
              className="w-full h-full border-0 rounded-none sm:rounded-2xl bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          /* MODE 2: HTML5 Video Element with Full Custom Mobile Controls & Gestures */
          <>
            <video
              key={`html5-video-${fileId}-${retryKey}`}
              ref={videoRef}
              src={streamSrc}
              poster={video.thumbnailUrl}
              playsInline
              preload="metadata"
              className={`w-full h-full cursor-pointer ${
                aspectMode === 'fill' ? 'object-cover' : 'object-contain'
              }`}
            />

            {/* Gesture & Tap Overlay (Handles single tap & double-tap skip) */}
            <div
              onClick={handleVideoAreaTouchOrClick}
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="Video interactive area"
            />

            {/* Double Tap Visual Indicator (-10s / +10s) */}
            {seekFeedback && (
              <div
                className={`absolute inset-y-0 ${
                  seekFeedback.type === 'rewind' ? 'left-0' : 'right-0'
                } w-1/3 bg-white/10 backdrop-blur-2xs flex flex-col items-center justify-center text-white z-20 pointer-events-none transition-opacity duration-300 animate-pulse`}
              >
                {seekFeedback.type === 'rewind' ? (
                  <>
                    <RotateCcw className="w-8 h-8 mb-1" />
                    <span className="font-mono text-xs font-bold">-10s</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-8 h-8 mb-1" />
                    <span className="font-mono text-xs font-bold">+10s</span>
                  </>
                )}
              </div>
            )}

            {/* Playback Fallback Card if Video Decode Fails */}
            {playbackError && (
              <div className="absolute inset-0 bg-[#0b1120]/95 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 overflow-y-auto">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-2.5">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-100 mb-1">
                  {isUr ? 'سٹریمنگ کنکشن میں تعطل' : 'Stream Connection Retry'}
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mb-3.5 leading-relaxed">
                  {isUr
                    ? 'براہ کرم ری ٹرائی کریں یا براہ راست ویڈیو ڈاؤنلوڈ کریں۔ گوگل ڈرائیو پرمیشن اور کوکیز کے بغیر پلے بیک کے لیے ری لوڈ دبائیں۔'
                    : 'Click retry to re-establish the stream, or download the MP4 file directly with zero Google cookies required.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isUr ? 'دوبارہ کوشش کریں' : 'Retry Playback'}</span>
                  </button>
                  {downloadSrc && (
                    <a
                      href={downloadSrc}
                      download
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isUr ? 'ڈاؤن لوڈ MP4' : 'Download MP4'}</span>
                    </a>
                  )}
                  {driveEmbedSrc && (
                    <button
                      type="button"
                      onClick={() => {
                        setPlayerMode('drive_embed');
                        setPlaybackError(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-800 cursor-pointer transition-all"
                      title="Try Google Drive Player (may ask for cookies)"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>{isUr ? 'گوگل ڈرائیو ایمبیڈ آزمائیں' : 'Try Drive Embed'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {isLoading && !playbackError && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-20">
                <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              </div>
            )}

            {/* Big Central Play Button Overlay */}
            {!isPlaying && !isLoading && !playbackError && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors z-20 cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-xl shadow-teal-950/50 hover:scale-110 active:scale-95 transition-transform pl-1">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </div>
              </button>
            )}

            {/* Custom Video Controls Overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-3.5 transition-opacity duration-300 z-20 ${
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress / Seekbar with generous mobile touch hit area */}
              <div
                className="relative mb-1.5 sm:mb-2.5 flex items-center group/scrubber cursor-pointer touch-none py-1.5"
                onTouchStart={handleTouchScrub}
                onTouchMove={handleTouchScrub}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video scrubber"
                  className="absolute inset-0 w-full h-7 opacity-0 z-20 cursor-pointer touch-manipulation"
                />
                <div className="w-full h-1.5 sm:h-2 group-hover/scrubber:h-2.5 bg-slate-700/60 rounded-full overflow-hidden transition-all relative">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-slate-500/40 transition-all"
                    style={{ width: `${bufferPercent}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-teal-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div
                  className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 bg-teal-400 rounded-full shadow-md -translate-x-1/2 pointer-events-none group-hover/scrubber:scale-125 transition-transform"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Controls Bottom Row: Optimized for 320px–430px up to desktop */}
              <div className="flex items-center justify-between text-white text-xs gap-1">
                {/* Left Controls: Play/Pause, Rewind, Forward, Time */}
                <div className="flex items-center gap-0.5 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all touch-manipulation cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => skipTime(-10)}
                    aria-label="Replay 10 seconds"
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1 rounded-lg hover:bg-white/10 active:scale-95 transition-all touch-manipulation cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => skipTime(10)}
                    aria-label="Forward 10 seconds"
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1 rounded-lg hover:bg-white/10 active:scale-95 transition-all touch-manipulation cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <div className="text-slate-300 font-mono text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap ml-0.5 sm:ml-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-slate-500 mx-0.5">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Right Controls: Aspect Ratio, Volume, Speed, Fullscreen */}
                <div className="flex items-center gap-0.5 sm:gap-1.5 relative">
                  {/* Aspect Ratio Switcher on Bottom Bar */}
                  <button
                    type="button"
                    onClick={cycleAspectMode}
                    aria-label="Cycle aspect ratio"
                    title={`Current aspect ratio: ${aspectMode.toUpperCase()}`}
                    className="min-h-[38px] px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors font-mono text-[10px] text-emerald-400 active:scale-95 touch-manipulation flex items-center gap-1 cursor-pointer"
                  >
                    <Scaling className="w-3 h-3" />
                    <span className="hidden sm:inline uppercase">{aspectMode}</span>
                  </button>

                  {/* Volume Toggle & Slider */}
                  <div className="flex items-center gap-1 group/vol">
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all touch-manipulation cursor-pointer"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      aria-label="Volume slider"
                      className="hidden md:block w-14 lg:w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 opacity-80 group-hover/vol:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Playback Speed Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                      className="min-h-[38px] px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors font-mono text-[10px] sm:text-[11px] text-slate-200 active:scale-95 touch-manipulation cursor-pointer"
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
                            className={`px-2 py-1 rounded text-left text-[11px] font-mono transition-colors cursor-pointer ${
                              playbackRate === s ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all touch-manipulation cursor-pointer"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4">
        {/* Header: Speaker, Title & Action Badges */}
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
              <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs leading-relaxed">
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

      {/* Stream Info & Hosting Guide Modal */}
      {showStreamInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setShowStreamInfoModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isUr ? 'ویڈیو سٹریمنگ و ڈرائیو رہنمائی' : 'Video Streaming & Hosting Guide'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowStreamInfoModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/60">
                <p className="font-semibold text-teal-300 mb-1">
                  {isUr ? '1. ایچ ٹی ایم ایل 5 سٹریمنگ موڈ' : '1. Native HTML5 Video Player'}
                </p>
                <p>
                  {isUr
                    ? 'یہ پلیئر براہ راست رینج سٹریمنگ کے ذریعے ویڈیو چلاتا ہے جس میں گوگل کوکیز یا سائن ان کا کوئی تقاضا نہیں ہوتا۔'
                    : 'Streams native MP4 video directly via byte-range requests with zero Google cookie or sign-in prompts.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <p className="font-semibold text-slate-200 mb-1">
                  {isUr ? '2. گوگل ڈرائیو پرمیشن کا تقاضا' : '2. Google Drive Permissions'}
                </p>
                <p>
                  {isUr
                    ? 'گوگل ڈرائیو فولڈر کی پرمیشن "Anyone with the link can view" ہونی چاہیے تاکہ براؤزر بیرونی تصدیق کے بغیر ویڈیو ڈیٹا حاصل کر سکے۔'
                    : 'The Google Drive folder must have general access set to "Anyone with the link can view" for direct playback.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <p className="font-semibold text-slate-200 mb-1">
                  {isUr ? '3. 100% مفت متبادل پلیٹ فارمز' : '3. 100% Free Hosting Alternatives'}
                </p>
                <p>
                  {isUr
                    ? 'اگر آپ گٹ ہب پیجز پر بغیر کسی سرور کے ویڈیوز چلانا چاہتے ہیں تو گٹ ہب ریلیز (GitHub Releases) یا کلاؤڈ فلیر آر ٹو (Cloudflare R2 Free Tier) کے ذریعے براہ راست MP4 لنکس حاصل کر سکتے ہیں۔'
                    : 'For zero-cost static hosting on GitHub Pages, upload MP4s to GitHub Releases (2 GB free per file) or Cloudflare R2 Free Tier.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStreamInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs"
              >
                {isUr ? 'سمجھ گیا' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
