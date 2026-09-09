import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  MessageSquare,
  Copy,
  Check,
  HelpCircle,
  Users,
  ShieldCheck,
  Heart,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface CommunicationScript {
  id: string;
  category: string;
  categoryUr: string;
  mythOrHesitationEn: string;
  mythOrHesitationUr: string;
  persuasionScriptEn: string;
  persuasionScriptUr: string;
  fieldTipsEn: string;
  fieldTipsUr: string;
  keyMessengerEn: string;
  keyMessengerUr: string;
}

const COMMUNICATION_SCRIPTS: CommunicationScript[] = [
  {
    id: 'comm-1',
    category: 'Repeated Doses',
    categoryUr: 'بار بار مہم کا سوال',
    mythOrHesitationEn: '"Why does my child need polio drops again when they were already vaccinated last month?"',
    mythOrHesitationUr: '"میرے بچے نے پچھلے مہینے بھی قطرے پیے تھے، اب بار بار کیوں پلائے جا رہے ہیں؟"',
    persuasionScriptEn: '"Assalam-o-Alaikum respected elder. Polio drops are not like ordinary medicine taken only during sickness—each dose adds an invisible shield layer of immunity inside the child’s gut. Because the wild poliovirus spreads silently through environmental water and sewage, repeated drops build an impenetrable wall of antibodies so that even if the virus enters the community, your child remains 100% safe from lifelong paralysis. Think of each campaign round as another coat of protection for your child’s future walking."',
    persuasionScriptUr: '"السلام علیکم محترم۔ پولیو کے قطرے کوئی عام دوا نہیں ہیں جو صرف بیماری میں دی جائیں، بلکہ ہر خوراک بچے کی آنتوں میں قوت مدافعت کی ایک نئی مضبوط ڈھال بناتی ہے۔ چونکہ پولیو کا وائرس ماحول اور سیوریج کے پانی میں چھپا ہوتا ہے، اس لیے بار بار ملنے والی خوراکیں اینٹی باڈیز کی ایسی ناقابل تسخیر دیوار کھڑی کرتی ہیں کہ اگر وائرس آس پاس بھی ہو تو آپ کا بچہ عمر بھر کی معذوری سے محفوظ رہتا ہے۔"',
    fieldTipsEn: 'Acknowledge parental concern first without arguing. Use the "layer of armor" analogy. Never blame or threaten the caregiver.',
    fieldTipsUr: 'والدین کی فکر کو تسلیم کریں، بحث نہ کریں۔ ڈھال یا حفاظتی تہہ کی مثال دیں۔',
    keyMessengerEn: 'Female Vaccinator / Community Mobilizer',
    keyMessengerUr: 'خاتون ویکسینیٹر / کمیونٹی موبلائزر',
  },
  {
    id: 'comm-2',
    category: 'Child Illness & Fever',
    categoryUr: 'بچے کی بیماری یا نزلہ زکام',
    mythOrHesitationEn: '"My child has a mild fever and cough today, so I do not want to give them drops."',
    mythOrHesitationUr: '"میرا بچہ آج بیمار ہے، ہلکا بخار اور کھانسی ہے، اس لیے میں قطرے نہیں پلوانا چاہتی۔"',
    persuasionScriptEn: '"Respected sister, oral polio vaccine (bOPV) is completely safe and gentle even when a child has a mild fever, cough, or diarrhea. In fact, a sick child has lower natural defense, making it even more vital to ensure they receive polio protection. These 2 drops will not increase the fever or conflict with any existing cough syrup. Let us give the drops now so your baby is protected."',
    persuasionScriptUr: '"بہن، پولیو کے دو قطرے مکمل طور پر محفوظ ہیں اور ہلکے بخار، نزلہ، کھانسی یا دست کی حالت میں بھی بلاتردد دیے جا سکتے ہیں۔ بلکہ بیمار بچے کا مدافعتی نظام پہلے ہی دباؤ میں ہوتا ہے، اس لیے پولیو وائرس سے بچاؤ اور بھی ضروری ہو جاتا ہے۔ یہ 2 قطرے بخار کو بالکل نہیں بڑھائیں گے اور نہ ہی کسی دوسری دوا میں رکاوٹ بنتے ہیں۔"',
    fieldTipsEn: 'If child is acutely hospitalized or vomiting continuously, record as temporary "NA", arrange clinical checkup, and revisit when stabilized.',
    fieldTipsUr: 'اگر بچہ شدید الٹیاں کر رہا ہو یا ہسپتال میں داخل ہو تو عارضی NA درج کریں اور صحت یابی کے بعد وزٹ کریں۔',
    keyMessengerEn: 'Medical Officer / Area In-Charge',
    keyMessengerUr: 'میڈیکل آفیسر / ایریا انچارج',
  },
  {
    id: 'comm-3',
    category: 'Safety & Halal Certification',
    categoryUr: 'حلال حیثیت و ویکسین کی حفاظت',
    mythOrHesitationEn: '"Is the polio vaccine Halal and safe according to Islamic scholars?"',
    mythOrHesitationUr: '"کیا پولیو ویکسین حلال ہے اور کیا علمائے کرام اس کی تائید کرتے ہیں؟"',
    persuasionScriptEn: '"Yes, absolutely. The polio vaccine contains pure antigens with zero harmful substances and is certified 100% Halal by the world’s leading Islamic authorities, including Al-Azhar University, the Organization of Islamic Cooperation (OIC), and the Council of Islamic Ideology (CII) in Pakistan. Renowned muftis and religious leaders unanimously declare that safeguarding children from preventable disability is a sacred parental obligation in Islam."',
    persuasionScriptUr: '"جی بالکل، پولیو ویکسین مکمل طور پر حلال اور محفوظ ہے۔ جامعہ الازہر، اسلامی تعاون تنظیم (OIC)، اور پاکستان کی اسلامی نظریاتی کونسل (CII) نے باقاعدہ فتاویٰ جاری کیے ہیں کہ بچوں کو معذوری سے بچانا شرعی و اخلاقی ذمہ داری ہے۔ پاکستان اور سعودی عرب سمیت تمام اسلامی ممالک میں بچوں کو یہی ویکسین دی جاتی ہے۔"',
    fieldTipsEn: 'Carry a copy of the official Council of Islamic Ideology (CII) fatwa booklet in the team kit for persistent theological questions.',
    fieldTipsUr: 'فیلڈ کٹ میں اسلامی نظریاتی کونسل اور جید علماء کے تصدیق شدہ فتاویٰ کا پمفلٹ ساتھ رکھیں۔',
    keyMessengerEn: 'Local Imam / Ulema Committee / Jirga Elder',
    keyMessengerUr: 'مقامی امام مسجد / علماء کمیٹی / جرگہ معزز',
  },
  {
    id: 'comm-4',
    category: 'Newborn Eligibility',
    categoryUr: 'نوزائیدہ بچے کی اہلیت',
    mythOrHesitationEn: '"My baby was born only 3 days ago; they are too tiny and fragile for drops."',
    mythOrHesitationUr: '"میرا بچہ ابھی صرف تین دن کا ہے، وہ بہت چھوٹا اور نازک ہے قطرے برداشت نہیں کر سکے گا۔"',
    persuasionScriptEn: '"Mubarak on the blessed new addition to your family! Because a newborn baby has no prior exposure to the outside environment, they are the most vulnerable of all to dangerous viruses. The oral polio vaccine is designed specifically to be safe from the very first hour of birth. In fact, receiving drops now gives the infant early immunity before any environmental hazard can touch them. Two small drops directly on the tongue will protect your blessing for life."',
    persuasionScriptUr: '"آپ کو بچے کی پیدائش کی دلی مبارکباد! نوزائیدہ بچہ دنیا میں نیا ہوتا ہے اور اس کی قوت مدافعت کمزور ہوتی ہے، اس لیے وہ وائرس کے حملے کے سامنے سب سے زیادہ خطرے میں ہوتا ہے۔ پولیو کے قطرے پیدائش کے پہلے گھنٹے سے ہی دیئے جاتے ہیں۔ یہ صرف دو میٹھے قطرے ہیں جو بچے کے مستقبل کو عمر بھر کے لیے محفوظ کر دیتے ہیں۔"',
    fieldTipsEn: 'Always congratulate the family warmly first. Never wake a newborn aggressively; gently administer while held in mother’s arms.',
    fieldTipsUr: 'پہلے مبارکباد دیں اور خوشگوار لہجہ اپنائیں۔ بچے کو زبردستی جھٹکا نہ دیں بلکہ ماں کی گود میں آرام سے قطرے پلائیں۔',
    keyMessengerEn: 'Female Community Mobilizer / LHW',
    keyMessengerUr: 'خاتون کمیونٹی ورکر / لیڈی ہیلتھ ورکر',
  },
];

export const CommunicationSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const copyScript = (id: string, text: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const categories = [
    { id: 'all', labelEn: 'All Scripts (4)', labelUr: 'تمام سکرپٹس (4)' },
    { id: 'Repeated Doses', labelEn: 'Repeated Doses', labelUr: 'بار بار مہم' },
    { id: 'Child Illness & Fever', labelEn: 'Child Sickness', labelUr: 'بیماری و بخار' },
    { id: 'Safety & Halal Certification', labelEn: 'Halal Certification', labelUr: 'حلال و شرعی حیثیت' },
    { id: 'Newborn Eligibility', labelEn: 'Newborns', labelUr: 'نوزائیدہ بچے' },
  ];

  const filteredScripts = activeCategory === 'all'
    ? COMMUNICATION_SCRIPTS
    : COMMUNICATION_SCRIPTS.filter((s) => s.category === activeCategory);

  return (
    <section id="communication" className="w-full space-y-4">
      {/* Section Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isUrdu ? 'کمیونیکیشن و ریفیوزل کنورژن سکرپٹس (SBC)' : 'Refusal Conversion & Social Behavior Change (SBC)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'انکاری والدین اور ہچکچاہٹ کا شکار خاندانوں کے شکوک رفع کرنے کے لیے فیلڈ آزمودہ سکرپٹس'
                  : 'Field-tested dialogue scripts, objection-handling guides, and parent counseling talking points'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
            {isUrdu ? 'موبلائزرز ٹول کٹ' : 'Mobilizer Toolkit'}
          </span>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-3 border-t border-slate-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory(cat.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {isUrdu ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Script Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredScripts.map((script) => {
          const scriptText = isUrdu ? script.persuasionScriptUr : script.persuasionScriptEn;
          const isCopied = copiedId === script.id;

          return (
            <div
              key={script.id}
              className="saas-card p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-teal-300/80 transition-colors"
            >
              {/* Question / Hesitation Prompt */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-amber-700" />
                    {isUrdu ? script.categoryUr : script.category}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {isUrdu ? script.keyMessengerUr : script.keyMessengerEn}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  {isUrdu ? script.mythOrHesitationUr : script.mythOrHesitationEn}
                </h3>

                {/* Practical Persuasion Script */}
                <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100/90 text-slate-800 relative">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-teal-900">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                      {isUrdu ? 'عملی جواب و سکرپٹ:' : 'Recommended Persuasion Script:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyScript(script.id, scriptText)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-teal-800 border border-teal-200/80 font-semibold text-[11px] hover:bg-teal-100/60 transition cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{isUrdu ? 'کاپی ہوگیا!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-teal-700" />
                          <span>{isUrdu ? 'سکرپٹ کاپی کریں' : 'Copy Script'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-[13px] leading-relaxed italic text-slate-800">
                    {scriptText}
                  </p>
                </div>
              </div>

              {/* Field Tips & Messenger recommendation */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="font-medium">
                    <strong className="text-slate-900">{isUrdu ? 'فیلڈ نکتہ: ' : 'Field Tip: '}</strong>
                    {isUrdu ? script.fieldTipsUr : script.fieldTipsEn}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
