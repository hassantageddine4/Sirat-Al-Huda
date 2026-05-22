// src/services/quranService.js
// ─────────────────────────────────────────────────────────────────────────────
// Quran data service — bundled-first, API fallback.
//
// All chapter metadata, Arabic Uthmani text, and 5 English translations are
// bundled into the app at public/quran/. The runtime fetches them via
// `fetch('/quran/...')` which Capacitor serves from the local filesystem —
// works in airplane mode with zero network.
//
// Audio URLs still come from api.quran.com (online) since audio MP3 download
// requires network anyway. URL lookups are cached in localStorage for 30 days.
//
// Public API preserved exactly (getChapters, getVerses, getVersesWithWords,
// getReciters, getChapterAudio, clearQuranCache, CURATED_RECITERS,
// DEFAULT_RECITER_ID, DEFAULT_RECITERS) so useQuran.js needs no changes.
// ─────────────────────────────────────────────────────────────────────────────

const BUNDLE_BASE = "/quran";
const BASE_URL    = "https://api.quran.com/api/v4";

// ── Caching ──────────────────────────────────────────────────────────────────
const TTL = {
  chapters:    1000 * 60 * 60 * 24 * 30,
  verses:      1000 * 60 * 60 * 24 * 7,
  reciters:    1000 * 60 * 60 * 24 * 7,
  recitation:  1000 * 60 * 60 * 24 * 30,
};

const memoryCache = new Map();
const bundleCache = new Map();  // loaded /quran/*.json files, kept for app lifetime

function cacheKey(name, ...parts) {
  return `sirat_quran_v2_${name}_${parts.join("_")}`;
}

function readCache(key) {
  if (memoryCache.has(key)) {
    const { value, expires } = memoryCache.get(key);
    if (Date.now() < expires) return value;
    memoryCache.delete(key);
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expires } = JSON.parse(raw);
    if (Date.now() < expires) {
      memoryCache.set(key, { value, expires });
      return value;
    }
    localStorage.removeItem(key);
  } catch {}
  return null;
}

function writeCache(key, value, ttl) {
  const expires = Date.now() + ttl;
  memoryCache.set(key, { value, expires });
  try { localStorage.setItem(key, JSON.stringify({ value, expires })); } catch {}
}

// ── Bundled JSON loader (cached for app lifetime) ───────────────────────────
async function loadBundle(path, signal) {
  if (bundleCache.has(path)) {
    // Could be a resolved value OR an in-flight Promise — both work with await
    return bundleCache.get(path);
  }

  const promise = (async () => {
    const res = await fetch(`${BUNDLE_BASE}${path}`, { signal });
    if (!res.ok) throw new Error(`Bundle fetch failed: ${path} (${res.status})`);
    return res.json();
  })();

  bundleCache.set(path, promise);

  try {
    const data = await promise;
    bundleCache.set(path, data);  // replace Promise with resolved value
    return data;
  } catch (err) {
    bundleCache.delete(path);
    throw err;
  }
}

// ── Generic API fetch (fallback path only) ──────────────────────────────────
async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Quran API error ${res.status} on ${path}`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getChapters({ language = "en", signal } = {}) {
  // Bundled first (offline-capable)
  try {
    const data = await loadBundle("/chapters.json", signal);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    // Bundle missing or corrupt — fall through to API
    console.warn("[quranService] chapters bundle unavailable, trying API:", err.message);
  }

  // API fallback
  const key = cacheKey("chapters", language);
  const cached = readCache(key);
  if (cached) return { data: cached, error: null };

  try {
    const json = await apiGet(`/chapters?language=${encodeURIComponent(language)}`, { signal });
    const data = (json.chapters ?? []).map(normaliseChapter);
    writeCache(key, data, TTL.chapters);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: [], error: "Could not load surahs." };
  }
}

function normaliseChapter(raw) {
  return {
    id:              raw.id,
    revelationPlace: raw.revelation_place,
    revelationOrder: raw.revelation_order,
    bismillahPre:    raw.bismillah_pre,
    nameSimple:      raw.name_simple,
    nameArabic:      raw.name_arabic,
    nameComplex:     raw.name_complex,
    versesCount:     raw.verses_count,
    pages:           raw.pages,
    translatedName:  raw.translated_name?.name ?? "",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERSES (Arabic + translation)
// ─────────────────────────────────────────────────────────────────────────────

// Map alquran.cloud edition IDs to bundled filenames.
const BUNDLED_TRANSLATIONS = new Set([
  "en.sahih", "en.pickthall", "en.yusufali", "en.asad", "en.hilali",
]);

export async function getVerses(chapterId, { translationId = "en.sahih", signal } = {}) {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { data: [], error: "Invalid chapter id." };
  }

  // ── Bundled path ──
  if (BUNDLED_TRANSLATIONS.has(translationId)) {
    try {
      const [arabicData, transData] = await Promise.all([
        loadBundle("/arabic-uthmani.json", signal),
        loadBundle(`/translations/${translationId}.json`, signal),
      ]);

      const sid = String(chapterId);
      const arabicVerses = arabicData[sid] ?? [];
      const transVerses  = transData?.[sid] ?? [];

      const data = arabicVerses.map((ar, i) => ({
        id:           ar.number,
        verseKey:     `${chapterId}:${ar.numberInSurah}`,
        verseNumber:  ar.numberInSurah,
        juzNumber:    ar.juz ?? null,
        pageNumber:   ar.page ?? null,
        arabic:       ar.text,
        translation:  transVerses[i]?.text ?? "",
        words:        [],
      }));

      return { data, error: null };
    } catch (err) {
      if (err.name === "AbortError") return { data: [], error: null };
      console.warn("[quranService] verses bundle unavailable, trying API:", err.message);
    }
  }

  // ── API fallback ──
  const key = cacheKey("verses", chapterId, translationId);
  const cached = readCache(key);
  if (cached) return { data: cached, error: null };

  try {
    const url = `https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-uthmani,${translationId}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const arabicSurah = json.data?.[0];
    const transSurah  = json.data?.[1];
    if (!arabicSurah?.ayahs) throw new Error("No ayahs returned");

    const data = arabicSurah.ayahs.map((ar, i) => ({
      id:           ar.number,
      verseKey:     `${chapterId}:${ar.numberInSurah}`,
      verseNumber:  ar.numberInSurah,
      juzNumber:    ar.juz ?? null,
      pageNumber:   ar.page ?? null,
      arabic:       ar.text,
      translation:  transSurah?.ayahs?.[i]?.text ?? "",
      words:        [],
    }));
    writeCache(key, data, TTL.verses);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: [], error: "Could not load verses." };
  }
}

function extractTranslation(raw) {
  const t = raw.translations;
  if (!t) return "";
  if (Array.isArray(t) && t.length > 0) {
    const text = t[0]?.text ?? t[0]?.translation_text ?? "";
    return String(text).replace(/<[^>]*>/g, "").trim();
  }
  if (typeof t === "string") return t.replace(/<[^>]*>/g, "").trim();
  return "";
}

function normaliseVerse(raw) {
  return {
    id:          raw.id,
    verseKey:    raw.verse_key,
    verseNumber: raw.verse_number,
    juzNumber:   raw.juz_number,
    pageNumber:  raw.page_number,
    arabic:      raw.text_uthmani,
    translation: extractTranslation(raw),
    words: Array.isArray(raw.words)
      ? raw.words
          .filter(w => w.char_type_name === "word")
          .map(w => ({
            id:              w.id,
            position:        w.position,
            text:            w.text_uthmani ?? w.text ?? "",
            translation:     w.translation?.text ?? "",
            transliteration: w.transliteration?.text ?? "",
          }))
      : [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2b. VERSES WITH WORD-LEVEL DATA (online-only)
//
// Word-level Arabic + transliteration data isn't bundled (would add ~10MB
// for marginal benefit on a less-common flow). Online-only with cache.
// ─────────────────────────────────────────────────────────────────────────────
export async function getVersesWithWords(chapterId, { signal } = {}) {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { data: [], error: "Invalid chapter id." };
  }

  const key = cacheKey("verses_words", chapterId);
  const cached = readCache(key);
  if (cached) return { data: cached, error: null };

  try {
    const params = new URLSearchParams({
      words:       "true",
      word_fields: "text_uthmani,position",
      fields:      "text_uthmani,verse_key,verse_number,juz_number,page_number",
      per_page:    "286",
    });
    const json = await apiGet(`/verses/by_chapter/${chapterId}?${params.toString()}`, { signal });
    const data = (json.verses ?? []).map(normaliseVerse);
    writeCache(key, data, TTL.verses);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: [], error: "Could not load verses." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECITERS
// ─────────────────────────────────────────────────────────────────────────────

export const CURATED_RECITERS = [
  { id: 7, name: "Mishary Rashid Alafasy",   style: "Murattal" },
  { id: 6, name: "Mahmoud Khalil Al-Husary", style: "Murattal" },
  { id: 4, name: "Abdul Basit Abdul Samad",  style: "Murattal" },
  { id: 3, name: "Abdur-Rahman As-Sudais",   style: "Murattal" },
  { id: 1, name: "Abdul Basit Abdul Samad",  style: "Mujawwad" },
  { id: 2, name: "Abu Bakr Al-Shatri",       style: "Murattal" },
  { id: 5, name: "Hani Ar-Rifai",            style: "Murattal" },
];

export const DEFAULT_RECITER_ID = 7;
export const DEFAULT_RECITERS = CURATED_RECITERS;

const CURATED_IDS = new Set(CURATED_RECITERS.map(r => r.id));

export async function getReciters({ language = "en", signal } = {}) {
  // Bundled first
  try {
    const data = await loadBundle("/reciters.json", signal);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    // Fall through to API
  }

  const key = cacheKey("reciters", language);
  const cached = readCache(key);
  if (cached) return { data: cached, error: null };

  try {
    const json = await apiGet(
      `/resources/recitations?language=${encodeURIComponent(language)}`,
      { signal }
    );
    const liveData = (json.recitations ?? [])
      .filter(r => CURATED_IDS.has(r.id))
      .map(r => ({
        id:         r.id,
        name:       r.reciter_name,
        style:      r.style ?? "",
        translated: r.translated_name?.name ?? "",
      }));
    const ordered = CURATED_RECITERS
      .map(curated => liveData.find(live => live.id === curated.id) ?? curated);
    writeCache(key, ordered, TTL.reciters);
    return { data: ordered, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: CURATED_RECITERS, error: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHAPTER RECITATION AUDIO URL (online — audio playback needs network anyway)
// ─────────────────────────────────────────────────────────────────────────────

export async function getChapterAudio(recitationId, chapterId, { signal } = {}) {
  if (!Number.isInteger(recitationId) || recitationId < 1) {
    return { url: null, error: "Invalid reciter id." };
  }
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { url: null, error: "Invalid chapter id." };
  }

  const key = cacheKey("audio", recitationId, chapterId);
  const cached = readCache(key);
  if (cached) return { url: cached, error: null };

  try {
    const json = await apiGet(`/chapter_recitations/${recitationId}/${chapterId}`, { signal });
    const url = json.audio_file?.audio_url ?? null;
    if (url) writeCache(key, url, TTL.recitation);
    return { url, error: url ? null : "No audio available." };
  } catch (err) {
    if (err.name === "AbortError") return { url: null, error: null };
    return { url: null, error: "Could not load audio." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CACHE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export function clearQuranCache() {
  memoryCache.clear();
  // bundleCache is NOT cleared — bundled JSON files are immutable and
  // re-fetching them just re-reads from local FS.
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sirat_quran_")) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  } catch {}
}
