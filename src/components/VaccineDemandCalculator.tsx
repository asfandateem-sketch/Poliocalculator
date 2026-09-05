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
    <div className={`clay-card flex flex-col justify-between p-4 sm:p-5 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="clay-num-badge w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0">
              2
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {strings.title}
            </h2>
          </div>
          <span className="clay-badge text-[11px] font-mono text-teal-800 bg-teal-50 px-3 py-1 rounded-xl font-bold flex-shrink-0" dir="ltr">
            {strings.badge}
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {strings.purpose}
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <InfoTooltip
                id="demand-target"
                label={strings.targetLabel}
                formula={strings.targetTooltip.formula}
                fieldRule={strings.targetTooltip.fieldRule}
                explanation={strings.targetTooltip.explanation}
                isUrdu={isUrdu}
              />
              <span className="text-xs text-slate-500 font-semibold">bOPV (2 drops)</span>
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
              className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
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
              placeholder="5%"
              value={bufferPct}
              onChange={(e) => {
                setBufferPct(e.target.value);
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
            id="demand-calc-btn"
            type="button"
            onClick={calculate}
            className="clay-btn-teal h-11 flex-1 px-4 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="demand-reset-btn"
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
            <Package className="w-3.5 h-3.5 text-teal-400" />
            {strings.vialsResultLabel}
          </span>
          <span className="text-[10px] text-teal-300 font-mono font-bold" dir="ltr">CEIL(N ÷ 20)</span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {vialsRequired !== null ? vialsRequired.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-bold text-teal-300">
              {isUrdu ? 'وائلز' : 'Vials'}
            </span>
            {bufferVials !== null && bufferVials > 0 && (
              <span className="clay-badge text-[10px] text-amber-300 bg-amber-950/60 border-amber-700/60 px-2 py-0.5 rounded-lg font-mono font-bold">
                +{bufferVials} {isUrdu ? 'بفر' : 'buffer'}
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">{isUrdu ? 'کل خوراکیں: ' : 'Total Doses: '}</span>
            <span className="font-mono font-extrabold text-xs text-white">
              {totalDoses !== null ? totalDoses.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Breakdown row: Total Doses, Total Drops, Children Covered */}
        <div className="clay-dark-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="block text-slate-400 text-[10px] font-medium">{strings.totalDropsResultLabel}</span>
              <span className="font-mono text-cyan-300 font-extrabold text-xs">
                {totalDrops !== null ? `${totalDrops.toLocaleString()} ${isUrdu ? 'قطرے' : 'drops'}` : '—'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'وائل کی گنجائش' : 'Vial Capacity'}</span>
            <span className="font-mono text-emerald-300 font-extrabold text-xs">
              {coveredChildren !== null ? `${coveredChildren.toLocaleString()} ${isUrdu ? 'بچے' : 'kids'}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
