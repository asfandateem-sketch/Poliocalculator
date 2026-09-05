import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, CheckCircle2, AlertTriangle, Users, FileText } from 'lucide-react';
import { calculateCombinedMissedChildren, CombinedMissedChildrenResult } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const MissedChildrenCoverageCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.missedChildren;

  // 4 Primary Inputs requested: Reported NA, Covered NA, Reported Refusals, Covered Refusals
  const [reportedNA, setReportedNA] = useState<string>('100');
  const [coveredNA, setCoveredNA] = useState<string>('85');
  const [reportedRefusals, setReportedRefusals] = useState<string>('50');
  const [coveredRefusals, setCoveredRefusals] = useState<string>('40');

  const [result, setResult] = useState<CombinedMissedChildrenResult | null>(() => {
    try {
      return calculateCombinedMissedChildren(100, 85, 50, 40);
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const rNa = Number(reportedNA.replace(/,/g, ''));
    const cNa = Number(coveredNA.replace(/,/g, ''));
    const rRef = Number(reportedRefusals.replace(/,/g, ''));
    const cRef = Number(coveredRefusals.replace(/,/g, ''));

    if (isNaN(rNa) || rNa < 0 || isNaN(rRef) || rRef < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست رپورٹ شدہ تعداد درج کریں (≥ 0)'
          : 'Please enter valid reported numbers (≥ 0)'
      );
      return;
    }

    if (isNaN(cNa) || cNa < 0 || isNaN(cRef) || cRef < 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست کور شدہ تعداد درج کریں (≥ 0)'
          : 'Please enter valid covered numbers (≥ 0)'
      );
      return;
    }

    if (cNa > rNa) {
      setError(
        isUrdu
          ? 'کور شدہ NA رپورٹ شدہ NA سے زیادہ نہیں ہو سکتے'
          : 'Covered NA cannot exceed Reported NA'
      );
      return;
    }

    if (cRef > rRef) {
      setError(
        isUrdu
          ? 'کور شدہ انکاری رپورٹ شدہ انکاری سے زیادہ نہیں ہو سکتے'
          : 'Covered Refusals cannot exceed Reported Refusals'
      );
      return;
    }

    try {
      const res = calculateCombinedMissedChildren(rNa, cNa, rRef, cRef);
      setResult(res);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Calculation error';
      setError(msg);
      setResult(null);
    }
  };

  const handleReset = () => {
    setReportedNA('');
    setCoveredNA('');
    setReportedRefusals('');
    setCoveredRefusals('');
    setResult(null);
    setError('');
  };

  const handleSetDefaults = () => {
    setReportedNA('100');
    setCoveredNA('85');
    setReportedRefusals('50');
    setCoveredRefusals('40');
    setError('');
    setResult(calculateCombinedMissedChildren(100, 85, 50, 40));
  };

  return (
    <div
      id="missed-children-calculator"
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between p-4 sm:p-5 h-full ${
        isUrdu ? 'font-arabic' : ''
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-sm flex items-center justify-center border border-indigo-200/80 shadow-2xs flex-shrink-0">
              {strings.num}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {strings.title}
            </h2>
          </div>
          <span
            className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0"
            dir="ltr"
          >
            {strings.badge}
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
          {strings.purpose}
        </p>

        {/* 4 Inputs Grid: Reported NA, Covered NA, Reported Refusals, Covered Refusals */}
        <div className="space-y-3 mb-3.5">
          {/* Category 1: Not Available (NA) Children */}
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80">
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
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{strings.reportedNaInputLabel}</span>
                  <InfoTooltip data={strings.reportedNaTooltip} />
                </label>
                <input
                  id="missed-reported-na"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={reportedNA}
                  onChange={(e) => setReportedNA(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full px-3 text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{strings.coveredNaInputLabel}</span>
                  <InfoTooltip data={strings.coveredNaTooltip} />
                </label>
                <input
                  id="missed-covered-na"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={coveredNA}
                  onChange={(e) => setCoveredNA(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full px-3 text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category 2: Refusals Children */}
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80">
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
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{strings.reportedRefusalInputLabel}</span>
                  <InfoTooltip data={strings.reportedRefusalTooltip} />
                </label>
                <input
                  id="missed-reported-refusal"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={reportedRefusals}
                  onChange={(e) => setReportedRefusals(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full px-3 text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>{strings.coveredRefusalInputLabel}</span>
                  <InfoTooltip data={strings.coveredRefusalTooltip} />
                </label>
                <input
                  id="missed-covered-refusal"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={coveredRefusals}
                  onChange={(e) => setCoveredRefusals(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full px-3 text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 mb-3 flex items-center gap-2 text-xs text-rose-700 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3.5">
          <button
            id="missed-calc-btn"
            type="button"
            onClick={calculate}
            className="h-11 flex-1 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="missed-reset-btn"
            type="button"
            onClick={handleReset}
            title={strings.resetBtn}
            className="h-11 px-3 text-slate-600 hover:text-slate-900 active:scale-[0.95] border border-slate-300 rounded-xl hover:bg-slate-100 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 text-xs font-bold flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{strings.resetBtn}</span>
          </button>
        </div>
      </div>

      {/* Result Box: Total Combined Missed Children and Recovery % */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 sm:p-4 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            {strings.combinedCoveragePercentLabel}
          </span>
          <span
            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
              result === null
                ? 'bg-slate-800 text-slate-400'
                : result.status === 'OPTIMAL'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/70'
                : result.status === 'ACCEPTABLE'
                ? 'bg-amber-950 text-amber-300 border border-amber-700/70'
                : 'bg-rose-950 text-rose-300 border border-rose-700/70'
            }`}
          >
            {result !== null ? result.status : strings.statusBadge}
          </span>
        </div>

        {/* Primary Metric: Combined Coverage % and Total Remaining Still Missed */}
        <div className="flex items-baseline justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div>
            <div
              dir="ltr"
              className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
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
              className={`font-mono font-black text-lg sm:text-xl ${
                result && result.totalRemainingMissed > 0
                  ? 'text-amber-300'
                  : 'text-emerald-300'
              }`}
            >
              {result !== null ? result.totalRemainingMissed.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Breakdown of Combined Missed Children Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2.5">
          <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
            <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
              {isUrdu ? 'کل رپورٹ شدہ مسڈ' : 'Total Reported'}
            </span>
            <span className="font-mono text-white font-bold text-sm" dir="ltr">
              {result !== null ? result.totalReportedMissed.toLocaleString() : '—'}
            </span>
          </div>

          <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
            <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
              {isUrdu ? 'کل کور شدہ مسڈ' : 'Total Covered'}
            </span>
            <span className="font-mono text-emerald-300 font-bold text-sm" dir="ltr">
              {result !== null ? result.totalCoveredMissed.toLocaleString() : '—'}
            </span>
          </div>

          <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
            <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
              {strings.naRecoveryLabel}
            </span>
            <span className="font-mono text-cyan-300 font-bold text-sm" dir="ltr">
              {result !== null && result.naCoveragePercent !== null
                ? `${result.naCoveragePercent}%`
                : '—'}
            </span>
          </div>

          <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
            <span className="block text-[10px] text-slate-400 mb-0.5 font-medium">
              {strings.refusalResolutionLabel}
            </span>
            <span className="font-mono text-amber-300 font-bold text-sm" dir="ltr">
              {result !== null && result.refusalCoveragePercent !== null
                ? `${result.refusalCoveragePercent}%`
                : '—'}
            </span>
          </div>
        </div>

        {/* Vials and Drops Required for Remaining Combined Missed Children */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">
            {strings.vialsForCombinedLabel}:
          </span>
          <span className="font-mono text-indigo-300 font-bold text-xs sm:text-sm" dir="ltr">
            {result !== null
              ? `${result.vialsRequiredForRemaining} vials (${result.dropsRequiredForRemaining.toLocaleString()} drops)`
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};
