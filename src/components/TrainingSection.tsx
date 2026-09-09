import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  GraduationCap,
  Thermometer,
  MapPin,
  CheckSquare,
  FileCheck,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
} from 'lucide-react';

interface TrainingModule {
  id: string;
  category: string;
  categoryUr: string;
  titleEn: string;
  titleUr: string;
  duration: string;
  level: string;
  levelUr: string;
  summaryEn: string;
  summaryUr: string;
  sopStepsEn: string[];
  sopStepsUr: string[];
  keyRulesEn: string[];
  keyRulesUr: string[];
}

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'train-1',
    category: 'Cold Chain & Logistics',
    categoryUr: 'کولڈ چین اور ویکسین لاجسٹکس',
    titleEn: 'bOPV Vaccine Vial Handling & VVM Interpretation',
    titleUr: 'bOPV ویکسین وائل ہینڈلنگ اور VVM کی جانچ',
    duration: '15 mins',
    level: 'Core Vaccinator',
    levelUr: 'بنیادی ویکسینیٹر',
    summaryEn: 'Standard operating procedures for maintaining the vaccine cold chain (+2°C to +8°C) using conditioned ice packs, vaccine carriers, foam pads, and monitoring Vaccine Vial Monitor (VVM) stages.',
    summaryUr: 'ویکسین کیرئیر میں کنڈیشنڈ آئس پیکس، فوم پیڈ کے استعمال اور ویکسین وائل مانیٹر (VVM) کے 4 مراحل کی درست شناخت کے لیے معیاری فیلڈ طریقہ کار۔',
    sopStepsEn: [
      'Condition all 4 ice packs until water sloshes inside (avoid placing dry-frozen ice packs directly next to vials to prevent droplet freezing).',
      'Place 4 conditioned ice packs along the 4 inner walls of the blue vaccine carrier.',
      'Place bOPV vials inside a plastic bag before placing them inside the carrier, and seal with the foam pad at the top.',
      'During house-to-house vaccination, keep the currently opened vial inserted in the foam pad opening. Never leave vials in direct sunlight.',
      'Check VVM Stage: Stage 1 (inner square white) = Use; Stage 2 (inner square lighter than outer ring) = Use; Stage 3 & 4 (square matches or darker than ring) = DO NOT USE / Return to UCMO.',
    ],
    sopStepsUr: [
      'تمام 4 آئس پیکس کو اس وقت تک باہر رکھیں جب تک اندر پانی ہلنے کی آواز نہ آئے (منجمد برف سے وائل کو براہ راست بچائیں)۔',
      'ویکسین کیرئیر کی چاروں دیواروں کے ساتھ 4 کنڈیشنڈ آئس پیکس ترتیب سے رکھیں۔',
      'bOPV وائلز کو تھیلی میں ڈال کر کیرئیر میں رکھیں اور اوپر فوم پیڈ رکھ کر ڈھکن بند رکھیں۔',
      'فیلڈ میں صرف استعمال شدہ وائل کو فوم پیڈ کے سوراخ میں رکھیں، کبھی بھی وائل کو دھوپ میں نہ رکھیں۔',
      'VVM اسٹیج چیک کریں: اسٹیج 1 اور 2 استعمال کے قابل ہیں؛ اسٹیج 3 اور 4 والی وائل ہرگز استعمال نہ کریں اور فوری واپس جمع کروائیں۔',
    ],
    keyRulesEn: [
      'Fixed Rule: 1 vial = 20 doses (covers 20 children with 2 drops each).',
      'Discard opened vials at the end of the campaign day if cold chain was interrupted or dropper touched child oral mucosa.',
    ],
    keyRulesUr: [
      'مقررہ اصول: 1 وائل = 20 خوراکیں (20 بچوں کے لیے، 2 قطرے فی بچہ)۔',
      'اگر ڈراپر بچے کے منہ کو چھو جائے یا درجہ حرارت خراب ہو تو دن کے اختتام پر وائل ضائع گنی جائے گی۔',
    ],
  },
  {
    id: 'train-2',
    category: 'Field Operations',
    categoryUr: 'فیلڈ آپریشنز',
    titleEn: 'Standard House Marking & Finger Marking Protocol',
    titleUr: 'گھروں پر مارکنگ اور بچے کی انگلی پر نشان لگانے کا طریقہ',
    duration: '12 mins',
    level: 'Field Team',
    levelUr: 'فیلڈ ٹیم',
    summaryEn: 'Accurate chalk marking on household entrances and indelible ink marking on child finger to verify coverage during supervisory monitoring and post-campaign validation.',
    summaryUr: 'گھر کے مین دروازے پر چاک سے واضح مارکنگ اور بچے کے بائیں ہاتھ کی چھوٹی انگلی پر پائیدار سیاہی کا صحیح طریقہ۔',
    sopStepsEn: [
      'Always mark the child’s LEFT little finger (pinky) from the base of the nail across the cuticle with the government-issued indelible ink marker.',
      'Ensure the ink line covers both the skin cuticle and nail plate so it cannot be wiped off.',
      'Mark the household entrance with chalk in the standard 4-quadrant format: Day/Month, Team Number, Total Under-5 Children / Vaccinated Children, and NA/R status.',
      'If children are Not Available, write "NA" with number of missing kids (e.g. NA: 2) and revisit during the evening sweep.',
      'If a family refuses, record "R" on the door and report immediately to the Area In-Charge (AIC) for influencer engagement.',
    ],
    sopStepsUr: [
      'ویکسین پلانے کے فوراً بعد بچے کے بائیں ہاتھ کی چھوٹی انگلی کے ناخن اور جلد کے جوڑ پر مارکر سے واضح لکیر لگائیں۔',
      'اس بات کی تصدیق کریں کہ سیاہی اچھی طرح سوکھ چکی ہے اور مٹائی نہیں جا سکتی۔',
      'گھر کے مرکزی دروازے پر مقررہ فارمیٹ میں چاک سے ٹیم نمبر، تاریخ، کل بچے/ویکسین شدہ بچے درج کریں۔',
      'اگر بچہ موجود نہ ہو تو "NA" لکھیں اور شام کے چکر (ایوننگ سویپ) میں دوبارہ وزٹ کریں۔',
      'انکار کی صورت میں دروازے پر "R" لکھیں اور فوری طور پر ایریا انچارج (AIC) کو مطلع کریں۔',
    ],
    keyRulesEn: [
      'Never pre-mark a door before actually observing and vaccinating every eligible under-5 child.',
      'Always ask specifically for sleeping children, visiting guests, and newborns.',
    ],
    keyRulesUr: [
      'تمام بچوں کو ویکسین پلانے اور تصدیق سے پہلے دروازے پر کبھی پیشگی مارکنگ نہ کریں۔',
      'سوئے ہوئے بچوں، مہمان بچوں اور نوزائیدہ بچوں کے بارے میں لازماً الگ سے پوچھیں۔',
    ],
  },
  {
    id: 'train-3',
    category: 'Microplanning',
    categoryUr: 'مائیکرو پلاننگ',
    titleEn: 'Catchment Area Microplanning & Workload Calculation',
    titleUr: 'یونین کونسل کیچمنٹ ایریا مائیکرو پلاننگ اور ٹیم ورک لوڈ',
    duration: '20 mins',
    level: 'AIC & Supervisor',
    levelUr: 'ایریا انچارج و سپروائزر',
    summaryEn: 'Step-by-step guidance for Area In-Charges to divide Union Councils into manageable daily mobile team workloads and ensure zero missed households.',
    summaryUr: 'یونین کونسل کو روزانہ کے متوازن اہداف میں تقسیم کرنے اور موبائل ٹیموں کا ورک لوڈ مقرر کرنے کی جامع گائیڈ۔',
    sopStepsEn: [
      'Calculate the target under-5 cohort using 15% of the total UC population.',
      'Divide the geographic area into defined day-wise clusters (Day 1 to Day 3 or Day 5).',
      'Allocate standard team workloads: 120-150 children/day for dense urban settings, 80-100 children/day for dispersed rural/mountainous areas.',
      'Ensure every Area Supervisor oversees a manageable span of 4 to 6 mobile teams.',
      'Pre-identify transit points (bus stands, railway stations, toll plazas) and establish permanent transit posts (PTPs).',
    ],
    sopStepsUr: [
      'یوسی کی کل آبادی کا 15 فیصد نکال کر 5 سال سے کم عمر بچوں کا مجموعی ہدف مقرر کریں۔',
      'علاقے کو یومیہ کلسٹرز (دن 1 تا دن 5) میں واضح طور پر تقسیم کریں۔',
      'شہری گنجان آبادی میں روزانہ 120 تا 150 بچے فی ٹیم جبکہ دیہی علاقوں میں 80 تا 100 بچے مقرر کریں۔',
      'ہر ایریا سپروائزر کے پاس 4 سے 6 موبائل ٹیموں کا کنٹرول ہونا چاہیے۔',
      'ٹرانزٹ پوائنٹس (بس اڈوں، ریلوے اسٹیشنز، چوکوں) پر مستقل ٹیمیں تعینات کریں۔',
    ],
    keyRulesEn: [
      'Daily Catch-up Target: At least 90% of reported NA children must be retrieved by Day 4/5.',
      'Campaign achievement benchmark is strictly ≥ 95% total coverage.',
    ],
    keyRulesUr: [
      'کیچ اپ کا ہدف: کم از کم 90% غیر موجود (NA) بچوں کو مہم کے اختتام تک کور کرنا لازمی ہے۔',
      'مجموعی مہماتی کوریج کا بینچ مارک 95% یا اس سے زیادہ ہے۔',
    ],
  },
  {
    id: 'train-4',
    category: 'Surveillance & Zero-Dose',
    categoryUr: 'سرویلنس اور زیرو ڈوز بچے',
    titleEn: 'Tracking Zero-Dose Children & Nomadic/Migrant Populations',
    titleUr: 'زیرو ڈوز اور نقل مکانی کرنے والے بچوں کی تلاش و اندراج',
    duration: '18 mins',
    level: 'All Field Staff',
    levelUr: 'تمام فیلڈ عملہ',
    summaryEn: 'Techniques for locating unregistered newborns, zero-dose children who have never received routine immunization, and seasonal migrant brick-kiln families.',
    summaryUr: 'نوزائیدہ بچوں، اینٹوں کے بھٹوں پر کام کرنے والے خاندانوں اور خانہ بدوش قبائل کے بچوں کی 100 فیصد ٹریکنگ کا طریقہ۔',
    sopStepsEn: [
      'Engage local Lady Health Workers (LHWs) to access newborn birth registries and pregnant women logs.',
      'Visit high-risk pockets: brick kilns, seasonal labor settlements, refugee villages, and construction sites.',
      'Cross-check routine immunization (EPI) cards to identify zero-dose status.',
      'If a zero-dose child is identified, administer bOPV and immediately issue a referral slip to the nearest basic health unit (BHU) for EPI routine antigens (Pentavalent, PCV, Measles).',
    ],
    sopStepsUr: [
      'لیڈی ہیلتھ ورکرز (LHWs) کے رجسٹر سے نوزائیدہ بچوں کی فہرست حاصل کریں۔',
      'ہائی رسک مقامات: اینٹوں کے بھٹہ جات، کچی آبادیوں اور موسمی مزدوروں کے ڈیروں کا خصوصی دورہ کریں۔',
      'روٹین حفاظتی ٹیکہ جات کارڈ چیک کر کے زیرو ڈوز بچوں کی نشاندہی کریں۔',
      'پولیو کے قطرے پلانے کے ساتھ ساتھ قریبی بنیادی مرکز صحت (BHU) کے لیے حفاظتی ٹیکوں کا ریفرل کارڈ جاری کریں۔',
    ],
    keyRulesEn: [
      'Every newborn under 14 days old is strictly eligible for bOPV birth dose (Zero Dose).',
      'Transit point teams must verify ink marks on all children entering or exiting high-risk corridors.',
    ],
    keyRulesUr: [
      'پیدائش سے 14 دن تک کے نوزائیدہ بچے کو پولیو کے 2 قطرے پلانا لازمی ہے۔',
      'ٹرانزٹ پوائنٹس پر داخل ہونے اور باہر جانے والے ہر بچے کی انگلی کا نشان چیک کریں۔',
    ],
  },
];

export const TrainingSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [expandedId, setExpandedId] = useState<string>('train-1');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleExpand = (id: string) => {
    triggerHaptic('light');
    setExpandedId(expandedId === id ? '' : id);
  };

  const categories = [
    { id: 'all', labelEn: 'All Modules (4)', labelUr: 'تمام ماڈیولز (4)' },
    { id: 'Cold Chain & Logistics', labelEn: 'Cold Chain', labelUr: 'کولڈ چین' },
    { id: 'Field Operations', labelEn: 'Field Operations', labelUr: 'فیلڈ آپریشنز' },
    { id: 'Microplanning', labelEn: 'Microplanning', labelUr: 'مائیکرو پلاننگ' },
    { id: 'Surveillance & Zero-Dose', labelEn: 'Zero-Dose Tracking', labelUr: 'زیرو ڈوز' },
  ];

  const filteredModules = activeCategory === 'all'
    ? TRAINING_MODULES
    : TRAINING_MODULES.filter((m) => m.category === activeCategory);

  return (
    <section id="training" className="w-full space-y-4">
      {/* Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isUrdu ? 'پولیو فیلڈ ورکرز ٹریننگ اور معیاری طریقہ کار (SOPs)' : 'Vaccinator & Supervisor Training Modules'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'کولڈ چین، مارکنگ، مائیکرو پلاننگ اور زیرو ڈوز بچوں کی ٹریکنگ کے عملی رہنماء اصول'
                  : 'Practical field SOPs for cold chain, door/finger marking, microplanning, and zero-dose tracking'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
            {isUrdu ? '4 بنیادی ماڈیولز' : '4 Operational SOPs'}
          </span>
        </div>

        {/* Category Filters */}
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

      {/* Modules Accordion / List */}
      <div className="space-y-3">
        {filteredModules.map((module) => {
          const isExpanded = expandedId === module.id;
          return (
            <div
              key={module.id}
              className={`saas-card transition-all duration-200 overflow-hidden ${
                isExpanded ? 'ring-1 ring-teal-500/40 shadow-sm' : ''
              }`}
            >
              {/* Accordion Trigger Header */}
              <button
                type="button"
                onClick={() => toggleExpand(module.id)}
                aria-expanded={isExpanded}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70">
                      {isUrdu ? module.categoryUr : module.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {module.duration}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {isUrdu ? module.levelUr : module.level}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {isUrdu ? module.titleUr : module.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {isUrdu ? module.summaryUr : module.summaryEn}
                  </p>
                </div>

                <div className="p-1 text-slate-400 hover:text-slate-600 flex-shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-teal-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Detail Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs">
                  {/* Step-by-Step SOPs */}
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2.5 text-xs sm:text-sm">
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                      {isUrdu ? 'فیلڈ طریقہ کار (مرحلہ وار SOPs):' : 'Step-by-Step Field SOPs:'}
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      {(isUrdu ? module.sopStepsUr : module.sopStepsEn).map((step, idx) => (
                        <li key={idx} className="pl-1">
                          <span className="font-medium">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Key Operational Rules / Benchmark */}
                  <div className="bg-teal-50/80 p-3.5 rounded-xl border border-teal-100 text-teal-950">
                    <h4 className="font-bold flex items-center gap-1.5 mb-1.5 text-xs text-teal-900">
                      <AlertCircle className="w-4 h-4 text-teal-700" />
                      {isUrdu ? 'لازمی مہماتی اصول و ہدایات:' : 'Critical Operational Rules & Benchmarks:'}
                    </h4>
                    <ul className="space-y-1 list-disc list-inside leading-relaxed text-slate-800">
                      {(isUrdu ? module.keyRulesUr : module.keyRulesEn).map((rule, idx) => (
                        <li key={idx} className="font-medium">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Footer action */}
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                    <span className="italic">
                      {isUrdu
                        ? 'مائیکرو پلان اور فیلڈ ٹریننگ مینوئل پر مبنی'
                        : 'Aligned with Pakistan National Emergency Operations Centre (NEOC) field guidelines'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        window.print();
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-900 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'پرنٹ / محفوظ کریں' : 'Print SOP Guide'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
