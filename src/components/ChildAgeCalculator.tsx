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
    <div className={`clay-card flex flex-col justify-between p-4 sm:p-5 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="clay-num-badge w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0">
              1
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

        {/* Date Input with Info Tooltip */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <InfoTooltip
              id="dob"
              label={strings.dobLabel}
              formula={strings.dobTooltip.formula}
              fieldRule={strings.dobTooltip.fieldRule}
              explanation={strings.dobTooltip.explanation}
              isUrdu={isUrdu}
            />
            <span className="text-xs text-slate-500 font-semibold">{strings.dobSub}</span>
          </div>
          <input
            id="child-dob"
            type="date"
            max={todayString}
            value={dob}
            onChange={(e) => handleDateChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performCalculation(dob)}
            className="clay-input h-11 w-full px-3 text-sm sm:text-base font-mono font-bold text-slate-900 cursor-pointer"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 mb-2 font-bold">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            id="age-calc-btn"
            type="button"
            onClick={() => performCalculation(dob)}
            className="clay-btn-teal h-11 flex-1 px-4 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="age-reset-btn"
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
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            {strings.under5Status}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{strings.strictRuleNotice}</span>
        </div>

        {/* Prominent Under 5 YES/NO display */}
        <div className="flex items-center justify-between mb-2.5">
          {result ? (
            <div className="flex items-center gap-2.5">
              <span
                className={`clay-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black tracking-wide ${
                  result.isUnder5
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40'
                    : 'bg-rose-500/25 text-rose-300 border-rose-400/40'
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
              <span className="text-xs text-slate-300 font-bold">
                {result.isUnder5 ? strings.eligibleDesc : strings.notEligibleDesc}
              </span>
            </div>
          ) : (
            <span className="text-lg font-black text-slate-500 font-mono">—</span>
          )}
        </div>

        {/* Age Today & DOB detail */}
        <div className="pt-2.5 border-t border-slate-700/80 space-y-1 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-400 font-medium">{strings.exactAgeLabel}</span>
            <span className="font-mono text-white font-extrabold tracking-tight">
              {result ? result.ageString : '—'}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{strings.dobResultLabel}</span>
            <span className="font-mono text-slate-300 font-semibold">
              {result ? result.formattedDob : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
