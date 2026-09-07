import React, { useState, useEffect } from 'react';
import {
  CALCULATOR_ITEMS,
  getLocalizedCalcName,
} from '../platformNavigation';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  ChevronDown,
  X,
  Check,
  Calculator,
} from 'lucide-react';

interface MobileCalculatorSelectorProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

export const MobileCalculatorSelector: React.FC<MobileCalculatorSelectorProps> = ({
  activeSection,
  onSelect,
}) => {
  const { t, isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Find the currently active calculator item
  const currentCalc =
    CALCULATOR_ITEMS.find((c) => c.id === activeSection) || CALCULATOR_ITEMS[0];
  const currentCalcName = getLocalizedCalcName(currentCalc, t, isUrdu);
  const CurrentIcon = currentCalc.icon;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    triggerHaptic('light');
    setIsOpen(true);
  };

  const handleClose = () => {
    triggerHaptic('light');
    setIsOpen(false);
  };

  const handleItemClick = (id: string) => {
    triggerHaptic('medium');
    setIsOpen(false);
    onSelect(id);
  };

  return (
    <div className="lg:hidden sticky top-2 z-20 mb-4 w-full">
      {/* Mobile Selector Card */}
      <div className="saas-card p-2.5 sm:p-3 shadow-md border border-slate-200/90 bg-white/95 backdrop-blur-md rounded-xl">
        <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Calculator className="w-3.5 h-3.5 text-teal-700" />
            <span>{isUrdu ? 'حساب کار' : 'Calculator'}</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/70">
            {currentCalc.num} / 09
          </span>
        </div>

        {/* Dropdown Selector Trigger Button */}
        <button
          id="mobile-calculator-selector-btn"
          type="button"
          onClick={handleOpen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="mobile-calculator-modal"
          aria-label={
            isUrdu
              ? `موجودہ منتخب ٹول: ${currentCalcName}۔ تمام ٹولز دیکھنے کے لیے کلک کریں۔`
              : `Current calculator: ${currentCalcName}. Tap to select another tool.`
          }
          className="w-full flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-lg bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-left transition-all active:scale-[0.99] cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-6 h-6 rounded-md bg-teal-700 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {currentCalc.num}
            </span>
            <CurrentIcon className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span
              className={`text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight ${
                isUrdu ? 'font-arabic' : ''
              }`}
            >
              {currentCalcName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-500 pl-1">
            <span className="text-[11px] font-semibold text-teal-700 hidden xs:inline">
              {isUrdu ? 'تبدیل کریں' : 'Change'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-teal-700' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Selection Panel Sheet / Modal */}
      {isOpen && (
        <div
          id="mobile-calculator-modal"
          role="dialog"
          aria-modal="true"
          aria-label={isUrdu ? 'حساب کار منتخب کریں' : 'Select Calculator'}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal / Bottom-Sheet Container */}
          <div
            className={`relative z-10 w-full sm:max-w-lg bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-micro-fade-in ${
              isUrdu ? 'font-arabic' : ''
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {isUrdu ? 'حساب کار کا انتخاب کریں' : 'Select Calculator'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu ? 'تمام 9 فیلڈ ٹولز کی فہرست' : 'Choose from all 9 field tools'}
                  </p>
                </div>
              </div>

              <button
                id="close-mobile-selector-btn"
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
                aria-label={isUrdu ? 'بند کریں' : 'Close selector'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of All 9 Calculators in Touch-Friendly Large Rows */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 overscroll-contain">
              {CALCULATOR_ITEMS.map((calc) => {
                const Icon = calc.icon;
                const isActive = activeSection === calc.id;
                const fullName = getLocalizedCalcName(calc, t, isUrdu);

                return (
                  <button
                    key={calc.id}
                    id={`mobile-selector-item-${calc.id}`}
                    type="button"
                    onClick={() => handleItemClick(calc.id)}
                    className={`w-full min-h-[52px] flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? isUrdu
                          ? 'bg-teal-50 text-teal-950 font-bold border-r-3 border-teal-700 shadow-xs'
                          : 'bg-teal-50 text-teal-950 font-bold border-l-3 border-teal-700 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 border border-slate-200/60'
                    }`}
                  >
                    {/* Number Badge */}
                    <span
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {calc.num}
                    </span>

                    {/* Icon */}
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    />

                    {/* Full Name */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs sm:text-sm leading-snug break-words ${
                          isActive ? 'text-teal-950 font-bold' : 'text-slate-800 font-medium'
                        }`}
                      >
                        {fullName}
                      </span>
                    </div>

                    {/* Active Checkmark */}
                    {isActive ? (
                      <div className="flex items-center gap-1 text-teal-700 flex-shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                        {calc.num}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="saas-btn-secondary px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
