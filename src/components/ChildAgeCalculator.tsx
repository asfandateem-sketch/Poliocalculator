import React, { useState } from 'react';
import { Calendar, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { calculateChildAge, ChildAgeResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const ChildAgeCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.childAge;

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Default sample DOB for field workers: 2 years ago today
  const defaultDob = `${today.getFullYear() - 2}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [dob, setDob] = useState<string>(defaultDob);
  const [result, setResult] = useState<ChildAgeResult | null>(() => {
    try {
      const [y, m, d] = defaultDob.split('-').map(Number);
      return calculateChildAge(new Date(y, m - 1, d), today);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const performCalculation = (dobVal: string) => {
    setError('');
    if (!dobVal) {
      setError(isUrdu ? 'براہ کرم درست تاریخِ پیدائش منتخب کریں' : 'Please select a valid date of birth');
      setResult(null);
      return;
    }

    const parts = dobVal.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      setError(isUrdu ? 'براہ کرم درست تاریخِ پیدائش منتخب کریں' : 'Please select a valid date of birth');
      setResult(null);
      return;
    }

    const [year, month, day] = parts;
    const selectedDate = new Date(year, month - 1, day);

    try {
      const res = calculateChildAge(selectedDate, new Date());
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'تاریخِ پیدائش درست نہیں' : 'Invalid date of birth';
      setError(msg);
      setResult(null);
    }
  };

  const handleDateChange = (newDob: string) => {
    setDob(newDob);
    if (newDob) {
      performCalculation(newDob);
    } else {
      setResult(null);
      setError('');
    }
  };

  const handleReset = () => {
    setDob('');
    setResult(null);
    setError('');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-200/60 shadow-2xs flex-shrink-0">
              1
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

        {/* Date Input with Info Tooltip */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <InfoTooltip
              id="dob"
              label={strings.dobLabel}
              formula={strings.dobTooltip.formula}
              fieldRule={strings.dobTooltip.fieldRule}
              explanation={strings.dobTooltip.explanation}
              isUrdu={isUrdu}
            />
            <span className="text-[10px] text-slate-400">{strings.dobSub}</span>
          </div>
          <input
            id="child-dob"
            type="date"
            max={todayString}
            value={dob}
            onChange={(e) => handleDateChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performCalculation(dob)}
            className="h-9 w-full px-3 text-xs font-mono bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs font-medium text-slate-900 cursor-pointer"
          />
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 mb-2 font-medium">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            id="age-calc-btn"
            type="button"
            onClick={() => performCalculation(dob)}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="age-reset-btn"
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
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            {strings.under5Status}
          </span>
          <span className="text-[10px] text-slate-400">{strings.strictRuleNotice}</span>
        </div>

        {/* Prominent Under 5 YES/NO display */}
        <div className="flex items-center justify-between mb-2">
          {result ? (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-black tracking-wide ${
                  result.isUnder5
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                }`}
              >
                {result.isUnder5 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {strings.eligibleYes}
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    {strings.eligibleNo}
                  </>
                )}
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {result.isUnder5 ? strings.eligibleDesc : strings.notEligibleDesc}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-slate-500 font-mono">—</span>
          )}
        </div>

        {/* Age Today & DOB detail */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-400">{strings.exactAgeLabel}</span>
            <span className="font-mono text-white font-bold tracking-tight">
              {result ? result.ageString : '—'}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-[10px]">
            <span className="text-slate-500">{strings.dobResultLabel}</span>
            <span className="font-mono text-slate-300 font-medium">
              {result ? result.formattedDob : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
