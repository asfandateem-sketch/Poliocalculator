import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck2,
  Eye,
  X,
  HardDrive,
  FolderSync,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MASTER_FOLDER_URL } from '../data/coreVideos';

interface DocumentItem {
  id: string;
  code: string;
  titleEn: string;
  titleUr: string;
  categoryEn: string;
  categoryUr: string;
  format: string;
  pages: string;
  descriptionEn: string;
  descriptionUr: string;
  keyFieldsEn: string[];
  keyFieldsUr: string[];
  operationalUsageEn: string;
  operationalUsageUr: string;
}

const DOCUMENT_ITEMS: DocumentItem[] = [
  {
    id: 'doc-1',
    code: 'FORM-A',
    titleEn: 'Mobile Team Daily Tally Sheet',
    titleUr: 'موبائل ٹیم کا یومیہ ٹیلی شیٹ فارم',
    categoryEn: 'Field Tally Form',
    categoryUr: 'فیلڈ ٹیلی فارم',
    format: 'PDF / Form',
    pages: '2 Pages',
    descriptionEn: 'The primary operational record completed by mobile vaccination teams at every household. Tracks door numbers, target children, vaccinated, NA reasons, and refusals.',
    descriptionUr: 'ہر گھر کے وزٹ پر موبائل ٹیم کی جانب سے بھرا جانے والا بنیادی ریکارڈ۔ اس میں گھر نمبر، کل بچے، ویکسینیٹڈ بچے، غیر حاضری (NA) کی وجوہات اور انکار درج کیے جاتے ہیں۔',
    keyFieldsEn: [
      'House Number & Street / Mohallah name',
      'Number of Under-5 Children present',
      'Number of Children vaccinated with 2 drops',
      'Number of NA (Not Available) children + Reason (market, school, sleeping)',
      'Number of Refusals (R) + Specific parental hesitation reason',
      'Left little finger indelible ink verification tick',
    ],
    keyFieldsUr: [
      'گھر نمبر، گلی یا محلے کا نام',
      'موجود 5 سال سے کم عمر بچوں کی تعداد',
      'ویکسین کے 2 قطرے پینے والے بچوں کی تعداد',
      'غیر حاضر (NA) بچوں کی تعداد بمع وجہ (اسکول، بازار، سویا ہوا)',
      'انکاری بچوں کی تعداد بمع انکاری وجہ',
      'بائیں ہاتھ کی چھوٹی انگلی پر انمٹ سیاہی کی تصدیق',
    ],
    operationalUsageEn: 'Filled in real-time during house-to-house movement. Reconciled daily at 4:00 PM during evening UC debriefing meetings.',
    operationalUsageUr: 'گھر گھر مہم کے دوران برائے راست بھرا جاتا ہے اور شام 4 بجے یونین کونسل کے جائزہ اجلاس میں جمع کروایا جاتا ہے۔',
  },
  {
    id: 'doc-2',
    code: 'FORM-B',
    titleEn: 'Area Supervisor Monitoring & Validation Form',
    titleUr: 'ایریا سپروائزر مانیٹرنگ اور تصدیقی چیک لسٹ',
    categoryEn: 'Supervisory Checklist',
    categoryUr: 'سپروائزری چیک لسٹ',
    format: 'PDF / SOP',
    pages: '3 Pages',
    descriptionEn: 'Standard checklist used by Area Supervisors to spot-check 10 randomly selected households per team to validate finger marks, door marking accuracy, and team route compliance.',
    descriptionUr: 'ہر موبائل ٹیم کے وزٹ کردہ علاقے سے 10 گھروں کا بے ترتیب انتخاب کر کے انگلی کے نشانات، چاک مارکنگ اور روٹ کی تصدیق کا سرکاری فارم۔',
    keyFieldsEn: [
      'Verification of chalk mark matching physical children count',
      'Physical inspection of left pinky finger indelible ink on all kids',
      'Assessment of vaccine carrier cold chain (+2°C to +8°C) and VVM stage',
      'Review of reported NA children against actual household occupancy',
    ],
    keyFieldsUr: [
      'دروازے کی چاک مارکنگ اور بچوں کی اصل تعداد کی مماثلت کی جانچ',
      'بچوں کی انگلی پر لگی سیاہی کا جسمانی معائنہ',
      'ویکسین کیرئیر کا درجہ حرارت اور VVM اسٹیج چیک کرنا',
      'رپورٹ شدہ غیر حاضر بچوں کا موقع پر فالو اپ',
    ],
    operationalUsageEn: 'Supervisors must complete at least 2 spot-checks in the morning and 2 during evening catch-up rounds for each assigned team.',
    operationalUsageUr: 'ہر سپروائزر کے لیے صبح اور شام کے راؤنڈز میں اپنی ٹیموں کے کم از کم 4 سپاٹ چیکس مکمل کرنا لازمی ہے۔',
  },
  {
    id: 'doc-3',
    code: 'LOG-CC',
    titleEn: 'bOPV Cold Chain & Vaccine Carrier Temperature Log',
    titleUr: 'کولڈ چین اور ویکسین کیرئیر کا درجہ حرارت لاگ شیٹ',
    categoryEn: 'Logistics Log',
    categoryUr: 'لاجسٹکس لاگ',
    format: 'Log Sheet',
    pages: '1 Page',
    descriptionEn: 'Daily temperature recording sheet for health facility ice-lined refrigerators (ILR) and field vaccine carriers. Guarantees vaccine viability from central store to child mouth.',
    descriptionUr: 'بنیادی مرکز صحت کے ریفریجریٹر اور فیلڈ ویکسین کیرئیر کا صبح اور شام کا درجہ حرارت ریکارڈ کرنے والی شیٹ۔',
    keyFieldsEn: [
      'Morning departure temperature (+2°C to +8°C)',
      'Evening return temperature verification',
      'Vials received (Batch number, Expiry date, Initial VVM stage)',
      'Vials utilized (Doses administered = 20 × full vials)',
      'Vials returned unopened (with intact cold chain)',
      'Vials discarded (VVM stage 3/4 or compromised)',
    ],
    keyFieldsUr: [
      'صبح فیلڈ روانگی کے وقت درجہ حرارت (+2 تا +8 ڈگری سینٹی گریڈ)',
      'شام کو واپسی پر درجہ حرارت کا اندراج',
      'وصول شدہ وائلز کا بیچ نمبر اور ابتدائی VVM اسٹیج',
      'استعمال شدہ وائلز (20 خوراکیں فی وائل)',
      'بغیر کھلی واپس موصول شدہ محفوظ وائلز',
      'ضائع شدہ وائلز کا اندراج (خراب درجہ حرارت یا VVM 3/4)',
    ],
    operationalUsageEn: 'Maintained by the UC Cold Chain Focal Person and signed by the Union Council Medical Officer (UCMO).',
    operationalUsageUr: 'یوسی کولڈ چین فوکل پرسن اور میڈیکل آفیسر (UCMO) کے دستخط سے روزانہ تصدیق ہوتی ہے۔',
  },
  {
    id: 'doc-4',
    code: 'SOP-PTP',
    titleEn: 'Permanent Transit Post (PTP) Operation Protocol',
    titleUr: 'مستقل ٹرانزٹ پوائنٹ (PTP) فیلڈ پروٹوکول گائیڈ',
    categoryEn: 'Transit SOP',
    categoryUr: 'ٹرانزٹ گائیڈ',
    format: 'Field Guide',
    pages: '2 Pages',
    descriptionEn: 'Operational guidelines for teams stationed at toll plazas, railway stations, interstate bus terminals, and border transit corridors to immunize mobile children in transit.',
    descriptionUr: 'ٹول پلازوں، ریلوے اسٹیشنز، لاری اڈوں اور صوبائی بارڈرز پر سفر کرنے والے بچوں کو پولیو کے قطرے پلانے کے لیے خصوصی فیلڈ طریقہ کار۔',
    keyFieldsEn: [
      'Vehicle boarding protocol: buses, passenger vans, private cars',
      'Finger mark check prior to offering oral vaccine drops',
      'Recording passenger origin and destination districts',
      'Coordination with traffic police and transport union presidents',
    ],
    keyFieldsUr: [
      'گاڑیوں، بسوں اور مسافر وینز میں داخل ہو کر بچوں کی جانچ کا طریقہ',
      'قطرے پلانے سے پہلے انگلی کا نشان لازمی چیک کرنا',
      'مسافروں کے روانگی اور منزل کے اضلاع کا اندراج',
      'ٹریفک پولیس اور ٹرانسپورٹ یونین کے ساتھ باہمی تعاون',
    ],
    operationalUsageEn: 'Operates in 8-hour rotating shifts across 24 hours at major transit hubs to capture children moving between transmission zones.',
    operationalUsageUr: 'بڑے ٹرانزٹ مقامات پر 24 گھنٹے 8 گھنٹے کی شفٹوں میں ٹیمیں تعینات رہتی ہیں۔',
  },
];

interface DocumentsSectionProps {
  targetDocId?: string;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ targetDocId }) => {
  const { isUrdu } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [activeDriveDoc, setActiveDriveDoc] = useState<any | null>(null);

  // Synced documents strictly from user's Google Drive "Polio Tool Kit" folder
  const [driveDocs, setDriveDocs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('polio_drive_synced_videos_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              item.fileType === 'document' ||
              (item.category && item.category.toLowerCase().includes('document')) ||
              (item.originalCategory && item.originalCategory.toLowerCase().includes('document')) ||
              (item.folderName && item.folderName.toLowerCase().includes('document')) ||
              (item.originalFilename && /\.(pdf|doc|docx|xlsx|xls|ppt|pptx|txt)$/i.test(item.originalFilename))
          );
        }
      }
    } catch {}
    return [];
  });

  // Listen for real-time live Google Drive updates
  useEffect(() => {
    // Also attempt loading from data/drive_resources.json for mobile
    const loadStaticDocs = async () => {
      try {
        const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') + '/';
        const res = await fetch(`${base}data/drive_resources.json?_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const items = await res.json();
          if (Array.isArray(items)) {
            const filteredDocs = items.filter(
              (item) =>
                item.fileType === 'document' ||
                (item.category && item.category.toLowerCase().includes('document')) ||
                (item.originalCategory && item.originalCategory.toLowerCase().includes('document')) ||
                (item.folderName && item.folderName.toLowerCase().includes('document')) ||
                (item.originalFilename && /\.(pdf|doc|docx|xlsx|xls|ppt|pptx|txt)$/i.test(item.originalFilename))
            );
            if (filteredDocs.length > 0) {
              setDriveDocs(filteredDocs);
            }
          }
        }
      } catch {}
    };
    loadStaticDocs();

    const handleDriveSync = (e: any) => {
      const items = e?.detail?.items;
      if (Array.isArray(items)) {
        const filteredDocs = items.filter(
          (item) =>
            item.fileType === 'document' ||
            (item.category && item.category.toLowerCase().includes('document')) ||
            (item.originalCategory && item.originalCategory.toLowerCase().includes('document')) ||
            (item.folderName && item.folderName.toLowerCase().includes('document')) ||
            (item.originalFilename && /\.(pdf|doc|docx|xlsx|xls|ppt|pptx|txt)$/i.test(item.originalFilename))
        );
        setDriveDocs(filteredDocs);
      }
    };

    window.addEventListener('polio_drive_synced', handleDriveSync);
    return () => {
      window.removeEventListener('polio_drive_synced', handleDriveSync);
    };
  }, []);

  useEffect(() => {
    if (targetDocId) {
      const match = DOCUMENT_ITEMS.find((d) => d.id === targetDocId);
      if (match) {
        setSelectedDoc(match);
      }
      setTimeout(() => {
        const el = document.getElementById(targetDocId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [targetDocId]);

  const openDoc = (doc: DocumentItem) => {
    triggerHaptic('light');
    setSelectedDoc(doc);
  };

  const closeDoc = () => {
    triggerHaptic('light');
    setSelectedDoc(null);
  };

  const handleDownloadDoc = (doc: any) => {
    triggerHaptic('medium');
    const fileId = doc.driveFileId;
    const downloadUrl = doc.downloadUrl || (fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : doc.driveUrl);
    if (!downloadUrl) return;

    const rawTitle = (doc.titleEn || doc.name || 'polio_document').trim();
    const cleanTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const filename = cleanTitle.includes('.') ? cleanTitle : `${cleanTitle}.pdf`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = (doc: DocumentItem) => {
    triggerHaptic('medium');
    const content = `=====================================================
PAKISTAN POLIO ERADICATION PROGRAMME
${doc.code}: ${doc.titleEn}
${doc.titleUr}
=====================================================
Category: ${doc.categoryEn} (${doc.categoryUr})
Format: ${doc.format} | ${doc.pages}

[OPERATIONAL PURPOSE & PROTOCOL]
${doc.operationalUsageEn}
Urdu: ${doc.operationalUsageUr}

[DESCRIPTION]
${doc.descriptionEn}
Urdu: ${doc.descriptionUr}

[REQUIRED KEY FIELDS & COLUMNS]
${doc.keyFieldsEn.map((f, i) => `${i + 1}. ${f}`).join('\n')}

URDU KEY FIELDS:
${doc.keyFieldsUr.map((f, i) => `${i + 1}. ${f}`).join('\n')}

=====================================================
Generated from Polio Field Companion Toolkit
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.code}_${doc.titleEn.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="documents" className="w-full space-y-5">
      {/* Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600 bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {isUrdu ? 'مہماتی دستاویزات، فارمز اور فیلڈ گائیڈز' : 'Operational Forms, Guides & SOP Documents'}
                </h2>
                {driveDocs.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-1">
                    <FolderSync className="w-3 h-3 text-emerald-600" />
                    <span>{driveDocs.length} Drive Documents Synced</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'گوگل ڈرائیو سے سنک شدہ رہنمائی گائیڈز، ٹیلی شیٹ فارم اے، سپروائزر چیک لسٹ اور مہم پروٹوکولز'
                  : 'Google Drive synced guides, field tally forms, monitoring checklists, and transit protocols'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={MASTER_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5 text-teal-700" />
              <span>{isUrdu ? 'ڈرائیو فولڈر' : 'Open Drive'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 1. Google Drive Synced Documents Section (if present) */}
      {driveDocs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isUrdu ? 'گوگل ڈرائیو سنک شدہ دستاویزات' : 'Google Drive Synced Documents & Guides'}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {driveDocs.length} {isUrdu ? 'فائلیں' : 'Files'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {driveDocs.map((doc) => (
              <div
                key={doc.id}
                className="saas-card p-3.5 flex flex-col justify-between space-y-3 border-emerald-200/60 bg-emerald-50/20 hover:border-emerald-400 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200">
                      {doc.category || 'Documents & Guides'}
                    </span>
                    <span className="font-mono text-slate-400">
                      {doc.fileSizeFormatted || 'Drive File'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {isUrdu ? doc.titleUr : doc.titleEn}
                  </h4>

                  {doc.summaryEn && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {isUrdu ? doc.summaryUr : doc.summaryEn}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setActiveDriveDoc(doc);
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition cursor-pointer flex items-center gap-1.5 min-h-[32px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isUrdu ? 'دستاویز دیکھیں' : 'View File'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                      title={isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download Document'}
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                    </button>
                  </div>

                  <a
                    href={doc.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                  >
                    <span>{isUrdu ? 'ڈرائیو' : 'Drive'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Core Operational Templates Header */}
      <div className="pt-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {isUrdu ? 'معیاری فیلڈ ٹیمپلیٹس و آپریشنل ایس او پیز' : 'Core Operational Templates & SOP Forms'}
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {DOCUMENT_ITEMS.length} {isUrdu ? 'فارمز' : 'Forms'}
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DOCUMENT_ITEMS.map((doc) => (
          <div
            key={doc.id}
            id={doc.id}
            className="saas-card p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-teal-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/70">
                  {doc.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {doc.format} • {doc.pages}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {isUrdu ? doc.titleUr : doc.titleEn}
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {isUrdu ? doc.descriptionUr : doc.descriptionEn}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-600">
                {isUrdu ? doc.categoryUr : doc.categoryEn}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(doc)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                  title={isUrdu ? 'ٹیمپلیٹ ڈاؤنلوڈ کریں' : 'Download Template text'}
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openDoc(doc)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/70 border border-teal-200/70 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isUrdu ? 'تفصیلات دیکھیں' : 'View Template'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Detail Preview Modal */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[11px] font-mono text-teal-200 font-bold uppercase tracking-wider">
                  {selectedDoc.code} • {isUrdu ? selectedDoc.categoryUr : selectedDoc.categoryEn}
                </span>
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {isUrdu ? selectedDoc.titleUr : selectedDoc.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDoc}
                aria-label="Close"
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content Details */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                  {isUrdu ? 'مقصد و مہماتی استعمال:' : 'Operational Purpose & Protocol:'}
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {isUrdu ? selectedDoc.operationalUsageUr : selectedDoc.operationalUsageEn}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-700" />
                  {isUrdu ? 'فارم کے ضروری خانے اور فیلڈ ڈیٹا:' : 'Required Key Fields & Column Structure:'}
                </h4>
                <ul className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                  {(isUrdu ? selectedDoc.keyFieldsUr : selectedDoc.keyFieldsEn).map((field, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate(selectedDoc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold cursor-pointer hover:bg-emerald-100 min-h-[34px]"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isUrdu ? 'ٹیمپلیٹ ڈاؤنلوڈ' : 'Download SOP'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-semibold cursor-pointer hover:bg-teal-100/80 min-h-[34px]"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پرنٹ فارم' : 'Print / Export'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closeDoc}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer min-h-[34px]"
                >
                  {isUrdu ? 'بند کریں' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drive Document Preview Modal */}
      {activeDriveDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
        >
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {activeDriveDoc.category || 'Google Drive File'}
                </span>
                <h3 className="text-sm font-bold truncate text-white">
                  {isUrdu ? activeDriveDoc.titleUr : activeDriveDoc.titleEn}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(activeDriveDoc)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs min-h-[32px]"
                  title={isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download file directly'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                </button>
                <a
                  href={activeDriveDoc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1 transition min-h-[32px]"
                >
                  <span>{isUrdu ? 'گوگل ڈرائیو' : 'Open in Drive'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveDriveDoc(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-100 relative">
              <iframe
                src={activeDriveDoc.embedUrl || `https://drive.google.com/file/d/${activeDriveDoc.driveFileId}/preview`}
                title={activeDriveDoc.titleEn}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="text-slate-500 font-mono text-[11px]">
                ID: {activeDriveDoc.driveFileId}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(activeDriveDoc)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer flex items-center gap-1.5 min-h-[34px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download File'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDriveDoc(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer min-h-[34px]"
                >
                  {isUrdu ? 'بند کریں' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
