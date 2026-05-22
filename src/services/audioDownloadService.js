// src/services/audioDownloadService.js
// ─────────────────────────────────────────────────────────────────────────────
// Manages offline Qur'an recitation audio.
//
//   Storage:   Directory.Data/audio/r{reciterId}/s{chapterId}.mp3
//   Index:     localStorage key "sirat_audio_downloads_v1" — fast lookup map
//              `{reciterId}-{chapterId}` → `{ size, ts }`
//   Filesystem is source of truth; the index is a synced cache.
//
// Playback: getLocalAudioUrl reads the MP3 into a blob URL with an explicit
//   `audio/mpeg` MIME type. This is more reliable on iOS WKWebView than
//   Capacitor.convertFileSrc which can produce URLs the audio element
//   silently refuses to play due to MIME-type negotiation quirks.
//
// Public API:
//   isChapterDownloaded(reciterId, chapterId)
//   getLocalAudioUrl(reciterId, chapterId)    -> playable blob: URL or null
//   downloadChapter(reciterId, chapterId)     -> Promise<{size}>
//   deleteChapter(reciterId, chapterId)
//   deleteAllForReciter(reciterId)
//   deleteAll()
//   getIndex()                                -> object
//   getReciterTotals()                        -> [{reciterId, count, bytes}]
//   getTotalBytes()
//   subscribeIndex(fn)                        -> () => void
//
//   Bulk download (module-level singleton):
//   startBulkDownload(reciterId)
//   cancelBulkDownload()
//   getBulkState()  -> { active, reciterId, completed, total, error }
//   subscribeBulk(fn) -> () => void
// ─────────────────────────────────────────────────────────────────────────────

import { Filesystem, Directory } from "@capacitor/filesystem";
import { getChapterAudio } from "./quranService";

const ROOT_DIR = "audio";
const INDEX_KEY = "sirat_audio_downloads_v1";
const TOTAL_CHAPTERS = 114;

// ─── Path helpers ───────────────────────────────────────────────────────────
function relPath(reciterId, chapterId) {
  return `${ROOT_DIR}/r${reciterId}/s${chapterId}.mp3`;
}
function indexKey(reciterId, chapterId) {
  return `${reciterId}-${chapterId}`;
}
function parseIndexKey(k) {
  const [r, c] = k.split("-").map(Number);
  return { reciterId: r, chapterId: c };
}

// ─── Blob URL cache (one per downloaded chapter; revoked on delete) ─────────
const blobUrlCache = new Map();

function revokeCachedBlobUrl(key) {
  const url = blobUrlCache.get(key);
  if (url) {
    try { URL.revokeObjectURL(url); } catch {}
    blobUrlCache.delete(key);
  }
}

// ─── Index (localStorage cache) ─────────────────────────────────────────────
const subscribers = new Set();

function readIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeIndex(idx) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
  } catch {}
  subscribers.forEach(fn => { try { fn(idx); } catch {} });
}

export function getIndex() {
  return readIndex();
}

export function subscribeIndex(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

// ─── Status checks ──────────────────────────────────────────────────────────
export function isChapterDownloaded(reciterId, chapterId) {
  const idx = readIndex();
  return Boolean(idx[indexKey(reciterId, chapterId)]);
}

// Returns a playable blob: URL (with audio/mpeg MIME type) or null.
// Caches the blob URL per chapter so repeat reads don't re-allocate memory.
export async function getLocalAudioUrl(reciterId, chapterId) {
  const key = indexKey(reciterId, chapterId);
  if (!isChapterDownloaded(reciterId, chapterId)) return null;

  // Cache hit
  if (blobUrlCache.has(key)) return blobUrlCache.get(key);

  try {
    const file = await Filesystem.readFile({
      path: relPath(reciterId, chapterId),
      directory: Directory.Data,
    });

    // On native iOS/Android, `data` is a base64 string.
    // On web, it can be a Blob already.
    let blob;
    if (typeof file.data === "string") {
      const binary = atob(file.data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      blob = new Blob([bytes], { type: "audio/mpeg" });
    } else if (file.data instanceof Blob) {
      // Web returned a Blob — re-wrap with explicit MIME type
      blob = file.data.type === "audio/mpeg"
        ? file.data
        : new Blob([file.data], { type: "audio/mpeg" });
    } else {
      // ArrayBuffer or similar
      blob = new Blob([file.data], { type: "audio/mpeg" });
    }

    const url = URL.createObjectURL(blob);
    blobUrlCache.set(key, url);
    return url;
  } catch (err) {
    console.error("[audioDownload] read failed:", err);
    // File missing on disk — clean up stale index entry
    const idx = readIndex();
    delete idx[key];
    writeIndex(idx);
    return null;
  }
}

// ─── Single chapter download ────────────────────────────────────────────────
const inFlight = new Map();   // key → Promise — dedupes concurrent calls

export async function downloadChapter(reciterId, chapterId) {
  const key = indexKey(reciterId, chapterId);
  if (inFlight.has(key)) return inFlight.get(key);

  const task = (async () => {
    if (isChapterDownloaded(reciterId, chapterId)) {
      return { size: readIndex()[key]?.size ?? 0, alreadyDownloaded: true };
    }

    const { url, error } = await getChapterAudio(reciterId, chapterId);
    if (!url) throw new Error(error || "No audio URL available for this surah.");

    try {
      await Filesystem.mkdir({
        path: `${ROOT_DIR}/r${reciterId}`,
        directory: Directory.Data,
        recursive: true,
      });
    } catch {
      // Already exists or unavailable — ignore
    }

    const result = await Filesystem.downloadFile({
      path: relPath(reciterId, chapterId),
      url,
      directory: Directory.Data,
    });

    let size = 0;
    try {
      const stat = await Filesystem.stat({
        path: relPath(reciterId, chapterId),
        directory: Directory.Data,
      });
      size = stat.size ?? 0;
    } catch {}

    const idx = readIndex();
    idx[key] = { size, ts: Date.now() };
    writeIndex(idx);

    // If a stale blob URL exists from a prior delete-and-redownload cycle,
    // revoke it so the next play reads the new file.
    revokeCachedBlobUrl(key);

    return { size, path: result.path };
  })();

  inFlight.set(key, task);
  try { return await task; }
  finally { inFlight.delete(key); }
}

// ─── Deletion ───────────────────────────────────────────────────────────────
export async function deleteChapter(reciterId, chapterId) {
  const key = indexKey(reciterId, chapterId);
  try {
    await Filesystem.deleteFile({
      path: relPath(reciterId, chapterId),
      directory: Directory.Data,
    });
  } catch {
    // File missing — fine
  }
  revokeCachedBlobUrl(key);
  const idx = readIndex();
  delete idx[key];
  writeIndex(idx);
}

export async function deleteAllForReciter(reciterId) {
  try {
    await Filesystem.rmdir({
      path: `${ROOT_DIR}/r${reciterId}`,
      directory: Directory.Data,
      recursive: true,
    });
  } catch {}
  const idx = readIndex();
  for (const key of Object.keys(idx)) {
    if (parseIndexKey(key).reciterId === reciterId) {
      revokeCachedBlobUrl(key);
      delete idx[key];
    }
  }
  writeIndex(idx);
}

export async function deleteAll() {
  try {
    await Filesystem.rmdir({
      path: ROOT_DIR,
      directory: Directory.Data,
      recursive: true,
    });
  } catch {}
  for (const key of Array.from(blobUrlCache.keys())) revokeCachedBlobUrl(key);
  writeIndex({});
}

// ─── Totals / aggregations for UI ───────────────────────────────────────────
export function getReciterTotals() {
  const idx = readIndex();
  const byReciter = new Map();
  for (const [key, val] of Object.entries(idx)) {
    const { reciterId, chapterId } = parseIndexKey(key);
    if (!byReciter.has(reciterId)) {
      byReciter.set(reciterId, { reciterId, chapters: [], bytes: 0 });
    }
    const entry = byReciter.get(reciterId);
    entry.chapters.push({ chapterId, size: val.size ?? 0, ts: val.ts ?? 0 });
    entry.bytes += val.size ?? 0;
  }
  return Array.from(byReciter.values()).map(r => ({
    ...r,
    chapters: r.chapters.sort((a, b) => a.chapterId - b.chapterId),
    count: r.chapters.length,
  }));
}

export function getTotalBytes() {
  const idx = readIndex();
  return Object.values(idx).reduce((sum, v) => sum + (v.size ?? 0), 0);
}

// ─── Bulk download (module-level singleton) ─────────────────────────────────
let bulkState = {
  active: false,
  reciterId: null,
  completed: 0,
  total: TOTAL_CHAPTERS,
  error: null,
  cancelled: false,
};
const bulkSubs = new Set();

function notifyBulk() {
  const snapshot = { ...bulkState };
  bulkSubs.forEach(fn => { try { fn(snapshot); } catch {} });
}

export function getBulkState() {
  return { ...bulkState };
}

export function subscribeBulk(fn) {
  bulkSubs.add(fn);
  return () => bulkSubs.delete(fn);
}

export function cancelBulkDownload() {
  if (!bulkState.active) return;
  bulkState.cancelled = true;
  notifyBulk();
}

export async function startBulkDownload(reciterId) {
  if (bulkState.active) {
    throw new Error("A download is already running. Cancel it first.");
  }
  bulkState = {
    active: true,
    reciterId,
    completed: 0,
    total: TOTAL_CHAPTERS,
    error: null,
    cancelled: false,
  };
  notifyBulk();

  try {
    for (let chapterId = 1; chapterId <= TOTAL_CHAPTERS; chapterId++) {
      if (bulkState.cancelled) break;

      if (isChapterDownloaded(reciterId, chapterId)) {
        bulkState.completed = chapterId;
        notifyBulk();
        continue;
      }

      try {
        await downloadChapter(reciterId, chapterId);
      } catch (err) {
        console.warn(`[audioDownload] surah ${chapterId} failed:`, err.message);
      }

      bulkState.completed = chapterId;
      notifyBulk();
    }
  } catch (err) {
    bulkState.error = err.message || "Bulk download failed.";
  } finally {
    bulkState.active = false;
    notifyBulk();
  }
}
