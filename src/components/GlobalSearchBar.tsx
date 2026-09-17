import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  Search,
  X,
  Calculator,
  BookOpen,
  FileText,
  MessageSquare,
  Compass,
  HelpCircle,
  CornerDownLeft,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  SEARCHABLE_ITEMS,
  searchItems,
  type SearchableItem,
  type SearchItemType,
} from '../searchData';

interface GlobalSearchBarProps {
  onSelectResult: (item: SearchableItem) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onSelectResult }) => {
  const { isUrdu } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Filter items based on query & category
  const results = useMemo(() => {
    return searchItems(query, activeFilter, isUrdu);
  }, [query, activeFilter, isUrdu]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Press '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is already typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if ((e.key === '/' && !isInput) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        triggerHaptic('light');
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    triggerHaptic('light');
    setQuery('');
    setActiveFilter('all');
    inputRef.current?.focus();
  };

  const handleSelect = (item: SearchableItem) => {
    triggerHaptic('medium');
    setIsFocused(false);
    onSelectResult(item);
  };

  // Keyboard navigation within search results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current && results.length > 0) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  // Icon mapping per category
  const getIcon = (type: SearchItemType) => {
    switch (type) {
      case 'calculator':
        return <Calculator className="w-4 h-4 text-teal-600 flex-shrink-0" />;
      case 'training':
        return <BookOpen className="w-4 h-4 text-sky-600 flex-shrink-0" />;
      case 'document':
        return <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'field_resources':
        return <Compass className="w-4 h-4 text-purple-600 flex-shrink-0" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />;
    }
  };

  const filterTabs = [
    { id: 'all', labelEn: 'All Tools', labelUr: 'تمام', count: SEARCHABLE_ITEMS.length },
    { id: 'calculators', labelEn: 'Calculators', labelUr: 'کیلکولیٹرز', count: 9 },
    { id: 'training', labelEn: 'Training SOPs', labelUr: 'تربیت', count: 4 },
    { id: 'documents', labelEn: 'Documents', labelUr: 'فارمز', count: 4 },
    { id: 'communication', labelEn: 'Communication', labelUr: 'کمیونیکیشن', count: 4 },
  ];

  const popularSearches = [
    { labelEn: 'bOPV Demand (Vials)', labelUr: 'ویکسین طلب (وائلز)', query: 'demand' },
    { labelEn: 'VVM Stages 1–4', labelUr: 'VVM اسٹیجز', query: 'vvm' },
    { labelEn: 'Form A Tally Sheet', labelUr: 'فارم اے ٹیلی شیٹ', query: 'form a' },
    { labelEn: 'Refusal Conversion', labelUr: 'انکار کنورژن', query: 'refusal' },
    { labelEn: 'Cold Chain (+2°C)', labelUr: 'کولڈ چین پروٹوکول', query: 'cold chain' },
    { labelEn: 'Left Pinky Marking', labelUr: 'انگلی پر نشان', query: 'finger marking' },
  ];

  const showDropdown = isFocused;
  const ArrowIcon = isUrdu ? ArrowLeft : ArrowRight;

  return (
    <div
      ref={containerRef}
      id="global-search-container"
      className="relative w-full mb-3 sm:mb-3.5 z-40"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Search Input Bar - 2026 Spotlight Capsule */}
      <div
        className={`relative flex items-center bg-white/85 backdrop-blur-2xl rounded-2xl border transition-all duration-200 shadow-[0_4px_16px_-2px_rgba(15,35,65,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] ${
          isFocused
            ? 'border-teal-500/90 ring-4 ring-teal-500/18 shadow-xl shadow-teal-950/8 bg-white'
            : 'border-white/90 hover:border-slate-300/80 hover:bg-white/90'
        }`}
      >
        {/* Search Icon */}
        <div className="pl-3.5 pr-2.5 text-slate-400 flex items-center justify-center pointer-events-none">
          <Search className="w-4 h-4 text-teal-700" />
        </div>

        {/* Input Element */}
        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isFocused) setIsFocused(true);
          }}
          onFocus={() => {
            triggerHaptic('light');
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isUrdu
              ? 'کیلکولیٹرز، ٹریننگ SOPs، فارمز یا رہنمائی تلاش کریں (مثلاً وائل، VVM، فارم اے)...'
              : 'Search calculators, training SOPs, documents & scripts (e.g. vials, VVM, Form A, refusal)...'
          }
          autoComplete="off"
          spellCheck={false}
          className="w-full py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none pr-3"
        />

        {/* Action Buttons inside Input */}
        <div className="flex items-center gap-1.5 px-3">
          {query ? (
            <button
              id="clear-search-btn"
              type="button"
              onClick={handleClear}
              aria-label={isUrdu ? 'تلاش صاف کریں' : 'Clear search'}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div
              className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-slate-200/80 bg-white/70 backdrop-blur-xs text-[10px] text-slate-500 font-mono select-none shadow-2xs"
              title="Press / or Ctrl+K to search"
            >
              <span>/</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Interactive Results Dropdown */}
      {showDropdown && (
        <div
          id="search-results-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-white/92 backdrop-blur-3xl rounded-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.6)] overflow-hidden z-50 animate-in fade-in-50 duration-150 max-h-[75vh] flex flex-col liquid-shimmer"
        >
          {/* Quick Filter Bar */}
          <div className="p-2 sm:p-2.5 bg-slate-50/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveFilter(tab.id);
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap select-none cursor-pointer flex items-center gap-1.5 transition-colors duration-150 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSearchFilterPill"
                        className="absolute inset-0 rounded-lg bg-teal-800 shadow-xs z-0"
                        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                      />
                    )}
                    <span className="relative z-10">{isUrdu ? tab.labelUr : tab.labelEn}</span>
                    <span
                      className={`relative z-10 text-[10px] font-mono px-1 rounded-full transition-colors duration-150 ${
                        isActive ? 'bg-teal-950 text-teal-200' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {results.length > 0 && query && (
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:inline px-2">
                {isUrdu ? `${results.length} نتائج ملے` : `${results.length} results`}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div
            ref={resultsContainerRef}
            className="overflow-y-auto p-2 sm:p-2.5 space-y-1.5 max-h-[55vh]"
          >
            {/* When search query is empty: Show Popular Quick Searches */}
            {!query && activeFilter === 'all' && (
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isUrdu ? 'اکثر تلاش کیے جانے والے عنوانات:' : 'Popular Quick Searches:'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setQuery(item.query);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border border-slate-200/80 text-xs font-medium text-slate-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    {isUrdu
                      ? 'یا نام یا مطلوبہ لفظ لکھ کر فوری فلٹر کریں'
                      : 'Tip: Type any keyword, acronym (e.g. VVM, NA, PTP), or formula'}
                  </span>
                  <span className="hidden sm:inline font-mono text-[10px]">
                    Esc to close • ↑↓ to navigate
                  </span>
                </div>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 ? (
              results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const title = isUrdu ? item.titleUr : item.titleEn;
                const desc = isUrdu ? item.descriptionUr : item.descriptionEn;
                const badge = isUrdu ? item.badgeUr : item.badgeEn;
                const typeLabel = isUrdu ? item.typeLabelUr : item.typeLabelEn;

                return (
                  <div
                    key={item.id}
                    data-index={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-300 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200/80 flex-shrink-0">
                        {getIcon(item.type)}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                            {typeLabel}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                            {badge}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {title}
                        </h4>

                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {desc}
                        </p>

                        {/* Formula or Code pill if available */}
                        {item.formulaOrCode && (
                          <div className="pt-0.5">
                            <span className="text-[10px] font-mono text-teal-800 bg-teal-50/90 px-2 py-0.5 rounded border border-teal-200/50 inline-block">
                              {item.formulaOrCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Jump Action Button */}
                    <div className="flex items-center gap-1 flex-shrink-0 self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(item);
                        }}
                        className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-800 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-teal-100 hover:text-teal-900'
                        }`}
                      >
                        <span className="hidden sm:inline">
                          {isUrdu ? 'کھولیں' : 'Open'}
                        </span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : query ? (
              /* Empty State */
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  {isUrdu ? 'کوئی نتیجہ نہیں ملا' : `No matches for "${query}"`}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isUrdu
                    ? 'براہ کرم دوسرا لفظ استعمال کریں یا فلٹر کو "تمام" پر تبدیل کریں۔'
                    : 'Try checking for spelling errors, or searching for broader terms like "vials", "coverage", "VVM", or "refusal".'}
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold cursor-pointer"
                >
                  {isUrdu ? 'تلاش دوبارہ شروع کریں' : 'Reset Search'}
                </button>
              </div>
            ) : null}
          </div>

          {/* Footer Bar */}
          <div className="p-2 sm:px-3 sm:py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                <CornerDownLeft className="w-2.5 h-2.5" /> Enter
              </span>
              <span>{isUrdu ? 'منتخب کرنے کے لیے' : 'to select'}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              {isUrdu ? 'بند کریں (Esc)' : 'Close (Esc)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
