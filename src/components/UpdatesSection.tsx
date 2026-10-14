import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  type PolioUpdate,
  type UpdateCategory,
  TRUSTED_OFFICIAL_SOURCES,
  getAllCombinedUpdates,
  deleteUserManualUpdate,
} from '../data/updates';
import { UpdateVideoPlayer } from './UpdateVideoPlayer';
import { AddUpdateModal } from './AddUpdateModal';
import {
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Share2,
  Check,
  Tag,
  ShieldCheck,
  AlertCircle,
  Calculator,
  ChevronRight,
  Filter,
  Clock,
  Building2,
  Camera,
  CheckCircle2,
  Radio,
  FileText,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
} from 'lucide-react';

interface UpdatesSectionProps {
  initialSlug?: string;
  initialUpdateId?: string;
  onNavigateToCalculator?: (calcId: string) => void;
  onSelectCalculator?: (calcId: string) => void;
  onCloseDetail?: () => void;
  onNavigateToCategory?: (category: string) => void;
}

const CATEGORY_LIST: Array<{ key: 'all' | UpdateCategory; labelEn: string; labelUr: string }> = [
  { key: 'all', labelEn: 'All Dispatches', labelUr: 'تمام اعلانات' },
  { key: 'Campaigns', labelEn: 'Campaigns', labelUr: 'پولیو مہمات' },
  { key: 'Activities', labelEn: 'Activities', labelUr: 'سرگرمیاں' },
  { key: 'Announcements', labelEn: 'Announcements', labelUr: 'اعلانات' },
  { key: 'Media & Videos', labelEn: 'Media & Videos', labelUr: 'میڈیا و ویڈیوز' },
  { key: 'Programme Updates', labelEn: 'Programme Updates', labelUr: 'پروگرام اپڈیٹس' },
];

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({
  initialSlug,
  initialUpdateId,
  onNavigateToCalculator,
  onSelectCalculator,
  onCloseDetail,
}) => {
  const { isUrdu } = useLanguage();

  const [updates, setUpdates] = useState<PolioUpdate[]>(() => getAllCombinedUpdates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | UpdateCategory>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'all' | string>('all');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialSlug || initialUpdateId || null
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<PolioUpdate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Sync updates if updated in storage
  useEffect(() => {
    const handleUpdatesChange = () => {
      setUpdates(getAllCombinedUpdates());
    };
    window.addEventListener('polio_updates_changed', handleUpdatesChange);
    return () => window.removeEventListener('polio_updates_changed', handleUpdatesChange);
  }, []);

  // Sync with browser hash changes for /updates or /updates/:slug
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (hash.startsWith('updates/')) {
        const slug = hash.replace('updates/', '').trim();
        if (slug) setSelectedSlug(slug);
      } else if (hash === 'updates') {
        setSelectedSlug(null);
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Set document title & SEO tags dynamically based on view
  useEffect(() => {
    const currentUpdate = selectedSlug
      ? updates.find((u) => u.slug === selectedSlug || u.id === selectedSlug)
      : null;
    const baseTitle = 'Official Polio Updates & Field Bulletins | Polio Field Tools';

    if (currentUpdate) {
      document.title = `${isUrdu ? currentUpdate.titleUr : currentUpdate.title} | Polio Field Tools`;
    } else {
      document.title = baseTitle;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (currentUpdate) {
        metaDesc.setAttribute('content', isUrdu ? currentUpdate.summaryUr : currentUpdate.summary);
      } else {
        metaDesc.setAttribute(
          'content',
          'Verified news, campaign dates, and field activities sourced from official channels: EOC Pakhtunkhwa, Pakistan Polio Eradication Initiative, and KP Polio Programme.'
        );
      }
    }

    const existingScript = document.getElementById('updates-schema-jsonld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'updates-schema-jsonld';
    script.type = 'application/ld+json';

    if (currentUpdate) {
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: currentUpdate.title,
        datePublished: currentUpdate.date,
        dateModified: currentUpdate.date,
        description: currentUpdate.summary,
        author: {
          '@type': 'Organization',
          name: currentUpdate.sourceName,
          url: currentUpdate.sourceUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Polio Field Tools',
          url: 'https://poliofieldtools.org/',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://poliofieldtools.org/#/updates/${currentUpdate.slug}`,
        },
        articleSection: currentUpdate.category,
        keywords: currentUpdate.tags.join(', '),
      });
    } else {
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Official Polio Updates & Campaign Bulletins',
        description:
          'Verified updates, campaign schedules, and field announcements sourced from EOC Pakhtunkhwa and Pakistan Polio Eradication Initiative.',
        url: 'https://poliofieldtools.org/#/updates',
      });
    }
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('updates-schema-jsonld');
      if (s) s.remove();
      document.title = 'Polio Field Tools — Practical tools and resources for polio campaign workers';
    };
  }, [selectedSlug, isUrdu, updates]);

  const activeArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return (
      updates.find((u) => u.slug === selectedSlug) ||
      updates.find((u) => u.id === selectedSlug) ||
      null
    );
  }, [selectedSlug, updates]);

  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      if (selectedSourceFilter !== 'all' && item.sourceName !== selectedSourceFilter) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (item.title || '').toLowerCase().includes(q) || (item.titleUr || '').includes(q);
      const matchSummary = (item.summary || '').toLowerCase().includes(q) || (item.summaryUr || '').includes(q);
      const matchContent = (item.content || '').toLowerCase().includes(q) || (item.contentUr || '').includes(q);
      const matchLocation = (item.location || '').toLowerCase().includes(q) || (item.locationUr || '').includes(q);
      const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchSource = (item.sourceName || '').toLowerCase().includes(q);
      return matchTitle || matchSummary || matchContent || matchLocation || matchTags || matchSource;
    });
  }, [updates, selectedCategory, selectedSourceFilter, searchQuery]);

  const handleOpenArticle = (update: PolioUpdate) => {
    triggerHaptic('light');
    setSelectedSlug(update.slug);
    window.location.hash = `#/updates/${update.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    triggerHaptic('light');
    setSelectedSlug(null);
    if (onCloseDetail) {
      onCloseDetail();
    }
    window.location.hash = '#/updates';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareArticle = (update: PolioUpdate) => {
    triggerHaptic('success');
    const shareUrl = `${window.location.origin}${window.location.pathname}#/updates/${update.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRefreshUpdates = () => {
    setIsRefreshing(true);
    triggerHaptic('light');
    setTimeout(() => {
      setUpdates(getAllCombinedUpdates());
      setIsRefreshing(false);
      setActionToast(isUrdu ? 'تازہ ترین اعلانات لوڈ ہو گئے ہیں!' : 'Latest dispatches refreshed!');
      setTimeout(() => setActionToast(null), 3500);
    }, 450);
  };

  const handleDeleteUpdate = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('selection');
    deleteUserManualUpdate(id);
    setUpdates(getAllCombinedUpdates());
    if (selectedSlug === id) {
      setSelectedSlug(null);
      window.location.hash = '#/updates';
    }
    setActionToast(isUrdu ? 'اعلامیہ کامیابی سے خارج کر دیا گیا' : 'Dispatch removed successfully');
    setTimeout(() => setActionToast(null), 3500);
  };

  return (
    <div id="updates-section" className="w-full space-y-4" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Action Toast Feedback */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-400/40 flex items-center gap-2.5 text-xs animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
          <span className="font-bold">{actionToast}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="p-1 hover:bg-white/20 rounded-lg ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. PROFESSIONAL EXECUTIVE HEADER WITH PUBLISH & REFRESH ACTIONS */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-800 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                <Radio className="w-3 h-3 text-teal-300 animate-pulse" />
                {isUrdu ? 'باضابطہ وائر ڈسپیچ' : 'Official Wire Dispatches'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {isUrdu ? 'مصدقہ حکومتی و ای او سی ذرائع' : 'Cross-Checked with EOC & NEOC'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                {updates.length} {isUrdu ? 'اعلانات' : 'Bulletins'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isUrdu ? 'باضابطہ مہماتی بلیٹنز و فیلڈ اعلانات' : 'Official Polio Campaign Bulletins'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isUrdu
                ? 'ای او سی خیبر پختونخوا، قومی انسدادِ پولیو پروگرام، اور خیبر پختونخوا پولیو سیل کے باضابطہ مہماتی شیڈول، اہداف اور فیلڈ ہدایات۔'
                : 'Executive briefings, operational schedules, and target figures verified with EOC Pakhtunkhwa, NEOC Pakistan, and KP Health Cell.'}
            </p>
          </div>

          {/* Action Buttons: Publish + Refresh + Source Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1 lg:pt-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* + Publish New Update Button */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setEditingUpdate(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm cursor-pointer transition active:scale-95 touch-manipulation min-h-[38px]"
                title={isUrdu ? 'نیا مہماتی اعلامیہ شامل کریں' : 'Publish new campaign dispatch'}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{isUrdu ? 'نیا اعلامیہ شامل کریں' : '+ New Update'}</span>
              </button>

              {/* Refresh Updates Button */}
              <button
                type="button"
                onClick={handleRefreshUpdates}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300/80 cursor-pointer transition active:scale-95 touch-manipulation min-h-[38px]"
                title={isUrdu ? 'اعلانات کی فہرست تازہ کریں' : 'Refresh bulletins list'}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? (isUrdu ? 'تازہ کاری...' : 'Refreshing...') : (isUrdu ? 'تازہ کریں' : 'Refresh')}</span>
              </button>
            </div>

            {/* Official Source FB Quick Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
              {TRUSTED_OFFICIAL_SOURCES.slice(0, 2).map((source) => (
                <a
                  key={source.id}
                  href={source.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 text-slate-700 hover:text-teal-900 transition-all text-xs font-semibold group cursor-pointer"
                  title={isUrdu ? `${source.nameUr} فیس بک پیج` : `${source.name} Facebook Page`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[8px] font-mono">
                    f
                  </span>
                  <span className="text-[11px] font-bold">
                    {source.id === 'eoc_pakhtunkhwa' ? 'EOC KP' : 'NEOC'}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-teal-700" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DETAIL ARTICLE VIEW OR PRO WIRE DIRECTORY */}
      <AnimatePresence mode="wait">
        {activeArticle ? (
          /* =========================================================================
             EXECUTIVE DETAIL VIEW
             ========================================================================= */
          <motion.article
            key={`detail-${activeArticle.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer active:scale-95 transition shadow-2xs"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                <span>{isUrdu ? '← تمام بلیٹنز پر واپس جائیں' : '← Back to All Bulletins'}</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {activeArticle.id.startsWith('user-update') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingUpdate(activeArticle)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl cursor-pointer active:scale-95 transition shadow-2xs"
                      title={isUrdu ? 'ترمیم کریں' : 'Edit'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'ترمیم' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteUpdate(activeArticle.id, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer active:scale-95 transition shadow-2xs"
                      title={isUrdu ? 'خارج کریں' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'خارج کریں' : 'Delete'}</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleShareArticle(activeArticle)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer active:scale-95 transition shadow-2xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">{isUrdu ? 'لنک کاپی ہو گیا' : 'Link Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isUrdu ? 'شیئر کریں' : 'Share Bulletin'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Article Container */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-7 space-y-5">
              {/* Dateline & Category Header */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[11px]">
                  {isUrdu ? activeArticle.categoryUr : activeArticle.category}
                </span>

                <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <time dateTime={activeArticle.date}>
                    {isUrdu ? activeArticle.displayDateUr : activeArticle.displayDate}
                  </time>
                </span>

                <span className="text-slate-300">•</span>

                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  <span>{isUrdu ? activeArticle.locationUr : activeArticle.location}</span>
                </span>
              </div>

              {/* Title (H1) */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                {isUrdu ? activeArticle.titleUr : activeArticle.title}
              </h1>

              {/* Official Source Banner with Direct Facebook Link */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono shadow-2xs">
                    f
                  </div>
                  <div>
                    <div className="text-slate-800 font-bold flex items-center gap-1">
                      <span>{isUrdu ? 'باضابطہ ماخذ:' : 'Official Source:'}</span>
                      <strong className="text-teal-900 font-black">{activeArticle.sourceName}</strong>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {isUrdu ? 'مصدقہ حکومتی اعلامیہ' : 'Verified Official Dispatch'}
                    </span>
                  </div>
                </div>

                <a
                  href={activeArticle.facebookPostUrl || activeArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 self-start sm:self-auto min-h-[36px]"
                >
                  <span>{isUrdu ? 'اصل فیس بک پوسٹ دیکھیں ↗' : 'View Facebook Post ↗'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Video Player (if present) */}
              {activeArticle.videoUrl && (
                <UpdateVideoPlayer
                  videoUrl={activeArticle.videoUrl}
                  title={activeArticle.title}
                  sourceName={activeArticle.sourceName}
                />
              )}

              {/* Executive Summary Callout */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-slate-900 text-sm sm:text-base font-semibold leading-relaxed">
                {isUrdu ? activeArticle.summaryUr : activeArticle.summary}
              </div>

              {/* Campaign Factsheet Table (Clean Pro Layout) */}
              {activeArticle.factBox && (
                <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                      {isUrdu ? 'مہماتی حقائق و فیلڈ اہداف' : 'Campaign Factsheet'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isUrdu ? 'مصدقہ اعداد و شمار' : 'Verified Data'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">
                        {isUrdu ? 'مہم' : 'Campaign'}
                      </span>
                      <strong className="text-slate-900 text-xs font-bold block">
                        {activeArticle.factBox.campaignName}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">
                        {isUrdu ? 'تاریخیں' : 'Dates'}
                      </span>
                      <strong className="text-teal-900 text-xs font-bold block">
                        {activeArticle.factBox.dates}
                      </strong>
                    </div>

                    {activeArticle.factBox.targetChildren && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">
                          {isUrdu ? 'ہدف بچے' : 'Target Children'}
                        </span>
                        <strong className="text-emerald-800 text-xs font-bold block">
                          {activeArticle.factBox.targetChildren}
                        </strong>
                      </div>
                    )}

                    {activeArticle.factBox.frontlineWorkers && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">
                          {isUrdu ? 'فیلڈ ٹیمیں' : 'Field Teams'}
                        </span>
                        <strong className="text-teal-900 text-xs font-bold block">
                          {activeArticle.factBox.frontlineWorkers}
                        </strong>
                      </div>
                    )}

                    {activeArticle.factBox.supervision && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/70 sm:col-span-2">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">
                          {isUrdu ? 'نگرانی' : 'Supervision'}
                        </span>
                        <span className="text-slate-800 text-xs font-medium block">
                          {activeArticle.factBox.supervision}
                        </span>
                      </div>
                    )}
                  </div>

                  {activeArticle.factBox.keyDirectives && activeArticle.factBox.keyDirectives.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-800 block mb-1.5">
                        {isUrdu ? 'اہم فیلڈ ہدایات:' : 'Core Operational Directives:'}
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                        {activeArticle.factBox.keyDirectives.map((d, i) => (
                          <li key={i} className="leading-snug">{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Full Article Content */}
              <div className="text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3 pt-1">
                {(isUrdu ? activeArticle.contentUr : activeArticle.content)
                  .split('\n\n')
                  .map((para, idx) => {
                    const trimmed = para.trim();
                    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                      return (
                        <div key={idx} className="space-y-1 pl-2 sm:pl-3 border-l-2 border-teal-600/40">
                          {trimmed.split('\n').map((line, lineIdx) => (
                            <p key={lineIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                              {line}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
              </div>

              {/* Related Calculators Integration */}
              {activeArticle.relatedCalculatorIds && activeArticle.relatedCalculatorIds.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isUrdu ? 'متعلقہ فیلڈ ٹولز و کیلکولیٹرز' : 'Operational Field Tools For This Campaign'}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeArticle.relatedCalculatorIds.map((calcId) => {
                      const labels: Record<string, { en: string; ur: string }> = {
                        'calc-1': { en: 'Child Age Eligibility Calculator', ur: 'بچوں کی عمر کا کیلکولیٹر' },
                        'calc-2': { en: 'bOPV Vial Demand Calculator', ur: 'ویکسین وائل ڈیمانڈ کیلکولیٹر' },
                        'calc-3': { en: 'Vaccine Wastage Rate Calculator', ur: 'ویکسین ضیاع کیلکولیٹر' },
                        'calc-4': { en: 'Still NA Coverage Rate Calculator', ur: 'غیر حاضر بچوں کی شرح' },
                        'calc-5': { en: 'Refusal Conversion Calculator', ur: 'انکاری والدین قائل کاری' },
                        'calc-7': { en: 'Campaign Coverage Calculator', ur: 'مہماتی کوریج کیلکولیٹر' },
                        'calc-8': { en: 'Daily Catch-Up Calculator', ur: 'کیچ اپ راؤنڈ کیلکولیٹر' },
                      };
                      const item = labels[calcId] || { en: 'Field Calculator', ur: 'فیلڈ کیلکولیٹر' };
                      return (
                        <button
                          key={calcId}
                          type="button"
                          onClick={() => {
                            if (onSelectCalculator) {
                              onSelectCalculator(calcId);
                            } else if (onNavigateToCalculator) {
                              onNavigateToCalculator(calcId);
                            } else {
                              window.location.hash = `#${calcId}`;
                            }
                          }}
                          className="p-2.5 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition flex items-center justify-between gap-2 group cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-900 line-clamp-1">
                            {isUrdu ? item.ur : item.en}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 flex-shrink-0 ${
                              isUrdu ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
                <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                {(activeArticle.tags || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ) : (
          /* =========================================================================
             PRO-WIRE DIRECTORY (SHORT & CONCISE DISPATCHES)
             ========================================================================= */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search & Category Filter Bar */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-3">
              {/* Search input */}
              <div className="relative w-full">
                <Search
                  className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                    isUrdu ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'عنوان، مقام یا ماخذ کے ذریعے تلاش کریں...'
                      : 'Search bulletins by keyword, district, target, or source...'
                  }
                  className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 transition outline-none ${
                    isUrdu ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 cursor-pointer ${
                      isUrdu ? 'left-2' : 'right-2'
                    }`}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
                  <Filter className="w-3 h-3 text-slate-400" />
                  {isUrdu ? 'زمرہ:' : 'Category:'}
                </span>

                {CATEGORY_LIST.map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  const count =
                    cat.key === 'all'
                      ? updates.length
                      : updates.filter((u) => u.category === cat.key).length;

                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedCategory(cat.key);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-teal-800 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <span>{isUrdu ? cat.labelUr : cat.labelEn}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                          isActive
                            ? 'bg-teal-900 text-teal-100'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIRECTORY GRID OF SHORT EXECUTIVE NEWS DISPATCHES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-mono text-[11px]">
                  {isUrdu
                    ? `${filteredUpdates.length} باضابطہ اعلانات دستیاب`
                    : `Showing ${filteredUpdates.length} verified dispatches`}
                </span>
                {(selectedCategory !== 'all' || selectedSourceFilter !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSourceFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-teal-800 font-bold hover:underline cursor-pointer"
                  >
                    {isUrdu ? 'فلٹرز ختم کریں' : 'Reset filters'}
                  </button>
                )}
              </div>

              {filteredUpdates.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    {isUrdu ? 'کوئی اپڈیٹ نہیں ملی' : 'No bulletins found'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isUrdu
                      ? 'براہ کرم تلاش کے الفاظ یا زمرہ تبدیل کر کے دیکھیں۔'
                      : 'Try adjusting your search query or selecting a different category.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredUpdates.map((update) => (
                    <div
                      key={update.id}
                      onClick={() => handleOpenArticle(update)}
                      className="rounded-2xl bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-teal-400/80 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm cursor-pointer group space-y-3"
                    >
                      <div className="space-y-2.5">
                        {/* Source, Dateline & Category Row */}
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] font-mono shadow-2xs">
                              f
                            </span>
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                              {update.sourceName}
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{isUrdu ? update.displayDateUr : update.displayDate}</span>
                          </div>
                        </div>

                        {/* Title (Short & Clear) */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-900 leading-snug transition-colors">
                          {isUrdu ? update.titleUr : update.title}
                        </h3>

                        {/* Summary (Short In News) */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {isUrdu ? update.summaryUr : update.summary}
                        </p>

                        {/* Quick Metrics Strip if available */}
                        {update.factBox && (
                          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
                            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                              <span className="text-[9px] text-slate-500 block uppercase font-mono">
                                {isUrdu ? 'تاریخ' : 'Dates'}
                              </span>
                              <strong className="text-slate-900 font-semibold truncate block">
                                {update.factBox.dates}
                              </strong>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                              <span className="text-[9px] text-slate-500 block uppercase font-mono">
                                {isUrdu ? 'ہدف' : 'Target'}
                              </span>
                              <strong className="text-emerald-800 font-semibold truncate block">
                                {update.factBox.targetChildren || 'All Eligible'}
                              </strong>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                              <span className="text-[9px] text-slate-500 block uppercase font-mono">
                                {isUrdu ? 'مقام' : 'Scope'}
                              </span>
                              <strong className="text-teal-900 font-semibold truncate block">
                                {update.location.split(',')[0]}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200/60">
                          {isUrdu ? update.categoryUr : update.category}
                        </span>

                        <div className="flex items-center gap-2">
                          {update.id.startsWith('user-update') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUpdate(update);
                              }}
                              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 px-1.5 py-0.5 rounded bg-teal-50 hover:bg-teal-100 transition cursor-pointer"
                              title={isUrdu ? 'ترمیم کریں' : 'Edit'}
                            >
                              {isUrdu ? 'ترمیم' : 'Edit'}
                            </button>
                          )}

                          <a
                            href={update.facebookPostUrl || update.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-bold text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 transition"
                            title={isUrdu ? 'فیس بک پوسٹ دیکھیں' : 'View Facebook Post'}
                          >
                            <span>{isUrdu ? 'پوسٹ ↗' : 'Post ↗'}</span>
                          </a>

                          <span className="text-xs font-bold text-teal-800 group-hover:text-teal-950 inline-flex items-center gap-0.5">
                            <span>{isUrdu ? 'مکمل تفصیل' : 'Read Dispatch'}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                                isUrdu ? 'rotate-180 group-hover:-translate-x-0.5' : ''
                              }`}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Campaign Dispatch Modal */}
      <AddUpdateModal
        isOpen={isAddModalOpen || editingUpdate !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUpdate(null);
        }}
        isUrdu={isUrdu}
        editingUpdate={editingUpdate}
        onSaved={() => {
          setUpdates(getAllCombinedUpdates());
          setActionToast(isUrdu ? 'اعلامیہ کامیابی سے شائع ہو گیا!' : 'Dispatch published successfully!');
          setTimeout(() => setActionToast(null), 3500);
        }}
      />
    </div>
  );
};
