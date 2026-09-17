import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  Calculator,
  BookOpen,
  MessageSquare,
  FileVideo,
  ClipboardList,
  Compass,
  HelpCircle,
} from 'lucide-react';
import type { PlatformCategoryKey } from '../platformNavigation';

interface PlatformHubNavigationProps {
  activeCategory: PlatformCategoryKey;
  onSelectCategory: (category: PlatformCategoryKey) => void;
}

export const PlatformHubNavigation: React.FC<PlatformHubNavigationProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { isUrdu } = useLanguage();

  const navItems: Array<{
    key: PlatformCategoryKey;
    labelEn: string;
    labelUr: string;
    shortLabelEn: string;
    shortLabelUr: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      key: 'calculators',
      labelEn: '1. Calculators',
      labelUr: '۱۔ کیلکولیٹرز',
      shortLabelEn: 'Calculators',
      shortLabelUr: 'کیلکولیٹرز',
      icon: Calculator,
      badge: '9',
    },
    {
      key: 'videos',
      labelEn: '2. Communication Resources',
      labelUr: '۲۔ مواصلاتی وسائل',
      shortLabelEn: 'Resources',
      shortLabelUr: 'وسائل',
      icon: FileVideo,
      badge: 'Drive',
    },
    {
      key: 'documents',
      labelEn: '3. Documents & Guides',
      labelUr: '۳۔ دستاویزات و فارمز',
      shortLabelEn: 'Documents',
      shortLabelUr: 'دستاویزات',
      icon: ClipboardList,
      badge: 'SOPs',
    },
    {
      key: 'faq',
      labelEn: '4. FAQs',
      labelUr: '۴۔ اکثر پوچھے گئے سوالات',
      shortLabelEn: 'FAQs',
      shortLabelUr: 'سوالات',
      icon: HelpCircle,
      badge: 'Info',
    },
  ];

  return (
    <nav
      id="platform-hub-navigation"
      aria-label="Platform Sections"
      className="w-full mb-3.5 sm:mb-4 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-[0_12px_32px_-8px_rgba(15,35,65,0.06),inset_0_1px_1px_rgba(255,255,255,1)] p-1.5 sm:p-2 overflow-x-auto no-scrollbar"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full">
        {navItems.map((item) => {
          const isActive = activeCategory === item.key;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.key}
              id={`hub-tab-${item.key}`}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectCategory(item.key);
              }}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`group relative flex items-center justify-between sm:justify-center gap-1.5 px-3 py-2.5 sm:py-2.5 min-h-[44px] rounded-xl text-xs font-bold select-none cursor-pointer transition-colors duration-150 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-700 hover:text-slate-950 bg-slate-50/80 sm:bg-transparent hover:bg-white/80 border border-slate-100 sm:border-transparent'
              }`}
            >
              {/* Subtle Spring-Animated Active Indicator Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeHubSectionPill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-teal-600 via-teal-700 to-teal-900 shadow-[0_6px_16px_rgba(13,148,136,0.32),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-teal-400/50 ring-1 ring-white/20 z-0"
                  transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-1.5 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${
                    isActive ? 'text-teal-200' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                <span className="truncate text-left font-semibold">
                  {isUrdu ? item.labelUr : item.labelEn}
                </span>
              </div>

              {item.badge && (
                <span
                  className={`relative z-10 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full flex-shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'bg-teal-950/60 text-teal-100 border border-teal-600/40'
                      : 'bg-white text-slate-600 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
