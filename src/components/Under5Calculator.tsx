import React, { useState } from 'react';
import { Users, RotateCcw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const Under5Calculator: React.FC<Props> = ({ compact = true }) => {
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

    if (isNaN(pop) || pop < 0) {
      setError(isUrdu ? 'براہ کرم درست کل آبادی درج کریں (≥ 0)' : 'Enter valid total population (≥ 0)');
      return;
    }
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError(isUrdu ? 'تناسب 0 سے 100 فیصد کے درمیان ہونا چاہیے' : 'Percentage must be between 0 and 100%');
      return;
    }

    const calculated = Math.round((pop * pct) / 100);
    setResult(calculated);
  };

  const handleReset = () => {
    setTotalPop('');
    setUnder5Pct('15');
    setResult(null);
    setError('');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-extrabold text-sm flex items-center justify-center border border-teal-200/80 shadow-2xs flex-shrink-0">
              {strings.num}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {strings.title}
            </h2>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {strings.purpose}
        </p>

        {/* Inputs with Info Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
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
              className="h-11 w-full px-3 text-sm sm:text-base font-mono font-bold bg-slate-50/90 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs text-slate-900 placeholder:text-slate-400"
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
                className="h-11 w-full pl-3 pr-7 text-sm sm:text-base font-mono font-bold bg-slate-50/90 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs text-slate-900 placeholder:text-slate-400"
              />
              <span className="absolute right-2.5 top-3 text-xs text-slate-500 font-bold pointer-events-none">
                %
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 mb-2 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-2.5">
          <button
            id="u5-calc-btn"
            type="button"
            onClick={calculate}
            className="h-11 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="u5-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="h-11 w-11 text-slate-400 hover:text-slate-700 active:scale-[0.95] border border-slate-200/90 rounded-xl hover:bg-slate-100 transition-all duration-150 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Box */}
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            {strings.estimatedTargetLabel}
          </span>
          <span className="text-[10px] text-teal-300 font-semibold" dir="ltr">
            {under5Pct ? `${under5Pct}% Demographic` : 'Cohort'}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {result !== null ? result.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-semibold text-teal-300">
              {isUrdu ? 'بچے (عمر 5 سال سے کم)' : 'children < 5 yrs'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">{strings.basePopLabel}</span>
            <span className="font-mono text-slate-200 font-bold text-[11px]">
              {totalPop ? `${Number(totalPop).toLocaleString()} ${isUrdu ? 'افراد' : 'persons'}` : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{strings.vialsRequiredLabel}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {result !== null ? `${Math.ceil(result / 20).toLocaleString()} ${isUrdu ? 'وائلز' : 'vials'}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
