import React from 'react';
import { TranslationStrings } from '../translations';

interface QuickNavProps {
  t: TranslationStrings;
  activeId?: string;
}

export const QuickNav: React.FC<QuickNavProps> = ({ t }) => {
  const items = [
    { id: 'calc-01', num: '01', title: t.c1.shortTitle, isPrimary: true },
    { id: 'calc-02', num: '02', title: t.c2.shortTitle, isPrimary: true },
    { id: 'calc-03', num: '03', title: t.c3.shortTitle, isPrimary: true },
    { id: 'calc-04', num: '04', title: t.c4.shortTitle, isPrimary: true },
    { id: 'calc-05', num: '05', title: t.c5.shortTitle, isPrimary: false },
    { id: 'calc-06', num: '06', title: t.c6.shortTitle, isPrimary: false },
    { id: 'calc-07', num: '07', title: t.c7.shortTitle, isPrimary: false },
    { id: 'calc-08', num: '08', title: t.c8.shortTitle, isPrimary: false },
    { id: 'calc-09', num: '09', title: t.c9.shortTitle, isPrimary: false },
    { id: 'calc-10', num: '10', title: t.c10.shortTitle, isPrimary: false },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 py-2.5 px-4 sticky top-[137px] sm:top-[129px] z-20 shadow-xs">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap mr-1 hidden sm:inline">
            {t.quickNav}:
          </span>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition active:scale-95 ${
                item.isPrimary
                  ? 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span
                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.isPrimary ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-800'
                }`}
              >
                {item.num}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
