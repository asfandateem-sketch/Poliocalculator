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
    <div className={`clay-card flex flex-col justify-between p-4 sm:p-5 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="clay-num-badge w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0">
              {strings.num}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {strings.title}
            </h2>
          </div>
          <span className="clay-badge text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1 rounded-xl flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {strings.purpose}
        </p>

        {/* Inputs: responsive layout with tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <div>
            <div className="mb-1.5">
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
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1.5">
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
              placeholder="e.g. 85"
              value={coveredNA}
              onChange={(e) => {
                setCoveredNA(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 mb-2 font-bold">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            id="na-calc-btn"
            type="button"
            onClick={calculate}
            className="clay-btn-teal h-11 flex-1 px-4 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="na-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="clay-btn-light h-11 w-11 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Box - Clay Dark Box */}
      <div className="clay-dark-box p-3.5 sm:p-4 text-white">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-bold">
            <UserX className="w-3.5 h-3.5 text-teal-400" />
            {strings.coverageRateLabel}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{strings.recoveryRateBadge}</span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span
            dir="ltr"
            className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              result === null || result.coveredNaPercent === null
                ? 'text-slate-400'
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
            <span className="text-[11px] text-slate-400 font-medium">{strings.remainingNaLabel} </span>
            <span
              className={`font-mono font-extrabold text-xs ${
                result && result.naRemaining > 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {result !== null ? result.naRemaining.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="clay-dark-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>
            <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedNaResult}</span>
            <span className="font-mono text-slate-200 font-extrabold text-xs">
              {result !== null ? result.reportedNA.toLocaleString() : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredNaResult}</span>
            <span className="font-mono text-emerald-300 font-extrabold text-xs">
              {result !== null ? result.coveredNA.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
