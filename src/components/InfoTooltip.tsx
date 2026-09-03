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
      <div className="flex items-center gap-1.5">
        <span className="truncate">{label}</span>
        <button
          id={id ? `info-btn-${id}` : undefined}
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={`View formula and logic for ${label}`}
          title={isUrdu ? 'فارمولا اور حسابی اصول دیکھیں' : 'Click to view calculation formula and logic'}
          className={`p-0.5 rounded-full transition-all duration-150 cursor-pointer flex-shrink-0 focus:outline-hidden focus:ring-2 focus:ring-teal-500/40 ${
            isOpen
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'
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
          className="absolute z-30 top-full mt-1.5 w-64 sm:w-72 p-2.5 bg-slate-900 text-slate-100 rounded-xl shadow-xl border border-slate-700/80 text-left ltr:left-0 rtl:right-0 animate-in fade-in zoom-in-95 duration-150"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-800 mb-2">
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
            <div className="mb-2">
              <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">
                {isUrdu ? 'فارمولا:' : 'Formula:'}
              </span>
              <div
                dir="ltr"
                className="font-mono text-[11px] font-bold bg-slate-800/90 text-teal-300 px-2 py-1 rounded-md border border-slate-700/60 break-all select-all"
              >
                {formula}
              </div>
            </div>
          )}

          {/* Field Rule note if applicable */}
          {fieldRule && (
            <div className="mb-1.5 inline-block text-[10px] font-semibold text-amber-300 bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.5 rounded">
              {fieldRule}
            </div>
          )}

          {/* Explanation text */}
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {explanation}
          </p>

          {/* Close hint */}
          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
            <span>{isUrdu ? 'نئے فیلڈ اسٹاف کی رہنمائی' : 'Guidance for Field Staff'}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-teal-400 hover:underline font-semibold cursor-pointer"
            >
              {isUrdu ? 'سمجھ آگیا (بند کریں)' : 'Got it (Close)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
