import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateVaccineWastageFromVials, VialWastageResult, BOPV_CONSTANTS } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const VaccineWastageCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.vaccineWastage;

  const [vialsSupplied, setVialsSupplied] = useState<string>('50');
  const [childrenVaccinated, setChildrenVaccinated] = useState<string>('950');
  const [result, setResult] = useState<VialWastageResult | null>(() => {
    try {
      return calculateVaccineWastageFromVials(50, 950);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const vials = Number(vialsSupplied.replace(/,/g, ''));
    const vaccinated = Number(childrenVaccinated.replace(/,/g, ''));

    if (isNaN(vials) || vials < 0) {
      setError(isUrdu ? 'براہ کرم فراہم کردہ درست وائلز درج کریں (≥ 0)' : 'Please enter valid vials supplied (≥ 0)');
      return;
    }
    if (isNaN(vaccinated) || vaccinated < 0) {
      setError(isUrdu ? 'براہ کرم ویکسین شدہ درست بچے درج کریں (≥ 0)' : 'Please enter valid children vaccinated (≥ 0)');
      return;
    }

    const totalCapacity = vials * BOPV_CONSTANTS.CHILDREN_PER_VIAL;
    if (vaccinated > totalCapacity) {
      setError(
        isUrdu
          ? `ویکسین شدہ بچے (${vaccinated}) فراہم کردہ کل خوراکوں (${totalCapacity}) سے زیادہ نہیں ہو سکتے`
          : `Children vaccinated (${vaccinated}) cannot exceed total doses supplied (${totalCapacity} doses from ${vials} vials)`
      );
      return;
    }

    try {
      const res = calculateVaccineWastageFromVials(vials, vaccinated);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid calculation parameters';
      setError(msg);
      setResult(null);
    }
  };

  const handleReset = () => {
    setVialsSupplied('');
    setChildrenVaccinated('');
    setResult(null);
    setError('');
  };

  const currentVials = Number(vialsSupplied.replace(/,/g, '')) || 0;
  const potentialDoses = currentVials * BOPV_CONSTANTS.CHILDREN_PER_VIAL;

  return (
    <div className={`saas-card p-5 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              03
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="wastage-vials"
                    label={strings.vialsLabel}
                    formula={strings.vialsTooltip.formula}
                    fieldRule={strings.vialsTooltip.fieldRule}
                    explanation={strings.vialsTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                  {potentialDoses > 0 && (
                    <span className="text-[10px] font-mono text-teal-700 font-semibold" dir="ltr">
                      ={potentialDoses.toLocaleString()}d
                    </span>
                  )}
                </div>
                <input
                  id="wastage-vials-input"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 50"
                  value={vialsSupplied}
                  onChange={(e) => {
                    setVialsSupplied(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="wastage-vaccinated"
                    label={strings.vaccinatedLabel}
                    formula={strings.vaccinatedTooltip.formula}
                    fieldRule={strings.vaccinatedTooltip.fieldRule}
                    explanation={strings.vaccinatedTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">{strings.dosesGivenSub}</span>
                </div>
                <input
                  id="wastage-vaccinated-input"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 950"
                  value={childrenVaccinated}
                  onChange={(e) => {
                    setChildrenVaccinated(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="wastage-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="wastage-reset-btn"
                type="button"
                onClick={handleReset}
                title={strings.resetBtn}
                className="saas-btn-secondary px-3.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{strings.resetBtn}</span>
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-6">
            <div className="saas-result-card p-4 sm:p-5 flex flex-col justify-between h-full min-h-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    {strings.wastedDosesLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">{strings.targetWastageNotice}</span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      {result !== null ? result.wastedDoses.toLocaleString() : '—'}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      {isUrdu ? 'خوراکیں ضائع' : 'wasted doses'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      dir="ltr"
                      className={`text-xl sm:text-2xl font-black font-mono ${
                        result === null
                          ? 'text-slate-400'
                          : result.wastageRatePercent <= 5
                          ? 'text-emerald-400'
                          : result.wastageRatePercent <= 10
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result !== null ? `${result.wastageRatePercent}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.vialsSuppliedLabel}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? `${result.vialsSupplied} ${isUrdu ? 'وائلز' : 'vials'}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.dosesSuppliedLabel}</span>
                  <span className="font-mono text-teal-300 font-bold text-xs">
                    {result !== null ? result.totalDosesSupplied.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-left sm:text-right pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.vaccinatedLabelResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? result.childrenVaccinated.toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
