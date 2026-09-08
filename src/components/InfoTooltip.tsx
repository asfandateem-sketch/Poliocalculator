import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Info, X, Calculator } from 'lucide-react';

export interface InfoTooltipProps {
  label?: string;
  formula?: string;
  explanation?: string;
  fieldRule?: string;
  id?: string;
  isUrdu?: boolean;
  htmlFor?: string;
  data?: {
    label: string;
    formula?: string;
    explanation: string;
    fieldRule?: string;
  };
}

export const InfoTooltip: React.FC<InfoTooltipProps> = React.memo((props) => {
  const label = props.data ? props.data.label : props.label || '';
  const formula = props.data ? props.data.formula : props.formula;
  const explanation = props.data ? props.data.explanation : props.explanation || '';
  const fieldRule = props.data ? props.data.fieldRule : props.fieldRule;
  const { id, isUrdu = false, htmlFor } = props;

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

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex flex-col">
      <div className="flex items-center gap-1.5 flex-wrap">
        {label && (
          htmlFor ? (
            <label htmlFor={htmlFor} className="font-bold text-slate-800 text-xs cursor-pointer select-none">
              {label}
            </label>
          ) : (
            <span className="font-bold text-slate-800 text-xs">{label}</span>
          )
        )}
        <button
          id={id ? `info-btn-${id}` : undefined}
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={`View formula and logic for ${label}`}
          title={isUrdu ? 'فارمولا اور حسابی اصول دیکھیں' : 'Click to view calculation formula and logic'}
          className={`w-5 h-5 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center flex-shrink-0 focus:outline-none ${
            isOpen
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-400 hover:text-teal-700 hover:bg-teal-50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expandable Explanation Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute z-40 top-full mt-1.5 w-76 max-w-[calc(100vw-32px)] p-3.5 bg-slate-900 text-slate-100 text-left ltr:left-0 rtl:right-0 rounded-xl border border-slate-700 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-700/80 mb-2.5">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
              <Calculator className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>{isUrdu ? 'حسابی اصول و فارمولا' : 'Calculation Logic & Rule'}</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
              aria-label={isUrdu ? 'بند کریں' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Formula badge */}
          {formula && (
            <div className="mb-2.5">
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                {isUrdu ? 'فارمولا:' : 'Formula:'}
              </span>
              <div
                dir="ltr"
                className="font-mono text-xs font-bold bg-slate-800/80 text-teal-300 px-2.5 py-1.5 rounded-md border border-slate-700/60 break-all select-all"
              >
                {formula}
              </div>
            </div>
          )}

          {/* Field Rule note if applicable */}
          {fieldRule && (
            <div className="mb-2 inline-block text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-md">
              {fieldRule}
            </div>
          )}

          {/* Explanation text */}
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {explanation}
          </p>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
            <span>{isUrdu ? 'فیلڈ اسٹاف رہنمائی' : 'Field Staff Guidance'}</span>
            <button
              type="button"
              onClick={handleClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors"
            >
              {isUrdu ? 'ٹھیک ہے' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
