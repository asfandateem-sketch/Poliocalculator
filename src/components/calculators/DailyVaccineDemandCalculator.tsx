import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateDailyVaccineDemand, DailyVaccineDemandResult, BOPV_CONSTANTS } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { ShieldAlert, Droplets } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const DailyVaccineDemandCalculator: React.FC<Props> = ({ t }) => {
  const [dailyTarget, setDailyTarget] = useState<number | string>(1000);
  const [result, setResult] = useState<DailyVaccineDemandResult>(() =>
    calculateDailyVaccineDemand(1000)
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const dt = Number(dailyTarget);
    if (isNaN(dt) || dt < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setResult(calculateDailyVaccineDemand(dt));
  };

  const handleReset = () => {
    setDailyTarget('');
    setError('');
    setResult(calculateDailyVaccineDemand(0));
  };

  const copySummary = `[Polio Calculator 10 - Daily Vaccine Demand]
Daily Target: ${result.dailyTarget.toLocaleString()} children
Rule: 1 vial = ${BOPV_CONSTANTS.CHILDREN_PER_VIAL} children (fixed)
DAILY VIALS REQUIRED: ${result.dailyVials.toLocaleString()}
Daily Drops Needed: ${result.dailyDrops.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-10"
      number={t.c10.num}
      title={t.c10.title}
      purpose={t.c10.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c10.formulaExplanation}
      formulaExplanation="Daily Vials = CEILING(Daily Target ÷ 20). Daily Drops = Daily Target × 2."
      exampleText="Example: Daily target = 1,000 children → Daily vials = 50, Daily drops = 2,000"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500">{t.c10.dailyTargetLabel}</span>
              <span className="text-white font-mono font-bold text-sm">
                {result.dailyTarget.toLocaleString()} children / day
              </span>
            </div>
            <div>
              <span className="block text-slate-500">{t.c10.fixedVialLabel}</span>
              <span className="text-teal-400 font-mono font-bold text-sm">
                {BOPV_CONSTANTS.CHILDREN_PER_VIAL} children / vial
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>{t.c10.dailyVialsResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {result.dailyVials.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-teal-300">Vials / Day</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.c10.dailyDropsResult}</span>
            </span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {result.dailyDrops.toLocaleString()} drops / day
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-10-daily-target"
          label={t.c10.dailyTargetLabel}
          value={dailyTarget}
          onChange={(val) => {
            setDailyTarget(val);
            setError('');
          }}
          increments={[100, 250, 500, 1000]}
          placeholder="e.g. 1000"
          error={error}
          helper="Children planned to be vaccinated for the day"
        />
      </div>
    </CalculatorCard>
  );
};
