// src/services/hadithService.js
// ─────────────────────────────────────────────────────────────────────────────
// Hadith API service.
// Source: https://github.com/fawazahmed0/hadith-api  (jsdelivr CDN)
//
// Architecture:
//   • Single fetch helper with retry + jsdelivr fallback (.min.json → .json)
//   • Two-tier cache: in-memory Map + localStorage (TTL'd)
//   • Normalized return shapes — UI never has to handle the raw quirks
//   • Tree-shakeable named exports; no top-level network calls
//
// CDN: hadiths are served from jsDelivr's edge cache, so this is fast and
// has no rate limits. We still cache locally to keep the app responsive
// offline and to avoid re-paying parse cost on navigation.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

// ─── Curated collection registry ────────────────────────────────────────────
// One entry per book we surface. Each book has an English and Arabic edition.
// To add a collection later: append to this list — no other code changes.
export const COLLECTIONS = [
  {
    id:       "bukhari",
    name:     "Sahih al-Bukhari",
    arabic:   "صحيح البخاري",
    compiler: "Imam Muhammad al-Bukhari",
    period:   "d. 870 CE",
    eng:      "eng-bukhari",
    ara:      "ara-bukhari",
    grade:    "Sahih",
    tradition: "sunni",
  },
  {
    id:       "muslim",
    name:     "Sahih Muslim",
    arabic:   "صحيح مسلم",
    compiler: "Imam Muslim ibn al-Hajjaj",
    period:   "d. 875 CE",
    eng:      "eng-muslim",
    ara:      "ara-muslim",
    grade:    "Sahih",
    tradition: "sunni",
  },
  {
    id:       "abudawud",
    name:     "Sunan Abu Dawud",
    arabic:   "سنن أبي داود",
    compiler: "Imam Abu Dawud al-Sijistani",
    period:   "d. 889 CE",
    eng:      "eng-abudawud",
    ara:      "ara-abudawud",
    tradition: "sunni",
  },
  {
    id:       "tirmidhi",
    name:     "Jami` at-Tirmidhi",
    arabic:   "جامع الترمذي",
    compiler: "Imam Muhammad al-Tirmidhi",
    period:   "d. 892 CE",
    eng:      "eng-tirmidhi",
    ara:      "ara-tirmidhi",
    tradition: "sunni",
  },
  {
    id:       "nasai",
    name:     "Sunan an-Nasa'i",
    arabic:   "سنن النسائي",
    compiler: "Imam Ahmad al-Nasa'i",
    period:   "d. 915 CE",
    eng:      "eng-nasai",
    ara:      "ara-nasai",
    tradition: "sunni",
  },
  {
    id:       "ibnmajah",
    name:     "Sunan Ibn Majah",
    arabic:   "سنن ابن ماجه",
    compiler: "Imam Muhammad Ibn Majah",
    period:   "d. 887 CE",
    eng:      "eng-ibnmajah",
    ara:      "ara-ibnmajah",
    tradition: "sunni",
  },
];

export function getCollectionById(id) {
  return COLLECTIONS.find(c => c.id === id) ?? null;
}

// ─── Cache layer ────────────────────────────────────────────────────────────
const memCache = new Map();
const STORAGE_PREFIX = "sirat_hadith_v1:";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days — content is immutable

function readCache(key) {
  if (memCache.has(key)) return memCache.get(key);
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
    memCache.set(key, value);
    return value;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  memCache.set(key, value);
  try {
    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify({ value, ts: Date.now() })
    );
  } catch {
    // localStorage full — silently drop. In-memory cache still works.
  }
}

export function clearHadithCache() {
  memCache.clear();
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}

// ─── Fetch helper with retry + min/full fallback ────────────────────────────
async function fetchJson(path, { retries = 2, signal } = {}) {
  // Always try .min.json first; fall back to .json if min serves stale or empty
  const candidates = [`${BASE}/${path}.min.json`, `${BASE}/${path}.json`];
  let lastErr;

  for (const url of candidates) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          lastErr = new Error(`HTTP ${res.status}`);
          continue;
        }
        return await res.json();
      } catch (err) {
        if (err.name === "AbortError") throw err;
        lastErr = err;
        // Exponential backoff: 200ms, 400ms, 800ms
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 200 * Math.pow(2, attempt)));
        }
      }
    }
  }
  throw lastErr ?? new Error("Network error");
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Get one hadith by number, with both Arabic and English text + chapter/grade.
 * @param {string} collectionId  - e.g. "bukhari"
 * @param {number} hadithNumber  - 1-indexed
 * @param {object} opts          - { signal }
 * @returns {Promise<NormalizedHadith>}
 */
export async function getHadith(collectionId, hadithNumber, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);
  const cacheKey = `h:${collectionId}:${hadithNumber}`;

  const cached = readCache(cacheKey);
  if (cached) return cached;

  const [eng, ara] = await Promise.all([
    fetchJson(`editions/${collection.eng}/${hadithNumber}`, { signal }),
    fetchJson(`editions/${collection.ara}/${hadithNumber}`, { signal }),
  ]);

  const normalized = normalizeHadith({ eng, ara, collection });
  writeCache(cacheKey, normalized);
  return normalized;
}

/**
 * Get one section (chapter) of hadith. Returns a normalized list.
 * @param {string} collectionId
 * @param {number} sectionNumber
 * @param {object} opts
 * @returns {Promise<{section: SectionMeta, hadiths: NormalizedHadith[]}>}
 */
export async function getSection(collectionId, sectionNumber, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);
  const cacheKey = `s:${collectionId}:${sectionNumber}`;

  const cached = readCache(cacheKey);
  if (cached) return cached;

  const [eng, ara] = await Promise.all([
    fetchJson(`editions/${collection.eng}/sections/${sectionNumber}`, { signal }),
    fetchJson(`editions/${collection.ara}/sections/${sectionNumber}`, { signal }),
  ]);

  const result = normalizeSection({ eng, ara, collection, sectionNumber });
  writeCache(cacheKey, result);
  return result;
}

/**
 * Get the section list (chapters) for a collection. We derive this from the
 * full English edition's metadata.section map. Cached aggressively because
 * it never changes.
 * @returns {Promise<{collection, sections: {number, title}[], total}>}
 */
export async function getSectionIndex(collectionId, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);
  const cacheKey = `idx:${collectionId}`;

  const cached = readCache(cacheKey);
  if (cached) return cached;

  // The full edition is large but loaded only once and cached.
  const full = await fetchJson(`editions/${collection.eng}`, { signal });
  const sectionMap = full?.metadata?.section ?? {};

  const sections = Object.keys(sectionMap)
    .map(k => ({ number: parseInt(k, 10), title: sectionMap[k] }))
    .filter(s => Number.isFinite(s.number) && s.title)
    .sort((a, b) => a.number - b.number);

  const total = full?.hadiths?.length ?? 0;

  const result = {
    collection,
    sections,
    total,
    sectionDetail: full?.metadata?.section_detail ?? {},
  };
  writeCache(cacheKey, result);
  return result;
}

/**
 * Search hadiths in a collection. We pull the full English edition once,
 * cache it, and run a fast string filter in-memory.
 * Returns a paginated slice.
 *
 * @param {string} collectionId
 * @param {string} query  - case-insensitive substring
 * @param {object} opts   - { page=0, pageSize=20, signal }
 * @returns {Promise<{results, total, page, pageSize}>}
 */
export async function searchHadiths(collectionId, query, { page = 0, pageSize = 20, signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);
  const q = (query ?? "").toLowerCase().trim();

  // Get cached or fetch full edition
  const cacheKey = `full:${collectionId}`;
  let full = readCache(cacheKey);
  if (!full) {
    full = await fetchJson(`editions/${collection.eng}`, { signal });
    writeCache(cacheKey, full);
  }
  const sectionMap = full?.metadata?.section ?? {};

  // Filter
  const all = full?.hadiths ?? [];
  let filtered;
  if (!q) {
    filtered = all;
  } else {
    filtered = all.filter(h =>
      (h.text ?? "").toLowerCase().includes(q) ||
      String(h.hadithnumber).includes(q)
    );
  }

  const total = filtered.length;
  const start = page * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  // Light normalization for list display — Arabic text NOT included
  // here (that would double the payload). Detail screen fetches Arabic.
  const results = slice.map(h => ({
    collectionId,
    collectionName: collection.name,
    hadithNumber:   h.hadithnumber,
    arabicNumber:   h.arabicnumber ?? h.hadithnumber,
    textEng:        h.text ?? "",
    textAra:        null,
    sectionNumber:  h.reference?.book ?? null,
    sectionTitle:   sectionMap[String(h.reference?.book)] ?? null,
    grades:         h.grades ?? [],
  }));

  return { results, total, page, pageSize };
}

// ─── Normalizers ────────────────────────────────────────────────────────────
function normalizeHadith({ eng, ara, collection }) {
  const e = eng?.hadiths?.[0];
  const a = ara?.hadiths?.[0];
  const sectionMap = eng?.metadata?.section ?? {};
  const sectionNum = e?.reference?.book ?? null;

  return {
    collectionId:   collection.id,
    collectionName: collection.name,
    hadithNumber:   e?.hadithnumber ?? a?.hadithnumber ?? null,
    arabicNumber:   a?.arabicnumber ?? e?.arabicnumber ?? null,
    textEng:        e?.text ?? "",
    textAra:        a?.text ?? "",
    sectionNumber:  sectionNum,
    sectionTitle:   sectionNum != null ? sectionMap[String(sectionNum)] ?? null : null,
    referenceBook:  e?.reference?.book ?? null,
    referenceHadith:e?.reference?.hadith ?? null,
    grades:         e?.grades ?? [],
  };
}

function normalizeSection({ eng, ara, collection, sectionNumber }) {
  const sectionMap = eng?.metadata?.section ?? {};
  const sectionTitle = sectionMap[String(sectionNumber)] ?? "";
  const engHadiths = eng?.hadiths ?? [];
  const araHadiths = ara?.hadiths ?? [];

  // Pair English with Arabic by hadithnumber
  const araByNum = new Map(araHadiths.map(h => [h.hadithnumber, h]));

  const hadiths = engHadiths.map(e => {
    const a = araByNum.get(e.hadithnumber);
    return {
      collectionId:   collection.id,
      collectionName: collection.name,
      hadithNumber:   e.hadithnumber,
      arabicNumber:   a?.arabicnumber ?? e.arabicnumber ?? e.hadithnumber,
      textEng:        e.text ?? "",
      textAra:        a?.text ?? "",
      sectionNumber,
      sectionTitle,
      referenceBook:  e.reference?.book ?? null,
      referenceHadith:e.reference?.hadith ?? null,
      grades:         e.grades ?? [],
    };
  });

  return {
    section: { number: sectionNumber, title: sectionTitle },
    hadiths,
  };
}

// ─── Type sketch for editor IntelliSense (jsdoc) ────────────────────────────
/**
 * @typedef {Object} NormalizedHadith
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {number} hadithNumber
 * @property {number} arabicNumber
 * @property {string} textEng
 * @property {string} textAra
 * @property {number|null} sectionNumber
 * @property {string|null} sectionTitle
 * @property {number|null} referenceBook
 * @property {number|null} referenceHadith
 * @property {{name:string, grade:string}[]} grades
 */
