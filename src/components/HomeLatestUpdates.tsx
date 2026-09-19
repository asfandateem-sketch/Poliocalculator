import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import { getAllCombinedUpdates, type PolioUpdate } from '../data/updates';
import {
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Building2,
  Video,
  CheckCircle2,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface HomeLatestUpdatesProps {
  onNavigateToUpdates?: (id?: string) => void;
  onViewAllUpdates?: () => void;
  onSelectUpdate?: (slug: string) => void;
}

export const HomeLatestUpdates: React.FC<HomeLatestUpdatesProps> = ({
  onNavigateToUpdates,
  onViewAllUpdates,
  onSelectUpdate,
}) => {
  const { isUrdu } = useLanguage();
  const [updates, setUpdates] = useState<PolioUpdate[]>(() => getAllCombinedUpdates());

  useEffect(() => {
    const handleUpdatesChange = () => {
      setUpdates(getAllCombinedUpdates());
    };
    window.addEventListener('polio_updates_changed', handleUpdatesChange);
    return () => window.removeEventListener('polio_updates_changed', handleUpdatesChange);
  }, []);

  const handleViewAll = () => {
    triggerHaptic('light');
    if (onViewAllUpdates) {
      onViewAllUpdates();
    } else if (onNavigateToUpdates) {
      onNavigateToUpdates();
    }
  };

  const handleSelect = (slug: string) => {
    triggerHaptic('light');
    if (onSelectUpdate) {
      onSelectUpdate(slug);
    } else if (onNavigateToUpdates) {
      onNavigateToUpdates(slug);
    }
  };

  // ONLY show 1 update on the first page of calculator (as requested)
  // Pick the newest or featured update
  const latestUpdate = useMemo(() => {
    if (updates.length === 0) return null;
    return updates.find((u) => u.featured) || updates[0];
  }, [updates]);

  if (!latestUpdate) return null;

  return (
    <section
      id="home-latest-updates"
      aria-label={isUrdu ? 'تازہ ترین اپڈیٹ' : 'Latest Official Polio Update'}
      className="w-full my-3 sm:my-4"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="saas-card p-3.5 sm:p-5 bg-gradient-to-br from-white via-slate-50/80 to-teal-50/30 border border-slate-200/90 shadow-2xs hover:shadow-xs rounded-2xl transition-all space-y-3">
        {/* Compact Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600" />
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-teal-700 inline" />
                {isUrdu ? 'تازہ ترین سرکاری مہماتی اعلان' : 'Latest Official Campaign Bulletin'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono font-bold">
                {isUrdu ? 'مصدقہ' : 'Verified'}
              </span>
            </div>
          </div>

          {/* View All Button */}
          <button
            type="button"
            onClick={handleViewAll}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200/70 transition cursor-pointer min-h-[36px] active:scale-95"
          >
            <span>
              {isUrdu
                ? `تمام اپڈیٹس دیکھیں (${updates.length})`
                : `View All Updates (${updates.length})`}
            </span>
            <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* SINGLE UPDATE CARD - Mobile-Friendly Responsive Layout */}
        <div
          onClick={() => handleSelect(latestUpdate.slug)}
          className="rounded-xl sm:rounded-2xl bg-white hover:bg-teal-50/20 border border-slate-200/90 hover:border-teal-300 transition-all p-3.5 sm:p-5 cursor-pointer shadow-2xs hover:shadow-xs group space-y-3"
        >
          {/* Source Attribution & Meta Info Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] font-mono shadow-2xs">
                f
              </span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                {latestUpdate.sourceName}
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200/60">
                {isUrdu ? latestUpdate.categoryUr : latestUpdate.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{isUrdu ? latestUpdate.displayDateUr : latestUpdate.displayDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate max-w-[140px] sm:max-w-none">
                <MapPin className="w-3 h-3 text-teal-600 flex-shrink-0" />
                <span>{isUrdu ? latestUpdate.locationUr : latestUpdate.location}</span>
              </span>
            </div>
          </div>

          {/* Title & Summary */}
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-950 group-hover:text-teal-900 leading-snug transition-colors">
              {isUrdu ? latestUpdate.titleUr : latestUpdate.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {isUrdu ? latestUpdate.summaryUr : latestUpdate.summary}
            </p>
          </div>

          {/* Quick Metrics Strip if FactBox is present */}
          {latestUpdate.factBox && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">{isUrdu ? 'تاریخ:' : 'Dates:'}</span>
                <strong className="text-slate-900 text-xs font-bold truncate block">
                  {latestUpdate.factBox.dates}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{isUrdu ? 'ہدف بچے:' : 'Target Children:'}</span>
                <strong className="text-teal-700 text-xs font-bold truncate block">
                  {latestUpdate.factBox.targetChildren}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block">{isUrdu ? 'ٹیمیں / کوریج:' : 'Teams:'}</span>
                <strong className="text-slate-800 text-xs font-bold truncate block">
                  {latestUpdate.factBox.frontlineWorkers || latestUpdate.factBox.districtsCovered}
                </strong>
              </div>
            </div>
          )}

          {/* Action Buttons Row - Highly Mobile Touch Friendly (min-h-[44px]) */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 group-hover:text-teal-950">
                <span>{isUrdu ? 'مکمل تفصیل و فیکٹ شیٹ پڑھیں' : 'Read Full Bulletin & Factsheet'}</span>
                <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${isUrdu ? 'rotate-180' : ''}`} />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={latestUpdate.facebookPostUrl || latestUpdate.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200/80 transition cursor-pointer min-h-[40px] flex-1 sm:flex-initial shadow-2xs active:scale-95"
                title={isUrdu ? 'فیس بک پر باضابطہ پوسٹ دیکھیں' : 'View official Facebook post'}
              >
                <span className="font-mono font-bold">f</span>
                <span>{isUrdu ? 'اصل پوسٹ دیکھیں ↗' : 'View Original Post ↗'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(latestUpdate.slug);
                }}
                className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition cursor-pointer min-h-[40px] flex-1 sm:flex-initial shadow-xs active:scale-95"
              >
                <span>{isUrdu ? 'تفصیل' : 'Details'}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
