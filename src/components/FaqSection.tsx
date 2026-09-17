import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Users,
  HeartPulse,
  ShieldCheck,
  FileCheck2,
  Share2,
  Info,
  Layers,
} from 'lucide-react';
import { COMPREHENSIVE_FAQS, FAQ_CATEGORIES, FaqItem } from '../data/faqsData';

export const FaqSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(
    () => new Set(['sbc-1', 'med-1'])
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    triggerHaptic('light');
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    triggerHaptic('medium');
    setExpandedFaqIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    triggerHaptic('light');
    setExpandedFaqIds(new Set());
  };

  const handleCopyFaq = (item: FaqItem) => {
    triggerHaptic('success');
    const textToCopy = isUrdu
      ? `سوال: ${item.questionUr}\n\nجواب: ${item.answerUr}\n\nاہم نکات:\n${item.keyPointsUr.map((p) => `• ${p}`).join('\n')}\n\n(پولیو فیلڈ ٹولز - مستند رہنمائی)`
      : `Question: ${item.questionEn}\n\nAnswer: ${item.answerEn}\n\nKey Takeaways:\n${item.keyPointsEn.map((p) => `• ${p}`).join('\n')}\n\n(Polio Field Tools - Standard Guidance)`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return COMPREHENSIVE_FAQS.filter((item) => {
      // 1. Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.questionEn.toLowerCase().includes(q) ||
        item.questionUr.includes(q) ||
        item.answerEn.toLowerCase().includes(q) ||
        item.answerUr.includes(q) ||
        item.badgeEn.toLowerCase().includes(q) ||
        item.badgeUr.includes(q) ||
        item.keyPointsEn.some((kp) => kp.toLowerCase().includes(q)) ||
        item.keyPointsUr.some((kp) => kp.includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq" className="w-full space-y-4">
      {/* 1. Header Banner */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {isUrdu
                    ? 'اکثر پوچھے جانے والے سوالات و ایس بی سی (SBC) حکمت عملی'
                    : 'Frequently Asked Questions & SBC Strategy'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-200">
                  {COMPREHENSIVE_FAQS.length} {isUrdu ? 'مستند سوالات' : 'Verified FAQs'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                {isUrdu
                  ? 'سوشل اینڈ بیہیویئر چینج (SBC)، انکاری والدین کے ازالے، طبی اصول اور فیلڈ آپریشنز کے مستند جوابات'
                  : 'Authoritative guidance on Social & Behavior Change (SBC), refusal conversion, vaccine clinical safety, and field SOPs'}
              </p>
            </div>
          </div>

          {/* Quick Expand / Collapse Actions */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition cursor-pointer"
            >
              {isUrdu ? 'تمام کھولیں' : 'Expand All'}
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              {isUrdu ? 'تمام سمیٹیں' : 'Collapse All'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Filter & Search Bar */}
      <div className="saas-card p-3 sm:p-4 space-y-3 bg-white shadow-xs">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isUrdu
                ? 'ایس بی سی، حلال حیثیت، انکاری کیسز، یا ویکسین سے متعلق تلاش کریں...'
                : 'Search SBC strategy, Halal status, refusal scripts, or medical FAQs...'
            }
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? COMPREHENSIVE_FAQS.length
                : COMPREHENSIVE_FAQS.filter((f) => f.category === cat.id).length;

            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveCategory(cat.id);
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold select-none flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                  isSelected
                    ? 'text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFaqCategoryPill"
                    className="absolute inset-0 rounded-xl bg-teal-700 shadow-xs z-0"
                    transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                  />
                )}
                <span className="relative z-10">{isUrdu ? cat.labelUr : cat.labelEn}</span>
                <span
                  className={`relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-mono transition-colors duration-150 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="saas-card p-10 text-center space-y-2 bg-white">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            {isUrdu ? 'کوئی سوال نہیں ملا' : 'No matching questions found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'تلاش کے الفاظ تبدیل کریں یا تمام کیٹیگریز منتخب کریں۔'
              : 'Try using different keywords or clear the search query.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-2 px-3 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition"
          >
            {isUrdu ? 'فلٹرز صاف کریں' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isExpanded = expandedFaqIds.has(item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className={`saas-card transition-all duration-200 overflow-hidden bg-white border border-slate-200/90 ${
                  isExpanded ? 'ring-2 ring-teal-500/30 shadow-sm' : 'hover:border-slate-300'
                }`}
              >
                {/* Question Header */}
                <div
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left p-3.5 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.category === 'sbc_strategy'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : item.category === 'important_medical'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : item.category === 'refusals_rumors'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}
                      >
                        {isUrdu ? item.badgeUr : item.badgeEn}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {isUrdu ? item.questionUr : item.questionEn}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isExpanded ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div className="px-3.5 sm:px-4.5 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/40">
                    {/* Primary Answer Paragraph */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                        {isUrdu ? item.answerUr : item.answerEn}
                      </p>
                    </div>

                    {/* Operational Key Takeaways */}
                    {item.keyPointsEn.length > 0 && (
                      <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900">
                          <Check className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                          <span>{isUrdu ? 'اہم فیلڈ رہنمائی و نکات:' : 'Key Operational Takeaways:'}</span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-teal-950 mt-1">
                          {(isUrdu ? item.keyPointsUr : item.keyPointsEn).map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">•</span>
                              <span className="leading-snug">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Copy and Share Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {isUrdu ? 'پولیو مائیکرو پلاننگ و ایس بی سی معیار' : 'National Polio Standard Reference'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFaq(item);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>{isUrdu ? 'جواب کاپی کریں' : 'Copy Answer'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Authoritative Transparency & Standards Notice */}
      <div className="saas-card p-4 sm:p-5 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Info className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>{isUrdu ? 'علمی و سائنسی مآخذ اور شفافیت' : 'Scientific References & Programmatic Alignment'}</span>
        </div>
        <p className="leading-relaxed">
          {isUrdu
            ? 'تمام سوالات اور جوابات اسلامی نظریاتی کونسل (CII) کے فتاویٰ، قومی ایمرجنسی آپریشنز سینٹر (NEOC) پاکستان، عالمی ادارہ صحت (WHO)، اور یونیسف کے باضابطہ مائیکرو پلاننگ و SBC رہنمائی خطوط سے اخذ کیے گئے ہیں۔ یہ پلیٹ فارم فیلڈ ورکرز کی خود کار معاونت کے لیے وقف ہے۔'
            : 'All operational FAQs, refusal handling scripts, and SBC frameworks are aligned with official publications from the National Emergency Operations Centre (NEOC) Pakistan, Council of Islamic Ideology, WHO, and UNICEF immunization field training manuals.'}
        </p>
      </div>
    </section>
  );
};
