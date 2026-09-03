import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateVaccinationTarget, VaccinationTargetResult } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';

interface Props {
  t: TranslationStrings;
}

export const VaccinationTargetCalculator: React.FC<Props> = ({ t }) => {
  const [totalTarget, setTotalTarget] = useState<number | string>(5000);
  const [alreadyVaccinated, setAlreadyVaccinated] = useState<number | string>(1000);
  const [result, setResult] = useState<VaccinationTargetResult>(() =>
    calculateVaccinationTarget(5000, 1000)
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const target = Number(totalTarget);
    const vac = Number(alreadyVaccinated);
    if (isNaN(target) || target < 0 || isNaN(vac) || vac < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setResult(calculateVaccinationTarget(target, vac));
  };

  const handleReset = () => {
    setTotalTarget('');
    setAlreadyVaccinated('');
    setError('');
    setResult(calculateVaccinationTarget(0, 0));
  };

  const copySummary = `[Polio Calculator 05 - Vaccination Target]
Total Target: ${result.totalTarget.toLocaleString()}
Already Vaccinated: ${result.alreadyVaccinated.toLocaleString()}
REMAINING CHILDREN: ${result.remainingChildren.toLocaleString()}
Progress: ${result.progressPercent}%`;

  return (
    <CalculatorCard
      id="calc-05"
      number={t.c5.num}
      title={t.c5.title}
      purpose={t.c5.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c5.formulaExplanation}
      formulaExplanation="Remaining Children = Total Target − Children Already Vaccinated."
      exampleText="Example: Target = 5,000, Already Vaccinated = 1,000 → Remaining = 4,000 children"
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
              <span className="block text-slate-500">{t.c5.totalTargetLabel}</span>
              <span className="text-white font-mono font-bold text-sm">
                {result.totalTarget.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-slate-500">{t.c5.alreadyVaccinatedLabel}</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {result.alreadyVaccinated.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              {t.c5.remainingResult}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {result.remainingChildren.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-amber-300">Children</span>
            </div>
          </div>

          {/* Simple progress bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>{t.c5.progressResult}</span>
              <span className="text-white font-mono font-bold">{result.progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, result.progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-05-total-target"
          label={t.c5.totalTargetLabel}
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
          id="calc-05-already-vac"
          label={t.c5.alreadyVaccinatedLabel}
          value={alreadyVaccinated}
          onChange={(val) => {
            setAlreadyVaccinated(val);
            setError('');
          }}
          increments={[100, 500, 1000]}
          placeholder="e.g. 1000"
        />
      </div>
    </CalculatorCard>
  );
};
