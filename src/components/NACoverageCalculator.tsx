import React, { useState } from 'react';
import { UserX, RotateCcw } from 'lucide-react';
import { calculateNACoverage, NACoverageResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const NACoverageCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.naCoverage;

  const [reportedNA, setReportedNA] = useState<string>('100');
  const [coveredNA, setCoveredNA] = useState<string>('80');
  const [result, setResult] = useState<NACoverageResult | null>(() => {
    try {
      return calculateNACoverage(100, 80);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const rep = Number(reportedNA.replace(/,/g, ''));
    const cov = Number(coveredNA.replace(/,/g, ''));

    if (isNaN(rep) || rep < 0) {
      setError(isUrdu ? 'براہ کرم درست رپورٹ شدہ NA بچے درج کریں (≥ 0)' : 'Please enter valid reported NA children (≥ 0)');
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست کور شدہ NA بچے درج کریں (≥ 0)' : 'Please enter valid covered NA children (≥ 0)');
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'کور شدہ بچے رپورٹ شدہ NA سے زیادہ نہیں ہو سکتے' : 'Covered NA cannot exceed Reported NA');
      return;
    }

    try {
      const res = calculateNACoverage(rep, cov);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
    }
  };

  const handleReset = () => {
    setReportedNA('');
    setCoveredNA('');
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
                id="na-reported"
                label={strings.reportedNaLabel}
                formula={strings.reportedNaTooltip.formula}
                fieldRule={strings.reportedNaTooltip.fieldRule}
                explanation={strings.reportedNaTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="na-reported-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 100"
              value={reportedNA}
              onChange={(e) => {
                setReportedNA(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1">
              <InfoTooltip
                id="na-covered"
                label={strings.coveredNaLabel}
                formula={strings.coveredNaTooltip.formula}
                fieldRule={strings.coveredNaTooltip.fieldRule}
                explanation={strings.coveredNaTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="na-covered-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 80"
              value={coveredNA}
              onChange={(e) => {
                setCoveredNA(e.target.value);
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
            id="na-calc-btn"
            type="button"
            onClick={calculate}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="na-reset-btn"
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
            <UserX className="w-3.5 h-3.5 text-teal-400" />
            {strings.coverageRateLabel}
          </span>
          <span className="text-[10px] text-slate-400">{strings.recoveryRateBadge}</span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <span
            dir="ltr"
            className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              result === null || result.coveredNaPercent === null
                ? 'text-slate-300'
                : result.coveredNaPercent >= 80
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {result !== null
              ? result.coveredNaPercent !== null
                ? `${result.coveredNaPercent}%`
                : 'N/A'
              : '—'}
          </span>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">{strings.remainingNaLabel} </span>
            <span
              className={`font-mono font-bold text-xs ${
                result && result.naRemaining > 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {result !== null ? result.naRemaining.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">{strings.reportedNaResult}</span>
            <span className="font-mono text-slate-200 font-bold text-[11px]">
              {result !== null ? result.reportedNA.toLocaleString() : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{strings.coveredNaResult}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {result !== null ? result.coveredNA.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
