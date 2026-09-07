import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { calculateVaccineWastageFromVials, VialWastageResult, BOPV_CONSTANTS } from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { useCalculationFeedback } from '../useCalculationFeedback';

interface Props {
  compact?: boolean;
}

export const VaccineWastageCalculator: React.FC<Props> = () => {
  const { isUrdu, t } = useLanguage();
  const strings = t.vaccineWastage;
  const { isCalculated, calculationKey, triggerFeedback, triggerReset, triggerError } = useCalculationFeedback();

  const [dosesIssued, setDosesIssued] = useState<string>('1000');
  const [dosesAdministered, setDosesAdministered] = useState<string>('950');
  const [result, setResult] = useState<{
    issued: number;
    administered: number;
    wasted: number;
    wastagePercent: number;
    vialsEquivalent: number;
  } | null>(() => ({
    issued: 1000,
    administered: 950,
    wasted: 50,
    wastagePercent: 5.0,
    vialsEquivalent: 50,
  }));
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const issued = Number(dosesIssued.replace(/,/g, ''));
    const administered = Number(dosesAdministered.replace(/,/g, ''));

    if (isNaN(issued) || issued <= 0) {
      setError(isUrdu ? 'براہ کرم جاری کردہ درست خوراکیں درج کریں (> 0)' : 'Please enter valid doses issued (> 0)');
      triggerError();
      return;
    }
    if (isNaN(administered) || administered < 0) {
      setError(isUrdu ? 'براہ کرم دی گئی درست خوراکیں درج کریں (≥ 0)' : 'Please enter valid doses administered (≥ 0)');
      triggerError();
      return;
    }
    if (administered > issued) {
      setError(
        isUrdu
          ? `دی گئی خوراکیں (${administered}) جاری کردہ خوراکوں (${issued}) سے زیادہ نہیں ہو سکتیں`
          : `Administered doses (${administered}) cannot exceed issued doses (${issued})`
      );
      triggerError();
      return;
    }

    try {
      const wasted = issued - administered;
      const pct = Number(((wasted / issued) * 100).toFixed(1));
      setResult({
        issued,
        administered,
        wasted,
        wastagePercent: pct,
        vialsEquivalent: Math.ceil(issued / 20),
      });
      triggerFeedback('calculate');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : isUrdu ? 'حسابی خرابی' : 'Invalid calculation parameters';
      setError(msg);
      setResult(null);
      triggerError();
    }
  };

  const handleReset = () => {
    setDosesIssued('');
    setDosesAdministered('');
    setResult(null);
    setError('');
    triggerReset();
  };

  return (
    <div className={`saas-card p-4 sm:p-6 flex flex-col justify-between h-full ${isUrdu ? 'font-arabic' : ''}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
              03
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
                  <label htmlFor="wastage-issued-input" className="block text-xs font-semibold text-slate-700">
                    {isUrdu ? 'جاری کردہ کل خوراکیں (Doses Issued)' : 'Doses Issued'}
                  </label>
                  {dosesIssued && Number(dosesIssued) > 0 && (
                    <span className="text-[10px] font-mono text-teal-700 font-semibold" dir="ltr">
                      ≈{Math.ceil(Number(dosesIssued) / 20)} vials
                    </span>
                  )}
                </div>
                <input
                  id="wastage-issued-input"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="e.g. 1000"
                  value={dosesIssued}
                  onChange={(e) => {
                    setDosesIssued(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className="saas-input w-full px-3.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="wastage-administered-input" className="block text-xs font-semibold text-slate-700">
                    {isUrdu ? 'استعمال شدہ خوراکیں (Doses Given)' : 'Doses Administered'}
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">{isUrdu ? 'ویکسین شدہ' : 'Vaccinated'}</span>
                </div>
                <input
                  id="wastage-administered-input"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="e.g. 950"
                  value={dosesAdministered}
                  onChange={(e) => {
                    setDosesAdministered(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
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
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'جاری شدہ' : 'Issued'}</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">
                    {result !== null ? result.issued.toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'ویکسین شدہ' : 'Given'}</span>
                  <span className="font-mono text-teal-300 font-bold text-xs">
                    {result !== null ? result.administered.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 text-[10px] font-medium">{isUrdu ? 'وائلز برابر' : 'Vials'}</span>
                  <span className="font-mono text-emerald-300 font-bold text-xs">
                    {result !== null ? `≈${result.vialsEquivalent}` : '—'}
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
