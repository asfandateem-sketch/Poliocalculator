import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  tagline?: boolean;
  className?: string;
  isUrdu?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  tagline = true,
  className = '',
  isUrdu = false,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Precision 2026 Liquid Glass Brand Emblem */}
      <div
        className={`${iconDimensions} rounded-2xl bg-gradient-to-b from-teal-500 via-teal-700 to-teal-950 text-white flex items-center justify-center shadow-md shadow-teal-950/20 border border-teal-300/40 flex-shrink-0 relative overflow-hidden`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none" />
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full p-1 relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Crest */}
          <path
            d="M 256 70 C 336 70 390 100 390 100 L 390 252 C 390 350 292 410 256 435 C 220 410 122 350 122 252 L 122 100 C 122 100 176 70 256 70 Z"
            fill="#0d9488"
            stroke="#5eead4"
            strokeWidth="12"
          />
          {/* Two Drops Motif */}
          <path
            d="M 226 210 C 226 175 246 150 246 150 C 246 150 266 175 266 210 C 266 230 248 244 246 244 C 244 244 226 230 226 210 Z"
            fill="#a7f3d0"
          />
          <path
            d="M 252 235 C 252 195 276 168 276 168 C 276 168 300 195 300 235 C 300 260 279 276 276 276 C 273 276 252 260 252 235 Z"
            fill="#34d399"
            opacity="0.95"
          />
          {/* Caliper / Measurement Grid Accents */}
          <line x1="210" y1="320" x2="302" y2="320" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <line x1="230" y1="305" x2="230" y2="320" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <line x1="256" y1="298" x2="256" y2="320" stroke="#5eead4" strokeWidth="10" strokeLinecap="round" />
          <line x1="282" y1="305" x2="282" y2="320" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="256" cy="355" r="16" fill="#0f766e" stroke="#ffffff" strokeWidth="6" />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-snug truncate">
              {isUrdu ? 'پولیو فیلڈ ٹولز' : 'Polio Field Tools'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-teal-900 bg-teal-500/10 border border-teal-500/20 rounded-full backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isUrdu ? '2026 ایڈیشن' : '2026 Edition'}
            </span>
          </div>
          {tagline && (
            <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal truncate">
              {isUrdu
                ? 'پولیو مہم ورکرز کے لیے عملی اوزار اور رہنمائی'
                : 'Practical tools and resources for polio campaign workers'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
