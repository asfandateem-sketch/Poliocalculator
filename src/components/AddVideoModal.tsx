import React, { useState } from 'react';
import { VideoItem, FolderDefinition, FolderId } from '../types';
import { extractDriveId } from './VideosSection';
import {
  X,
  Plus,
  Sparkles,
  Check,
  AlertCircle,
  HardDrive,
  CheckCircle2,
  Video,
  User,
  Clock,
  FileText,
  Folder,
} from 'lucide-react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FolderDefinition[];
  isUrdu: boolean;
  onAddVideo: (video: VideoItem) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  categories,
  isUrdu,
  onAddVideo,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'single' | 'batch'>('single');

  // Single form state
  const [driveUrl, setDriveUrl] = useState('');
  const [targetFolder, setTargetFolder] = useState<FolderId>('healthcare_professionals');
  const [titleEn, setTitleEn] = useState('');
  const [titleUr, setTitleUr] = useState('');
  const [speakerEn, setSpeakerEn] = useState('');
  const [speakerUr, setSpeakerUr] = useState('');
  const [designationEn, setDesignationEn] = useState('');
  const [designationUr, setDesignationUr] = useState('');
  const [duration, setDuration] = useState('4:00 mins');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryUr, setSummaryUr] = useState('');

  // Batch state
  const [batchText, setBatchText] = useState('');

  // Status & AI state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill using Gemini AI
  const handleAiAutoFill = async () => {
    const raw = driveUrl.trim() || titleEn.trim();
    if (!raw) {
      setErrorMsg(isUrdu ? 'پہلے ویڈیو لنک یا فائل کا نام درج کریں۔' : 'Please provide a video link or filename first.');
      return;
    }

    setIsAiLoading(true);
    setErrorMsg(null);

    try {
      const folderName = categories.find((c) => c.id === targetFolder)?.shortTitleEn || 'Healthcare Professionals';
      const fileId = extractDriveId(raw);
      const queryName = titleEn.trim() || raw;

      const res = await fetch('/api/drive/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: queryName,
          folderName: folderName,
        }),
      });

      if (!res.ok) throw new Error('AI service error');
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        if (d.titleEn) setTitleEn(d.titleEn);
        if (d.titleUr) setTitleUr(d.titleUr);
        if (d.speakerEn && (!speakerEn || speakerEn === 'Health Expert')) setSpeakerEn(d.speakerEn);
        if (d.speakerUr && (!speakerUr || speakerUr === 'طبی ماہر')) setSpeakerUr(d.speakerUr);
        if (d.designationEn) setDesignationEn(d.designationEn);
        if (d.designationUr) setDesignationUr(d.designationUr);
        if (d.summaryEn) setSummaryEn(d.summaryEn);
        if (d.summaryUr) setSummaryUr(d.summaryUr);

        if (fileId && !thumbnailUrl) {
          setThumbnailUrl(`https://drive.google.com/thumbnail?id=${fileId}&sz=w640`);
        }
      }
    } catch (err: any) {
      setErrorMsg(isUrdu ? 'AI ڈیٹا تیار کرنے میں مسئلہ پیش آیا، برائے مہربانی معلومات دستی درج کریں۔' : 'Could not auto-generate AI details. You can enter them manually.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fileId = extractDriveId(driveUrl);
    if (!fileId) {
      setErrorMsg(
        isUrdu
          ? 'برائے مہربانی درست میڈیا لنک یا فائل آئی ڈی درج کریں۔'
          : 'Please enter a valid video link or file ID (e.g. https://drive.google.com/file/d/...)'
      );
      return;
    }

    const cleanTitleEn = titleEn.trim() || `${speakerEn || 'Healthcare'} Video (${fileId.slice(0, 6)})`;
    const cleanTitleUr = titleUr.trim() || cleanTitleEn;

    const newVideo: VideoItem = {
      id: `user-${fileId}-${Date.now()}`,
      folderId: targetFolder,
      titleEn: cleanTitleEn,
      titleUr: cleanTitleUr,
      speakerEn: speakerEn.trim() || 'Health Professional / Champion',
      speakerUr: speakerUr.trim() || 'طبی ماہر / کمیونٹی چیمپئن',
      designationEn: designationEn.trim() || 'Official Resource',
      designationUr: designationUr.trim() || 'مستند ریسورس',
      duration: duration.trim() || '3:30 mins',
      driveFileId: fileId,
      driveUrl: driveUrl.startsWith('http') ? driveUrl : `https://drive.google.com/file/d/${fileId}/view`,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: thumbnailUrl.trim() || `https://drive.google.com/thumbnail?id=${fileId}&sz=w640`,
      badgeEn: 'Verified',
      badgeUr: 'تصدیق شدہ',
      summaryEn: summaryEn.trim() || 'Video resource added to campaign library.',
      summaryUr: summaryUr.trim() || 'مہم کی آگاہی لائبریری کے لیے شامل کردہ ویڈیو پیغام۔',
      keyPointsEn: ['Verified video resource for campaign communication.'],
      keyPointsUr: ['مہم کی آگاہی اور ابلاغ کے لیے تصدیق شدہ ویڈیو مواد۔'],
      fieldScenarioEn: 'Use during refusal conversion or community awareness sessions.',
      fieldScenarioUr: 'انکاری والدین اور کمیونٹی آگاہی سیشنز کے دوران استعمال کریں۔',
      isUserAdded: true,
      updatedAt: new Date().toISOString(),
    };

    onAddVideo(newVideo);
    setSuccessMsg(isUrdu ? 'ویڈیو ویب سائٹ پر شامل ہو گئی!' : 'Video added to website successfully!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const raw = batchText.trim();
    if (!raw) {
      setErrorMsg(isUrdu ? 'برائے مہربانی کم از کم ایک گوگل ڈرائیو لنک درج کریں۔' : 'Please provide at least one Drive link.');
      return;
    }

    const lines = raw.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
    let count = 0;

    for (const line of lines) {
      let title = '';
      let urlPart = line;

      if (line.includes('|')) {
        const parts = line.split('|');
        title = parts[0].trim();
        urlPart = parts.slice(1).join('|').trim();
      }

      const fileId = extractDriveId(urlPart);
      if (!fileId) continue;

      const cleanTitle = title || `Drive Video (${fileId.slice(0, 8)})`;

      const item: VideoItem = {
        id: `batch-${fileId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        folderId: targetFolder,
        titleEn: cleanTitle,
        titleUr: cleanTitle,
        speakerEn: 'Health Expert / Community Champion',
        speakerUr: 'طبی ماہر / کمیونٹی چیمپئن',
        designationEn: 'Media Resource',
        designationUr: 'میڈیا ریسورس',
        duration: 'Video Clip',
        driveFileId: fileId,
        driveUrl: urlPart.startsWith('http') ? urlPart : `https://drive.google.com/file/d/${fileId}/view`,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w640`,
        badgeEn: 'Verified',
        badgeUr: 'تصدیق شدہ',
        summaryEn: 'Video resource added to campaign library.',
        summaryUr: 'مہم کی آگاہی لائبریری کے لیے شامل کردہ ویڈیو پیغام۔',
        keyPointsEn: ['Verified video resource for campaign communication.'],
        keyPointsUr: ['مہم کی آگاہی اور ابلاغ کے لیے تصدیق شدہ ویڈیو مواد۔'],
        fieldScenarioEn: 'Use during refusal conversion or community awareness sessions.',
        fieldScenarioUr: 'انکاری والدین اور کمیونٹی آگاہی سیشنز کے دوران استعمال کریں۔',
        isUserAdded: true,
        updatedAt: new Date().toISOString(),
      };

      onAddVideo(item);
      count++;
    }

    if (count === 0) {
      setErrorMsg(isUrdu ? 'کوئی درست ویڈیو لنک نہیں ملا۔' : 'No valid video links were found.');
      return;
    }

    setSuccessMsg(isUrdu ? `${count} ویڈیوز کامیابی سے شامل ہو گئیں!` : `${count} videos added successfully!`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>{isUrdu ? 'نئی ویڈیو شامل کریں' : 'Add Campaign Video'}</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono border border-teal-400/30">
                  AI Ready
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isUrdu
                  ? 'ویڈیو لنک درج کریں، AI خودکار عنوان و تفصیل تیار کرے گا'
                  : 'Paste video link — AI automatically writes titles, speakers, and clinical summaries'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Single Video vs Batch Links */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`pb-2.5 px-3 font-bold cursor-pointer transition border-b-2 flex items-center gap-1.5 ${
              mode === 'single'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ایک ویڈیو (AI معاون)' : 'Single Video (with AI)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('batch')}
            className={`pb-2.5 px-3 font-bold cursor-pointer transition border-b-2 flex items-center gap-1.5 ${
              mode === 'batch'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ایک سے زیادہ لنکس (Batch)' : 'Multiple Links (Batch)'}</span>
          </button>
        </div>

        {/* Alert banners */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2 px-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 px-5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 text-xs space-y-4">
          {mode === 'single' ? (
            <form onSubmit={handleSingleSubmit} id="add-single-video-form" className="space-y-4">
              {/* Video Link with AI Button */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {isUrdu ? 'ویڈیو لنک یا فائل آئی ڈی *' : 'Video Link or File ID *'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/1lhdR4hNbFfSYtkff86vclmH-r4vzUmgP/view"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiLoading || !driveUrl.trim()}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50 flex-shrink-0"
                    title="Auto-fill title, speaker, and clinical summary using Gemini AI"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isAiLoading ? (isUrdu ? 'تیار ہو رہا ہے...' : 'AI Generating...') : (isUrdu ? 'AI سے پُر کریں' : 'Auto-Fill with AI')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports video file links, preview links, or file IDs.
                </p>
              </div>

              {/* Target Category */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {isUrdu ? 'کیٹیگری فولڈر منتخب کریں' : 'Category Folder'}
                </label>
                <select
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value as FolderId)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isUrdu ? c.titleUr : c.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Titles in English and Urdu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Dr. Name: Safety of Multiple Doses"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    عنوان (اردو)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleUr}
                    onChange={(e) => setTitleUr(e.target.value)}
                    placeholder="مثال: ڈاکٹر کا نام: پولیو قطروں کی سائنسی افادیت"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-urdu"
                  />
                </div>
              </div>

              {/* Speaker and Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Speaker / Doctor Name
                  </label>
                  <input
                    type="text"
                    value={speakerEn}
                    onChange={(e) => setSpeakerEn(e.target.value)}
                    placeholder="e.g. Prof. Dr. Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Designation / Organization
                  </label>
                  <input
                    type="text"
                    value={designationEn}
                    onChange={(e) => setDesignationEn(e.target.value)}
                    placeholder="e.g. Senior Pediatrician, PPA KP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Duration and Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4:15 mins"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Custom Thumbnail URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Auto-generated from media link"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Description / Summary */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Description / Clinical Summary (English)
                </label>
                <textarea
                  rows={2}
                  value={summaryEn}
                  onChange={(e) => setSummaryEn(e.target.value)}
                  placeholder="Summary of medical advice and guidance for caregivers..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  خلاصہ و رہنمائی (اردو)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={summaryUr}
                  onChange={(e) => setSummaryUr(e.target.value)}
                  placeholder="طبی رہنمائی اور انکاری والدین کو مطمئن کرنے کے اہم نکات..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-urdu"
                />
              </div>
            </form>
          ) : (
            <form onSubmit={handleBatchSubmit} id="add-batch-video-form" className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-1">
                <p className="font-bold">Paste multiple video links or File IDs:</p>
                <p className="text-[11px] text-teal-800">
                  One per line. You can optionally include a title: <span className="font-mono font-bold">Title | https://drive.google.com/file/d/...</span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Category Folder
                </label>
                <select
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value as FolderId)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isUrdu ? c.titleUr : c.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Drive Links (One per line) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={`Dr. Aisha Malik Video | https://drive.google.com/file/d/1lhdR4hNbFfSYtkff86vclmH-r4vzUmgP/view\nDr. Tariq Mahmood Video | https://drive.google.com/file/d/1lhdR4hNbFfSYtkff86vclmH-r4vzUmgP/view`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            {isUrdu ? 'منسوخ کریں' : 'Cancel'}
          </button>

          {mode === 'single' ? (
            <button
              type="submit"
              form="add-single-video-form"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'ویڈیو شامل کریں' : 'Add Video to Website'}</span>
            </button>
          ) : (
            <button
              type="submit"
              form="add-batch-video-form"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'تمام ویڈیوز شامل کریں' : 'Import All Videos'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
