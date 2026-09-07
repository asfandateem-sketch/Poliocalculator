import React, { useState } from 'react';
import { Package, RotateCcw, Droplets } from 'lucide-react';
import { calculateVaccineDemand } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const VaccineDemandCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.vaccineDemand;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const [targetChildren, setTargetChildren] = useState<string>('5000');
  const [dosesPerVial, setDosesPerVial] = useState<string>('20');
  const [bufferPct, setBufferPct] = useState<string>('10');
  const [vialsRequired, setVialsRequired] = useState<number | null>(275);
  const [bufferVials, setBufferVials] = useState<number | null>(25);
  const [totalDoses, setTotalDoses] = useState<number | null>(5500);
  const [totalDrops, setTotalDrops] = useState<number | null>(11000);
  const [coveredChildren, setCoveredChildren] = useState<number | null>(5000);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const children = Number(targetChildren.replace(/,/g, ''));
    if (isNaN(children) || children < 0) {
      setError(isUrdu ? 'براہ کرم درست تعداد درج کریں (≥ 0)' : 'Please enter a valid number of children (≥ 0)');
      triggerError();
      return;
    }

    const perVial = dosesPerVial ? Number(dosesPerVial) : 20;
    if (isNaN(perVial) || perVial <= 0) {
      setError(isUrdu ? 'فی وائل خوراکیں 0 سے زیادہ ہونی چاہئیں' : 'Doses per vial must be greater than 0');
      triggerError();
      return;
    }

    const buffer = bufferPct ? Number(bufferPct) : 0;
    if (isNaN(buffer) || buffer < 0 || buffer > 100) {
      setError(isUrdu ? 'حفاظتی بفر 0 سے 100 فیصد کے درمیان ہونا چاہیے' : 'Buffer percentage must be between 0 and 100');
      triggerError();
      return;
    }

    try {
      const neededDosesWithBuffer = Math.ceil(children * (1 + buffer / 100));
      const neededVials = Math.ceil(neededDosesWithBuffer / perVial);
      const baseVials = Math.ceil(children / perVial);
      const calcBufferVials = Math.max(0, neededVials - baseVials);

      setVialsRequired(neededVials);
      setBufferVials(calcBufferVials);
      setTotalDoses(neededDosesWithBuffer);
      setTotalDrops(neededDosesWithBuffer * 2);
      setCoveredChildren(children);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Calculation error';
      setError(msg);
      triggerError();
    }
  };

  const handleReset = () => {
    setTargetChildren('');
    setDosesPerVial('20');
    setBufferPct('10');
    setVialsRequired(null);
    setBufferVials(null);
    setTotalDoses(null);
    setTotalDrops(null);
    setCoveredChildren(null);
    setError('');
    triggerReset();
  };

  return (
    <div className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              02
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
          <span className="text-xs font-mono font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/70 flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>

        {/* Content Layout: 2 Columns on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Inputs Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="demand-target"
                    label={strings.targetLabel}
                    formula={strings.targetTooltip.formula}
                    fieldRule={strings.targetTooltip.fieldRule}
                    explanation={strings.targetTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">bOPV (2 drops)</span>
                </div>
                <input
                  id="demand-target-input"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 5000"
                  value={targetChildren}
                  onChange={(e) => {
                    setTargetChildren(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="demand-doses-per-vial" className="block text-xs font-semibold text-slate-700 mb-1.5 truncate">
                  {isUrdu ? 'خوراکیں/وائل' : 'Doses/Vial'}
                </label>
                <input
                  id="demand-doses-per-vial"
                  type="number"
                  min="1"
                  max="100"
                  inputMode="numeric"
                  placeholder="20"
                  value={dosesPerVial}
                  onChange={(e) => {
                    setDosesPerVial(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="demand-buffer"
                    label={strings.bufferLabel}
                    formula={strings.bufferTooltip.formula}
                    fieldRule={strings.bufferTooltip.fieldRule}
                    explanation={strings.bufferTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                </div>
                <input
                  id="demand-buffer-input"
                  type="number"
                  min="0"
                  max="50"
                  inputMode="numeric"
                  placeholder="10%"
                  value={bufferPct}
                  onChange={(e) => {
                    setBufferPct(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold animate-error-shake">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="demand-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="demand-reset-btn"
                type="button"
                onClick={handleReset}
                title={strings.resetBtn}
                aria-label={strings.resetBtn}
                className="saas-btn-secondary px-4 min-h-[48px] min-w-[48px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{strings.resetBtn}</span>
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-6">
            <div
              className={`saas-result-card p-4 sm:p-5 flex flex-col justify-between h-full min-h-[170px] transition-all duration-300 ${
                isCalculated
                  ? 'ring-2 ring-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.25)] animate-calculate-pulse'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Package className="w-3.5 h-3.5 text-teal-400" />
                    {strings.vialsResultLabel}
                  </span>
                  {isCalculated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                      ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-teal-300 font-mono font-medium" dir="ltr">CEIL(N ÷ 20)</span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      key={`vials-${calculationKey}`}
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight text-white ${
                        isCalculated ? 'animate-number-pop' : ''
                      }`}
                    >
                      {vialsRequired !== null ? vialsRequired.toLocaleString() : '—'}
                    </span>
                    <span className="text-xs font-semibold text-teal-300">
                      {isUrdu ? 'وائلز' : 'Vials'}
                    </span>
                    {bufferVials !== null && bufferVials > 0 && (
                      <span className="inline-flex items-center text-[10px] text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded font-mono font-bold">
                        +{bufferVials} {isUrdu ? 'بفر' : 'buffer'}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium">{isUrdu ? 'کل خوراکیں: ' : 'Total Doses: '}</span>
                    <span className="font-mono font-bold text-xs text-white">
                      {totalDoses !== null ? totalDoses.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown row */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-400 text-[10px] font-medium">{strings.totalDropsResultLabel}</span>
                    <span className="font-mono text-cyan-300 font-bold text-xs">
                      {totalDrops !== null ? `${totalDrops.toLocaleString()} ${isUrdu ? 'قطرے' : 'drops'}` : '—'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'وائل کی گنجائش' : 'Vial Capacity'}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {coveredChildren !== null ? `${coveredChildren.toLocaleString()} ${isUrdu ? 'بچے' : 'kids'}` : '—'}
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
