import { DriveSyncConfig, VideoItem } from '../types';
import { CORE_VIDEO_ITEMS } from './coreVideos';

/**
 * ==============================================================================
 * Live Google Drive Configuration — Single Source of Truth
 * ==============================================================================
 * 
 * Google Drive Polio Tool Kit Master Folder:
 * ID: 102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv
 * Link: https://drive.google.com/drive/u/0/folders/102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv
 */

export const MASTER_FOLDER_ID = '102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';
export const MASTER_FOLDER_NAME = 'Polio Tool Kit';
export const MASTER_FOLDER_URL = 'https://drive.google.com/drive/u/0/folders/102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';

// Known baseline category folders inside the Polio Tool Kit master folder
export const KNOWN_DRIVE_FOLDERS = [
  {
    id: 'healthcare_professionals_videos',
    name: 'Health Care Professionals videos',
    category: 'Health Care Professionals videos',
    folderId: '1lhdR4hNbFfSYtkff86vclmH-r4vzUmgP',
  },
  {
    id: 'religious_leaders_videos',
    name: 'Health are Religious leaders videos',
    category: 'Health are Religious leaders videos',
    folderId: '1RmIO_PT5WOd07DYy17gwpQtKO8SW9QVi',
  },
];

// Storage keys
export const DRIVE_SYNC_STORAGE_KEY = 'polio_drive_synced_videos_v1';
export const DRIVE_CONFIG_STORAGE_KEY = 'polio_drive_sync_config_v1';
export const DRIVE_LAST_FETCH_TIMESTAMP_KEY = 'polio_drive_last_live_fetch_ts';

// Environment variable fallbacks (if configured in Vite/Build/Hosting)
export const ENV_APPS_SCRIPT_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DRIVE_APPS_SCRIPT_URL) || '';

export const ENV_DRIVE_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_DRIVE_API_KEY) || '';

/**
 * Retrieves the effective Drive sync configuration with cascading priority:
 * 1. User/Admin configured setting in localStorage
 * 2. Environment variables (VITE_DRIVE_APPS_SCRIPT_URL or VITE_GOOGLE_DRIVE_API_KEY)
 * 3. Default fallback values
 */
export function getEffectiveDriveSyncConfig(): DriveSyncConfig {
  let stored: Partial<DriveSyncConfig> = {};
  try {
    const raw = localStorage.getItem(DRIVE_CONFIG_STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {}

  const appsScriptUrl = (stored.appsScriptUrl || ENV_APPS_SCRIPT_URL || '').trim();
  const apiKey = (stored.apiKey || ENV_DRIVE_API_KEY || '').trim();
  const masterFolderId = (stored.masterFolderId || MASTER_FOLDER_ID).trim();
  const method = stored.method || (appsScriptUrl ? 'apps_script' : (apiKey ? 'drive_api' : 'apps_script'));

  return {
    method,
    appsScriptUrl,
    masterFolderId,
    apiKey,
    lastSyncedAt: stored.lastSyncedAt,
    autoSyncOnLoad: true, // Always true: Google Drive is the live source of truth
  };
}

/**
 * Saves updated Drive sync configuration to localStorage
 */
export function saveEffectiveDriveSyncConfig(config: DriveSyncConfig): void {
  try {
    localStorage.setItem(DRIVE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('[DriveConfig] Could not save config to localStorage', e);
  }
}

/**
 * Retrieves initial Drive resources for instantaneous mobile and first-time loading:
 * 1. Reads from localStorage if available and populated
 * 2. Falls back seamlessly to the verified CORE_VIDEO_ITEMS dataset
 * This ensures mobile users NEVER open to an empty screen after deployment!
 */
export function getInitialDriveResources(): VideoItem[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(DRIVE_SYNC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[DriveConfig] Error reading cached Drive resources:', e);
  }
  return CORE_VIDEO_ITEMS;
}

