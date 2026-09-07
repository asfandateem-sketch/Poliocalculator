import React from 'react';
import {
  CALCULATOR_ITEMS,
  getLocalizedCalcName,
} from '../platformNavigation';
import { useLanguage } from '../LanguageContext';
import { Info, CheckCircle2 } from 'lucide-react';

interface DesktopCalculatorIndexProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

export const DesktopCalculatorIndex: React.FC<DesktopCalculatorIndexProps> = ({
  activeSection,
  onSelect,
}) => {
  const { t, isUrdu } = useLanguage();

  return (
    <aside
      className="hidden lg:block w-full sticky top-4 self-start space-y-4"
      aria-label={isUrdu ? 'حساب کار کی فہرست' : 'Calculator Index'}
    >
      {/* Main Calculator Index Card */}
      <nav className="saas-card p-4 border border-slate-200/90 shadow-xs bg-white rounded-2xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-mono">
                {isUrdu ? 'حساب کار کی فہرست' : 'Calculators'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isUrdu ? 'براہِ راست انتخاب کریں' : 'Field Operations Index'}
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70">
            09 Tools
          </span>
        </div>

        {/* 9 Calculator Navigation Items with Full Names */}
        <div className="space-y-1" role="list">
          {CALCULATOR_ITEMS.map((calc) => {
            const Icon = calc.icon;
            const isActive = activeSection === calc.id;
            const fullName = getLocalizedCalcName(calc, t, isUrdu);

            return (
              <button
                key={calc.id}
                id={`desktop-index-${calc.id}`}
                type="button"
                role="listitem"
                onClick={() => onSelect(calc.id)}
                className={`w-full group flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? isUrdu
                      ? 'bg-teal-50/90 text-teal-950 font-bold border-r-3 border-teal-700 shadow-xs pl-2.5 pr-2'
                      : 'bg-teal-50/90 text-teal-950 font-bold border-l-3 border-teal-700 shadow-xs pr-2.5 pl-2'
                    : 'text-slate-700 hover:bg-slate-50/90 hover:text-slate-900 border-l-3 border-transparent'
                }`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Number Badge */}
                <span
                  className={`w-6 h-6 rounded-lg font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/70'
                  }`}
                >
                  {calc.num}
                </span>

                {/* Icon */}
                <Icon
                  className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />

                {/* Full Readable Name (Wraps naturally, never clipped or truncated) */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs leading-snug break-words ${
                      isActive ? 'text-teal-950 font-bold' : 'text-slate-700 font-medium'
                    }`}
                  >
                    {fullName}
                  </span>
                </div>

                {/* Active Indicator Icon */}
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Campaign Protocol Standards Card */}
      <div className="saas-card p-4 text-xs text-slate-600 space-y-2.5 border border-slate-200/80 bg-slate-50/70 rounded-2xl">
        <div className="flex items-center gap-1.5 text-teal-900 font-bold">
          <Info className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span className="text-xs">{isUrdu ? 'مہماتی پروٹوکول رہنما اصول' : 'Campaign Standards'}</span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-800">bOPV Rule:</strong> 1 vial = 20 doses (covers 20 kids)
          </li>
          <li>
            <strong className="text-slate-800">Target Benchmark:</strong> ≥ 95% total coverage
          </li>
          <li>
            <strong className="text-slate-800">Age Eligibility:</strong> Under 5 (strictly &lt; 5.0 yrs)
          </li>
          <li>
            <strong className="text-slate-800">Wastage Standard:</strong> ≤ 10% acceptable target
          </li>
        </ul>
      </div>
    </aside>
  );
};
