import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateVaccineDemand, VaccineDemandResult, BOPV_CONSTANTS } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { ShieldCheck, Droplets } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const VaccineDemandCalculator: React.FC<Props> = ({ t }) => {
  const [children, setChildren] = useState<number | string>(5000);
  const [result, setResult] = useState<VaccineDemandResult>(() => calculateVaccineDemand(5000));
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const c = Number(children);
    if (isNaN(c) || c < 0) {
      setError(t.validationErrorValidNumber);
      return;
    }
    setResult(calculateVaccineDemand(c));
  };

  const handleReset = () => {
    setChildren('');
    setError('');
    setResult(calculateVaccineDemand(0));
  };

  const copySummary = `[Polio Calculator 03 - Vaccine Demand]
Children: ${result.children.toLocaleString()}
Vaccine: ${BOPV_CONSTANTS.VACCINE_NAME}
Drops per Child: ${BOPV_CONSTANTS.DROPS_PER_CHILD}
Children per Vial: ${BOPV_CONSTANTS.CHILDREN_PER_VIAL}
VIALS REQUIRED: ${result.vialsRequired.toLocaleString()}
Total Drops: ${result.totalDropsRequired.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-03"
      number={t.c3.num}
      title={t.c3.title}
      purpose={t.c3.purpose}
      isPrimary={true}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c3.formulaExplanation}
      formulaExplanation="Vials Required = CEILING(Children ÷ 20). Any fraction of a vial requires a full additional vial. Total drops = Children × 2."
      exampleText="Examples: 20 children → 1 vial | 21 children → 2 vials | 5,000 children → 250 vials | 5,001 children → 251 vials"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 font-medium">Children</span>
              <span className="text-white font-mono font-bold text-sm">
                {result.children.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium">Vaccine</span>
              <span className="text-teal-400 font-bold text-sm">
                {BOPV_CONSTANTS.VACCINE_NAME}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium">{t.c3.fixedDropsLabel}</span>
              <span className="text-white font-mono font-bold text-sm">
                {BOPV_CONSTANTS.DROPS_PER_CHILD}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium">{t.c3.fixedVialLabel}</span>
              <span className="text-white font-mono font-bold text-sm">
                {BOPV_CONSTANTS.CHILDREN_PER_VIAL}
              </span>
            </div>
          </div>

          {/* Primary Result: VIALS REQUIRED */}
          <div className="pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{t.c3.vialsRequiredResult}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {result.vialsRequired.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg font-semibold text-teal-300">
                Vials (bOPV)
              </span>
            </div>
          </div>

          {/* Secondary Result: Total Drops */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>{t.c3.totalDropsResult}</span>
            </div>
            <span className="text-xl font-bold font-mono text-cyan-300">
              {result.totalDropsRequired.toLocaleString()} drops
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Fixed Rule Pill Indicator */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-teal-50/80 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
          <span className="font-bold text-teal-950">Fixed Rule:</span>
          <span>1 child = 2 drops</span>
          <span>•</span>
          <span>1 vial = 20 children</span>
          <span className="text-[11px] text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md ml-auto">
            Non-editable
          </span>
        </div>

        <FormInput
          id="calc-03-children"
          label={t.c3.childrenLabel}
          value={children}
          onChange={(val) => {
            setChildren(val);
            setError('');
          }}
          increments={[100, 500, 1000, 5000]}
          placeholder="e.g. 5000"
          error={error}
          helper="Enter total target children to determine required bOPV vials"
        />
      </div>
    </CalculatorCard>
  );
};
