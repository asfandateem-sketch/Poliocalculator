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

  const [totalTarget, setTotalTarget] = useState<string>('5000');
  const [reportedRefusals, setReportedRefusals] = useState<string>('50');
  const [coveredRefusals, setCoveredRefusals] = useState<string>('25');
  const [result, setResult] = useState<{
    totalTarget: number;
    reportedRefusals: number;
    coveredRefusals: number;
    remainingRefusals: number;
    conversionRatePercent: number;
    stillRefusalPercent: number;
  } | null>(() => ({
    totalTarget: 5000,
    reportedRefusals: 50,
    coveredRefusals: 25,
    remainingRefusals: 25,
    conversionRatePercent: 50.0,
    stillRefusalPercent: 0.5,
  }));
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const target = Number(totalTarget.replace(/,/g, ''));
    const rep = Number(reportedRefusals.replace(/,/g, ''));
    const cov = Number(coveredRefusals.replace(/,/g, ''));

    if (isNaN(target) || target <= 0) {
      setError(isUrdu ? 'براہ کرم درست ہدف درج کریں (> 0)' : 'Please enter valid total target (> 0)');
      triggerError();
      return;
    }
    if (isNaN(rep) || rep < 0) {
      setError(isUrdu ? 'براہ کرم درست ابتدائی انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid initial refusals (≥ 0)');
      triggerError();
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست حل شدہ/ویکسین شدہ انکاری کیسز درج کریں (≥ 0)' : 'Please enter valid vaccinated refusals (≥ 0)');
      triggerError();
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'ویکسین شدہ انکاری ابتدائی انکاری کیسز سے زیادہ نہیں ہو سکتے' : 'Vaccinated refusals cannot exceed Initial Refusals');
      triggerError();
      return;
    }

    try {
      const remaining = rep - cov;
      const convRate = rep > 0 ? Number(((cov / rep) * 100).toFixed(1)) : 100;
      const stillPct = Number(((remaining / target) * 100).toFixed(2));

      setResult({
        totalTarget: target,
        reportedRefusals: rep,
        coveredRefusals: cov,
        remainingRefusals: remaining,
        conversionRatePercent: convRate,
        stillRefusalPercent: stillPct,
      });
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
      triggerError();
    }
  };

  const handleReset = () => {
    setTotalTarget('');
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
            <div className="space-y-3">
              <div>
                <label htmlFor="ref-target-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isUrdu ? 'کل ہدف بچے (Total Target)' : 'Total Target Children'}
                </label>
                <input
                  id="ref-target-input"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="e.g. 5000"
                  value={totalTarget}
                  onChange={(e) => {
                    setTotalTarget(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="mb-1.5">
                    <label htmlFor="ref-reported-input" className="block text-xs font-semibold text-slate-700">
                      {isUrdu ? 'ابتدائی انکاری کیسز' : 'Initial Refusals'}
                    </label>
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
                    <label htmlFor="ref-covered-input" className="block text-xs font-semibold text-slate-700">
                      {isUrdu ? 'ویکسین شدہ انکاری' : 'Refusals Vaccinated'}
                    </label>
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
                    <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
                    {isUrdu ? 'کنورژن شرح (Conversion Rate)' : 'Refusal Conversion Rate'}
                  </span>
                  {result !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        result.stillRefusalPercent <= 0.5 ? 'badge-optimal' : 'badge-warning'
                      }`}
                    >
                      {result.stillRefusalPercent <= 0.5
                        ? (isUrdu ? 'بہترین (≤0.5% تاحال)' : 'Optimal (≤0.5% still)')
                        : (isUrdu ? 'انتباہ (>0.5% تاحال)' : 'Warning (>0.5% still)')}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span
                      key={`refusal-pct-${calculationKey}`}
                      dir="ltr"
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isCalculated ? 'animate-number-pop' : ''
                      } ${
                        result === null
                          ? 'text-slate-400'
                          : result.conversionRatePercent >= 50
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {result !== null ? `${result.conversionRatePercent}%` : '—'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                      {isUrdu ? 'کنورٹ شدہ انکاری' : 'conversion rate'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {isUrdu ? 'تاحال انکاری (% ہدف)' : 'Still Refusal % of Target'}
                    </span>
                    <span
                      dir="ltr"
                      className={`font-mono font-bold text-lg ${
                        result && result.stillRefusalPercent <= 0.5 ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {result !== null ? `${result.stillRefusalPercent}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ابتدائی' : 'Initial'}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedRefusals.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'حل شدہ' : 'Resolved'}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredRefusals.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'باقی انکاری' : 'Still Refusal'}</span>
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
};
