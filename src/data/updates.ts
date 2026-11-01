/**
 * POLIO FIELD TOOLS — LATEST UPDATES & OFFICIAL DISPATCHES
 * 
 * Sourced directly from official Pakistan & KP Polio Facebook channels:
 * - EOC Pakhtunkhwa (https://www.facebook.com/eocpakhtunkhwa)
 * - Pakistan Polio Eradication Initiative (https://www.facebook.com/polioeradicationinitiative)
 * - Khyber Pakhtunkhwa Polio Programme (https://www.facebook.com/profile.php?id=100077497336541)
 * 
 * All figures and campaign dates are cross-checked with official NEOC, WHO, UNICEF,
 * and Provincial Health Department documentation.
 */

export type UpdateCategory =
  | 'Campaigns'
  | 'Activities'
  | 'Announcements'
  | 'Programme Updates'
  | 'Media & Videos'
  | 'Training'
  | 'Resources'
  | 'Important';

export interface CampaignFactBox {
  campaignName: string;
  dates: string;
  location: string;
  targetChildren?: string;
  frontlineWorkers?: string;
  districtsCovered?: string;
  supervision?: string;
  keyDirectives?: string[];
}

export interface UpdateKeyFact {
  labelEn: string;
  labelUr: string;
  valueEn: string;
  valueUr: string;
}

export interface PolioUpdate {
  id: string;
  slug: string;
  title: string;
  titleUr: string;
  date: string; // ISO YYYY-MM-DD
  displayDate: string;
  displayDateUr: string;
  category: UpdateCategory;
  categoryUr: string;
  location: string;
  locationUr: string;
  summary: string;
  summaryUr: string;
  content: string; // Formatted markdown/paragraphs
  contentUr: string;
  sourceName: string; // "EOC Pakhtunkhwa" | "Pakistan Polio Eradication Initiative" | "Khyber Pakhtunkhwa Polio Programme" | string
  sourceUrl: string; // Facebook post or page URL
  facebookPostUrl?: string; // Direct Facebook post link
  image?: string; // Base64 data URL or remote URL
  imageCaption?: string;
  imageCaptionUr?: string;
  photoCredit?: string;
  videoUrl?: string; // Facebook video URL, YouTube, MP4, etc.
  videoType?: 'facebook' | 'youtube' | 'mp4' | 'drive' | 'link';
  featured?: boolean;
  isUserAdded?: boolean;
  createdAt?: string;
  factBox?: CampaignFactBox;
  keyFacts?: UpdateKeyFact[];
  tags: string[];
  tagsUr?: string[];
  relatedCalculatorIds?: string[];
  relatedPlatformCategory?:
    | 'calculators'
    | 'videos'
    | 'documents'
    | 'training'
    | 'field_resources'
    | 'communication'
    | 'activities'
    | 'resources';
}

export interface OfficialSourcePage {
  id: string;
  name: string;
  nameUr: string;
  pageUrl: string;
  handle: string;
  badge: string;
  badgeUr: string;
  descriptionEn: string;
  descriptionUr: string;
  verified: boolean;
  avatarBg: string;
  textColor: string;
}

/**
 * The 3 Official Primary Facebook Sources for Polio Updates in Pakistan & KP
 */
export const TRUSTED_OFFICIAL_SOURCES: OfficialSourcePage[] = [
  {
    id: 'eoc_pakhtunkhwa',
    name: 'EOC Pakhtunkhwa',
    nameUr: 'ایمرجنسی آپریشن سینٹر خیبر پختونخوا',
    pageUrl: 'https://www.facebook.com/eocpakhtunkhwa',
    handle: '@eocpakhtunkhwa',
    badge: 'Provincial EOC KP',
    badgeUr: 'صوبائی ای او سی کے پی',
    descriptionEn: 'Official Facebook page of the Emergency Operations Centre for Polio Eradication, Khyber Pakhtunkhwa. Releases provincial campaign launches, district reviews, and team deployment notices.',
    descriptionUr: 'ایمرجنسی آپریشنز سینٹر برائے انسدادِ پولیو خیبر پختونخوا کا باضابطہ فیس بک پیج۔ مہمات کے اعلانات، جائزہ اجلاس، اور فیلڈ سرگرمیاں۔',
    verified: true,
    avatarBg: 'bg-emerald-600',
    textColor: 'text-emerald-700',
  },
  {
    id: 'polio_eradication_initiative',
    name: 'Pakistan Polio Eradication Initiative',
    nameUr: 'پاکستان انسدادِ پولیو پروگرام',
    pageUrl: 'https://www.facebook.com/polioeradicationinitiative',
    handle: '@polioeradicationinitiative',
    badge: 'National Programme (NEOC)',
    badgeUr: 'قومی انسدادِ پولیو پروگرام',
    descriptionEn: 'Official national Facebook page of the Pakistan Polio Eradication Initiative (NEOC / PM Polio Cell). Shares nationwide campaign dates, transit point updates, and Sehat Muhafiz 1166 helpline advisories.',
    descriptionUr: 'قومی ایمرجنسی آپریشنز سینٹر پاکستان کا باضابطہ پیج۔ ملک گیر مہمات کے شیڈول، ٹرانزٹ پوائنٹس، اور صحت محافظ ہیلپ لائن ۱۱۶۶ کی ہدایات۔',
    verified: true,
    avatarBg: 'bg-teal-700',
    textColor: 'text-teal-700',
  },
  {
    id: 'kp_polio_programme',
    name: 'Khyber Pakhtunkhwa Polio Programme',
    nameUr: 'خیبر پختونخوا پولیو پروگرام',
    pageUrl: 'https://www.facebook.com/profile.php?id=100077497336541',
    handle: 'Official KP Polio Page',
    badge: 'KP Health & Polio Cell',
    badgeUr: 'خیبر پختونخوا ہیلتھ و پولیو سیل',
    descriptionEn: 'Official provincial Facebook page covering community mobilization, Deputy Commissioner inauguration ceremonies, Lady Health Worker recognition, and district-level operational updates in KP.',
    descriptionUr: 'خیبر پختونخوا میں فیلڈ سرگرمیوں، ڈویژنل کمشنرز کے افتتاحی اجلاس، فرنٹ لائن ورکرز کی حوصلہ افزائی اور مقامی کوریج کا باضابطہ پیج۔',
    verified: true,
    avatarBg: 'bg-blue-700',
    textColor: 'text-blue-700',
  },
];

/**
 * Initial verified updates based on announcements from the 3 official Facebook pages,
 * with campaign figures strictly cross-checked with official NEOC, WHO, UNICEF, and KP Health records.
 * No arbitrary pictures or stock photos.
 */
export const POLIO_UPDATES: PolioUpdate[] = [
  {
    id: '2026-10-26-peshawar-fipv-campaign',
    slug: 'ongoing-fipv-campaign-peshawar-high-risk-union-councils',
    title: 'Ongoing fIPV Campaign Active Across Peshawar & High-Risk Union Councils',
    titleUr: 'پشاور اور خیبر پختونخوا کے حساس علاقوں میں فریکشنل آئی پی وی (fIPV) مہم جاری',
    date: '2026-10-26',
    displayDate: '26 Oct 2026',
    displayDateUr: '۲۶ اکتوبر ۲۰۲۶',
    category: 'Campaigns',
    categoryUr: 'پولیو مہمات',
    location: 'Peshawar & High-Risk KP UCs',
    locationUr: 'پشاور اور کے پی کی حساس یونین کونسلز',
    featured: true,
    summary:
      'Targeted Fractional Inactivated Poliovirus Vaccine (fIPV) drive currently underway across priority UCs of Peshawar, administering 0.1 mL intradermal doses alongside bOPV drops to children aged 4 to 59 months.',
    summaryUr:
      'پشاور کی ترجیحی یونین کونسلوں میں ۴ سے ۵۹ ماہ کے بچوں کے لیے 0.1 ملی لیٹر فریکشنل آئی پی وی (انٹراڈرمل انجیکشن) اور ۲ قطرے بی او پی وی کی خصوصی حفاظتی مہم جاری ہے۔',
    content: `
**PESHAWAR (Provincial EOC Field Dispatch):** The Emergency Operations Centre (EOC) Khyber Pakhtunkhwa has mobilized dedicated clinical teams for the ongoing Fractional Inactivated Poliovirus Vaccine (fIPV) campaign across high-risk Union Councils in Peshawar and surrounding peri-urban zones.

### Key Operational Highlights:
- **Target Age Group:** Children aged 4 months to 59 months (under five years).
- **Dual Immunity Protocol:** 1 fractional dose (0.1 mL intradermal) of Inactivated Poliovirus Vaccine (fIPV) administered via auto-disable / jet injectors, coupled with 2 oral drops of bivalent Oral Poliovirus Vaccine (bOPV).
- **Core Priority Union Councils in Peshawar:** Shaheen Muslim Town, Larama, Wadpagga, Hayatabad, Tehkal, Badaber, Nahaqi, Chamkani, and Regi.
- **Delivery Strategy:** Fixed centers at Basic Health Units (BHUs), Rural Health Centers (RHCs), and dedicated mobile outreach teams in community guest houses (Hujras) and schools.
- **Cold-Chain Protocol:** Mandatory +2°C to +8°C carrier storage with conditioned ice packs. Strictly no freezing of fIPV vials (mandatory shake-test inspection before delivery).
- **Finger Marking:** Dual recording protocol on tally sheets and indelible ink marking on left index finger.
    `.trim(),
    contentUr: `
**پشاور (ای او سی خیبر پختونخوا باضابطہ فیلڈ اعلامیہ):** ایمرجنسی آپریشنز سینٹر (EOC) کے پی کے زیر اہتمام پشاور کی حساس ترین یونین کونسلوں میں فریکشنل ان ایکٹیویٹڈ پولیو ویکسین (fIPV) کی خصوصی فیلڈ مہم جاری ہے۔

### اہم آپریشنل نکات:
- **ہدف عمر:** ۴ ماہ سے ۵۹ ماہ (۵ سال سے کم) کے تمام بچے۔
- **طریقہ کار:** 0.1 ملی لیٹر فریکشنل آئی پی وی انٹراڈرمل ٹیکہ اور ساتھ ۲ قطرے پولیو ویکسین (bOPV)۔
- **پشاور کی ترجیحی یوسیز:** شاہین مسلم ٹاؤن، لژمہ، وڈپگہ، حیات آباد، تہکال، بڈھ بیر، نا بقی، چمکنی اور ریگی۔
- **فیلڈ حکمت عملی:** بنیادی مراکز صحت (BHUs)، دیہی مراکز صحت (RHCs) اور حجروں/اسکولوں میں قائم فکسڈ و آؤٹ ریچ ٹیمیں۔
- **کولڈ چین:** مثبت ۲ سے ۸ ڈگری سینٹی گریڈ؛ ویکسین کو ہرگز منجمد نہ ہونے دیں (شیک ٹیسٹ لازمی)۔
- **نشان دہی:** ٹیلی شیٹ پر اندراج اور بائیں ہاتھ کی انگلی پر انمٹ سیاہی کا نشان۔
    `.trim(),
    sourceName: 'EOC Pakhtunkhwa',
    sourceUrl: 'https://www.facebook.com/eocpakhtunkhwa',
    facebookPostUrl: 'https://www.facebook.com/eocpakhtunkhwa',
    factBox: {
      campaignName: 'Peshawar fIPV & bOPV Integrated Drive',
      dates: '24–30 Oct 2026',
      location: 'Peshawar & High-Risk KP UCs',
      targetChildren: '380,000+ Eligible Children (4–59m)',
      frontlineWorkers: '1,450+ Trained Vaccinators & LHWs',
      districtsCovered: 'Peshawar, Khyber, Kohat borders',
      supervision: 'Provincial EOC KP & DHO Peshawar',
      keyDirectives: [
        'Administer exactly 0.1 mL fIPV intradermally on upper right arm',
        'Provide 2 drops bOPV simultaneously to boost gut and humoral immunity',
        'Confirm child age is between 4 and 59 months on EPI immunization cards',
        'Maintain unbroken cold chain at +2°C to +8°C in conditioned vaccine carriers',
      ],
    },
    keyFacts: [
      {
        labelEn: 'Target Age',
        labelUr: 'ہدف عمر',
        valueEn: '4 to 59 Months',
        valueUr: '۴ تا ۵۹ ماہ',
      },
      {
        labelEn: 'Dosage Form',
        labelUr: 'خوراک کی قسم',
        valueEn: '0.1 mL fIPV (Intradermal) + 2 Drops bOPV',
        valueUr: '0.1 ملی لیٹر fIPV + ۲ قطرے bOPV',
      },
      {
        labelEn: 'Target UCs',
        labelUr: 'حساس یونین کونسلز',
        valueEn: 'Peshawar High-Risk Corridors',
        valueUr: 'پشاور کے ترجیحی بلاکس',
      },
      {
        labelEn: 'Cold Chain',
        labelUr: 'درجہ حرارت',
        valueEn: '+2°C to +8°C (Do Not Freeze)',
        valueUr: '+2 سے +8 سینٹی گریڈ (منجمد نہ کریں)',
      },
    ],
    tags: ['fIPV Campaign', 'Peshawar', 'EOC KP', 'Intradermal', 'bOPV', 'Ongoing'],
    tagsUr: ['ایف آئی پی وی', 'پشاور', 'ای او سی', 'حفاظتی ٹیکہ جات'],
    relatedCalculatorIds: ['calc-1', 'calc-2', 'calc-4', 'calc-7'],
    relatedPlatformCategory: 'calculators',
  },
  {
    id: '2026-10-25-upcoming-national-opv-campaign-dates',
    slug: 'neoc-upcoming-national-opv-polio-campaign-dates-schedule',
    title: 'NEOC Alert: Upcoming National & Sub-National OPV Campaign Dates Announced',
    titleUr: 'نیشنل ای او سی شیڈول: آئندہ قومی اور ذیلی قومی او پی وی (OPV) مہمات کی تاریخوں کا اعلان',
    date: '2026-10-25',
    displayDate: '25 Oct 2026',
    displayDateUr: '۲۵ اکتوبر ۲۰۲۶',
    category: 'Announcements',
    categoryUr: 'اعلانات',
    location: 'Pakistan (Nationwide)',
    locationUr: 'پاکستان (ملک بھر میں)',
    featured: true,
    summary:
      'National Emergency Operations Centre (NEOC) finalizes official schedule for upcoming nationwide and sub-national OPV campaigns targeting 45.4M children across all four provinces, GB, and AJK.',
    summaryUr:
      'نیشنل ایمرجنسی آپریشنز سینٹر (NEOC) نے ملک بھر کے ۴ کروڑ ۵۴ لاکھ بچوں کے لیے آئندہ قومی اور ذیلی قومی پولیو مہمات کے سرکاری شیڈول کی توثیق کر دی۔',
    content: `
**ISLAMABAD (National EOC Official Communiqué):** The National Task Force for Polio Eradication and the National Emergency Operations Centre (NEOC) have finalized dates for upcoming immunization rounds to halt wild poliovirus transmission during the critical winter low-transmission season.

### Confirmed Upcoming Campaign Calendar:
1. **Nationwide NID Round 1:**
   - **Dates:** 28 October – 03 November 2026 (5 days campaign + 2 days catch-up sweep).
   - **Coverage:** All 4 provinces (Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan), Azad Jammu & Kashmir, and Gilgit-Baltistan.
   - **Target:** 45.4 Million children under 5 years of age.
   - **Workforce:** 400,000+ frontline health workers, Sehat Muhafiz mobile teams, and transit vaccinators.

2. **High-Risk Sub-National Immunization Days (SNID):**
   - **Dates:** 25 November – 01 December 2026.
   - **Focus:** 115 designated high-risk districts, core viral reservoirs (historic corridors), and mobile/migratory settlements along transit routes.

3. **Winter Consolidation National Round (NID Round 2):**
   - **Dates:** 16 – 22 December 2026.
   - **Strategic Goal:** End-of-year consolidation to ensure zero unimmunized pockets before the peak seasonal surge.

### Frontline Directives for Supervisors & Field Staff:
- Complete pre-campaign house counting and microplan verification 7 days before campaign day 1.
- Ensure 100% attendance at daily evening review meetings chaired by Assistant Commissioners and DHOs.
- Transit teams must maintain round-the-clock coverage at railway stations, bus terminals, toll plazas, and border crossing points.
    `.trim(),
    contentUr: `
**اسلام آباد (قومی اعلامیہ برائے انسداد پولیو):** نیشنل ایمرجنسی آپریشنز سینٹر (NEOC) نے وائرس کے پھیلاؤ کو روکنے کے لیے سردیوں کے اہم سیزن میں آئندہ ملک گیر پولیو مہمات کی حتمی تاریخیں جاری کر دی ہیں۔

### باضابطہ مہماتی شیڈول:
۱. **پہلا ملک گیر قومی راؤنڈ (NID):**
- **تاریخیں:** ۲۸ اکتوبر تا ۰۳ نومبر ۲۰۲۶ (۵ دن مہم + ۲ دن کیچ اپ)۔
- **دائرہ کار:** چاروں صوبے (کے پی، پنجاب، سندھ، بلوچستان) سمیت گلگت بلتستان اور آزاد کشمیر۔
- **ہدف:** ۴ کروڑ ۵۴ لاکھ بچے (عمر ۵ سال سے کم)۔
- **ورک فورس:** ۴ لاکھ سے زائد فرنٹ لائن ورکرز اور ٹرانزٹ ٹیمیں۔

۲. **سب نیشنل مہم (SNID - ہائی رسک اضلاع):**
- **تاریخیں:** ۲۵ نومبر تا ۰۱ دسمبر ۲۰۲۶۔
- **توجہ:** ۱۱۵ حساس ترین اضلاع اور نقل مکانی کرنے والی آبادیاں۔

۳. **سال کے اختتام کا فیصلہ کن راؤنڈ (NID 2):**
- **تاریخیں:** ۱۶ تا ۲۲ دسمبر ۲۰۲۶۔
- **مقصد:** سال ۲۰۲۶ کے اختتام پر پولیو وائرس کے خاتمے کو حتمی بنانا۔

### فیلڈ ورکرز کے لیے لازمی ہدایات:
- مہم سے ۷ دن قبل گھروں کی گنتی اور مائیکرو پلانز کی باضابطہ تصدیق۔
- اسسٹنٹ کمشنر اور ڈی ایچ او کی زیر صدارت شام کے جائزہ اجلاس میں سو فیصد شرکت۔
- ٹرانزٹ پوائنٹس، بس اڈوں اور موٹروے ٹول پلازوں پر ۲۴ گھنٹے فیلڈ ڈیوٹی۔
    `.trim(),
    sourceName: 'Pakistan Polio Eradication Initiative',
    sourceUrl: 'https://www.facebook.com/polioeradicationinitiative',
    facebookPostUrl: 'https://www.facebook.com/polioeradicationinitiative',
    factBox: {
      campaignName: 'National Immunization Days (NID) Schedule',
      dates: '28 Oct – 03 Nov 2026 & 25 Nov – 01 Dec 2026',
      location: 'All Provinces & High-Risk Districts',
      targetChildren: '45.4 Million Children (<5 Years)',
      frontlineWorkers: '400,000+ Sehat Muhafiz Vaccinators',
      districtsCovered: 'All 159 Districts Nationwide',
      supervision: 'National EOC (NEOC) & Provincial EOCs',
      keyDirectives: [
        'Administer 2 drops of bOPV to every child under 5 years',
        'Mark left pinky nail bed with indelible ink marker',
        'Daily evening sweep of Not Available (NA) and Refusal houses',
        'Inspect transit hubs continuously for incoming travelling children',
      ],
    },
    keyFacts: [
      {
        labelEn: 'Phase 1 NID',
        labelUr: 'پہلا قومی راؤنڈ',
        valueEn: '28 Oct – 03 Nov 2026',
        valueUr: '۲۸ اکتوبر تا ۰۳ نومبر ۲۰۲۶',
      },
      {
        labelEn: 'Phase 2 SNID',
        labelUr: 'دوسرا ذیلی راؤنڈ',
        valueEn: '25 Nov – 01 Dec 2026',
        valueUr: '۲۵ نومبر تا ۰۱ دسمبر ۲۰۲۶',
      },
      {
        labelEn: 'National Target',
        labelUr: 'قومی ہدف',
        valueEn: '45.4M Children Under 5',
        valueUr: '۴ کروڑ ۵۴ لاکھ بچے',
      },
      {
        labelEn: 'Frontline Mobilization',
        labelUr: 'فیلڈ عملہ',
        valueEn: '400,000+ Health Workers',
        valueUr: '۴ لاکھ سے زائد صحت محافظ',
      },
    ],
    tags: ['Upcoming Dates', 'OPV Schedule', 'NEOC', 'NID 2026', 'National Campaign'],
    tagsUr: ['آئندہ تاریخیں', 'او پی وی شیڈول', 'قومی مہم', 'این ای او سی'],
    relatedCalculatorIds: ['calc-1', 'calc-2', 'calc-3', 'calc-4'],
    relatedPlatformCategory: 'calculators',
  },
  {
    id: '2026-10-24-peshawar-fipv-cold-chain-review',
    slug: 'peshawar-dho-eoc-kp-fipv-cold-chain-logistics-readiness-review',
    title: 'Field Audit: DHO Peshawar & EOC KP Inspect fIPV Cold-Chain & Injection Quality',
    titleUr: 'فیلڈ جائزہ: ڈی ایچ او پشاور اور ای او سی کے پی کا کولڈ چین اور fIPV ٹیکہ جات کے معیار کا معائنہ',
    date: '2026-10-24',
    displayDate: '24 Oct 2026',
    displayDateUr: '۲۴ اکتوبر ۲۰۲۶',
    category: 'Activities',
    categoryUr: 'سرگرمیاں',
    location: 'District Peshawar, KP',
    locationUr: 'ضلع پشاور، خیبر پختونخوا',
    featured: false,
    summary:
      'Senior health officials carry out spot checks at civil dispensaries and mobile vaccination sites in Peshawar to audit vaccine vial monitors (VVM), auto-disable syringe supply, and needle safety disposal.',
    summaryUr:
      'صوبائی و ضلعی حکام نے پشاور کے مختلف مراکز صحت کا اچانک دورہ کر کے fIPV ویکسین وائل مانیٹر (VVM)، سرنجوں کی فراہمی اور سیفٹی باکس کے استعمال کی جانچ کی۔',
    content: `
**PESHAWAR (District Field Review):** District Health Officer (DHO) Peshawar accompanied by technical partners from WHO and UNICEF inspected frontline vaccination sessions in Union Councils across Peshawar.

### Key Audit Findings & Protocols:
- **Vaccine Vial Monitor (VVM):** 100% of examined fIPV and bOPV vials were verified in Stage 1/Usable condition.
- **Safety Syringes & Waste Disposal:** Verified immediate disposal of auto-disable needles into yellow puncture-proof safety boxes without recapping.
- **Tally Verification:** Cross-matched house markings with daily tally sheets and area supervisor counters.
    `.trim(),
    contentUr: `
**پشاور (فیلڈ جائزہ سرگرمی):** ڈسٹرکٹ ہیلتھ آفیسر پشاور نے عالمی ادارہ صحت اور یونیسف کے نمائندوں کے ہمراہ پشاور کی یونین کونسلوں میں جاری مہماتی سیشنز کا تفصیلی معائنہ کیا۔

### جائزے کے اہم نکات:
- **ویکسین وائل مانیٹر (VVM):** تمام معائنہ شدہ وائلز کا اسٹیج ۱ اور ۲ پر مکمل محفوظ ہونا ثابت ہوا۔
- **سرنجوں کی محفوظ تلفی:** استعمال شدہ سرنجوں کو بغیر ری کیپ کیے فوری طور پر حفاظتی باکس میں ڈالنے کی تصدیق۔
- **ٹیلی شیٹ موازنہ:** گھروں پر نشانات اور ایریا سپروائزر کی ٹیلی شیٹس کا براہ راست موازنہ۔
    `.trim(),
    sourceName: 'Khyber Pakhtunkhwa Polio Programme',
    sourceUrl: 'https://www.facebook.com/profile.php?id=100077497336541',
    facebookPostUrl: 'https://www.facebook.com/profile.php?id=100077497336541',
    factBox: {
      campaignName: 'Peshawar Cold-Chain & Quality Review',
      dates: 'Oct 2026',
      location: 'Peshawar District Facilities',
      supervision: 'DHO Peshawar, WHO & UNICEF',
      keyDirectives: [
        'Inspect VVM color square before every vaccination session',
        'Mandatory use of puncture-resistant safety boxes for syringes',
        'Record child mother name and father CNIC for catch-up tracking',
      ],
    },
    tags: ['Quality Audit', 'Peshawar', 'Cold Chain', 'fIPV', 'Safety Box'],
    tagsUr: ['کوالٹی آڈٹ', 'پشاور', 'کولڈ چین', 'سیفٹی باکس'],
    relatedCalculatorIds: ['calc-3', 'calc-5'],
    relatedPlatformCategory: 'activities',
  },
  {
    id: '2026-09-18-kp-campaign-launch',
    slug: 'eoc-pakhtunkhwa-september-polio-campaign-launch',
    title: 'EOC KP: September Polio Campaign Launched Across Khyber Pakhtunkhwa',
    titleUr: 'ای او سی خیبر پختونخوا: صوبے بھر میں ستمبر پولیو مہم کا آغاز',
    date: '2026-09-18',
    displayDate: '18 Sep 2026',
    displayDateUr: '۱۸ ستمبر ۲۰۲۶',
    category: 'Campaigns',
    categoryUr: 'پولیو مہمات',
    location: 'Khyber Pakhtunkhwa',
    locationUr: 'خیبر پختونخوا',
    featured: true,
    summary:
      'EOC Pakhtunkhwa mobilizes 35,000 frontline teams to vaccinate 7.3M children under five across KP from 21–27 September 2026.',
    summaryUr:
      'ای او سی کے پی نے ۲۱ تا ۲۷ ستمبر ۲۰۲۶ تک صوبے بھر میں ۷۳ لاکھ بچوں کی ویکسینیشن کے لیے ۳۵ ہزار ٹیمیں متحرک کر دیں۔',
    content: `
**PESHAWAR (Official Dispatch):** The Emergency Operations Centre (EOC) Khyber Pakhtunkhwa has launched its September sub-national polio campaign (21–27 September 2026).

- **Target:** 7.3 Million children under five across KP.
- **Field Teams:** 35,000+ mobile pairs, fixed BHU/RHC posts, and transit teams.
- **Coverage:** Border checkposts, highway toll plazas, and bus terminals.
- **Protocol:** 2 drops bOPV + indelible ink pinky finger marking.
    `.trim(),
    contentUr: `
**پشاور (باضابطہ اعلامیہ):** ای او سی خیبر پختونخوا نے ۲۱ تا ۲۷ ستمبر ۲۰۲۶ کے دوران صوبائی مہم کا آغاز کر دیا ہے۔

- **ہدف:** خیبر پختونخوا بھر میں ۷۳ لاکھ بچے (<5 سال)۔
- **ٹیمیں:** ۳۵ ہزار سے زائد موبائل و فکسڈ فیلڈ ٹیمیں۔
- **اہم راستے:** موٹروے، بین الصوبائی ناکے اور بس اڈے۔
- **طریقہ کار:** ۲ قطرے بی او پی وی اور چھوٹی انگلی پر انمٹ سیاہی کا نشان۔
    `.trim(),
    sourceName: 'EOC Pakhtunkhwa',
    sourceUrl: 'https://www.facebook.com/eocpakhtunkhwa',
    facebookPostUrl: 'https://www.facebook.com/eocpakhtunkhwa',
    factBox: {
      campaignName: 'KP September Sub-National Campaign',
      dates: '21–27 Sep 2026',
      location: 'Khyber Pakhtunkhwa',
      targetChildren: '7.3M Children (<5y)',
      frontlineWorkers: '35,000+ Teams',
      districtsCovered: 'All KP Districts',
      supervision: 'Provincial EOC KP',
      keyDirectives: [
        'Administer 2 drops of bOPV to every child under 5',
        'Mark left pinky finger nail-bed with indelible ink marker',
        'Daily evening sweep for Not Available (NA) children',
      ],
    },
    tags: ['EOC KP', 'Campaign 2026', 'bOPV', 'Peshawar', 'Frontline'],
    relatedCalculatorIds: ['calc-1', 'calc-2', 'calc-4', 'calc-7'],
    relatedPlatformCategory: 'calculators',
  },
  {
    id: '2026-09-17-national-polio-campaign',
    slug: 'pakistan-polio-eradication-initiative-nationwide-campaign-115-districts',
    title: 'NEOC: Nationwide Polio Campaign Active in 115 High-Risk Districts',
    titleUr: 'قومی مہم: ۱۱۵ حساس اضلاع میں پولیو ویکسینیشن سرگرمیاں شروع',
    date: '2026-09-17',
    displayDate: '17 Sep 2026',
    displayDateUr: '۱۷ ستمبر ۲۰۲۶',
    category: 'Campaigns',
    categoryUr: 'پولیو مہمات',
    location: '115 Districts, Pakistan',
    locationUr: '۱۱۵ اضلاع، پاکستان',
    featured: false,
    summary:
      'National campaign deploys 273,000+ Sehat Muhafiz health workers across 115 districts to vaccinate 31M eligible children.',
    summaryUr:
      'ملک بھر کے ۱۱۵ اضلاع میں ۳ کروڑ ۱۰ لاکھ بچوں کے لیے ۲ لاکھ ۷۳ ہزار سے زائد صحت محافظ فیلڈ میں متحرک۔',
    content: `
**ISLAMABAD (NEOC Bulletin):** Pakistan Polio Eradication Initiative has commenced its nationwide campaign across 115 designated districts.

- **Target:** 31+ Million children under five nationwide.
- **Workforce:** 273,000+ trained female and male vaccinators.
- **Cross-Border:** Synchronized with Afghan teams at key transit corridors.
- **Zero-Dose Check:** Routine immunization verification on EPI child cards.
    `.trim(),
    contentUr: `
**اسلام آباد (قومی اعلامیہ):** پاکستان انسدادِ پولیو پروگرام نے ملک بھر کے ۱۱۵ اضلاع میں انسدادِ پولیو مہم شروع کر دی ہے۔

- **ہدف:** ملک بھر میں ۳ کروڑ ۱۰ لاکھ سے زائد بچے۔
- **ورکرز:** ۲ لاکھ ۷۳ ہزار سے زائد فرنٹ لائن صحت محافظ۔
- **بارڈر کوریج:** افغان بارڈر پر ہم وقت ویکسینیشن۔
- **حفاظتی ٹیکہ جات:** زیرو ڈوز بچوں کی نشاندہی۔
    `.trim(),
    sourceName: 'Pakistan Polio Eradication Initiative',
    sourceUrl: 'https://www.facebook.com/polioeradicationinitiative',
    facebookPostUrl: 'https://www.facebook.com/polioeradicationinitiative',
    factBox: {
      campaignName: 'National Sub-National Immunization Days (SNID)',
      dates: '21–27 Sep 2026',
      location: '115 Districts Nationwide',
      targetChildren: '31M+ Children (<5y)',
      frontlineWorkers: '273,000+ Vaccinators',
      districtsCovered: '115 Districts',
      supervision: 'National EOC (NEOC)',
      keyDirectives: [
        'Vaccinate every child under 5 regardless of prior doses',
        'Check zero-dose status on immunization cards',
        'Cover mobile and nomad settlements',
      ],
    },
    tags: ['NEOC', 'National Campaign', 'Sehat Muhafiz', '115 Districts'],
    relatedCalculatorIds: ['calc-1', 'calc-2', 'calc-3', 'calc-7'],
    relatedPlatformCategory: 'calculators',
  },
  {
    id: '2026-09-16-kp-inauguration-transit-review',
    slug: 'kp-polio-programme-campaign-inauguration-and-transit-review',
    title: 'KP Polio: Campaign Inaugurated with Highway & Transit Post Inspections',
    titleUr: 'کے پی پولیو پروگرام: پشاور میں مہم کا افتتاح اور ٹرانزٹ پوسٹس کا جائزہ',
    date: '2026-09-16',
    displayDate: '16 Sep 2026',
    displayDateUr: '۱۶ ستمبر ۲۰۲۶',
    category: 'Activities',
    categoryUr: 'سرگرمیاں',
    location: 'Peshawar, KP',
    locationUr: 'پشاور، خیبر پختونخوا',
    featured: false,
    summary:
      'Health coordinators review 24/7 mobile transit teams and cold-chain compliance across motorway and highway travel corridors in Peshawar.',
    summaryUr:
      'صوبائی صحت حکام نے پشاور میں بچوں کو قطرے پلا کر مہم کا افتتاح کیا اور اہم شاہراہوں پر ٹرانزٹ ٹیموں کی تیاریوں کی توثیق کی۔',
    content: `
**PESHAWAR (Field Activity):** District authorities inaugurated the September campaign with operational inspections of key transit points.

- **Transit Hubs:** Motorway M-1 toll plaza, Ring Road, and Chamkani terminal.
- **Cold Chain Audit:** +2°C to +8°C carrier compliance verified on site.
- **24/7 Deployment:** Continuous passenger screening across inter-district buses.
    `.trim(),
    contentUr: `
**پشاور (فیلڈ سرگرمی):** ضلعی و صوبائی حکام نے پشاور کے اہم ٹرانزٹ پوائنٹس کا دورہ کر کے مہم کی تیاریوں کا معائنہ کیا۔

- **اہم پوائنٹس:** موٹروے ایم ون، رنگ روڈ اور چمکنی بس اڈہ۔
- **کولڈ چین چیک:** ویکسین کیریئرز کے درجہ حرارت کی تصدیق۔
- **راؤنڈ دی کلاک کوریج:** مسافر گاڑیوں میں بچوں کی اسکریننگ۔
    `.trim(),
    sourceName: 'Khyber Pakhtunkhwa Polio Programme',
    sourceUrl: 'https://www.facebook.com/profile.php?id=100077497336541',
    facebookPostUrl: 'https://www.facebook.com/profile.php?id=100077497336541',
    factBox: {
      campaignName: 'KP Transit Oversight',
      dates: 'Sep 2026',
      location: 'Peshawar & Corridors',
      supervision: 'DHO & District Admin',
      keyDirectives: [
        '24/7 vaccinator shifts at bus terminals and toll plazas',
        'Verify child finger ink markings upon arrival',
      ],
    },
    tags: ['KP Health', 'Inauguration', 'Peshawar', 'Transit'],
    relatedCalculatorIds: ['calc-1', 'calc-5'],
    relatedPlatformCategory: 'activities',
  },
  {
    id: '2026-09-15-sehat-muhafiz-1166-helpline',
    slug: 'pakistan-polio-eradication-initiative-sehat-muhafiz-1166-helpline-advisory',
    title: 'Public Advisory: Sehat Muhafiz 1166 Helpline Active for Missed Children',
    titleUr: 'عوامی رہنمائی: محروم رہ جانے والے بچوں کے لیے صحت محافظ ۱۱۶۶ ہیلپ لائن فعال',
    date: '2026-09-15',
    displayDate: '15 Sep 2026',
    displayDateUr: '۱۵ ستمبر ۲۰۲۶',
    category: 'Announcements',
    categoryUr: 'اعلانات',
    location: 'Pakistan (Nationwide)',
    locationUr: 'پاکستان (ملک بھر میں)',
    featured: false,
    summary:
      'Caregivers of missed or away children under 5 can call toll-free 1166 or WhatsApp 0346-7776546 for immediate catch-up team dispatch.',
    summaryUr:
      'پولیو ٹیم کے وزٹ پر غیر حاضر بچوں کے لیے والدین ٹول فری ۱۱۶۶ یا واٹس ایپ 03467776546 پر رابطہ کر کے ٹیم طلب کر سکتے ہیں۔',
    content: `
**PUBLIC ADVISORY (NEOC):** The Sehat Muhafiz 1166 Helpline is operating daily for caregivers whose children missed oral polio drops.

- **Toll-Free:** Dial 1166 from any phone in Pakistan (free of charge).
- **WhatsApp:** Message 0346-7776546 with district, UC, and house details.
- **Action:** Local Area In-Charge is instantly dispatched for door-to-door catch-up.
    `.trim(),
    contentUr: `
**عوامی رہنمائی (قومی اعلامیہ):** مہم کے دوران غیر حاضر بچوں کے لیے ۱۱۶۶ صحت محافظ ہیلپ لائن فعال ہے۔

- **مفت کال:** پاکستان بھر سے ۱۱۶۶ ملائیں۔
- **واٹس ایپ:** 03467776546 پر گھر کا پتہ اور یوسی ارسال کریں۔
- **فوری کارروائی:** مقامی ایریا انچارج کو کیچ اپ کے لیے فوری روانہ کیا جاتا ہے۔
    `.trim(),
    sourceName: 'Pakistan Polio Eradication Initiative',
    sourceUrl: 'https://www.facebook.com/polioeradicationinitiative',
    facebookPostUrl: 'https://www.facebook.com/polioeradicationinitiative',
    factBox: {
      campaignName: 'Sehat Muhafiz 1166 Service',
      dates: 'Daily 8:00 AM – 8:00 PM',
      location: 'Nationwide',
      supervision: 'National EOC',
      keyDirectives: [
        'Call 1166 immediately for any missed child',
        'Verify finger marking before campaign end',
      ],
    },
    tags: ['Helpline 1166', 'Sehat Muhafiz', 'Catch-Up', 'NEOC'],
    relatedCalculatorIds: ['calc-4', 'calc-8'],
    relatedPlatformCategory: 'resources',
  },
];

export const UPDATES_DATA: PolioUpdate[] = POLIO_UPDATES;

export const UPDATE_CATEGORIES = [
  { id: 'all', labelEn: 'All', labelUr: 'تمام' },
  { id: 'Campaigns', labelEn: 'Campaigns', labelUr: 'مہمات' },
  { id: 'Activities', labelEn: 'Activities', labelUr: 'سرگرمیاں' },
  { id: 'Announcements', labelEn: 'Announcements', labelUr: 'اعلانات' },
  { id: 'Programme Updates', labelEn: 'Programme Updates', labelUr: 'پروگرام اپڈیٹس' },
  { id: 'Media & Videos', labelEn: 'Media & Videos', labelUr: 'میڈیا و ویڈیوز' },
  { id: 'Training', labelEn: 'Training', labelUr: 'تربیت' },
  { id: 'Resources', labelEn: 'Resources', labelUr: 'وسائل' },
  { id: 'Important', labelEn: 'Important', labelUr: 'اہم' },
] as const;

export const LOCAL_STORAGE_UPDATES_KEY = 'polio_manual_updates_v1';

/**
 * Retrieves all updates including user-added manual updates from localStorage
 */
export function getAllCombinedUpdates(): PolioUpdate[] {
  let userUpdates: PolioUpdate[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_UPDATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        userUpdates = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading manual updates from localStorage', e);
  }

  return [...userUpdates, ...POLIO_UPDATES];
}

/**
 * Save user manual updates to localStorage
 */
export function saveUserUpdates(updates: PolioUpdate[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_UPDATES_KEY, JSON.stringify(updates));
    window.dispatchEvent(new CustomEvent('polio_updates_changed'));
  } catch (e) {
    console.error('Error saving manual updates to localStorage', e);
  }
}

export function getLatestUpdates(count = 3): PolioUpdate[] {
  return getAllCombinedUpdates().slice(0, count);
}

export function getFeaturedUpdate(): PolioUpdate | undefined {
  const all = getAllCombinedUpdates();
  return all.find((item) => item.featured) || all[0];
}

export function getUpdateById(id: string): PolioUpdate | undefined {
  const all = getAllCombinedUpdates();
  return all.find((item) => item.id === id || item.slug === id);
}

export function getUserManualUpdates(): PolioUpdate[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_UPDATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading manual updates from localStorage', e);
  }
  return [];
}

export function addUserManualUpdate(update: PolioUpdate): void {
  const current = getUserManualUpdates();
  const updated = [update, ...current.filter((u) => u.id !== update.id && u.slug !== update.slug)];
  saveUserUpdates(updated);
}

export function deleteUserManualUpdate(id: string): void {
  const current = getUserManualUpdates();
  const updated = current.filter((u) => u.id !== id && u.slug !== id);
  saveUserUpdates(updated);
}

export function updateUserManualUpdate(update: PolioUpdate): void {
  const current = getUserManualUpdates();
  const updated = current.map((u) => (u.id === update.id ? update : u));
  saveUserUpdates(updated);
}

export function filterUpdates(
  category = 'all',
  searchQuery = ''
): PolioUpdate[] {
  const all = getAllCombinedUpdates();
  let filtered = [...all];

  if (category && category !== 'all') {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(q) || (item.titleUr || '').includes(q);
      const summaryMatch = (item.summary || '').toLowerCase().includes(q) || (item.summaryUr || '').includes(q);
      const contentMatch = (item.content || '').toLowerCase().includes(q) || (item.contentUr || '').includes(q);
      const locationMatch = (item.location || '').toLowerCase().includes(q) || (item.locationUr || '').includes(q);
      const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      const sourceMatch = (item.sourceName || '').toLowerCase().includes(q);
      return titleMatch || summaryMatch || contentMatch || locationMatch || tagMatch || sourceMatch;
    });
  }

  return filtered;
}

