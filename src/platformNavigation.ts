/**
 * POLIO CAMPAIGN SUITE & SBC PLATFORM NAVIGATION ARCHITECTURE
 * 
 * Scalable navigation architecture designed to support the current 9 Campaign Calculators
 * and future expansion into SBC Communication, Media Library, and Staff Field Resources.
 */

import {
  Calendar,
  ShieldCheck,
  AlertCircle,
  UserX,
  AlertTriangle,
  ShieldAlert,
  Award,
  TrendingUp,
  Users,
  type LucideIcon,
  Calculator,
  MessageSquare,
  FileVideo,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import type { TranslationStrings } from './translations';

export type PlatformCategoryKey =
  | 'calculators'
  | 'communication_sbc'
  | 'media_library'
  | 'staff_resources'
  | 'campaign_tools';

export interface PlatformCategory {
  key: PlatformCategoryKey;
  labelEn: string;
  labelUr: string;
  icon: LucideIcon;
  isAvailable: boolean;
  itemCount?: number;
}

export interface CalculatorNavItem {
  id: string;
  num: string;
  icon: LucideIcon;
  category: PlatformCategoryKey;
  getNameEn: (t: TranslationStrings) => string;
  getNameUr: (t: TranslationStrings) => string;
  getShortNameEn: (t: TranslationStrings) => string;
  getShortNameUr: (t: TranslationStrings) => string;
  getBadge: (t: TranslationStrings) => string;
  getPurpose: (t: TranslationStrings) => string;
}

/**
 * Platform Categories Hierarchy (Scalable Architecture for Future Expansion)
 */
export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    key: 'calculators',
    labelEn: 'Campaign Calculators',
    labelUr: 'مہماتی حساب کار',
    icon: Calculator,
    isAvailable: true,
    itemCount: 9,
  },
  {
    key: 'communication_sbc',
    labelEn: 'Communication & SBC',
    labelUr: 'سماجی و رویہ جاتی تبدیلی (SBC)',
    icon: MessageSquare,
    isAvailable: false,
  },
  {
    key: 'media_library',
    labelEn: 'Media Library',
    labelUr: 'میڈیا لائبریری',
    icon: FileVideo,
    isAvailable: false,
  },
  {
    key: 'staff_resources',
    labelEn: 'Staff Resources',
    labelUr: 'اسٹاف اور فیلڈ گائیڈز',
    icon: BookOpen,
    isAvailable: false,
  },
  {
    key: 'campaign_tools',
    labelEn: 'Planning Tools',
    labelUr: 'مہم پلاننگ ٹولز',
    icon: ClipboardList,
    isAvailable: false,
  },
];

/**
 * Registry of all 9 Campaign Calculators with exact titles and numbers
 */
export const CALCULATOR_ITEMS: CalculatorNavItem[] = [
  {
    id: 'calc-1',
    num: '01',
    icon: Calendar,
    category: 'calculators',
    getNameEn: (t) => t.childAge.title,
    getNameUr: (t) => t.childAge.title,
    getShortNameEn: (t) => t.childAge.shortTitle,
    getShortNameUr: (t) => t.childAge.shortTitle,
    getBadge: (t) => t.childAge.badge,
    getPurpose: (t) => t.childAge.purpose,
  },
  {
    id: 'calc-2',
    num: '02',
    icon: ShieldCheck,
    category: 'calculators',
    getNameEn: (t) => t.vaccineDemand.title,
    getNameUr: (t) => t.vaccineDemand.title,
    getShortNameEn: (t) => t.vaccineDemand.shortTitle,
    getShortNameUr: (t) => t.vaccineDemand.shortTitle,
    getBadge: (t) => t.vaccineDemand.badge,
    getPurpose: (t) => t.vaccineDemand.purpose,
  },
  {
    id: 'calc-3',
    num: '03',
    icon: AlertCircle,
    category: 'calculators',
    getNameEn: (t) => t.vaccineWastage.title,
    getNameUr: (t) => t.vaccineWastage.title,
    getShortNameEn: (t) => t.vaccineWastage.shortTitle,
    getShortNameUr: (t) => t.vaccineWastage.shortTitle,
    getBadge: (t) => t.vaccineWastage.badge,
    getPurpose: (t) => t.vaccineWastage.purpose,
  },
  {
    id: 'calc-4',
    num: '04',
    icon: UserX,
    category: 'calculators',
    getNameEn: (t) => t.naCoverage.title,
    getNameUr: (t) => t.naCoverage.title,
    getShortNameEn: (t) => t.naCoverage.shortTitle,
    getShortNameUr: (t) => t.naCoverage.shortTitle,
    getBadge: (t) => t.naCoverage.badge,
    getPurpose: (t) => t.naCoverage.purpose,
  },
  {
    id: 'calc-5',
    num: '05',
    icon: AlertTriangle,
    category: 'calculators',
    getNameEn: (t) => t.refusalCoverage.title,
    getNameUr: (t) => t.refusalCoverage.title,
    getShortNameEn: (t) => t.refusalCoverage.shortTitle,
    getShortNameUr: (t) => t.refusalCoverage.shortTitle,
    getBadge: (t) => t.refusalCoverage.badge,
    getPurpose: (t) => t.refusalCoverage.purpose,
  },
  {
    id: 'calc-6',
    num: '06',
    icon: ShieldAlert,
    category: 'calculators',
    getNameEn: (t) => t.missedChildren.title,
    getNameUr: (t) => t.missedChildren.title,
    getShortNameEn: (t) => t.missedChildren.shortTitle,
    getShortNameUr: (t) => t.missedChildren.shortTitle,
    getBadge: (t) => t.missedChildren.badge,
    getPurpose: (t) => t.missedChildren.purpose,
  },
  {
    id: 'calc-7',
    num: '07',
    icon: Award,
    category: 'calculators',
    getNameEn: (t) => t.campaignCoverage.title,
    getNameUr: (t) => t.campaignCoverage.title,
    getShortNameEn: (t) => t.campaignCoverage.shortTitle,
    getShortNameUr: (t) => t.campaignCoverage.shortTitle,
    getBadge: (t) => t.campaignCoverage.badge,
    getPurpose: (t) => t.campaignCoverage.purpose,
  },
  {
    id: 'calc-8',
    num: '08',
    icon: TrendingUp,
    category: 'calculators',
    getNameEn: (t) => t.dailyCatchUp.title,
    getNameUr: (t) => t.dailyCatchUp.title,
    getShortNameEn: (t) => t.dailyCatchUp.shortTitle,
    getShortNameUr: (t) => t.dailyCatchUp.shortTitle,
    getBadge: (t) => t.dailyCatchUp.badge,
    getPurpose: (t) => t.dailyCatchUp.purpose,
  },
  {
    id: 'calc-9',
    num: '09',
    icon: Users,
    category: 'calculators',
    getNameEn: (t) => t.under5Population.title,
    getNameUr: (t) => t.under5Population.title,
    getShortNameEn: (t) => t.under5Population.shortTitle,
    getShortNameUr: (t) => t.under5Population.shortTitle,
    getBadge: (t) => t.under5Population.badge,
    getPurpose: (t) => t.under5Population.purpose,
  },
];

/**
 * Resolves localized full calculator name
 */
export function getLocalizedCalcName(
  calc: CalculatorNavItem,
  t: TranslationStrings,
  isUrdu: boolean
): string {
  return isUrdu ? calc.getNameUr(t) : calc.getNameEn(t);
}

/**
 * Resolves localized short calculator name (e.g. for concise chips)
 */
export function getLocalizedCalcShortName(
  calc: CalculatorNavItem,
  t: TranslationStrings,
  isUrdu: boolean
): string {
  return isUrdu ? calc.getShortNameUr(t) : calc.getShortNameEn(t);
}
