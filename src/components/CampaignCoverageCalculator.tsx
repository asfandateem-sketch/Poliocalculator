import React, { useState } from 'react';
import { Award, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { calculateCoverage } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  compact?: boolean;
}

export const CampaignCoverageCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.campaignCoverage;

  const [targetChildren, setTargetChildren] = useState<string>('5000');
  const [vaccinatedChildren, setVaccinatedChildren] = useState<string>('4750');
  const [coveragePct, setCoveragePct] = useState<number | null>(95.0);
  const [isTargetMet, setIsTargetMet] = useState<boolean>(true);
  const [vaccinatedResult, setVaccinatedResult] = useState<number | null>(4750);
  const [remainingChildren, setRemainingChildren] = useState<number | null>(250);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const target = Number(targetChildren.replace(/,/g, ''));
    const vaccinated = Number(vaccinatedChildren.replace(/,/g, ''));

    if (isNaN(target) || target <= 0) {
      setError(isUrdu ? 'براہ کرم درست ہدف درج کریں (> 0)' : 'Please enter a valid target children (> 0)');
      return;
    }
    if (isNaN(vaccinated) || vaccinated < 0) {
      setError(isUrdu ? 'براہ کرم درست ویکسین شدہ بچے درج کریں (≥ 0)' : 'Please enter valid vaccinated children (≥ 0)');
      return;
    }

    try {
      const result = calculateCoverage(target, vaccinated);
      setCoveragePct(result.coveragePercent);
      setIsTargetMet(result.coveragePercent >= 95.0);
      setVaccinatedResult(result.childrenVaccinated);
      setRemainingChildren(result.remainingChildren);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid input values';
      setError(msg);
    }
  };

  const handleReset = () => {
    setTargetChildren('');
    setVaccinatedChildren('');
    setCoveragePct(null);
    setIsTargetMet(false);
    setVaccinatedResult(null);
    setRemainingChildren(null);
    setError('');
  };

  return (
    <div className={`saas-card p-5 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              07
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                  className="saas-input w-full px-3.5"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="coverage-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="coverage-reset-btn"
                type="button"
                onClick={handleReset}
                title={strings.resetBtn}
                className="saas-btn-secondary px-3.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{strings.resetBtn}</span>
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-6">
            <div className="saas-result-card p-4 sm:p-5 flex flex-col justify-between h-full min-h-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    {strings.coverageAchievedLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">{strings.benchmarkLabel}</span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
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
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      coveragePct === null
                        ? 'badge-neutral'
                        : isTargetMet
                        ? 'badge-optimal'
                        : 'badge-acceptable'
                    }`}
                  >
                    {coveragePct !== null ? (
                      isTargetMet ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          {strings.targetMetBadge}
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {strings.inProgressBadge}
                        </>
                      )
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
              </div>

              {/* Vaccinated Children & Remaining Children */}
              <div className="saas-result-cell p-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.vaccinatedLabelResult}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs sm:text-sm">
                    {vaccinatedResult !== null ? `${vaccinatedResult.toLocaleString()} ${isUrdu ? 'بچے' : 'children'}` : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{strings.remainingLabelResult}</span>
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm ${
                      remainingChildren && remainingChildren > 0 ? 'text-amber-300' : 'text-slate-200'
                    }`}
                  >
                    {remainingChildren !== null ? `${remainingChildren.toLocaleString()} ${isUrdu ? 'بچے' : 'children'}` : '—'}
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
