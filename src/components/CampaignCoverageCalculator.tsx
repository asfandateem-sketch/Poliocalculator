import React, { useState } from 'react';
import { Award, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const CampaignCoverageCalculator: React.FC<Props> = ({ compact = true }) => {
  const { isUrdu, t } = useLanguage();
  const strings = t.campaignCoverage;

  const [targetChildren, setTargetChildren] = useState<string>('5000');
  const [vaccinatedChildren, setVaccinatedChildren] = useState<string>('4750');
  const [coveragePct, setCoveragePct] = useState<number | null>(95.0);
  const [vaccinatedResult, setVaccinatedResult] = useState<number | null>(4750);
  const [remainingChildren, setRemainingChildren] = useState<number | null>(250);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const target = Number(targetChildren.replace(/,/g, ''));
    const vac = Number(vaccinatedChildren.replace(/,/g, ''));

    if (isNaN(target) || target < 0) {
      setError(isUrdu ? 'براہ کرم درست ہدف بچے درج کریں (≥ 0)' : 'Enter valid target children (≥ 0)');
      return;
    }
    if (isNaN(vac) || vac < 0) {
      setError(isUrdu ? 'براہ کرم درست ویکسین شدہ بچے درج کریں (≥ 0)' : 'Enter valid vaccinated children (≥ 0)');
      return;
    }
    if (vac > target) {
      setError(isUrdu ? 'ویکسین شدہ بچے ہدف بچوں سے زیادہ نہیں ہو سکتے' : 'Vaccinated children cannot exceed target children');
      return;
    }

    const coverage = target > 0 ? Math.round(((vac / target) * 100) * 10) / 10 : 0;
    const remaining = Math.max(0, target - vac);

    setCoveragePct(coverage);
    setVaccinatedResult(vac);
    setRemainingChildren(remaining);
  };

  const handleReset = () => {
    setTargetChildren('');
    setVaccinatedChildren('');
    setCoveragePct(null);
    setVaccinatedResult(null);
    setRemainingChildren(null);
    setError('');
  };

  const isTargetMet = coveragePct !== null && coveragePct >= 95;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-200/60 shadow-2xs flex-shrink-0">
              4
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {strings.title}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0" dir="ltr">
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
                id="coverage-target"
                label={strings.targetLabel}
                formula={strings.targetTooltip.formula}
                fieldRule={strings.targetTooltip.fieldRule}
                explanation={strings.targetTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="coverage-target-input"
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
                id="coverage-vac"
                label={strings.vaccinatedLabel}
                formula={strings.vaccinatedTooltip.formula}
                fieldRule={strings.vaccinatedTooltip.fieldRule}
                explanation={strings.vaccinatedTooltip.explanation}
                isUrdu={isUrdu}
              />
            </div>
            <input
              id="coverage-vac-input"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 4750"
              value={vaccinatedChildren}
              onChange={(e) => {
                setVaccinatedChildren(e.target.value);
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
            id="coverage-calc-btn"
            type="button"
            onClick={calculate}
            className="h-9 flex-1 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {strings.calculateBtn}
          </button>
          <button
            id="coverage-reset-btn"
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
            <Award className="w-3.5 h-3.5 text-teal-400" />
            {strings.coverageAchievedLabel}
          </span>
          <span className="text-[10px] text-slate-400">{strings.benchmarkLabel}</span>
        </div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span
              dir="ltr"
              className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                coveragePct === null
                  ? 'text-white'
                  : isTargetMet
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {coveragePct !== null ? `${coveragePct}%` : '—'}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
              coveragePct === null
                ? 'text-slate-400'
                : isTargetMet
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {coveragePct !== null ? (
              isTargetMet ? (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {strings.targetMetBadge}
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-400" />
                  {strings.inProgressBadge}
                </>
              )
            ) : (
              '—'
            )}
          </span>
        </div>

        {/* Vaccinated Children & Remaining Children */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">{strings.vaccinatedLabelResult}</span>
            <span className="font-mono text-emerald-300 font-bold text-[11px]">
              {vaccinatedResult !== null ? `${vaccinatedResult.toLocaleString()} ${isUrdu ? 'بچے' : 'children'}` : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-slate-500">{strings.remainingLabelResult}</span>
            <span
              className={`font-mono font-bold text-[11px] ${
                remainingChildren && remainingChildren > 0 ? 'text-amber-300' : 'text-slate-200'
              }`}
            >
              {remainingChildren !== null ? `${remainingChildren.toLocaleString()} ${isUrdu ? 'بچے' : 'children'}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
