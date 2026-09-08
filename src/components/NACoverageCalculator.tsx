import React, { useState, useCallback } from 'react';
import { UserCheck, RotateCcw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const NACoverageCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.naCoverage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const [reportedNA, setReportedNA] = useState<string>('100');
  const [coveredNA, setCoveredNA] = useState<string>('80');
  const [result, setResult] = useState<{
    reportedNA: number;
    coveredNA: number;
    remainingNA: number;
    coverageRate: number;
  } | null>(() => ({
    reportedNA: 100,
    coveredNA: 80,
    remainingNA: 20,
    coverageRate: 80.0,
  }));
  const [error, setError] = useState<string>('');

  const calculate = useCallback(() => {
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
      setError(
        isUrdu
          ? `کور شدہ بچے (${cov}) رپورٹ شدہ NA بچوں (${rep}) سے زیادہ نہیں ہو سکتے`
          : `Covered NA children (${cov}) cannot exceed reported NA children (${rep})`
      );
      triggerError();
      return;
    }

    try {
      const remaining = rep - cov;
      const rate = rep > 0 ? Number(((cov / rep) * 100).toFixed(1)) : 100;
      setResult({
        reportedNA: rep,
        coveredNA: cov,
        remainingNA: remaining,
        coverageRate: rate,
      });
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
      triggerError();
    }
  }, [reportedNA, coveredNA, isUrdu, triggerError, triggerFeedback]);

  const handleReportedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReportedNA(e.target.value);
    setError('');
  }, []);

  const handleCoveredChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCoveredNA(e.target.value);
    setError('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  const handleReset = useCallback(() => {
    setReportedNA('');
    setCoveredNA('');
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
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="na-reported-tooltip"
                    htmlFor="na-reported-input"
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
                  aria-label={strings.reportedNaLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 100"
                  value={reportedNA}
                  onChange={handleReportedChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="na-covered-tooltip"
                    htmlFor="na-covered-input"
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
                  aria-label={strings.coveredNaLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 80"
                  value={coveredNA}
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
                id="na-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="na-reset-btn"
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
                    {strings.recoveryRateBadge}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      key={`na-rate-${calculationKey}`}
                      dir="ltr"
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400 ${
                        isCalculated ? 'animate-number-pop' : ''
                      }`}
                    >
                      {result !== null ? `${result.coverageRate}%` : '—'}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {isUrdu ? 'ریکوری شرح' : 'Recovery Rate'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-amber-300 font-bold block">
                      {strings.remainingNaLabel} {result !== null ? result.remainingNA.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.reportedNaResult}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedNA.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.coveredNaResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredNA.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'باقی ماندہ' : 'Remaining'}</span>
                  <span className="font-mono text-amber-300 font-bold text-xs">
                    {result !== null ? result.remainingNA.toLocaleString() : '—'}
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
