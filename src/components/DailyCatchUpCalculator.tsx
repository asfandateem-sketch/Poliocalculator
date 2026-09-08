import React, { useState, useCallback } from 'react';
import { TrendingUp, RotateCcw, Package, Droplet } from 'lucide-react';
import { calculateDailyCatchUp, DailyCatchUpResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const DailyCatchUpCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.dailyCatchUp;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

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

  const calculate = useCallback(() => {
    setError('');
    const target = Number(totalTarget.replace(/,/g, ''));
    const vac = Number(alreadyVaccinated.replace(/,/g, ''));
    const days = Number(daysRemaining.replace(/,/g, ''));

    if (isNaN(target) || target <= 0) {
      setError(isUrdu ? 'براہ کرم درست کل ہدف درج کریں (> 0)' : 'Please enter a valid total target (> 0)');
      triggerError();
      return;
    }
    if (isNaN(vac) || vac < 0) {
      setError(isUrdu ? 'براہ کرم درست پہلے سے ویکسین شدہ بچے درج کریں (≥ 0)' : 'Please enter valid already vaccinated children (≥ 0)');
      triggerError();
      return;
    }
    if (isNaN(days) || days < 1) {
      setError(isUrdu ? 'براہ کرم باقی ایام درج کریں (کم از کم 1)' : 'Please enter remaining campaign days (≥ 1)');
      triggerError();
      return;
    }

    try {
      const res = calculateDailyCatchUp(target, vac, days);
      setResult(res);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
      setResult(null);
      triggerError();
    }
  }, [totalTarget, alreadyVaccinated, daysRemaining, isUrdu, triggerError, triggerFeedback]);

  const handleTargetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalTarget(e.target.value);
    setError('');
  }, []);

  const handleVaccinatedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAlreadyVaccinated(e.target.value);
    setError('');
  }, []);

  const handleDaysChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysRemaining(e.target.value);
    setError('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  const handleReset = useCallback(() => {
    setTotalTarget('');
    setAlreadyVaccinated('');
    setDaysRemaining('');
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
              08
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <div className="mb-1.5">
                  <InfoTooltip
                    id="catchup-target"
                    htmlFor="catchup-target-input"
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
                  aria-label={strings.targetLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 5000"
                  value={totalTarget}
                  onChange={handleTargetChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3"
                />
              </div>

              <div>
                <div className="mb-1.5">
                  <InfoTooltip
                    id="catchup-vaccinated"
                    htmlFor="catchup-vaccinated-input"
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
                  aria-label={strings.vaccinatedLabel}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 2000"
                  value={alreadyVaccinated}
                  onChange={handleVaccinatedChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3"
                />
              </div>

              <div>
                <div className="mb-1.5">
                  <InfoTooltip
                    id="catchup-days"
                    htmlFor="catchup-days-input"
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
                  aria-label={strings.daysLabel}
                  min="1"
                  max="14"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={daysRemaining}
                  onChange={handleDaysChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold animate-error-shake">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="catchup-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="catchup-reset-btn"
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
                    <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                    {strings.dailyTargetLabel}
                  </span>
                  {isCalculated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                      ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-teal-300 font-semibold" dir="ltr">
                      {result ? `${result.currentCoveragePercent}% ${isUrdu ? 'مکمل' : 'Achieved'}` : 'Run Rate'}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      key={`daily-target-${calculationKey}`}
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight text-white ${
                        isCalculated ? 'animate-number-pop' : ''
                      }`}
                    >
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
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-400 text-[10px] font-medium">{strings.morningVialsLabel}</span>
                    <span className="font-mono text-emerald-300 font-bold text-xs">
                      {result !== null ? `${result.dailyVialsRequired} ${isUrdu ? 'وائلز/دن' : 'vials/day'}` : '—'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-right">
                  <div>
                    <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'روزانہ قطرے' : 'Daily Drops'}</span>
                    <span className="font-mono text-cyan-300 font-bold text-xs">
                      {result !== null ? `${result.dailyDropsRequired.toLocaleString()} ${isUrdu ? 'قطرے' : 'drops'}` : '—'}
                    </span>
                  </div>
                  <Droplet className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
