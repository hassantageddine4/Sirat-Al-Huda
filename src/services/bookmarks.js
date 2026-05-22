// src/services/bookmarks.js
// Tracks bookmarked dua IDs in localStorage.
// Independent from recentActivity — different concern, different storage key.

const STORAGE_KEY = "sirat:duaBookmarks";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function getBookmarks() {
  return load();
}

export function isBookmarked(duaId) {
  return load().includes(duaId);
}

export function addBookmark(duaId) {
  const list = load();
  if (list.includes(duaId)) return list;
  const next = [duaId, ...list];
  save(next);
  return next;
}

export function removeBookmark(duaId) {
  const list = load().filter(id => id !== duaId);
  save(list);
  return list;
}

export function toggleBookmark(duaId) {
  return isBookmarked(duaId) ? removeBookmark(duaId) : addBookmark(duaId);
}
