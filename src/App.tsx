import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { usePWA } from './usePWA';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { triggerHaptic } from './haptics';
import {
  Shield,
  Download,
  Wifi,
  WifiOff,
  Languages,
  ArrowUp,
} from 'lucide-react';
import { CALCULATOR_ITEMS } from './platformNavigation';
import { TopCalculatorNavigation } from './components/TopCalculatorNavigation';

const ChildAgeCalculator = lazy(() =>
  import('./components/ChildAgeCalculator').then((m) => ({ default: m.ChildAgeCalculator }))
);
const VaccineDemandCalculator = lazy(() =>
  import('./components/VaccineDemandCalculator').then((m) => ({ default: m.VaccineDemandCalculator }))
);
const VaccineWastageCalculator = lazy(() =>
  import('./components/VaccineWastageCalculator').then((m) => ({ default: m.VaccineWastageCalculator }))
);
const NACoverageCalculator = lazy(() =>
  import('./components/NACoverageCalculator').then((m) => ({ default: m.NACoverageCalculator }))
);
const RefusalCalculator = lazy(() =>
  import('./components/RefusalCalculator').then((m) => ({ default: m.RefusalCalculator }))
);
const MissedChildrenCoverageCalculator = lazy(() =>
  import('./components/MissedChildrenCoverageCalculator').then((m) => ({
    default: m.MissedChildrenCoverageCalculator,
  }))
);
const CampaignCoverageCalculator = lazy(() =>
  import('./components/CampaignCoverageCalculator').then((m) => ({
    default: m.CampaignCoverageCalculator,
  }))
);
const DailyCatchUpCalculator = lazy(() =>
  import('./components/DailyCatchUpCalculator').then((m) => ({ default: m.DailyCatchUpCalculator }))
);
const Under5Calculator = lazy(() =>
  import('./components/Under5Calculator').then((m) => ({ default: m.Under5Calculator }))
);

const CalculatorSkeleton = () => (
  <div className="saas-card p-5 sm:p-6 h-[260px] flex flex-col justify-between animate-pulse">
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200" />
          <div className="h-5 w-36 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-20 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="h-11 bg-slate-100 rounded-lg" />
          <div className="h-11 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-28 bg-slate-900/60 rounded-xl" />
      </div>
    </div>
  </div>
);

function AppContent() {
  const { isInstallable, isOnline, install } = usePWA();
  const { language, toggleLanguage, isUrdu, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('calc-1');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);

  // Scroll spy to highlight the currently visible calculator and update both desktop and mobile navigation
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        // Do not alter active section while a programmatic click-to-scroll is actively animating
        if (isProgrammaticScrollRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            const topA = Math.abs(a.boundingClientRect.top - 100);
            const topB = Math.abs(b.boundingClientRect.top - 100);
            return topA - topB;
          });
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -45% 0px', threshold: [0, 0.1, 0.25] }
    );

    CALCULATOR_ITEMS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  const scrollToCalculator = (id: string) => {
    triggerHaptic('light');
    const el = document.getElementById(id);
    if (el) {
      isProgrammaticScrollRef.current = true;
      setActiveSection(id);

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }

      // Dynamically calculate the top sticky bar height
      const topBar = document.getElementById('top-calculators-bar');
      const topBarHeight = topBar ? topBar.offsetHeight : 76;
      const headerOffset = topBarHeight + 14;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });

      // Release lock after smooth scroll animation completes
      scrollEndTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 750);
    }
  };

  const scrollToTop = () => {
    triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen saas-bg text-slate-900 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-5 overflow-x-clip selection:bg-teal-200 selection:text-teal-950 ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* Header - Modern Clean Healthcare SaaS Header */}
        <header className="saas-header p-3 sm:p-4 mb-3 sm:mb-4 flex items-center justify-between flex-shrink-0 gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs border border-teal-700/50 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-snug truncate">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 rounded-md">
                  {t.roleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Language Switcher: EN | اردو */}
            <button
              id="language-toggle-btn"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                toggleLanguage();
              }}
              aria-label={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="saas-btn-secondary inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700 flex-shrink-0" />
              <span className={language === 'en' ? 'text-teal-900 font-bold' : 'text-slate-400 font-normal'}>
                EN
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className={language === 'ur' ? 'text-teal-900 font-bold font-arabic' : 'text-slate-400 font-normal'}>
                اردو
              </span>
            </button>

            {/* Online/Offline status */}
            <span
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">{t.offlineReady}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">{t.offline}</span>
                </>
              )}
            </span>

            {/* Install PWA button */}
            {isInstallable && (
              <button
                id="install-pwa-btn"
                type="button"
                onClick={install}
                className="saas-btn-primary inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.install}</span>
              </button>
            )}
          </div>
        </header>

        {/* Top Calculator Navigation Strip with All 9 Names Displayed Above Calculators */}
        <TopCalculatorNavigation
          activeSection={activeSection}
          onSelect={scrollToCalculator}
        />

        {/* All 9 Calculators Aligned in Clean Full-Width Container */}
        <main className="w-full min-w-0 space-y-6 sm:space-y-7 pb-8">
          <section id="calc-1" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <ChildAgeCalculator />
            </Suspense>
          </section>

          <section id="calc-2" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <VaccineDemandCalculator />
            </Suspense>
          </section>

          <section id="calc-3" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <VaccineWastageCalculator />
            </Suspense>
          </section>

          <section id="calc-4" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <NACoverageCalculator />
            </Suspense>
          </section>

          <section id="calc-5" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <RefusalCalculator />
            </Suspense>
          </section>

          <section id="calc-6" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <MissedChildrenCoverageCalculator />
            </Suspense>
          </section>

          <section id="calc-7" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <CampaignCoverageCalculator />
            </Suspense>
          </section>

          <section id="calc-8" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <DailyCatchUpCalculator />
            </Suspense>
          </section>

          <section id="calc-9" className="scroll-mt-24 sm:scroll-mt-28">
            <Suspense fallback={<CalculatorSkeleton />}>
              <Under5Calculator />
            </Suspense>
          </section>
        </main>
      </div>

      {/* Floating Back to Top Button (Shown when scrolled > 300px) */}
      {showBackToTop && (
        <button
          id="back-to-top-btn"
          type="button"
          onClick={scrollToTop}
          aria-label={isUrdu ? 'اوپر جائیں' : 'Back to top'}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 p-2.5 sm:p-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl backdrop-blur-xs border border-slate-700 cursor-pointer flex items-center justify-center transition active:scale-95"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Footer - Professional Clean Minimal Footer */}
      <footer className="saas-header py-3 px-4 mt-2 mb-1 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-500 max-w-7xl w-full mx-auto flex-shrink-0">
        <span className="text-center sm:text-left font-medium">
          {t.footerRule}
        </span>
        <span className="font-semibold text-slate-700 flex-shrink-0">
          {t.footerVersion}
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
