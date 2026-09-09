import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { triggerHaptic } from './haptics';
import {
  Info,
  Languages,
  ArrowUp,
  Share2,
  Check,
} from 'lucide-react';
import { CALCULATOR_ITEMS, type PlatformCategoryKey } from './platformNavigation';
import { BrandLogo } from './components/BrandLogo';
import { PlatformHubNavigation } from './components/PlatformHubNavigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { AttributionModal } from './components/AttributionModal';
import { TopCalculatorNavigation } from './components/TopCalculatorNavigation';
import { ChildAgeCalculator } from './components/ChildAgeCalculator';
import { VaccineDemandCalculator } from './components/VaccineDemandCalculator';
import { VaccineWastageCalculator } from './components/VaccineWastageCalculator';
import { NACoverageCalculator } from './components/NACoverageCalculator';
import { RefusalCalculator } from './components/RefusalCalculator';
import { MissedChildrenCoverageCalculator } from './components/MissedChildrenCoverageCalculator';
import { CampaignCoverageCalculator } from './components/CampaignCoverageCalculator';
import { DailyCatchUpCalculator } from './components/DailyCatchUpCalculator';
import { Under5Calculator } from './components/Under5Calculator';
import { TrainingSection } from './components/TrainingSection';
import { CommunicationSection } from './components/CommunicationSection';
import { VideosSection } from './components/VideosSection';
import { DocumentsSection } from './components/DocumentsSection';
import { FieldResourcesSection } from './components/FieldResourcesSection';
import { FaqSection } from './components/FaqSection';

function AppContent() {
  const { language, toggleLanguage, isUrdu, t } = useLanguage();
  const [activePlatformCategory, setActivePlatformCategory] = useState<PlatformCategoryKey>('calculators');
  const [activeSection, setActiveSection] = useState<string>('calc-1');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [isAttributionOpen, setIsAttributionOpen] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(false);

  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);

  // Hash-based initial route handling
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['training', 'communication', 'videos', 'documents', 'field-resources', 'field_resources', 'faq'].includes(hash)) {
        setActivePlatformCategory(hash === 'field-resources' ? 'field_resources' : (hash as PlatformCategoryKey));
      } else if (hash.startsWith('calc-') || hash === 'calculators') {
        setActivePlatformCategory('calculators');
        if (hash.startsWith('calc-')) {
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Register lightweight service worker for reliable offline caching in remote areas
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently continue if SW registration is restricted by environment
      });
    }
  }, []);

  // Scroll spy to highlight the currently visible calculator when in calculators category
  useEffect(() => {
    if (activePlatformCategory !== 'calculators') return;

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
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
  }, [activePlatformCategory]);

  const scrollToCalculator = useCallback((id: string) => {
    triggerHaptic('light');
    if (activePlatformCategory !== 'calculators') {
      setActivePlatformCategory('calculators');
    }

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        isProgrammaticScrollRef.current = true;
        setActiveSection(id);

        if (scrollEndTimerRef.current) {
          clearTimeout(scrollEndTimerRef.current);
        }

        const topBar = document.getElementById('top-calculators-bar');
        const topBarHeight = topBar ? topBar.offsetHeight : 76;
        const headerOffset = topBarHeight + 14;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });

        scrollEndTimerRef.current = window.setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 750);
      }
    }, 50);
  }, [activePlatformCategory]);

  const scrollToTop = useCallback(() => {
    triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleLanguage = useCallback(() => {
    triggerHaptic('light');
    toggleLanguage();
  }, [toggleLanguage]);

  const handleSelectCategory = (cat: PlatformCategoryKey) => {
    setActivePlatformCategory(cat);
    const hash = cat === 'field_resources' ? 'field-resources' : cat;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    triggerHaptic('light');
    const shareData = {
      title: 'Polio Field Tools',
      text: 'Practical tools and resources for polio campaign workers in Pakistan.',
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2500);
    }
  };

  return (
    <div
      className={`min-h-screen saas-bg text-slate-900 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-5 overflow-x-clip selection:bg-teal-200 selection:text-teal-950 ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* Header - Compact Clean Healthcare SaaS Header */}
        <header className="saas-header p-3 sm:p-4 mb-2.5 sm:mb-3 flex items-center justify-between flex-shrink-0 gap-2 sm:gap-3">
          <BrandLogo size="md" isUrdu={isUrdu} />

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Share Button */}
            <button
              id="share-app-btn"
              type="button"
              onClick={handleShare}
              aria-label={isUrdu ? 'شیئر کریں' : 'Share tools'}
              title={isUrdu ? 'شیئر کریں' : 'Share link with field team'}
              className="saas-btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-2 text-xs font-semibold cursor-pointer"
            >
              {isShared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xs:inline text-emerald-700">{isUrdu ? 'کاپی ہوگیا' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden xs:inline text-slate-700">{isUrdu ? 'شیئر' : 'Share'}</span>
                </>
              )}
            </button>

            {/* Language Switcher: EN | اردو */}
            <button
              id="language-toggle-btn"
              type="button"
              onClick={handleToggleLanguage}
              aria-label={isUrdu ? 'EN / اردو: Switch to English language' : 'EN / اردو: اردو زبان منتخب کریں'}
              title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              className="saas-btn-secondary inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700 flex-shrink-0" />
              <span className={language === 'en' ? 'text-teal-900 font-bold' : 'text-slate-600 font-semibold'}>
                EN
              </span>
              <span className="text-slate-400 font-normal" aria-hidden="true">|</span>
              <span className={language === 'ur' ? 'text-teal-900 font-bold font-arabic' : 'text-slate-600 font-semibold font-arabic'}>
                اردو
              </span>
            </button>

            {/* Attribution / Info Button (i) */}
            <button
              id="info-modal-btn"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsAttributionOpen(true);
              }}
              aria-label={isUrdu ? 'معلومات اور اصول' : 'App Information and Guidelines'}
              title={isUrdu ? 'معلومات دیکھیں' : 'View Attribution & Standards'}
              className="w-8 h-8 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 flex items-center justify-center cursor-pointer transition"
            >
              <Info className="w-4 h-4 text-teal-700" />
            </button>
          </div>
        </header>

        {/* Primary Platform Hub Navigation (Calculators, Training, Communication, Videos, Documents, Field Resources, FAQ) */}
        <PlatformHubNavigation
          activeCategory={activePlatformCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Semantic Breadcrumbs Navigation */}
        <div className="mb-2">
          <Breadcrumbs
            activeTab={activePlatformCategory}
            onTabChange={handleSelectCategory}
          />
        </div>

        {/* View Switcher: Calculators OR Other Hub Sections */}
        {activePlatformCategory === 'calculators' && (
          <>
            {/* Sticky Horizontal Calculator Quick Selector */}
            <TopCalculatorNavigation
              activeSection={activeSection}
              onSelect={scrollToCalculator}
            />

            {/* All 9 Calculators Aligned in Clean Full-Width Container */}
            <main className="w-full min-w-0 space-y-6 sm:space-y-7 pb-8">
              <section id="calc-1" className="scroll-mt-24 sm:scroll-mt-28">
                <ChildAgeCalculator />
              </section>

              <section id="calc-2" className="scroll-mt-24 sm:scroll-mt-28">
                <VaccineDemandCalculator />
              </section>

              <section id="calc-3" className="scroll-mt-24 sm:scroll-mt-28">
                <VaccineWastageCalculator />
              </section>

              <section id="calc-4" className="scroll-mt-24 sm:scroll-mt-28">
                <NACoverageCalculator />
              </section>

              <section id="calc-5" className="scroll-mt-24 sm:scroll-mt-28">
                <RefusalCalculator />
              </section>

              <section id="calc-6" className="scroll-mt-24 sm:scroll-mt-28">
                <MissedChildrenCoverageCalculator />
              </section>

              <section id="calc-7" className="scroll-mt-24 sm:scroll-mt-28">
                <CampaignCoverageCalculator />
              </section>

              <section id="calc-8" className="scroll-mt-24 sm:scroll-mt-28">
                <DailyCatchUpCalculator />
              </section>

              <section id="calc-9" className="scroll-mt-24 sm:scroll-mt-28">
                <Under5Calculator />
              </section>
            </main>
          </>
        )}

        {activePlatformCategory === 'training' && (
          <main className="w-full min-w-0 pb-8">
            <TrainingSection />
          </main>
        )}

        {activePlatformCategory === 'communication' && (
          <main className="w-full min-w-0 pb-8">
            <CommunicationSection />
          </main>
        )}

        {activePlatformCategory === 'videos' && (
          <main className="w-full min-w-0 pb-8">
            <VideosSection />
          </main>
        )}

        {activePlatformCategory === 'documents' && (
          <main className="w-full min-w-0 pb-8">
            <DocumentsSection />
          </main>
        )}

        {activePlatformCategory === 'field_resources' && (
          <main className="w-full min-w-0 pb-8">
            <FieldResourcesSection />
          </main>
        )}

        {activePlatformCategory === 'faq' && (
          <main className="w-full min-w-0 pb-8">
            <FaqSection />
          </main>
        )}
      </div>

      {/* Floating Back to Top Button */}
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

      {/* Attribution & Standards Modal */}
      <AttributionModal
        isOpen={isAttributionOpen}
        onClose={() => setIsAttributionOpen(false)}
      />

      {/* Footer - Professional Clean Minimal Footer with Transparency Disclaimer */}
      <footer className="saas-header py-3.5 px-4 mt-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 max-w-5xl w-full mx-auto flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 text-center sm:text-left">
          <span className="font-semibold text-slate-700">Polio Field Tools</span>
          <span className="hidden sm:inline">•</span>
          <span>{t.footerRule}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              handleSelectCategory('faq');
            }}
            className="text-teal-800 hover:text-teal-900 font-semibold cursor-pointer"
          >
            {isUrdu ? 'سوالات و جوابات' : 'FAQ & SOPs'}
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsAttributionOpen(true);
            }}
            className="text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isUrdu ? 'معلومات' : 'Disclaimer'}
          </button>
        </div>
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
