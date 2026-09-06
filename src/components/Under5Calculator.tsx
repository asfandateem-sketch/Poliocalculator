import React, { useState } from 'react';
import { Users, RotateCcw } from 'lucide-react';
import { calculateUnder5Children } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const Under5Calculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.under5Population;

  const [totalPop, setTotalPop] = useState<string>('50000');
  const [under5Pct, setUnder5Pct] = useState<string>('15');
  const [result, setResult] = useState<number | null>(7500);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const pop = Number(totalPop.replace(/,/g, ''));
    const pct = Number(under5Pct);

    if (isNaN(pop) || pop <= 0) {
      setError(isUrdu ? 'براہ کرم درست کل آبادی درج کریں (> 0)' : 'Please enter a valid total population (> 0)');
      return;
    }
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setError(isUrdu ? 'شرح 0 سے 100 فیصد کے درمیان ہونی چاہیے' : 'Percentage must be between 0 and 100');
      return;
    }

    try {
      const res = calculateUnder5Children({ method: 'population', totalPopulation: pop, under5Percentage: pct });
      setResult(res.under5Children);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
    }
  };

  const handleReset = () => {
    setTotalPop('');
    setUnder5Pct('15');
    setResult(null);
    setError('');
  };

  return (
    <div className={`saas-card p-5 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              09
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
                    id="u5-pop"
                    label={strings.totalPopLabel}
                    formula={strings.totalPopTooltip.formula}
                    fieldRule={strings.totalPopTooltip.fieldRule}
                    explanation={strings.totalPopTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                </div>
                <input
                  id="u5-pop-input"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 50000"
                  value={totalPop}
                  onChange={(e) => {
                    setTotalPop(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="mb-1.5">
                  <InfoTooltip
                    id="u5-pct"
                    label={strings.under5PctLabel}
                    formula={strings.under5PctTooltip.formula}
                    fieldRule={strings.under5PctTooltip.fieldRule}
                    explanation={strings.under5PctTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                </div>
                <div className="relative">
                  <input
                    id="u5-pct-input"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="15"
                    value={under5Pct}
                    onChange={(e) => {
                      setUnder5Pct(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && calculate()}
                    className="saas-input w-full pl-3.5 pr-8"
                  />
                  <span className="absolute right-3 top-3 text-xs text-slate-500 font-bold pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="u5-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="u5-reset-btn"
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
            <div className="saas-result-card p-4 sm:p-5 flex flex-col justify-between h-full min-h-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    {strings.estimatedTargetLabel}
                  </span>
                  <span className="text-[10px] text-teal-300 font-semibold" dir="ltr">
                    {under5Pct ? `${under5Pct}% Demographic` : 'Cohort'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      {result !== null ? result.toLocaleString() : '—'}
                    </span>
                    <span className="text-xs font-semibold text-teal-300">
                      {isUrdu ? 'بچے (عمر 5 سال سے کم)' : 'children < 5 yrs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] mb-0.5">{strings.basePopLabel}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs sm:text-sm">
                    {totalPop ? `${Number(totalPop).toLocaleString()} ${isUrdu ? 'افراد' : 'persons'}` : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] mb-0.5">{strings.vialsRequiredLabel}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs sm:text-sm">
                    {result !== null ? `${Math.ceil(result / 20).toLocaleString()} ${isUrdu ? 'وائلز' : 'vials'}` : '—'}
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
