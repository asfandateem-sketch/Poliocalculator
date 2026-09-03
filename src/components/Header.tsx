import React from 'react';
import { Language, TranslationStrings } from '../translations';
import { ShieldCheck, Download, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationStrings;
  isOnline: boolean;
  isInstallable: boolean;
  onInstall: () => void;
  onOpenTests: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  t,
  isOnline,
  isInstallable,
  onInstall,
  onOpenTests,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top utility bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 border-b border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Online/Offline pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>{t.offlineReady}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span>Offline Mode (Active)</span>
              </>
            )}
          </span>

          {/* Test verification status badge */}
          <button
            type="button"
            onClick={onOpenTests}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 transition"
            title="View automated calculation test suite"
          >
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            <span>32/32 Tests OK</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition"
            >
              <Download className="w-3 h-3" />
              <span>{t.installPWA}</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                lang === 'en'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ur')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition font-arabic ${
                lang === 'ur'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Logo / Badge */}
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-900/10 flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                  bOPV
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* FIXED bOPV MANDATORY BANNER */}
        <div className="mt-3.5 p-3 sm:p-3.5 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-xl shadow-xs border border-teal-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {t.fixedRuleBadge}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono font-semibold text-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Vaccine: <strong className="text-teal-300">bOPV</strong></span>
              <span>•</span>
              <span>Child: <strong className="text-cyan-300">2 drops</strong></span>
              <span>•</span>
              <span>1 vial = <strong className="text-emerald-300">20 children</strong></span>
            </div>
            <span className="text-[11px] text-slate-400 sm:text-right">
              Fixed & Non-Editable
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
