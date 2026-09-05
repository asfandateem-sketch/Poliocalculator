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
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1.5">
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
            id="refusal-calc-btn"
            type="button"
            onClick={calculate}
            className="clay-btn-teal h-11 flex-1 px-4 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="refusal-reset-btn"
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
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            {strings.coverageRateLabel}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{strings.resolutionRateBadge}</span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span
            dir="ltr"
            className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              result === null || result.refusalCoveragePercent === null
                ? 'text-slate-400'
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
            <span className="text-[11px] text-slate-400 font-medium">{strings.remainingRefusalLabel} </span>
            <span
              className={`font-mono font-extrabold text-xs ${
                result && result.remainingRefusals > 0 ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              {result !== null ? result.remainingRefusals.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="clay-dark-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>
            <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedRefusalResult}</span>
            <span className="font-mono text-slate-200 font-extrabold text-xs">
              {result !== null ? result.reportedRefusals.toLocaleString() : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredRefusalResult}</span>
            <span className="font-mono text-emerald-300 font-extrabold text-xs">
              {result !== null ? result.coveredRefusals.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
