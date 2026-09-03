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
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-200/60 shadow-2xs flex-shrink-0">
              3
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {strings.title}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0">
            {strings.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5 leading-normal line-clamp-1">
          {strings.purpose}
        </p>

        {/* Inputs with Info Tooltips */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <InfoTooltip
                id="wastage-vials"
                label={strings.vialsLabel}
                formula={strings.vialsTooltip.formula}
                fieldRule={strings.vialsTooltip.fieldRule}
                explanation={strings.vialsTooltip.explanation}
                isUrdu={isUrdu}
              />
              {potentialDoses > 0 && (
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-semibold border border-teal-200/60" dir="ltr">
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
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <InfoTooltip
                id="wastage-vaccinated"
                label={strings.vaccinatedLabel}
                formula={strings.vaccinatedTooltip.formula}
                fieldRule={strings.vaccinatedTooltip.fieldRule}
                explanation={strings.vaccinatedTooltip.explanation}
                isUrdu={isUrdu}
              />
              <span className="text-[10px] text-slate-400">{strings.dosesGivenSub}</span>
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
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 mb-2 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            id="wastage-calc-btn"
            type="button"
            onClick={calculate}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="wastage-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="h-9 w-9 text-slate-400 hover:text-slate-700 active:scale-[0.95] border border-slate-200/90 rounded-xl hover:bg-slate-100 transition-all duration-150 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Result Box */}
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            {strings.wastedDosesLabel}
          </span>
          <span className="text-[10px] text-slate-400">{strings.targetWastageNotice}</span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
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
                  ? 'text-slate-300'
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
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">{strings.vialsSuppliedLabel}</span>
            <span className="font-mono text-slate-200 font-bold text-[11px]">
              {result !== null ? `${result.vialsSupplied} ${isUrdu ? 'وائلز' : 'vials'}` : '—'}
            </span>
          </div>
          <div>
            <span className="block text-slate-500">{strings.dosesSuppliedLabel}</span>
            <span className="font-mono text-teal-300 font-bold text-[11px]">
              {result !== null ? result.totalDosesSupplied.toLocaleString() : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{strings.vaccinatedLabelResult}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {result !== null ? result.childrenVaccinated.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
