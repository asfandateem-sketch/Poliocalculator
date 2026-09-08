import React, { useState, useCallback } from 'react';
import { ShieldAlert, RotateCcw, AlertTriangle } from 'lucide-react';
import {
  calculateCombinedMissedChildren,
  CombinedMissedChildrenResult,
} from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const MissedChildrenCoverageCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.missedChildren;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  // Initial state values for typical polio campaign day:
  // 120 NA reported, 105 NA covered
  // 35 Refusals reported, 25 Refusals covered
  const [reportedNA, setReportedNA] = useState<string>('120');
  const [coveredNA, setCoveredNA] = useState<string>('105');
  const [reportedRefusals, setReportedRefusals] = useState<string>('35');
  const [coveredRefusals, setCoveredRefusals] = useState<string>('25');

  const [result, setResult] = useState<CombinedMissedChildrenResult | null>(() => {
    try {
      return calculateCombinedMissedChildren(120, 105, 35, 25);
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string>('');

  const calculate = useCallback(() => {
    setError('');

    const repNA = Number(reportedNA.replace(/,/g, ''));
    const covNA = Number(coveredNA.replace(/,/g, ''));
    const repRef = Number(reportedRefusals.replace(/,/g, ''));
    const covRef = Number(coveredRefusals.replace(/,/g, ''));

    if (isNaN(repNA) || repNA < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست رپورٹ شدہ NA بچے درج کریں (0 یا اس سے زیادہ)'
          : 'Please enter valid reported NA children (≥ 0)'
      );
      triggerError();
      return;
    }
    if (isNaN(covNA) || covNA < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست کور شدہ NA بچے درج کریں (0 یا اس سے زیادہ)'
          : 'Please enter valid covered NA children (≥ 0)'
      );
      triggerError();
      return;
    }
    if (isNaN(repRef) || repRef < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست رپورٹ شدہ انکاری کیسز درج کریں (0 یا اس سے زیادہ)'
          : 'Please enter valid reported refusals (≥ 0)'
      );
      triggerError();
      return;
    }
    if (isNaN(covRef) || covRef < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست حل شدہ انکاری کیسز درج کریں (0 یا اس سے زیادہ)'
          : 'Please enter valid covered refusals (≥ 0)'
      );
      triggerError();
      return;
    }

    if (covNA > repNA) {
      setError(
        isUrdu
          ? 'کور شدہ NA بچے رپورٹ شدہ NA بچوں سے زیادہ نہیں ہو سکتے'
          : 'Covered NA cannot exceed reported NA'
      );
      triggerError();
      return;
    }
    if (covRef > repRef) {
      setError(
        isUrdu
          ? 'حل شدہ انکاری کیسز رپورٹ شدہ انکاری کیسز سے زیادہ نہیں ہو سکتے'
          : 'Covered refusals cannot exceed reported refusals'
      );
      triggerError();
      return;
    }

    try {
      const res = calculateCombinedMissedChildren(repNA, covNA, repRef, covRef);
      setResult(res);
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isUrdu
          ? 'حسابی خرابی پیش آ گئی'
          : 'Calculation error';
      setError(msg);
      setResult(null);
      triggerError();
    }
  }, [reportedNA, coveredNA, reportedRefusals, coveredRefusals, isUrdu, triggerError, triggerFeedback]);

  const handleReportedNAChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReportedNA(e.target.value);
    setError('');
  }, []);

  const handleCoveredNAChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCoveredNA(e.target.value);
    setError('');
  }, []);

  const handleReportedRefusalsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReportedRefusals(e.target.value);
    setError('');
  }, []);

  const handleCoveredRefusalsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCoveredRefusals(e.target.value);
    setError('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  const handleReset = useCallback(() => {
    setReportedNA('');
    setCoveredNA('');
    setReportedRefusals('');
    setCoveredRefusals('');
    setResult(null);
    setError('');
    triggerReset();
  }, [triggerReset]);

  return (
    <div
      id="missed-children-calculator"
      className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${
        isUrdu ? 'font-arabic' : ''
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              06
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
          <span
            className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70 flex-shrink-0"
            dir="ltr"
          >
            {strings.badge}
          </span>
        </div>

        {/* Content Layout: 2 Columns on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Inputs Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Category 1: Not Available (NA) Children */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {strings.naLabel}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isUrdu ? 'عارضی غیر موجود' : 'Absent/Away'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="missed-reported-na" className="text-xs font-medium text-slate-700 cursor-pointer">
                        {strings.reportedNaInputLabel}
                      </label>
                      <InfoTooltip data={strings.reportedNaTooltip} isUrdu={isUrdu} />
                    </div>
                    <input
                      id="missed-reported-na"
                      type="number"
                      aria-label={strings.reportedNaInputLabel}
                      inputMode="numeric"
                      min="0"
                      value={reportedNA}
                      onChange={handleReportedNAChange}
                      onKeyDown={handleKeyDown}
                      placeholder="0"
                      className="saas-input w-full px-3.5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="missed-covered-na" className="text-xs font-medium text-slate-700 cursor-pointer">
                        {strings.coveredNaInputLabel}
                      </label>
                      <InfoTooltip data={strings.coveredNaTooltip} isUrdu={isUrdu} />
                    </div>
                    <input
                      id="missed-covered-na"
                      type="number"
                      aria-label={strings.coveredNaInputLabel}
                      inputMode="numeric"
                      min="0"
                      value={coveredNA}
                      onChange={handleCoveredNAChange}
                      onKeyDown={handleKeyDown}
                      placeholder="0"
                      className="saas-input w-full px-3.5"
                    />
                  </div>
                </div>
              </div>

              {/* Category 2: Refusals Children */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {strings.refusalLabel}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isUrdu ? 'انکاری کیسز' : 'Parental Refusal'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="missed-reported-refusal" className="text-xs font-medium text-slate-700 cursor-pointer">
                        {strings.reportedRefusalInputLabel}
                      </label>
                      <InfoTooltip data={strings.reportedRefusalTooltip} isUrdu={isUrdu} />
                    </div>
                    <input
                      id="missed-reported-refusal"
                      type="number"
                      aria-label={strings.reportedRefusalInputLabel}
                      inputMode="numeric"
                      min="0"
                      value={reportedRefusals}
                      onChange={handleReportedRefusalsChange}
                      onKeyDown={handleKeyDown}
                      placeholder="0"
                      className="saas-input w-full px-3.5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="missed-covered-refusal" className="text-xs font-medium text-slate-700 cursor-pointer">
                        {strings.coveredRefusalInputLabel}
                      </label>
                      <InfoTooltip data={strings.coveredRefusalTooltip} isUrdu={isUrdu} />
                    </div>
                    <input
                      id="missed-covered-refusal"
                      type="number"
                      aria-label={strings.coveredRefusalInputLabel}
                      inputMode="numeric"
                      min="0"
                      value={coveredRefusals}
                      onChange={handleCoveredRefusalsChange}
                      onKeyDown={handleKeyDown}
                      placeholder="0"
                      className="saas-input w-full px-3.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-semibold animate-error-shake">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="missed-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="missed-reset-btn"
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
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                    {strings.combinedCoveragePercentLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCalculated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/40 animate-micro-fade-in">
                        ✓ {isUrdu ? 'حساب شدہ' : 'Updated'}
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        result === null
                          ? 'badge-neutral'
                          : result.status === 'OPTIMAL'
                          ? 'badge-optimal'
                          : result.status === 'ACCEPTABLE'
                          ? 'badge-acceptable'
                          : 'badge-warning'
                      }`}
                    >
                      {result !== null ? result.status : strings.statusBadge}
                    </span>
                  </div>
                </div>

                {/* Primary Metric */}
                <div className="flex items-baseline justify-between mb-3 pb-2.5 border-b border-slate-800/80">
                  <div>
                    <div
                      key={`missed-pct-${calculationKey}`}
                      dir="ltr"
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isCalculated ? 'animate-number-pop' : ''
                      } ${
                        result === null || result.combinedCoveragePercent === null
                          ? 'text-slate-300'
                          : result.combinedCoveragePercent >= 90
                          ? 'text-emerald-400'
                          : result.combinedCoveragePercent >= 80
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result !== null
                        ? result.combinedCoveragePercent !== null
                          ? `${result.combinedCoveragePercent}%`
                          : 'N/A'
                        : '—'}
                    </div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {result !== null
                        ? `${result.totalCoveredMissed} / ${result.totalReportedMissed} ${isUrdu ? 'بچے کور ہوئے' : 'children covered'}`
                        : isUrdu
                        ? 'مجموعی فیصد کوریج'
                        : 'Combined recovery %'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">
                      {strings.remainingCombinedMissedLabel}
                    </span>
                    <span
                      dir="ltr"
                      className={`font-mono font-bold text-lg sm:text-xl ${
                        result && result.totalRemainingMissed > 0
                          ? 'text-amber-300'
                          : 'text-emerald-300'
                      }`}
                    >
                      {result !== null ? result.totalRemainingMissed.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2.5">
                <div className="saas-result-cell p-2">
                  <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                    {isUrdu ? 'کل رپورٹ شدہ' : 'Total Reported'}
                  </span>
                  <span className="font-mono text-white font-bold text-xs sm:text-sm" dir="ltr">
                    {result !== null ? result.totalReportedMissed.toLocaleString() : '—'}
                  </span>
                </div>

                <div className="saas-result-cell p-2">
                  <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                    {isUrdu ? 'کل کور شدہ' : 'Total Covered'}
                  </span>
                  <span className="font-mono text-emerald-300 font-bold text-xs sm:text-sm" dir="ltr">
                    {result !== null ? result.totalCoveredMissed.toLocaleString() : '—'}
                  </span>
                </div>

                <div className="saas-result-cell p-2">
                  <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                    {strings.naRecoveryLabel}
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-xs sm:text-sm" dir="ltr">
                    {result !== null && result.naCoveragePercent !== null
                      ? `${result.naCoveragePercent}%`
                      : '—'}
                  </span>
                </div>

                <div className="saas-result-cell p-2">
                  <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                    {strings.refusalResolutionLabel}
                  </span>
                  <span className="font-mono text-amber-300 font-bold text-xs sm:text-sm" dir="ltr">
                    {result !== null && result.refusalCoveragePercent !== null
                      ? `${result.refusalCoveragePercent}%`
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Vials and Drops Required */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  {strings.vialsForCombinedLabel}:
                </span>
                <span className="font-mono text-teal-300 font-bold text-xs sm:text-sm" dir="ltr">
                  {result !== null
                    ? `${result.vialsRequiredForRemaining} vials (${result.dropsRequiredForRemaining.toLocaleString()} drops)`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
