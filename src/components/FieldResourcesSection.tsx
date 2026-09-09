import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  Map,
  Compass,
  AlertTriangle,
  Users,
  Navigation,
  CheckCircle2,
  Building2,
  Shield,
} from 'lucide-react';

interface ProvincialResource {
  id: string;
  provinceEn: string;
  provinceUr: string;
  keyDistrictsEn: string;
  keyDistrictsUr: string;
  operationalProfileEn: string;
  operationalProfileUr: string;
  highRiskFocusEn: string[];
  highRiskFocusUr: string[];
  fieldStrategyEn: string[];
  fieldStrategyUr: string[];
}

const PROVINCIAL_RESOURCES: ProvincialResource[] = [
  {
    id: 'res-kp',
    provinceEn: 'Khyber Pakhtunkhwa (KP) & Merged Districts',
    provinceUr: 'خیبر پختونخوا اور ضم شدہ قبائلی اضلاع',
    keyDistrictsEn: 'Peshawar, Bannu, North Waziristan, South Waziristan, Lakki Marwat, Tank, D.I. Khan, Khyber',
    keyDistrictsUr: 'پشاور، بنوں، شمالی وزیرستان، جنوبی وزیرستان، لکی مروت، ٹانک، ڈیرہ اسماعیل خان، خیبر',
    operationalProfileEn: 'Mountainous terrain, dispersed settlements, border transit corridors, and historical transmission pockets requiring community trust building.',
    operationalProfileUr: 'پہاڑی و دشوار گزار علاقے، دور دراز بستیاں، بین الاضلاعی راستے اور روایتی قبائلی جرگوں کے ذریعے کمیونٹی اعتماد سازی۔',
    highRiskFocusEn: [
      'High-Risk Union Councils (HRUCs) in South KP & Peshawar suburbs',
      'Cross-border movement & seasonal Afghan refugee populations',
      'IDP returnee settlements and temporary transit encampments',
    ],
    highRiskFocusUr: [
      'جنوبی خیبر پختونخوا اور مضافات کے ہائی رسک یونین کونسلز (HRUCs)',
      'سرحدی نقل مکانی اور موسمی مہاجرین کے خاندان',
      'نقل مکانی کر کے واپس آنے والے خاندان اور خیمہ بستیاں',
    ],
    fieldStrategyEn: [
      'Empower Female Community Volunteers (CBVs) for culturally respected indoor entry.',
      'Engage local tribal elders (Maliks) and religious scholars for refusal resolution.',
      'Deploy Permanent Transit Posts (PTPs) at major highway intersections and mountain passes.',
    ],
    fieldStrategyUr: [
      'گھروں میں خواتین اور بچوں تک باوقار رسائی کے لیے مقامی خواتین رضا کاروں (CBVs) کی شمولیت۔',
      'انکار کے خاتمے کے لیے مقامی مشران، ملک اور علمائے کرام پر مشتمل جرگہ کمیٹیاں۔',
      'اہم شاہراہوں اور دروں پر 24 گھنٹے فعال ٹرانزٹ پوائنٹس (PTPs)۔',
    ],
  },
  {
    id: 'res-sindh',
    provinceEn: 'Sindh (Karachi Divisions & Rural Sindh)',
    provinceUr: 'سندھ (کراچی ڈویژن اور دیہی سندھ)',
    keyDistrictsEn: 'Karachi Core (Gadap, Baldia, Orangi, Bin Qasim, Keamari), Hyderabad, Sukkur, Larkana, Jacobabad',
    keyDistrictsUr: 'کراچی ڈویژن (گڈاپ، بلدیہ، اورنگی، بن قاسم، کیماڑی)، حیدرآباد، سکھر، لاڑکانہ، جیکب آباد',
    operationalProfileEn: 'Mega-urban density, multi-ethnic migrant settlements, high population turnover, and informal katchi abadis interspersed with canal irrigated rural tracts.',
    operationalProfileUr: 'انتہائی گنجان کچی آبادیاں، مختلف زبانیں بولنے والے مزدور طبقے، تیز رفتار نقل مکانی اور نہری زرعی علاقے جہاں شام کے اوقات اہم ہیں۔',
    highRiskFocusEn: [
      'Informal urban settlements with fluctuating migrant laborers',
      'Multi-lingual populations (Pashto, Sindhi, Balochi, Saraiki, Urdu)',
      'High-traffic transit points: Cantt Station, Sohrab Goth, Super Highway toll plaza',
    ],
    highRiskFocusUr: [
      'کچی آبادیاں اور یومیہ اجرت پر کام کرنے والے خاندان',
      'کثیر اللسانی بستیاں (پشتو، سندھی، بلوچی، سرائیکی، اردو)',
      'بڑے ٹرانزٹ مقامات: سہراب گوٹھ، کینٹ اسٹیشن، سپر ہائی وے ٹول پلازہ',
    ],
    fieldStrategyEn: [
      'Conduct staggered evening sweeps (4:00 PM – 7:30 PM) to reach fathers returning from daily factory shifts.',
      'Assign language-matched mobilizers representing specific community dialects.',
      'Coordinate with private school associations and religious madrasahs for morning school campaigns.',
    ],
    fieldStrategyUr: [
      'شام 4 تا 7 بجے خصوصی سویپس تاکہ فیکٹریوں اور مزدوری سے لوٹنے والے والدین کے بچوں کو قطرے پلائے جا سکیں۔',
      'علاقائی زبانوں اور بولیوں سے مطابقت رکھنے والے کمیونٹی موبلائزرز کی تعیناتی۔',
      'نجی تعلیمی اداروں اور مدارس میں باقاعدہ صبح کی ویکسینیشن مہمات۔',
    ],
  },
  {
    id: 'res-balochistan',
    provinceEn: 'Balochistan (Quetta Block & Southern Corridor)',
    provinceUr: 'بلوچستان (کوئٹہ بلاک اور جنوبی بیلٹ)',
    keyDistrictsEn: 'Quetta, Pishin, Killa Abdullah, Chaman, Hub, Lasbela, Kech',
    keyDistrictsUr: 'کوئٹہ، پشین، قلعہ عبداللہ، چمن، حب، لسبیلہ، کیچ',
    operationalProfileEn: 'Vast geographic dispersion, low population density, long travel distances between hamlets, and international border trade routes.',
    operationalProfileUr: 'وسیع جغرافیائی رقبہ، بکھری ہوئی آبادیاں، بستیوں کے درمیان طویل فاصلے اور پاک افغان سرحدی تجارتی راہداریاں۔',
    highRiskFocusEn: [
      'Quetta urban union councils and satellite peri-urban towns',
      'Chaman border crossing and nomadic pastoralist caravans (Powindahs)',
      'Hub industrial belt bordering Karachi with daily worker transit',
    ],
    highRiskFocusUr: [
      'کوئٹہ شہر اور مضافاتی یونین کونسلز',
      'چمن بارڈر کراسنگ اور موسمی خانہ بدوش قافلے (پووندہ قبائل)',
      'حب انڈسٹریل بیلٹ جہاں روزانہ ہزاروں مزدور کراچی سے آمد و رفت کرتے ہیں',
    ],
    fieldStrategyEn: [
      'Motorized mobile teams with heavy-duty cold chain carriers for dispersed rural routes.',
      'Zero-dose identification at border screening gates and water distribution points.',
      'Active mapping of seasonal nomadic camel and livestock migration paths.',
    ],
    fieldStrategyUr: [
      'طویل فاصلوں کے لیے موٹرسائیکل و گاڑیوں پر مشتمل موبائل ٹیمیں اور مضبوط کولڈ چین۔',
      'سرحدی راستوں اور چشموں/پانی کے نلکوں پر زیرو ڈوز بچوں کی تلاش۔',
      'خانہ بدوش قبائل کی موسمی نقل و حرکت کے راستوں کی باقاعدہ فیلڈ میپنگ۔',
    ],
  },
  {
    id: 'res-punjab',
    provinceEn: 'Punjab (High-Risk Corridors & Riverine Belts)',
    provinceUr: 'پنجاب (ہائی رسک راہداریاں اور کچے کے علاقے)',
    keyDistrictsEn: 'Lahore, Rawalpindi, Faisalabad, Multan, D.G. Khan, Rajanpur',
    keyDistrictsUr: 'لاہور، راولپنڈی، فیصل آباد، ملتان، ڈیرہ غازی خان، راجن پور',
    operationalProfileEn: 'High population volume, industrial brick-kiln clusters, seasonal agriculture harvesting influx, and inaccessible riverine (Kacha) islands.',
    operationalProfileUr: 'بھاری آبادی کا دباؤ، اینٹوں کے بھٹہ جات کا نیٹ ورک، گندم و کپاس کی چنائی کے لیے موسمی نقل مکانی، اور دریائی کچے کے علاقے جہاں کشتیوں کی ضرورت پڑتی ہے۔',
    highRiskFocusEn: [
      'Brick-kiln families moving seasonally between districts',
      'Riverine (Kacha) areas along the Indus River with boat transit',
      'Urban slums and construction worker encampments',
    ],
    highRiskFocusUr: [
      'اینٹوں کے بھٹوں پر مقیم موسمی مزدور خاندان',
      'دریائے سندھ کے کچے کے جزائر اور دور دراز ڈیرے',
      'شہری جھگی بستیاں اور تعمیراتی مقامات کے مزدور',
    ],
    fieldStrategyEn: [
      'Dedicated boat-mobile teams equipped with floating cold chain kits for riverine islands.',
      'Brick-kiln seasonal registers maintained with kiln owner association collaboration.',
      'Comprehensive sweeps at inter-provincial bus depots and railway platforms.',
    ],
    fieldStrategyUr: [
      'کچے کے جزائر کے لیے کشتیوں پر سوار موبائل ٹیمیں اور خصوصی لائف جیکٹس و کیرئیرز۔',
      'بھٹہ مالکان ایسوسی ایشن کے تعاون سے موسمی مزدوروں کے بچوں کا پیشگی اندراج۔',
      'انٹر پروونشل بس ٹرمینلز اور ریلوے اسٹیشنز پر چوبیس گھنٹے کیمپ۔',
    ],
  },
];

export const FieldResourcesSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [activeProvinceId, setActiveProvinceId] = useState<string>('res-kp');

  const selectedProvince = PROVINCIAL_RESOURCES.find((p) => p.id === activeProvinceId) || PROVINCIAL_RESOURCES[0];

  return (
    <section id="field-resources" className="w-full space-y-4">
      {/* Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isUrdu ? 'پاکستان کے صوبائی و علاقائی فیلڈ آپریشنل وسائل' : 'Provincial Operational Guides & High-Risk Protocols'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'خیبر پختونخوا، سندھ، بلوچستان اور پنجاب کے لیے مخصوص مہماتی حکمت عملی'
                  : 'Tailored field operational profiles and risk strategies across Pakistan provinces'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
            {isUrdu ? '4 اہم ریجنز' : '4 Province Profiles'}
          </span>
        </div>

        {/* Province Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100">
          {PROVINCIAL_RESOURCES.map((prov) => {
            const isActive = activeProvinceId === prov.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveProvinceId(prov.id);
                }}
                className={`p-2.5 rounded-xl text-left transition cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'bg-teal-800 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Map className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-teal-700'}`} />
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    HRUC
                  </span>
                </div>
                <span className="text-xs font-bold leading-tight">
                  {isUrdu ? prov.provinceUr.split(' ')[0] : prov.provinceEn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Province Detailed Resource Card */}
      <div className="saas-card p-4 sm:p-6 space-y-4">
        {/* Province Title & Key Districts */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/70">
              {isUrdu ? 'علاقائی پروفائل' : 'Regional Profile'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isUrdu ? selectedProvince.provinceUr : selectedProvince.provinceEn}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            <strong className="text-slate-900">{isUrdu ? 'کلیدی اضلاع: ' : 'Key Focus Districts: '}</strong>
            {isUrdu ? selectedProvince.keyDistrictsUr : selectedProvince.keyDistrictsEn}
          </p>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {isUrdu ? selectedProvince.operationalProfileUr : selectedProvince.operationalProfileEn}
          </p>
        </div>

        {/* 2 Columns: High-Risk Focus vs Tailored Field Strategies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* High-Risk Focus */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 text-amber-950 space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              {isUrdu ? 'ہائی رسک فوکس اور چیلنجز:' : 'High-Risk Focus Pockets & Challenges:'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-800">
              {(isUrdu ? selectedProvince.highRiskFocusUr : selectedProvince.highRiskFocusEn).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1.5" />
                  <span className="font-medium leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Strategies */}
          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/70 text-teal-950 space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-teal-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-700" />
              {isUrdu ? 'موزوں فیلڈ حکمت عملی:' : 'Tailored Operational Strategy:'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-800">
              {(isUrdu ? selectedProvince.fieldStrategyUr : selectedProvince.fieldStrategyEn).map((st, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
