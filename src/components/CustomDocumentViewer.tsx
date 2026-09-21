import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  BookOpen,
  X,
  ExternalLink,
} from 'lucide-react';

interface CustomDocumentViewerProps {
  document: {
    id: string;
    name?: string;
    titleEn?: string;
    titleUr?: string;
    driveFileId?: string;
    embedUrl?: string;
    streamUrl?: string;
    downloadUrl?: string;
    category?: string;
    folderName?: string;
    description?: string;
    code?: string;
    categoryEn?: string;
    categoryUr?: string;
    purposeEn?: string;
    purposeUr?: string;
    filledByEn?: string;
    filledByUr?: string;
    supervisorReviewEn?: string;
    supervisorReviewUr?: string;
    columnsEn?: string[];
    columnsUr?: string[];
    tipsEn?: string[];
    tipsUr?: string[];
    [key: string]: any;
  };
  language: 'en' | 'ur';
  onClose?: () => void;
}

export const CustomDocumentViewer: React.FC<CustomDocumentViewerProps> = ({
  document: doc,
  language,
  onClose,
}) => {
  const isUr = language === 'ur';

  // Extract real Drive File ID
  const fileId =
    doc.driveFileId ||
    doc.id?.replace(/^drive-sync-/, '') ||
    doc.embedUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    doc.driveUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    '';

  const docName = doc.name || doc.titleEn || (doc.code ? `${doc.code} - Operational Form` : 'Polio Document');
  const streamSrc = doc.streamUrl || (fileId ? `/api/drive/stream?id=${fileId}&type=document` : '');
  const downloadSrc = doc.downloadUrl || (fileId ? `/api/drive/download?id=${fileId}&filename=${encodeURIComponent(docName)}` : '');

  const [activeTab, setActiveTab] = useState<'stream' | 'sop'>('stream');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrint = () => {
    if (streamSrc) {
      const printWindow = window.open(streamSrc, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } else {
      window.print();
    }
  };

  return (
    <div id={`custom-doc-viewer-${doc.id}`} className="flex flex-col h-full space-y-3">
      {/* Top Security & Feature Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isUr
              ? 'سرور کے ذریعے براہ راست دستاویز ڈسپلے — گوگل سائن ان، اجازت طلب کرنے یا تھرڈ پارٹی کوکیز کی ضرورت نہیں'
              : 'Direct Server Document Delivery — No Google Sign-in, Permission Requests, or Cookies Required'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {downloadSrc && (
            <a
              href={downloadSrc}
              download
              className="inline-flex items-center gap-1.5 font-medium text-emerald-300 hover:text-emerald-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isUr ? 'ڈاؤن لوڈ کریں' : 'Download Document'}</span>
            </a>
          )}
        </div>
      </div>

      {/* Control Header & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {doc.code && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                  {doc.code}
                </span>
              )}
              <span className="text-xs text-slate-400 truncate">
                {doc.category || doc.folderName || (isUr ? 'فیلڈ آپریشنل دستاویز' : 'Field Operational Document')}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              {isUr ? (doc.titleUr || docName) : (doc.titleEn || docName)}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'stream'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isUr ? 'دستاویز فائل' : 'Document File'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sop')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'sop'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isUr ? 'فیلڈ ایس او پی و رہنمائی' : 'Field SOP & Guidance'}
            </button>
          </div>

          {/* Zoom Tools (if stream tab) */}
          {activeTab === 'stream' && (
            <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-300">
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                title="Zoom Out"
                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 min-w-[42px] text-center text-slate-400">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                title="Zoom In"
                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                aria-label="Reset zoom"
                title="Reset 100%"
                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print document"
            title="Print Document"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download */}
          {downloadSrc && (
            <a
              href={downloadSrc}
              download
              title="Download File"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 min-h-[540px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
        {activeTab === 'stream' ? (
          <div className="relative w-full h-full flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-[#0d131f]">
            {/* Native Inline PDF/Document Object with Zoom */}
            <div
              className="w-full h-full transition-transform duration-150 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {streamSrc ? (
                <object
                  data={`${streamSrc}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full min-h-[520px] rounded-xl border border-slate-800 shadow-xl bg-slate-900"
                >
                  {/* Fallback displayed inside <object> if browser PDF plugin is missing or mobile device */}
                  <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center p-6 text-center bg-slate-900/95 text-slate-200">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-100 mb-1">
                      {docName}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
                      {isUr
                        ? 'یہ دستاویز سرور کے ذریعے براہ راست دستیاب ہے۔ موبائل ڈیوائسز اور بغیر پی ڈی ایف پلگ ان براؤزرز پر آپ اسے فوری طور پر ڈاؤن لوڈ یا نئے ٹیب میں دیکھ سکتے ہیں۔'
                        : 'Google Drive preview has been disabled. You can download or view this official document directly from our secure server proxy without any Google authentication.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {downloadSrc && (
                        <a
                          href={downloadSrc}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isUr ? 'دستاویز ڈاؤن لوڈ کریں' : 'Download Document'}</span>
                        </a>
                      )}
                      <a
                        href={streamSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{isUr ? 'مکمل اسکرین میں کھولیں' : 'Open in New Tab'}</span>
                      </a>
                    </div>
                  </div>
                </object>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <FileText className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-300">
                    {isUr ? 'دستاویز کا ایڈریس دستیاب نہیں ہے' : 'Document File Stream Pending'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SOP & Operational Guidance Tab */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full">
            {/* Purpose & Responsibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>{isUr ? 'آپریشنل مقصد' : 'Operational Purpose'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUr
                    ? (doc.purposeUr || 'پولیو مہم کے دوران ریکارڈ کی درستگی اور مائیکروپلاننگ کی توثیق کے لیے باضابطہ دستاویز۔')
                    : (doc.purposeEn || 'Official operational document for microplan validation, monitoring tally, and campaign verification.')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <UserCheck className="w-4 h-4" />
                  <span>{isUr ? 'کون پر کرتا ہے اور نگران کا جائزہ' : 'Who Fills & Reviews'}</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    <strong className="text-slate-200">{isUr ? 'پر کنندہ: ' : 'Filled By: '}</strong>
                    {isUr ? (doc.filledByUr || 'ایریا انچارج / یو سی اسٹاف') : (doc.filledByEn || 'Area In-charge / UC Staff')}
                  </p>
                  <p>
                    <strong className="text-slate-200">{isUr ? 'نگران کا جائزہ: ' : 'Reviewed By: '}</strong>
                    {isUr ? (doc.supervisorReviewUr || 'روزانہ شام کی ڈی بریفنگ میں یو سی ایم او اور ڈسٹرکٹ مانیٹر') : (doc.supervisorReviewEn || 'UCMO & District Monitors during evening debrief')}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Columns & Checklist */}
            {(doc.columnsEn || doc.columnsUr) && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isUr ? 'اہم کالمز اور فیلڈ کے تقاضے' : 'Key Columns & Field Entry Protocol'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isUr ? doc.columnsUr || doc.columnsEn : doc.columnsEn || doc.columnsUr || []).map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field Tips & Common Errors */}
            {(doc.tipsEn || doc.tipsUr) && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{isUr ? 'فیلڈ میں عام غلطیوں سے بچاؤ کے رہنما اصول' : 'Field Guidelines & Error Prevention'}</span>
                </h4>
                <div className="space-y-2">
                  {(isUr ? doc.tipsUr || doc.tipsEn : doc.tipsEn || doc.tipsUr || []).map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
