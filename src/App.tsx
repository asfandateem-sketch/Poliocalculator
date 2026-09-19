import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { GlobalSearchBar } from './components/GlobalSearchBar';
import type { SearchableItem } from './searchData';
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
import { UpdatesSection } from './components/UpdatesSection';
import { HomeLatestUpdates } from './components/HomeLatestUpdates';
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

  // Targets passed when navigating from Global Search Bar
  const [targetTrainingId, setTargetTrainingId] = useState<string | undefined>(undefined);
  const [targetDocId, setTargetDocId] = useState<string | undefined>(undefined);
  const [targetScriptId, setTargetScriptId] = useState<string | undefined>(undefined);
  const [targetUpdateId, setTargetUpdateId] = useState<string | undefined>(undefined);

  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);

  // Hash-based initial route handling
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['training', 'communication', 'videos', 'updates', 'documents', 'field-resources', 'field_resources', 'faq'].includes(hash) || hash.startsWith('updates')) {
        if (hash.startsWith('updates')) {
          setActivePlatformCategory('updates');
          if (hash.startsWith('updates/')) {
            setTargetUpdateId(hash.replace('updates/', ''));
          } else {
            setTargetUpdateId(undefined);
          }
        } else {
          setActivePlatformCategory(hash === 'field-resources' ? 'field_resources' : (hash as PlatformCategoryKey));
        }
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

  const highlightElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('search-target-highlight');
      // Trigger reflow to restart animation
      void el.offsetWidth;
      el.classList.add('search-target-highlight');
      setTimeout(() => {
        el.classList.remove('search-target-highlight');
      }, 3000);
    }
  };

  const handleSelectSearchResult = (item: SearchableItem) => {
    triggerHaptic('medium');
    setActivePlatformCategory(item.category);
    const hash = item.category === 'field_resources' ? 'field-resources' : item.category;
    window.location.hash = hash;

    if (item.category === 'calculators') {
      setActiveSection(item.targetAnchor);
      setTimeout(() => {
        scrollToCalculator(item.targetAnchor);
        highlightElement(item.targetAnchor);
      }, 100);
    } else if (item.category === 'training') {
      setTargetTrainingId(item.id);
      setTimeout(() => {
        highlightElement(item.id);
      }, 250);
    } else if (item.category === 'documents') {
      setTargetDocId(item.id);
      setTimeout(() => {
        highlightElement(item.id);
      }, 250);
    } else if (item.category === 'communication') {
      setTargetScriptId(item.id);
      setTimeout(() => {
        highlightElement(item.id);
      }, 250);
    } else if (item.category === 'updates') {
      setTargetUpdateId(item.id);
      window.location.hash = `updates/${item.id}`;
    } else {
      setTimeout(() => {
        const el = document.getElementById(item.targetAnchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          highlightElement(item.targetAnchor);
        }
      }, 150);
    }
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
      className={`min-h-screen saas-bg text-slate-900 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-5 overflow-x-clip selection:bg-teal-200 selection:text-teal-950 relative ${
        isUrdu ? 'font-arabic' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Liquid Glass Ambient Fluid Light Refraction Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-teal-200/35 blur-3xl" />
        <div className="absolute top-2/3 -left-20 w-[28rem] h-[28rem] rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[30rem] h-[30rem] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 min-h-0 relative z-0">
        {/* Header - Compact Clean Liquid Glass Header */}
        <header className="saas-header p-3 sm:p-4 mb-2.5 sm:mb-3 flex items-center justify-between flex-shrink-0 gap-2 sm:gap-3 liquid-shimmer">
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
              className="w-8 h-8 rounded-lg bg-teal-50/80 backdrop-blur-md hover:bg-teal-100/90 text-teal-800 border border-teal-200/80 flex items-center justify-center cursor-pointer transition shadow-xs"
            >
              <Info className="w-4 h-4 text-teal-700" />
            </button>
          </div>
        </header>

        {/* Global Search Bar - Filter Calculators, Training Modules, Documents & Scripts */}
        <GlobalSearchBar onSelectResult={handleSelectSearchResult} />

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

        {/* View Switcher: Calculators OR Other Hub Sections with Spring Transitions */}
        <AnimatePresence mode="wait" initial={false}>
          {activePlatformCategory === 'calculators' && (
            <motion.div
              key="calculators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0"
            >
              {/* Sticky Horizontal Calculator Quick Selector */}
              <TopCalculatorNavigation
                activeSection={activeSection}
                onSelect={scrollToCalculator}
              />

              {/* Homepage Compact Latest Updates Feed */}
              <HomeLatestUpdates
                onNavigateToUpdates={(id) => {
                  setActivePlatformCategory('updates');
                  if (id) {
                    setTargetUpdateId(id);
                    window.location.hash = `updates/${id}`;
                  } else {
                    setTargetUpdateId(undefined);
                    window.location.hash = 'updates';
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* All 9 Calculators Aligned in Clean Full-Width Container */}
              <main className="w-full min-w-0 space-y-6 sm:space-y-7 pb-8">
                <motion.section
                  id="calc-1"
                  animate={{
                    scale: activeSection === 'calc-1' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-1' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <ChildAgeCalculator />
                </motion.section>

                <motion.section
                  id="calc-2"
                  animate={{
                    scale: activeSection === 'calc-2' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-2' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <VaccineDemandCalculator />
                </motion.section>

                <motion.section
                  id="calc-3"
                  animate={{
                    scale: activeSection === 'calc-3' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-3' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <VaccineWastageCalculator />
                </motion.section>

                <motion.section
                  id="calc-4"
                  animate={{
                    scale: activeSection === 'calc-4' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-4' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <NACoverageCalculator />
                </motion.section>

                <motion.section
                  id="calc-5"
                  animate={{
                    scale: activeSection === 'calc-5' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-5' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <RefusalCalculator />
                </motion.section>

                <motion.section
                  id="calc-6"
                  animate={{
                    scale: activeSection === 'calc-6' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-6' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <MissedChildrenCoverageCalculator />
                </motion.section>

                <motion.section
                  id="calc-7"
                  animate={{
                    scale: activeSection === 'calc-7' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-7' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <CampaignCoverageCalculator />
                </motion.section>

                <motion.section
                  id="calc-8"
                  animate={{
                    scale: activeSection === 'calc-8' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-8' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <DailyCatchUpCalculator />
                </motion.section>

                <motion.section
                  id="calc-9"
                  animate={{
                    scale: activeSection === 'calc-9' ? 1 : 0.997,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 rounded-2xl ${
                    activeSection === 'calc-9' ? 'ring-2 ring-teal-500/25 shadow-md' : ''
                  }`}
                >
                  <Under5Calculator />
                </motion.section>
              </main>
            </motion.div>
          )}

          {activePlatformCategory === 'training' && (
            <motion.main
              key="training"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <TrainingSection targetModuleId={targetTrainingId} />
            </motion.main>
          )}

          {activePlatformCategory === 'communication' && (
            <motion.main
              key="communication"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <CommunicationSection
                targetScriptId={targetScriptId}
                onNavigateToVideos={() => setActivePlatformCategory('videos')}
              />
            </motion.main>
          )}

          {activePlatformCategory === 'videos' && (
            <motion.main
              key="videos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <VideosSection />
            </motion.main>
          )}

          {activePlatformCategory === 'documents' && (
            <motion.main
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <DocumentsSection targetDocId={targetDocId} />
            </motion.main>
          )}

          {activePlatformCategory === 'updates' && (
            <motion.main
              key="updates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <UpdatesSection
                initialUpdateId={targetUpdateId}
                onSelectCalculator={(calcId) => {
                  setActivePlatformCategory('calculators');
                  setActiveSection(calcId);
                  setTimeout(() => {
                    scrollToCalculator(calcId);
                    highlightElement(calcId);
                  }, 120);
                }}
                onCloseDetail={() => {
                  setTargetUpdateId(undefined);
                  window.location.hash = 'updates';
                }}
              />
            </motion.main>
          )}

          {activePlatformCategory === 'field_resources' && (
            <motion.main
              key="field_resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <FieldResourcesSection />
            </motion.main>
          )}

          {activePlatformCategory === 'faq' && (
            <motion.main
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              className="w-full min-w-0 pb-8"
            >
              <FaqSection />
            </motion.main>
          )}
        </AnimatePresence>
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
