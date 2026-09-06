import React, { useState } from 'react';
import { UserX, RotateCcw } from 'lucide-react';
import { calculateNACoverage, NACoverageResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const NACoverageCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.naCoverage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

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
      triggerError();
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست کور شدہ NA بچے درج کریں (≥ 0)' : 'Please enter valid covered NA children (≥ 0)');
      triggerError();
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'کور شدہ بچے رپورٹ شدہ NA سے زیادہ نہیں ہو سکتے' : 'Covered NA cannot exceed Reported NA');
      triggerError();
      return;
    }

    try {
      const res = calculateNACoverage(rep, cov);
      setResult(res);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
      triggerError();
    }
  };

  const handleReset = () => {
    setReportedNA('');
    setCoveredNA('');
    setResult(null);
    setError('');
    triggerReset();
  };

  return (
    <div className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              04
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                {strings.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {strings.purpose}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70 flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>

        {/* Content Layout: 2 Columns on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Inputs Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className="saas-input w-full px-3.5"
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
                  placeholder="e.g. 80"
                  value={coveredNA}
                  onChange={(e) => {
                    setCoveredNA(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold animate-error-shake">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="na-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="na-reset-btn"
                type="button"
                onClick={handleReset}
                title={strings.resetBtn}
                className="saas-btn-secondary px-3.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{strings.resetBtn}</span>
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-6">
            <div
              className={`saas-result-card p-4 sm:p-5 flex flex-col justify-between h-full min-h-[170px] transition-all duration-300 ${
                isCalculated
                  ? 'ring-2 ring-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.25)] animate-calculate-pulse'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <UserX className="w-3.5 h-3.5 text-teal-400" />
                    {strings.coverageRateLabel}
                  </span>
                  {isCalculated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                      ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">{strings.recoveryRateBadge}</span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span
                    key={`na-pct-${calculationKey}`}
                    dir="ltr"
                    className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                      isCalculated ? 'animate-number-pop' : ''
                    } ${
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
                      className={`font-mono font-bold text-xs ${
                        result && result.naRemaining > 0 ? 'text-amber-300' : 'text-emerald-300'
                      }`}
                    >
                      {result !== null ? result.naRemaining.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedNaResult}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedNA.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredNaResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredNA.toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
