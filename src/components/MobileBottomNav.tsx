import React from 'react';
import { motion } from 'motion/react';
import { Calculator, FileVideo, ClipboardList, Newspaper, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import type { PlatformCategoryKey } from '../platformNavigation';

interface MobileBottomNavProps {
  activeCategory: PlatformCategoryKey;
  onSelectCategory: (category: PlatformCategoryKey) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { isUrdu } = useLanguage();

  const navTabs: Array<{
    key: PlatformCategoryKey;
    labelEn: string;
    labelUr: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      key: 'calculators',
      labelEn: 'Calculators',
      labelUr: 'کیلکولیٹرز',
      icon: Calculator,
      badge: '9',
    },
    {
      key: 'videos',
      labelEn: 'Resources',
      labelUr: 'وسائل',
      icon: FileVideo,
      badge: 'Media',
    },
    {
      key: 'documents',
      labelEn: 'Docs',
      labelUr: 'دستاویزات',
      icon: ClipboardList,
    },
    {
      key: 'updates',
      labelEn: 'Updates',
      labelUr: 'اپڈیٹس',
      icon: Newspaper,
      badge: 'Live',
    },
    {
      key: 'faq',
      labelEn: 'FAQs',
      labelUr: 'رہنمائی',
      icon: HelpCircle,
    },
  ];

  return (
    <nav
      id="mobile-sticky-bottom-nav"
      aria-label="Mobile Navigation"
      role="navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto" role="tablist">
        {navTabs.map((tab) => {
          const isActive = activeCategory === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              id={`mobile-nav-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                triggerHaptic('light');
                onSelectCategory(tab.key);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-xl transition-all select-none cursor-pointer active:scale-95 ${
                isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {/* Active Indicator Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabPill"
                  className="absolute inset-0 bg-teal-50/90 rounded-xl border border-teal-200/80 -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-teal-700 stroke-[2.25]' : 'text-slate-500 stroke-[1.75]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[8px] font-bold font-mono px-1 py-0.2 rounded-full leading-none ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 leading-none font-bold truncate max-w-[64px] ${
                  isActive ? 'text-teal-900 font-extrabold' : 'text-slate-600'
                }`}
              >
                {isUrdu ? tab.labelUr : tab.labelEn}
              </span>

              {/* Little active dot below */}
              {isActive && (
                <motion.span
                  layoutId="mobileActiveDot"
                  className="w-1 h-1 rounded-full bg-teal-600 mt-0.5"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
