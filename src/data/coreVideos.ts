import { FolderDefinition, VideoItem } from '../types';
import {
  Stethoscope,
  ShieldCheck,
  Users,
  Landmark,
  FileVideo,
  BookOpen,
  HelpCircle,
  FolderArchive,
  FileCheck,
} from 'lucide-react';

export const MASTER_FOLDER_URL = 'https://drive.google.com/drive/u/0/folders/102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';
export const MASTER_FOLDER_ID = '102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';
export const MASTER_FOLDER_NAME = 'Polio Tool Kit';

export const BASE_COMMUNICATION_FOLDERS: FolderDefinition[] = [
  {
    id: 'healthcare_professionals_videos',
    titleEn: 'Health Care Professionals videos',
    titleUr: 'ہیلتھ کیئر پروفیشنلز ویڈیوز',
    shortTitleEn: 'Health Care Professionals',
    shortTitleUr: 'ہیلتھ کیئر پروفیشنلز',
    descriptionEn: '18 video statements and clinical guidance from pediatricians, DHOs, and medical experts endorsing bOPV safety.',
    descriptionUr: 'ماہرین اطفال، میڈیکل آفیسرز اور حفاظتی ٹیکہ جات کے ماہرین کے 18 مستند طبی پیغامات برائے ویکسین حفاظت و صحت۔',
    icon: Stethoscope,
    badgeEn: '18 Videos',
    badgeUr: '18 ویڈیوز',
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv',
    accentColor: 'from-teal-600 to-emerald-700',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  {
    id: 'religious_leaders_videos',
    titleEn: 'Health are Religious leaders videos',
    titleUr: 'مذہبی رہنما و علمائے کرام ویڈیوز',
    shortTitleEn: 'Religious Leaders',
    shortTitleUr: 'علمائے کرام و مذہبی رہنما',
    descriptionEn: '13 official video endorsements and fatwas from Grand Muftis and Islamic scholars confirming Shariah compliance and Halal status.',
    descriptionUr: 'اسلامی نظریاتی کونسل اور جید مفتیان کرام کے 13 تصدیق شدہ فتاویٰ برائے حلال حیثیت و شرعی تحفظ اطفال۔',
    icon: ShieldCheck,
    badgeEn: '13 Videos',
    badgeUr: '13 ویڈیوز',
    driveFolderUrl: 'https://drive.google.com/drive/u/0/folders/102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv',
    accentColor: 'from-emerald-600 to-teal-800',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
];

/**
 * Drive-Only Mode: Extra mock videos have been completely removed.
 * Only videos and items genuinely synced from the user's Google Drive are loaded.
 */
export const CORE_VIDEO_ITEMS: VideoItem[] = [];
