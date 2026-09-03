import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Droplets, Package, ShieldAlert } from 'lucide-react';
import { calculateVaccineDemand } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const VaccineDemandCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.vaccineDemand;

  const [targetChildren, setTargetChildren] = useState<string>('5000');
  const [bufferPct, setBufferPct] = useState<string>('5');
  const [vialsRequired, setVialsRequired] = useState<number | null>(250);
  const [bufferVials, setBufferVials] = useState<number | null>(13);
  const [totalDoses, setTotalDoses] = useState<number | null>(5000);
  const [totalDrops, setTotalDrops] = useState<number | null>(10000);
  const [coveredChildren, setCoveredChildren] = useState<number | null>(5000);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const children = Number(targetChildren.replace(/,/g, ''));
    if (isNaN(children) || children < 0) {
      setError(isUrdu ? 'براہ کرم درست تعداد درج کریں (≥ 0)' : 'Please enter a valid number of children (≥ 0)');
      return;
    }

    const buffer = bufferPct ? Number(bufferPct) : 0;
    if (isNaN(buffer) || buffer < 0 || buffer > 100) {
      setError(isUrdu ? 'حفاظتی بفر 0 سے 100 فیصد کے درمیان ہونا چاہیے' : 'Buffer percentage must be between 0 and 100');
      return;
    }

    try {
      const result = calculateVaccineDemand(children);
      const baseVials = result.vialsRequired;
      const calculatedBuffer = Math.ceil(baseVials * (buffer / 100));

      setVialsRequired(baseVials + calculatedBuffer);
      setBufferVials(calculatedBuffer);
      setTotalDoses(result.totalDoses);
      setTotalDrops(result.totalDropsRequired);
      setCoveredChildren(result.childrenCoveredByVials);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Calculation error';
      setError(msg);
    }
  };

  const handleReset = () => {
    setTargetChildren('');
    setBufferPct('0');
    setVialsRequired(null);
    setBufferVials(null);
    setTotalDoses(null);
    setTotalDrops(null);
    setCoveredChildren(null);
    setError('');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-200/60 shadow-2xs flex-shrink-0">
              2
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {strings.title}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 font-semibold flex-shrink-0">
            {strings.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5 leading-normal line-clamp-1">
          {strings.purpose}
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <InfoTooltip
                id="demand-target"
                label={strings.targetLabel}
                formula={strings.targetTooltip.formula}
                fieldRule={strings.targetTooltip.fieldRule}
                explanation={strings.targetTooltip.explanation}
                isUrdu={isUrdu}
              />
              <span className="text-[10px] text-slate-400">bOPV (2 drops)</span>
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
              className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
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
              placeholder="5%"
              value={bufferPct}
              onChange={(e) => {
                setBufferPct(e.target.value);
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
            id="demand-calc-btn"
            type="button"
            onClick={calculate}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="demand-reset-btn"
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
            <Package className="w-3.5 h-3.5 text-teal-400" />
            {strings.vialsResultLabel}
          </span>
          <span className="text-[10px] text-teal-300 font-mono" dir="ltr">CEIL(N ÷ 20)</span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {vialsRequired !== null ? vialsRequired.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-semibold text-teal-300">
              {isUrdu ? 'وائلز' : 'Vials'}
            </span>
            {bufferVials !== null && bufferVials > 0 && (
              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded font-mono">
                +{bufferVials} {isUrdu ? 'بفر' : 'buffer'}
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">{isUrdu ? 'کل خوراکیں: ' : 'Total Doses: '}</span>
            <span className="font-mono font-bold text-xs text-white">
              {totalDoses !== null ? totalDoses.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Breakdown row: Total Doses, Total Drops, Children Covered */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="block text-slate-500">{strings.totalDropsResultLabel}</span>
              <span className="font-mono text-cyan-300 font-bold text-[11px]">
                {totalDrops !== null ? `${totalDrops.toLocaleString()} ${isUrdu ? 'قطرے' : 'drops'}` : '—'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{isUrdu ? 'وائل کی گنجائش' : 'Vial Capacity'}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {coveredChildren !== null ? `${coveredChildren.toLocaleString()} ${isUrdu ? 'بچے' : 'kids'}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
