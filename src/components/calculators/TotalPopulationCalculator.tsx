import React, { useState } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { FormInput } from '../FormInput';
import { calculateTotalPopulation, PopulationResult } from '../../calculatorEngine';
import { TranslationStrings } from '../../translations';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  t: TranslationStrings;
}

export const TotalPopulationCalculator: React.FC<Props> = ({ t }) => {
  const [ucName, setUcName] = useState<string>('UC-12 Central');
  const [basePop, setBasePop] = useState<number | string>(65000);
  const [adjustment, setAdjustment] = useState<number | string>(0);
  const [showDemographics, setShowDemographics] = useState(false);
  const [malePop, setMalePop] = useState<number | string>('');
  const [femalePop, setFemalePop] = useState<number | string>('');
  const [otherPop, setOtherPop] = useState<number | string>('');

  const [result, setResult] = useState<PopulationResult>(() =>
    calculateTotalPopulation({
      ucName: 'UC-12 Central',
      basePopulation: 65000,
      adjustment: 0,
    })
  );
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    const base = Number(basePop);
    const adj = adjustment === '' ? 0 : Number(adjustment);
    if (isNaN(base) || base < 0 || isNaN(adj)) {
      setError(t.validationErrorValidNumber);
      return;
    }
    const male = malePop !== '' ? Number(malePop) : undefined;
    const female = femalePop !== '' ? Number(femalePop) : undefined;
    const other = otherPop !== '' ? Number(otherPop) : undefined;

    setResult(
      calculateTotalPopulation({
        ucName,
        basePopulation: base,
        adjustment: adj,
        malePopulation: male,
        femalePopulation: female,
        otherPopulation: other,
      })
    );
  };

  const handleReset = () => {
    setUcName('');
    setBasePop('');
    setAdjustment(0);
    setMalePop('');
    setFemalePop('');
    setOtherPop('');
    setError('');
    setResult(
      calculateTotalPopulation({
        ucName: '',
        basePopulation: 0,
        adjustment: 0,
      })
    );
  };

  const copySummary = `[Polio Calculator 04 - Total Population]
${result.ucName ? `Area / UC: ${result.ucName}\n` : ''}Base Population: ${result.basePopulation.toLocaleString()}
${result.adjustment !== 0 ? `Adjustment: ${result.adjustment > 0 ? '+' : ''}${result.adjustment.toLocaleString()}\n` : ''}TOTAL POPULATION: ${result.totalPopulation.toLocaleString()}`;

  return (
    <CalculatorCard
      id="calc-04"
      number={t.c4.num}
      title={t.c4.title}
      purpose={t.c4.purpose}
      isPrimary={true}
      onCalculate={handleCalculate}
      onReset={handleReset}
      formula={t.c4.formulaExplanation}
      formulaExplanation="Total Population = Base Population + User Adjustment. No arbitrary hidden percentages applied."
      exampleText="Example: Base Population = 65,000, Manual Adjustment = +250 → Total = 65,250"
      calculateLabel={t.calculateBtn}
      resetLabel={t.resetBtn}
      copyLabel={t.copyResultBtn}
      copiedLabel={t.copiedNotice}
      howCalculatedLabel={t.howCalculated}
      copyText={copySummary}
      resultView={
        <div className="space-y-4">
          {result.ucName && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 pb-2 border-b border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{result.ucName}</span>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">
              {t.c4.totalPopResult}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {result.totalPopulation.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base text-teal-300 font-medium">People</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="block text-slate-500">{t.c4.basePopLabel}</span>
              <span className="text-sm font-semibold font-mono text-slate-200">
                {result.basePopulation.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-slate-500">{t.c4.adjustmentLabel}</span>
              <span
                className={`text-sm font-semibold font-mono ${
                  result.adjustment > 0
                    ? 'text-emerald-400'
                    : result.adjustment < 0
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {result.adjustment > 0 ? `+${result.adjustment.toLocaleString()}` : result.adjustment.toLocaleString()}
              </span>
            </div>
          </div>

          {(result.malePopulation !== undefined || result.femalePopulation !== undefined || result.otherPopulation !== undefined) && (
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
              {result.malePopulation !== undefined && (
                <div>Male: <span className="text-slate-200 font-mono font-medium">{result.malePopulation.toLocaleString()}</span></div>
              )}
              {result.femalePopulation !== undefined && (
                <div>Female: <span className="text-slate-200 font-mono font-medium">{result.femalePopulation.toLocaleString()}</span></div>
              )}
              {result.otherPopulation !== undefined && (
                <div>Other: <span className="text-slate-200 font-mono font-medium">{result.otherPopulation.toLocaleString()}</span></div>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="calc-04-uc-name"
          label={t.c4.ucNameLabel}
          type="text"
          value={ucName}
          onChange={(val) => setUcName(String(val))}
          placeholder={t.c4.ucNamePlaceholder}
        />

        <FormInput
          id="calc-04-base-pop"
          label={t.c4.basePopLabel}
          value={basePop}
          onChange={(val) => {
            setBasePop(val);
            setError('');
          }}
          increments={[1000, 5000, 10000, 50000]}
          placeholder="e.g. 65000"
          error={error}
        />

        <FormInput
          id="calc-04-adjustment"
          label={t.c4.adjustmentLabel}
          value={adjustment}
          onChange={(val) => setAdjustment(val)}
          step={1}
          placeholder="0"
          helper={t.c4.adjustmentHelp}
        />

        {/* Optional Demographics Toggle */}
        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setShowDemographics(!showDemographics)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <span>{t.c4.optionalSection}</span>
            {showDemographics ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showDemographics && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
              <FormInput
                id="calc-04-male-pop"
                label={t.c4.maleLabel}
                value={malePop}
                onChange={(val) => setMalePop(val)}
                placeholder="Optional"
              />
              <FormInput
                id="calc-04-female-pop"
                label={t.c4.femaleLabel}
                value={femalePop}
                onChange={(val) => setFemalePop(val)}
                placeholder="Optional"
              />
              <FormInput
                id="calc-04-other-pop"
                label={t.c4.otherLabel}
                value={otherPop}
                onChange={(val) => setOtherPop(val)}
                placeholder="Optional"
              />
            </div>
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};
