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

  const [totalTarget, setTotalTarget] = useState<string>('5000');
  const [reportedNA, setReportedNA] = useState<string>('100');
  const [coveredNA, setCoveredNA] = useState<string>('80');
  const [result, setResult] = useState<{
    totalTarget: number;
    reportedNA: number;
    coveredNA: number;
    stillNA: number;
    stillNaPercent: number;
    recoveryRatePercent: number;
  } | null>(() => ({
    totalTarget: 5000,
    reportedNA: 100,
    coveredNA: 80,
    stillNA: 20,
    stillNaPercent: 0.4,
    recoveryRatePercent: 80.0,
  }));
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const target = Number(totalTarget.replace(/,/g, ''));
    const rep = Number(reportedNA.replace(/,/g, ''));
    const cov = Number(coveredNA.replace(/,/g, ''));

    if (isNaN(target) || target <= 0) {
      setError(isUrdu ? 'براہ کرم درست ہدف درج کریں (> 0)' : 'Please enter valid total target (> 0)');
      triggerError();
      return;
    }
    if (isNaN(rep) || rep < 0) {
      setError(isUrdu ? 'براہ کرم درست ریکارڈ شدہ NA بچے درج کریں (≥ 0)' : 'Please enter valid recorded NA children (≥ 0)');
      triggerError();
      return;
    }
    if (isNaN(cov) || cov < 0) {
      setError(isUrdu ? 'براہ کرم درست ویکسین شدہ NA بچے درج کریں (≥ 0)' : 'Please enter valid vaccinated NA children (≥ 0)');
      triggerError();
      return;
    }
    if (cov > rep) {
      setError(isUrdu ? 'ویکسین شدہ بچے ریکارڈ شدہ NA سے زیادہ نہیں ہو سکتے' : 'Vaccinated NA cannot exceed Recorded NA');
      triggerError();
      return;
    }

    try {
      const still = rep - cov;
      const stillPct = Number(((still / target) * 100).toFixed(2));
      const recPct = rep > 0 ? Number(((cov / rep) * 100).toFixed(1)) : 100;
      setResult({
        totalTarget: target,
        reportedNA: rep,
        coveredNA: cov,
        stillNA: still,
        stillNaPercent: stillPct,
        recoveryRatePercent: recPct,
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
            <div className="space-y-3">
              <div>
                <label htmlFor="na-target-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isUrdu ? 'کل ہدف بچے (Total Target)' : 'Total Target Children'}
                </label>
                <input
                  id="na-target-input"
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
                    <label htmlFor="na-reported-input" className="block text-xs font-semibold text-slate-700">
                      {isUrdu ? 'ریکارڈ شدہ NA بچے' : 'NA Children Recorded'}
                    </label>
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
                    <label htmlFor="na-covered-input" className="block text-xs font-semibold text-slate-700">
                      {isUrdu ? 'ویکسین شدہ NA بچے' : 'NA Vaccinated on Catch-up'}
                    </label>
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
                    <UserX className="w-3.5 h-3.5 text-teal-400" />
                    {isUrdu ? 'تاحال NA شرح (Still NA %)' : 'Still NA Coverage'}
                  </span>
                  {result !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        result.stillNaPercent <= 2 ? 'badge-optimal' : 'badge-warning'
                      }`}
                    >
                      {result.stillNaPercent <= 2
                        ? (isUrdu ? 'بہترین (≤2%)' : 'Optimal (≤2%)')
                        : (isUrdu ? 'انتباہ (>2%)' : 'Warning (>2%)')}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span
                      key={`na-pct-${calculationKey}`}
                      dir="ltr"
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isCalculated ? 'animate-number-pop' : ''
                      } ${
                        result === null
                          ? 'text-slate-400'
                          : result.stillNaPercent <= 2
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result !== null ? `${result.stillNaPercent}%` : '—'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                      {isUrdu ? 'ہدف کا فیصد' : '% of target'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {isUrdu ? 'باقی ماندہ NA' : 'Still NA Count'}
                    </span>
                    <span
                      className={`font-mono font-bold text-lg ${
                        result && result.stillNA > 0 ? 'text-amber-300' : 'text-emerald-300'
                      }`}
                    >
                      {result !== null ? result.stillNA.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ریکارڈ NA' : 'Recorded'}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.reportedNA.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ویکسین شدہ' : 'Vaccinated'}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.coveredNA.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ریکوری شرح' : 'Recovery'}</span>
                  <span className="font-mono text-teal-300 font-bold text-xs">
                    {result !== null ? `${result.recoveryRatePercent}%` : '—'}
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
