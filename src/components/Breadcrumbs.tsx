import React from 'react';
import { useLanguage } from '../LanguageContext';
import { ChevronRight, Home } from 'lucide-react';
import { triggerHaptic } from '../haptics';

interface BreadcrumbsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeTab,
  onTabChange,
  onGoBack,
  canGoBack = false,
}) => {
  const { isUrdu } = useLanguage();

  const tabLabels: Record<string, { en: string; ur: string }> = {
    calculators: { en: 'Calculators (9)', ur: 'کیلکولیٹرز (9)' },
    videos: { en: 'Communication Resources', ur: 'مواصلاتی وسائل' },
    updates: { en: 'Programme Updates', ur: 'تازہ ترین اپڈیٹس' },
    documents: { en: 'Documents & Guides', ur: 'دستاویزات و فارمز' },
    training: { en: 'Training SOPs', ur: 'تربیتی ایس او پیز' },
    communication: { en: 'Dialogue Scripts', ur: 'انکار و ابلاغ کے سکرپٹس' },
    field_resources: { en: 'Field Guidelines', ur: 'فیلڈ رہنمائی' },
    faq: { en: 'FAQ & Standards', ur: 'سوالات و اصول' },
  };

  const currentLabel = tabLabels[activeTab] || tabLabels.calculators;
  const isNotHome = activeTab !== 'calculators';

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 py-1.5 px-1 overflow-x-auto no-scrollbar touch-manipulation"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Quick Back Action Button */}
      {(canGoBack || isNotHome) && onGoBack && (
        <button
          id="breadcrumb-back-btn"
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onGoBack();
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-teal-900 bg-white/90 hover:bg-teal-50 border border-teal-200/90 rounded-lg transition active:scale-95 cursor-pointer shadow-2xs shrink-0 touch-manipulation"
          title={isUrdu ? 'پچھلے صفحے پر واپس جائیں' : 'Back to previous view'}
          aria-label={isUrdu ? 'واپس جائیں' : 'Go Back'}
        >
          <span className="text-teal-700 font-bold">{isUrdu ? '→' : '←'}</span>
          <span>{isUrdu ? 'واپس' : 'Back'}</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          onTabChange('calculators');
        }}
        className="inline-flex items-center gap-1 hover:text-teal-800 transition cursor-pointer font-medium shrink-0"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>{isUrdu ? 'مرکزی صفحہ' : 'Home'}</span>
      </button>

      <ChevronRight className={`w-3 h-3 text-slate-300 flex-shrink-0 ${isUrdu ? 'rotate-180' : ''}`} />

      <span className="text-slate-400 font-medium shrink-0">
        {isUrdu ? 'پولیو فیلڈ ٹولز' : 'Polio Field Tools'}
      </span>

      <ChevronRight className={`w-3 h-3 text-slate-300 flex-shrink-0 ${isUrdu ? 'rotate-180' : ''}`} />

      <span className="font-bold text-teal-900 bg-teal-50/90 px-2.5 py-0.5 rounded-lg border border-teal-200/80 flex-shrink-0 shadow-2xs">
        {isUrdu ? currentLabel.ur : currentLabel.en}
      </span>
    </nav>
  );
};
