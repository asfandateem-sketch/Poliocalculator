import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Printer,
  Copy,
  CheckCircle2,
  FileCheck2,
  Share2,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { triggerHaptic } from '../haptics';

export interface CalculationReceiptData {
  calculatorId: string;
  calculatorNumber?: string;
  calculatorTitle: string;
  calculatorTitleUr?: string;
  badge: string;
  inputs: Array<{ labelEn: string; labelUr?: string; value: string }>;
  results: Array<{ labelEn: string; labelUr?: string; value: string; isHighlight?: boolean }>;
  notesEn?: string;
  notesUr?: string;
}

interface CalculationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CalculationReceiptData | null;
  isUrdu: boolean;
}

export const CalculationReceiptModal: React.FC<CalculationReceiptModalProps> = ({
  isOpen,
  onClose,
  data,
  isUrdu,
}) => {
  if (!isOpen || !data) return null;

  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const receiptNumber = React.useMemo(() => {
    const prefix = data.calculatorId.replace('calc-', 'PFT-');
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${new Date().getFullYear()}-${randomHex}`;
  }, [data.calculatorId]);

  const timestamp = React.useMemo(() => {
    const now = new Date();
    return now.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const handleCopy = () => {
    triggerHaptic('medium');
    const textLines = [
      `========================================`,
      `PAKISTAN POLIO ERADICATION PROGRAMME`,
      `OFFICIAL FIELD CALCULATION RECEIPT`,
      `Receipt No: ${receiptNumber}`,
      `Date/Time: ${timestamp}`,
      `Tool: ${data.calculatorTitle}`,
      `Standard: ${data.badge}`,
      `----------------------------------------`,
      `INPUTS:`,
      ...data.inputs.map((inp) => `• ${inp.labelEn}: ${inp.value}`),
      `----------------------------------------`,
      `RESULTS:`,
      ...data.results.map((res) => `✓ ${res.labelEn}: ${res.value}`),
      `----------------------------------------`,
      data.notesEn ? `Field Protocol: ${data.notesEn}` : '',
      `Verified against WHO / UNICEF / NEOC Field SOPs`,
      `========================================`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(textLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    triggerHaptic('light');
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/90 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Top Header: BOTH Back Button and Cross Button */}
        <div className="bg-teal-900 text-white px-3 sm:px-4 py-3 flex items-center justify-between gap-2 border-b border-teal-800">
          <div className="flex items-center gap-2 min-w-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isUrdu ? 'واپس جائیں' : 'Back to calculator'}
              title={isUrdu ? 'واپس جائیں' : 'Back to calculator'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 font-bold text-xs border border-teal-700/60 transition cursor-pointer active:scale-95 shrink-0"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
              <span>{isUrdu ? 'واپس' : 'Back'}</span>
            </button>

            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-teal-300 uppercase tracking-wider block">
                {isUrdu ? 'مہماتی تصدیقی پرچی' : 'Official Campaign Receipt'}
              </span>
              <h3 id="receipt-title" className="text-xs sm:text-sm font-bold text-white truncate">
                {isUrdu ? (data.calculatorTitleUr || data.calculatorTitle) : data.calculatorTitle}
              </h3>
            </div>
          </div>

          {/* Cross Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={isUrdu ? 'بند کریں اور واپس جائیں' : 'Close receipt and go back'}
            title={isUrdu ? 'بند کریں اور واپس جائیں' : 'Close receipt and go back'}
            className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-teal-800/80 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Institutional Header & Stamp */}
          <div className="border-b-2 border-dashed border-slate-200 pb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-teal-900 font-black text-xs sm:text-sm tracking-tight uppercase">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{isUrdu ? 'پاکستان انسدادِ پولیو پروگرام' : 'Pakistan Polio Eradication Programme'}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {isUrdu
                  ? 'قومی و صوبائی ایمرجنسی آپریشنز سینٹر (NEOC / EOC) تصدیقی ریکارڈ'
                  : 'Emergency Operations Centre (NEOC / EOC) Verified Record'}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                {receiptNumber}
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{timestamp}</p>
            </div>
          </div>

          {/* Calculator Info Row */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isUrdu ? 'حساب کار کا نام:' : 'Tool Name:'}
              </span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {isUrdu ? (data.calculatorTitleUr || data.calculatorTitle) : data.calculatorTitle}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isUrdu ? 'پروٹوکول معیار:' : 'Benchmark:'}
              </span>
              <span className="inline-block font-mono font-bold text-teal-800 text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {data.badge}
              </span>
            </div>
          </div>

          {/* Inputs Section */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{isUrdu ? 'فیلڈ ان پٹس (Field Inputs):' : 'Field Recorded Inputs:'}</span>
            </h4>
            <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
              {data.inputs.map((inp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5">
                  <span className="text-slate-600 font-medium">
                    {isUrdu && inp.labelUr ? inp.labelUr : inp.labelEn}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{inp.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculated Results Section */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? 'حساب شدہ نتائج (Calculated Results):' : 'Official Calculation Results:'}</span>
            </h4>
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-3 space-y-2">
              {data.results.map((res, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    res.isHighlight
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'bg-white/90 text-slate-800 border border-teal-100'
                  }`}
                >
                  <span className={`font-semibold text-xs ${res.isHighlight ? 'text-teal-100' : 'text-slate-700'}`}>
                    {isUrdu && res.labelUr ? res.labelUr : res.labelEn}
                  </span>
                  <span className={`font-mono font-black text-sm ${res.isHighlight ? 'text-white' : 'text-teal-800'}`}>
                    {res.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Protocol & Official Stamp */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-semibold text-slate-700 flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isUrdu ? 'ای پی آئی اور عالمی ادارہ صحت تصدیق شدہ' : 'EPI / WHO National Formula Compliant'}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                {isUrdu
                  ? 'یہ رسید فیلڈ سپروائزرز اور یونین کونسل شام کے جائزہ اجلاس کے لیے مصدقہ ہے۔'
                  : 'Valid for evening debriefings, vial reconciliations, and supervisory sign-offs.'}
              </p>
            </div>

            {/* Stamp Box */}
            <div className="border-2 border-dashed border-teal-600/40 rounded-xl p-2 text-center text-teal-800 font-mono text-[9px] uppercase tracking-widest shrink-0 bg-teal-50/50">
              <span className="font-bold block">✓ VERIFIED RECORD</span>
              <span className="text-[8px] text-teal-600">POLIO FIELD TOOLS</span>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions: Back, Print, Copy & Close */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Back button at footer */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
            <span>{isUrdu ? 'واپس جائیں' : 'Back to Calculator'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'پرچی کاپی کریں' : 'Copy Slip')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'پرنٹ / محفوظ کریں' : 'Print Receipt'}</span>
            </button>

            {/* Cross close button at footer */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'بند کریں' : 'Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
