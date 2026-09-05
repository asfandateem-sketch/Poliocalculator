import React, { useState, useRef, useEffect } from 'react';
import { Info, X, Calculator } from 'lucide-react';

export interface InfoTooltipProps {
  label: string;
  formula?: string;
  explanation: string;
  fieldRule?: string;
  id?: string;
  isUrdu?: boolean;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  label,
  formula,
  explanation,
  fieldRule,
  id,
  isUrdu = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click if open
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="relative inline-flex flex-col">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-extrabold text-slate-800 text-xs">{label}</span>
        <button
          id={id ? `info-btn-${id}` : undefined}
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={`View formula and logic for ${label}`}
          title={isUrdu ? 'فارمولا اور حسابی اصول دیکھیں' : 'Click to view calculation formula and logic'}
          className={`p-1 rounded-full transition-all duration-150 cursor-pointer flex-shrink-0 focus:outline-hidden ${
            isOpen
              ? 'clay-btn-teal text-white'
              : 'clay-badge bg-white text-slate-500 hover:text-teal-700'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expandable Explanation Popover/Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute z-30 top-full mt-2 w-72 max-w-[calc(100vw-32px)] p-3.5 clay-dark-box text-slate-100 text-left ltr:left-0 rtl:right-0 animate-in fade-in zoom-in-95 duration-150"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-700/80 mb-2.5">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
              <Calculator className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>{isUrdu ? 'حسابی اصول و فارمولا' : 'Calculation Logic & Rule'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
              aria-label={isUrdu ? 'بند کریں' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Formula badge */}
          {formula && (
            <div className="mb-2.5">
              <span className="text-[11px] text-slate-400 block mb-1 font-semibold">
                {isUrdu ? 'فارمولا:' : 'Formula:'}
              </span>
              <div
                dir="ltr"
                className="font-mono text-xs font-bold clay-dark-cell text-teal-300 px-2.5 py-1.5 break-all select-all"
              >
                {formula}
              </div>
            </div>
          )}

          {/* Field Rule note if applicable */}
          {fieldRule && (
            <div className="mb-2 inline-block text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-lg shadow-inner">
              {fieldRule}
            </div>
          )}

          {/* Explanation text */}
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {explanation}
          </p>

          {/* Close hint */}
          <div className="mt-3 pt-2 border-t border-slate-700/80 text-[10px] text-slate-400 flex justify-between items-center">
            <span>{isUrdu ? 'نئے فیلڈ اسٹاف کی رہنمائی' : 'Guidance for Field Staff'}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="clay-btn-light text-[10px] px-2.5 py-1 font-bold cursor-pointer"
            >
              {isUrdu ? 'ٹھیک ہے' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
