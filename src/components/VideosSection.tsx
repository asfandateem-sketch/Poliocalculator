import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import {
  FileVideo,
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  Share2,
  X,
  ExternalLink,
} from 'lucide-react';

interface VideoItem {
  id: string;
  titleEn: string;
  titleUr: string;
  duration: string;
  categoryEn: string;
  categoryUr: string;
  thumbnailColor: string;
  summaryEn: string;
  summaryUr: string;
  takeawaysEn: string[];
  takeawaysUr: string[];
}

const VIDEO_ITEMS: VideoItem[] = [
  {
    id: 'vid-1',
    titleEn: 'Proper Finger Marking & Indelible Ink Application',
    titleUr: 'بچے کی انگلی پر انمٹ سیاہی کا درست طریقہ',
    duration: '3:45 mins',
    categoryEn: 'Administration',
    categoryUr: 'ویکسین طریقہ کار',
    thumbnailColor: 'from-teal-800 to-emerald-900',
    summaryEn: 'Watch a clinical demonstration of marking the left pinky finger from the cuticle over the nail bed, ensuring tamper-proof validation during supervisory monitor sweeps.',
    summaryUr: 'بچے کے بائیں ہاتھ کی چھوٹی انگلی کے ناخن اور جلد پر انمٹ سیاہی لگانے کا مکمل فیلڈ مظاہرہ تاکہ مانیٹرنگ ٹیمیں باآسانی تصدیق کر سکیں۔',
    takeawaysEn: [
      'Mark only after drops are swallowed successfully.',
      'Cover at least 5mm of cuticle skin and half of nail plate.',
      'Allow 5-10 seconds to dry before child touches clothing.',
    ],
    takeawaysUr: [
      'بچے کے دونوں قطرے نگلنے کے بعد ہی نشان لگائیں۔',
      'ناخن اور جلد کے جوڑ پر کم از کم 5 ملی میٹر واضح لکیر کھینچیں۔',
      'کپڑوں سے لگنے سے پہلے 5 سے 10 سیکنڈ تک سیاہی خشک ہونے دیں۔',
    ],
  },
  {
    id: 'vid-2',
    titleEn: 'Vaccine Carrier & Ice Pack Conditioning Masterclass',
    titleUr: 'ویکسین کیرئیر اور آئس پیکس کی کنڈیشنگ کا طریقہ',
    duration: '5:20 mins',
    categoryEn: 'Cold Chain',
    categoryUr: 'کولڈ چین',
    thumbnailColor: 'from-cyan-900 to-teal-800',
    summaryEn: 'Detailed field walkthrough of how dry ice packs must be conditioned at room temperature until liquid sloshes inside to prevent accidental freezing of bOPV vaccine drops.',
    summaryUr: 'آئس پیکس کو کمرے کے درجہ حرارت پر رکھنے اور پانی کی آواز آنے تک کنڈیشن کرنے کی عملی تربیت تاکہ ویکسین جمنے سے محفوظ رہے۔',
    takeawaysEn: [
      'Never place deep-frozen rigid ice packs directly against vials.',
      'Use the central foam pad to keep open vials secure and shaded.',
      'Keep carrier lid tightly shut between household stops.',
    ],
    takeawaysUr: [
      'مکمل جمی ہوئی سخت برف کے ساتھ وائلز کبھی نہ رکھیں۔',
      'کھلی ہوئی وائل کو ہمیشہ فوم پیڈ کے سوراخ میں سایہ دار رکھیں۔',
      'گھروں کے درمیان سفر میں کیرئیر کا ڈھکن سختی سے بند رکھیں۔',
    ],
  },
  {
    id: 'vid-3',
    titleEn: 'Handling Chronic Refusals: The 3-Step Dialogue',
    titleUr: 'مسلسل انکار کرنے والے خاندانوں سے گفتگو کا 3 مرحلہ وار طریقہ',
    duration: '6:10 mins',
    categoryEn: 'Communication',
    categoryUr: 'کمیونیکیشن',
    thumbnailColor: 'from-slate-800 to-teal-950',
    summaryEn: 'A real-life simulated roleplay between a field vaccinator, community elder, and a hesitant father in an urban high-risk union council.',
    summaryUr: 'شہری ہائی رسک یوسی میں فیلڈ ورکر، علاقائی معزز اور انکاری والد کے درمیان بات چیت کا عملی مظاہرہ اور کامیابی کا فارمولا۔',
    takeawaysEn: [
      'Step 1: Listen to the underlying fear without interrupting.',
      'Step 2: Reframe using community protection & Islamic health teachings.',
      'Step 3: Escalate to Area In-Charge & influencer if unresolved in 5 minutes.',
    ],
    takeawaysUr: [
      'مرحلہ 1: والد کی تشویش کو بغیر ٹوکے مکمل توجہ سے سنیں۔',
      'مرحلہ 2: اسلامی تعلیمات اور بچے کے صحت مند مستقبل کا حوالہ دیں۔',
      'مرحلہ 3: اگر 5 منٹ میں بات نہ بنے تو فوری ایریا انچارج کو مطلع کریں۔',
    ],
  },
  {
    id: 'vid-4',
    titleEn: 'Door Chalk Marking: Standard 4-Quadrant Notation',
    titleUr: 'گھر کے دروازے پر 4 خانے چاک مارکنگ کا درست نظام',
    duration: '4:15 mins',
    categoryEn: 'Field Standards',
    categoryUr: 'فیلڈ طریقہ کار',
    thumbnailColor: 'from-teal-900 to-slate-900',
    summaryEn: 'How to write standardized chalk marks on front gates showing date, team number, total children, vaccinated, and NA/R codes for flawless supervisory validation.',
    summaryUr: 'دروازے پر چاک سے تاریخ، ٹیم نمبر، کل بچے، ویکسینیٹڈ بچے اور NA/R کے کوڈز لکھنے کا مستند طریقہ۔',
    takeawaysEn: [
      'Top Left: Day/Date (e.g. 1/9).',
      'Top Right: Mobile Team Number.',
      'Bottom Left: Vaccinated / Target (e.g. 3/3).',
      'Bottom Right: Missing status (e.g. NA:1 or R:0).',
    ],
    takeawaysUr: [
      'اوپر بائیں: دن اور تاریخ (مثلاً 1/9)۔',
      'اوپر دائیں: موبائل ٹیم کا نمبر۔',
      'نیچے بائیں: ویکسینیٹڈ / ہدف بچے (مثلاً 3/3)۔',
      'نیچے دائیں: مسڈ بچوں کی تفصیل (مثلاً NA:1 یا R:0)۔',
    ],
  },
];

export const VideosSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const openVideo = (vid: VideoItem) => {
    triggerHaptic('light');
    setActiveVideo(vid);
  };

  const closeVideo = () => {
    triggerHaptic('light');
    setActiveVideo(null);
  };

  return (
    <section id="videos" className="w-full space-y-4">
      {/* Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isUrdu ? 'فیلڈ ٹریننگ ویڈیوز اور عملی مظاہرے' : 'Field Training Videos & Visual Demonstrations'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'انگلی پر نشان، کولڈ چین ہینڈلنگ اور انکاری خاندانوں سے مکالمے کے لیے ویڈیو اسباق'
                  : 'Practical video lessons on finger marking, cold chain conditioning, and refusal communication'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
            {isUrdu ? '4 عملی ویڈیوز' : '4 Video Lessons'}
          </span>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VIDEO_ITEMS.map((vid) => (
          <div
            key={vid.id}
            className="saas-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Thumbnail Poster with Play button */}
            <div
              onClick={() => openVideo(vid)}
              className={`h-40 sm:h-44 bg-gradient-to-br ${vid.thumbnailColor} relative flex items-center justify-center cursor-pointer p-4 select-none`}
            >
              {/* Play Badge */}
              <div className="w-12 h-12 rounded-full bg-white/90 text-teal-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 ml-0.5 fill-teal-800 text-teal-800" />
              </div>

              {/* Badges overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-black/40 text-white text-[11px] font-medium backdrop-blur-xs">
                  {isUrdu ? vid.categoryUr : vid.categoryEn}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/50 text-teal-200 text-[11px] font-mono font-semibold flex items-center gap-1 backdrop-blur-xs">
                  <Clock className="w-3 h-3" />
                  {vid.duration}
                </span>
              </div>
            </div>

            {/* Video Meta Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3
                  onClick={() => openVideo(vid)}
                  className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors cursor-pointer leading-snug"
                >
                  {isUrdu ? vid.titleUr : vid.titleEn}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {isUrdu ? vid.summaryUr : vid.summaryEn}
                </p>
              </div>

              {/* Takeaway Highlights */}
              <div className="pt-2 border-t border-slate-100">
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {(isUrdu ? vid.takeawaysUr : vid.takeawaysEn).slice(0, 2).map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pt}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openVideo(vid)}
                  className="w-full mt-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/70 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-teal-800" />
                  <span>{isUrdu ? 'ویڈیو اور خلاصہ دیکھیں' : 'Watch & Read Key Takeaways'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player / Transcript */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[11px] font-mono text-teal-300 font-semibold uppercase tracking-wider">
                  {isUrdu ? activeVideo.categoryUr : activeVideo.categoryEn} • {activeVideo.duration}
                </span>
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {isUrdu ? activeVideo.titleUr : activeVideo.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeVideo}
                aria-label="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Mock Display / Ready for Embed */}
            <div className={`h-52 sm:h-64 bg-gradient-to-br ${activeVideo.thumbnailColor} relative flex items-center justify-center text-center p-6 text-white`}>
              <div className="space-y-2 max-w-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-teal-500/30 border border-teal-300 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                </div>
                <p className="text-xs font-semibold text-teal-200">
                  {isUrdu ? 'عملی فیلڈ مظاہرہ سیشن' : 'Interactive Field Simulation'}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isUrdu ? activeVideo.summaryUr : activeVideo.summaryEn}
                </p>
              </div>
            </div>

            {/* Key Takeaways & Operational Transcript */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-700" />
                {isUrdu ? 'اہم فیلڈ اسباق اور رہنما نکات:' : 'Core Field Takeaways & Rules:'}
              </h4>
              <ul className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                {(isUrdu ? activeVideo.takeawaysUr : activeVideo.takeawaysEn).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isUrdu ? 'پولیو فیلڈ ٹولز ویڈیو لائبریری' : 'Polio Field Tools Operational Video Repository'}</span>
                <button
                  type="button"
                  onClick={closeVideo}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
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
