import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CALCULATOR_ITEMS,
  getLocalizedCalcName,
  getLocalizedCalcShortName,
  CalculatorNavItem,
} from '../platformNavigation';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  LayoutGrid,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface TopCalculatorNavigationProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

export const TopCalculatorNavigation: React.FC<TopCalculatorNavigationProps> = React.memo(({
  activeSection,
  onSelect,
}) => {
  const { t, isUrdu } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  // Check scroll position to show/hide navigation arrows
  const checkScrollArrows = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // In RTL, scrollLeft can be negative or inverted depending on browser engine
    if (isUrdu) {
      const currentScroll = Math.abs(scrollLeft);
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      setShowRightArrow(currentScroll > 12);
      setShowLeftArrow(currentScroll < maxScroll - 12);
    } else {
      setShowLeftArrow(scrollLeft > 12);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 12);
    }
  }, [isUrdu]);

  useEffect(() => {
    checkScrollArrows();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollArrows, { passive: true });
      window.addEventListener('resize', checkScrollArrows);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollArrows);
      }
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows]);

  // Horizontally center the active tab inside the ribbon container ONLY (zero window scroll interference)
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeBtn = scrollContainerRef.current.querySelector(
      `#top-nav-item-${activeSection}`
    ) as HTMLElement | null;

    if (activeBtn && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      // Check if button is partially or fully out of the container's comfortable view
      const isOutOfView =
        btnRect.left < containerRect.left + 16 ||
        btnRect.right > containerRect.right - 16;

      if (isOutOfView) {
        // Calculate the exact horizontal delta needed to center the button in the container
        // This delta is purely container-relative and never interferes with window.scrollY
        const delta =
          btnRect.left + btnRect.width / 2 - (containerRect.left + containerRect.width / 2);

        container.scrollBy({
          left: delta,
          behavior: 'smooth',
        });
      }
    }
  }, [activeSection]);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    triggerHaptic('light');
    if (!scrollContainerRef.current) return;
    const scrollAmount = 260;
    // In RTL, left/right direction inverted relative to visual scroll
    const delta = direction === 'left' ? -scrollAmount : scrollAmount;
    scrollContainerRef.current.scrollBy({
      left: isUrdu ? -delta : delta,
      behavior: 'smooth',
    });
  }, [isUrdu]);

  const handleSelectCalculator = useCallback((id: string) => {
    triggerHaptic('medium');
    setIsOverviewOpen(false);
    onSelect(id);
  }, [onSelect]);

  const handleOpenOverview = useCallback(() => {
    triggerHaptic('light');
    setIsOverviewOpen(true);
  }, []);

  const handleCloseOverview = useCallback(() => {
    setIsOverviewOpen(false);
  }, []);

  // Find active calculator item
  const currentCalc = useMemo(() => {
    return CALCULATOR_ITEMS.find((c) => c.id === activeSection) || CALCULATOR_ITEMS[0];
  }, [activeSection]);

  const currentCalcName = useMemo(() => {
    return getLocalizedCalcName(currentCalc, t, isUrdu);
  }, [currentCalc, t, isUrdu]);

  return (
    <nav
      id="top-calculators-bar"
      aria-label={isUrdu ? 'مہماتی حساب کاروں کی فہرست' : 'Campaign Calculators Menu'}
      className="sticky top-2 z-20 mb-5 w-full transition-all"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="saas-card bg-white/78 backdrop-blur-xl border border-white/85 shadow-[0_12px_28px_-6px_rgba(15,35,65,0.06)] rounded-2xl p-2 sm:p-2.5 liquid-shimmer">
        {/* Top Mini Header with Active Indicator & Quick Overview Trigger */}
        <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100/90 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-50/80 backdrop-blur-xs border border-teal-200/70 text-teal-800 flex-shrink-0 shadow-2xs">
              <Calculator className="w-3.5 h-3.5 text-teal-700" />
              <span className="text-[11px] font-mono font-bold tracking-tight">
                {currentCalc.num} / 09
              </span>
            </div>
            
            <div className="min-w-0 flex items-center gap-1.5 truncate">
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline uppercase tracking-wider font-mono">
                {isUrdu ? 'موجودہ ٹول:' : 'Active Tool:'}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentCalc.id}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="text-xs font-bold text-slate-900 truncate inline-block"
                >
                  {currentCalcName}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* 9-Tools Grid Overview Modal Trigger */}
            <motion.button
              id="top-nav-overview-btn"
              type="button"
              onClick={handleOpenOverview}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              aria-expanded={isOverviewOpen}
              aria-controls="calculator-overview-modal"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50/90 hover:bg-teal-100/90 backdrop-blur-xs border border-teal-200/80 transition cursor-pointer shadow-2xs"
              title={isUrdu ? 'تمام 9 ٹولز کی فہرست کھولیں' : 'View all 9 tools in grid'}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
              <span className="hidden xs:inline">
                {isUrdu ? 'تمام ٹولز' : 'All 9 Tools'}
              </span>
              <span className="xs:hidden">9</span>
            </motion.button>
          </div>
        </div>

        {/* Horizontal Scrollable Ribbon with all 9 Calculators */}
        <div className="relative flex items-center">
          {/* Scroll Left Button (Desktop/Tablet) */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label={isUrdu ? 'دائیں سکرول کریں' : 'Scroll left'}
              className="hidden md:flex absolute left-0 z-10 w-7 h-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-md text-slate-700 hover:text-teal-700 shadow-md border border-white/90 hover:bg-white transition -ml-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Ribbon Container */}
          <div
            ref={scrollContainerRef}
            role="tablist"
            aria-label={isUrdu ? 'حساب کار کی ٹیبز' : 'Calculators Tabstrip'}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CALCULATOR_ITEMS.map((calc) => {
              const Icon = calc.icon;
              const isActive = activeSection === calc.id;
              const fullName = getLocalizedCalcName(calc, t, isUrdu);
              const shortName = getLocalizedCalcShortName(calc, t, isUrdu);

              return (
                <motion.button
                  key={calc.id}
                  id={`top-nav-item-${calc.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={calc.id}
                  type="button"
                  onClick={() => handleSelectCalculator(calc.id)}
                  title={fullName}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 cursor-pointer select-none transition-colors duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'bg-white/70 hover:bg-white/95 text-slate-700 hover:text-slate-950 border border-white/85 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Spring-animated Active Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCalculatorPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-teal-600 via-teal-700 to-teal-900 shadow-[0_6px_16px_rgba(13,148,136,0.32),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-teal-400/50 ring-1 ring-white/25 z-0"
                      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                    />
                  )}

                  {/* Number Badge */}
                  <span
                    className={`relative z-10 w-5 h-5 rounded-md font-mono font-bold text-[10.5px] flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                      isActive
                        ? 'bg-white text-teal-950 font-black shadow-xs'
                        : 'bg-slate-200 text-slate-800 group-hover:bg-slate-300'
                    }`}
                  >
                    {calc.num}
                  </span>

                  {/* Icon */}
                  <Icon
                    className={`relative z-10 w-3.5 h-3.5 flex-shrink-0 transition-colors duration-150 ${
                      isActive ? 'text-teal-100' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />

                  {/* Label: Short name on small screens, full name on medium+ */}
                  <span
                    className={`relative z-10 font-semibold tracking-tight leading-none ${
                      isUrdu ? 'font-arabic text-[12.5px]' : 'text-xs'
                    }`}
                  >
                    <span className="sm:hidden">{shortName}</span>
                    <span className="hidden sm:inline">{fullName}</span>
                  </span>

                  {/* Active bottom glow bar */}
                  {isActive && (
                    <motion.span
                      layoutId="activeCalculatorGlowBar"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9] z-10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Scroll Right Button (Desktop/Tablet) */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label={isUrdu ? 'بائیں سکرول کریں' : 'Scroll right'}
              className="hidden md:flex absolute right-0 z-10 w-7 h-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-md text-slate-700 hover:text-teal-700 shadow-md border border-white/90 hover:bg-white transition -mr-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Overview Modal / Drawer (when clicking "All 9 Tools") */}
      <AnimatePresence>
        {isOverviewOpen && (
          <div
            id="calculator-overview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={isUrdu ? 'تمام 9 مہماتی حساب کار' : 'All 9 Campaign Calculators'}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsOverviewOpen(false)}
              aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`relative z-10 w-full max-w-3xl liquid-glass-modal rounded-2xl overflow-hidden flex flex-col max-h-[90vh] liquid-shimmer ${
                isUrdu ? 'font-arabic' : ''
              }`}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-white/50 backdrop-blur-md flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {isUrdu ? 'تمام 9 مہماتی حساب کار' : 'All 9 Campaign Calculators'}
                      </h2>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200/70 rounded">
                        WHO / UNICEF / NEOC
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isUrdu
                        ? 'مطلوبہ حساب کار پر کلک کر کے براہِ راست وہاں پہنچیں'
                        : 'Select any calculator to jump directly to its section'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseOverview}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                  aria-label={isUrdu ? 'بند کریں' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3x3 Responsive Grid */}
              <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CALCULATOR_ITEMS.map((calc) => {
                  const Icon = calc.icon;
                  const isActive = activeSection === calc.id;
                  const fullName = getLocalizedCalcName(calc, t, isUrdu);
                  const purpose = calc.getPurpose(t);
                  const badge = calc.getBadge(t);

                  return (
                    <motion.button
                      key={calc.id}
                      type="button"
                      onClick={() => handleSelectCalculator(calc.id)}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className={`group relative text-start p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-teal-50/90 border-teal-500/70 shadow-[0_8px_20px_-4px_rgba(13,148,136,0.25)] ring-1 ring-teal-500/40'
                          : 'bg-white/80 hover:bg-white border-white/85 hover:border-teal-200/80 shadow-2xs hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? 'bg-teal-700 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-900'
                            }`}
                          >
                            {calc.num}
                          </span>
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-teal-700'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-slate-200/80">
                          {badge}
                        </span>
                      </div>

                      <div>
                        <h3
                          className={`text-xs sm:text-sm font-bold leading-tight ${
                            isActive ? 'text-teal-950' : 'text-slate-900 group-hover:text-teal-950'
                          }`}
                        >
                          {fullName}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {purpose}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100/90 text-slate-400">
                        <span className="font-mono text-[10px] text-slate-400">
                          #{calc.id}
                        </span>
                        {isActive ? (
                          <span className="flex items-center gap-1 text-teal-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isUrdu ? 'فعال' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-teal-700 font-medium group-hover:underline">
                            {isUrdu ? 'کھولیں ←' : 'Open →'}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Campaign Protocol Rules Footer in Modal */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    <strong className="text-slate-800">Rule:</strong> 1 vial = 20 doses bOPV | Coverage Target ≥ 95%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseOverview}
                  className="saas-btn-secondary px-3.5 py-1 text-xs font-semibold cursor-pointer"
                >
                  {isUrdu ? 'بند کریں' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
});
