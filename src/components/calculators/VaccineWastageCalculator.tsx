import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateWastageFull, WastageResult, BOPV_CONSTANTS } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Layers, HelpCircle } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const VaccineWastageCalculator: React.FC<Props> = ({ t }) => {
  const [mode, setMode] = useState<'dose-level' | 'vial-estimate'>('dose-level');
  // Dose-level inputs
  const [suppliedDoses, setSuppliedDoses] = useState<number | string>(1000);
  const [administeredDoses, setAdministeredDoses] = useState<number | string>(900);
  // Vial-based estimate inputs
  const [vialsSupplied, setVialsSupplied] = useState<number | string>(50);
  const [childrenVaccinated, setChildrenVaccinated] = useState<number | string>(900);

  const [result, setResult] = useState<WastageResult>(() =>
    calculateWastageFull({ type: 'dose-level', suppliedDoses: 1000, administeredDoses: 900 })
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    if (mode === 'dose-level') {
      const sup = Number(suppliedDoses);
      const adm = Number(administeredDoses);
      if (isNaN(sup) || sup < 0 || isNaN(adm) || adm < 0) {
        setError(t.validationErrorValidNumber);
        return;
      }
      if (adm > sup) {
        setError(t.validationErrorAdministeredExceeds);
        return;
      }
      setResult(calculateWastageFull({ type: 'dose-level', suppliedDoses: sup, administeredDoses: adm }));
    } else {
      const vials = Number(vialsSupplied);
      const kids = Number(childrenVaccinated);
      if (isNaN(vials) || vials < 0 || isNaN(kids) || kids < 0) {
        setError(t.validationErrorValidNumber);
        return;
      }
      const capacity = vials * BOPV_CONSTANTS.CHILDREN_PER_VIAL;
      if (kids > capacity) {
        setError(`Vaccinated children (${kids}) exceeds vial capacity (${capacity}). Check vial count.`);
        return;
      }
      setResult(calculateWastageFull({ type: 'vial-estimate', vialsSupplied: vials, childrenVaccinated: kids }));
    }
  };

  const handleReset = () => {
    setMode('dose-level');
    setSuppliedDoses('');
    setAdministeredDoses('');
    setVialsSupplied('');
    setChildrenVaccinated('');
    setError('');
    setResult(calculateWastageFull({ type: 'dose-level', suppliedDoses: 0, administeredDoses: 0 }));
  };

  const copySummary = `[Polio Calculator 02 - Vaccine Wastage]
Type: ${result.isEstimate ? 'Vial-Based Estimate (20 children/vial)' : 'Dose-Level Actual'}
Vaccine Supplied: ${result.suppliedDoses.toLocaleString()}
Vaccine Administered: ${result.administeredDoses.toLocaleString()}
Wasted Doses: ${result.wastedDoses.toLocaleString()}
Wastage Rate: ${result.wastageRatePercent}%`;

  return (
    <CalculatorCard
      id="calc-02"
      number={t.c2.num}
      title={t.c2.title}
      purpose={t.c2.purpose}
      isPrimary={true}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c2.formulaExplanation}
      formulaExplanation="Wasted Doses = Supplied Doses − Administered Doses. Wastage % = (Wasted Doses ÷ Supplied Doses) × 100. For vial estimates, supplied capacity = Vials × 20."
      exampleText="Example: Supplied = 1,000 doses, Administered = 900 doses → 100 wasted (10.0% wastage)"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Calculation Type
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.isEstimate
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {result.isEstimate ? 'Estimated Wastage / Capacity' : 'Dose-Level Actual'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-slate-400 mb-1">{t.c2.wastedLabel}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                  {result.wastedDoses.toLocaleString()}
                </span>
                <span className="text-sm text-rose-400 font-medium">Doses</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 mb-1">{t.c2.wastageRateLabel}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-amber-300 font-mono tracking-tight">
                  {result.wastageRatePercent}%
                </span>
                <span className="text-xs text-slate-400">Wastage</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="block text-slate-400">{t.c2.suppliedResultLabel}</span>
              <span className="text-base font-bold font-mono text-slate-200">
                {result.suppliedDoses.toLocaleString()} doses
              </span>
            </div>
            <div>
              <span className="block text-slate-400">{t.c2.administeredResultLabel}</span>
              <span className="text-base font-bold font-mono text-slate-200">
                {result.administeredDoses.toLocaleString()} doses
              </span>
            </div>
          </div>

          {result.isEstimate && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t.c2.estimateDisclaimer}</span>
            </div>
          )}
        </div>
      }
    >
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setMode('dose-level');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
            mode === 'dose-level'
              ? 'bg-white text-teal-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{t.c2.modeDose}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('vial-estimate');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
            mode === 'vial-estimate'
              ? 'bg-white text-teal-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-600" />
          <span>{t.c2.modeVial}</span>
        </button>
      </div>

      {mode === 'dose-level' ? (
        <div className="space-y-4 pt-1">
          <FormInput
            id="calc-02-supplied-doses"
            label={t.c2.suppliedLabel}
            value={suppliedDoses}
            onChange={(val) => {
              setSuppliedDoses(val);
              setError('');
            }}
            increments={[100, 500, 1000]}
            placeholder="e.g. 1000"
            error={error}
          />

          <FormInput
            id="calc-02-admin-doses"
            label={t.c2.administeredLabel}
            value={administeredDoses}
            onChange={(val) => {
              setAdministeredDoses(val);
              setError('');
            }}
            increments={[100, 500, 1000]}
            placeholder="e.g. 900"
          />
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <FormInput
            id="calc-02-vials-supplied"
            label={t.c2.vialsSuppliedLabel}
            value={vialsSupplied}
            onChange={(val) => {
              setVialsSupplied(val);
              setError('');
            }}
            increments={[10, 50, 100]}
            placeholder="e.g. 50"
            helper="1 vial = 20 doses capacity"
            error={error}
          />

          <FormInput
            id="calc-02-children-vaccinated"
            label={t.c2.vaccinatedLabel}
            value={childrenVaccinated}
            onChange={(val) => {
              setChildrenVaccinated(val);
              setError('');
            }}
            increments={[50, 100, 500]}
            placeholder="e.g. 900"
            helper="Number of children vaccinated (1 dose each)"
          />
        </div>
      )}
    </CalculatorCard>
  );
};
