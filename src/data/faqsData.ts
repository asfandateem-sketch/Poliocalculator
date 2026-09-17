export interface FaqItem {
  id: string;
  category: 'sbc_strategy' | 'important_medical' | 'refusals_rumors' | 'field_operations';
  badgeEn: string;
  badgeUr: string;
  questionEn: string;
  questionUr: string;
  answerEn: string;
  answerUr: string;
  keyPointsEn: string[];
  keyPointsUr: string[];
}

export const FAQ_CATEGORIES = [
  { id: 'all', labelEn: 'All Questions', labelUr: 'تمام سوالات' },
  { id: 'sbc_strategy', labelEn: 'SBC Strategy', labelUr: 'سوشل اینڈ بیہیویئر چینج' },
  { id: 'important_medical', labelEn: 'Important Medical FAQs', labelUr: 'اہم طبی و ویکسین سوالات' },
  { id: 'refusals_rumors', labelEn: 'Refusals & Rumors', labelUr: 'انکاری کیسز و افواہوں کا ازالہ' },
  { id: 'field_operations', labelEn: 'Field Operations & SOPs', labelUr: 'فیلڈ آپریشنز و مائیکرو پلاننگ' },
] as const;

export const COMPREHENSIVE_FAQS: FaqItem[] = [
  // -------------------------------------------------------------
  // SBC STRATEGY (Social and Behavior Change)
  // -------------------------------------------------------------
  {
    id: 'sbc-1',
    category: 'sbc_strategy',
    badgeEn: 'SBC Core Strategy',
    badgeUr: 'بنیادی ایس بی سی حکمت عملی',
    questionEn: 'What is the Social and Behavior Change (SBC) Strategy in the Pakistan Polio Eradication Programme?',
    questionUr: 'پاکستان پولیو پروگرام میں سوشل اینڈ بیہیویئر چینج (SBC) حکمت عملی کیا ہے؟',
    answerEn: 'The SBC (Social and Behavior Change) Strategy is a systematic, evidence-based approach that applies behavioral science, anthropological insights, and targeted interpersonal communication (IPC) to transform parental perceptions, resolve vaccine hesitancy, and build sustained community trust. Rather than simply delivering vaccine vials, SBC focuses on demand generation, eliminating social barriers, and turning vaccine acceptance into an active community norm.',
    answerUr: 'سوشل اینڈ بیہیویئر چینج (SBC) حکمت عملی شواہد پر مبنی ایک جامع طریقہ کار ہے جو سماجی علوم اور موثر رابطے کے ذریعے والدین کے رویوں میں مثبت تبدیلی لاتا ہے۔ اس کا مقصد محض ویکسین فراہم کرنا نہیں بلکہ عوامی شعور کو بیدار کر کے پولیو قطروں کو کمیونٹی کی بنیادی ضرورت اور اجتماعی ذمہ داری بنانا ہے۔',
    keyPointsEn: [
      'Focuses on behavioral drivers rather than just information dissemination',
      'Transforms passive hesitancy into proactive demand for immunization',
      'Integrates interpersonal communication (IPC) with trusted local leaders',
      'Customized for high-risk demographic corridors and ethnic groups',
    ],
    keyPointsUr: [
      'محض معلومات دینے کے بجائے والدین کے رویے اور سوچ میں مثبت تبدیلی لانا',
      'ہچکچاہٹ کا شکار والدین کو ویکسین کے حامیوں میں تبدیل کرنا',
      'مقامی معتبر شخصیات اور انٹرپرسنل کمیونیکیشن (IPC) کا استعمال',
      'مختلف لسانی اور ثقافتی پس منظر کے مطابق مخصوص حکمت عملی',
    ],
  },
  {
    id: 'sbc-2',
    category: 'sbc_strategy',
    badgeEn: 'SBC 4 Pillars',
    badgeUr: 'ایس بی سی کے 4 ستون',
    questionEn: 'What are the 4 core pillars of the Polio SBC communication architecture?',
    questionUr: 'پولیو ایس بی سی کمیونیکیشن آرکیٹیکچر کے 4 بنیادی ستون کون سے ہیں؟',
    answerEn: 'The Polio SBC framework is structured across four interlinked pillars: (1) Door-to-Door Interpersonal Communication (IPC) by female frontline workers (CBVs/COMNet) who build intimate household rapport; (2) Community & Religious Influencer Advocacy involving Pesh Imams, tribal elders (Maliks/Waderas), and local councils; (3) Mass & Digital Media Alignment with localized radio, mosque announcements, and WhatsApp crisis rebuttal; and (4) Responsive Social Data Tracking through continuous perception surveys and refusal profile analytics.',
    answerUr: 'پولیو ایس بی سی فریم ورک چار باہم مربوط ستونوں پر مشتمل ہے: (1) گھر گھر انٹر پرسنل کمیونیکیشن (IPC) جو خواتین ورکرز (CBVs) کے ذریعے گھریلو سطح پر اعتماد بناتا ہے؛ (2) بااثر مذہبی و قبائلی شخصیات (ائمہ مساجد، ملکان، عمائدین) کا تعاون؛ (3) مقامی میڈیا، مساجد کے اعلانات اور واٹس ایپ مہمات؛ (4) سوشل ڈیٹا اور انکاری رجحانات کی باقاعدہ جانچ اور فوری تدارک۔',
    keyPointsEn: [
      'Pillar 1: Doorstep Interpersonal Communication (IPC) by Female Mobilizers',
      'Pillar 2: Trusted Religious Scholars & Community Eldership mobilization',
      'Pillar 3: Localized Mosque, Radio, & Social Media messaging',
      'Pillar 4: Real-time Social Data Tracking & Hesitancy Mapping',
    ],
    keyPointsUr: [
      'ستون 1: خواتین فیلڈ ورکرز کے ذریعے گھر گھر براہ راست گفتگو (IPC)',
      'ستون 2: ائمہ مساجد اور معززین علاقہ کی عملی شمولیت',
      'ستون 3: مقامی مساجد سے اعلانات اور ڈیجیٹل آگاہی مواد',
      'ستون 4: انکاری اسباب کا مسلسل تجزیہ اور بروقت رہنمائی',
    ],
  },
  {
    id: 'sbc-3',
    category: 'sbc_strategy',
    badgeEn: 'Campaign Fatigue',
    badgeUr: 'مہماتی تھکاوٹ کا حل',
    questionEn: 'How should frontline workers handle parental campaign fatigue ("Why so many frequent rounds?")?',
    questionUr: 'فیلڈ ورکرز بار بار کی مہمات سے اکتائے ہوئے والدین (Campaign Fatigue) کو کیسے قائل کریں؟',
    answerEn: 'Frequent campaign rounds often induce parental skepticism. Frontline workers should use the "Shield & Environmental Exposure" SBC script: Acknowledge the parent\'s frustration with warmth; explain that unlike measles, the polio virus lurks in environmental sewage and open drains, posing a continuous threat. Clarify that every oral drop adds an extra protective layer to the child\'s intestines. Praise parents for previous doses and explain that until environmental sewage tests 100% negative, frequent collective doses are the only barrier keeping their child safe from lifelong paralysis.',
    answerUr: 'بار بار مہمات پر والدین کے تحفظات دور کرنے کے لیے کبھی بحث نہ کریں۔ نرمی سے بات سنیں اور سمجھائیں کہ پولیو وائرس گندے پانی اور سیوریج میں موجود رہتا ہے۔ خوراک کا مقصد بچے کے پیٹ اور آنتوں میں حفاظتی دیوار کو مضبوط کرنا ہے۔ جب تک ماحول سے وائرس مکمل ختم نہیں ہوتا، ہر مہم میں قطرے پلانا ہی بچے کو عمر بھر کی معذوری سے بچا سکتا ہے۔',
    keyPointsEn: [
      'Validate parent\'s dedication first: "You have taken great care of your child"',
      'Explain the "Environmental Reservoir" concept: Virus in sewage requires constant immunity shield',
      'Reinforce that 2 drops do not harm; they replenish diminishing gut antibodies',
      'Frame immunization as a parental right and neighborhood shield',
    ],
    keyPointsUr: [
      'سب سے پہلے والدین کی تعریف کریں: "آپ اپنے بچے کے بہترین خیرخواہ ہیں"',
      'سیوریج میں وائرس کی موجودگی اور آنتوں کی قوت مدافعت کی وضاحت کریں',
      'واضح کریں کہ بار بار قطرے پلانے سے کوئی نقصان نہیں ہوتا بلکہ تحفظ بڑھتا ہے',
      'ویکسین کو بچے کا حق اور بیماری کے خلاف مضبوط ڈھال قرار دیں',
    ],
  },
  {
    id: 'sbc-4',
    category: 'sbc_strategy',
    badgeEn: 'Gender & Access',
    badgeUr: 'خواتین ورکرز کا کلیدی کردار',
    questionEn: 'Why are female Community-Based Volunteers (CBVs) central to the SBC strategy?',
    questionUr: 'پولیو کی SBC حکمت عملی میں خواتین کمیونٹی رضاکاروں (CBVs) کی کیا خاص اہمیت ہے؟',
    answerEn: 'Female Community-Based Volunteers (CBVs) and COMNet mobilizers are the backbone of the eradication drive because cultural norms in high-risk zones (such as South KP, Pashtun pockets in Karachi, and Balochistan) grant female workers exclusive access into private domestic courtyards (Zenana). They communicate directly with mothers and grandmothers who are the daily primary caregivers, observing sick or newborn children who might otherwise be hidden from male transit teams.',
    answerUr: 'خواتین کمیونٹی ورکرز (CBVs) کی بنیادی اہمیت یہ ہے کہ روایتی معاشرے میں انہیں گھر کی خواتین (ماؤں اور نانی/دادی) تک براہ راست رسائی حاصل ہوتی ہے۔ وہ گھریلو پردے کے تقدس کو پامال کیے بغیر ماؤں کے شکوک و شبہات دور کرتی ہیں، نوزائیدہ بچوں کا پتہ لگاتی ہیں اور انکاری ماؤں کو قائل کرتی ہیں۔',
    keyPointsEn: [
      'Unrestricted cultural access to female household decision-makers',
      'Early detection of hidden newborns and sick under-5 children',
      'Deep community familiarity and long-term interpersonal trust',
      'Effective resolution of female-specific anxieties regarding fertility rumors',
    ],
    keyPointsUr: [
      'گھر کے اندر تک باعزت رسائی اور ماؤں سے براہ راست مکالمہ',
      'چھپائے گئے نوزائیدہ اور بیمار بچوں کی بروقت نشاندہی',
      'علاقائی اور خاندانی رشتوں کی بنیاد پر دیرپا اعتماد',
      'اولاد اور تولیدی صحت سے متعلق بے بنیاد افواہوں کا موثر ازالہ',
    ],
  },
  {
    id: 'sbc-5',
    category: 'sbc_strategy',
    badgeEn: 'Mobile Populations',
    badgeUr: 'متحرک آبادیوں کی حکمت عملی',
    questionEn: 'What is the SBC communication approach for high-risk mobile and transit populations?',
    questionUr: 'نقل مکانی کرنے والے قبائل، اینٹوں کے بھٹوں اور مسافر خاندانوں کے لیے کیا طریقہ کار ہے؟',
    answerEn: 'Mobile, nomadic, and migrant populations (such as seasonal brick kiln workers, Afghan transit families, and pastoralists) move across high-risk corridors where wild poliovirus spreads silently. The SBC approach deploys Pashto/Urdu bilingual social mobilizers at bus terminals, railway stations, toll plazas, and border crossing Permanent Transit Posts (PTPs). It engages tribal Maliks, utilizes audio loudspeaker announcements in regional dialects, and provides transit finger-marking slips so families are welcomed without repetitive harassment.',
    answerUr: 'متحرک اور موسمی مزدور خاندان (اینٹوں کے بھٹے، کچی آبادیاں، افغان مہاجرین) پولیو پھیلاؤ کے لحاظ سے سب سے زیادہ حساس ہیں۔ ان کے لیے بس اڈوں، ریلوے اسٹیشنوں اور ٹول پلازوں پر پشتو اور اردو بولنے والے ورکرز تعینات کیے جاتے ہیں، قبیلے کے سربراہان سے رابطہ کیا جاتا ہے اور انگلی پر نشان کے ذریعے بار بار روکنے کی زحمت سے بچایا جاتا ہے۔',
    keyPointsEn: [
      'Transit teams deployed at bus stands, railway terminals, and inter-provincial borders',
      'Communication delivered in mother tongues (Pashto, Balochi, Sindhi, Saraiki)',
      'Engagement with brick kiln owners and informal settlement elders',
      'Finger marking verified immediately to prevent transit friction',
    ],
    keyPointsUr: [
      'بس اڈوں، ریلوے اسٹیشنز اور بارڈر کراسنگز پر مستقل ٹرانزٹ ٹیمیں',
      'مادری زبانوں (پشتو، بلوچی، سندھی، سرائیکی) میں خوش اخلاقی سے گفتگو',
      'بھٹہ مالکان اور جھگیوں کے بااثر افراد کا پیشگی تعاون',
      'انگلی پر سیاہی کا نشان دیکھ کر فوری سہولت فراہم کرنا',
    ],
  },

  // -------------------------------------------------------------
  // IMPORTANT MEDICAL & VACCINE FAQS
  // -------------------------------------------------------------
  {
    id: 'med-1',
    category: 'important_medical',
    badgeEn: 'Multiple Doses',
    badgeUr: 'متعدد خوراکوں کی ضرورت',
    questionEn: 'Why do children need multiple repeated doses of the Oral Polio Vaccine (bOPV)?',
    questionUr: 'بچوں کو ہر مہم میں بار بار پولیو کے قطرے پلانے کی ضرورت کیوں پیش آتی ہے؟',
    answerEn: 'Unlike injectable vaccines (which stimulate blood antibodies through one or two injections), Oral Polio Vaccine (OPV) must generate mucosal immunity inside the child’s gastrointestinal tract. In tropical climates like Pakistan, common gut parasites, enteroviruses, and childhood diarrhea compete with the vaccine strain, meaning a single dose might only immunize 20% to 30% of children. Every additional dose multiplies the level of intestinal defense until the child reaches 100% immune protection against paralysis.',
    answerUr: 'انجیکشن والی ویکسینز کے برعکس، پولیو کے قطرے بچے کی آنتوں میں مقامی مدافعت (Mucosal Immunity) پیدا کرتے ہیں۔ پاکستان جیسے گرم علاقوں میں بچوں کے پیٹ کے امراض اور اسہال کی وجہ سے ایک خوراک سے صرف 20 سے 30 فیصد بچوں میں مدافعت بنتی ہے۔ چنانچہ بار بار قطرے پلانے سے ہر بچے کے پیٹ میں حفاظتی دیوار سو فیصد مکمل اور ناقابل تسخیر ہو جاتی ہے۔',
    keyPointsEn: [
      'Gut mucosal immunity requires repeated viral replication to reach full efficacy',
      'Local tropical diarrheal conditions reduce individual dose absorption',
      'Multiple doses collectively boost population herd immunity',
      'bOPV cannot overdose a child; excess doses are naturally neutralized with zero toxicity',
    ],
    keyPointsUr: [
      'آنتوں کی مکمل حفاظت کے لیے متعدد خوراکوں کی ضرورت ہوتی ہے',
      'موسمی اسہال اور پیٹ کے انفیکشنز کی وجہ سے اضافی خوراکیں ضروری ہیں',
      'بار بار قطرے پلانے سے پورے علاقے کے بچے اجتماعی طور پر محفوظ ہو جاتے ہیں',
      'پولیو قطروں کی کوئی "اوور ڈوز" نہیں ہوتی؛ زائد قطرے قدرتی طور پر خارج ہو جاتے ہیں',
    ],
  },
  {
    id: 'med-2',
    category: 'important_medical',
    badgeEn: 'Halal Certification',
    badgeUr: 'شرعی و حلال حیثیت',
    questionEn: 'Is the Oral Polio Vaccine Halal, and has it been approved by Islamic scholars?',
    questionUr: 'کیا پولیو ویکسین حلال ہے اور کیا جید علمائے کرام نے اس کے استعمال کی تائید کی ہے؟',
    answerEn: 'Yes, 100% Halal and Shariah-compliant. The Council of Islamic Ideology (CII) of Pakistan, the International Islamic Fiqh Academy in Jeddah, Al-Azhar University Cairo, and prominent religious bodies (including Darul Uloom Deoband and prominent Shia/Ahl-e-Hadith boards) have issued unequivocal Fatwas endorsing the polio vaccine. It contains zero pork gelatin, zero alcohol, and zero haram animal components. Islamic law explicitly emphasizes "Hifz al-Nafs" (preservation of human life and protection of children from preventable harm).',
    answerUr: 'جی ہاں، پولیو ویکسین سو فیصد حلال، پاک اور شرعی اعتبار سے جائز ہے۔ اسلامی نظریاتی کونسل پاکستان، دارالعلوم دیوبند، جامعہ الازہر مصر اور مجمع الفقہ الاسلامی جدہ کے متفقہ فتاویٰ موجود ہیں۔ اس میں سور، الکوحل یا کوئی بھی حرام جزو شامل نہیں۔ شریعت کا بنیادی قاعدہ ہے کہ معصوم بچوں کو بیماری اور معذوری سے بچانا والدین پر شرعی فرض ہے۔',
    keyPointsEn: [
      'Endorsed by Council of Islamic Ideology (CII) Pakistan and Grand Muftis',
      'Contains NO porcine (pork) gelatin, blood products, or intoxicating chemicals',
      'Supported by Islamic legal principle "Preservation of Life and Health" (Hifz al-Nafs)',
      'Mandatory and routinely administered across Saudi Arabia for Hajj & Umrah pilgrims',
    ],
    keyPointsUr: [
      'اسلامی نظریاتی کونسل پاکستان اور تمام مکاتب فکر کے جید مفتیان کا متفقہ فتویٰ',
      'سور کے اجزا، حرام چربی یا نشہ آور کیمیکلز سے بالکل پاک',
      'شریعت کے اصول "حفظ النفس" اور بچوں کی حفاظت کا بہترین ذریعہ',
      'سعودی عرب سمیت تمام اسلامی ممالک میں حج و عمرہ کے زائرین کے لیے لازمی',
    ],
  },
  {
    id: 'med-3',
    category: 'important_medical',
    badgeEn: 'Illness & Fever',
    badgeUr: 'بیمار بچے کو قطرے',
    questionEn: 'Can a child with a mild fever, cough, flu, or diarrhea receive the polio drops?',
    questionUr: 'کیا نزلہ، زکام، کھانسی یا ہلکے بخار اور دست والے بچے کو قطرے پلائے جا سکتے ہیں؟',
    answerEn: 'Yes, absolutely! Mild illness such as common cold, mild fever, teething, cough, or diarrhea is NOT a reason to delay or refuse the polio vaccine. Sick children are physically more susceptible to wild poliovirus infection and need protection immediately. If a child has severe diarrhea, administer the 2 drops now, and ensure they receive an additional dose during the next round or catch-up to guarantee full intestinal absorption.',
    answerUr: 'جی ہاں، بالکل! نزلہ، زکام، کھانسی، معمولی بخار یا دست کی صورت میں پولیو کے قطرے پلانا نہ صرف محفوظ ہے بلکہ اشد ضروری ہے۔ ایسے بچے جسمانی کمزوری کے باعث وائرس کا آسان شکار بن سکتے ہیں۔ اگر بچے کو دست لگے ہوں تو قطرے فورا پلائیں اور دست ٹھیک ہونے کے بعد کیچ اپ راؤنڈ میں ایک اضافی خوراک ضرور دیں۔',
    keyPointsEn: [
      'Mild fever, cough, and runny nose are NOT medical contraindications',
      'Ill and malnourished children are at higher risk of contracting paralysis',
      'If vomiting occurs within 10 minutes, wait briefly and re-administer 2 drops',
      'Reassure parents that the drops do not interact with routine pediatric medicines',
    ],
    keyPointsUr: [
      'معمولی بخار، کھانسی اور زکام میں قطرے نہ پلانا سخت نقصان دہ ہے',
      'کمزور اور بیمار بچوں کو بیماری کے خلاف فوری قوت مدافعت درکار ہوتی ہے',
      'اگر بچہ 10 منٹ کے اندر قے کر دے تو تھوڑی دیر بعد دوبارہ 2 قطرے پلائیں',
      'والدین کو تسلی دیں کہ اینٹی بائیوٹک یا دیگر ادویات کے ساتھ قطروں کا کوئی نقصان نہیں',
    ],
  },
  {
    id: 'med-4',
    category: 'important_medical',
    badgeEn: 'Newborns (0-Day)',
    badgeUr: 'نوزائیدہ بچے (پیدائش کا دن)',
    questionEn: 'Why is it critical to vaccinate newborn babies on their very first day of life?',
    questionUr: 'پیدائش کے پہلے ہی دن نوزائیدہ بچوں کو قطرے پلانا کیوں ضروری ہے؟',
    answerEn: 'Newborns have an immature immune system and do not carry permanent maternal antibodies against polio. In communities where wild poliovirus circulates in sewage or within households, newborns can contract the virus within days of birth. Administering 2 drops of bOPV immediately at birth (Zero Dose) initiates mucosal antibody production without interfering with breastfeeding.',
    answerUr: 'نوزائیدہ بچے سب سے زیادہ غیر محفوظ ہوتے ہیں کیونکہ ان کی قدرتی قوت مدافعت کمزور ہوتی ہے۔ اگر ماحول میں وائرس موجود ہو تو نوزائیدہ بچے چند ہی دنوں میں اس کا شکار ہو سکتے ہیں۔ پیدائش کے فورا بعد ملنے والی خوراک (Zero Dose) بچے کی آنتوں میں حفاظتی ڈھال تیار کرنا شروع کر دیتی ہے اور ماں کے دودھ پر اس کا کوئی منفی اثر نہیں ہوتا۔',
    keyPointsEn: [
      'Newborn zero-dose kickstarts intestinal mucosal defense immediately',
      'Does not interfere with breastfeeding or colostrum feeding',
      'Prevents domestic transmission from older household siblings',
      'Frontline teams must actively ask for and record newborns in every house',
    ],
    keyPointsUr: [
      'پہلی خوراک سے نوزائیدہ بچے کے پیٹ میں حفاظتی خلیات بننا شروع ہو جاتے ہیں',
      'ماں کے پہلے دودھ (بولا/کلوسترم) کے ساتھ مکمل محفوظ اور سازگار',
      'بڑے بہن بھائیوں سے وائرس کی منتقلی کا خطرہ ختم کرتا ہے',
      'فیلڈ ورکرز ہر گھر میں نوزائیدہ بچوں کی لازمی تصدیق اور اندراج کریں',
    ],
  },
  {
    id: 'med-5',
    category: 'important_medical',
    badgeEn: 'bOPV vs IPV',
    badgeUr: 'قطرے بمقابلہ حفاظتی ٹیکہ',
    questionEn: 'What is the clinical difference between bOPV (oral drops) and IPV (injectable vaccine)?',
    questionUr: 'بائیویلنٹ اورل پولیو ویکسین (bOPV) اور حفاظتی ٹیکے (IPV) میں کیا فرق ہے؟',
    answerEn: 'Both vaccines are essential and complement each other: bOPV (2 drops in mouth) stimulates mucosal immunity in the digestive tract, stopping the live virus from replicating and shedding in feces, thereby halting community transmission. IPV (inactivated injected vaccine) produces high antibody levels in the bloodstream, providing individual immunity to prevent the virus from penetrating the spinal cord and causing paralysis. Together, they create an impenetrable barrier.',
    answerUr: 'دونوں ویکسینز مل کر مکمل حفاظت فراہم کرتی ہیں: اورل پولیو قطرے (bOPV) بچے کی آنتوں میں وائرس کو ختم کرتے ہیں تاکہ وہ فضلہ کے ذریعے دوسرے بچوں میں نہ پھیل سکے؛ جبکہ حفاظتی ٹیکہ (IPV) خون کے اندر ایسی مدافعت پیدا کرتا ہے جو وائرس کو بچے کے اعصابی نظام اور حرام مغز تک پہنچنے سے روکتی ہے۔ دونوں مل کر بچے کو 100 فیصد محفوظ بنا دیتے ہیں۔',
    keyPointsEn: [
      'bOPV (Oral): Builds mucosal gut immunity and stops community transmission',
      'IPV (Injectable): Builds systemic bloodstream immunity preventing paralysis',
      'Administering both ensures individual survival and communal viral elimination',
      'IPV is given through routine EPI centers and targeted outreach campaigns',
    ],
    keyPointsUr: [
      'قطرے (bOPV): آنتوں کی حفاظت کرتے ہیں اور وائرس کا پھیلاؤ روکتے ہیں',
      'ٹیکہ (IPV): خون میں مدافعت بنا کر اعضاء کو فالج سے محفوظ رکھتا ہے',
      'دونوں کا امتزاج بچے کو دائمی اور ناقابل تسخیر تحفظ فراہم کرتا ہے',
      'آئی پی وی معمول کے حفاظتی ٹیکہ جات کے شیڈول میں بھی شامل ہے',
    ],
  },
  {
    id: 'med-6',
    category: 'important_medical',
    badgeEn: 'Cold Chain & VVM',
    badgeUr: 'ویکسین وائل مانیٹر (VVM)',
    questionEn: 'How does the Vaccine Vial Monitor (VVM) guarantee that the vaccine is cold and potent?',
    questionUr: 'ویکسین وائل مانیٹر (VVM) کیسے یقینی بناتا ہے کہ ویکسین ٹھنڈی اور کارآمد ہے؟',
    answerEn: 'Every bOPV vial has a square-inside-circle heat indicator called the Vaccine Vial Monitor (VVM). (Stage 1) Inner square is clean white = 100% potent, USE VACCINE; (Stage 2) Inner square is slightly off-white but distinctly lighter than the outer circle = potent, USE VACCINE FIRST; (Stage 3) Inner square color matches the outer circle = DISCARD, DO NOT USE; (Stage 4) Inner square is darker than the outer circle = DISCARD, DO NOT USE. Cold chain temperatures must be maintained between +2°C and +8°C in ice packs.',
    answerUr: 'ہر پولیو وائل پر ایک دائرے کے اندر سفید چوکور نشان ہوتا ہے جسے VVM کہتے ہیں: (سٹیج 1) اندرونی چوکور بالکل سفید ہے = ویکسین مکمل معیاری ہے، استعمال کریں؛ (سٹیج 2) اندرونی چوکور ہلکا سا تبدیل ہوا لیکن بیرونی دائرے سے نمایاں ہلکا ہے = ویکسین ٹھیک ہے، پہلے استعمال کریں؛ (سٹیج 3) اندرونی چوکور کا رنگ بیرونی دائرے جیسا ہو گیا = ویکسین خراب ہے، ضائع کریں؛ (سٹیج 4) اندرونی چوکور دائرے سے زیادہ سیاہ ہو گیا = سخت ناقابل استعمال۔ درجہ حرارت +2 سے +8 ڈگری پر رکھنا لازمی ہے۔',
    keyPointsEn: [
      'Stage 1: Inner square pure white = Fully potent, SAFE to use',
      'Stage 2: Inner square lighter than circle = Potent, USE FIRST',
      'Stage 3: Square matches circle = Heat damaged, DISCARD IMMEDIATELY',
      'Stage 4: Square darker than circle = Heat damaged, DISCARD IMMEDIATELY',
    ],
    keyPointsUr: [
      'سٹیج 1: اندرونی چوکور دودھیا سفید = ویکسین سو فیصد معیاری اور قابل استعمال',
      'سٹیج 2: چوکور دائرے سے ہلکے رنگ کا ہے = قابل استعمال، پہلے استعمال کریں',
      'سٹیج 3: چوکور اور دائرہ ایک جیسے ہو گئے = گرمی سے خراب، ہرگز استعمال نہ کریں',
      'سٹیج 4: چوکور دائرے سے بھی زیادہ گہرا سیاہ = مکمل خراب، فوری واپس کریں',
    ],
  },

  // -------------------------------------------------------------
  // REFUSALS & RUMORS MITIGATION
  // -------------------------------------------------------------
  {
    id: 'ref-1',
    category: 'refusals_rumors',
    badgeEn: 'Infertility Myth',
    badgeUr: 'بانجھ پن کا جھوٹا پروپیگنڈا',
    questionEn: 'How to address the false rumor that the polio vaccine causes infertility or impotence?',
    questionUr: 'پولیو ویکسین سے بانجھ پن یا مستقبل میں کمزوری کی افواہ کا سائنسی و عقلی جواب کیا ہے؟',
    answerEn: 'This harmful conspiracy theory has been completely disproven. Over 3 billion children across all 57 Muslim-majority countries—including Saudi Arabia, UAE, Turkey, Indonesia, and Malaysia—have received this exact same oral vaccine for over 40 years without any impact on fertility. Polio drops contain only attenuated poliovirus, trace stabilizers (magnesium chloride), and saline. It does not affect reproductive organs or hormones. Furthermore, Pakistan’s fertility and population growth rate has steadily grown, completely exposing this myth.',
    answerUr: 'یہ افواہ سراسر جھوٹ، من گھڑت اور بے بنیاد ہے۔ دنیا کے تمام 57 اسلامی ممالک بشمول سعودی عرب، ملائیشیا، ترکی، ایران اور انڈونیشیا میں پچھلے 40 سالوں سے یہی قطرے پلائے جا رہے ہیں اور وہاں کی آبادی میں کوئی کمی نہیں آئی۔ ویکسین میں صرف وائرس سے بچاؤ کے قدرتی اجزا اور نمکیات ہوتے ہیں۔ اس کا انسانی ہارمونز یا افزائشِ نسل کے نظام سے دور دور تک کوئی تعلق نہیں۔',
    keyPointsEn: [
      'Over 3 billion children vaccinated worldwide with zero fertility complications',
      'Routinely given in all 57 OIC Muslim countries including Saudi Arabia and UAE',
      'Contains zero hormonal agents, chemicals, or reproductive sterilants',
      'Ask parents: "If this rumor were true, why do Saudi Arabia and Muslim doctors give it to their own children?"',
    ],
    keyPointsUr: [
      'دنیا بھر میں 3 ارب سے زائد بچوں کو دی جا چکی ہے، کسی ایک میں بھی ایسا اثر نہیں ہوا',
      'سعودی عرب، ترکی، ملائیشیا اور تمام اسلامی ممالک میں باقاعدگی سے استعمال ہوتی ہے',
      'اس میں کوئی ہارمون، کیمیکل یا افزائش نسل کو روکنے والا مادہ شامل نہیں',
      'والدین سے سوال کریں: "اگر یہ سچ ہوتا تو سعودی عرب اور ہمارے اپنے ڈاکٹر اپنے بچوں کو کیوں پلاتے؟"',
    ],
  },
  {
    id: 'ref-2',
    category: 'refusals_rumors',
    badgeEn: '4-Step Conversion',
    badgeUr: 'انکار کو رضامندی میں بدلنا',
    questionEn: 'What is the proven 4-Step Communication Framework for converting refusals at the doorstep?',
    questionUr: 'دروازے پر انکاری والدین کو مطمئن کرنے کا آزمودہ 4 مرحلہ وار طریقہ کار کیا ہے؟',
    answerEn: 'Frontline workers must never argue or display anger. Follow the 4-Step SBC Conversion protocol: (1) Listen & Validate: Allow the parent to voice their specific objection fully without interrupting; (2) Empathize & Align: Reassure them that as parents, caring for child safety is natural ("I understand your concern for your child"); (3) Clarify with Trusted Proof: Present doctor video statements, Grand Mufti Fatwas, or show the clean VVM monitor; (4) Seek Shared Solution: If resistance persists, involve the Female CBV supervisor, local Area In-Charge, or respected neighborhood Pesh Imam rather than forcing the issue.',
    answerUr: 'دروازے پر والدین سے الجھنے کے بجائے یہ 4 سنہری اصول اپنائیں: (1) غور سے سنیں: والد یا والدہ کی بات بغیر ٹوکے مکمل سنیں؛ (2) ہمدردی کا اظہار کریں: ان کے احساسات کی قدر کریں کہ "بچے کی فکر کرنا ہر اچھے باپ اور ماں کی نشانی ہے"؛ (3) مستند ثبوت پیش کریں: موبائل میں ڈاکٹر کا ویڈیو بیان دکھائیں یا مفتیان کرام کا فتویٰ اور VVM دکھائیں؛ (4) بزرگوں اور امام مسجد کی مدد لیں: اگر والد پھر بھی نہ مانے تو زبردستی نہ کریں بلکہ ٹیم انچارج یا محلے کے بااثر امام کو ساتھ لے کر شام کو دوبارہ آئیں۔',
    keyPointsEn: [
      'Step 1: Active, respectful listening without defensive interruptions',
      'Step 2: Empathetic alignment: "We both want your child healthy and thriving"',
      'Step 3: Evidence presentation: Play doctor video endorsement on your mobile',
      'Step 4: Third-party escalation: Mobilize Pesh Imam, UCMO, or community elder',
    ],
    keyPointsUr: [
      'پہلا مرحلہ: احترام کے ساتھ والدین کا اعتراض سنیں، بات نہ کاٹیں',
      'دوسرا مرحلہ: ہمدردی دکھائیں: "ہم بھی آپ کے بچے کی صحت اور سلامتی چاہتے ہیں"',
      'تیسرا مرحلہ: موبائل پر معتبر ماہر اطفال کی ویڈیو یا فتویٰ سنائیں',
      'چوتھا مرحلہ: انکار برقرار رہنے پر امام مسجد، بزرگوں یا ایریا انچارج کو شامل کریں',
    ],
  },
  {
    id: 'ref-3',
    category: 'refusals_rumors',
    badgeEn: 'Demands & Boycotts',
    badgeUr: 'مطالبات پر بائیکاٹ کا حل',
    questionEn: 'How should teams handle conditional refusals ("We will only vaccinate if roads/electricity/gas are fixed")?',
    questionUr: 'بجلی، گیس، سڑک یا نادرا کارڈ جیسے مطالبات پر بائیکاٹ کرنے والوں سے کیسے بات کریں؟',
    answerEn: 'Communities sometimes leverage polio campaigns to demand municipal civic rights (electricity transformers, sanitation, roads, jobs). Frontline teams should never make false administrative promises. Empathize with their civic difficulties, but gently detach civic infrastructure from child survival: "Respected uncle, your demand for electricity/roads is completely genuine, but your child’s legs and ability to walk cannot be made a hostage to a power cable. If paralysis strikes tomorrow, electricity will not cure your child\'s paralysis." Escalate the civic issue to the Assistant Commissioner/DC through the daily evening de-brief meeting.',
    answerUr: 'اکثر لوگ سڑک، بجلی، گیس یا نادرا کے مطالبات کے لیے پولیو مہم کا بائیکاٹ کر دیتے ہیں۔ ورکرز کبھی جھوٹے وعدے نہ کریں۔ شائستگی سے سمجھائیں: "آپ کا بجلی کا مطالبہ بالکل جائز ہے، مگر اپنے پھول جیسے بچے کے پاؤں اور زندگی کو بجلی کے کھمبے کی بھینٹ نہ چڑھائیں۔ خدا نخواستہ بچہ معذور ہو گیا تو بجلی یا سڑک اس کے کام نہیں آئے گی۔" ان کے مسئلے کو شام کی میٹنگ میں اسسٹنٹ کمشنر کے گوش گزار کریں۔',
    keyPointsEn: [
      'Acknowledge civic grievances as genuine without making unfulfilled promises',
      'Separate child health from municipal disputes: "Do not punish your innocent child"',
      'Offer to report their community demand directly to District Administration in daily de-brief',
      'Involve local political notables and Union Council leadership to mediate',
    ],
    keyPointsUr: [
      'مطالبے کو جھٹلائے بغیر نرمی سے سنیں، لیکن غلط یقین دہانی نہ کرائیں',
      'بچے کی معذوری اور بجلی/سڑک کے فرق کو واضح کریں: "معصوم بچے کو سزا نہ دیں"',
      'شام کے اجلاس میں انتظامیہ (اے سی/ڈی سی) کو ان کے مسائل سے باضابطہ آگاہ کریں',
      'یونین کونسل کے معززین اور سیاسی رہنماؤں کو ثالث کے طور پر شامل کریں',
    ],
  },

  // -------------------------------------------------------------
  // FIELD OPERATIONS & SOPS
  // -------------------------------------------------------------
  {
    id: 'fld-1',
    category: 'field_operations',
    badgeEn: 'Finger Marking',
    badgeUr: 'انگلی پر انمٹ سیاہی کا نشان',
    questionEn: 'What is the strict protocol for indelible ink finger marking on children?',
    questionUr: 'بچے کی انگلی پر انمٹ سیاہی لگانے کا درست اور باضابطہ طریقہ کار کیا ہے؟',
    answerEn: 'Finger marking is the visible audit certificate of vaccination. The protocol mandates using official silver nitrate indelible ink marker pen applied from the cuticle to the entire nail bed and surrounding skin fold of the child\'s LEFT LITTLE FINGER. The team must ALWAYS mark the finger AFTER drops are successfully swallowed, NEVER before. Ensure the ink dries for 5 seconds before releasing the child so it cannot be wiped off.',
    answerUr: 'انگلی کا نشان بچے کے ویکسینیٹ ہونے کی واحد مستند تصدیق ہے۔ اصول یہ ہے کہ بائیں ہاتھ کی چھوٹی انگلی (Left Little Finger) کے ناخن اور اس کے نچلے حصے پر سرکاری انمٹ مارکر سے واضح لکیر لگائی جائے۔ یاد رکھیں: سیاہی کا نشان قطرے پلانے کے بعد لگانا ہے، پہلے ہرگز نہیں۔ سیاہی کو 5 سیکنڈ تک سوکھنے دیں تاکہ مٹائی نہ جا سکے۔',
    keyPointsEn: [
      'Apply to Left Little Finger from cuticle across entire nail bed',
      'NEVER mark finger before child has safely swallowed both drops',
      'Allows independent monitors and third-party monitors to verify true coverage',
      'Essential for preventing double vaccination or accidental omissions',
    ],
    keyPointsUr: [
      'بائیں ہاتھ کی سب سے چھوٹی انگلی کے ناخن اور کھال پر نشان لگائیں',
      'قطرے پلانے سے پہلے سیاہی کا نشان لگانا سخت منع ہے',
      'مانیٹرز اور سرویلنس ٹیموں کو فوری پتہ چلتا ہے کہ بچہ محفوظ ہو چکا ہے',
      'بچے کے دوبارہ چھوٹ جانے یا غلط گنتی سے بچاؤ کا لازمی طریقہ ہے',
    ],
  },
  {
    id: 'fld-2',
    category: 'field_operations',
    badgeEn: 'NA vs Refusal',
    badgeUr: 'غیر حاضر (NA) اور انکاری (Refusal)',
    questionEn: 'What is the difference between Not Available (NA) and Refusal children in field tallies?',
    questionUr: 'ٹیلی شیٹ میں غیر حاضر (NA) اور انکاری (Refusal) بچوں کے اندراج میں کیا فرق ہے؟',
    answerEn: 'Accurate categorization on tally sheets is vital: (1) Not Available (NA) means an eligible child lives at the house but is temporarily absent (e.g. at school, sleeping, visiting market, or traveling out of town). (2) Refusal (R) means the child is present or known, but the caregiver explicitly refuses vaccination due to religious, safety, or demand objections. Both categories constitute "Missed Children" and must be recorded with exact house number and child name for mandatory evening/catch-up revisit.',
    answerUr: 'ٹیلی شیٹ پر درست اندراج مہم کی کامیابی کا ضامن ہے: (1) غیر حاضر بچہ (NA) وہ ہے جو گھر کا مستقل رہائشی ہے مگر اس وقت سکول، نانی کے گھر یا بازار گیا ہوا ہے؛ (2) انکاری بچہ (Refusal) وہ ہے جس کے والدین شکوک، افواہوں یا مطالبات کی وجہ سے قطرے پلانے سے صاف انکار کر دیں۔ دونوں بچے "مسڈ چلڈرن" ہیں جن کا نام اور پتہ نوٹ کر کے شام کو لازمی کور کرنا ہوتا ہے۔',
    keyPointsEn: [
      'NA: Child temporarily away; requires evening or Day 4 catch-up revisit',
      'Refusal: Explicit parental refusal; requires influencer and AIC/UCMO intervention',
      'Both must be logged accurately on door marking (e.g. date, total, vaccinated, missed)',
      'Target: ≥90% NA clearance and ≥85% refusal conversion before campaign close',
    ],
    keyPointsUr: [
      'غیر حاضر (NA): بچہ وقتی طور پر باہر ہے، شام کو دوبارہ چکر لگائیں',
      'انکاری (Refusal): والدین کا انکار، ایریا انچارج اور بااثر شخصیات کی ضرورت',
      'گھر کے دروازے پر درست چاکنگ (تاریخ، کل بچے، ویکسینیٹڈ، باقی) درج کریں',
      'ہدف: مہم ختم ہونے سے پہلے 90 فیصد این اے اور 85 فیصد انکاری بچوں کو کور کرنا',
    ],
  },
  {
    id: 'fld-3',
    category: 'field_operations',
    badgeEn: 'Fixed bOPV Rule',
    badgeUr: '1 وائل = 20 خوراکیں اصول',
    questionEn: 'Why must teams strictly adhere to the Fixed bOPV Rule (1 vial = 20 doses)?',
    questionUr: 'bOPV وائل کا 20 خوراکوں (2 قطرے فی بچہ) کا اصول سختی سے کیوں نافذ ہے؟',
    answerEn: 'Every multi-dose vial of bOPV manufactured for the Pakistan campaign is filled with exactly 20 therapeutic doses (1.0 ml with a 0.05 ml dropper delivering 2 drops per dose). Frontline workers must strictly deliver 2 drops on the tongue. Giving 1 drop leads to under-immunization and vaccine failure. Squeezing more than 20 doses from a vial means children received incomplete volume. If a drop misses the child’s mouth or is spit out, re-administer 2 drops immediately.',
    answerUr: 'پاکستان پولیو پروگرام میں فراہم کی جانے والی ہر bOPV وائل میں ٹھیک 20 خوراکیں ہوتی ہیں، اور ڈراپر اس طرح بنا ہوتا ہے کہ 2 قطرے ہی ایک مکمل خوراک ہیں۔ 2 سے کم قطرے دینا بچے کی حفاظت کے لیے ناکافی ہے۔ ایک وائل سے 20 سے زیادہ خوراکیں نکالنا خطرناک ہے کیونکہ اس کا مطلب ہے بچوں کو کم دوا ملی۔ اگر قطرہ منہ سے باہر گر جائے تو دوبارہ 2 قطرے پلائیں۔',
    keyPointsEn: [
      'Standard calibrated dropper delivers exactly 2 drops = 1 therapeutic dose',
      'Never dilute, stretch, or squeeze beyond 20 doses per vial',
      'Discard opened vials at end of day or if VVM reaches Stage 3/4',
      'Include standard 10% microplanning buffer to prevent midday field stockouts',
    ],
    keyPointsUr: [
      'ہر بچے کو زبان پر پورے 2 قطرے دینا قانونی و طبی ضرورت ہے',
      'وائل میں پانی ملانا یا 20 سے زیادہ بچوں میں بانٹنا سخت جرم اور دھوکہ ہے',
      'شام کو کھلی ہوئی غیر استعمال شدہ وائلز کا ضابطے کے مطابق حساب دیں',
      'ویکسین کی کمی سے بچنے کے لیے ہمیشہ 10 فیصد اضافی بفر کا حساب رکھیں',
    ],
  },
];
