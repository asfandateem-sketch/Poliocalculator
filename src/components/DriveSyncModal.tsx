import React, { useState } from 'react';
import { DriveSyncConfig } from '../types';
import { MASTER_FOLDER_ID, MASTER_FOLDER_NAME } from '../data/coreVideos';
import {
  X,
  HardDrive,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FolderSync,
  Code2,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface DriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUrdu: boolean;
  syncConfig: DriveSyncConfig;
  onSaveConfig: (cfg: DriveSyncConfig) => void;
  onTriggerSync: (overrideConfig?: DriveSyncConfig) => Promise<{
    success: boolean;
    count: number;
    error?: string;
    discoveredCount?: number;
    resultSummary?: string;
  }>;
  isSyncing: boolean;
  lastSyncedCount: number;
}

interface TestConnectionResult {
  success: boolean;
  latencyMs?: number;
  rootFolderId?: string;
  rootFolderName?: string;
  totalFilesFound?: number;
  categoriesDiscovered?: string[];
  diagnostic?: string;
  message?: string;
  preview?: string;
}

export const DriveSyncModal: React.FC<DriveSyncModalProps> = ({
  isOpen,
  onClose,
  isUrdu,
  syncConfig,
  onSaveConfig,
  onTriggerSync,
  isSyncing,
  lastSyncedCount,
}) => {
  if (!isOpen) return null;

  const [method, setMethod] = useState<'apps_script' | 'drive_api'>(syncConfig.method || 'apps_script');
  const [appsScriptUrl, setAppsScriptUrl] = useState(syncConfig.appsScriptUrl || '');
  const [masterFolderId, setMasterFolderId] = useState(syncConfig.masterFolderId || MASTER_FOLDER_ID);
  const [apiKey, setApiKey] = useState(syncConfig.apiKey || '');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Testing & diagnostic states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error'; text: string; diagnostic?: string } | null>(null);

  const sampleAppsScriptCode = `/**
 * ==============================================================================
 * Google Apps Script — Polio Tool Kit Master Auto-Sync Web App
 * ==============================================================================
 * 
 * SECURITY & SCOPE GUARANTEE:
 * - Operates EXCLUSIVELY inside your "Polio Tool Kit" root folder.
 * - NEVER accesses "My Drive" root or any unrelated folders/files.
 * - Recursively discovers all subfolders and supported files (Videos, Documents, Images).
 * - Dynamically exposes new folders as categories automatically.
 * 
 * SETUP INSTRUCTIONS (1-2 minutes):
 * 1. Go to https://script.google.com and click "+ New project".
 * 2. Delete any existing code and paste this ENTIRE script.
 * 3. Click "Deploy" > "New deployment".
 * 4. Select type: "Web app".
 * 5. Configuration:
 *    - Description: Polio Tool Kit Master Sync
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone  <-- (CRITICAL: enables website sync without login prompts)
 * 6. Click "Deploy", review permissions, and COPY the "Web app URL".
 * 7. Paste that Web app URL below and click "Test Connection" & "Save & Sync Now"!
 */

const POLIO_TOOL_KIT_ROOT_ID = '${masterFolderId || MASTER_FOLDER_ID}';

function doGet(e) {
  try {
    const targetFolderId = (e && e.parameter && e.parameter.folderId && e.parameter.folderId.trim()) 
      ? e.parameter.folderId.trim() 
      : POLIO_TOOL_KIT_ROOT_ID;

    let rootFolder;
    try {
      rootFolder = DriveApp.getFolderById(targetFolderId);
    } catch (accessErr) {
      return createJsonResponse({
        success: false,
        error: "Cannot access Polio Tool Kit folder (ID: " + targetFolderId + "). Please ensure the folder is shared as 'Anyone with the link can view'."
      });
    }

    const files = [];
    const categoriesMap = {};
    const subfolderStats = [];

    const VIDEO_REGEX = /\\.(mp4|webm|mov|m4v|avi|mkv|3gp)$/i;
    const DOC_REGEX = /\\.(pdf|docx?|pptx?|xlsx?|txt|csv)$/i;
    const IMG_REGEX = /\\.(jpe?g|png|webp|svg|gif)$/i;

    function scanFolder(folder, categoryName, depth) {
      if (depth > 8) return;
      const currentFolderName = folder.getName();
      const effectiveCategory = categoryName || currentFolderName;

      const folderFiles = folder.getFiles();
      let fileCountInFolder = 0;

      while (folderFiles.hasNext()) {
        const file = folderFiles.next();
        const name = file.getName();
        const mime = file.getMimeType() || "";

        let fileType = null;
        if (mime.indexOf("video/") !== -1 || VIDEO_REGEX.test(name)) {
          fileType = "video";
        } else if (
          mime.indexOf("pdf") !== -1 ||
          mime.indexOf("document") !== -1 ||
          mime.indexOf("msword") !== -1 ||
          mime.indexOf("presentation") !== -1 ||
          mime.indexOf("spreadsheet") !== -1 ||
          DOC_REGEX.test(name)
        ) {
          fileType = "document";
        } else if (mime.indexOf("image/") !== -1 || IMG_REGEX.test(name)) {
          fileType = "image";
        }

        if (fileType) {
          fileCountInFolder++;
          categoriesMap[effectiveCategory] = (categoriesMap[effectiveCategory] || 0) + 1;

          files.push({
            id: file.getId(),
            name: name,
            fileType: fileType,
            mimeType: mime,
            sizeBytes: file.getSize(),
            category: effectiveCategory,
            folderId: folder.getId(),
            folderName: currentFolderName,
            description: file.getDescription() || "",
            createdTime: file.getDateCreated().toISOString(),
            lastUpdated: file.getLastUpdated().toISOString(),
            viewUrl: file.getUrl(),
            downloadUrl: file.getDownloadUrl(),
            thumbnailLink: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w640"
          });
        }
      }

      subfolderStats.push({
        name: currentFolderName,
        category: effectiveCategory,
        filesFound: fileCountInFolder
      });

      const subfolders = folder.getFolders();
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        const nextCat = (folder.getId() === rootFolder.getId()) ? sub.getName() : effectiveCategory;
        scanFolder(sub, nextCat, depth + 1);
      }
    }

    const immediateSubs = rootFolder.getFolders();
    while (immediateSubs.hasNext()) {
      const sub = immediateSubs.next();
      scanFolder(sub, sub.getName(), 1);
    }

    const rootDirectFiles = rootFolder.getFiles();
    while (rootDirectFiles.hasNext()) {
      const file = rootDirectFiles.next();
      const name = file.getName();
      const mime = file.getMimeType() || "";

      let fileType = null;
      if (mime.indexOf("video/") !== -1 || VIDEO_REGEX.test(name)) fileType = "video";
      else if (mime.indexOf("pdf") !== -1 || DOC_REGEX.test(name)) fileType = "document";
      else if (mime.indexOf("image/") !== -1 || IMG_REGEX.test(name)) fileType = "image";

      if (fileType) {
        const cat = rootFolder.getName();
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
        files.push({
          id: file.getId(),
          name: name,
          fileType: fileType,
          mimeType: mime,
          sizeBytes: file.getSize(),
          category: cat,
          folderId: rootFolder.getId(),
          folderName: cat,
          description: file.getDescription() || "",
          createdTime: file.getDateCreated().toISOString(),
          viewUrl: file.getUrl(),
          thumbnailLink: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w640"
        });
      }
    }

    const categoriesList = Object.keys(categoriesMap).map(function(cat) {
      return { name: cat, count: categoriesMap[cat] };
    });

    return createJsonResponse({
      success: true,
      rootFolderId: rootFolder.getId(),
      rootFolderName: rootFolder.getName(),
      totalFiles: files.length,
      categories: categoriesList,
      subfolderStats: subfolderStats,
      files: files,
      scannedAt: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Dedicated Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setSyncStatusMsg(null);

    try {
      const response = await fetch('/api/drive/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptUrl: appsScriptUrl.trim(),
          folderId: masterFolderId.trim() || MASTER_FOLDER_ID,
          apiKey: apiKey.trim(),
        }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        diagnostic: 'NETWORK_ERROR',
        message: err.message || 'Failed to reach local server diagnostic endpoint.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndSync = async () => {
    setSyncStatusMsg(null);

    const newCfg: DriveSyncConfig = {
      method,
      appsScriptUrl: appsScriptUrl.trim(),
      masterFolderId: masterFolderId.trim() || MASTER_FOLDER_ID,
      apiKey: apiKey.trim(),
      autoSyncOnLoad: true,
      lastSyncedAt: syncConfig.lastSyncedAt, // Kept untouched until sync actually succeeds!
    };

    const result = await onTriggerSync(newCfg);
    if (result.success) {
      const updatedWithTimestamp: DriveSyncConfig = {
        ...newCfg,
        lastSyncedAt: new Date().toISOString(),
      };
      onSaveConfig(updatedWithTimestamp);
      setSyncStatusMsg({
        type: 'success',
        text: result.resultSummary || (isUrdu
          ? `گوگل ڈرائیو "Polio Tool Kit" سے ${result.count} وسائل کامیابی سے سنک ہو گئے!`
          : `Successfully synchronized ${result.count} resources from Google Drive "Polio Tool Kit"!`),
      });
    } else {
      setSyncStatusMsg({
        type: 'error',
        text: result.error || 'Sync failed. The previous synchronized count remains preserved.',
        diagnostic: 'SYNC_EXECUTION_FAILED',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
              <FolderSync className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{isUrdu ? 'گوگل ڈرائیو ماسٹر سنک سیٹنگز' : 'Polio Tool Kit — Google Drive Sync'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/30 text-teal-100 border border-teal-400/30">
                  Strict Scope
                </span>
              </h2>
              <p className="text-xs text-teal-100/90 font-medium">
                {isUrdu
                  ? 'ماسٹر فولڈر "Polio Tool Kit" سے تمام ذیلی فولڈرز اور فائلز کا خودکار سنک'
                  : 'Recursive auto-sync strictly restricted to "Polio Tool Kit" master folder'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Security & Strict Boundary Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>
                {isUrdu
                  ? 'سیکیورٹی گارنٹی: صرف "Polio Tool Kit" فولڈر ہی اسکین ہوگا'
                  : 'Security Notice: Strictly Scoped to "Polio Tool Kit"'}
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              {isUrdu
                ? 'ویب سائٹ آپ کی ذاتی گوگل ڈرائیو یا دیگر فولڈرز کو کبھی اسکین نہیں کرے گی۔ صرف نامزد پولیو ماسٹر فولڈر اور اس کے تمام ذیلی فولڈرز (Community Influencers, HCPs, Political, Religious, Training, TORs وغیرہ) کو کیٹیگریز کے طور پر پڑھا جائے گا۔'
                : 'The synchronization engine operates exclusively inside the configured "Polio Tool Kit" folder. It will never scan your personal Google Drive or unrelated files. Subfolders automatically become website categories with support for Videos (MP4/WebM/MOV), Documents (PDF/DOCX/PPTX), and Images.'}
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-emerald-800">
              <span className="font-semibold text-emerald-950">Root Folder:</span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                {MASTER_FOLDER_NAME} ({masterFolderId})
              </span>
            </div>
          </div>

          {/* Method Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMethod('apps_script')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                method === 'apps_script'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? 'طریقہ ۱: ایپس اسکرپٹ (مفت و تجویز کردہ)' : 'Method 1: Google Apps Script (Recommended)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod('drive_api')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                method === 'drive_api'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUrdu ? 'طریقہ ۲: گوگل کلاؤڈ API کلید' : 'Method 2: Google Drive API Key'}</span>
            </button>
          </div>

          {/* Method 1: Apps Script */}
          {method === 'apps_script' && (
            <div className="space-y-4">
              {/* Instructions & Script Code Box */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-slate-800">
                      {isUrdu ? 'پولیو ٹول کٹ ایپس اسکرپٹ کوڈ' : 'Polio Tool Kit Master Apps Script Code'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'کوڈ کاپی کریں' : 'Copy Script Code')}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <p>1. Open <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline inline-flex items-center gap-0.5">script.google.com <ExternalLink className="w-2.5 h-2.5" /></a> and click <strong>New project</strong>.</p>
                  <p>2. Paste the script code above, then click <strong>Deploy</strong> &rarr; <strong>New deployment</strong>.</p>
                  <p>3. Select type: <strong>Web app</strong>, Execute as: <strong>Me</strong>, and Who has access: <strong className="text-teal-900">Anyone</strong> (essential for website syncing without login prompts).</p>
                  <p>4. Copy the generated <strong>Web app URL</strong> and paste it into the field below.</p>
                </div>
              </div>

              {/* Apps Script Web App URL Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Google Apps Script Web App URL *
                </label>
                <input
                  type="url"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-slate-800 bg-white"
                />
              </div>

              {/* Master Folder ID */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Target Root Folder ID (Polio Tool Kit)
                </label>
                <input
                  type="text"
                  value={masterFolderId}
                  onChange={(e) => setMasterFolderId(e.target.value)}
                  placeholder={MASTER_FOLDER_ID}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-slate-800 bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default: <span className="font-mono text-slate-700 font-semibold">{MASTER_FOLDER_ID}</span> (Polio Tool Kit)
                </p>
              </div>
            </div>
          )}

          {/* Method 2: Google Drive v3 API Key */}
          {method === 'drive_api' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-semibold text-slate-900">Direct Google Drive v3 API</p>
                <p className="text-[11px] leading-relaxed">
                  Connects to the Google Drive v3 API using your API key. Traverses all subfolders directly inside the Polio Tool Kit folder.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Google Drive API Key *
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Google Drive Master Folder ID *
                </label>
                <input
                  type="text"
                  value={masterFolderId}
                  onChange={(e) => setMasterFolderId(e.target.value)}
                  placeholder={MASTER_FOLDER_ID}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {/* Test Connection Diagnostic Box */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                testResult.success
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {testResult.success
                      ? isUrdu
                        ? 'رابطہ کامیاب رہا! فولڈر رسائی کی تصدیق ہو گئی'
                        : 'Connection Test Succeeded!'
                      : isUrdu
                      ? 'رابطہ ناکام — تشخیصی معلومات'
                      : 'Connection Test Diagnostic Error'}
                  </span>
                </div>
                {testResult.latencyMs && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
                    {testResult.latencyMs} ms
                  </span>
                )}
              </div>

              {testResult.success ? (
                <div className="space-y-1.5 text-[11px]">
                  <p>
                    <strong>Target Folder:</strong> {testResult.rootFolderName || 'Polio Tool Kit'} ({testResult.rootFolderId})
                  </p>
                  <p>
                    <strong>Total Files Discovered:</strong> {testResult.totalFilesFound} items
                  </p>
                  {testResult.categoriesDiscovered && testResult.categoriesDiscovered.length > 0 && (
                    <div>
                      <strong>Discovered Categories ({testResult.categoriesDiscovered.length}):</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {testResult.categoriesDiscovered.map((cat, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 font-medium text-[10px]">
                            {typeof cat === 'string' ? cat : (cat as any).name || 'Category'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-[11px]">
                  <p className="font-semibold text-rose-950">Diagnostic: {testResult.diagnostic || 'ERROR'}</p>
                  <p className="leading-relaxed">{testResult.message}</p>
                  {testResult.preview && (
                    <div className="p-2 mt-1 rounded bg-rose-100/70 border border-rose-200 font-mono text-[10px] break-all">
                      {testResult.preview}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sync Status Banner */}
          {syncStatusMsg && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                syncStatusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {syncStatusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {syncStatusMsg.type === 'success' ? 'Sync Completed' : 'Sync failed'}
                </span>
                <span className="text-[11px] leading-relaxed block">{syncStatusMsg.text}</span>
              </div>
            </div>
          )}

          {/* Current Sync Info Bar */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-500">Last Synced: </span>
              <span className="font-semibold text-slate-800">
                {syncConfig.lastSyncedAt
                  ? new Date(syncConfig.lastSyncedAt).toLocaleString()
                  : 'Not yet synced'}
              </span>
            </div>
            <div className="text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {lastSyncedCount} Resources Currently Loaded
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            {/* Dedicated Test Connection Button */}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || isSyncing || (method === 'apps_script' && !appsScriptUrl) || (method === 'drive_api' && !apiKey)}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Activity className={`w-3.5 h-3.5 text-teal-700 ${isTesting ? 'animate-pulse' : ''}`} />
              <span>
                {isTesting
                  ? isUrdu ? 'ٹیسٹ جاری ہے...' : 'Testing...'
                  : isUrdu ? 'کنکشن ٹیسٹ کریں' : 'Test Connection'}
              </span>
            </button>

            {/* Save & Sync Now */}
            <button
              type="button"
              onClick={handleSaveAndSync}
              disabled={isSyncing || isTesting}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing
                  ? isUrdu
                    ? 'سنک جاری ہے...'
                    : 'Syncing Drive...'
                  : isUrdu
                  ? 'محفوظ اور سنک کریں'
                  : 'Save & Sync Now'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
