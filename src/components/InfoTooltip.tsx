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

      {/* Expandable Explanation Popover & Mobile Unclipped Card */}
      {isOpen && (
        <>
          {/* Mobile Backdrop to prevent clipping and guarantee dismiss on mobile */}
          <div
            className="sm:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-label={label}
            className={`z-50 p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
              isUrdu ? 'font-arabic text-right' : 'text-left'
            } fixed left-3 right-3 bottom-20 max-h-[75vh] overflow-y-auto sm:overflow-visible sm:absolute sm:inset-auto sm:top-full sm:mt-2 sm:w-84 sm:max-w-sm ${
              isUrdu ? 'sm:right-0 sm:left-auto' : 'sm:left-0 sm:right-auto'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-slate-700/80 mb-2.5">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs sm:text-sm">
                <Calculator className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{isUrdu ? 'حسابی اصول و فارمولا' : 'Calculation Logic & Rule'}</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                aria-label={isUrdu ? 'بند کریں' : 'Close'}
              >
                <X className="w-4 h-4" />
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
                  className="font-mono text-xs font-bold bg-slate-800/80 text-teal-300 px-3 py-2 rounded-lg border border-slate-700/60 break-all select-all text-left"
                >
                  {formula}
                </div>
              </div>
            )}

            {/* Field Rule note if applicable */}
            {fieldRule && (
              <div className="mb-2.5 inline-block text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2.5 py-1 rounded-lg break-words max-w-full">
                {fieldRule}
              </div>
            )}

            {/* Explanation text */}
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal break-words">
              {explanation}
            </p>

            {/* Footer */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center gap-2">
              <span className="truncate">{isUrdu ? 'فیلڈ اسٹاف رہنمائی' : 'Field Staff Guidance'}</span>
              <button
                type="button"
                onClick={handleClose}
                className="bg-teal-800 hover:bg-teal-700 text-teal-100 text-xs px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors shrink-0"
              >
                {isUrdu ? 'ٹھیک ہے' : 'Got it'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
