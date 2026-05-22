// src/services/hadithService.js
// ─────────────────────────────────────────────────────────────────────────────
// Hadith API service — bundled-first, jsDelivr fallback.
//
// All 6 Sunni collections (eng + ara) and 14 Shia books are bundled into the
// app at public/hadith/. The runtime fetches them via `fetch('/hadith/...')`
// which Capacitor serves from the local filesystem — works in airplane mode.
//
// Behaviour difference from previous version:
//   • Per-section and per-hadith jsDelivr endpoints are NOT used. We load the
//     full edition (once, cached for app lifetime) and slice/filter locally.
//   • Memory cost: ~5-8MB per loaded Sunni collection. We accept this trade
//     because offline reliability is the priority.
//
// Public API preserved exactly:
//   • COLLECTIONS, getCollectionById
//   • getHadith, getSection, getSectionIndex, searchHadiths
//   • clearHadithCache
// ─────────────────────────────────────────────────────────────────────────────

import * as Thaqalayn from "./thaqalaynService";

const BUNDLE_BASE = "/hadith";
const JSDELIVR    = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

// ─── Curated collection registry ────────────────────────────────────────────
export const COLLECTIONS = [
  {
    id: "bukhari", name: "Sahih al-Bukhari", arabic: "صحيح البخاري",
    compiler: "Imam Muhammad al-Bukhari", period: "d. 870 CE",
    eng: "eng-bukhari", ara: "ara-bukhari",
    grade: "Sahih", tradition: "sunni",
  },
  {
    id: "muslim", name: "Sahih Muslim", arabic: "صحيح مسلم",
    compiler: "Imam Muslim ibn al-Hajjaj", period: "d. 875 CE",
    eng: "eng-muslim", ara: "ara-muslim",
    grade: "Sahih", tradition: "sunni",
  },
  {
    id: "abudawud", name: "Sunan Abu Dawud", arabic: "سنن أبي داود",
    compiler: "Imam Abu Dawud al-Sijistani", period: "d. 889 CE",
    eng: "eng-abudawud", ara: "ara-abudawud",
    tradition: "sunni",
  },
  {
    id: "tirmidhi", name: "Jami` at-Tirmidhi", arabic: "جامع الترمذي",
    compiler: "Imam Muhammad al-Tirmidhi", period: "d. 892 CE",
    eng: "eng-tirmidhi", ara: "ara-tirmidhi",
    tradition: "sunni",
  },
  {
    id: "nasai", name: "Sunan an-Nasa'i", arabic: "سنن النسائي",
    compiler: "Imam Ahmad al-Nasa'i", period: "d. 915 CE",
    eng: "eng-nasai", ara: "ara-nasai",
    tradition: "sunni",
  },
  {
    id: "ibnmajah", name: "Sunan Ibn Majah", arabic: "سنن ابن ماجه",
    compiler: "Imam Muhammad Ibn Majah", period: "d. 887 CE",
    eng: "eng-ibnmajah", ara: "ara-ibnmajah",
    tradition: "sunni",
  },
  // ── SHIA — via Thaqalayn (bundled offline) ──
  { id: "kafi-1", name: "Al-Kafi · Vol 1 (Usul)",  arabic: "الكافي ١", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-2", name: "Al-Kafi · Vol 2 (Usul)",  arabic: "الكافي ٢", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-3", name: "Al-Kafi · Vol 3 (Furu)",  arabic: "الكافي ٣", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-4", name: "Al-Kafi · Vol 4 (Furu)",  arabic: "الكافي ٤", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-5", name: "Al-Kafi · Vol 5 (Furu)",  arabic: "الكافي ٥", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-6", name: "Al-Kafi · Vol 6 (Furu)",  arabic: "الكافي ٦", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-7", name: "Al-Kafi · Vol 7 (Furu)",  arabic: "الكافي ٧", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "kafi-8", name: "Al-Kafi · Vol 8 (Rawda)", arabic: "الكافي ٨", compiler: "Shaykh al-Kulayni", period: "d. 941 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "manlayahduruh-1", name: "Man La Yahduruh al-Faqih · Vol 1", arabic: "من لا يحضره الفقيه ١", compiler: "Shaykh al-Saduq", period: "d. 991 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "manlayahduruh-2", name: "Man La Yahduruh al-Faqih · Vol 2", arabic: "من لا يحضره الفقيه ٢", compiler: "Shaykh al-Saduq", period: "d. 991 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "manlayahduruh-3", name: "Man La Yahduruh al-Faqih · Vol 3", arabic: "من لا يحضره الفقيه ٣", compiler: "Shaykh al-Saduq", period: "d. 991 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "manlayahduruh-4", name: "Man La Yahduruh al-Faqih · Vol 4", arabic: "من لا يحضره الفقيه ٤", compiler: "Shaykh al-Saduq", period: "d. 991 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "manlayahduruh-5", name: "Man La Yahduruh al-Faqih · Vol 5", arabic: "من لا يحضره الفقيه ٥", compiler: "Shaykh al-Saduq", period: "d. 991 CE", grade: "Mixed", tradition: "shia", source: "thaqalayn" },
  { id: "nahjbalagha", name: "Nahj al-Balagha", arabic: "نهج البلاغة", compiler: "al-Sharif al-Radi", period: "d. 1015 CE", grade: "—", tradition: "shia", source: "thaqalayn" },
  { id: "tahdhib", name: "Tahdhib al-Ahkam",  arabic: "تهذيب الأحكام", compiler: "Shaykh al-Tusi", period: "d. 1067 CE", grade: "Mixed", tradition: "shia", source: "comingsoon" },
  { id: "istibsar", name: "Al-Istibsar",       arabic: "الاستبصار",    compiler: "Shaykh al-Tusi", period: "d. 1067 CE", grade: "Mixed", tradition: "shia", source: "comingsoon" },
];

export function getCollectionById(id) {
  return COLLECTIONS.find(c => c.id === id) ?? null;
}

// ─── Bundle cache (in-memory, kept for app lifetime) ────────────────────────
const bundleCache = new Map();   // path → Promise<json> | json

async function loadBundle(path, signal) {
  if (bundleCache.has(path)) return bundleCache.get(path);

  const promise = (async () => {
    const res = await fetch(`${BUNDLE_BASE}${path}`, { signal });
    if (!res.ok) throw new Error(`Bundle fetch failed: ${path} (${res.status})`);
    return res.json();
  })();

  bundleCache.set(path, promise);

  try {
    const data = await promise;
    bundleCache.set(path, data);    // replace Promise with resolved value
    return data;
  } catch (err) {
    bundleCache.delete(path);
    throw err;
  }
}

// ─── jsDelivr fallback (used only if bundle missing — graceful degradation) ─
async function fetchJsonFallback(path, { retries = 2, signal } = {}) {
  const candidates = [`${JSDELIVR}${path}.min.json`, `${JSDELIVR}${path}.json`];
  let lastErr;
  for (const url of candidates) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) { lastErr = new Error(`HTTP ${res.status}`); continue; }
        return await res.json();
      } catch (err) {
        if (err.name === "AbortError") throw err;
        lastErr = err;
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 200 * Math.pow(2, attempt)));
        }
      }
    }
  }
  throw lastErr ?? new Error("Network error");
}

// ─── Edition loaders (bundle-first, jsDelivr fallback) ──────────────────────
async function getEng(collection, signal) {
  try {
    return await loadBundle(`/sunni/${collection.id}-eng.json`, signal);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.warn(`[hadithService] eng bundle missing for ${collection.id}, trying jsDelivr...`);
    return await fetchJsonFallback(`/editions/${collection.eng}`, { signal });
  }
}

async function getAra(collection, signal) {
  try {
    return await loadBundle(`/sunni/${collection.id}-ara.json`, signal);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.warn(`[hadithService] ara bundle missing for ${collection.id}, trying jsDelivr...`);
    return await fetchJsonFallback(`/editions/${collection.ara}`, { signal });
  }
}

// ─── Legacy localStorage cache (kept for fallback path) ─────────────────────
const memCache = new Map();
const STORAGE_PREFIX = "sirat_hadith_v1:";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
  } catch { return null; }
}

function writeCache(key, value) {
  memCache.set(key, value);
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ value, ts: Date.now() }));
  } catch {}
}

export function clearHadithCache() {
  memCache.clear();
  bundleCache.clear();
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getHadith(collectionId, hadithNumber, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);

  if (collection.source === "thaqalayn") {
    return Thaqalayn.getHadith(collection, hadithNumber, { signal });
  }
  if (collection.source === "comingsoon") {
    throw new Error("This collection is not available yet.");
  }

  const [eng, ara] = await Promise.all([
    getEng(collection, signal),
    getAra(collection, signal),
  ]);

  const e = (eng.hadiths ?? []).find(h => h.hadithnumber === hadithNumber);
  const a = (ara.hadiths ?? []).find(h => h.hadithnumber === hadithNumber);

  return normalizeHadithFromFull({ e, a, full: eng, collection });
}

export async function getSection(collectionId, sectionNumber, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);

  if (collection.source === "thaqalayn") {
    return Thaqalayn.getSection(collection, sectionNumber, { signal });
  }
  if (collection.source === "comingsoon") {
    throw new Error("This collection is not available yet.");
  }

  const [eng, ara] = await Promise.all([
    getEng(collection, signal),
    getAra(collection, signal),
  ]);

  const sectionMap = eng?.metadata?.sections ?? {};
  const sectionTitle = sectionMap[String(sectionNumber)] ?? "";

  const engInSection = (eng.hadiths ?? []).filter(h => h.reference?.book === sectionNumber);
  const araByNum = new Map((ara.hadiths ?? []).map(h => [h.hadithnumber, h]));

  const hadiths = engInSection.map(e => {
    const a = araByNum.get(e.hadithnumber);
    return {
      collectionId:    collection.id,
      collectionName:  collection.name,
      hadithNumber:    e.hadithnumber,
      arabicNumber:    a?.arabicnumber ?? e.arabicnumber ?? e.hadithnumber,
      textEng:         e.text ?? "",
      textAra:         a?.text ?? "",
      sectionNumber,
      sectionTitle,
      referenceBook:   e.reference?.book ?? null,
      referenceHadith: e.reference?.hadith ?? null,
      grades:          e.grades ?? [],
    };
  });

  return {
    section: { number: sectionNumber, title: sectionTitle },
    hadiths,
  };
}

export async function getSectionIndex(collectionId, { signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);

  if (collection.source === "thaqalayn") {
    return Thaqalayn.getSectionIndex(collection, { signal });
  }
  if (collection.source === "comingsoon") {
    throw new Error("This collection is not available yet.");
  }

  const eng = await getEng(collection, signal);
  const sectionMap = eng?.metadata?.sections ?? {};

  const sections = Object.keys(sectionMap)
    .map(k => ({ number: parseInt(k, 10), title: sectionMap[k] }))
    .filter(s => Number.isFinite(s.number) && s.title)
    .sort((a, b) => a.number - b.number);

  return {
    collection,
    sections,
    total: eng?.hadiths?.length ?? 0,
    sectionDetail: eng?.metadata?.section_detail ?? {},
  };
}

export async function searchHadiths(collectionId, query, { page = 0, pageSize = 20, signal } = {}) {
  const collection = getCollectionById(collectionId);
  if (!collection) throw new Error(`Unknown collection: ${collectionId}`);

  // Search not yet implemented for Shia / coming-soon collections
  if (collection.source === "thaqalayn" || collection.source === "comingsoon") {
    return { results: [], total: 0, page, pageSize };
  }

  const q = (query ?? "").toLowerCase().trim();
  const full = await getEng(collection, signal);
  const sectionMap = full?.metadata?.sections ?? {};

  const all = full?.hadiths ?? [];
  const filtered = !q ? all : all.filter(h =>
    (h.text ?? "").toLowerCase().includes(q) ||
    String(h.hadithnumber).includes(q)
  );

  const total = filtered.length;
  const start = page * pageSize;
  const slice = filtered.slice(start, start + pageSize);

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

// ─── Normalizer ─────────────────────────────────────────────────────────────
function normalizeHadithFromFull({ e, a, full, collection }) {
  const sectionMap = full?.metadata?.sections ?? {};
  const sectionNum = e?.reference?.book ?? null;
  return {
    collectionId:    collection.id,
    collectionName:  collection.name,
    hadithNumber:    e?.hadithnumber ?? a?.hadithnumber ?? null,
    arabicNumber:    a?.arabicnumber ?? e?.arabicnumber ?? null,
    textEng:         e?.text ?? "",
    textAra:         a?.text ?? "",
    sectionNumber:   sectionNum,
    sectionTitle:    sectionNum != null ? sectionMap[String(sectionNum)] ?? null : null,
    referenceBook:   e?.reference?.book ?? null,
    referenceHadith: e?.reference?.hadith ?? null,
    grades:          e?.grades ?? [],
  };
}

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
