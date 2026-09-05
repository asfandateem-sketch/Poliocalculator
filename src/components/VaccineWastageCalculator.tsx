import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateVaccineWastageFromVials, VialWastageResult, BOPV_CONSTANTS } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const VaccineWastageCalculator: React.FC<Props> = ({ compact = true }) => {
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
    <div className={`clay-card flex flex-col justify-between p-4 sm:p-5 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="clay-num-badge w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0">
              3
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {strings.title}
            </h2>
          </div>
          <span className="clay-badge text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-3 py-1 rounded-xl flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {strings.purpose}
        </p>

        {/* Inputs with Info Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
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
                <span className="clay-badge text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg font-bold" dir="ltr">
                  ={potentialDoses.toLocaleString()} {isUrdu ? 'خوراکیں' : 'doses'}
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
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
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
              <span className="text-xs text-slate-500 font-semibold">{strings.dosesGivenSub}</span>
            </div>
            <input
              id="wastage-vaccinated-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 920"
              value={childrenVaccinated}
              onChange={(e) => {
                setChildrenVaccinated(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 mb-2 font-bold">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            id="wastage-calc-btn"
            type="button"
            onClick={calculate}
            className="clay-btn-teal h-11 flex-1 px-4 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="wastage-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="clay-btn-light h-11 w-11 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Box - Clay Dark Box */}
      <div className="clay-dark-box p-3.5 sm:p-4 text-white">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            {strings.wastedDosesLabel}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{strings.targetWastageNotice}</span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {result !== null ? result.wastedDoses.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-bold text-amber-300">
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

        {/* Supporting metrics */}
        <div className="clay-dark-cell p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
          <div>
            <span className="block text-slate-400 text-[10px] font-medium">{strings.vialsSuppliedLabel}</span>
            <span className="font-mono text-slate-200 font-extrabold text-xs">
              {result !== null ? `${result.vialsSupplied} ${isUrdu ? 'وائلز' : 'vials'}` : '—'}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] font-medium">{strings.dosesSuppliedLabel}</span>
            <span className="font-mono text-teal-300 font-extrabold text-xs">
              {result !== null ? result.totalDosesSupplied.toLocaleString() : '—'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 text-left sm:text-right pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
            <span className="block text-slate-400 text-[10px] font-medium">{strings.vaccinatedLabelResult}</span>
            <span className="font-mono text-emerald-300 font-extrabold text-xs">
              {result !== null ? result.childrenVaccinated.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
