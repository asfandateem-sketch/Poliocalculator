import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateTotalDrops, BOPV_CONSTANTS } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Droplets } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const TotalDropsCalculator: React.FC<Props> = ({ t }) => {
  const [children, setChildren] = useState<number | string>(5000);
  const [totalDrops, setTotalDrops] = useState<number>(() => calculateTotalDrops(5000));
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const c = Number(children);
    if (isNaN(c) || c < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setTotalDrops(calculateTotalDrops(c));
  };

  const handleReset = () => {
    setChildren('');
    setError('');
    setTotalDrops(0);
  };

  const copySummary = `[Polio Calculator 06 - Total Drops]
Children: ${Number(children || 0).toLocaleString()}
Rule: ${BOPV_CONSTANTS.DROPS_PER_CHILD} drops per child (fixed)
TOTAL DROPS: ${totalDrops.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-06"
      number={t.c6.num}
      title={t.c6.title}
      purpose={t.c6.purpose}
      isPrimary={false}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c6.formulaExplanation}
      formulaExplanation="Each child receives exactly 2 drops of bOPV vaccine."
      exampleText="Example: 5,000 children × 2 = 10,000 drops"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>Children Count: <strong className="text-white font-mono">{Number(children || 0).toLocaleString()}</strong></span>
            <span className="text-cyan-400 font-semibold">{BOPV_CONSTANTS.DROPS_PER_CHILD} drops / child</span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>{t.c6.totalDropsResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {totalDrops.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-cyan-300">Drops</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
          <span>Standard dosage:</span>
          <span className="font-bold text-teal-800">Fixed 2 drops per child</span>
        </div>

        <FormInput
          id="calc-06-children"
          label={t.c6.childrenLabel}
          value={children}
          onChange={(val) => {
            setChildren(val);
            setError('');
          }}
          increments={[100, 500, 1000, 5000]}
          placeholder="e.g. 5000"
          error={error}
        />
      </div>
    </CalculatorCard>
  );
};
