import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import { X, ArrowLeft, Shield, Info, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttributionModal: React.FC<AttributionModalProps> = ({ isOpen, onClose }) => {
  const { isUrdu } = useLanguage();

  useEffect(() => {
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="liquid-glass-modal w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-white/90 flex flex-col max-h-[90vh] liquid-shimmer"
        dir={isUrdu ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 text-white flex items-center justify-between gap-2 border-b border-teal-600/30">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label={isUrdu ? 'واپس جائیں' : 'Back'}
              title={isUrdu ? 'واپس جائیں' : 'Back'}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-teal-100 font-bold text-xs border border-teal-700/60 transition cursor-pointer active:scale-95 shrink-0"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
              <span>{isUrdu ? 'واپس' : 'Back'}</span>
            </button>

            <div className="w-8 h-8 rounded-lg bg-teal-700/80 hidden sm:flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-bold leading-tight truncate">
                {isUrdu ? 'پولیو فیلڈ ٹولز — معلومات و تفصیل' : 'Polio Field Tools — Operational Hub'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-teal-200 truncate">
                {isUrdu ? 'عملی فیلڈ اوزار اور رہنمائی' : 'Practical tools & resources for campaign workers'}
              </p>
            </div>
          </div>
          {/* Cross Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            aria-label={isUrdu ? 'بند کریں' : 'Close'}
            title={isUrdu ? 'بند کریں' : 'Close'}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Mission */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-700" />
              {isUrdu ? 'پلیٹ فارم کا مقصد:' : 'Platform Mission & Scope:'}
            </h4>
            <p>
              {isUrdu
                ? 'پولیو فیلڈ ٹولز پولیو مہم کے کارکنان، ایریا انچارجز، یوسی میڈیکل افسران، اور مانیٹرز کو حسابی غلطیوں سے محفوظ رکھنے اور مہم کے دوران فوری درست فیصلے کرنے میں مدد دیتا ہے۔'
                : 'Polio Field Tools provides frontline vaccinators, Area In-Charges (AICs), Union Council Medical Officers (UCMOs), and supervisory monitors with precision mathematical calculators, validated SOPs, refusal conversion scripts, and provincial field references.'}
            </p>
          </div>

          {/* Core Fixed Standards */}
          <div className="bg-teal-50/80 p-3.5 rounded-xl border border-teal-100 space-y-2">
            <h4 className="font-bold text-teal-950 text-xs sm:text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              {isUrdu ? 'لازمی مہماتی اصول و معیارات:' : 'Mandatory Campaign Standards:'}
            </h4>
            <ul className="space-y-1.5 text-slate-800">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Fixed bOPV Rule:</strong> 1 vial = 20 doses (covers 20 children, 2 drops each).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Age Limit:</strong> Strictly under 5th birthday (0 to 59 months).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Buffer Stock:</strong> Standard +10% logistic buffer included in demand formulas.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                <span>
                  <strong>Target Benchmarks:</strong> Campaign coverage ≥ 95%; NA recovery ≥ 90%.
                </span>
              </li>
            </ul>
          </div>

          {/* Authoritative Disclaimer */}
          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 text-amber-950 space-y-1.5">
            <h4 className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              {isUrdu ? 'آزاد حیثیت کی وضاحت:' : 'Operational Disclaimer & Non-Affiliation:'}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-700">
              {isUrdu
                ? 'یہ ایک آزاد تکنیکی فیلڈ سپورٹ پلیٹ فارم ہے۔ یہ ادارہ عالمی ادارہ صحت (WHO)، یونیسف، جی پی ای آئی (GPEI) یا حکومتِ پاکستان کے این ای او سی (NEOC) کی باضابطہ ملکیت یا توثیق کا دعویٰ نہیں کرتا۔'
                : 'Polio Field Tools is an independent digital field-support resource designed to assist frontline workers. It does not represent or claim official ownership or endorsement by the World Health Organization (WHO), UNICEF, GPEI, or the National Emergency Operations Centre (NEOC) of Pakistan.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
            <span>{isUrdu ? 'واپس جائیں' : 'Back to App'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'سمجھ آگیا (بند کریں)' : 'Understood (Close)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
