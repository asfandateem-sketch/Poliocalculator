import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateChildrenFromVials, VialsToChildrenResult, BOPV_CONSTANTS } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Users, Droplets } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const VialsToChildrenCalculator: React.FC<Props> = ({ t }) => {
  const [vials, setVials] = useState<number | string>(250);
  const [result, setResult] = useState<VialsToChildrenResult>(() =>
    calculateChildrenFromVials(250)
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const v = Number(vials);
    if (isNaN(v) || v < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setResult(calculateChildrenFromVials(v));
  };

  const handleReset = () => {
    setVials('');
    setError('');
    setResult(calculateChildrenFromVials(0));
  };

  const copySummary = `[Polio Calculator 07 - Vials to Children]
Vials: ${result.vials.toLocaleString()}
Rate: 1 vial = ${BOPV_CONSTANTS.CHILDREN_PER_VIAL} children (fixed)
CHILDREN VACCINATED: ${result.children.toLocaleString()}
Total Drops: ${result.totalDrops.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-07"
      number={t.c7.num}
      title={t.c7.title}
      purpose={t.c7.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c7.formulaExplanation}
      formulaExplanation="Children = Vials × 20. Total Drops = Children × 2."
      exampleText="Example: 250 vials × 20 = 5,000 children (10,000 drops)"
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
              <span className="block text-slate-500">Vials Provided</span>
              <span className="text-white font-mono font-bold text-sm">
                {result.vials.toLocaleString()} vials
              </span>
            </div>
            <div>
              <span className="block text-slate-500">{t.c7.fixedCapacityLabel}</span>
              <span className="text-teal-400 font-mono font-bold text-sm">
                {BOPV_CONSTANTS.CHILDREN_PER_VIAL} children / vial
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" />
              <span>{t.c7.childrenResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {result.children.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-teal-300">Children</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.c7.totalDropsResult}</span>
            </span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {result.totalDrops.toLocaleString()} drops
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-07-vials"
          label={t.c7.vialsLabel}
          value={vials}
          onChange={(val) => {
            setVials(val);
            setError('');
          }}
          increments={[10, 50, 100, 250]}
          placeholder="e.g. 250"
          error={error}
          helper="1 vial strictly covers 20 children"
        />
      </div>
    </CalculatorCard>
  );
};
