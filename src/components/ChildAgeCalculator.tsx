import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { calculateChildAge, ChildAgeResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const ChildAgeCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.childAge;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const { todayString, defaultDob } = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const defaultDobStr = `${today.getFullYear() - 2}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return { todayString: todayStr, defaultDob: defaultDobStr };
  }, []);

  const [campaignDate, setCampaignDate] = useState<string>(todayString);
  const [dob, setDob] = useState<string>(defaultDob);
  const [result, setResult] = useState<ChildAgeResult | null>(() => {
    try {
      const [y, m, d] = defaultDob.split('-').map(Number);
      return calculateChildAge(new Date(y, m - 1, d), new Date());
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string>('');

  const performCalculation = useCallback((dobVal: string, campDateVal: string = campaignDate) => {
    setError('');
    if (!dobVal) {
      setError(isUrdu ? 'براہ کرم درست تاریخِ پیدائش منتخب کریں' : 'Please select a valid date of birth');
      setResult(null);
      triggerError();
      return;
    }

    const parts = dobVal.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      setError(isUrdu ? 'براہ کرم درست تاریخِ پیدائش منتخب کریں' : 'Please select a valid date of birth');
      setResult(null);
      triggerError();
      return;
    }

    let asOf = new Date();
    if (campDateVal) {
      const campParts = campDateVal.split('-').map(Number);
      if (campParts.length === 3 && !campParts.some(isNaN)) {
        asOf = new Date(campParts[0], campParts[1] - 1, campParts[2]);
      }
    }

    const [year, month, day] = parts;
    const selectedDate = new Date(year, month - 1, day);

    try {
      const res = calculateChildAge(selectedDate, asOf);
      setResult(res);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'تاریخِ پیدائش درست نہیں' : 'Invalid date of birth';
      setError(msg);
      setResult(null);
      triggerError();
    }
  }, [campaignDate, isUrdu, triggerError, triggerFeedback]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    setDob(newDob);
    if (newDob) {
      performCalculation(newDob, campaignDate);
    } else {
      setResult(null);
      setError('');
      triggerReset();
    }
  }, [campaignDate, performCalculation, triggerReset]);

  const handleCampaignDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newCampDate = e.target.value;
    setCampaignDate(newCampDate);
    if (dob) {
      performCalculation(dob, newCampDate);
    }
  }, [dob, performCalculation]);

  const handleReset = useCallback(() => {
    setCampaignDate(todayString);
    setDob('');
    setResult(null);
    setError('');
    triggerReset();
  }, [todayString, triggerReset]);

  const handleCalculateClick = useCallback(() => {
    performCalculation(dob, campaignDate);
  }, [dob, campaignDate, performCalculation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performCalculation(dob, campaignDate);
    }
  }, [dob, campaignDate, performCalculation]);

  return (
    <div className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              01
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
            <div className="space-y-3">
              <div>
                <label htmlFor="campaign-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isUrdu ? 'مہم کی تاریخ (Campaign Date)' : 'Campaign Date'}
                </label>
                <input
                  id="campaign-date"
                  type="date"
                  aria-label={isUrdu ? 'مہم کی تاریخ (Campaign Date)' : 'Campaign Date'}
                  value={campaignDate}
                  onChange={handleCampaignDateChange}
                  className="saas-input w-full px-3.5 text-sm sm:text-base cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <InfoTooltip
                    id="dob"
                    htmlFor="child-dob"
                    label={strings.dobLabel}
                    formula={strings.dobTooltip.formula}
                    fieldRule={strings.dobTooltip.fieldRule}
                    explanation={strings.dobTooltip.explanation}
                    isUrdu={isUrdu}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">{strings.dobSub}</span>
                </div>
                <input
                  id="child-dob"
                  type="date"
                  aria-label={strings.dobLabel}
                  max={campaignDate || todayString}
                  value={dob}
                  onChange={handleDateChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3.5 text-sm sm:text-base cursor-pointer"
                />
                {error && (
                  <p className="text-xs text-rose-600 mt-2 font-semibold animate-error-shake">{error}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="age-calc-btn"
                type="button"
                onClick={handleCalculateClick}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="age-reset-btn"
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
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    {strings.under5Status}
                  </span>
                  {isCalculated ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                      ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">{strings.strictRuleNotice}</span>
                  )}
                </div>

                {/* Hero Under-5 Status Display */}
                <div className="flex items-center gap-2.5 my-2">
                  {result ? (
                    <div
                      key={calculationKey}
                      className={`flex items-center gap-2.5 flex-wrap ${
                        isCalculated ? 'animate-number-pop' : ''
                      }`}
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black tracking-wide ${
                          result.isUnder5
                            ? 'badge-optimal'
                            : 'badge-warning'
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
                      <span className="text-xs text-slate-200 font-medium">
                        {result.isUnder5 ? strings.eligibleDesc : strings.notEligibleDesc}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-slate-500 font-mono">—</span>
                  )}
                </div>
              </div>

              {/* Exact Age Details */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-400 font-medium">{strings.exactAgeLabel}</span>
                  <span className="font-mono text-white font-bold tracking-tight">
                    {result ? result.ageString : '—'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{strings.dobResultLabel}</span>
                  <span className="font-mono text-slate-300 font-medium">
                    {result ? result.formattedDob : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
