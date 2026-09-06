import React, { useState, useEffect, Suspense, lazy } from 'react';
import { usePWA } from './usePWA';
import { LanguageProvider, useLanguage } from './LanguageContext';
import {
  Shield,
  Download,
  Wifi,
  WifiOff,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Award,
  TrendingUp,
  UserX,
  AlertTriangle,
  Users,
  Languages,
  ArrowUp,
  ChevronDown,
  Info,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const calculators = [
    { id: 'calc-1', num: '01', label: t.childAge.title, shortLabel: t.childAge.shortTitle, icon: Calendar },
    { id: 'calc-2', num: '02', label: t.vaccineDemand.title, shortLabel: t.vaccineDemand.shortTitle, icon: ShieldCheck },
    { id: 'calc-3', num: '03', label: t.vaccineWastage.title, shortLabel: t.vaccineWastage.shortTitle, icon: AlertCircle },
    { id: 'calc-4', num: '04', label: t.naCoverage.title, shortLabel: t.naCoverage.shortTitle, icon: UserX },
    { id: 'calc-5', num: '05', label: t.refusalCoverage.title, shortLabel: t.refusalCoverage.shortTitle, icon: AlertTriangle },
    { id: 'calc-6', num: '06', label: t.missedChildren.title, shortLabel: t.missedChildren.shortTitle, icon: ShieldAlert },
    { id: 'calc-7', num: '07', label: t.campaignCoverage.title, shortLabel: t.campaignCoverage.shortTitle, icon: Award },
    { id: 'calc-8', num: '08', label: t.dailyCatchUp.title, shortLabel: t.dailyCatchUp.shortTitle, icon: TrendingUp },
    { id: 'calc-9', num: '09', label: t.under5Population.title, shortLabel: t.under5Population.shortTitle, icon: Users },
  ];

  // Scroll spy to highlight the currently visible calculator in the sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0.1 }
    );

    calculators.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToCalculator = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentActiveCalc = calculators.find((c) => c.id === activeSection) || calculators[0];

  return (
    <div
      className={`min-h-screen saas-bg text-slate-900 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-5 overflow-x-hidden selection:bg-teal-200 selection:text-teal-950 ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* Header - Modern Clean Healthcare SaaS Header */}
        <header className="saas-header p-3.5 sm:p-4 mb-5 flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs border border-teal-700/50 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 rounded-md">
                  {t.roleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher: EN | اردو */}
            <button
              id="language-toggle-btn"
              type="button"
              onClick={toggleLanguage}
              aria-label={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="saas-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold cursor-pointer"
            >
              <Languages className="w-4 h-4 text-teal-700 flex-shrink-0" />
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
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xs:inline">{t.offlineReady}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.offline}</span>
                </>
              )}
            </span>

            {/* Install PWA button */}
            {isInstallable && (
              <button
                id="install-pwa-btn"
                type="button"
                onClick={install}
                className="saas-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.install}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile / Tablet Compact Selector: Sticky Top Bar (< lg screens) */}
        <div className="lg:hidden sticky top-2 z-20 mb-4 saas-header p-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex-1 min-w-0 text-left cursor-pointer"
            >
              <span className="w-6 h-6 rounded bg-teal-700 text-white font-mono text-xs flex items-center justify-center flex-shrink-0">
                {currentActiveCalc.num}
              </span>
              <span className="truncate font-semibold">{currentActiveCalc.label}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 ms-auto transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Horizontal Jump Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {calculators.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => scrollToCalculator(c.id)}
                  className={`w-7 h-7 rounded-md text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                    activeSection === c.id
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={c.label}
                >
                  {c.num}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-1 gap-1 max-h-72 overflow-y-auto">
              {calculators.map((calc) => {
                const Icon = calc.icon;
                const isActive = activeSection === calc.id;
                return (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => scrollToCalculator(calc.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded text-[11px] font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {calc.num}
                    </span>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                    <span className="truncate">{calc.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Two-Column Desktop Layout: Main Content (Left) + Sticky Navigation (Right) */}
        <div className="flex flex-col lg:flex-row items-start gap-6 flex-1 min-h-0 pb-6">
          {/* Main Content: Left Column with All 9 Calculators */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            <section id="calc-1" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <ChildAgeCalculator />
              </Suspense>
            </section>

            <section id="calc-2" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <VaccineDemandCalculator />
              </Suspense>
            </section>

            <section id="calc-3" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <VaccineWastageCalculator />
              </Suspense>
            </section>

            <section id="calc-4" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <NACoverageCalculator />
              </Suspense>
            </section>

            <section id="calc-5" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <RefusalCalculator />
              </Suspense>
            </section>

            <section id="calc-6" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <MissedChildrenCoverageCalculator />
              </Suspense>
            </section>

            <section id="calc-7" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <CampaignCoverageCalculator />
              </Suspense>
            </section>

            <section id="calc-8" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <DailyCatchUpCalculator />
              </Suspense>
            </section>

            <section id="calc-9" className="scroll-mt-5">
              <Suspense fallback={<CalculatorSkeleton />}>
                <Under5Calculator />
              </Suspense>
            </section>
          </main>

          {/* Sticky Right Navigation Panel: Desktop Only (>= lg screens) */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-5 space-y-4">
            <nav
              aria-label={isUrdu ? 'حساب کار کی فہرست' : 'Calculators Navigation'}
              className="saas-nav-panel p-4"
            >
              {/* Navigation Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2.5">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    {isUrdu ? 'حساب کار' : 'Calculators'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu ? 'براہِ راست انتخاب کریں' : 'Quick jump reference'}
                  </p>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  9 Tools
                </span>
              </div>

              {/* List of 9 Calculators */}
              <div className="space-y-1">
                {calculators.map((calc) => {
                  const Icon = calc.icon;
                  const isActive = activeSection === calc.id;
                  return (
                    <button
                      key={calc.id}
                      id={`sidebar-link-${calc.id}`}
                      type="button"
                      onClick={() => scrollToCalculator(calc.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-all cursor-pointer saas-nav-item ${
                        isActive
                          ? 'saas-nav-item-active'
                          : 'saas-nav-item-inactive'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {calc.num}
                      </span>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-teal-700' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate flex-1 tracking-tight">
                        {calc.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Campaign Protocol Guidelines Card */}
            <div className="saas-card p-3.5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>{isUrdu ? 'پروٹوکول رہنما اصول' : 'Campaign Standards'}</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-800">bOPV Vial:</strong> 20 doses (2 drops/child)
                </li>
                <li>
                  <strong className="text-slate-800">Coverage Goal:</strong> ≥ 95% target
                </li>
                <li>
                  <strong className="text-slate-800">Under 5:</strong> Strict DOB verification
                </li>
                <li>
                  <strong className="text-slate-800">Wastage Goal:</strong> ≤ 10% acceptable
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          id="back-to-top-btn"
          type="button"
          onClick={scrollToTop}
          aria-label={isUrdu ? 'اوپر جائیں' : 'Back to top'}
          className="fixed bottom-5 ltr:right-5 rtl:left-5 z-30 p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg cursor-pointer flex items-center justify-center transition"
        >
          <ArrowUp className="w-4 h-4" />
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
