import React, { useState, useCallback } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateVaccineWastageFromVials, VialWastageResult, BOPV_CONSTANTS } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const VaccineWastageCalculator: React.FC<Props> = React.memo(() => {
  const { isUrdu, t } = useLanguage();
  const strings = t.vaccineWastage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const [vialsIssued, setVialsIssued] = useState<string>('50');
  const [childrenVaccinated, setChildrenVaccinated] = useState<string>('950');
  const [result, setResult] = useState<{
    vials: number;
    totalDoses: number;
    vaccinated: number;
    wasted: number;
    wastagePercent: number;
  } | null>(() => ({
    vials: 50,
    totalDoses: 1000,
    vaccinated: 950,
    wasted: 50,
    wastagePercent: 5.0,
  }));
  const [error, setError] = useState<string>('');

  const computeResult = useCallback((vialsStr: string, vacStr: string, isExplicitSubmit = false) => {
    const trimmedVials = vialsStr.trim();
    const trimmedVac = vacStr.trim();

    if (trimmedVials === '' || trimmedVac === '') {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم دونوں فیلڈز مکمل کریں' : 'Please enter both Vials Issued and Children Vaccinated');
        triggerError();
      } else {
        setError('');
      }
      return;
    }

    const vials = Number(trimmedVials.replace(/,/g, ''));
    const vaccinated = Number(trimmedVac.replace(/,/g, ''));

    if (isNaN(vials) || vials <= 0) {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم جاری کردہ درست وائلز درج کریں (> 0)' : 'Please enter valid vials issued (> 0)');
        triggerError();
      }
      return;
    }
    if (isNaN(vaccinated) || vaccinated < 0) {
      if (isExplicitSubmit) {
        setError(isUrdu ? 'براہ کرم ویکسین کیے گئے درست بچے درج کریں (≥ 0)' : 'Please enter valid children vaccinated (≥ 0)');
        triggerError();
      }
      return;
    }
    const totalDosesSupplied = vials * 20;
    if (vaccinated > totalDosesSupplied) {
      if (isExplicitSubmit) {
        setError(
          isUrdu
            ? `ویکسین شدہ بچے (${vaccinated}) کل جاری کردہ خوراکوں (${totalDosesSupplied.toLocaleString()} از ${vials} وائلز) سے زیادہ نہیں ہو سکتے`
            : `Children vaccinated (${vaccinated.toLocaleString()}) cannot exceed total doses issued (${totalDosesSupplied.toLocaleString()} from ${vials} vials)`
        );
        triggerError();
      }
      return;
    }

    setError('');
    const wasted = totalDosesSupplied - vaccinated;
    const pct = Number(((wasted / totalDosesSupplied) * 100).toFixed(1));
    setResult({
      vials,
      totalDoses: totalDosesSupplied,
      vaccinated,
      wasted,
      wastagePercent: pct,
    });
    if (isExplicitSubmit) {
      triggerFeedback('calculate');
    }
  }, [isUrdu, triggerError, triggerFeedback]);

  const calculate = useCallback(() => {
    computeResult(vialsIssued, childrenVaccinated, true);
  }, [computeResult, vialsIssued, childrenVaccinated]);

  const handleVialsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVialsIssued(val);
    computeResult(val, childrenVaccinated, false);
  }, [childrenVaccinated, computeResult]);

  const handleVaccinatedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setChildrenVaccinated(val);
    computeResult(vialsIssued, val, false);
  }, [vialsIssued, computeResult]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  const handleReset = useCallback(() => {
    setVialsIssued('');
    setChildrenVaccinated('');
    setResult(null);
    setError('');
    triggerReset();
  }, [triggerReset]);

  return (
    <div className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                03
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug truncate sm:whitespace-normal">
                {strings.title}
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200/70 flex-shrink-0" dir="ltr">
              {strings.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-normal w-full">
            {strings.purpose}
          </p>
        </div>

        {/* Content Layout: 2 Columns on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Inputs Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="wastage-vials-input" className="block text-xs font-semibold text-slate-700">
                    {isUrdu ? 'جاری کردہ وائلز (Vials Issued)' : 'Vials Issued'}
                  </label>
                  {vialsIssued && Number(vialsIssued) > 0 && (
                    <span className="text-[10px] font-mono text-teal-700 font-semibold" dir="ltr">
                      = {(Number(vialsIssued) * 20).toLocaleString()} doses
                    </span>
                  )}
                </div>
                <input
                  id="wastage-vials-input"
                  type="number"
                  aria-label={isUrdu ? 'جاری کردہ وائلز (Vials Issued)' : 'Vials Issued'}
                  min="1"
                  inputMode="numeric"
                  placeholder="e.g. 50"
                  value={vialsIssued}
                  onChange={handleVialsChange}
                  onKeyDown={handleKeyDown}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="wastage-vaccinated-input" className="block text-xs font-semibold text-slate-700">
                    {isUrdu ? 'ویکسین کیے گئے بچے (Children Vaccinated)' : 'Children Vaccinated'}
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">{isUrdu ? '2 قطرے فی بچہ' : '2 drops/child'}</span>
                </div>
                <input
                  id="wastage-vaccinated-input"
                  type="number"
                  aria-label={isUrdu ? 'ویکسین کیے گئے بچے (Children Vaccinated)' : 'Children Vaccinated'}
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 950"
                  value={childrenVaccinated}
                  onChange={handleVaccinatedChange}
                  onKeyDown={handleKeyDown}
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
                id="wastage-calc-btn"
                type="button"
                onClick={calculate}
                className="saas-btn-primary flex-1 px-4 text-xs sm:text-sm min-h-[48px]"
              >
                {strings.calculateBtn}
              </button>
              <button
                id="wastage-reset-btn"
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
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    {strings.wastedDosesLabel}
                  </span>
                  {result !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        result.wastagePercent <= 10
                          ? 'badge-optimal'
                          : result.wastagePercent <= 15
                          ? 'badge-acceptable'
                          : 'badge-warning'
                      }`}
                    >
                      {result.wastagePercent <= 10
                        ? (isUrdu ? 'بہترین (≤10%)' : 'Optimal (≤10%)')
                        : result.wastagePercent <= 15
                        ? (isUrdu ? 'قابلِ قبول (10-15%)' : 'Acceptable (10-15%)')
                        : (isUrdu ? 'انتباہ (>15%)' : 'Warning (>15%)')}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      key={`wastage-${calculationKey}`}
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight text-white ${
                        isCalculated ? 'animate-number-pop' : ''
                      }`}
                    >
                      {result !== null ? result.wasted.toLocaleString() : '—'}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      {isUrdu ? 'خوراکیں ضائع' : 'wasted doses'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      dir="ltr"
                      className={`text-xl sm:text-2xl font-black font-mono ${
                        result === null
                          ? 'text-slate-400'
                          : result.wastagePercent <= 10
                          ? 'text-emerald-400'
                          : result.wastagePercent <= 15
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result !== null ? `${result.wastagePercent}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting metrics */}
              <div className="saas-result-cell p-2.5 grid grid-cols-3 gap-2 text-xs text-slate-300 mt-2">
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'جاری کردہ وائلز' : 'Vials Issued'}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? `${result.vials.toLocaleString()} (${result.totalDoses.toLocaleString()})` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ویکسین کیے گئے بچے' : 'Children Vaccinated'}</span>
                  <span className="font-mono text-teal-300 font-bold text-xs">
                    {result !== null ? result.vaccinated.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ضائع خوراکیں' : 'Wasted'}</span>
                  <span className="font-mono text-amber-300 font-bold text-xs">
                    {result !== null ? result.wasted.toLocaleString() : '—'}
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
