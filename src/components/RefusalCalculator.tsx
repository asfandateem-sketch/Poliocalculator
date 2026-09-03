import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateRefusal, RefusalResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const RefusalCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.refusalCoverage;

  const [reportedRefusals, setReportedRefusals] = useState<string>('50');
  const [coveredRefusals, setCoveredRefusals] = useState<string>('25');
  const [result, setResult] = useState<RefusalResult | null>(() => {
    try {
      return calculateRefusal(50, 25);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const rep = Number(reportedRefusals.replace(/,/g, ''));
    const cov = Number(coveredRefusals.replace(/,/g, ''));

    if (isNaN(rep) || rep < 0) {
      setError(isUrdu ? 'براہ کرم درست رپورٹ شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid reported refusals (≥ 0)');
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست حل شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid covered/resolved refusals (≥ 0)');
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'حل شدہ انکاری رپورٹ شدہ انکاری کیسز سے زیادہ نہیں ہو سکتے' : 'Covered refusals cannot exceed Reported Refusals');
      return;
    }

    try {
      const calculation = calculateRefusal(rep, cov);
      setResult(calculation);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
    }
  };

  const handleReset = () => {
    setReportedRefusals('');
    setCoveredRefusals('');
    setResult(null);
    setError('');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-200/60 shadow-2xs flex-shrink-0">
              {strings.num}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {strings.title}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5 leading-normal line-clamp-1">
          {strings.purpose}
        </p>

        {/* Inputs: 2-column layout with tooltips */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div>
            <div className="mb-1">
              <InfoTooltip
                id="ref-reported"
                label={strings.reportedRefusalLabel}
                formula={strings.reportedRefusalTooltip.formula}
                fieldRule={strings.reportedRefusalTooltip.fieldRule}
                explanation={strings.reportedRefusalTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="ref-reported-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 50"
              value={reportedRefusals}
              onChange={(e) => {
                setReportedRefusals(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1">
              <InfoTooltip
                id="ref-covered"
                label={strings.coveredRefusalLabel}
                formula={strings.coveredRefusalTooltip.formula}
                fieldRule={strings.coveredRefusalTooltip.fieldRule}
                explanation={strings.coveredRefusalTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="ref-covered-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 25"
              value={coveredRefusals}
              onChange={(e) => {
                setCoveredRefusals(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 mb-2 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            id="refusal-calc-btn"
            type="button"
            onClick={calculate}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="refusal-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="h-9 w-9 text-slate-400 hover:text-slate-700 active:scale-[0.95] border border-slate-200/90 rounded-xl hover:bg-slate-100 transition-all duration-150 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Result Box */}
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            {strings.coverageRateLabel}
          </span>
          <span className="text-[10px] text-slate-400">{strings.resolutionRateBadge}</span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <span
            dir="ltr"
            className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              result === null || result.refusalCoveragePercent === null
                ? 'text-slate-300'
                : result.refusalCoveragePercent >= 50
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {result !== null
              ? result.refusalCoveragePercent !== null
                ? `${result.refusalCoveragePercent}%`
                : 'N/A'
              : '—'}
          </span>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">{strings.remainingRefusalLabel} </span>
            <span
              className={`font-mono font-bold text-xs ${
                result && result.remainingRefusals > 0 ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              {result !== null ? result.remainingRefusals.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">{strings.reportedRefusalResult}</span>
            <span className="font-mono text-slate-200 font-bold text-[11px]">
              {result !== null ? result.reportedRefusals.toLocaleString() : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{strings.coveredRefusalResult}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {result !== null ? result.coveredRefusals.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
