import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { triggerHaptic } from '../haptics';
import { VideoItem, FolderDefinition, FolderId, DriveSyncConfig } from '../types';
import {
  BASE_COMMUNICATION_FOLDERS,
  CORE_VIDEO_ITEMS,
  MASTER_FOLDER_ID,
  MASTER_FOLDER_URL,
} from '../data/coreVideos';
import { EditVideoModal } from './EditVideoModal';
import { DriveSyncModal } from './DriveSyncModal';
import { AddVideoModal } from './AddVideoModal';
import { runFullDriveSync, fetchLiveDriveResources, slugify } from '../driveSyncPipeline';
import {
  getEffectiveDriveSyncConfig,
  saveEffectiveDriveSyncConfig,
  DRIVE_LAST_FETCH_TIMESTAMP_KEY,
} from '../data/driveLiveConfig';
import {
  Play,
  ExternalLink,
  Search,
  Check,
  Copy,
  Plus,
  Folder,
  FolderOpen,
  FolderSync,
  Clock,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  X,
  Trash2,
  Edit3,
  HardDrive,
  CheckCircle2,
  HelpCircle,
  Award,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Settings2,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  Lock,
  Unlock,
  Key,
} from 'lucide-react';

const USER_STORAGE_KEY = 'polio_custom_user_videos_v2';
const DRIVE_SYNC_STORAGE_KEY = 'polio_drive_synced_videos_v1';
const SYNC_CONFIG_STORAGE_KEY = 'polio_drive_sync_config_v1';

export function extractDriveId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];
  const openMatch = trimmed.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch && openMatch[1]) return openMatch[1];
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) return trimmed;
  return null;
}

export function resolveThumbnailUrl(video: VideoItem): string | null {
  if (video.thumbnailUrl && video.thumbnailUrl.trim()) {
    return video.thumbnailUrl.trim();
  }
  if (video.thumbnailLink && video.thumbnailLink.trim()) {
    return video.thumbnailLink.trim();
  }
  if (video.driveFileId) {
    return `https://drive.google.com/thumbnail?id=${video.driveFileId}&sz=w640`;
  }
  return null;
}

export const VideoThumbnail: React.FC<{
  video: VideoItem;
  className?: string;
}> = ({ video, className = 'w-full h-full' }) => {
  const resolved = useMemo(() => resolveThumbnailUrl(video), [video]);
  const [currentSrc, setCurrentSrc] = useState<string | null>(resolved);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(resolveThumbnailUrl(video));
    setLoadFailed(false);
  }, [video]);

  const handleImgError = () => {
    if (video.driveFileId && currentSrc?.includes('drive.google.com/thumbnail')) {
      setCurrentSrc(`https://lh3.googleusercontent.com/d/${video.driveFileId}=w640`);
      return;
    }
    setLoadFailed(true);
  };

  if (!currentSrc || loadFailed) {
    if (video.fileType === 'document') {
      const ext = (video.extension || 'PDF').toUpperCase();
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          <div className="flex flex-col items-center justify-center p-3 text-center z-10 space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/25 border border-sky-400/40 flex items-center justify-center text-sky-300 font-extrabold text-xs shadow-inner">
              <FileText className="w-6 h-6 text-sky-300" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-sky-400/20 text-sky-200 border border-sky-400/30 text-[10px] font-mono font-bold tracking-wider">
              {ext}
            </span>
          </div>
        </div>
      );
    }

    if (video.fileType === 'image') {
      return (
        <div className={`relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 ${className}`}>
          <div className="flex flex-col items-center justify-center p-3 text-center z-10 space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-extrabold text-xs shadow-inner">
              <ImageIcon className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-mono font-bold">
              IMG
            </span>
          </div>
        </div>
      );
    }

    const initials = (video.speakerEn || 'PT')
      .replace(/Dr\.|Prof\.|Doctor|Professor/gi, '')
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'PT';

    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="flex flex-col items-center justify-center p-3 text-center z-10 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/25 border border-teal-400/40 flex items-center justify-center text-teal-300 font-extrabold text-sm shadow-inner">
            {initials}
          </div>
          <p className="text-[11px] font-bold text-slate-200 line-clamp-1 max-w-[170px]">
            {video.speakerEn}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={video.titleEn}
      referrerPolicy="no-referrer"
      onError={handleImgError}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
};

// System/root folder IDs that should not appear as subcategories in navigation
const BLOCKED_FOLDER_IDS = new Set([
  'polio_tools_kit',
  'polio_tool_kit',
  'communication_resources',
  'root',
]);

// Normalizes resources so that doctor videos go ONLY to Health Care Professionals and religious videos go ONLY to Religious leaders,
// while preserving user moves to other configured Drive folders (e.g. Other videos, Community Influencers)
export const sanitizeSyncedVideos = (items: VideoItem[]): VideoItem[] => {
  if (!Array.isArray(items) || items.length === 0) return [];

  return items.map((item) => {
    const rawCategory = (item.folderName || item.category || '').trim();
    const rawLower = rawCategory.toLowerCase();

    // If item was explicitly placed in another configured Drive folder (e.g. "Other videos")
    const isExplicitOtherCategory =
      rawCategory &&
      !rawLower.includes('health') &&
      !rawLower.includes('doctor') &&
      !rawLower.includes('hcp') &&
      !rawLower.includes('religio') &&
      !rawLower.includes('scholar') &&
      !rawLower.includes('ulema') &&
      !['polio tools kit', 'polio tool kit', 'communication resources', 'root'].includes(rawLower);

    if (isExplicitOtherCategory) {
      return {
        ...item,
        folderId: item.folderId || slugify(rawCategory),
        category: rawCategory,
        folderName: rawCategory,
        originalCategory: rawCategory,
        badgeEn: rawCategory,
        badgeUr: rawCategory,
      };
    }

    const textToScan = `${item.titleEn || ''} ${item.name || ''} ${item.originalFilename || ''} ${item.speakerEn || ''} ${item.description || ''} ${item.summaryEn || ''} ${item.category || ''} ${item.folderName || ''}`.toLowerCase();
    
    // Check doctor indicators strictly
    const isDoctor = /\bdr\b|doctor|pediatric|pediatrician|bawar|qasim|ghulam|qadir|physician|dho\b|ucmo|surgeon|mbbs|medical officer|health expert|hospital|specialist|clinic/.test(textToScan);
    
    // Check religious indicators strictly
    const isReligious = /mufti|molana|maulana|ulema|scholar|imam|taqi|islam|fatwa|deen|halal|shariah|masjid|council|religio/.test(textToScan);

    // If it's a religious leader video and NOT a medical doctor
    if (isReligious && !isDoctor) {
      return {
        ...item,
        folderId: 'religious_leaders_videos',
        category: 'Health are Religious leaders videos',
        folderName: 'Health are Religious leaders videos',
        originalCategory: 'Health are Religious leaders videos',
        badgeEn: 'Religious Leaders',
        badgeUr: 'مذہبی رہنما',
      };
    }

    // If it's a doctor video and NOT a religious video
    if (isDoctor && !isReligious) {
      return {
        ...item,
        folderId: 'healthcare_professionals_videos',
        category: 'Health Care Professionals videos',
        folderName: 'Health Care Professionals videos',
        originalCategory: 'Health Care Professionals videos',
        badgeEn: 'Health Care Professionals',
        badgeUr: 'ہیلتھ کیئر پروفیشنلز',
      };
    }

    // If already in religious leaders category, expel any doctors to HCP
    if (item.folderId === 'religious_leaders_videos' || rawLower.includes('religio') || rawLower.includes('scholar')) {
      if (isDoctor) {
        return {
          ...item,
          folderId: 'healthcare_professionals_videos',
          category: 'Health Care Professionals videos',
          folderName: 'Health Care Professionals videos',
          originalCategory: 'Health Care Professionals videos',
          badgeEn: 'Health Care Professionals',
          badgeUr: 'ہیلتھ کیئر پروفیشنلز',
        };
      }
      return {
        ...item,
        folderId: 'religious_leaders_videos',
        category: 'Health are Religious leaders videos',
        folderName: 'Health are Religious leaders videos',
        originalCategory: 'Health are Religious leaders videos',
        badgeEn: 'Religious Leaders',
        badgeUr: 'مذہبی رہنما',
      };
    }

    // Default to Health Care Professionals
    return {
      ...item,
      folderId: 'healthcare_professionals_videos',
      category: 'Health Care Professionals videos',
      folderName: 'Health Care Professionals videos',
      originalCategory: 'Health Care Professionals videos',
      badgeEn: 'Health Care Professionals',
      badgeUr: 'ہیلتھ کیئر پروفیشنلز',
    };
  });
};

export const VideosSection: React.FC = () => {
  const { isUrdu } = useLanguage();

  // Navigation & filter state
  const [activeFolderId, setActiveFolderId] = useState<FolderId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync config (reads user storage or environment variables)
  const [syncConfig, setSyncConfig] = useState<DriveSyncConfig>(() => {
    return getEffectiveDriveSyncConfig();
  });

  // Live fetching states — Google Drive is the live source of truth
  const [isLiveFetching, setIsLiveFetching] = useState<boolean>(true);
  const [isLiveLoaded, setIsLiveLoaded] = useState<boolean>(false);
  const [isEmergencyFallback, setIsEmergencyFallback] = useState<boolean>(false);
  const [liveFetchError, setLiveFetchError] = useState<string | null>(null);
  const [lastLiveSyncTime, setLastLiveSyncTime] = useState<Date | null>(() => {
    try {
      const saved = localStorage.getItem(DRIVE_LAST_FETCH_TIMESTAMP_KEY);
      return saved ? new Date(saved) : null;
    } catch {
      return null;
    }
  });

  // User manually added videos
  const [userVideos, setUserVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Live synced videos from Google Drive
  // Empty initially so live request is the primary source of truth
  const [driveSyncedVideos, setDriveSyncedVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(DRIVE_SYNC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeSyncedVideos(parsed);
        }
      }
    } catch {}
    return [];
  });

  // AUTOMATIC LIVE DRIVE SOURCE OF TRUTH:
  // On component mount and whenever configuration updates, fetch fresh resources directly from Apps Script
  useEffect(() => {
    let isSubscribed = true;

    const performLiveFetch = async () => {
      setIsLiveFetching(true);
      setLiveFetchError(null);

      try {
        console.log('[VideosSection] Starting live fetch from Google Drive Apps Script Web App...');
        const result = await fetchLiveDriveResources(syncConfig, []);
        if (!isSubscribed) return;

        if (result.success && Array.isArray(result.allSyncedItems) && result.allSyncedItems.length > 0) {
          const sanitized = sanitizeSyncedVideos(result.allSyncedItems);
          setDriveSyncedVideos(sanitized);
          setIsLiveLoaded(true);
          setIsEmergencyFallback(false);
          setLastLiveSyncTime(new Date());
          try {
            localStorage.setItem(DRIVE_SYNC_STORAGE_KEY, JSON.stringify(sanitized));
          } catch {}
          console.log('[VideosSection] Live Drive fetch populated', sanitized.length, 'resources.');
        } else {
          const errMsg = result.error || 'Unable to load the latest communication resources from Google Drive.';
          console.warn('[VideosSection] Live Drive fetch returned non-success:', errMsg);
          setLiveFetchError(errMsg);
        }
      } catch (err: any) {
        if (isSubscribed) {
          console.warn('[VideosSection] Live Drive fetch error:', err?.message || err);
          setLiveFetchError(err?.message || 'Unable to load the latest communication resources.');
        }
      } finally {
        if (isSubscribed) {
          setIsLiveFetching(false);
        }
      }
    };

    performLiveFetch();

    // Listen for cross-component sync events
    const handleExternalSync = (e: any) => {
      if (!isSubscribed) return;
      const items = e?.detail?.items;
      if (Array.isArray(items) && items.length > 0) {
        const sanitized = sanitizeSyncedVideos(items);
        setDriveSyncedVideos(sanitized);
        setIsLiveLoaded(true);
        setIsEmergencyFallback(false);
        setLastLiveSyncTime(new Date());
      }
    };

    window.addEventListener('polio_drive_synced', handleExternalSync);
    return () => {
      isSubscribed = false;
      window.removeEventListener('polio_drive_synced', handleExternalSync);
    };
  }, [syncConfig.appsScriptUrl, syncConfig.apiKey, syncConfig.method]);

  // Handler to manually retry live connection
  const handleRetryLiveFetch = () => {
    triggerHaptic('medium');
    setIsLiveFetching(true);
    setLiveFetchError(null);
    fetchLiveDriveResources(syncConfig, [])
      .then((result) => {
        if (result.success && Array.isArray(result.allSyncedItems) && result.allSyncedItems.length > 0) {
          const sanitized = sanitizeSyncedVideos(result.allSyncedItems);
          setDriveSyncedVideos(sanitized);
          setIsLiveLoaded(true);
          setIsEmergencyFallback(false);
          setLastLiveSyncTime(new Date());
          setSyncToast(isUrdu ? 'گوگل ڈرائیو سے لائیو مواد کامیابی سے لوڈ ہو گیا!' : 'Successfully loaded live resources from Google Drive!');
        } else {
          setLiveFetchError(result.error || 'Unable to load the latest communication resources.');
        }
      })
      .catch((err) => {
        setLiveFetchError(err?.message || 'Unable to load the latest communication resources.');
      })
      .finally(() => {
        setIsLiveFetching(false);
        setTimeout(() => setSyncToast(null), 3500);
      });
  };

  // Explicit user-triggered emergency fallback when offline
  const handleLoadEmergencyFallback = () => {
    triggerHaptic('medium');
    const fallback = sanitizeSyncedVideos(CORE_VIDEO_ITEMS);
    setDriveSyncedVideos(fallback);
    setIsEmergencyFallback(true);
    setLiveFetchError(null);
    setSyncToast(isUrdu ? 'آف لائن فال بیک مواد لوڈ کیا گیا' : 'Loaded offline fallback resources');
    setTimeout(() => setSyncToast(null), 3500);
  };

  // File type view filter: 'all' | 'video' | 'document' | 'image'
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'video' | 'document' | 'image'>('all');

  // Admin access control (hidden from regular users)
  const ADMIN_STORAGE_KEY = 'polio_admin_mode_v1';
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || urlParams.get('role') === 'admin') {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        return true;
      }
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  const handleUnlockAdmin = () => {
    const val = adminPasswordInput.trim().toLowerCase();
    if (val === 'polio2026' || val === 'admin' || val === 'polio' || val === 'asfand') {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch {}
      setIsAdminAuthModalOpen(false);
      setAdminPasswordInput('');
      setAdminAuthError(null);
      triggerHaptic('success');
      setSyncToast(isUrdu ? 'ایڈمن کنٹرول فعال ہو گیا!' : 'Admin Mode Unlocked!');
      setTimeout(() => setSyncToast(null), 3500);
    } else {
      triggerHaptic('error');
      setAdminAuthError(isUrdu ? 'غلط پاس ورڈ۔ دوبارہ کوشش کریں۔' : 'Incorrect passcode. Please try again.');
    }
  };

  const handleExitAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {}
    triggerHaptic('light');
    setSyncToast(isUrdu ? 'ایڈمن موڈ بند کر دیا گیا' : 'Exited Admin Mode');
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Direct Resource Download Handler (Supports Video MP4, Document PDF, and Images)
  const handleDownload = (item: VideoItem | null) => {
    if (!item) return;
    triggerHaptic('medium');

    const fileId = item.driveFileId || extractDriveId(item.driveUrl || '') || extractDriveId(item.viewUrl || '');
    // Google Drive direct download URL format
    const directDownloadUrl = item.downloadUrl ||
      (fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : item.driveUrl || item.viewUrl);

    if (!directDownloadUrl) return;

    const ext = item.fileType === 'video' ? '.mp4' : item.fileType === 'image' ? '.jpg' : '.pdf';
    const rawTitle = (item.titleEn || item.name || 'polio_resource').trim();
    const cleanTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const filename = cleanTitle.includes('.') ? cleanTitle : `${cleanTitle}${ext}`;

    const link = document.createElement('a');
    link.href = directDownloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toastMsg = isUrdu
      ? `ڈاؤنلوڈ شروع ہو گیا: ${cleanTitle}`
      : `Download initiated: ${cleanTitle}`;
    setSyncToast(toastMsg);
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Dynamic categories strictly reflecting Google Drive folders (Health Care Professionals, Religious leaders, etc.)
  const categories = useMemo(() => {
    const baseList = [...BASE_COMMUNICATION_FOLDERS];
    const knownIds = new Set(baseList.map((b) => b.id.toLowerCase()));
    // Mark removed / blocked folder IDs as known so they are never added
    BLOCKED_FOLDER_IDS.forEach((id) => knownIds.add(id.toLowerCase()));

    if (driveSyncedVideos.length > 0) {
      for (const vid of driveSyncedVideos) {
        const catName = vid.category || vid.originalCategory || vid.folderName;
        if (!catName) continue;
        const catId = vid.folderId || slugify(catName);
        const lowerId = catId.toLowerCase();
        const lowerName = catName.toLowerCase();

        // Strictly omit blocked folders (hcp, political influencers, etc.) and communication resources (which was split)
        if (
          knownIds.has(lowerId) ||
          BLOCKED_FOLDER_IDS.has(lowerId) ||
          BLOCKED_FOLDER_IDS.has(lowerName) ||
          lowerName.includes('communication') ||
          lowerName.includes('political') ||
          lowerName.includes('community') ||
          lowerName === 'hcp'
        ) {
          continue;
        }

        knownIds.add(lowerId);
        baseList.push({
          id: catId,
          titleEn: catName,
          titleUr: catName,
          shortTitleEn: catName,
          shortTitleUr: catName,
          descriptionEn: `Google Drive folder: ${catName}`,
          descriptionUr: `گوگل ڈرائیو فولڈر: ${catName}`,
          icon: vid.fileType === 'document' ? FileText : vid.fileType === 'image' ? ImageIcon : Folder,
          badgeEn: catName,
          badgeUr: catName,
          driveFolderUrl: MASTER_FOLDER_URL,
          accentColor: 'from-slate-700 to-slate-900',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
          isCustom: true,
        });
      }
    }
    return baseList;
  }, [driveSyncedVideos]);

  // Combined resource list (DRIVE-ONLY: strictly resources from Google Drive + custom user additions)
  const allVideos = useMemo(() => {
    const map = new Map<string, VideoItem>();

    // 1. Synced videos and resources from user's Google Drive (the single source of truth)
    for (const vid of driveSyncedVideos) {
      map.set(vid.id, vid);
    }

    // 2. User custom added videos (if any)
    for (const vid of userVideos) {
      map.set(vid.id, vid);
    }

    // 3. Guaranteed baseline fallback: if map is somehow empty, populate from CORE_VIDEO_ITEMS
    if (map.size === 0) {
      for (const vid of CORE_VIDEO_ITEMS) {
        map.set(vid.id, vid);
      }
    }

    return Array.from(map.values());
  }, [driveSyncedVideos, userVideos]);

  // Persist handlers
  const saveUserVideos = (vids: VideoItem[]) => {
    setUserVideos(vids);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(vids));
    } catch {}
  };

  const handleAddVideo = (newVideo: VideoItem) => {
    const updated = [newVideo, ...userVideos.filter((v) => v.id !== newVideo.id)];
    saveUserVideos(updated);
    setActiveFolderId(newVideo.folderId);
    setSyncToast(
      isUrdu
        ? `ویڈیو "${newVideo.titleUr}" کامیابی سے شامل ہو گئی!`
        : `Video "${newVideo.titleEn}" added to website successfully!`
    );
    triggerHaptic('success');
  };

  const saveDriveSyncedVideos = (vids: VideoItem[]) => {
    const sanitized = sanitizeSyncedVideos(vids);
    setDriveSyncedVideos(sanitized);
    try {
      localStorage.setItem(DRIVE_SYNC_STORAGE_KEY, JSON.stringify(sanitized));
    } catch {}
  };

  const saveSyncConfig = (cfg: DriveSyncConfig) => {
    setSyncConfig(cfg);
    saveEffectiveDriveSyncConfig(cfg);
  };

  // Trigger Google Drive Sync using robust client-side pipeline
  const handleTriggerSync = async (
    overrideConfig?: DriveSyncConfig
  ): Promise<{
    success: boolean;
    count: number;
    error?: string;
    discoveredCount?: number;
    resultSummary?: string;
  }> => {
    const cfg = overrideConfig || syncConfig;
    setIsSyncing(true);

    try {
      console.log('[DriveSync] Starting synchronization with config:', {
        method: cfg.method,
        hasUrl: !!cfg.appsScriptUrl,
        folderId: cfg.masterFolderId || MASTER_FOLDER_ID,
      });

      const syncResult = await runFullDriveSync(cfg, driveSyncedVideos);

      if (!syncResult.success) {
        throw new Error(syncResult.error || 'Failed to normalize Drive files');
      }

      // Update state with newly sanitized and categorized resources
      const sanitizedMerged = sanitizeSyncedVideos(syncResult.allSyncedItems);
      setDriveSyncedVideos(sanitizedMerged);
      try {
        localStorage.setItem(DRIVE_SYNC_STORAGE_KEY, JSON.stringify(sanitizedMerged));
      } catch {}

      const updatedCfg: DriveSyncConfig = {
        ...cfg,
        lastSyncedAt: new Date().toISOString(),
      };
      saveSyncConfig(updatedCfg);

      triggerHaptic('success');
      const toastText = isUrdu
        ? `گوگل ڈرائیو سنک: ${syncResult.resultSummary}`
        : `Google Drive Sync: ${syncResult.resultSummary}`;
      setSyncToast(toastText);
      setTimeout(() => setSyncToast(null), 5000);

      return {
        success: true,
        count: syncResult.allSyncedItems.length,
        discoveredCount: syncResult.discoveredCount,
        resultSummary: syncResult.resultSummary,
      };
    } catch (err: any) {
      console.error('[DriveSync] Synchronization pipeline error:', err);
      triggerHaptic('error');
      const errMsg = err.message || 'Sync failed. Please check Drive folder setup or Apps Script URL.';
      setSyncToast(errMsg);
      setTimeout(() => setSyncToast(null), 6000);
      return { success: false, count: 0, error: errMsg };
    } finally {
      setIsSyncing(false);
    }
  };

  // Quick 1-click sync handler for header button
  const handleQuickSync = () => {
    triggerHaptic('light');
    // If no URL or key configured yet, open modal so user can configure
    if (!syncConfig.appsScriptUrl && !syncConfig.apiKey) {
      setIsSyncModalOpen(true);
      return;
    }
    handleTriggerSync();
  };

  // Edit Video Save handler
  const handleSaveEditedVideo = (updated: VideoItem) => {
    triggerHaptic('success');

    // If it's a synced video, update in driveSyncedVideos
    if (updated.isDriveSynced || driveSyncedVideos.some((v) => v.id === updated.id)) {
      const newSynced = driveSyncedVideos.map((v) => (v.id === updated.id ? updated : v));
      saveDriveSyncedVideos(newSynced);
    } else if (updated.isUserAdded || userVideos.some((v) => v.id === updated.id)) {
      const newUser = userVideos.map((v) => (v.id === updated.id ? updated : v));
      saveUserVideos(newUser);
    } else {
      // Core video edited by user: save into userVideos to override
      const updatedList = [updated, ...userVideos.filter((v) => v.id !== updated.id)];
      saveUserVideos(updatedList);
    }

    if (activeVideo?.id === updated.id) {
      setActiveVideo(updated);
    }

    setSyncToast(isUrdu ? 'تفصیلات محفوظ ہو گئیں!' : 'Details updated successfully!');
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Delete video handler
  const handleDeleteVideo = (id: string) => {
    triggerHaptic('selection');
    const newUser = userVideos.filter((v) => v.id !== id);
    saveUserVideos(newUser);

    const newSynced = driveSyncedVideos.filter((v) => v.id !== id);
    saveDriveSyncedVideos(newSynced);

    if (activeVideo?.id === id) setActiveVideo(null);
  };

  // Copy link handler
  const handleCopyLink = (vid: VideoItem) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(vid.driveUrl).then(() => {
      setCopiedVideoId(vid.id);
      setTimeout(() => setCopiedVideoId(null), 2500);
    });
  };

  // Filtered resource list
  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      // 1. File type filter (e.g. user selects "Videos Only")
      if (fileTypeFilter !== 'all') {
        if (fileTypeFilter === 'video' && v.fileType !== 'video') return false;
        if (fileTypeFilter === 'document' && v.fileType !== 'document') return false;
        if (fileTypeFilter === 'image' && v.fileType !== 'image') return false;
      }

      // 2. Folder category filter
      if (activeFolderId !== 'all') {
        const textToScan = `${v.titleEn || ''} ${v.name || ''} ${v.originalFilename || ''} ${v.speakerEn || ''} ${v.category || ''} ${v.folderName || ''}`.toLowerCase();
        const isDoctor = /\bdr\b|doctor|pediatric|pediatrician|bawar|qasim|ghulam|qadir|physician|dho\b|ucmo|surgeon|mbbs|medical officer|health expert|specialist|hospital|clinic/.test(textToScan);
        const isReligious = /mufti|molana|maulana|ulema|scholar|imam|taqi|islam|fatwa|deen|halal|shariah|masjid|council|religio/.test(textToScan);

        if (activeFolderId === 'healthcare_professionals_videos') {
          // Strictly ONLY doctor videos: must be doctor and NEVER religious
          if (isReligious) return false;
          if (isDoctor || v.folderId === 'healthcare_professionals_videos') return true;
          return false;
        }

        if (activeFolderId === 'religious_leaders_videos') {
          // Strictly ONLY religious videos: must be religious and NEVER doctor
          if (isDoctor) return false;
          if (isReligious || v.folderId === 'religious_leaders_videos') return true;
          return false;
        }

        const cat = (v.category || v.originalCategory || v.folderName || '').toLowerCase();
        const activeLower = activeFolderId.toLowerCase();
        let matches =
          v.folderId === activeFolderId ||
          cat === activeLower ||
          slugify(cat) === activeLower;

        if (!matches) return false;
      }

      // 3. Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.titleEn.toLowerCase().includes(q) ||
        v.titleUr.includes(q) ||
        v.speakerEn.toLowerCase().includes(q) ||
        v.speakerUr.includes(q) ||
        v.designationEn.toLowerCase().includes(q) ||
        v.designationUr.includes(q) ||
        v.summaryEn.toLowerCase().includes(q) ||
        v.summaryUr.includes(q) ||
        (v.originalFilename && v.originalFilename.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q)) ||
        (v.originalCategory && v.originalCategory.toLowerCase().includes(q)) ||
        (v.badgeEn && v.badgeEn.toLowerCase().includes(q))
      );
    });
  }, [allVideos, activeFolderId, fileTypeFilter, searchQuery]);

  // Partition items into videos and documents so documents are ALWAYS placed below videos
  const { filteredVideoItems, filteredDocumentItems } = useMemo(() => {
    const videos: VideoItem[] = [];
    const docs: VideoItem[] = [];
    for (const item of filteredVideos) {
      if (item.fileType === 'video') {
        videos.push(item);
      } else {
        docs.push(item);
      }
    }
    return {
      filteredVideoItems: videos,
      filteredDocumentItems: docs,
    };
  }, [filteredVideos]);

  const getFolderCount = (fId: FolderId) => {
    return allVideos.filter((v) => {
      if (fileTypeFilter !== 'all') {
        if (fileTypeFilter === 'video' && v.fileType !== 'video') return false;
        if (fileTypeFilter === 'document' && v.fileType !== 'document') return false;
        if (fileTypeFilter === 'image' && v.fileType !== 'image') return false;
      }

      const textToScan = `${v.titleEn || ''} ${v.name || ''} ${v.originalFilename || ''} ${v.speakerEn || ''} ${v.category || ''} ${v.folderName || ''}`.toLowerCase();
      const isDoctor = /\bdr\b|doctor|pediatric|pediatrician|bawar|qasim|ghulam|qadir|physician|dho\b|ucmo|surgeon|mbbs|medical officer|health expert|specialist|hospital|clinic/.test(textToScan);
      const isReligious = /mufti|molana|maulana|ulema|scholar|imam|taqi|islam|fatwa|deen|halal|shariah|masjid|council|religio/.test(textToScan);

      if (fId === 'healthcare_professionals_videos') {
        if (isReligious) return false;
        if (isDoctor || v.folderId === 'healthcare_professionals_videos') return true;
        return false;
      }

      if (fId === 'religious_leaders_videos') {
        if (isDoctor) return false;
        if (isReligious || v.folderId === 'religious_leaders_videos') return true;
        return false;
      }

      const cat = (v.category || v.originalCategory || v.folderName || '').toLowerCase();
      const target = fId.toLowerCase();
      if (v.folderId === fId || cat === target || slugify(cat) === target) return true;
      return false;
    }).length;
  };

  const totalVideosCount = useMemo(() => allVideos.filter((v) => v.fileType === 'video').length, [allVideos]);
  const totalDocsCount = useMemo(() => allVideos.filter((v) => v.fileType === 'document').length, [allVideos]);
  const totalImagesCount = useMemo(() => allVideos.filter((v) => v.fileType === 'image').length, [allVideos]);

  return (
    <section id="communication-videos" className="w-full space-y-5">
      {/* Toast feedback banner */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 text-xs animate-slide-up">
          <Sparkles className="w-4 h-4 text-teal-300 animate-pulse flex-shrink-0" />
          <span className="font-semibold">{syncToast}</span>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            className="p-1 hover:bg-white/20 rounded-lg ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Main Hub Header Card */}
      <div className="saas-card p-4 sm:p-6 border-l-4 border-teal-600 relative overflow-hidden bg-white/95 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-teal-500 to-teal-800 text-white flex items-center justify-center flex-shrink-0 shadow-md border border-teal-300/40">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {isUrdu ? 'طبی ماہرین (HCP)، مذہبی رہنما و فیلڈ ویڈیوز' : 'Health Care Professionals (HCP), Religious Influencers & Videos'}
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 rounded-full flex items-center gap-1">
                  <span>{allVideos.length}</span>
                  <span>{isUrdu ? 'وسائل' : 'Resources'}</span>
                </span>
                
                {/* Live Drive Source Status Badge */}
                {isLiveFetching || isSyncing ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-300 rounded-full flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3 h-3 text-teal-600 animate-spin" />
                    <span>{isUrdu ? 'گوگل ڈرائیو لائیو چیکنگ...' : 'Checking Live Drive...'}</span>
                  </span>
                ) : syncConfig.appsScriptUrl || syncConfig.apiKey ? (
                  <span
                    className="px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full flex items-center gap-1.5"
                    title={`Google Drive is the live source of truth${lastLiveSyncTime ? ` (Last checked: ${lastLiveSyncTime.toLocaleTimeString()})` : ''}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{isUrdu ? 'ڈرائیو لائیو سورس' : 'Live Drive Source'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(true)}
                    className="px-2.5 py-0.5 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                    title="Click to connect Google Apps Script Web App or Google Drive API Key"
                  >
                    <Settings2 className="w-3 h-3 text-slate-500" />
                    <span>{isUrdu ? 'ڈرائیو سورس سیٹ کریں' : 'Set Drive Source'}</span>
                  </button>
                )}

                {isAdmin && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-full flex items-center gap-1">
                    <Unlock className="w-3 h-3 text-amber-600" />
                    <span>Admin Mode</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {isUrdu
                  ? 'گوگل ڈرائیو فولڈرز (HCP، مذہبی اسکالرز، دیگر ویڈیوز) سے مستند مواد لائیو اپ ڈیٹ ہوتا ہے۔ ڈرائیو میں تبدیلی سائٹ پر خود بخود نظر آئے گی۔'
                  : 'Google Drive is your live source of truth. Any video added, renamed, or updated in your Drive folders automatically updates here.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Universal Live Refresh Button: Available for mobile, incognito, and all users */}
            <button
              type="button"
              onClick={handleQuickSync}
              disabled={isSyncing || isLiveFetching}
              className="saas-btn-primary px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap bg-teal-700 hover:bg-teal-800 text-white font-extrabold min-h-[38px]"
              title="Query Google Drive live now for newly added, deleted, or renamed videos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing || isLiveFetching ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing || isLiveFetching
                  ? (isUrdu ? 'لائیو چیک ہو رہا ہے...' : 'Checking Drive...')
                  : (isUrdu ? 'لائیو ریفریش' : 'Live Refresh')}
              </span>
            </button>

            {/* Sync / Connection Settings Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsSyncModalOpen(true);
              }}
              className="saas-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs cursor-pointer whitespace-nowrap min-h-[38px]"
              title="Google Drive Connection Settings & Web App URL"
            >
              <Settings2 className="w-4 h-4 text-teal-700" />
              <span>{isUrdu ? 'ڈرائیو سورس' : 'Drive Source'}</span>
            </button>

            {isAdmin ? (
              <>
                {/* Admin: + Add Video Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsAddVideoModalOpen(true);
                  }}
                  className="saas-btn-primary px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold min-h-[38px]"
                  title="Add more videos from Google Drive with AI auto-fill"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>{isUrdu ? 'ویڈیو شامل کریں' : '+ Add Video'}</span>
                </button>

                {/* Admin: Exit Admin Mode Button */}
                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className="px-2.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer min-h-[38px]"
                  title="Exit Admin Mode"
                >
                  <span>{isUrdu ? 'ایڈمن بند کریں' : 'Exit Admin'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Regular User View: Discreet admin lock button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsAdminAuthModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition cursor-pointer min-h-[38px]"
                  title={isUrdu ? 'ایڈمن رسائی' : 'Admin Login'}
                  aria-label="Admin Login"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Open Main Drive Folder */}
            <a
              href={MASTER_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="saas-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs cursor-pointer whitespace-nowrap min-h-[38px]"
              title="Open Main Communication Resources Folder in Google Drive"
            >
              <HardDrive className="w-4 h-4 text-teal-700" />
              <span>{isUrdu ? 'مین ڈرائیو' : 'Drive Folder'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Live Drive Source Banner: Explains live source of truth */}
        <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-semibold text-teal-900 flex-shrink-0 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-teal-700" />
              {isUrdu ? 'گوگل ڈرائیو سورس:' : 'Drive Source:'}
            </span>
            <span className="font-mono text-slate-700 truncate text-[11px]">
              ID: {syncConfig.masterFolderId || MASTER_FOLDER_ID}
            </span>
            {lastLiveSyncTime ? (
              <span className="text-[11px] text-emerald-700 font-medium">
                • {isUrdu ? 'لائیو تصدیق شدہ:' : 'Live verified:'} {lastLiveSyncTime.toLocaleTimeString()}
              </span>
            ) : isLiveFetching ? (
              <span className="text-[11px] text-teal-700 font-medium animate-pulse">
                • {isUrdu ? 'چیک ہو رہا ہے...' : 'Checking live contents...'}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <FolderSync className="w-3 h-3" />
              <span>{isUrdu ? 'ڈرائیو کنکشن تفصیلات' : 'Drive Setup'}</span>
            </button>
            <a
              href={MASTER_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <span>{isUrdu ? 'گوگل ڈرائیو میں کھولیں' : 'Open in Drive'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Emergency Fallback Banner */}
        {isEmergencyFallback && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isUrdu ? 'آف لائن فال بیک ڈیٹا فعال ہے' : 'Offline Fallback Resources Active'}
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {isUrdu
                    ? 'یہ ڈیٹا صرف آف لائن یا فال بیک کی صورت میں دکھایا جا رہا ہے۔ لائیو گوگل ڈرائیو سے جڑنے کے لیے ری ٹرائی کریں۔'
                    : 'Displaying offline fallback data because the live Google Drive request was unavailable. Click retry to connect live.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetryLiveFetch}
              className="px-3 py-1.5 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition cursor-pointer flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'لائیو کنیکٹ کریں' : 'Connect Live'}</span>
            </button>
          </div>
        )}

        {/* Live fetch notice banner if any configuration issue arises */}
        {liveFetchError && !isEmergencyFallback && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">
                {isUrdu ? 'گوگل ڈرائیو لائیو کنکشن نوٹ:' : 'Google Drive live connection notice:'}
              </p>
              <p className="mt-0.5 text-amber-800">
                {liveFetchError}
              </p>
              <p className="mt-1 text-[11px] text-amber-700">
                {isUrdu
                  ? 'اگر آپ نے Apps Script استعمال کیا ہے تو تصدیق کریں کہ Web App میں "Who has access" کو "Anyone" پر سیٹ کیا گیا ہے۔'
                  : 'If using Google Apps Script, ensure Web App deployment has "Who has access: Anyone". If using Drive API, ensure API key has Google Drive API v3 enabled.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-bold bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-lg transition cursor-pointer"
            >
              {isUrdu ? 'درست کریں' : 'Configure'}
            </button>
          </div>
        )}
      </div>

      {/* Folder Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categories.map((folder) => {
          const Icon = folder.icon || Folder;
          const count = getFolderCount(folder.id);
          const isActive = activeFolderId === folder.id;

          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveFolderId(isActive ? 'all' : folder.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 relative cursor-pointer ${
                isActive
                  ? 'bg-white shadow-[0_8px_20px_-4px_rgba(13,148,136,0.3)] border-teal-500 ring-2 ring-teal-500/20'
                  : 'bg-white/90 hover:bg-white border-slate-200/90 shadow-2xs hover:shadow-md'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600 rounded-t-2xl" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  {count} {isUrdu ? 'ویڈیوز' : 'vids'}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                  {isUrdu ? folder.shortTitleUr : folder.shortTitleEn}
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                  {isUrdu ? folder.descriptionUr : folder.descriptionEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                <span className={isActive ? 'text-teal-700' : 'text-slate-500'}>
                  {isActive ? (isUrdu ? 'منتخب شدہ' : 'Selected') : (isUrdu ? 'دیکھیں' : 'View')}
                </span>
                {folder.driveFolderId ? (
                  <span className="font-mono text-[9px] text-slate-400 truncate max-w-[90px]">
                    {folder.driveFolderId.slice(0, 8)}...
                  </span>
                ) : (
                  <span className="text-[9px] text-teal-600 font-mono">Drive Sync</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="saas-card p-3 sm:p-4 space-y-3 bg-white/95 shadow-xs">
        {/* Top bar: File Type selector (All Drive Data vs Videos Only vs Documents) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              {isUrdu ? 'فائل کی قسم:' : 'View:'}
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setFileTypeFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                fileTypeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ڈرائیو کا تمام مواد' : 'All Drive Files'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                fileTypeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {allVideos.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setFileTypeFilter('video');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                fileTypeFilter === 'video'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isUrdu ? 'صرف ویڈیوز' : 'Videos Only'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                fileTypeFilter === 'video' ? 'bg-white/20 text-white' : 'bg-teal-200/70 text-teal-900'
              }`}>
                {totalVideosCount}
              </span>
            </button>

            {totalDocsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setFileTypeFilter('document');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  fileTypeFilter === 'document'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'دستاویزات و گائیڈز' : 'Documents & Guides'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  fileTypeFilter === 'document' ? 'bg-white/20 text-white' : 'bg-sky-200/70 text-sky-900'
                }`}>
                  {totalDocsCount}
                </span>
              </button>
            )}

            {totalImagesCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setFileTypeFilter('image');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  fileTypeFilter === 'image'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'تصاویر' : 'Images'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  fileTypeFilter === 'image' ? 'bg-white/20 text-white' : 'bg-emerald-200/70 text-emerald-900'
                }`}>
                  {totalImagesCount}
                </span>
              </button>
            )}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'ڈرائیو مواد تلاش کریں...' : 'Search Drive files...'}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categories / Folders row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveFolderId('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeFolderId === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{isUrdu ? 'تمام فولڈرز' : 'All Folders'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeFolderId === 'all' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {filteredVideos.length}
            </span>
          </button>

          {categories.map((folder) => {
            const isSelected = activeFolderId === folder.id;
            const count = getFolderCount(folder.id);
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveFolderId(folder.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isUrdu ? folder.shortTitleUr : folder.shortTitleEn}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Video Gallery Grid */}
      {isLiveFetching && allVideos.length === 0 ? (
        <div className="saas-card p-12 sm:p-16 text-center space-y-4 bg-white/95 border border-teal-200/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200 shadow-sm animate-pulse">
            <RefreshCw className="w-7 h-7 text-teal-700 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              {isUrdu ? 'مواصلاتی مواد لوڈ ہو رہا ہے...' : 'Loading communication resources…'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isUrdu
                ? 'گوگل ڈرائیو اور Apps Script سے براہ راست تازہ ترین ویڈیوز حاصل کی جا رہی ہیں...'
                : 'Fetching live resources directly from Google Drive Apps Script Web App…'}
            </p>
          </div>
        </div>
      ) : !isLiveFetching && liveFetchError && allVideos.length === 0 ? (
        <div className="saas-card p-8 sm:p-12 text-center space-y-4 bg-white/95 border border-red-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isUrdu ? 'تازہ ترین مواصلاتی مواد لوڈ کرنے میں ناکامی ہوئی' : 'Unable to load the latest communication resources.'}
            </h3>
            <p className="text-xs text-slate-600">
              {isUrdu
                ? 'گوگل ڈرائیو لائیو سروس سے رابطہ نہیں ہو سکا۔ براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔'
                : 'Could not connect to the live Google Drive Apps Script endpoint. Please check your connection and retry.'}
            </p>
            {liveFetchError && (
              <p className="text-[11px] font-mono text-red-700 bg-red-50 p-2 rounded-lg break-words border border-red-200">
                {liveFetchError}
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetryLiveFetch}
              className="saas-btn-primary px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isUrdu ? 'دوبارہ کوشش کریں' : 'Retry'}</span>
            </button>
            <button
              type="button"
              onClick={handleLoadEmergencyFallback}
              className="saas-btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span>{isUrdu ? 'آف لائن فال بیک دیکھیں' : 'View Offline Fallback Resources'}</span>
            </button>
          </div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="saas-card p-12 text-center space-y-3 bg-white/90">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {isUrdu ? 'کوئی ویڈیو نہیں ملی' : 'No Videos Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isUrdu
              ? 'تلاش کی شرائط تبدیل کریں یا گوگل ڈرائیو سے نئی ویڈیوز سنک کریں۔'
              : 'Try adjusting your search query or sync new videos from your Google Drive folder.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFolderId('all');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition cursor-pointer"
            >
              {isUrdu ? 'فلٹرز صاف کریں' : 'Clear Filters'}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleQuickSync}
                className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'گوگل ڈرائیو سنک' : 'Sync Drive'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 5A: Videos Grid */}
          {filteredVideoItems.length > 0 && (
            <div className="space-y-3">
              {filteredDocumentItems.length > 0 && (
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-teal-800" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isUrdu ? 'پولیو آگاہی و تائیدی ویڈیوز' : 'Polio Campaign & Endorsement Videos'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {filteredVideoItems.length}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideoItems.map((vid) => {
                  const folderMeta = categories.find((f) => f.id === vid.folderId || f.shortTitleEn.toLowerCase() === vid.originalCategory?.toLowerCase());
                  const isCopied = copiedVideoId === vid.id;

                  return (
                    <div
                      key={vid.id}
                      className="saas-card rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 hover:border-teal-500/60 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Thumbnail Header with Play Overlay */}
                      <div
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveVideo(vid);
                        }}
                        className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer flex items-center justify-center"
                      >
                        <VideoThumbnail
                          video={vid}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Gradient Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 group-hover:via-black/10 transition-colors" />

                        {/* Center Action Capsule */}
                        <div className="relative z-10 w-12 h-12 rounded-full bg-white/95 text-teal-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200 border border-white/40">
                          <Play className="w-5 h-5 ml-0.5 fill-teal-800 text-teal-800" />
                        </div>

                        {/* Top Bar Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-black/75 text-white text-[10px] font-semibold backdrop-blur-md border border-white/15 flex items-center gap-1">
                            <Folder className="w-3 h-3 text-teal-300" />
                            <span>{folderMeta ? (isUrdu ? folderMeta.shortTitleUr : folderMeta.shortTitleEn) : (vid.category || vid.originalCategory || vid.folderName || 'Drive')}</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-black/75 text-teal-200 text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md border border-white/15">
                            <Clock className="w-3 h-3 text-teal-300" />
                            <span>{vid.duration}</span>
                          </span>
                        </div>

                        {/* Speaker Bottom Overlay */}
                        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[11px] text-slate-100 px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-xs border border-white/10">
                          <span className="font-bold truncate max-w-[70%]">
                            {isUrdu ? vid.speakerUr : vid.speakerEn}
                          </span>
                          <span className="text-[10px] text-teal-300 font-mono font-bold">
                            {vid.badgeEn}
                          </span>
                        </div>
                      </div>

                      {/* Video Info Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 truncate max-w-[200px]">
                              {isUrdu ? vid.designationUr : vid.designationEn}
                            </span>
                            {vid.isDriveSynced && (
                              <span className="text-[9px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                <FolderSync className="w-2.5 h-2.5" />
                                <span>Drive</span>
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => {
                              triggerHaptic('light');
                              setActiveVideo(vid);
                            }}
                            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                          >
                            {isUrdu ? vid.titleUr : vid.titleEn}
                          </h3>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {isUrdu ? vid.summaryUr : vid.summaryEn}
                          </p>
                        </div>

                        {/* Action Buttons: Watch, Download, Drive, Edit, Copy, Delete */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* View/Watch Resource Button */}
                            <button
                              type="button"
                              onClick={() => {
                                triggerHaptic('light');
                                setActiveVideo(vid);
                              }}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition cursor-pointer flex items-center gap-1.5 min-h-[34px]"
                            >
                              <Play className="w-3.5 h-3.5 fill-teal-800 text-teal-800" />
                              <span>{isUrdu ? 'ویڈیو دیکھیں' : 'Watch'}</span>
                            </button>

                            {/* Direct Download Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(vid);
                              }}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center gap-1 min-h-[34px]"
                              title={isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download video directly'}
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                            </button>

                            {/* Open in Google Drive */}
                            <a
                              href={vid.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer flex items-center gap-1 min-h-[34px]"
                              title="Open on Google Drive"
                            >
                              <span>{isUrdu ? 'ڈرائیو' : 'Drive'}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Edit Button (Admin Only) */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  triggerHaptic('light');
                                  setEditingVideo(vid);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                                title="Edit title, description, and metadata"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Copy Link Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(vid)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              title={isCopied ? 'Copied!' : 'Copy Drive Link'}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete Button (Admin Only) */}
                            {isAdmin && (vid.isUserAdded || vid.isDriveSynced) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(vid.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Remove video from library"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 5B: Documents & Operational Files (Rendered STRICTLY BELOW videos) */}
          {filteredDocumentItems.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {isUrdu ? 'فیلڈ دستاویزات، آپریشنل کتابچے و رہنما گائیڈز' : 'Operational Documents, SOPs & Field Guides'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-900 border border-sky-200">
                        {filteredDocumentItems.length} {isUrdu ? 'دستاویزات' : 'Documents'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isUrdu
                        ? 'آپریشنل کتابچے، پی ڈی ایف گائیڈز اور فیلڈ مائیکرو پلاننگ اصول'
                        : 'Official PDF manuals, microplanning documents, guidelines, and visual resources'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocumentItems.map((doc) => {
                  const folderMeta = categories.find((f) => f.id === doc.folderId || f.shortTitleEn.toLowerCase() === doc.originalCategory?.toLowerCase());
                  const isCopied = copiedVideoId === doc.id;

                  return (
                    <div
                      key={doc.id}
                      className="saas-card rounded-2xl overflow-hidden border border-slate-200/90 hover:border-sky-500/60 bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      {/* Document Card Header */}
                      <div
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveVideo(doc);
                        }}
                        className="relative aspect-2/1 w-full overflow-hidden bg-slate-900 cursor-pointer flex items-center justify-center p-4 text-center"
                      >
                        {doc.thumbnailUrl ? (
                          <img
                            src={doc.thumbnailUrl}
                            alt={doc.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-300">
                            {doc.fileType === 'image' ? (
                              <ImageIcon className="w-8 h-8 text-emerald-400" />
                            ) : (
                              <FileText className="w-8 h-8 text-sky-400" />
                            )}
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              {doc.mimeType?.split('/')[1] || ((doc.name || doc.originalFilename || doc.titleEn || '').toLowerCase().endsWith('.pdf') ? 'PDF Document' : (doc.fileType === 'image' ? 'Image File' : 'Document'))}
                            </span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded-full bg-black/75 text-white text-[10px] font-semibold backdrop-blur-md border border-white/15 flex items-center gap-1">
                            <Folder className="w-3 h-3 text-sky-300" />
                            <span>{folderMeta ? (isUrdu ? folderMeta.shortTitleUr : folderMeta.shortTitleEn) : (doc.category || 'Drive')}</span>
                          </span>
                          {doc.fileSize && (
                            <span className="px-2 py-0.5 rounded-full bg-black/75 text-sky-200 text-[10px] font-mono font-bold backdrop-blur-md border border-white/15">
                              {doc.fileSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Document Details Body */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60 truncate max-w-[200px]">
                              {isUrdu ? doc.designationUr : doc.designationEn}
                            </span>
                            {doc.isDriveSynced && (
                              <span className="text-[9px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                <FolderSync className="w-2.5 h-2.5" />
                                <span>Drive</span>
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => {
                              triggerHaptic('light');
                              setActiveVideo(doc);
                            }}
                            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                          >
                            {isUrdu ? doc.titleUr : doc.titleEn}
                          </h3>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {isUrdu ? doc.summaryUr : doc.summaryEn}
                          </p>
                        </div>

                        {/* Action Buttons for Document */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Open Document Preview */}
                            <button
                              type="button"
                              onClick={() => {
                                triggerHaptic('light');
                                setActiveVideo(doc);
                              }}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition cursor-pointer flex items-center gap-1.5 min-h-[32px]"
                            >
                              <FileText className="w-3.5 h-3.5 text-sky-700" />
                              <span>{isUrdu ? 'دستاویز کھولیں' : 'Open Doc'}</span>
                            </button>

                            {/* Direct Download */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                              className="py-1.5 px-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                              title={isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download file'}
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                            </button>

                            {/* Drive Link */}
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer flex items-center gap-1 min-h-[32px]"
                            >
                              <span>{isUrdu ? 'ڈرائیو' : 'Drive'}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Copy Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(doc)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              title={isCopied ? 'Copied!' : 'Copy Link'}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete (Admin Only) */}
                            {isAdmin && (doc.isUserAdded || doc.isDriveSynced) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(doc.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Remove document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Video Player Modal with Google Drive Preview Embed */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {isUrdu ? activeVideo.titleUr : activeVideo.titleEn}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setEditingVideo(activeVideo);
                    }}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition flex items-center gap-1 text-xs"
                    title="Edit title and description"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isUrdu ? 'ترمیم' : 'Edit'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Embed Player */}
            <div className="overflow-y-auto flex-1 p-0">
              {/* Google Drive Player Container */}
              <div className="relative bg-black aspect-video max-h-80 sm:max-h-96 w-full flex items-center justify-center overflow-hidden">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.titleEn}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              {/* Video Deep Dive Information */}
              <div className="p-4 sm:p-6 space-y-4 text-xs">
                {/* Speaker Card */}
                <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-teal-300/80 flex-shrink-0 relative shadow-2xs">
                      <VideoThumbnail video={activeVideo} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-teal-900 truncate">
                        {isUrdu ? activeVideo.speakerUr : activeVideo.speakerEn}
                      </div>
                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        {isUrdu ? activeVideo.designationUr : activeVideo.designationEn}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(activeVideo)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs min-h-[34px]"
                      title={isUrdu ? 'براہ راست ڈاؤنلوڈ کریں' : 'Download file directly'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                    </button>
                    <a
                      href={activeVideo.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200 min-h-[34px]"
                    >
                      <span>{isUrdu ? 'ڈرائیو میں کھولیں' : 'Open in Drive'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">
                    {isUrdu ? 'ویڈیو خلاصہ و مقصد:' : 'Video Overview:'}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {isUrdu ? activeVideo.summaryUr : activeVideo.summaryEn}
                  </p>
                </div>

                {/* Key Points */}
                {activeVideo.keyPointsEn && activeVideo.keyPointsEn.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isUrdu ? 'اہم طبی و تربیتی نکات:' : 'Key Clinical & Persuasion Points:'}</span>
                    </h4>
                    <ul className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {(isUrdu ? activeVideo.keyPointsUr : activeVideo.keyPointsEn).map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Field Scenario */}
                {activeVideo.fieldScenarioEn && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                    <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isUrdu ? 'فیلڈ میں استعمال کا موقع:' : 'Recommended Field Scenario:'}</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {isUrdu ? activeVideo.fieldScenarioUr : activeVideo.fieldScenarioEn}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(activeVideo)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs min-h-[34px]"
                  title={isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download file directly'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ڈاؤنلوڈ کریں' : 'Download'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLink(activeVideo)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[34px]"
                >
                  {copiedVideoId === activeVideo.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVideoId === activeVideo.id ? (isUrdu ? 'کاپی ہو گیا' : 'Copied') : (isUrdu ? 'لنک کاپی کریں' : 'Copy Link')}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer min-h-[34px]"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Edit Video Modal */}
      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        categories={categories}
        isUrdu={isUrdu}
        onSave={handleSaveEditedVideo}
      />

      {/* 8. Google Drive Auto-Sync Settings Modal */}
      <DriveSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isUrdu={isUrdu}
        syncConfig={syncConfig}
        onSaveConfig={saveSyncConfig}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        lastSyncedCount={driveSyncedVideos.length}
      />

      {/* 9. Professional Add Video Modal with AI Autofill & Batch Support */}
      <AddVideoModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        categories={categories}
        isUrdu={isUrdu}
        onAddVideo={handleAddVideo}
      />

      {/* 10. Admin Authentication Modal (for Sync & Management controls) */}
      {isAdminAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setIsAdminAuthModalOpen(false);
            setAdminAuthError(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {isUrdu ? 'ایڈمن رسائی لاگ ان' : 'Admin Control Access'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isUrdu ? 'ڈرائیو سنک اور ایڈمن اختیارات' : 'Unlock Drive Sync & library controls'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  setAdminAuthError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlockAdmin();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'ایڈمن پاس کوڈ:' : 'Admin Passcode:'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (adminAuthError) setAdminAuthError(null);
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                  />
                </div>
                {adminAuthError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1.5">
                    {adminAuthError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthModalOpen(false);
                    setAdminAuthError(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'انلاک کریں' : 'Unlock Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
