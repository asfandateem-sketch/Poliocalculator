import React, { useState, useCallback } from 'react';
import { UserCheck, RotateCcw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const RefusalCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.refusalCoverage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const [reportedRefusals, setReportedRefusals] = useState<string>('50');
  const [coveredRefusals, setCoveredRefusals] = useState<string>('25');
  const [result, setResult] = useState<{
    reportedRefusals: number;
    coveredRefusals: number;
    remainingRefusals: number;
    conversionRate: number;
  } | null>(() => ({
    reportedRefusals: 50,
    coveredRefusals: 25,
    remainingRefusals: 25,
    conversionRate: 50.0,
  }));
  const [error, setError] = useState<string>('');

  const computeResult = useCallback((repStr: string, covStr: string, isExplicitSubmit = false) => {
    const trimmedRep = repStr.trim();
    const trimmedCov = covStr.trim();

    if (trimmedRep === '' || trimmedCov === '') {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم دونوں فیلڈز مکمل کریں' : 'Please enter both Reported and Covered Refusals');
        triggerError();
      } else {
        setError('');
      }
      return;
    }

    const rep = Number(trimmedRep.replace(/,/g, ''));
    const cov = Number(trimmedCov.replace(/,/g, ''));

    if (isNaN(rep) || rep < 0) {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم درست رپورٹ شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid reported refusals (≥ 0)');
        triggerError();
      }
      return;
    }
    if (isNaN(cov) || cov < 0) {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم درست حل شدہ/کور شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid covered refusals (≥ 0)');
        triggerError();
      }
      return;
    }
    if (cov > rep) {
      if (isExplicitSubmit) {
        setError(
          isUrdu
            ? `حل شدہ انکاری (${cov}) رپورٹ شدہ انکاری کیسز (${rep}) سے زیادہ نہیں ہو سکتے`
            : `Covered refusals (${cov}) cannot exceed reported refusals (${rep})`
        );
        triggerError();
      }
      return;
    }

    setError('');
    const remaining = rep - cov;
    const convRate = rep > 0 ? Number(((cov / rep) * 100).toFixed(1)) : 100;

    setResult({
      reportedRefusals: rep,
      coveredRefusals: cov,
      remainingRefusals: remaining,
      conversionRate: convRate,
    });
    if (isExplicitSubmit) {
      triggerFeedback('calculate');
    }
  }, [isUrdu, triggerError, triggerFeedback]);

  const calculate = useCallback(() => {
    computeResult(reportedRefusals, coveredRefusals, true);
  }, [computeResult, reportedRefusals, coveredRefusals]);

  const handleReportedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReportedRefusals(val);
    computeResult(val, coveredRefusals, false);
  }, [coveredRefusals, computeResult]);

  const handleCoveredChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoveredRefusals(val);
    computeResult(reportedRefusals, val, false);
  }, [reportedRefusals, computeResult]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  const handleReset = useCallback(() => {
    setReportedRefusals('');
    setCoveredRefusals('');
    setResult(null);
    setError('');
    triggerReset();
  }, [triggerReset]);

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
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="ref-reported-tooltip"
                    htmlFor="ref-reported-input"
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
                  aria-label={strings.reportedRefusalLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 50"
                  value={reportedRefusals}
                  onChange={handleReportedChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="ref-covered-tooltip"
                    htmlFor="ref-covered-input"
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
                  aria-label={strings.coveredRefusalLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 25"
                  value={coveredRefusals}
                  onChange={handleCoveredChange}
                  onKeyDown={handleKeyDown}
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
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="refusal-reset-btn"
                type="button"
                onClick={handleReset}
                title={strings.resetBtn}
                aria-label={strings.resetBtn}
                className="saas-btn-secondary px-4 min-h-[48px] min-w-[48px]"
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
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    {strings.coverageRateLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border badge-optimal">
                    {strings.resolutionRateBadge}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      key={`ref-pct-${calculationKey}`}
                      dir="ltr"
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isCalculated ? 'animate-number-pop' : ''
                      } ${
                        result === null
                          ? 'text-slate-400'
                          : result.conversionRate >= 50
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {result !== null ? `${result.conversionRate}%` : '—'}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {isUrdu ? 'حل شدہ شرح' : 'Resolution Rate'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-amber-300 font-bold block">
                      {strings.remainingRefusalLabel} {result !== null ? result.remainingRefusals.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedRefusalResult}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedRefusals.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredRefusalResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredRefusals.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'باقی انکاری' : 'Remaining'}</span>
                  <span className="font-mono text-rose-300 font-bold text-xs">
                    {result !== null ? result.remainingRefusals.toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
