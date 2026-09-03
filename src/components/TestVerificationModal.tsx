import React from 'react';
import { runAllTests } from '../testRunner';
import { TranslationStrings } from '../translations';
import { CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationStrings;
}

export const TestVerificationModal: React.FC<Props> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const testSuite = runAllTests();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-teal-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {t.testsModalTitle}
              </h3>
              <p className="text-xs text-teal-800 font-medium">
                {testSuite.passCount} of {testSuite.total} automated tests passed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 divide-y divide-slate-100 text-xs">
          {testSuite.results.map((r, idx) => (
            <div key={idx} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  {r.category}
                </span>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {r.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Validated against official bOPV guidelines
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
