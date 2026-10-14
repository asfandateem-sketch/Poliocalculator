import React from 'react';
import { Video, ExternalLink, HardDrive, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface UpdateVideoPlayerProps {
  videoUrl: string;
  title?: string;
  sourceName?: string;
}

export const UpdateVideoPlayer: React.FC<UpdateVideoPlayerProps> = ({
  videoUrl,
  title,
  sourceName,
}) => {
  const { isUrdu } = useLanguage();
  if (!videoUrl) return null;

  const url = videoUrl.trim();

  // 1. Google Drive In-App Video Embed (Plays directly on the website with zero errors)
  const driveMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    url.match(/open\?id=([a-zA-Z0-9_-]+)/);

  if (url.includes('drive.google.com') || (driveMatch && driveMatch[1])) {
    const fileId = driveMatch ? driveMatch[1] : '';
    const previewUrl = fileId
      ? `https://drive.google.com/file/d/${fileId}/preview`
      : url.replace(/\/view(\?.*)?$/, '/preview');

    return (
      <div className="space-y-2 select-none">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200/90 shadow-md">
          <iframe
            src={previewUrl}
            title={title || 'Official Google Drive Campaign Video'}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 flex-wrap gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {isUrdu
                ? 'گوگل ڈرائیو ویڈیو — براہ راست ویب سائٹ پر پلے بیک'
                : 'Google Drive Video — Playing directly on website'}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {sourceName || 'Polio Official Drive'}
          </span>
        </div>
      </div>
    );
  }

  // 2. YouTube embed detection
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return (
      <div className="space-y-2 select-none">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200/90 shadow-sm">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
            title={title || 'Polio Campaign Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1 font-semibold text-teal-800">
            <Video className="w-3.5 h-3.5 text-teal-600" />
            <span>{isUrdu ? 'ویڈیو پلیئر (YouTube)' : 'Video Player (YouTube)'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {sourceName || 'Verified Media'}
          </span>
        </div>
      </div>
    );
  }

  // 3. Facebook Video Embed
  if (url.includes('facebook.com') && (url.includes('/videos/') || url.includes('/watch') || url.includes('fb.watch'))) {
    const fbEmbedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false&width=560`;

    return (
      <div className="space-y-2 select-none">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-sm flex items-center justify-center">
          <iframe
            src={fbEmbedSrc}
            title={title || 'Official Facebook Video'}
            style={{ border: 'none', overflow: 'hidden' }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1 font-semibold text-blue-700">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isUrdu
                ? `باضابطہ فیس بک ویڈیو (${sourceName || 'Facebook'})`
                : `Official Facebook Video (${sourceName || 'Facebook'})`}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {sourceName || 'Facebook Dispatch'}
          </span>
        </div>
      </div>
    );
  }

  // 4. Direct MP4 / WebM video
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return (
      <div className="space-y-2 select-none">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200/90 shadow-sm">
          <video
            src={url}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1 text-teal-800 font-semibold">
            <Video className="w-3.5 h-3.5 text-teal-600" />
            <span>{isUrdu ? 'براہ راست ویڈیو اسٹریم' : 'Direct Video Stream'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {sourceName || 'Official Media'}
          </span>
        </div>
      </div>
    );
  }

  // 5. Generic video link card
  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
          <Video className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">
            {isUrdu ? 'باضابطہ ویڈیو دیکھیں' : 'Watch Official Video Recording'}
          </h4>
          <p className="text-[11px] text-slate-400 truncate">
            {url}
          </p>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 flex-shrink-0 cursor-pointer"
      >
        <span>{isUrdu ? 'کھولیں' : 'Watch Video'}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
