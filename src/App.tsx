import React, { useState, useEffect } from 'react';
import { usePWA } from './usePWA';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ChildAgeCalculator } from './components/ChildAgeCalculator';
import { VaccineDemandCalculator } from './components/VaccineDemandCalculator';
import { VaccineWastageCalculator } from './components/VaccineWastageCalculator';
import { NACoverageCalculator } from './components/NACoverageCalculator';
import { RefusalCalculator } from './components/RefusalCalculator';
import { MissedChildrenCoverageCalculator } from './components/MissedChildrenCoverageCalculator';
import { CampaignCoverageCalculator } from './components/CampaignCoverageCalculator';
import { DailyCatchUpCalculator } from './components/DailyCatchUpCalculator';
import { Under5Calculator } from './components/Under5Calculator';
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
} from 'lucide-react';

function AppContent() {
  const { isInstallable, isOnline, install } = usePWA();
  const { language, toggleLanguage, isUrdu, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('calc-1');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const calculators = [
    { id: 'calc-1', num: '1', label: t.childAge.shortTitle, fullLabel: `1. ${t.childAge.shortTitle}`, icon: Calendar },
    { id: 'calc-2', num: '2', label: t.vaccineDemand.shortTitle, fullLabel: `2. ${t.vaccineDemand.shortTitle}`, icon: ShieldCheck },
    { id: 'calc-3', num: '3', label: t.vaccineWastage.shortTitle, fullLabel: `3. ${t.vaccineWastage.shortTitle}`, icon: AlertCircle },
    { id: 'calc-4', num: '4', label: t.naCoverage.shortTitle, fullLabel: `4. ${t.naCoverage.shortTitle}`, icon: UserX },
    { id: 'calc-5', num: '5', label: t.refusalCoverage.shortTitle, fullLabel: `5. ${t.refusalCoverage.shortTitle}`, icon: AlertTriangle },
    { id: 'calc-6', num: '6', label: t.missedChildren.shortTitle, fullLabel: `6. ${t.missedChildren.shortTitle}`, icon: ShieldAlert },
    { id: 'calc-7', num: '7', label: t.campaignCoverage.shortTitle, fullLabel: `7. ${t.campaignCoverage.shortTitle}`, icon: Award },
    { id: 'calc-8', num: '8', label: t.dailyCatchUp.shortTitle, fullLabel: `8. ${t.dailyCatchUp.shortTitle}`, icon: TrendingUp },
    { id: 'calc-9', num: '9', label: t.under5Population.shortTitle, fullLabel: `9. ${t.under5Population.shortTitle}`, icon: Users },
  ];

  // Scroll spy to highlight current calculator in the quick jump bar
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
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
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen clay-bg text-slate-900 flex flex-col justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 overflow-x-hidden selection:bg-teal-200 selection:text-teal-950 ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* Clay Header - Soft 3D Rounded Floating Bar */}
        <header className="clay-header p-3 sm:p-4 mb-3 flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-800 text-white flex items-center justify-center font-black shadow-[4px_5px_12px_rgba(15,118,110,0.38),inset_2px_2px_3px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(0,0,0,0.25)] border border-white/30 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {t.appTitle}
                </h1>
                <span className="clay-badge hidden sm:inline-block px-3 py-0.5 text-xs font-black text-teal-800 bg-teal-50 rounded-full">
                  {t.roleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5 leading-normal">
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
              className="clay-btn-light inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-black cursor-pointer"
            >
              <Languages className="w-4 h-4 text-teal-700 flex-shrink-0" />
              <span className={language === 'en' ? 'text-teal-800 font-black' : 'text-slate-400 font-bold'}>
                EN
              </span>
              <span className="text-slate-300">|</span>
              <span className={language === 'ur' ? 'text-teal-800 font-black font-arabic' : 'text-slate-400 font-bold'}>
                اردو
              </span>
            </button>

            {/* Online/Offline status */}
            <span
              className={`clay-badge inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-100'
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
                className="clay-btn-teal inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-black cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.install}</span>
              </button>
            )}
          </div>
        </header>

        {/* Quick Jump Horizontal Navigation: Clay Dock Bar */}
        <div className="sticky top-2 z-20 mb-3.5 clay-nav p-1.5 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5 px-0.5">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              const isActive = activeSection === calc.id;
              return (
                <button
                  key={calc.id}
                  id={`jump-btn-${calc.id}`}
                  type="button"
                  onClick={() => scrollToCalculator(calc.id)}
                  className={`flex items-center justify-center gap-2 py-2 px-3 sm:px-3.5 text-xs font-black transition-all whitespace-nowrap cursor-pointer flex-shrink-0 min-h-[40px] ${
                    isActive ? 'clay-nav-item-active' : 'clay-nav-item-inactive'
                  }`}
                  title={calc.fullLabel}
                >
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0 ${
                      isActive
                        ? 'bg-teal-900/40 text-white shadow-inner'
                        : 'clay-num-badge font-bold'
                    }`}
                  >
                    {calc.num}
                  </span>
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-teal-100' : 'text-teal-700'}`} />
                  <span className="tracking-tight">{calc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* All 9 Calculators in One Responsive Grid on 1 Page */}
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 min-h-0 pb-4">
          <section id="calc-1" className="scroll-mt-16 h-full">
            <ChildAgeCalculator compact={true} />
          </section>

          <section id="calc-2" className="scroll-mt-16 h-full">
            <VaccineDemandCalculator compact={true} />
          </section>

          <section id="calc-3" className="scroll-mt-16 h-full">
            <VaccineWastageCalculator compact={true} />
          </section>

          <section id="calc-4" className="scroll-mt-16 h-full">
            <NACoverageCalculator compact={true} />
          </section>

          <section id="calc-5" className="scroll-mt-16 h-full">
            <RefusalCalculator compact={true} />
          </section>

          <section id="calc-6" className="scroll-mt-16 h-full">
            <MissedChildrenCoverageCalculator compact={true} />
          </section>

          <section id="calc-7" className="scroll-mt-16 h-full">
            <CampaignCoverageCalculator compact={true} />
          </section>

          <section id="calc-8" className="scroll-mt-16 h-full">
            <DailyCatchUpCalculator compact={true} />
          </section>

          <section id="calc-9" className="scroll-mt-16 h-full">
            <Under5Calculator compact={true} />
          </section>
        </main>
      </div>

      {/* Floating Back-to-Top Button for Mobile & Web */}
      {showBackToTop && (
        <button
          id="back-to-top-btn"
          type="button"
          onClick={scrollToTop}
          aria-label={isUrdu ? 'اوپر جائیں' : 'Back to top'}
          className="clay-fab fixed bottom-5 ltr:right-5 rtl:left-5 z-30 p-3 rounded-full cursor-pointer flex items-center justify-center transition"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Footer - Minimal Professional Clay Pill */}
      <footer className="clay-header py-2.5 px-4 mt-2 mb-1 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-600 max-w-6xl w-full mx-auto flex-shrink-0">
        <span className="text-center sm:text-left font-medium">
          {t.footerRule}
        </span>
        <span className="font-extrabold text-slate-800 flex-shrink-0">
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
