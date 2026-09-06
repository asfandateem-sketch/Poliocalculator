import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateRefusal, RefusalResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const RefusalCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.refusalCoverage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

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
      triggerError();
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست حل شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid covered/resolved refusals (≥ 0)');
      triggerError();
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'حل شدہ انکاری رپورٹ شدہ انکاری کیسز سے زیادہ نہیں ہو سکتے' : 'Covered refusals cannot exceed Reported Refusals');
      triggerError();
      return;
    }

    try {
      const calculation = calculateRefusal(rep, cov);
      setResult(calculation);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
      triggerError();
    }
  };

  const handleReset = () => {
    setReportedRefusals('');
    setCoveredRefusals('');
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
              05
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
                  className="saas-input w-full px-3.5"
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
                id="refusal-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="refusal-reset-btn"
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
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    {strings.coverageRateLabel}
                  </span>
                  {isCalculated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                      ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">{strings.resolutionRateBadge}</span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span
                    key={`refusal-pct-${calculationKey}`}
                    dir="ltr"
                    className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                      isCalculated ? 'animate-number-pop' : ''
                    } ${
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
                      className={`font-mono font-bold text-xs ${
                        result && result.remainingRefusals > 0 ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {result !== null ? result.remainingRefusals.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedRefusalResult}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedRefusals.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredRefusalResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredRefusals.toLocaleString() : '—'}
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
