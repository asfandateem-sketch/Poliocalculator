import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateCoverage, CampaignCoverageResult } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const CampaignCoverageCalculator: React.FC<Props> = ({ t }) => {
  const [targetChildren, setTargetChildren] = useState<number | string>(5000);
  const [childrenVaccinated, setChildrenVaccinated] = useState<number | string>(4750);
  const [result, setResult] = useState<CampaignCoverageResult>(() =>
    calculateCoverage(5000, 4750)
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const target = Number(targetChildren);
    const vac = Number(childrenVaccinated);
    if (isNaN(target) || target < 0 || isNaN(vac) || vac < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setResult(calculateCoverage(target, vac));
  };

  const handleReset = () => {
    setTargetChildren('');
    setChildrenVaccinated('');
    setError('');
    setResult(calculateCoverage(0, 0));
  };

  const copySummary = `[Polio Calculator 08 - Campaign Coverage]
Target Children: ${result.targetChildren.toLocaleString()}
Vaccinated Children: ${result.childrenVaccinated.toLocaleString()}
COVERAGE RATE: ${result.coveragePercent}%
Remaining Children: ${result.remainingChildren.toLocaleString()}`;

  const isHighCoverage = result.coveragePercent >= 95;

  return (
    <CalculatorCard
      id="calc-08"
      number={t.c8.num}
      title={t.c8.title}
      purpose={t.c8.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c8.formulaExplanation}
      formulaExplanation="Coverage % = (Children Vaccinated ÷ Target Children) × 100. Standard campaign benchmark is ≥ 95%."
      exampleText="Example: Target = 5,000, Vaccinated = 4,750 → Coverage = 95.0%, Remaining = 250"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>Target: <strong className="text-white font-mono">{result.targetChildren.toLocaleString()}</strong></span>
            <span>Vaccinated: <strong className="text-emerald-400 font-mono">{result.childrenVaccinated.toLocaleString()}</strong></span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" />
              <span>{t.c8.coverageResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                  isHighCoverage ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {result.coveragePercent}%
              </span>
              <span className="text-sm font-semibold text-slate-300">Coverage</span>
            </div>
          </div>

          {/* Progress gauge */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isHighCoverage ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, result.coveragePercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>0%</span>
              <span className="font-semibold text-slate-300">95% Target Standard</span>
              <span>100%</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              {result.remainingChildren > 0 ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {t.c8.remainingResult}:
            </span>
            <span
              className={`text-base font-bold font-mono ${
                result.remainingChildren > 0 ? 'text-amber-300' : 'text-emerald-400'
              }`}
            >
              {result.remainingChildren.toLocaleString()} children
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-08-target"
          label={t.c8.targetLabel}
          value={targetChildren}
          onChange={(val) => {
            setTargetChildren(val);
            setError('');
          }}
          increments={[500, 1000, 5000]}
          placeholder="e.g. 5000"
          error={error}
        />

        <FormInput
          id="calc-08-vac"
          label={t.c8.vaccinatedLabel}
          value={childrenVaccinated}
          onChange={(val) => {
            setChildrenVaccinated(val);
            setError('');
          }}
          increments={[100, 500, 1000]}
          placeholder="e.g. 4750"
        />
      </div>
    </CalculatorCard>
  );
};
