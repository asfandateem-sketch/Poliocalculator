import React from 'react';

export type FolderId =
  | 'healthcare_professionals'
  | 'community_influencers'
  | 'religious_influencers'
  | 'political_administrative'
  | 'other_videos'
  | string;

export interface FolderDefinition {
  id: FolderId;
  titleEn: string;
  titleUr: string;
  shortTitleEn: string;
  shortTitleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: React.ElementType;
  badgeEn: string;
  badgeUr: string;
  driveFolderUrl: string;
  driveFolderId?: string;
  accentColor: string;
  badgeColor: string;
  isCustom?: boolean;
}

export type SupportedFileType = 'video' | 'document' | 'image' | 'other';

export interface VideoItem {
  id: string;
  name?: string;
  folderId: FolderId;
  category?: string;
  folderName?: string;
  originalCategory?: string;
  originalFilename?: string;
  fileType?: SupportedFileType;
  mimeType?: string;
  sizeBytes?: number;
  fileSize?: string;
  extension?: string;
  description?: string;
  createdTime?: string;
  lastUpdated?: string;
  viewUrl?: string;
  downloadUrl?: string;
  thumbnailLink?: string;
  titleEn: string;
  titleUr: string;
  speakerEn: string;
  speakerUr: string;
  designationEn: string;
  designationUr: string;
  duration: string;
  driveFolderId?: string;
  driveFileId?: string;
  driveUrl: string;
  embedUrl: string;
  thumbnailUrl?: string;
  badgeEn: string;
  badgeUr: string;
  summaryEn: string;
  summaryUr: string;
  keyPointsEn: string[];
  keyPointsUr: string[];
  fieldScenarioEn: string;
  fieldScenarioUr: string;
  featured?: boolean;
  isUserAdded?: boolean;
  isDriveSynced?: boolean;
  syncedAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface DriveSyncConfig {
  method: 'apps_script' | 'drive_api';
  appsScriptUrl: string;
  masterFolderId: string;
  apiKey: string;
  lastSyncedAt?: string;
  autoSyncOnLoad: boolean;
}
