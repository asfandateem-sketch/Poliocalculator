import React, { useState } from 'react';
import { Calculator, RotateCcw, Copy, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface CalculatorCardProps {
  id: string;
  number: string;
  title: string;
  purpose: string;
  isPrimary?: boolean;
  onCalculate: () => void;
  onReset: () => void;
  formula: string;
  formulaExplanation?: string;
  exampleText?: string;
  calculateLabel: string;
  resetLabel: string;
  copyLabel: string;
  copiedLabel: string;
  howCalculatedLabel: string;
  copyText?: string;
  children: React.ReactNode;
  resultView?: React.ReactNode;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  id,
  number,
  title,
  purpose,
  isPrimary = false,
  onCalculate,
  onReset,
  formula,
  formulaExplanation,
  exampleText,
  calculateLabel,
  resetLabel,
  copyLabel,
  copiedLabel,
  howCalculatedLabel,
  copyText,
  children,
  resultView,
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id={id}
      className={`scroll-mt-24 rounded-2xl transition-all duration-200 ${
        isPrimary
          ? 'bg-white border-2 border-teal-600 shadow-md shadow-teal-900/5 ring-1 ring-teal-500/20'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      {/* Card Header */}
      <div className={`p-4 sm:p-5 border-b ${isPrimary ? 'bg-teal-50/50 border-teal-100' : 'border-slate-100'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center justify-center font-mono text-sm font-bold w-9 h-9 rounded-xl ${
                isPrimary
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {number}
            </span>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isPrimary ? 'text-teal-950' : 'text-slate-900'}`}>
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                {purpose}
              </p>
            </div>
          </div>
          {isPrimary && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 whitespace-nowrap">
              Primary Tool
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Input Controls */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Action Buttons: Large Primary Calculate & Simple Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
          <button
            type="button"
            id={`${id}-calc-btn`}
            onClick={onCalculate}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.99] shadow-sm ${
              isPrimary
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>{calculateLabel}</span>
          </button>

          <button
            type="button"
            id={`${id}-reset-btn`}
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{resetLabel}</span>
          </button>
        </div>

        {/* Result Area */}
        {resultView && (
          <div className="pt-2">
            <div className="relative rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-inner overflow-hidden border border-slate-800">
              {/* Copy Result Button */}
              {copyText && (
                <button
                  type="button"
                  id={`${id}-copy-btn`}
                  onClick={handleCopy}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  title="Copy result"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">{copiedLabel}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copyLabel}</span>
                    </>
                  )}
                </button>
              )}

              {resultView}
            </div>
          </div>
        )}

        {/* How is this calculated? section */}
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            id={`${id}-toggle-formula`}
            onClick={() => setShowFormula(!showFormula)}
            className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 py-1 transition"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-600" />
              {howCalculatedLabel}
            </span>
            {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFormula && (
            <div className="mt-2.5 p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-0.5">
                  Formula:
                </span>
                <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-teal-900 block font-semibold text-xs leading-relaxed">
                  {formula}
                </code>
              </div>
              {formulaExplanation && (
                <p className="text-slate-600 leading-relaxed text-xs">
                  {formulaExplanation}
                </p>
              )}
              {exampleText && (
                <div className="pt-1 text-slate-500 italic text-[11px]">
                  {exampleText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
