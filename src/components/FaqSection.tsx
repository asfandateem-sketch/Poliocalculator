import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react';

interface FaqItem {
  id: string;
  questionEn: string;
  questionUr: string;
  answerEn: string;
  answerUr: string;
  category: 'who_what' | 'formulas' | 'field_rules' | 'disclaimer';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'who_what',
    questionEn: 'What is Polio Field Tools and WHO is it for?',
    questionUr: 'پولیو فیلڈ ٹولز کیا ہے اور یہ کن لوگوں کے لیے بنایا گیا ہے؟',
    answerEn: 'Polio Field Tools is an independent, mobile-first field-support web utility designed specifically for frontline polio campaign staff across Pakistan—including Mobile Vaccination Teams, Area In-Charges (AICs), Union Council Medical Officers (UCMOs), Field Monitors, Social Mobilizers (CBVs/COMNet), and District Surveillance Officers in Khyber Pakhtunkhwa, Sindh, Balochistan, and Punjab. It eliminates arithmetic tally errors, prevents vaccine stockouts, provides tested refusal communication scripts, and stores standard field SOPs.',
    answerUr: 'پولیو فیلڈ ٹولز ایک آزاد، موبائل فرینڈلی پلیٹ فارم ہے جو پاکستان بھر کے پولیو فیلڈ ورکرز—بشمول موبائل ٹیمز، ایریا انچارجز (AICs)، یونین کونسل میڈیکل افسران (UCMOs)، مانیٹرز اور کمیونٹی موبلائزرز (CBVs)—کی مدد کے لیے تیار کیا گیا ہے۔ یہ فیلڈ میں حسابی غلطیوں کا خاتمہ کرتا ہے، ویکسین کی طلب کا درست تعین کرتا ہے اور انکاری خاندانوں سے مکالمے کے لیے آزمودہ سکرپٹس فراہم کرتا ہے۔',
  },
  {
    id: 'faq-2',
    category: 'formulas',
    questionEn: 'WHAT mathematical formulas are used by the 9 Field Calculators?',
    questionUr: 'تمام 9 فیلڈ کیلکولیٹرز میں کونسے ریاضیاتی فارمولے استعمال کیے گئے ہیں؟',
    answerEn: 'All calculators use standard international epidemiological microplanning mathematics: (1) Child Age: exact calendar days/months/years to verify strictly < 5th birthday; (2) Vaccine Demand: ROUNDUP((Target × 1.10) ÷ 20) with 10% buffer and 20 doses/vial; (3) Vaccine Wastage: ((Vials Used × 20 - Children Vaccinated) ÷ (Vials Used × 20)) × 100; (4) NA Coverage Rate: (Covered NA ÷ Reported NA) × 100 (Target: ≥90%); (5) Refusal Conversion Rate: (Covered Refusals ÷ Reported Refusals) × 100; (6) Missed Children Coverage: Combines NA + Refusals and calculates remaining bOPV vials; (7) Campaign Coverage: (Vaccinated ÷ Target) × 100 (Benchmark: ≥95%); (8) Daily Catch-Up Target: ROUNDUP((Target - Vaccinated) ÷ Remaining Days); (9) Under-5 Cohort: ROUNDUP(Total Population × 15%).',
    answerUr: 'تمام کیلکولیٹرز عالمی ای پی آئی اصولوں پر مبنی ہیں: (1) عمر: 5ویں سالگرہ سے پہلے کی درست تصدیق؛ (2) ویکسین طلب: ((ہدف × 1.10) ÷ 20) جس میں 10 فیصد بفر شامل ہے؛ (3) ویکسین ضیاع شرح: ((استعمال شدہ وائلز × 20 - ویکسینیٹڈ بچے) ÷ کل خوراکیں) × 100؛ (4) غیر حاضر (NA) بچوں کی کوریج شرح: (کور شدہ NA ÷ رپورٹ شدہ NA) × 100 (ہدف 90 فیصد)؛ (5) انکاری بچوں کی کوریج؛ (6) مجموعی مسڈ بچے اور درکار وائلز؛ (7) مہماتی کوریج: (ویکسینیٹڈ ÷ ہدف) × 100 (بینچ مارک 95 فیصد)؛ (8) یومیہ کیچ اپ ہدف؛ (9) 5 سال سے کم عمر آبادی کا 15 فیصد کوہاورٹ ہدف۔',
  },
  {
    id: 'faq-3',
    category: 'field_rules',
    questionEn: 'WHY is there a strict "Fixed bOPV Rule" of 1 vial = 20 doses (2 drops/child)?',
    questionUr: 'bOPV کا یہ مقررہ اصول کیوں ہے کہ 1 وائل = 20 خوراکیں اور 2 قطرے فی بچہ؟',
    answerEn: 'Oral polio vaccine (bOPV) multi-dose vials are manufactured and calibrated strictly to contain 20 therapeutic doses when using the standard calibrated dropper cap. Each eligible under-5 child must receive exactly 2 drops placed directly on the tongue to guarantee viral neutralizing gut immunity. Never dilute, stretch, or alter the 2-drop administration protocol.',
    answerUr: 'بائیویلنٹ اورل پولیو ویکسین (bOPV) کی وائل 20 معیاری خوراکوں پر مشتمل ہوتی ہے۔ ہر اہل بچے کو منہ میں براہ راست 2 قطرے دینا لازمی ہے تاکہ اس کی آنتوں میں وائرس سے مکمل حفاظت پیدا ہو سکے۔ قطروں کی تعداد کو 2 سے کم کرنا یا وائل میں پانی/مائع ملانا سخت ممنوع ہے۔',
  },
  {
    id: 'faq-4',
    category: 'field_rules',
    questionEn: 'WHERE does this tool apply within Pakistan’s polio eradication architecture?',
    questionUr: 'یہ ٹول پاکستان کے کن علاقوں اور کن مہمات میں کارآمد ہے؟',
    answerEn: 'The tool applies universally across all provinces of Pakistan—especially core endemic reservoirs and high-risk corridors in Khyber Pakhtunkhwa (South KP, Peshawar), Sindh (Karachi informal settlements), Balochistan (Quetta Block), and Punjab (migrant/brick kiln corridors). It is optimized for National Immunization Days (NID), Sub-National Immunization Days (SNID), Case Response Outbreak campaigns (OBRs), and Permanent Transit Post (PTP) operations.',
    answerUr: 'یہ ٹول پاکستان کے تمام صوبوں، بالخصوص ہائی رسک ٹرانسمیشن زونز بشمول جنوبی خیبر پختونخوا، کراچی، کوئٹہ بلاک اور پنجاب کے اینٹوں کے بھٹوں میں مکمل طور پر لاگو ہوتا ہے۔ یہ قومی مہمات (NID)، ذیلی مہمات (SNID) اور ٹرانزٹ پوائنٹس کے لیے یکساں مفید ہے۔',
  },
  {
    id: 'faq-5',
    category: 'disclaimer',
    questionEn: 'Is Polio Field Tools officially affiliated with WHO, UNICEF, or the Government?',
    questionUr: 'کیا پولیو فیلڈ ٹولز کا عالمی ادارہ صحت (WHO) یا حکومت سے باضابطہ تعلق ہے؟',
    answerEn: 'No. Polio Field Tools is an independent, non-profit operational field aid developed to assist frontline healthcare workers and supervisors. While its mathematical algorithms, VVM definitions, and guidelines strictly adhere to published international epidemiological standards, this application is neither owned, operated, nor officially endorsed by the World Health Organization (WHO), UNICEF, the Global Polio Eradication Initiative (GPEI), or the National Emergency Operations Centre (NEOC) of Pakistan.',
    answerUr: 'نہیں، پولیو فیلڈ ٹولز ایک آزاد اور غیر سرکاری علمی و تکنیکی فیلڈ معاونت کا ذریعہ ہے جسے فرنٹ لائن ہیلتھ ورکرز کی سہولت کے لیے بنایا گیا ہے۔ اگرچہ اس کے تمام حسابی فارمولے اور اصول شائع شدہ عالمی گائیڈ لائنز کے مطابق ہیں، لیکن یہ ادارہ عالمی ادارہ صحت (WHO)، یونیسف یا حکومتِ پاکستان کے این ای او سی (NEOC) کی باضابطہ ملکیت یا توثیق کا دعویٰ نہیں کرتا۔',
  },
];

export const FaqSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [expandedFaqId, setExpandedFaqId] = useState<string>('faq-1');

  const toggleFaq = (id: string) => {
    triggerHaptic('light');
    setExpandedFaqId(expandedFaqId === id ? '' : id);
  };

  return (
    <section id="faq" className="w-full space-y-4">
      {/* Header */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {isUrdu ? 'اکثر پوچھے جانے والے سوالات اور آپریشنل اصول (FAQ)' : 'Frequently Asked Questions & Operational Standards'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isUrdu
                ? 'فارمولوں، ہائی رسک یوسیز، bOPV کے اصول اور پلیٹ فارم کے مقصد کی تفصیلی وضاحت'
                : 'Clear operational answers for search engines, AI models, and frontline healthcare workers'}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isExpanded = expandedFaqId === item.id;
          return (
            <div
              key={item.id}
              className={`saas-card transition-all duration-200 overflow-hidden ${
                isExpanded ? 'ring-1 ring-teal-500/40 shadow-xs' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(item.id)}
                aria-expanded={isExpanded}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug flex-1">
                  {isUrdu ? item.questionUr : item.questionEn}
                </h3>
                <div className="text-slate-400 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-teal-700" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-700 leading-relaxed bg-slate-50/50">
                  <p className="p-3 bg-white rounded-xl border border-slate-100">
                    {isUrdu ? item.answerUr : item.answerEn}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Authoritative Transparency & Neutrality Notice */}
      <div className="saas-card p-4 sm:p-5 bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Info className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>{isUrdu ? 'شفافیت اور آزاد حیثیت کا بیان' : 'Operational Transparency & Non-Affiliation Notice'}</span>
        </div>
        <p className="leading-relaxed">
          {isUrdu
            ? 'پولیو فیلڈ ٹولز ایک آزاد، عوامی خدمت کا فیلڈ سپورٹ پلیٹ فارم ہے جو پولیو ورکرز کی حسابی و تکنیکی معاونت کے لیے بنایا گیا ہے۔ یہ کسی حکومتی ادارے یا بین الاقوامی ایجنسی کی باضابطہ ترجمانی نہیں کرتا۔'
            : 'Polio Field Tools is an independent digital field aid developed to support frontline community health teams and campaign supervisors. It does not claim official affiliation or endorsement by WHO, UNICEF, GPEI, or government health ministries.'}
        </p>
      </div>
    </section>
  );
};
