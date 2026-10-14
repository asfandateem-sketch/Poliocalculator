import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Calendar,
  MapPin,
  Building2,
  Tag,
  Video,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import type { PolioUpdate, UpdateCategory } from '../data/updates';
import { addUserManualUpdate, updateUserManualUpdate } from '../data/updates';
import { triggerHaptic } from '../haptics';

interface AddUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUrdu: boolean;
  editingUpdate?: PolioUpdate | null;
  onSaved?: (update: PolioUpdate) => void;
}

const CATEGORIES: Array<{ key: UpdateCategory; labelEn: string; labelUr: string }> = [
  { key: 'Campaigns', labelEn: 'Campaigns', labelUr: 'پولیو مہمات' },
  { key: 'Activities', labelEn: 'Activities', labelUr: 'سرگرمیاں' },
  { key: 'Announcements', labelEn: 'Announcements', labelUr: 'اعلانات' },
  { key: 'Media & Videos', labelEn: 'Media & Videos', labelUr: 'میڈیا و ویڈیوز' },
  { key: 'Programme Updates', labelEn: 'Programme Updates', labelUr: 'پروگرام اپڈیٹس' },
];

const OFFICIAL_SOURCES = [
  { name: 'EOC Pakhtunkhwa', url: 'https://www.facebook.com/eocpakhtunkhwa' },
  { name: 'Pakistan Polio Eradication Initiative', url: 'https://www.facebook.com/polioeradicationinitiative' },
  { name: 'Khyber Pakhtunkhwa Polio Programme', url: 'https://www.facebook.com/profile.php?id=100077497336541' },
  { name: 'National Health Ministry / WHO', url: 'https://www.who.int' },
  { name: 'Field Operational Cell', url: '' },
];

export const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
  isOpen,
  onClose,
  isUrdu,
  editingUpdate,
  onSaved,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState(editingUpdate?.title || '');
  const [titleUr, setTitleUr] = useState(editingUpdate?.titleUr || '');
  const [category, setCategory] = useState<UpdateCategory>(editingUpdate?.category || 'Campaigns');
  const [date, setDate] = useState(editingUpdate?.date || todayStr);
  const [location, setLocation] = useState(editingUpdate?.location || 'Khyber Pakhtunkhwa');
  const [locationUr, setLocationUr] = useState(editingUpdate?.locationUr || 'خیبر پختونخوا');
  const [sourceName, setSourceName] = useState(editingUpdate?.sourceName || 'EOC Pakhtunkhwa');
  const [summary, setSummary] = useState(editingUpdate?.summary || '');
  const [summaryUr, setSummaryUr] = useState(editingUpdate?.summaryUr || '');
  const [content, setContent] = useState(editingUpdate?.content || '');
  const [contentUr, setContentUr] = useState(editingUpdate?.contentUr || '');
  const [videoUrl, setVideoUrl] = useState(editingUpdate?.videoUrl || '');
  const [targetChildren, setTargetChildren] = useState(editingUpdate?.factBox?.targetChildren || '');
  const [workersCount, setWorkersCount] = useState(editingUpdate?.factBox?.frontlineWorkers || '');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() && !titleUr.trim()) {
      setErrorMsg(isUrdu ? 'برائے مہربانی عنوان درج کریں۔' : 'Please provide a title for the update.');
      return;
    }

    const finalTitle = title.trim() || titleUr.trim();
    const finalTitleUr = titleUr.trim() || title.trim();

    // Auto-generate clean slug
    const baseSlug = finalTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `update-${Date.now()}`;
    const slug = editingUpdate ? editingUpdate.slug : `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const id = editingUpdate ? editingUpdate.id : `user-update-${Date.now()}`;

    // Format display date
    const dateObj = new Date(date);
    const displayDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : date;

    const sourceObj = OFFICIAL_SOURCES.find((s) => s.name === sourceName);
    const sourceUrl = sourceObj?.url || 'https://www.facebook.com/eocpakhtunkhwa';

    const catObj = CATEGORIES.find((c) => c.key === category);
    const categoryUr = catObj?.labelUr || 'پولیو مہمات';

    const newUpdate: PolioUpdate = {
      id,
      slug,
      title: finalTitle,
      titleUr: finalTitleUr,
      date,
      displayDate,
      displayDateUr: displayDate,
      category,
      categoryUr,
      location: location.trim() || 'Pakistan',
      locationUr: locationUr.trim() || 'پاکستان',
      featured: false,
      summary: summary.trim() || finalTitle,
      summaryUr: summaryUr.trim() || finalTitleUr,
      content: content.trim() || finalTitle,
      contentUr: contentUr.trim() || finalTitleUr,
      sourceName,
      sourceUrl,
      facebookPostUrl: sourceUrl,
      videoUrl: videoUrl.trim() || undefined,
      factBox: {
        campaignName: finalTitle,
        dates: displayDate,
        location: location.trim() || 'Pakistan',
        targetChildren: targetChildren.trim() || undefined,
        frontlineWorkers: workersCount.trim() || undefined,
        supervision: sourceName,
        keyDirectives: [
          'Administer 2 drops of bOPV to every child under 5',
          'Mark finger nail with indelible ink marker',
          'Conduct comprehensive evening sweep for missed children',
        ],
      },
      tags: [sourceName, category, location].filter(Boolean),
      relatedCalculatorIds: ['calc-1', 'calc-2', 'calc-7'],
      relatedPlatformCategory: 'calculators',
    };

    if (editingUpdate) {
      updateUserManualUpdate(newUpdate);
    } else {
      addUserManualUpdate(newUpdate);
    }

    triggerHaptic('success');
    if (onSaved) onSaved(newUpdate);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              {editingUpdate ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingUpdate
                  ? (isUrdu ? 'اعلامیہ میں ترمیم کریں' : 'Edit Campaign Dispatch')
                  : (isUrdu ? 'نیا مہماتی اعلامیہ شائع کریں' : 'Publish Campaign Dispatch')}
              </h3>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? 'نیا فیلڈ شیڈول، مہماتی ہدایات یا ویڈیو لنک شامل کریں'
                  : 'Add verified campaign bulletins, directives, or video recordings'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isUrdu ? 'زمرہ (Category)' : 'Dispatch Category'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    category === c.key
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isUrdu ? c.labelUr : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {isUrdu ? 'عنوان (English)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. EOC KP Launches October SNID Campaign"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-arabic">
                {isUrdu ? 'عنوان (اردو)' : 'Title (Urdu)'}
              </label>
              <input
                type="text"
                value={titleUr}
                onChange={(e) => setTitleUr(e.target.value)}
                placeholder="مثلاً: خیبر پختونخوا میں اکتوبر انسدادِ پولیو مہم کا آغاز"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-arabic"
              />
            </div>
          </div>

          {/* Source & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {isUrdu ? 'ماخذ / ادارہ (Official Source)' : 'Official Source'}
              </label>
              <select
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
              >
                {OFFICIAL_SOURCES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {isUrdu ? 'تاریخ (Date)' : 'Dispatch Date'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {isUrdu ? 'مقام (Location En)' : 'Location (English)'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Khyber Pakhtunkhwa / Peshawar / Nationwide"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 font-arabic">
                {isUrdu ? 'مقام (اردو)' : 'Location (Urdu)'}
              </label>
              <input
                type="text"
                value={locationUr}
                onChange={(e) => setLocationUr(e.target.value)}
                placeholder="خیبر پختونخوا / پشاور / ملک بھر میں"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-arabic"
              />
            </div>
          </div>

          {/* Optional Video Link (Supports Google Drive, Facebook, YouTube) */}
          <div className="space-y-1 p-3 rounded-2xl bg-teal-50/60 border border-teal-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-0.5">
              <Video className="w-3.5 h-3.5 text-teal-700" />
              <span>{isUrdu ? 'گوگل ڈرائیو ویڈیو یا یوٹیوب لنک (اختیاری)' : 'Video Recording Link (Google Drive / YouTube)'}</span>
            </div>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... or YouTube link"
              className="w-full px-3 py-2 text-xs bg-white border border-teal-300 rounded-xl focus:border-teal-600 outline-none text-slate-800"
            />
            <p className="text-[10px] text-teal-700">
              {isUrdu
                ? 'گوگل ڈرائیو ویڈیو کا لنک شامل کریں، یہ خودکار طور پر ویب سائٹ پر بغیر کسی ایرر کے چلے گی۔'
                : 'Paste any Google Drive or YouTube link to enable in-app streaming with zero errors.'}
            </p>
          </div>

          {/* Key Summary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {isUrdu ? 'مختصر خلاصہ (Executive Summary)' : 'Executive Summary'}
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of campaign dates, targets, or instructions..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
            />
          </div>

          {/* Detailed Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {isUrdu ? 'تفصیلی ہدایات / اعلانیہ (Detailed Content)' : 'Detailed Directives / Notes'}
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed bullet points, team allocations, helpline numbers..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-mono text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              {isUrdu ? 'منسوخ کریں' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {editingUpdate
                  ? (isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save Changes')
                  : (isUrdu ? 'اعلامیہ شائع کریں' : 'Publish Dispatch')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
