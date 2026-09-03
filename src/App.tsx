import React, { useState, useEffect } from 'react';
import { usePWA } from './usePWA';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ChildAgeCalculator } from './components/ChildAgeCalculator';
import { VaccineDemandCalculator } from './components/VaccineDemandCalculator';
import { VaccineWastageCalculator } from './components/VaccineWastageCalculator';
import { CampaignCoverageCalculator } from './components/CampaignCoverageCalculator';
import { DailyCatchUpCalculator } from './components/DailyCatchUpCalculator';
import { NACoverageCalculator } from './components/NACoverageCalculator';
import { RefusalCalculator } from './components/RefusalCalculator';
import { Under5Calculator } from './components/Under5Calculator';
import {
  Shield,
  Download,
  Wifi,
  WifiOff,
  LayoutGrid,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Award,
  TrendingUp,
  UserX,
  AlertTriangle,
  Users,
  ChevronLeft,
  ChevronRight,
  Languages,
} from 'lucide-react';

function AppContent() {
  const { isInstallable, isOnline, install } = usePWA();
  const { language, toggleLanguage, isUrdu, t } = useLanguage();

  // Tab state: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'all'
  // On mobile (< 1024px), default to '1' for a zero-scroll single tool screen
  // On desktop (>= 1024px), default to 'all' for the operations dashboard
  const [activeTab, setActiveTab] = useState<string>('1');

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setActiveTab('all');
    }
  }, []);

  const tabs = [
    { id: '1', num: '1', label: t.childAge.shortTitle, fullLabel: `1. ${t.childAge.shortTitle}`, icon: Calendar },
    { id: '2', num: '2', label: t.vaccineDemand.shortTitle, fullLabel: `2. ${t.vaccineDemand.shortTitle}`, icon: ShieldCheck },
    { id: '3', num: '3', label: t.vaccineWastage.shortTitle, fullLabel: `3. ${t.vaccineWastage.shortTitle}`, icon: AlertCircle },
    { id: '4', num: '4', label: t.campaignCoverage.shortTitle, fullLabel: `4. ${t.campaignCoverage.shortTitle}`, icon: Award },
    { id: '5', num: '5', label: t.dailyCatchUp.shortTitle, fullLabel: `5. ${t.dailyCatchUp.shortTitle}`, icon: TrendingUp },
    { id: '6', num: '6', label: t.naCoverage.shortTitle, fullLabel: `6. ${t.naCoverage.shortTitle}`, icon: UserX },
    { id: '7', num: '7', label: t.refusalCoverage.shortTitle, fullLabel: `7. ${t.refusalCoverage.shortTitle}`, icon: AlertTriangle },
    { id: '8', num: '8', label: t.under5Population.shortTitle, fullLabel: `8. ${t.under5Population.shortTitle}`, icon: Users },
  ];

  const currentTabIdx = tabs.findIndex((t) => t.id === activeTab);

  const goToPrevTab = () => {
    if (currentTabIdx > 0) {
      setActiveTab(tabs[currentTabIdx - 1].id);
    } else if (currentTabIdx === -1 && activeTab === 'all') {
      setActiveTab('1');
    }
  };

  const goToNextTab = () => {
    if (currentTabIdx >= 0 && currentTabIdx < tabs.length - 1) {
      setActiveTab(tabs[currentTabIdx + 1].id);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between p-2 sm:p-2.5 md:p-3 selection:bg-teal-100 selection:text-teal-900 ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* Header - Compact & Professional */}
        <header className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/90 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 tracking-tight leading-none">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-teal-800 bg-teal-100/80 rounded-full border border-teal-200/60">
                  {t.roleBadge}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-none truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* bOPV fixed pill */}
            <span
              className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80 font-mono"
              dir="ltr"
            >
              {t.fixedRuleHeader}
            </span>

            {/* Language Switcher: EN | اردو */}
            <button
              id="language-toggle-btn"
              type="button"
              onClick={toggleLanguage}
              aria-label={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-700 hover:text-teal-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 active:scale-95 transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              <span className={language === 'en' ? 'text-teal-700 font-extrabold' : 'text-slate-400'}>
                EN
              </span>
              <span className="text-slate-300">|</span>
              <span className={language === 'ur' ? 'text-teal-700 font-extrabold font-arabic' : 'text-slate-400'}>
                اردو
              </span>
            </button>

            {/* Online/Offline status */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : 'bg-amber-50 text-amber-700 border-amber-200/80'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span className="hidden xs:inline">{t.offlineReady}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-xs active:scale-95 transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span className="hidden xs:inline">{t.install}</span>
              </button>
            )}
          </div>
        </header>

        {/* Segmented Calculator Selector */}
        <div className="flex items-center justify-between gap-1 mb-2.5 bg-slate-200/80 p-1 rounded-xl flex-shrink-0 text-xs font-semibold">
          {/* 9 Calculator buttons in horizontal scrollable strip */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                  <span className="sm:hidden">{tab.num}. {tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Overview Toggle */}
          <button
            id="tab-btn-all"
            type="button"
            onClick={() => setActiveTab('all')}
            className={`hidden lg:flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ltr:ml-1 rtl:mr-1 flex-shrink-0 ${
              activeTab === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            title={isUrdu ? 'تمام 8 کیلکولیٹرز ایک ساتھ دیکھیں' : 'View all 8 calculators in a 2-column layout'}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.allGrid}</span>
          </button>
        </div>

        {/* Mobile Sub-Navigation Stepper for single view */}
        {activeTab !== 'all' && (
          <div className="flex lg:hidden items-center justify-between mb-2 px-1 text-xs text-slate-500">
            <button
              type="button"
              onClick={goToPrevTab}
              disabled={currentTabIdx <= 0}
              className={`flex items-center gap-0.5 text-[11px] font-semibold transition ${
                currentTabIdx > 0
                  ? 'text-slate-700 hover:text-teal-700 cursor-pointer'
                  : 'text-slate-300 pointer-events-none'
              }`}
            >
              {isUrdu ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              <span>{t.prevTool}</span>
            </button>

            <span className="text-[11px] font-bold text-slate-700">
              {t.toolOf(tabs[currentTabIdx]?.num || activeTab, tabs.length)}
            </span>

            <button
              type="button"
              onClick={goToNextTab}
              disabled={currentTabIdx >= tabs.length - 1}
              className={`flex items-center gap-0.5 text-[11px] font-semibold transition ${
                currentTabIdx < tabs.length - 1
                  ? 'text-slate-700 hover:text-teal-700 cursor-pointer'
                  : 'text-slate-300 pointer-events-none'
              }`}
            >
              <span>{t.nextTool}</span>
              {isUrdu ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {activeTab === 'all' ? (
          // Desktop 2-Column Layout for All 8 Calculators
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0 pb-3">
            <ChildAgeCalculator compact={true} />
            <VaccineDemandCalculator compact={true} />
            <VaccineWastageCalculator compact={true} />
            <CampaignCoverageCalculator compact={true} />
            <DailyCatchUpCalculator compact={true} />
            <NACoverageCalculator compact={true} />
            <RefusalCalculator compact={true} />
            <Under5Calculator compact={true} />
          </main>
        ) : (
          // Single Calculator View (Mobile-First Focused View)
          <main className="flex-1 flex flex-col justify-start max-w-lg mx-auto w-full min-h-0 pb-3">
            {activeTab === '1' && <ChildAgeCalculator compact={false} />}
            {activeTab === '2' && <VaccineDemandCalculator compact={false} />}
            {activeTab === '3' && <VaccineWastageCalculator compact={false} />}
            {activeTab === '4' && <CampaignCoverageCalculator compact={false} />}
            {activeTab === '5' && <DailyCatchUpCalculator compact={false} />}
            {activeTab === '6' && <NACoverageCalculator compact={false} />}
            {activeTab === '7' && <RefusalCalculator compact={false} />}
            {activeTab === '8' && <Under5Calculator compact={false} />}
          </main>
        )}
      </div>

      {/* Footer - Minimal Professional */}
      <footer className="pt-2 mt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-500 max-w-6xl w-full mx-auto flex-shrink-0">
        <span className="text-center sm:text-left">
          {t.footerRule}
        </span>
        <span className="font-semibold text-slate-600 flex-shrink-0">
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
