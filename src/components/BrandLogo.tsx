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
      {/* Precision Brand Icon */}
      <div
        className={`${iconDimensions} rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs border border-teal-700/50 flex-shrink-0 relative overflow-hidden`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Crest */}
          <path
            d="M 256 70 C 336 70 390 100 390 100 L 390 252 C 390 350 292 410 256 435 C 220 410 122 350 122 252 L 122 100 C 122 100 176 70 256 70 Z"
            fill="#0f766e"
            stroke="#5eead4"
            strokeWidth="12"
          />
          {/* Two Drops Motif */}
          <path
            d="M 226 210 C 226 175 246 150 246 150 C 246 150 266 175 266 210 C 266 230 248 244 246 244 C 244 244 226 230 226 210 Z"
            fill="#5eead4"
          />
          <path
            d="M 252 235 C 252 195 276 168 276 168 C 276 168 300 195 300 235 C 300 260 279 276 276 276 C 273 276 252 260 252 235 Z"
            fill="#2dd4bf"
            opacity="0.9"
          />
          {/* Caliper / Measurement Grid Accents */}
          <line x1="210" y1="320" x2="302" y2="320" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <line x1="230" y1="305" x2="230" y2="320" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <line x1="256" y1="298" x2="256" y2="320" stroke="#5eead4" strokeWidth="10" strokeLinecap="round" />
          <line x1="282" y1="305" x2="282" y2="320" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="256" cy="355" r="16" fill="#0d9488" stroke="#ffffff" strokeWidth="6" />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-snug truncate">
              {isUrdu ? 'پولیو فیلڈ ٹولز' : 'Polio Field Tools'}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 rounded-md">
              {isUrdu ? 'فیلڈ ریسورسز' : 'Field Hub'}
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
