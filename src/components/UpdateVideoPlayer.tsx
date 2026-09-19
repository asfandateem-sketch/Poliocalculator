import React from 'react';
import { Video, ExternalLink } from 'lucide-react';
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

  // YouTube embed detection
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200/90 shadow-sm">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
            title={title || 'Polio Campaign Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-teal-600" />
            <span>{isUrdu ? 'ویڈیو پلیئر (YouTube)' : 'Video Player (YouTube)'}</span>
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{isUrdu ? 'یوٹیوب پر دیکھیں ↗' : 'Open in YouTube ↗'}</span>
          </a>
        </div>
      </div>
    );
  }

  // Facebook Video Embed
  if (url.includes('facebook.com') && (url.includes('/videos/') || url.includes('/watch') || url.includes('fb.watch'))) {
    const fbEmbedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false&width=560`;

    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-sm flex items-center justify-center">
          <iframe
            src={fbEmbedSrc}
            title={title || 'Official Facebook Video'}
            style={{ border: 'none', overflow: 'hidden' }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isUrdu
                ? `باضابطہ فیس بک ویڈیو (${sourceName || 'Facebook'})`
                : `Official Facebook Video (${sourceName || 'Facebook'})`}
            </span>
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold transition text-xs border border-blue-200/60"
          >
            <span>{isUrdu ? 'فیس بک پر دیکھیں' : 'Watch on Facebook'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Direct MP4 / WebM video
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return (
      <div className="space-y-2">
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
      </div>
    );
  }

  // Generic video link card
  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
          <Video className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">
            {isUrdu ? 'باضابطہ ویڈیو دیکھیں' : 'Watch Official Video Recording'}
          </h4>
          <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
            {url}
          </p>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-1 flex-shrink-0 cursor-pointer"
      >
        <span>{isUrdu ? 'ویڈیو کھولیں' : 'Watch Video'}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
