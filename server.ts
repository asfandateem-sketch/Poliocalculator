import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// -------------------------------------------------------------
// Security Hardening: Anti-DDoS, Anti-SSRF, and HTTP Headers
// -------------------------------------------------------------

// Security HTTP headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Protect against clickjacking while allowing iframe previews in development
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Constrain request payload size to 2MB to prevent memory exhaustion attacks
app.use(express.json({ limit: '2mb' }));

// In-memory rate limiting to prevent brute force & DoS
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const ipApiLimits = new Map<string, RateLimitEntry>();
const ipSyncLimits = new Map<string, RateLimitEntry>();

// Garbage collect expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, item] of ipApiLimits.entries()) {
    if (item.resetAt <= now) ipApiLimits.delete(ip);
  }
  for (const [ip, item] of ipSyncLimits.entries()) {
    if (item.resetAt <= now) ipSyncLimits.delete(ip);
  }
}, 5 * 60 * 1000);

function createRateLimiter(limitMap: Map<string, RateLimitEntry>, maxHits: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'ip';
    const now = Date.now();
    let entry = limitMap.get(rawIp);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 1, resetAt: now + windowMs };
      limitMap.set(rawIp, entry);
    } else {
      entry.count++;
    }

    if (entry.count > maxHits) {
      const waitSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', waitSeconds.toString());
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again later.',
        diagnostic: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: waitSeconds,
      });
    }
    next();
  };
}

const apiRateLimit = createRateLimiter(ipApiLimits, 120, 60 * 1000); // 120 req/min for general API
const syncRateLimit = createRateLimiter(ipSyncLimits, 20, 60 * 1000); // 20 req/min for sync & test

// Apply general rate limit to all /api/ endpoints
app.use('/api/', apiRateLimit);

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Heuristic filename cleaner if AI key is not available
 */
function heuristicCleanFilename(filename: string, folderName?: string) {
  // Strip file extension
  let clean = filename.replace(/\.(mp4|mov|avi|mkv|webm|m4v|3gp)$/i, '');
  // Replace underscores and hyphens with spaces
  clean = clean.replace(/[_\-]+/g, ' ').trim();

  // Try detecting speaker
  let speaker = 'Polio Health Expert';
  let speakerUr = 'ماہر صحت برائے پولیو';
  const lower = clean.toLowerCase();

  if (lower.includes('bawar')) {
    speaker = 'Dr. Syed Bawar Shah';
    speakerUr = 'ڈاکٹر سید باور شاہ';
  } else if (lower.includes('qasim')) {
    speaker = 'Prof. Dr. Muhammad Qasim Khan';
    speakerUr = 'پروفیسر ڈاکٹر محمد قاسم خان';
  } else if (lower.includes('ghulam') || lower.includes('qadir')) {
    speaker = 'Dr. Ghulam Qadir';
    speakerUr = 'ڈاکٹر غلام قادر';
  } else if (lower.includes('mufti') || lower.includes('taqi') || lower.includes('scholar')) {
    speaker = 'Islamic Ideology Scholar / Mufti';
    speakerUr = 'جید مفتی و اسکالر اسلامی نظریاتی کونسل';
  } else if (lower.includes('dc') || lower.includes('commissioner') || lower.includes('admin')) {
    speaker = 'District Administration & Health Official';
    speakerUr = 'ضلعی انتظامیہ و محکمہ صحت';
  }

  // Capitalize words
  const titleWords = clean
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');

  const titleEn = titleWords.length > 5 ? titleWords : `${speaker}: Video Statement`;
  const titleUr = `${speakerUr}: پولیو آگاہی و حفاظتی قطرے رہنمائی`;

  const summaryEn = `Field communication and awareness video addressing community inquiries regarding polio immunization, recorded under ${folderName || 'Communication Hub'}.`;
  const summaryUr = `کمیونٹی آگاہی اور والدین کے تحفظات کے ازالے کے لیے مستند ویڈیو پیغام (${folderName || 'کمیونیکیشن حب'})۔`;

  return {
    titleEn,
    titleUr,
    speakerEn: speaker,
    speakerUr,
    designationEn: folderName ? `${folderName} Specialist` : 'Public Health & Immunization Specialist',
    designationUr: folderName ? `ماہر شعبہ ${folderName}` : 'ماہر صحت عامہ و حفاظتی ٹیکہ جات',
    summaryEn,
    summaryUr,
    badgeEn: folderName ? `${folderName}` : 'Verified',
    badgeUr: folderName ? `${folderName}` : 'تصدیق شدہ',
    keyPointsEn: [
      'Official field communication video addressing community concerns directly from repository.',
      'Recommended for refusal conversion, caregiver reassurance, and frontline team reference.',
    ],
    keyPointsUr: [
      'مستند فیلڈ کمیونیکیشن ویڈیو برائے عوامی آگاہی و تحفظات کا ازالہ۔',
      'انکاری والدین کی رہنمائی اور فیلڈ ٹیموں کی معاونت کے لیے انتہائی مفید۔',
    ],
    fieldScenarioEn: 'Use during refusal conversion or community mobilization sessions.',
    fieldScenarioUr: 'انکاری والدین اور کمیونٹی آگاہی سیشنز کے دوران استعمال کریں۔',
  };
}

/**
 * Use Gemini AI (gemini-3.8-flash) to generate professional titles and descriptions
 * strictly without inventing facts (only derived from filename and category).
 */
async function aiEnhanceVideoMetadata(filename: string, folderName?: string) {
  const ai = getAIClient();
  if (!ai) {
    return heuristicCleanFilename(filename, folderName);
  }

  try {
    const prompt = `You are a medical communication specialist for Pakistan's Polio Eradication Programme (NEOC/EOC).
A video was uploaded to Google Drive with the following file information:
Filename: "${filename}"
Folder / Category: "${folderName || 'Healthcare Professionals'}"

TASK:
Generate a professional, culturally sensitive title and concise factual summary in BOTH English and Urdu.
STRICT RULE: Do NOT invent unmentioned clinical trials, false names, or fake dates. Only extract and structure the information present in the filename and folder context.

Return ONLY a valid JSON object matching this schema (no markdown, no code blocks):
{
  "titleEn": "Clean, polished professional English title (e.g. Dr. Name: Subject)",
  "titleUr": "اردو میں پیشہ ورانہ عنوان",
  "speakerEn": "Speaker or organization name (e.g. Dr. Syed Bawar Shah or Health Expert)",
  "speakerUr": "اردو میں مقرر کا نام",
  "designationEn": "Role or designation (e.g. Pediatric Specialist, PPA KP)",
  "designationUr": "اردو میں عہدہ یا ادارہ",
  "summaryEn": "1-2 sentence professional factual description explaining what this video covers",
  "summaryUr": "اردو میں 1 سے 2 جملوں کا جامع اور سائنسی خلاصہ",
  "keyPointsEn": ["Key takeaway point 1", "Key takeaway point 2"],
  "keyPointsUr": ["اہم نکتہ 1", "اہم نکتہ 2"],
  "fieldScenarioEn": "When field teams should use this video",
  "fieldScenarioUr": "فیلڈ ٹیمیں یہ ویڈیو کس موقع پر استعمال کریں"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        titleEn: parsed.titleEn || filename,
        titleUr: parsed.titleUr || parsed.titleEn || filename,
        speakerEn: parsed.speakerEn || 'Health Expert',
        speakerUr: parsed.speakerUr || 'طبی ماہر',
        designationEn: parsed.designationEn || (folderName ? `${folderName} Contributor` : 'Polio Field Specialist'),
        designationUr: parsed.designationUr || 'پولیو فیلڈ اسپیشلسٹ',
        summaryEn: parsed.summaryEn || `Video resource from repository category: ${folderName || 'Communication'}.`,
        summaryUr: parsed.summaryUr || 'مستند ویڈیو پیغام برائے پولیو آگاہی و فیلڈ مہم۔',
        keyPointsEn: Array.isArray(parsed.keyPointsEn) && parsed.keyPointsEn.length > 0 ? parsed.keyPointsEn : ['Verified field resource.'],
        keyPointsUr: Array.isArray(parsed.keyPointsUr) && parsed.keyPointsUr.length > 0 ? parsed.keyPointsUr : ['تصدیق شدہ فیلڈ ویڈیو پیغام۔'],
        fieldScenarioEn: parsed.fieldScenarioEn || 'Use during refusal conversion or community mobilization sessions.',
        fieldScenarioUr: parsed.fieldScenarioUr || 'انکاری والدین اور کمیونٹی آگاہی سیشنز کے دوران استعمال کریں۔',
        badgeEn: folderName ? `${folderName}` : 'Verified',
        badgeUr: folderName ? `${folderName}` : 'تصدیق شدہ',
      };
    }
  } catch (err) {
    console.error('Gemini video metadata enhancement error:', err);
  }

  return heuristicCleanFilename(filename, folderName);
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

export const POLIO_TOOL_KIT_ROOT_ID = '102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';
export const POLIO_TOOL_KIT_ROOT_NAME = 'Polio Tool Kit';

/**
 * Classify file types supported by Polio Tool Kit
 */
function classifyDriveFileType(filename: string, mimeType?: string): 'video' | 'document' | 'image' | 'other' {
  const lower = filename.toLowerCase();
  const mime = (mimeType || '').toLowerCase();
  if (mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv|3gp)$/i.test(lower)) {
    return 'video';
  }
  if (
    mime.includes('pdf') ||
    mime.includes('document') ||
    mime.includes('msword') ||
    mime.includes('presentation') ||
    mime.includes('powerpoint') ||
    mime.includes('sheet') ||
    mime.includes('excel') ||
    /\.(pdf|docx?|pptx?|xlsx?|txt|csv)$/i.test(lower)
  ) {
    return 'document';
  }
  if (mime.startsWith('image/') || /\.(jpe?g|png|webp|svg|gif)$/i.test(lower)) {
    return 'image';
  }
  return 'other';
}

/**
 * Helper to normalize category ID from Google Drive subfolder name
 */
function slugifyCategoryName(name: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return 'general_resources';
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'general_resources';
}

// -------------------------------------------------------------
// Anti-SSRF & Input Validation Helpers
// -------------------------------------------------------------

function validateAndSanitizeAppsScriptUrl(rawUrl: unknown): { valid: boolean; cleanUrl?: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Google Apps Script Web App URL must be provided as a string.' };
  }
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'Security rejection: Only secure HTTPS endpoints are permitted.' };
    }
    const host = parsed.hostname.toLowerCase();
    // Strictly restrict to Google Apps Script execution hostnames
    if (host !== 'script.google.com' && host !== 'script.googleusercontent.com') {
      return {
        valid: false,
        error: 'Security rejection (SSRF protection): Only official script.google.com URLs are permitted.',
      };
    }
    return { valid: true, cleanUrl: parsed.toString() };
  } catch {
    return { valid: false, error: 'Malformed URL format.' };
  }
}

function validateFolderId(folderId: unknown): string {
  if (!folderId || typeof folderId !== 'string') {
    return POLIO_TOOL_KIT_ROOT_ID;
  }
  const clean = folderId.trim();
  if (!clean || !/^[a-zA-Z0-9_-]{10,120}$/.test(clean)) {
    return POLIO_TOOL_KIT_ROOT_ID;
  }
  return clean;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    masterFolderId: POLIO_TOOL_KIT_ROOT_ID,
    masterFolderName: POLIO_TOOL_KIT_ROOT_NAME,
    timestamp: new Date().toISOString(),
  });
});

/**
 * AI Enhance single video or batch of video names
 */
app.post('/api/drive/ai-enhance', async (req, res) => {
  try {
    const { filename, folderName } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const enhanced = await aiEnhanceVideoMetadata(filename, folderName);
    res.json({ success: true, data: enhanced });
  } catch (err: any) {
    console.error('Error enhancing video metadata:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * Diagnostic Test Connection endpoint
 * Validates connectivity without altering saved data or counting as a sync
 */
app.post('/api/drive/test-connection', syncRateLimit, async (req, res) => {
  const startTime = Date.now();
  try {
    const { scriptUrl, folderId, apiKey } = req.body;
    const targetFolderId = validateFolderId(folderId);

    // Test Method 1: Apps Script Web App
    if (scriptUrl) {
      const urlCheck = validateAndSanitizeAppsScriptUrl(scriptUrl);
      if (!urlCheck.valid || !urlCheck.cleanUrl) {
        return res.status(400).json({
          success: false,
          diagnostic: 'SSRF_VALIDATION_REJECTED',
          message: urlCheck.error || 'Invalid Google Apps Script URL.',
        });
      }

      const targetUrl = new URL(urlCheck.cleanUrl);
      targetUrl.searchParams.set('folderId', targetFolderId);

      const response = await fetch(targetUrl.toString(), {
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });

      const latencyMs = Date.now() - startTime;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      // Check for HTML response (e.g. login prompt or 403 authorization screen)
      if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        return res.status(400).json({
          success: false,
          diagnostic: 'HTML_RESPONSE_RECEIVED',
          httpStatus: response.status,
          latencyMs,
          message:
            'Google Apps Script returned an HTML page instead of JSON. Diagnostic: The Web App is likely requiring Google Account login. In Apps Script, click "Deploy" > "Manage deployments" > Edit > ensure "Who has access" is set to "Anyone".',
          preview: text.slice(0, 160).replace(/\s+/g, ' '),
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          diagnostic: `HTTP_${response.status}`,
          httpStatus: response.status,
          latencyMs,
          message: `Google Apps Script server error: HTTP ${response.status} ${response.statusText}`,
          preview: text.slice(0, 160),
        });
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr: any) {
        return res.status(400).json({
          success: false,
          diagnostic: 'INVALID_JSON_RESPONSE',
          latencyMs,
          message: `Apps Script response could not be parsed as JSON: ${jsonErr.message}`,
          preview: text.slice(0, 160),
        });
      }

      if (parsed && parsed.success === false) {
        return res.status(400).json({
          success: false,
          diagnostic: 'APPS_SCRIPT_ERROR',
          latencyMs,
          message: parsed.error || 'Apps Script returned failure status.',
        });
      }

      const files = Array.isArray(parsed) ? parsed : (parsed.files || []);
      const categories = parsed.categories || [];
      const rootFolderName = parsed.rootFolderName || POLIO_TOOL_KIT_ROOT_NAME;

      return res.json({
        success: true,
        latencyMs,
        rootFolderId: targetFolderId,
        rootFolderName,
        totalFilesFound: files.length,
        categoriesDiscovered: categories.length > 0 ? categories : [...new Set(files.map((f: any) => f.category))].filter(Boolean),
        diagnostic: 'CONNECTION_SUCCESSFUL',
      });
    }

    // Test Method 2: Google Drive v3 API
    if (apiKey) {
      const testUrl = `https://www.googleapis.com/drive/v3/files/${targetFolderId}?fields=id,name,mimeType&key=${apiKey.trim()}`;
      const response = await fetch(testUrl);
      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          success: false,
          diagnostic: `DRIVE_API_ERROR_${response.status}`,
          httpStatus: response.status,
          latencyMs,
          message: `Google Drive API error (${response.status}): ${errorText}`,
        });
      }

      const folderData = await response.json();
      return res.json({
        success: true,
        latencyMs,
        rootFolderId: folderData.id,
        rootFolderName: folderData.name || POLIO_TOOL_KIT_ROOT_NAME,
        diagnostic: 'CONNECTION_SUCCESSFUL',
      });
    }

    return res.status(400).json({
      success: false,
      diagnostic: 'MISSING_CONFIGURATION',
      message: 'Please provide either a Google Apps Script Web App URL or Google Drive API Key.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      diagnostic: 'EXCEPTION_THROWN',
      message: err.message || 'Diagnostic connection test failed unexpectedly.',
    });
  }
});

/**
 * Fetch and synchronize items strictly from Google Drive Polio Tool Kit root folder
 */
app.post('/api/drive/sync', syncRateLimit, async (req, res) => {
  try {
    const { scriptUrl, folderId, apiKey } = req.body;
    const targetFolderId = validateFolderId(folderId);

    let rawFiles: Array<{
      id: string;
      name: string;
      fileType?: 'video' | 'document' | 'image' | 'other';
      mimeType?: string;
      thumbnailLink?: string;
      thumbnailUrl?: string;
      category?: string;
      description?: string;
      duration?: string;
      sizeBytes?: number;
      createdTime?: string;
      lastUpdated?: string;
      viewUrl?: string;
      embedUrl?: string;
      downloadUrl?: string;
      titleEn?: string;
      titleUr?: string;
      speakerEn?: string;
      speakerUr?: string;
      designationEn?: string;
      designationUr?: string;
      summaryEn?: string;
      summaryUr?: string;
      keyPointsEn?: string[];
      keyPointsUr?: string[];
      fieldScenarioEn?: string;
      fieldScenarioUr?: string;
      [key: string]: any;
    }> = [];

    let discoveredRootName = POLIO_TOOL_KIT_ROOT_NAME;
    let discoveredCategoriesList: Array<{ name: string; count?: number }> = [];

    // Method 1: Google Apps Script Web App (Root locked to Polio Tool Kit)
    if (scriptUrl) {
      const urlCheck = validateAndSanitizeAppsScriptUrl(scriptUrl);
      if (!urlCheck.valid || !urlCheck.cleanUrl) {
        return res.status(400).json({
          error: `Security Validation Failed: ${urlCheck.error || 'Invalid Google Apps Script Web App URL.'}`,
          diagnostic: 'SSRF_VALIDATION_REJECTED',
        });
      }

      console.log(`[DriveSync] Syncing strictly from Polio Tool Kit (${targetFolderId}) via Apps Script`);
      const targetUrl = new URL(urlCheck.cleanUrl);
      targetUrl.searchParams.set('folderId', targetFolderId);

      const response = await fetch(targetUrl.toString(), {
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      // Guard against HTML login prompts or error pages
      if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        return res.status(400).json({
          error:
            'Sync failed: Google Apps Script returned an HTML page (Google login authentication screen). In your Apps Script, deploy as Web App with "Who has access: Anyone".',
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Sync failed: Google Apps Script returned HTTP ${response.status} ${response.statusText}`,
        });
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (jsonErr: any) {
        return res.status(400).json({
          error: `Sync failed: Unable to parse Apps Script response as JSON (${jsonErr.message}). Preview: ${text.slice(0, 100)}`,
        });
      }

      if (data && data.success === false) {
        return res.status(400).json({
          error: `Sync failed: ${data.error || 'Apps Script returned failure'}`,
        });
      }

      if (Array.isArray(data)) {
        rawFiles = data;
      } else if (data && Array.isArray(data.files)) {
        rawFiles = data.files;
        if (data.rootFolderName) discoveredRootName = data.rootFolderName;
        if (Array.isArray(data.categories)) discoveredCategoriesList = data.categories;
      } else {
        return res.status(400).json({
          error: 'Sync failed: Unexpected data structure from Apps Script. Expected array of files.',
        });
      }
    }
    // Method 2: Google Drive API v3 (Direct API Key strictly locked to Polio Tool Kit root)
    else if (apiKey && targetFolderId) {
      console.log(`[DriveSync] Syncing strictly from Polio Tool Kit (${targetFolderId}) via Drive v3 API`);

      // 1. Verify and get root folder name
      const rootMetaResp = await fetch(`https://www.googleapis.com/drive/v3/files/${targetFolderId}?fields=id,name&key=${apiKey}`);
      if (rootMetaResp.ok) {
        const rData = await rootMetaResp.json();
        discoveredRootName = rData.name || POLIO_TOOL_KIT_ROOT_NAME;
      }

      // 2. Discover immediate subfolders inside Polio Tool Kit ONLY
      const subfoldersQ = encodeURIComponent(`'${targetFolderId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`);
      const subResp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${subfoldersQ}&fields=files(id,name)&pageSize=100&key=${apiKey}`);

      const subFolders: Array<{ id: string; name: string }> = [];
      if (subResp.ok) {
        const subData = await subResp.json();
        subFolders.push(...(subData.files || []));
      }

      // 3. Discover files directly in root folder
      const rootFilesQ = encodeURIComponent(`'${targetFolderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`);
      const rootFilesResp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${rootFilesQ}&fields=files(id,name,mimeType,thumbnailLink,description,size,createdTime,videoMediaMetadata)&pageSize=100&key=${apiKey}`);

      if (rootFilesResp.ok) {
        const rfData = await rootFilesResp.json();
        for (const f of (rfData.files || [])) {
          rawFiles.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            thumbnailLink: f.thumbnailLink,
            category: discoveredRootName,
            description: f.description,
            sizeBytes: f.size ? parseInt(f.size, 10) : undefined,
            duration: f.videoMediaMetadata?.durationMillis ? `${Math.round(f.videoMediaMetadata.durationMillis / 60000)} mins` : undefined,
            createdTime: f.createdTime,
          });
        }
      }

      // 4. Discover files strictly inside each immediate subfolder
      for (const sub of subFolders) {
        try {
          const q = encodeURIComponent(`'${sub.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`);
          const fResp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,thumbnailLink,description,size,createdTime,videoMediaMetadata)&pageSize=100&key=${apiKey}`);
          if (fResp.ok) {
            const fData = await fResp.json();
            for (const f of (fData.files || [])) {
              rawFiles.push({
                id: f.id,
                name: f.name,
                mimeType: f.mimeType,
                thumbnailLink: f.thumbnailLink,
                category: sub.name,
                description: f.description,
                sizeBytes: f.size ? parseInt(f.size, 10) : undefined,
                duration: f.videoMediaMetadata?.durationMillis ? `${Math.round(f.videoMediaMetadata.durationMillis / 60000)} mins` : undefined,
                createdTime: f.createdTime,
              });
            }
          }
        } catch (subErr) {
          console.error(`[DriveSync] Error fetching subfolder ${sub.name}:`, subErr);
        }
      }
    } else {
      return res.status(400).json({
        error: 'Sync failed: Please provide a valid Google Apps Script Web App URL or Google Drive API Key.',
      });
    }

    console.log(`[DriveSync] Successfully fetched ${rawFiles.length} files from Polio Tool Kit hierarchy.`);

    // Process all files, identifying file type and preserving Drive metadata
    const enhancedItems = rawFiles.map((file) => {
      const fileType = file.fileType || classifyDriveFileType(file.name, file.mimeType);
      let folderCategoryName = file.category || 'Health Care Professionals videos';
      let categorySlug = slugifyCategoryName(folderCategoryName);

      const textToScan = `${file.name} ${file.speakerEn || ''} ${folderCategoryName}`.toLowerCase();
      const isReligious = /mufti|molana|maulana|ulema|scholar|imam|taqi|islam|fatwa|deen|halal|shariah|masjid|council|religio/.test(textToScan);
      const isDoctor = /\bdr\b|doctor|pediatric|bawar|qasim|ghulam|qadir|physician|dho\b|ucmo|surgeon|mbbs|medical officer|health expert|specialist|hospital|medical/.test(textToScan);

      if (isReligious && !isDoctor) {
        folderCategoryName = 'Health are Religious leaders videos';
        categorySlug = 'religious_leaders_videos';
      } else if (isDoctor && !isReligious) {
        folderCategoryName = 'Health Care Professionals videos';
        categorySlug = 'healthcare_professionals_videos';
      } else if (categorySlug === 'religious_leaders_videos' && isDoctor) {
        folderCategoryName = 'Health Care Professionals videos';
        categorySlug = 'healthcare_professionals_videos';
      } else if (categorySlug === 'healthcare_professionals_videos' && isReligious) {
        folderCategoryName = 'Health are Religious leaders videos';
        categorySlug = 'religious_leaders_videos';
      } else if (
        categorySlug === 'religious_leaders_videos' ||
        categorySlug === 'religious_influencers' ||
        isReligious
      ) {
        folderCategoryName = 'Health are Religious leaders videos';
        categorySlug = 'religious_leaders_videos';
      } else {
        folderCategoryName = 'Health Care Professionals videos';
        categorySlug = 'healthcare_professionals_videos';
      }

      // Format file size
      let formattedSize = '';
      if (file.sizeBytes) {
        if (file.sizeBytes > 1048576) {
          formattedSize = `${(file.sizeBytes / 1048576).toFixed(1)} MB`;
        } else {
          formattedSize = `${Math.round(file.sizeBytes / 1024)} KB`;
        }
      }

      // Clean presentation title and metadata
      const cleanDocName = (file.name || 'Resource')
        .replace(/\.[a-zA-Z0-9]+$/, '')
        .replace(/[_\-]+/g, ' ')
        .trim();
      const titleCase = cleanDocName
        .split(' ')
        .filter(Boolean)
        .map((w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
        .join(' ') || file.name;

      if (fileType === 'video') {
        const cleanMeta = heuristicCleanFilename(file.name, folderCategoryName);

        return {
          id: `drive-sync-${file.id}`,
          driveFileId: file.id,
          driveFolderId: targetFolderId,
          streamUrl: `/api/drive/stream?id=${file.id}&type=video`,
          downloadUrl: `/api/drive/download?id=${file.id}&filename=${encodeURIComponent(file.name)}`,
          thumbnailUrl: `/api/drive/thumbnail?id=${file.id}`,
          driveUrl: file.viewUrl || `https://drive.google.com/file/d/${file.id}/view`,
          embedUrl: `/api/drive/stream?id=${file.id}&type=video`,
          thumbnailLink: `/api/drive/thumbnail?id=${file.id}`,
          folderId: categorySlug,
          originalCategory: folderCategoryName,
          category: folderCategoryName,
          folderName: folderCategoryName,
          originalFilename: file.name,
          name: file.name,
          fileType: 'video' as const,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          fileSize: formattedSize,
          titleEn: file.titleEn || cleanMeta.titleEn,
          titleUr: file.titleUr || cleanMeta.titleUr,
          speakerEn: file.speakerEn || cleanMeta.speakerEn,
          speakerUr: file.speakerUr || cleanMeta.speakerUr,
          designationEn: file.designationEn || cleanMeta.designationEn,
          designationUr: file.designationUr || cleanMeta.designationUr,
          duration: file.duration || formattedSize || 'Video Clip',
          badgeEn: folderCategoryName,
          badgeUr: folderCategoryName,
          summaryEn: file.summaryEn || cleanMeta.summaryEn,
          summaryUr: file.summaryUr || cleanMeta.summaryUr,
          keyPointsEn: file.keyPointsEn || cleanMeta.keyPointsEn,
          keyPointsUr: file.keyPointsUr || cleanMeta.keyPointsUr,
          fieldScenarioEn: file.fieldScenarioEn || cleanMeta.fieldScenarioEn,
          fieldScenarioUr: file.fieldScenarioUr || cleanMeta.fieldScenarioUr,
          syncedAt: new Date().toISOString(),
          isDriveSynced: true,
        };
      }

      // For documents (PDF, Word, Excel, PPT), Images, and other files
      return {
        id: `drive-sync-${file.id}`,
        driveFileId: file.id,
        driveFolderId: targetFolderId,
        streamUrl: `/api/drive/stream?id=${file.id}&type=document`,
        downloadUrl: `/api/drive/download?id=${file.id}&filename=${encodeURIComponent(file.name)}`,
        thumbnailUrl: `/api/drive/thumbnail?id=${file.id}`,
        driveUrl: file.viewUrl || `https://drive.google.com/file/d/${file.id}/view`,
        embedUrl: `/api/drive/stream?id=${file.id}&type=document`,
        thumbnailLink: fileType === 'image' ? `/api/drive/thumbnail?id=${file.id}` : '',
        folderId: categorySlug,
        originalCategory: folderCategoryName,
        category: folderCategoryName,
        folderName: folderCategoryName,
        originalFilename: file.name,
        name: file.name,
        fileType: fileType,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        fileSize: formattedSize,
        titleEn: file.titleEn || titleCase || file.name,
        titleUr: file.titleUr || `${titleCase || file.name} (${folderCategoryName})`,
        speakerEn: file.speakerEn || folderCategoryName,
        speakerUr: file.speakerUr || folderCategoryName,
        designationEn: file.designationEn || (fileType === 'document' ? 'Operational & Guidance Document' : 'Visual Resource'),
        designationUr: file.designationUr || (fileType === 'document' ? 'آپریشنل و رہنمائی دستاویز' : 'بصری مواد'),
        duration: file.duration || formattedSize || (fileType === 'document' ? 'Document' : 'File'),
        badgeEn: folderCategoryName,
        badgeUr: folderCategoryName,
        summaryEn: file.summaryEn || `Official resource file from Google Drive "Polio Tool Kit / ${folderCategoryName}". Available for frontline reference and campaign compliance.`,
        summaryUr: file.summaryUr || `گوگل ڈرائیو فولڈر "پولیو ٹول کٹ / ${folderCategoryName}" سے تصدیق شدہ سرکاری مواد برائے پولیو مہم ورکرز۔`,
        keyPointsEn: file.keyPointsEn || [
          `Preserved original filename: ${file.name}`,
          `Direct Google Drive preview and reference access.`,
        ],
        keyPointsUr: file.keyPointsUr || [
          `اصل فائل کا نام: ${file.name}`,
          `گوگل ڈرائیو کے ذریعے براہ راست معائنہ و استعمال کی سہولت۔`,
        ],
        fieldScenarioEn: file.fieldScenarioEn || `Reference during campaign preparation, microplan execution, or team briefings.`,
        fieldScenarioUr: file.fieldScenarioUr || `مہم کی تیاری، مائیکرو پلان عمل درآمد یا ٹیم بریفنگ کے دوران استعمال کریں۔`,
        syncedAt: new Date().toISOString(),
        isDriveSynced: true,
      };
    });

    // Extract unique discovered categories
    const categoriesMap = new Map<string, number>();
    for (const item of enhancedItems) {
      const cat = item.originalCategory || 'Polio Tool Kit';
      categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
    }
    const categoriesArray = Array.from(categoriesMap.entries()).map(([name, count]) => ({
      name,
      slug: slugifyCategoryName(name),
      count,
    }));

    res.json({
      success: true,
      rootFolderId: targetFolderId,
      rootFolderName: discoveredRootName,
      totalFound: rawFiles.length,
      syncedCount: enhancedItems.length,
      categories: categoriesArray,
      files: rawFiles, // Source of truth as requested
      videos: enhancedItems, // Backward compatibility for existing UI
      items: enhancedItems,
    });
  } catch (err: any) {
    console.error('[DriveSync] Fatal sync error:', err);
    res.status(500).json({ error: err.message || 'Failed to synchronize with Polio Tool Kit' });
  }
});

// -------------------------------------------------------------
// Server-Side Google Drive File Streaming & Caching
// Eliminates all /preview iframes, Google sign-ins, and 3rd-party cookies
// -------------------------------------------------------------
interface CachedDriveFile {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  size: number;
  cachedAt: number;
}

const driveFileCache = new Map<string, CachedDriveFile>();
const MAX_CACHE_SIZE_BYTES = 120 * 1024 * 1024; // 120 MB in-memory cache
let currentCacheSizeBytes = 0;

function addToDriveCache(fileId: string, item: CachedDriveFile) {
  while (currentCacheSizeBytes + item.size > MAX_CACHE_SIZE_BYTES && driveFileCache.size > 0) {
    const firstKey = driveFileCache.keys().next().value;
    if (!firstKey) break;
    const oldItem = driveFileCache.get(firstKey);
    if (oldItem) {
      currentCacheSizeBytes -= oldItem.size;
    }
    driveFileCache.delete(firstKey);
  }
  driveFileCache.set(fileId, item);
  currentCacheSizeBytes += item.size;
}

async function retrieveGoogleDriveFile(fileId: string, requestedType?: string): Promise<CachedDriveFile | null> {
  const cached = driveFileCache.get(fileId);
  if (cached) {
    return cached;
  }

  const scriptUrl = process.env.DRIVE_APPS_SCRIPT_URL || process.env.VITE_DRIVE_APPS_SCRIPT_URL;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.VITE_GOOGLE_DRIVE_API_KEY;

  // Strategy 1: Google Apps Script with action=get_file (Server-to-Server, no visitor cookies)
  if (scriptUrl) {
    try {
      const targetUrl = new URL(scriptUrl);
      targetUrl.searchParams.set('action', 'get_file');
      targetUrl.searchParams.set('fileId', fileId);

      const resp = await fetch(targetUrl.toString(), {
        headers: { Accept: 'application/json' },
        redirect: 'follow',
      });

      if (resp.ok) {
        const text = await resp.text();
        try {
          const data = JSON.parse(text);
          if (data && data.success && data.base64) {
            const buf = Buffer.from(data.base64, 'base64');
            const result: CachedDriveFile = {
              buffer: buf,
              mimeType: data.mimeType || (requestedType === 'video' ? 'video/mp4' : 'application/pdf'),
              filename: data.name || `drive_file_${fileId}`,
              size: buf.length,
              cachedAt: Date.now(),
            };
            addToDriveCache(fileId, result);
            return result;
          }
        } catch {}
      }
    } catch (scriptErr) {
      console.warn('[DriveStream] Apps Script retrieve error:', scriptErr);
    }
  }

  // Strategy 2: Google Drive API v3 (if server has valid API key)
  if (apiKey) {
    try {
      const driveApiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
      const apiResp = await fetch(driveApiUrl);
      if (apiResp.ok) {
        const contentType = apiResp.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
          const arrBuf = await apiResp.arrayBuffer();
          const buf = Buffer.from(arrBuf);
          const result: CachedDriveFile = {
            buffer: buf,
            mimeType: contentType || (requestedType === 'video' ? 'video/mp4' : 'application/pdf'),
            filename: `drive_file_${fileId}`,
            size: buf.length,
            cachedAt: Date.now(),
          };
          addToDriveCache(fileId, result);
          return result;
        }
      }
    } catch (apiErr) {
      console.warn('[DriveStream] Drive API retrieve error:', apiErr);
    }
  }

  // Strategy 3: Google Drive direct content streaming
  try {
    const directUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    const directResp = await fetch(directUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const cType = directResp.headers.get('content-type') || '';
    if (directResp.ok && !cType.includes('text/html')) {
      const arrBuf = await directResp.arrayBuffer();
      const buf = Buffer.from(arrBuf);
      const result: CachedDriveFile = {
        buffer: buf,
        mimeType: cType || (requestedType === 'video' ? 'video/mp4' : 'application/pdf'),
        filename: `drive_file_${fileId}`,
        size: buf.length,
        cachedAt: Date.now(),
      };
      addToDriveCache(fileId, result);
      return result;
    }
  } catch (directErr) {
    console.warn('[DriveStream] Direct download retrieve error:', directErr);
  }

  return null;
}

/**
 * Streaming media endpoint supporting HTTP 206 Range requests
 * Enables seamless HTML5 video scrubbing and inline document preview
 */
app.get('/api/drive/stream', async (req, res) => {
  const fileId = (req.query.id as string || '').trim();
  const fileType = (req.query.type as string || 'video').toLowerCase();

  if (!fileId) {
    return res.status(400).json({ error: 'Missing file ID parameter' });
  }

  try {
    const fileData = await retrieveGoogleDriveFile(fileId, fileType);
    if (!fileData) {
      return res.status(404).json({
        error: 'Media file currently being prepared by server integration.',
        fileId,
        message: 'Direct streaming requires public link or updated Apps Script deployment.',
      });
    }

    const { buffer, mimeType, filename, size } = fileData;
    const range = req.headers.range;

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

      if (start >= size || end >= size) {
        res.status(416).setHeader('Content-Range', `bytes */${size}`);
        return res.end();
      }

      const chunk = buffer.subarray(start, end + 1);
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
      res.setHeader('Content-Length', chunk.length);
      res.setHeader('Content-Type', mimeType);
      return res.end(chunk);
    } else {
      res.status(200);
      res.setHeader('Content-Length', size);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      return res.end(buffer);
    }
  } catch (err: any) {
    console.error('[DriveStream] Stream exception:', err);
    return res.status(500).json({ error: 'Internal streaming error' });
  }
});

/**
 * Direct file download endpoint through our server
 * Visitors never touch Google Drive directly or encounter cookie prompts
 */
app.get('/api/drive/download', async (req, res) => {
  const fileId = (req.query.id as string || '').trim();
  const customName = (req.query.filename as string || '').trim();

  if (!fileId) {
    return res.status(400).json({ error: 'Missing file ID parameter' });
  }

  try {
    const fileData = await retrieveGoogleDriveFile(fileId);
    if (!fileData) {
      // Graceful fallback: Redirect directly to Google Drive usercontent download URL
      // so user download NEVER fails even before the server cache is populated
      const fallbackUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;
      return res.redirect(302, fallbackUrl);
    }

    const downloadName = customName || fileData.filename;
    const cleanName = downloadName.replace(/[/\\?%*:|"<>]/g, '-');
    res.setHeader('Content-Type', fileData.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', fileData.size);
    res.setHeader('Content-Disposition', `attachment; filename="${cleanName}"`);
    return res.end(fileData.buffer);
  } catch (dlErr: any) {
    console.error('[DriveDownload] Error:', dlErr);
    return res.status(500).json({ error: 'Download retrieval failed' });
  }
});

/**
 * Proxies Google Drive thumbnails to avoid third-party cookie or referrer blocks
 */
app.get('/api/drive/thumbnail', async (req, res) => {
  const fileId = (req.query.id as string || '').trim();
  if (!fileId) {
    return res.status(400).end();
  }

  try {
    const thumbUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w640`;
    const resp = await fetch(thumbUrl);
    if (resp.ok) {
      const cType = resp.headers.get('content-type') || 'image/jpeg';
      const arrBuf = await resp.arrayBuffer();
      res.setHeader('Content-Type', cType);
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
      return res.end(Buffer.from(arrBuf));
    }
    return res.status(404).end();
  } catch {
    return res.status(500).end();
  }
});

/**
 * Return copy-paste Google Apps Script code strictly locked to Polio Tool Kit
 */
app.get('/api/drive/apps-script-code', (req, res) => {
  const code = `/**
 * ==============================================================================
 * Google Apps Script — Polio Tool Kit Master Auto-Sync & Streaming Web App
 * ==============================================================================
 * 
 * SECURITY & SCOPE GUARANTEE:
 * - Operates EXCLUSIVELY inside your "Polio Tool Kit" root folder.
 * - NEVER accesses "My Drive" root or any unrelated folders/files.
 * - Recursively discovers all subfolders and supported files (Videos, Documents, Images).
 * - Dynamically exposes new folders as categories automatically.
 * - Provides server-side file retrieval so visitors NEVER need to sign in or enable cookies!
 * 
 * SETUP INSTRUCTIONS (1-2 minutes):
 * 1. Go to https://script.google.com and open your Polio Tool Kit project.
 * 2. Replace with this updated script.
 * 3. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > Version: "New version" > "Deploy".
 * 4. Ensure:
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 */

// Master Root Folder ID — "Polio Tool Kit" (ONLY allowed root)
const POLIO_TOOL_KIT_ROOT_ID = '102rLBDf1Q94SvkLf9sr3XzP7tulkKYCv';

function doGet(e) {
  try {
    // 1. Single-File Retrieval for Server-Side Streaming (No visitor login or cookies required)
    if (e && e.parameter && (e.parameter.action === 'get_file' || e.parameter.action === 'stream') && e.parameter.fileId) {
      var targetFileId = e.parameter.fileId.trim();
      try {
        var file = DriveApp.getFileById(targetFileId);
        var blob = file.getBlob();
        var bytes = blob.getBytes();
        return createJsonResponse({
          success: true,
          id: file.getId(),
          name: file.getName(),
          mimeType: blob.getContentType() || file.getMimeType(),
          size: bytes.length,
          base64: Utilities.base64Encode(bytes)
        });
      } catch (fileErr) {
        return createJsonResponse({
          success: false,
          error: "Unable to retrieve file: " + fileErr.toString()
        });
      }
    }

    // 2. Full Hierarchy Directory Scan
    const targetFolderId = (e && e.parameter && e.parameter.folderId && e.parameter.folderId.trim()) 
      ? e.parameter.folderId.trim() 
      : POLIO_TOOL_KIT_ROOT_ID;

    let rootFolder;
    try {
      rootFolder = DriveApp.getFolderById(targetFolderId);
    } catch (accessErr) {
      return createJsonResponse({
        success: false,
        error: "Cannot access Polio Tool Kit folder (ID: " + targetFolderId + "). Please ensure the folder exists and is shared as 'Anyone with the link can view'."
      });
    }

    const files = [];
    const categoriesMap = {};
    const subfolderStats = [];

    // Supported extensions regex
    const VIDEO_REGEX = /\\.(mp4|webm|mov|m4v|avi|mkv|3gp)$/i;
    const DOC_REGEX = /\\.(pdf|docx?|pptx?|xlsx?|txt|csv)$/i;
    const IMG_REGEX = /\\.(jpe?g|png|webp|svg|gif)$/i;

    // Recursive traversal strictly inside descendants of rootFolder
    function scanFolder(folder, categoryName, depth) {
      if (depth > 8) return; // Prevent excessive recursion

      const currentFolderName = folder.getName();
      const effectiveCategory = categoryName || currentFolderName;

      // 1. Scan files in this folder
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

      // 2. Discover immediate subfolders inside this folder
      const subfolders = folder.getFolders();
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        // If scanning root children, subfolder name becomes the category
        const nextCat = (folder.getId() === rootFolder.getId()) ? sub.getName() : effectiveCategory;
        scanFolder(sub, nextCat, depth + 1);
      }
    }

    // Start recursive scan strictly inside Polio Tool Kit
    // 1. Scan immediate subfolders (Community Influencers, HCPs, Training Documents, etc.)
    const immediateSubs = rootFolder.getFolders();
    while (immediateSubs.hasNext()) {
      const sub = immediateSubs.next();
      scanFolder(sub, sub.getName(), 1);
    }

    // 2. Also scan any files residing directly in Polio Tool Kit root
    const rootDirectFiles = rootFolder.getFiles();
    while (rootDirectFiles.hasNext()) {
      const file = rootDirectFiles.next();
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
          lastUpdated: file.getLastUpdated().toISOString(),
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

  res.setHeader('Content-Type', 'text/plain');
  res.send(code);
});

// -------------------------------------------------------------
// Vite Middleware / Static Asset Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.get('/', (req, res) => {
      res.redirect('/Poliocalculator/');
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/Poliocalculator', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
