import React, { useState } from 'react';
import { VideoItem, FolderDefinition } from '../types';
import {
  X,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  FileVideo,
  User,
  Folder,
  Clock,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem | null;
  categories: FolderDefinition[];
  isUrdu: boolean;
  onSave: (updatedVideo: VideoItem) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  video,
  categories,
  isUrdu,
  onSave,
}) => {
  if (!isOpen || !video) return null;

  const [titleEn, setTitleEn] = useState(video.titleEn || '');
  const [titleUr, setTitleUr] = useState(video.titleUr || '');
  const [summaryEn, setSummaryEn] = useState(video.summaryEn || '');
  const [summaryUr, setSummaryUr] = useState(video.summaryUr || '');
  const [speakerEn, setSpeakerEn] = useState(video.speakerEn || '');
  const [speakerUr, setSpeakerUr] = useState(video.speakerUr || '');
  const [designationEn, setDesignationEn] = useState(video.designationEn || '');
  const [designationUr, setDesignationUr] = useState(video.designationUr || '');
  const [folderId, setFolderId] = useState<string>(video.folderId);
  const [duration, setDuration] = useState(video.duration || 'Video Clip');
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl || '');
  const [fieldScenarioEn, setFieldScenarioEn] = useState(video.fieldScenarioEn || '');
  const [fieldScenarioUr, setFieldScenarioUr] = useState(video.fieldScenarioUr || '');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceSuccess, setEnhanceSuccess] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  // AI Re-enhance with Gemini
  const handleAIEnhance = async () => {
    setIsEnhancing(true);
    setEnhanceError(null);
    setEnhanceSuccess(false);

    try {
      const folderMeta = categories.find((c) => c.id === folderId);
      const filename = video.originalFilename || video.titleEn || 'Polio_Vaccination_Video.mp4';

      const response = await fetch('/api/drive/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          folderName: folderMeta ? folderMeta.shortTitleEn : 'Healthcare Professionals',
        }),
      });

      if (!response.ok) {
        throw new Error(`AI enhancement failed (${response.status})`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        setTitleEn(d.titleEn || titleEn);
        setTitleUr(d.titleUr || titleUr);
        setSummaryEn(d.summaryEn || summaryEn);
        setSummaryUr(d.summaryUr || summaryUr);
        setSpeakerEn(d.speakerEn || speakerEn);
        setSpeakerUr(d.speakerUr || speakerUr);
        setDesignationEn(d.designationEn || designationEn);
        setDesignationUr(d.designationUr || designationUr);
        if (d.fieldScenarioEn) setFieldScenarioEn(d.fieldScenarioEn);
        if (d.fieldScenarioUr) setFieldScenarioUr(d.fieldScenarioUr);
        setEnhanceSuccess(true);
        setTimeout(() => setEnhanceSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('AI Enhance error:', err);
      setEnhanceError(err.message || 'AI service unavailable. Please adjust fields manually.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: VideoItem = {
      ...video,
      titleEn: titleEn.trim() || video.titleEn,
      titleUr: titleUr.trim() || titleEn.trim() || video.titleUr,
      summaryEn: summaryEn.trim() || video.summaryEn,
      summaryUr: summaryUr.trim() || video.summaryUr,
      speakerEn: speakerEn.trim() || video.speakerEn,
      speakerUr: speakerUr.trim() || video.speakerUr,
      designationEn: designationEn.trim() || video.designationEn,
      designationUr: designationUr.trim() || video.designationUr,
      folderId,
      duration: duration.trim() || video.duration,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      fieldScenarioEn: fieldScenarioEn.trim() || video.fieldScenarioEn,
      fieldScenarioUr: fieldScenarioUr.trim() || video.fieldScenarioUr,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileVideo className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {isUrdu ? 'ویڈیو تفصیلات میں ترمیم' : 'Edit Video Details'}
              </h3>
              <p className="text-xs text-teal-200 font-mono">
                ID: {video.driveFileId || video.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAIEnhance}
              disabled={isEnhancing}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow transition disabled:opacity-50 cursor-pointer"
              title="Generate clean title & description from filename using Gemini AI without inventing facts"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? (isUrdu ? 'اے آئی تیاری...' : 'AI Processing...') : (isUrdu ? 'اے آئی ریفائن' : 'AI Polish')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI status banner */}
        {enhanceSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 px-4 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {isUrdu
                ? 'اے آئی نے عنوان، تفصیل اور اسپیکر کا نام کامیابی سے اپڈیٹ کر دیا۔'
                : 'Gemini AI successfully refined title and descriptions based on filename.'}
            </span>
          </div>
        )}

        {enhanceError && (
          <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-4 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{enhanceError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Filename Reference */}
          {video.originalFilename && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Original Drive Filename:</span>
              <span className="font-mono text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
                {video.originalFilename}
              </span>
            </div>
          )}

          {/* Title EN & UR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Video Title (English) *
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                placeholder="e.g. Dr. Name: Clinical Safety Guidance"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                ویڈیو کا عنوان (اردو) *
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleUr}
                onChange={(e) => setTitleUr(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 font-urdu text-right"
                placeholder="مثال: ڈاکٹر کا نام: پولیو قطروں کی طبی حفاظت"
              />
            </div>
          </div>

          {/* Speaker & Designation EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Speaker Name (English)</span>
              </label>
              <input
                type="text"
                value={speakerEn}
                onChange={(e) => setSpeakerEn(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                placeholder="e.g. Dr. Syed Bawar Shah"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                مقرر کا نام (اردو)
              </label>
              <input
                type="text"
                dir="rtl"
                value={speakerUr}
                onChange={(e) => setSpeakerUr(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 font-urdu text-right"
                placeholder="مثال: ڈاکٹر سید باور شاہ"
              />
            </div>
          </div>

          {/* Designation EN & UR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation / Organization (English)
              </label>
              <input
                type="text"
                value={designationEn}
                onChange={(e) => setDesignationEn(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                placeholder="e.g. President, Pakistan Pediatric Association KP"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                عہدہ یا ادارہ (اردو)
              </label>
              <input
                type="text"
                dir="rtl"
                value={designationUr}
                onChange={(e) => setDesignationUr(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 font-urdu text-right"
                placeholder="مثال: صدر پاکستان پیڈیاٹرک ایسوسی ایشن کے پی"
              />
            </div>
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-slate-500" />
                <span>Drive Folder / Category</span>
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.shortTitleEn} ({cat.shortTitleUr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Duration Display</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                placeholder="e.g. 4:15 mins or 3 mins"
              />
            </div>
          </div>

          {/* Description / Summary EN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Factual Summary (English)
            </label>
            <textarea
              rows={2}
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              placeholder="Brief 1-2 sentence overview of what is covered in this video..."
            />
          </div>

          {/* Description / Summary UR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
              تفصیل و خلاصہ (اردو)
            </label>
            <textarea
              rows={2}
              dir="rtl"
              value={summaryUr}
              onChange={(e) => setSummaryUr(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 font-urdu text-right"
              placeholder="ویڈیو کا مختصر تعارف اور مقصد..."
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Custom Thumbnail URL (Optional)</span>
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              placeholder="https://... (Leave blank to use automatic Google Drive thumbnail)"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              {isUrdu ? 'منسوخ کریں' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isUrdu ? 'محفوظ کریں' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
