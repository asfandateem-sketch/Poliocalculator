import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateUnder5Children, Under5ChildrenResult } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { Users, Target } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const AgeUnder5Calculator: React.FC<Props> = ({ t }) => {
  const [method, setMethod] = useState<'population' | 'official'>('population');
  const [totalPop, setTotalPop] = useState<number | string>(50000);
  const [under5Pct, setUnder5Pct] = useState<number | string>(15);
  const [officialTarget, setOfficialTarget] = useState<number | string>(7500);
  const [result, setResult] = useState<Under5ChildrenResult>(() =>
    calculateUnder5Children({ method: 'population', totalPopulation: 50000, under5Percentage: 15 })
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    if (method === 'population') {
      const pop = Number(totalPop);
      const pct = Number(under5Pct);
      if (isNaN(pop) || pop < 0 || isNaN(pct) || pct < 0) {
        setError(t.validationErrorValidNumber);
        return;
      }
      const res = calculateUnder5Children({
        method: 'population',
        totalPopulation: pop,
        under5Percentage: pct,
      });
      setResult(res);
    } else {
      const target = Number(officialTarget);
      if (isNaN(target) || target < 0) {
        setError(t.validationErrorValidNumber);
        return;
      }
      const res = calculateUnder5Children({
        method: 'official',
        officialTarget: target,
      });
      setResult(res);
    }
  };

  const handleReset = () => {
    setMethod('population');
    setTotalPop('');
    setUnder5Pct(15);
    setOfficialTarget('');
    setError('');
    setResult(calculateUnder5Children({ method: 'population', totalPopulation: 0, under5Percentage: 15 }));
  };

  const copySummary = `[Polio Calculator 01 - Under-5 Children]
Method: ${result.method === 'population' ? 'Calculated from Population' : 'Official Target'}
${result.method === 'population' ? `Population: ${totalPop} | Under-5 %: ${under5Pct}%\n` : ''}Result Type: ${result.label}
Under-5 Children Target: ${result.under5Children.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-01"
      number={t.c1.num}
      title={t.c1.title}
      purpose={t.c1.purpose}
      isPrimary={true}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c1.formulaExplanation}
      formulaExplanation="Allows calculating the target from baseline population with explicit under-5 percentage, or entering the campaign official target directly."
      exampleText="Example: Population = 50,000, Under-5 = 15% → 7,500 Under-5 Children"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Classification
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.label === 'Official Target'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              }`}
            >
              {result.label === 'Official Target' ? t.c1.resultOfficial : t.c1.resultEstimated}
            </span>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">
              {t.c1.title}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {result.under5Children.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base text-teal-300 font-medium">
                Children (&lt;5 years)
              </span>
            </div>
          </div>

          {result.method === 'population' && (
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <div>
                <span className="block text-slate-500">{t.c1.totalPopLabel}</span>
                <span className="text-slate-200 font-mono font-semibold">
                  {Number(totalPop || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-slate-500">{t.c1.under5PctLabel}</span>
                <span className="text-slate-200 font-mono font-semibold">{under5Pct}%</span>
              </div>
            </div>
          )}
        </div>
      }
    >
      {/* Method Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setMethod('population');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
            method === 'population'
              ? 'bg-white text-teal-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-teal-600" />
          <span>{t.c1.methodA}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('official');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
            method === 'official'
              ? 'bg-white text-teal-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4 text-teal-600" />
          <span>{t.c1.methodB}</span>
        </button>
      </div>

      {/* Method Inputs */}
      {method === 'population' ? (
        <div className="space-y-4 pt-1">
          <FormInput
            id="calc-01-total-pop"
            label={t.c1.totalPopLabel}
            value={totalPop}
            onChange={(val) => {
              setTotalPop(val);
              setError('');
            }}
            increments={[1000, 5000, 10000, 50000]}
            placeholder="e.g. 50000"
            error={error}
          />

          <FormInput
            id="calc-01-under5-pct"
            label={t.c1.under5PctLabel}
            value={under5Pct}
            onChange={(val) => {
              setUnder5Pct(val);
              setError('');
            }}
            step={0.1}
            unit="%"
            helper="Explicit percentage entered by user (common campaign standard: 13.5% - 17.5%)"
            placeholder="15"
          />
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <FormInput
            id="calc-01-official-target"
            label={t.c1.officialTargetLabel}
            value={officialTarget}
            onChange={(val) => {
              setOfficialTarget(val);
              setError('');
            }}
            increments={[500, 1000, 5000]}
            placeholder="e.g. 7500"
            error={error}
            helper="Enter the validated target directly from the microplan"
          />
        </div>
      )}
    </CalculatorCard>
  );
};
