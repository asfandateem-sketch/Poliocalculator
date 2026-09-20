import { VideoItem, SupportedFileType, DriveSyncConfig, FolderDefinition } from './types';
import { MASTER_FOLDER_ID, MASTER_FOLDER_URL } from './data/coreVideos';
import {
  getEffectiveDriveSyncConfig,
  DRIVE_SYNC_STORAGE_KEY,
  DRIVE_LAST_FETCH_TIMESTAMP_KEY,
} from './data/driveLiveConfig';

export interface DriveSubfolderMeta {
  name: string;
  category?: string;
  folderId?: string;
  filesFound?: number;
}

export interface DriveSyncImportResult {
  success: boolean;
  discoveredCount: number;
  acceptedCount: number;
  failedCount: number;
  failedReasons: string[];
  resultSummary: string;
  importedItems: VideoItem[];
  allSyncedItems: VideoItem[];
  subfolders?: DriveSubfolderMeta[];
  error?: string;
}

export function classifyFileType(name?: string, mimeType?: string): SupportedFileType {
  const nm = (name || '').toLowerCase();
  const mt = (mimeType || '').toLowerCase();

  // Video extensions & MIME
  if (
    mt.includes('video') ||
    /\.(mp4|webm|mov|m4v|avi|mkv|wmv|flv|3gp|ogv)$/i.test(nm)
  ) {
    return 'video';
  }

  // Document extensions & MIME
  if (
    mt.includes('pdf') ||
    mt.includes('document') ||
    mt.includes('word') ||
    mt.includes('sheet') ||
    mt.includes('presentation') ||
    mt.includes('text/') ||
    /\.(pdf|docx?|pptx?|xlsx?|txt|rtf|odt|ods|odp|csv)$/i.test(nm)
  ) {
    return 'document';
  }

  // Image extensions & MIME
  if (
    mt.includes('image') ||
    /\.(jpe?g|png|webp|svg|gif|bmp|tiff?|ico)$/i.test(nm)
  ) {
    return 'image';
  }

  return 'other';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'polio_tool_kit';
}

function formatBytes(bytes?: number): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '';
  if (bytes > 1048576) {
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

function cleanTitle(name?: string): string {
  if (!name) return 'Untitled Resource';
  const withoutExt = name.replace(/\.[a-zA-Z0-9]+$/, '');
  const spaced = withoutExt.replace(/[_\-]+/g, ' ').trim();
  return spaced
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || name;
}

/**
 * Normalizes every returned file while preserving all 13+ required fields:
 * id, name, fileType, mimeType, category, folderId, folderName,
 * description, sizeBytes, createdTime, lastUpdated, viewUrl, downloadUrl, thumbnailLink
 */
export function normalizeDriveResource(
  raw: any,
  index: number,
  total: number
): { item: VideoItem | null; reason?: string } {
  if (!raw || typeof raw !== 'object') {
    const reason = `Record at index ${index} is not a valid object`;
    console.warn(`[DriveSync] Normalization rejected [${index + 1}/${total}]: ${reason}`, raw);
    return { item: null, reason };
  }

  // File identity
  const rawId = raw.id || raw.driveFileId || raw.fileId || `drive-res-${index}-${Date.now()}`;
  const name = raw.name || raw.filename || raw.title || `Resource ${index + 1}`;
  const fileType: SupportedFileType = raw.fileType || classifyFileType(name, raw.mimeType);
  const mimeType = raw.mimeType || '';

  // Folder & Category mapping from Google Drive
  const rawFolder = (raw.folderName || raw.category || '').trim();
  const folderLower = rawFolder.toLowerCase();
  const textToScan = `${name} ${raw.speakerEn || ''} ${raw.titleEn || ''}`.toLowerCase();
  const isReligiousFile = /mufti|molana|maulana|ulema|scholar|imam|taqi|islam|fatwa|deen|halal|shariah|masjid|council|religio/.test(textToScan);
  const isDoctorFile = /\bdr\b|doctor|pediatric|bawar|qasim|ghulam|qadir|hospital|medical|dhq|thq|specialist|physician|surgeon|mbbs/.test(textToScan);

  let category = rawFolder || 'Health Care Professionals';
  let folderName = rawFolder || category;
  let folderId = 'healthcare_professionals_videos';

  if (folderLower.includes('religio') || folderLower.includes('scholar') || folderLower.includes('ulema')) {
    folderId = 'religious_leaders_videos';
    category = 'Religious Influencers';
    folderName = 'Religious Influencers';
  } else if (folderLower.includes('health') || folderLower.includes('doctor') || folderLower.includes('hcp') || folderLower.includes('profess')) {
    folderId = 'healthcare_professionals_videos';
    category = 'Health Care Professionals';
    folderName = 'Health Care Professionals';
  } else if (rawFolder && !['polio tools kit', 'polio tool kit', 'communication resources', 'root', ''].includes(folderLower)) {
    // Exact user-configured Drive folder (e.g. "Other videos", "Community Influencers", etc.)
    folderId = slugify(rawFolder);
    category = rawFolder;
    folderName = rawFolder;
  } else {
    // Generic root folder - classify by content
    if (isReligiousFile && !isDoctorFile) {
      folderId = 'religious_leaders_videos';
      category = 'Religious Influencers';
      folderName = 'Religious Influencers';
    } else {
      folderId = 'healthcare_professionals_videos';
      category = 'Health Care Professionals';
      folderName = 'Health Care Professionals';
    }
  }

  // Metadata & Timestamps
  const description = raw.description || '';
  const sizeBytes = typeof raw.sizeBytes === 'number'
    ? raw.sizeBytes
    : (raw.size && !isNaN(parseInt(raw.size, 10)) ? parseInt(raw.size, 10) : undefined);
  const formattedSize = formatBytes(sizeBytes);
  const createdTime = raw.createdTime || raw.dateCreated || '';
  const lastUpdated = raw.lastUpdated || raw.modifiedTime || createdTime || new Date().toISOString();

  // URLs
  const viewUrl = raw.viewUrl || raw.driveUrl || (raw.id ? `https://drive.google.com/file/d/${raw.id}/view` : '#');
  const downloadUrl = raw.downloadUrl || (raw.id ? `https://drive.google.com/uc?export=download&id=${raw.id}` : undefined);
  const thumbnailLink = raw.thumbnailLink || raw.thumbnailUrl || (raw.id ? `https://drive.google.com/thumbnail?id=${raw.id}&sz=w640` : '');

  // UI Presentation fields
  const cTitle = cleanTitle(name);
  const titleEn = raw.titleEn || cTitle;
  const titleUr = raw.titleUr || (
    fileType === 'video'
      ? `${cTitle} (ویڈیو)`
      : fileType === 'document'
      ? `${cTitle} (دستاویز)`
      : cTitle
  );

  const speakerEn = raw.speakerEn || (fileType === 'video' ? 'Polio Communication Resource' : folderName);
  const speakerUr = raw.speakerUr || (fileType === 'video' ? 'پولیو فیلڈ ریسورس' : folderName);

  const designationEn = raw.designationEn || (
    fileType === 'video'
      ? `${folderName} Resource`
      : fileType === 'document'
      ? 'Operational & Guidance Document'
      : fileType === 'image'
      ? 'Communication Visual Resource'
      : 'Resource Material'
  );
  const designationUr = raw.designationUr || (
    fileType === 'video'
      ? 'مواصلاتی و تربیتی ویڈیو'
      : fileType === 'document'
      ? 'آپریشنل و رہنمائی دستاویز'
      : 'بصری فیلڈ مواد'
  );

  const duration = raw.duration || formattedSize || (
    fileType === 'video' ? 'Video' : fileType === 'document' ? 'Document' : 'Resource'
  );

  const summaryEn = raw.summaryEn || description || `Official resource from Google Drive "Polio Tool Kit / ${folderName}". Accessible for campaign staff, supervisors, and frontline mobilizers.`;
  const summaryUr = raw.summaryUr || `گوگل ڈرائیو "Polio Tool Kit / ${folderName}" سے مستند مواد برائے فیلڈ ورکرز۔`;

  const keyPointsEn = Array.isArray(raw.keyPointsEn) && raw.keyPointsEn.length > 0
    ? raw.keyPointsEn
    : [`Filename: ${name}`, `Category: ${folderName}`, formattedSize ? `Size: ${formattedSize}` : `Direct Drive access`];
  const keyPointsUr = Array.isArray(raw.keyPointsUr) && raw.keyPointsUr.length > 0
    ? raw.keyPointsUr
    : [`فائل: ${name}`, `شعبہ: ${folderName}`, formattedSize ? `سائز: ${formattedSize}` : `ڈرائیو رسائی`];

  const fieldScenarioEn = raw.fieldScenarioEn || `Reference during campaign preparation, microplan execution, or team briefings in ${folderName}.`;
  const fieldScenarioUr = raw.fieldScenarioUr || `مہم کی تیاری یا فیلڈ سرگرمیوں کے دوران استعمال کریں۔`;

  const item: VideoItem = {
    // Spread all future raw properties for future-proofing
    ...raw,
    // Normalized system IDs
    id: String(rawId).startsWith('drive-sync-') ? String(rawId) : `drive-sync-${rawId}`,
    driveFileId: String(rawId),
    driveFolderId: raw.folderId || MASTER_FOLDER_ID,
    name,
    originalFilename: name,
    fileType,
    mimeType,
    category,
    originalCategory: category,
    folderId,
    folderName,
    description,
    sizeBytes,
    fileSize: formattedSize,
    createdTime,
    lastUpdated,
    viewUrl,
    driveUrl: viewUrl,
    downloadUrl,
    embedUrl: raw.embedUrl || (raw.id ? `https://drive.google.com/file/d/${raw.id}/preview` : ''),
    thumbnailLink,
    thumbnailUrl: thumbnailLink || undefined,
    titleEn,
    titleUr,
    speakerEn,
    speakerUr,
    designationEn,
    designationUr,
    duration,
    badgeEn: folderName,
    badgeUr: folderName,
    summaryEn,
    summaryUr,
    keyPointsEn,
    keyPointsUr,
    fieldScenarioEn,
    fieldScenarioUr,
    isDriveSynced: true,
    syncedAt: new Date().toISOString(),
  };

  console.log(
    `[DriveSync] Normalized file [${index + 1}/${total}]: "${name}" (ID: ${rawId}) -> Type: ${fileType}, Folder: "${folderName}"`
  );

  return { item };
}

/**
 * Normalizes all files and idempotently merges into existing resource store
 */
export function importAllDriveFiles(
  rawFiles: any[],
  existingResources: VideoItem[],
  subfolders: DriveSubfolderMeta[] = []
): DriveSyncImportResult {
  console.log(`[DriveSync] Starting normalization for ${rawFiles.length} files...`);

  const acceptedItems: VideoItem[] = [];
  const rejectedItems: Array<{ file: any; reason: string }> = [];

  rawFiles.forEach((file, index) => {
    const { item, reason } = normalizeDriveResource(file, index, rawFiles.length);
    if (item) {
      acceptedItems.push(item);
    } else {
      rejectedItems.push({ file, reason: reason || 'Unknown normalization failure' });
    }
  });

  const discoveredCount = rawFiles.length;
  const acceptedCount = acceptedItems.length;
  const failedCount = rejectedItems.length;
  const failedReasons = rejectedItems.map((r) => r.reason);

  console.log(
    `[DriveSync] Normalization completed: ${acceptedCount} accepted, ${failedCount} rejected out of ${discoveredCount} discovered.`
  );

  if (discoveredCount > 0 && acceptedCount === 0) {
    const errorMsg = `Sync failed: ${discoveredCount} files were returned from Google Drive but 0 could be imported. Rejection reasons: ${failedReasons.join('; ')}`;
    console.error(`[DriveSync] ${errorMsg}`);
    return {
      success: false,
      discoveredCount,
      acceptedCount: 0,
      failedCount,
      failedReasons,
      resultSummary: `${discoveredCount} files discovered → 0 resources loaded → ${failedCount} failed`,
      importedItems: [],
      allSyncedItems: existingResources,
      subfolders,
      error: errorMsg,
    };
  }

  // Idempotent update: newly synchronized resources are the source of truth,
  // preserving custom user edits if the user explicitly modified title or summary
  const existingMap = new Map<string, VideoItem>();
  for (const existing of existingResources) {
    if (existing.driveFileId || existing.isDriveSynced) {
      const key = existing.driveFileId || existing.id;
      existingMap.set(key, existing);
    }
  }

  const mergedMap = new Map<string, VideoItem>();
  for (const newItem of acceptedItems) {
    const key = newItem.driveFileId || newItem.id;
    const existing = existingMap.get(key);

    if (existing && existing.updatedAt) {
      // Preserve explicit user manual overrides if present
      mergedMap.set(key, {
        ...newItem,
        titleEn: existing.titleEn,
        titleUr: existing.titleUr,
        speakerEn: existing.speakerEn,
        speakerUr: existing.speakerUr,
        designationEn: existing.designationEn,
        designationUr: existing.designationUr,
        summaryEn: existing.summaryEn,
        summaryUr: existing.summaryUr,
        updatedAt: existing.updatedAt,
      });
    } else {
      mergedMap.set(key, newItem);
    }
  }

  const allSyncedItems = Array.from(mergedMap.values());

  // Persist to localStorage
  try {
    localStorage.setItem('polio_drive_synced_videos_v1', JSON.stringify(allSyncedItems));
    console.log(
      `[DriveSync] Persistence result: Successfully saved ${allSyncedItems.length} resources to localStorage key: polio_drive_synced_videos_v1`
    );
  } catch (storageErr) {
    console.error('[DriveSync] Failed to persist resources to localStorage:', storageErr);
  }

  const resultSummary =
    failedCount === 0
      ? `${discoveredCount} files discovered → ${acceptedCount} resources loaded`
      : `${discoveredCount} files discovered → ${acceptedCount} resources loaded → ${failedCount} failed (${failedReasons[0]})`;

  return {
    success: true,
    discoveredCount,
    acceptedCount,
    failedCount,
    failedReasons,
    resultSummary,
    importedItems: acceptedItems,
    allSyncedItems,
    subfolders,
  };
}

/**
 * Direct client-side Google Drive API v3 fetcher (browser & static GitHub Pages friendly)
 */
export async function fetchDriveApiData(
  config: DriveSyncConfig
): Promise<{ rawFiles: any[]; status: number; message?: string }> {
  const apiKey = (config.apiKey || '').trim();
  const folderId = (config.masterFolderId || MASTER_FOLDER_ID).trim();

  if (!apiKey) {
    throw new Error('Google Drive API Key is required for Direct API mode.');
  }

  console.log('[DriveSync] Querying Google Drive API v3 directly from client...');
  const cacheBuster = Date.now().toString();

  // Helper to query Drive v3
  const queryDriveFiles = async (parentFolderId: string, categoryName: string) => {
    const q = `'${parentFolderId}' in parents and trashed = false`;
    const fields = 'files(id,name,mimeType,thumbnailLink,description,size,createdTime,modifiedTime,webViewLink,webContentLink)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=100&key=${encodeURIComponent(apiKey)}&_t=${cacheBuster}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message || `Google Drive API error (status ${res.status})`;
      throw new Error(msg);
    }

    const data = await res.json();
    const files = data.files || [];
    return files.map((f: any) => ({
      id: f.id,
      name: f.name,
      fileType: classifyFileType(f.name, f.mimeType),
      mimeType: f.mimeType,
      sizeBytes: f.size ? parseInt(f.size, 10) : undefined,
      category: categoryName,
      folderId: parentFolderId,
      folderName: categoryName,
      description: f.description || '',
      createdTime: f.createdTime,
      lastUpdated: f.modifiedTime,
      viewUrl: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
      downloadUrl: f.webContentLink || `https://drive.google.com/uc?export=download&id=${f.id}`,
      thumbnailLink: f.thumbnailLink || `https://drive.google.com/thumbnail?id=${f.id}&sz=w640`,
    }));
  };

  // 1. Fetch immediate children of root folder
  const rootItems = await queryDriveFiles(folderId, 'Polio Tool Kit');

  const filesToImport: any[] = [];
  const subfolders = rootItems.filter((i) => i.mimeType === 'application/vnd.google-apps.folder');
  const directFiles = rootItems.filter((i) => i.mimeType !== 'application/vnd.google-apps.folder');
  filesToImport.push(...directFiles);

  // 2. Fetch files in subfolders (e.g. Health Care Professionals videos, Religious Leaders videos)
  for (const sub of subfolders) {
    try {
      const subItems = await queryDriveFiles(sub.id, sub.name);
      const subFiles = subItems.filter((i) => i.mimeType !== 'application/vnd.google-apps.folder');
      filesToImport.push(...subFiles);
    } catch (subErr) {
      console.warn(`[DriveSync] Could not fetch subfolder "${sub.name}":`, subErr);
    }
  }

  console.log(`[DriveSync] Drive API v3 returned ${filesToImport.length} files.`);
  return { rawFiles: filesToImport, status: 200 };
}

/**
 * Fetches the Apps Script endpoint with direct browser fetch and cache-busting
 */
export async function fetchAppsScriptData(
  config: DriveSyncConfig
): Promise<{ rawFiles: any[]; status: number; message?: string; subfolders?: DriveSubfolderMeta[] }> {
  const url = (config.appsScriptUrl || '').trim();
  const folderId = (config.masterFolderId || MASTER_FOLDER_ID).trim();

  if (!url) {
    throw new Error('Google Apps Script URL is required. Please paste your deployed Web App URL.');
  }

  console.log('[DriveSync] Starting live fetch from Apps Script...');
  console.log('[DriveSync] Target Root Folder ID:', folderId);

  let rawFiles: any[] = [];
  let responseStatus = 0;
  let responseData: any = null;

  // 1. Try server-side API proxy first (bypasses browser CORS, follows Google redirects)
  try {
    const proxyRes = await fetch('/api/drive/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptUrl: url, folderId, apiKey: config.apiKey }),
    });
    if (proxyRes.ok) {
      responseData = await proxyRes.json();
      responseStatus = proxyRes.status;
      console.log('[DriveSync] Server-side proxy responded successfully.');
    }
  } catch (proxyErr: any) {
    console.warn('[DriveSync] Server-side proxy attempt failed, falling back to direct fetch:', proxyErr?.message || proxyErr);
  }

  // 2. Direct browser fetch fallback if server proxy was not available
  if (!responseData) {
    try {
      const targetUrl = new URL(url);
      targetUrl.searchParams.set('folderId', folderId);
      targetUrl.searchParams.set('_t', Date.now().toString());
      console.log('[DriveSync] Direct fetch to Apps Script URL:', targetUrl.toString());

      const directRes = await fetch(targetUrl.toString(), {
        cache: 'no-store',
        redirect: 'follow',
      });

      responseStatus = directRes.status;
      const text = await directRes.text();

      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Google Apps Script returned an HTML page instead of JSON.');
      } else {
        responseData = JSON.parse(text);
      }
    } catch (directErr: any) {
      console.warn('[DriveSync] Direct fetch error:', directErr?.message || directErr);
      throw directErr;
    }
  }

  // Extract raw files array using data.files as source of truth
  if (responseData && Array.isArray(responseData.files)) {
    rawFiles = responseData.files;
  } else if (Array.isArray(responseData)) {
    rawFiles = responseData;
  } else if (responseData && Array.isArray(responseData.videos)) {
    rawFiles = responseData.videos;
  } else if (responseData && Array.isArray(responseData.items)) {
    rawFiles = responseData.items;
  } else {
    throw new Error('Unexpected Apps Script response format: expected a JSON object with a "files" array.');
  }

  console.log(`[DriveSync] Live source of truth: extracted ${rawFiles.length} raw files from response.`);

  const subfolders: DriveSubfolderMeta[] =
    responseData && Array.isArray(responseData.subfolderStats)
      ? responseData.subfolderStats.map((s: any) => ({
          name: s.name,
          category: s.category,
          folderId: s.folderId,
          filesFound: s.filesFound,
        }))
      : [];

  return { rawFiles, status: responseStatus, subfolders };
}

/**
 * Master sync execution orchestrator
 */
export async function runFullDriveSync(
  config: DriveSyncConfig,
  existingResources: VideoItem[]
): Promise<DriveSyncImportResult> {
  const method = config.method || (config.appsScriptUrl ? 'apps_script' : (config.apiKey ? 'drive_api' : 'apps_script'));

  let fetchResult: { rawFiles: any[]; status: number; message?: string; subfolders?: DriveSubfolderMeta[] };

  if (method === 'drive_api' || (!config.appsScriptUrl && config.apiKey)) {
    fetchResult = await fetchDriveApiData(config);
  } else {
    fetchResult = await fetchAppsScriptData(config);
  }

  return importAllDriveFiles(fetchResult.rawFiles, existingResources, fetchResult.subfolders || []);
}

/**
 * Live Drive Resource Loader: Automatically queries Google Drive live
 * and updates application state, localStorage backup, and cross-component events.
 */
export async function fetchLiveDriveResources(
  customConfig?: DriveSyncConfig,
  existingVideos: VideoItem[] = []
): Promise<DriveSyncImportResult> {
  const config = customConfig || getEffectiveDriveSyncConfig();

  // If neither Apps Script URL nor API key is configured, return graceful notice
  if (!config.appsScriptUrl && !config.apiKey) {
    return {
      success: false,
      discoveredCount: 0,
      acceptedCount: 0,
      failedCount: 0,
      failedReasons: ['No Google Apps Script URL or API Key configured yet.'],
      resultSummary: 'Drive live endpoint not configured.',
      importedItems: [],
      allSyncedItems: existingVideos,
      error: 'No connection credentials provided.',
    };
  }

  const result = await runFullDriveSync(config, existingVideos);

  if (result.success && result.allSyncedItems.length > 0) {
    try {
      localStorage.setItem(DRIVE_LAST_FETCH_TIMESTAMP_KEY, new Date().toISOString());
      // Broadcast update event for all components (VideosSection, DocumentsSection, Search)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('polio_drive_synced', {
            detail: {
              items: result.allSyncedItems,
              subfolders: result.subfolders || [],
              timestamp: new Date().toISOString(),
              summary: result.resultSummary,
            },
          })
        );
      }
    } catch {}
  }

  return result;
}
