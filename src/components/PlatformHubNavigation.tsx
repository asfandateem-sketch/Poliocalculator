import React from 'react';
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
      key: 'training',
      labelEn: 'Training SOPs',
      labelUr: 'تربیت و SOPs',
      icon: BookOpen,
      badge: '4',
    },
    {
      key: 'communication',
      labelEn: 'Communication',
      labelUr: 'کمیونیکیشن مواد',
      icon: MessageSquare,
      badge: '4',
    },
    {
      key: 'videos',
      labelEn: 'Field Videos',
      labelUr: 'فیلڈ ویڈیوز',
      icon: FileVideo,
      badge: '4',
    },
    {
      key: 'documents',
      labelEn: 'Documents & Guides',
      labelUr: 'دستاویزات و فارمز',
      icon: ClipboardList,
      badge: '4',
    },
    {
      key: 'field_resources',
      labelEn: 'Field Resources',
      labelUr: 'صوبائی وسائل',
      icon: Compass,
      badge: '4',
    },
    {
      key: 'faq',
      labelEn: 'FAQ & Standards',
      labelUr: 'اکثر پوچھے گئے سوالات',
      icon: HelpCircle,
      badge: '5',
    },
  ];

  return (
    <nav
      id="platform-hub-navigation"
      aria-label="Platform Sections"
      className="w-full mb-3.5 sm:mb-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-1 sm:p-1.5 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
        {navItems.map((item) => {
          const isActive = activeCategory === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              id={`hub-tab-${item.key}`}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectCategory(item.key);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
              <span>{isUrdu ? item.labelUr : item.labelEn}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-teal-900/60 text-teal-100 border border-teal-700/50'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
