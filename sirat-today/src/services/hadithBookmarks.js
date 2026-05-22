// src/services/hadithBookmarks.js
// ─────────────────────────────────────────────────────────────────────────────
// Bookmark store for hadith. Persists to localStorage. Module-level pub/sub
// means a change in any component propagates to every subscriber instantly
// without a global state library.
//
// Each bookmark stores a snapshot of the hadith content, so the bookmark
// list works offline even before the network has rehydrated the cache.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sirat_hadith_bookmarks_v1";

// Composite id for dedupe: "collectionId:hadithNumber"
function makeKey(collectionId, hadithNumber) {
  return `${collectionId}:${hadithNumber}`;
}

// ── In-memory state ─────────────────────────────────────────────────────────
let cache = null;
const listeners = new Set();

function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? JSON.parse(raw) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cache)); }
  catch {}
  listeners.forEach(fn => { try { fn(); } catch {} });
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns a flat array of bookmarks, newest first.
 */
export function getBookmarks() {
  const data = load();
  return Object.values(data).sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
}

export function isBookmarked(collectionId, hadithNumber) {
  const data = load();
  return Boolean(data[makeKey(collectionId, hadithNumber)]);
}

/**
 * Save a hadith. The full hadith object is stored so the bookmarks page
 * can render even before the network re-hydrates.
 */
export function addBookmark(hadith) {
  const data = load();
  const key = makeKey(hadith.collectionId, hadith.hadithNumber);
  data[key] = { ...hadith, savedAt: Date.now() };
  cache = data;
  save();
}

export function removeBookmark(collectionId, hadithNumber) {
  const data = load();
  const key = makeKey(collectionId, hadithNumber);
  if (key in data) {
    delete data[key];
    cache = data;
    save();
  }
}

/**
 * Toggle. Pass the hadith object so we have the snapshot if we end up adding.
 */
export function toggleBookmark(hadith) {
  if (isBookmarked(hadith.collectionId, hadith.hadithNumber)) {
    removeBookmark(hadith.collectionId, hadith.hadithNumber);
    return false;
  }
  addBookmark(hadith);
  return true;
}

export function clearBookmarks() {
  cache = {};
  save();
}

/** Subscribe to bookmark changes. Returns unsubscribe fn. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
