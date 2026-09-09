import React from 'react';
import { useLanguage } from '../LanguageContext';
import { ChevronRight, Home } from 'lucide-react';
import { triggerHaptic } from '../haptics';

interface BreadcrumbsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeTab, onTabChange }) => {
  const { isUrdu } = useLanguage();

  const tabLabels: Record<string, { en: string; ur: string }> = {
    calculators: { en: 'Calculators (9)', ur: 'کیلکولیٹرز (9)' },
    training: { en: 'Training SOPs', ur: 'ٹریننگ ماڈیولز' },
    communication: { en: 'Communication & SBC', ur: 'کمیونیکیشن سکرپٹس' },
    videos: { en: 'Field Videos', ur: 'فیلڈ ویڈیوز' },
    documents: { en: 'Documents & Guides', ur: 'دستاویزات و فارمز' },
    field_resources: { en: 'Field Resources', ur: 'صوبائی وسائل' },
    faq: { en: 'FAQ & Standards', ur: 'سوالات و اصول' },
  };

  const currentLabel = tabLabels[activeTab] || tabLabels.calculators;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-500 py-1.5 px-1 overflow-x-auto no-scrollbar"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          onTabChange('calculators');
        }}
        className="inline-flex items-center gap-1 hover:text-teal-800 transition cursor-pointer font-medium"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>{isUrdu ? 'مرکزی صفحہ' : 'Home'}</span>
      </button>

      <ChevronRight className={`w-3 h-3 text-slate-300 flex-shrink-0 ${isUrdu ? 'rotate-180' : ''}`} />

      <span className="text-slate-400 font-medium">
        {isUrdu ? 'پولیو فیلڈ ٹولز' : 'Polio Field Tools'}
      </span>

      <ChevronRight className={`w-3 h-3 text-slate-300 flex-shrink-0 ${isUrdu ? 'rotate-180' : ''}`} />

      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 flex-shrink-0">
        {isUrdu ? currentLabel.ur : currentLabel.en}
      </span>
    </nav>
  );
};
