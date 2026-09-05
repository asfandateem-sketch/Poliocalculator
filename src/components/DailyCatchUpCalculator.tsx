import React, { useState } from 'react';
import { TrendingUp, RotateCcw, Package, Droplet } from 'lucide-react';
import { calculateDailyCatchUp, DailyCatchUpResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const DailyCatchUpCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.dailyCatchUp;

  const [totalTarget, setTotalTarget] = useState<string>('5000');
  const [alreadyVaccinated, setAlreadyVaccinated] = useState<string>('2000');
  const [daysRemaining, setDaysRemaining] = useState<string>('3');

  const [result, setResult] = useState<DailyCatchUpResult | null>(() => {
    try {
      return calculateDailyCatchUp(5000, 2000, 3);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const target = Number(totalTarget.replace(/,/g, ''));
    const vaccinated = Number(alreadyVaccinated.replace(/,/g, ''));
    const days = Number(daysRemaining.replace(/,/g, ''));

    if (isNaN(target) || target < 0) {
      setError(isUrdu ? 'براہ کرم درست ہدف درج کریں (≥ 0)' : 'Please enter a valid target (≥ 0)');
      return;
    }
    if (isNaN(vaccinated) || vaccinated < 0) {
      setError(isUrdu ? 'براہ کرم اب تک ویکسین شدہ درست تعداد درج کریں (≥ 0)' : 'Please enter valid vaccinated count (≥ 0)');
      return;
    }
    if (isNaN(days) || days <= 0) {
      setError(isUrdu ? 'مہم کے باقی دن کم از کم 1 ہونا ضروری ہے' : 'Remaining campaign days must be at least 1');
      return;
    }
    if (vaccinated > target) {
      setError(isUrdu ? 'ویکسین شدہ تعداد مہم کے کل ہدف سے زیادہ نہیں ہو سکتی' : 'Vaccinated count exceeds the total campaign target');
      return;
    }

    try {
      const res = calculateDailyCatchUp(target, vaccinated, days);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid calculation values';
      setError(msg);
      setResult(null);
    }
  };

  const handleReset = () => {
    setTotalTarget('');
    setAlreadyVaccinated('');
    setDaysRemaining('3');
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

        {/* Inputs: 3 items with tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <div>
            <div className="mb-1.5">
              <InfoTooltip
                id="catchup-target"
                label={strings.targetLabel}
                formula={strings.targetTooltip.formula}
                fieldRule={strings.targetTooltip.fieldRule}
                explanation={strings.targetTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="catchup-target-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 5000"
              value={totalTarget}
              onChange={(e) => {
                setTotalTarget(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-11 w-full px-3 text-sm sm:text-base font-mono font-bold bg-slate-50/90 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1.5">
              <InfoTooltip
                id="catchup-vaccinated"
                label={strings.vaccinatedLabel}
                formula={strings.vaccinatedTooltip.formula}
                fieldRule={strings.vaccinatedTooltip.fieldRule}
                explanation={strings.vaccinatedTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="catchup-vaccinated-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 2000"
              value={alreadyVaccinated}
              onChange={(e) => {
                setAlreadyVaccinated(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-11 w-full px-3 text-sm sm:text-base font-mono font-bold bg-slate-50/90 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="mb-1.5">
              <InfoTooltip
                id="catchup-days"
                label={strings.daysLabel}
                formula={strings.daysTooltip.formula}
                fieldRule={strings.daysTooltip.fieldRule}
                explanation={strings.daysTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="catchup-days-input"
              type="number"
              min="1"
              max="14"
              inputMode="numeric"
              placeholder="e.g. 3"
              value={daysRemaining}
              onChange={(e) => {
                setDaysRemaining(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="h-11 w-full px-3 text-sm sm:text-base font-mono font-bold bg-slate-50/90 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 mb-2 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-2.5">
          <button
            id="catchup-calc-btn"
            type="button"
            onClick={calculate}
            className="h-11 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="catchup-reset-btn"
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
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            {strings.dailyTargetLabel}
          </span>
          <span className="text-[10px] text-teal-300 font-semibold" dir="ltr">
            {result ? `${result.currentCoveragePercent}% ${isUrdu ? 'مکمل' : 'Achieved'}` : 'Run Rate'}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {result !== null ? result.dailyTarget.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {isUrdu ? 'بچے / یومیہ' : 'children / day'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">{strings.remainingTargetLabel}: </span>
            <span className="font-mono font-bold text-xs text-amber-300">
              {result !== null ? result.remainingChildren.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="block text-slate-500">{strings.morningVialsLabel}</span>
              <span className="font-mono text-emerald-300 font-bold text-[11px]">
                {result !== null ? `${result.dailyVialsRequired} ${isUrdu ? 'وائلز/دن' : 'vials/day'}` : '—'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-right">
            <div>
              <span className="block text-slate-500">{isUrdu ? 'روزانہ قطرے' : 'Daily Drops'}</span>
              <span className="font-mono text-cyan-300 font-bold text-[11px]">
                {result !== null ? `${result.dailyDropsRequired.toLocaleString()} ${isUrdu ? 'قطرے' : 'drops'}` : '—'}
              </span>
            </div>
            <Droplet className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
