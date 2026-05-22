// src/services/quranService.js
// ─────────────────────────────────────────────────────────────────────────────
// Quran.com v4 public API wrapper.
//
// NO AUTHENTICATION. NO SECRETS. NO ENV VARS.
// Every endpoint hit by this module is publicly accessible.
//
// Endpoints used:
//   • GET /api/v4/chapters                         — list all 114 surahs
//   • GET /api/v4/verses/by_chapter/{id}           — verses for a surah
//   • GET /api/v4/chapter_recitations/{rid}/{cid}  — full-surah audio URL
//   • GET /api/v4/recitations                      — list of reciters
//
// Results are cached in-memory AND in localStorage with a TTL so opening
// a surah a second time is instant and works offline.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://api.quran.com/api/v4";

// ── Caching ──────────────────────────────────────────────────────────────────
const TTL = {
  chapters:    1000 * 60 * 60 * 24 * 30,  // 30 days — chapter list never changes
  verses:      1000 * 60 * 60 * 24 * 7,   // 7 days
  reciters:    1000 * 60 * 60 * 24 * 7,
  recitation:  1000 * 60 * 60 * 24 * 30,  // 30 days — audio URLs are stable
};

const memoryCache = new Map();

function cacheKey(name, ...parts) {
  return `sirat_quran_${name}_${parts.join("_")}`;
}

function readCache(key, ttl) {
  // Memory first (fastest)
  if (memoryCache.has(key)) {
    const { value, expires } = memoryCache.get(key);
    if (Date.now() < expires) return value;
    memoryCache.delete(key);
  }
  // Then localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expires } = JSON.parse(raw);
    if (Date.now() < expires) {
      memoryCache.set(key, { value, expires });
      return value;
    }
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable or corrupted — no-op
  }
  return null;
}

function writeCache(key, value, ttl) {
  const expires = Date.now() + ttl;
  memoryCache.set(key, { value, expires });
  try {
    localStorage.setItem(key, JSON.stringify({ value, expires }));
  } catch {
    // Quota exceeded or disabled — memory cache still works
  }
}

// ── Generic fetch helper ─────────────────────────────────────────────────────
async function apiGet(path, { signal } = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method:  "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    throw new Error(`Quran API error ${res.status} on ${path}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CHAPTERS (all 114 surahs)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the list of all 114 surahs.
 * @param {object} opts
 * @param {string} opts.language   ISO language code for translated name (default 'en')
 * @param {AbortSignal} opts.signal
 * @returns {Promise<{data: Surah[], error: string|null}>}
 */
export async function getChapters({ language = "en", signal } = {}) {
  const key = cacheKey("chapters", language);
  const cached = readCache(key, TTL.chapters);
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
    revelationPlace: raw.revelation_place,     // 'makkah' | 'madinah'
    revelationOrder: raw.revelation_order,
    bismillahPre:    raw.bismillah_pre,
    nameSimple:      raw.name_simple,          // "Al-Fatihah"
    nameArabic:      raw.name_arabic,          // "الفاتحة"
    nameComplex:     raw.name_complex,         // "Al-Fātiḥah"
    versesCount:     raw.verses_count,
    pages:           raw.pages,                // [start, end]
    translatedName:  raw.translated_name?.name ?? "",  // "The Opener"
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VERSES (ayahs of a specific surah)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all verses for a given chapter (surah).
 * Includes Uthmani Arabic script and optional English translation.
 *
 * @param {number} chapterId          1..114
 * @param {object} opts
 * @param {number} opts.translationId Quran.com translation ID (default 131 = Sahih International)
 * @param {AbortSignal} opts.signal
 */
export async function getVerses(chapterId, { translationId = 131, signal } = {}) {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { data: [], error: "Invalid chapter id." };
  }

  const key = cacheKey("verses", chapterId, translationId);
  const cached = readCache(key, TTL.verses);
  if (cached) return { data: cached, error: null };

  try {
    const params = new URLSearchParams({
      fields:        "text_uthmani,verse_key,verse_number,juz_number,page_number",
      translations:  String(translationId),
      per_page:      "286",   // largest surah (Al-Baqarah) fits in one page
    });
    const json = await apiGet(
      `/verses/by_chapter/${chapterId}?${params.toString()}`,
      { signal }
    );
    const data = (json.verses ?? []).map(normaliseVerse);
    writeCache(key, data, TTL.verses);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: [], error: "Could not load verses." };
  }
}

function normaliseVerse(raw) {
  return {
    id:          raw.id,
    verseKey:    raw.verse_key,          // e.g. "2:255"
    verseNumber: raw.verse_number,
    juzNumber:   raw.juz_number,
    pageNumber:  raw.page_number,
    arabic:      raw.text_uthmani,
    translation: raw.translations?.[0]?.text ?? "",
    // Word-level data (present when fetched with words=true)
    words: Array.isArray(raw.words)
      ? raw.words
          .filter(w => w.char_type_name === "word")   // drop end-of-ayah markers
          .map(w => ({
            id:          w.id,
            position:    w.position,
            text:        w.text_uthmani ?? w.text ?? "",
            translation: w.translation?.text ?? "",
            transliteration: w.transliteration?.text ?? "",
          }))
      : [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2b. VERSES WITH WORD-LEVEL DATA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all verses for a chapter WITH per-word data.
 * Used for the recitation practice screen where each word is rendered
 * individually so it can be highlighted as correct/incorrect/missing.
 */
export async function getVersesWithWords(chapterId, { signal } = {}) {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { data: [], error: "Invalid chapter id." };
  }

  const key = cacheKey("verses_words", chapterId);
  const cached = readCache(key, TTL.verses);
  if (cached) return { data: cached, error: null };

  try {
    const params = new URLSearchParams({
      words:          "true",
      word_fields:    "text_uthmani,position",
      fields:         "text_uthmani,verse_key,verse_number,juz_number,page_number",
      per_page:       "286",
    });
    const json = await apiGet(
      `/verses/by_chapter/${chapterId}?${params.toString()}`,
      { signal }
    );
    const data = (json.verses ?? []).map(normaliseVerse);
    writeCache(key, data, TTL.verses);
    return { data, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    return { data: [], error: "Could not load verses." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECITERS (full-surah audio)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Curated list of popular reciters — these IDs are stable at Quran.com.
 *
 * We intentionally don't show every reciter the API returns. A curated
 * list keeps the UI clean and means the default pick is always a
 * well-known reciter rather than an obscure one at position 0.
 *
 * The `id` values here are Quran.com `recitation` resource IDs used by
 * the `/chapter_recitations/{id}/{chapterId}` endpoint.
 */
export const CURATED_RECITERS = [
  { id: 7,  name: "Mishary Rashid Alafasy",  style: "Murattal" },
  { id: 6,  name: "Mahmoud Khalil Al-Husary", style: "Murattal" },
  { id: 4,  name: "Abdul Basit Abdul Samad",  style: "Murattal" },
  { id: 3,  name: "Abdur-Rahman As-Sudais",   style: "Murattal" },
  { id: 1,  name: "Abdul Basit Abdul Samad",  style: "Mujawwad" },
  { id: 2,  name: "Abu Bakr Al-Shatri",       style: "Murattal" },
  { id: 5,  name: "Hani Ar-Rifai",            style: "Murattal" },
];

/** The reciter shown when the user hasn't made a choice yet. */
export const DEFAULT_RECITER_ID = 7;   // Mishary Rashid Alafasy

/** Backwards-compat alias so older imports keep working. */
export const DEFAULT_RECITERS = CURATED_RECITERS;

/** Set of curated IDs — used to filter the API response. */
const CURATED_IDS = new Set(CURATED_RECITERS.map(r => r.id));

/**
 * Fetch reciters from Quran.com, filtered to the curated list above,
 * and sorted in curated order so "Mishary Alafasy" always appears first.
 *
 * Falls back to the static CURATED_RECITERS if the network call fails.
 */
export async function getReciters({ language = "en", signal } = {}) {
  const key = cacheKey("reciters", language);
  const cached = readCache(key, TTL.reciters);
  if (cached) return { data: cached, error: null };

  try {
    const json = await apiGet(
      `/resources/recitations?language=${encodeURIComponent(language)}`,
      { signal }
    );

    // Filter to curated IDs only
    const liveData = (json.recitations ?? [])
      .filter(r => CURATED_IDS.has(r.id))
      .map(r => ({
        id:         r.id,
        name:       r.reciter_name,
        style:      r.style ?? "",
        translated: r.translated_name?.name ?? "",
      }));

    // Preserve curated order (not API order)
    const ordered = CURATED_RECITERS
      .map(curated => liveData.find(live => live.id === curated.id) ?? curated);

    writeCache(key, ordered, TTL.reciters);
    return { data: ordered, error: null };
  } catch (err) {
    if (err.name === "AbortError") return { data: [], error: null };
    // Graceful fallback — app keeps working even if Quran.com is unreachable
    return { data: CURATED_RECITERS, error: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHAPTER RECITATION AUDIO URL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the mp3 URL for a full-chapter recitation.
 *
 * @param {number} recitationId  Quran.com reciter id (see DEFAULT_RECITERS)
 * @param {number} chapterId     1..114
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export async function getChapterAudio(recitationId, chapterId, { signal } = {}) {
  if (!Number.isInteger(recitationId) || recitationId < 1) {
    return { url: null, error: "Invalid reciter id." };
  }
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    return { url: null, error: "Invalid chapter id." };
  }

  const key = cacheKey("audio", recitationId, chapterId);
  const cached = readCache(key, TTL.recitation);
  if (cached) return { url: cached, error: null };

  try {
    const json = await apiGet(
      `/chapter_recitations/${recitationId}/${chapterId}`,
      { signal }
    );
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

/**
 * Clear all cached Quran data.
 * Useful for a "Refresh data" button in settings.
 */
export function clearQuranCache() {
  memoryCache.clear();
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sirat_quran_")) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}
