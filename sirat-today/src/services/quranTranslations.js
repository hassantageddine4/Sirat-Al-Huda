// src/services/quranTranslations.js
// ─────────────────────────────────────────────────────────────────────────────
// Translation fetching for Quran.com API. Pairs with the existing
// quranService.js — these functions add English translation support without
// touching the Arabic verse fetcher.
//
// Default translation: Saheeh International (id 20) — the most widely-trusted
// modern English translation, suitable for both Sunni and Shia readers.
//
// API ref: https://api-docs.quran.com  (api.quran.com/api/v4)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://api.quran.com/api/v4";
const memCache = new Map();
const STORAGE_PREFIX = "sirat_quran_tr_v1:";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;   // 30 days — translations are immutable

// Curated list — common, vetted English translations
export const TRANSLATIONS = [
  { id: 131, name: "Dr. Mustafa Khattab",  short: "Clear Quran" },
  { id:  20, name: "Saheeh International", short: "Saheeh"      },
  { id:  85, name: "Abdul Haleem",         short: "Haleem"      },
  { id:  19, name: "Pickthall",            short: "Pickthall"   },
  { id:  22, name: "Yusuf Ali",            short: "Yusuf Ali"   },
];
export const DEFAULT_TRANSLATION_ID = 131;

// ── Cache ───────────────────────────────────────────────────────────────────
function readCache(key) {
  if (memCache.has(key)) return memCache.get(key);
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) { localStorage.removeItem(STORAGE_PREFIX + key); return null; }
    memCache.set(key, value);
    return value;
  } catch { return null; }
}
function writeCache(key, value) {
  memCache.set(key, value);
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ value, ts: Date.now() })); }
  catch {}
}

// ── Fetch helper ────────────────────────────────────────────────────────────
async function fetchJson(url, { signal, retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) { lastErr = new Error(`HTTP ${res.status}`); continue; }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") throw err;
      lastErr = err;
      if (attempt < retries) await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt)));
    }
  }
  throw lastErr ?? new Error("Network error");
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch all translation verses for a chapter. Returns an array of
 * { verseKey: "1:1", text: "..." } in verse order.
 */
export async function getChapterTranslation(chapterId, {
  translationId = DEFAULT_TRANSLATION_ID,
  signal,
} = {}) {
  const key = `chapter:${chapterId}:${translationId}`;
  const cached = readCache(key);
  if (cached) return cached;

  // Quran.com API: /quran/translations/{translation_id}?chapter_number=N
  const url = `${BASE_URL}/quran/translations/${translationId}?chapter_number=${chapterId}`;
  const raw = await fetchJson(url, { signal });

  const list = (raw?.translations ?? []).map(t => ({
    verseKey:  t.verse_key,                  // e.g. "1:1"
    verseId:   t.verse_id ?? null,
    text:      stripHtml(t.text ?? ""),
    footnotes: t.footnotes ?? null,
  }));

  writeCache(key, list);
  return list;
}

/** Strip HTML tags from translation text — Quran.com sometimes embeds <sup>foonote</sup>. */
function stripHtml(html) {
  return String(html).replace(/<sup[^>]*foot_note="?(\d+)"?[^>]*>.*?<\/sup>/g, "")
                     .replace(/<[^>]+>/g, "")
                     .replace(/\s+/g, " ")
                     .trim();
}
