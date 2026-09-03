import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateDailyTarget, DailyTargetResult } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Calendar, TrendingUp } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const DailyTargetCalculator: React.FC<Props> = ({ t }) => {
  const [totalTarget, setTotalTarget] = useState<number | string>(5000);
  const [alreadyVaccinated, setAlreadyVaccinated] = useState<number | string>(2000);
  const [campaignDays, setCampaignDays] = useState<number | string>(3);
  const [result, setResult] = useState<DailyTargetResult>(() =>
    calculateDailyTarget(5000, 2000, 3)
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const target = Number(totalTarget);
    const vac = Number(alreadyVaccinated);
    const days = Number(campaignDays);
    if (isNaN(target) || target < 0 || isNaN(vac) || vac < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    if (isNaN(days) || days <= 0) {
      setError(t.validationErrorDays);
      return;
    }
    setResult(calculateDailyTarget(target, vac, days));
  };

  const handleReset = () => {
    setTotalTarget('');
    setAlreadyVaccinated('');
    setCampaignDays(3);
    setError('');
    setResult(calculateDailyTarget(0, 0, 1));
  };

  const copySummary = `[Polio Calculator 09 - Daily Target]
Total Target: ${result.totalTarget.toLocaleString()}
Already Vaccinated: ${result.alreadyVaccinated.toLocaleString()}
Remaining Children: ${result.remainingChildren.toLocaleString()}
Days Remaining: ${result.campaignDaysRemaining}
DAILY TARGET: ${result.dailyTarget.toLocaleString()} children/day`;

  return (
    <CalculatorCard
      id="calc-09"
      number={t.c9.num}
      title={t.c9.title}
      purpose={t.c9.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c9.formulaExplanation}
      formulaExplanation="Remaining = Target − Already Vaccinated. Daily Target = CEILING(Remaining ÷ Campaign Days Remaining)."
      exampleText="Example: Target = 5,000, Vaccinated = 2,000, Days remaining = 3 → Remaining = 3,000 → Daily Target = 1,000 children/day"
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
              <span className="block text-slate-500">{t.c9.remainingChildrenLabel}</span>
              <span className="text-amber-400 font-mono font-bold text-sm">
                {result.remainingChildren.toLocaleString()} children
              </span>
            </div>
            <div>
              <span className="block text-slate-500">{t.c9.daysRemainingLabel}</span>
              <span className="text-white font-mono font-bold text-sm">
                {result.campaignDaysRemaining} days
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>{t.c9.dailyTargetResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {result.dailyTarget.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-teal-300">children / day</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall Target: {result.totalTarget.toLocaleString()}</span>
            <span>Covered: {result.alreadyVaccinated.toLocaleString()}</span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-09-target"
          label={t.c9.targetLabel}
          value={totalTarget}
          onChange={(val) => {
            setTotalTarget(val);
            setError('');
          }}
          increments={[500, 1000, 5000]}
          placeholder="e.g. 5000"
          error={error}
        />

        <FormInput
          id="calc-09-already-vac"
          label={t.c9.vaccinatedLabel}
          value={alreadyVaccinated}
          onChange={(val) => {
            setAlreadyVaccinated(val);
            setError('');
          }}
          increments={[100, 500, 1000]}
          placeholder="e.g. 2000"
        />

        <FormInput
          id="calc-09-days"
          label={t.c9.daysRemainingLabel}
          value={campaignDays}
          onChange={(val) => {
            setCampaignDays(val);
            setError('');
          }}
          min={1}
          max={30}
          step={1}
          placeholder="e.g. 3"
          helper="Number of active field days remaining in campaign"
        />
      </div>
    </CalculatorCard>
  );
};
