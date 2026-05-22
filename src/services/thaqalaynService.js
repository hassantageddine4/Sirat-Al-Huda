// src/services/thaqalaynService.js
// ─────────────────────────────────────────────────────────────────────────────
// Thaqalayn adapter — bundled-first, API fallback.
//
// All 14 Shia books are bundled at public/hadith/shia/{collectionId}.json
// as raw Thaqalayn API responses (flat arrays of hadith objects). At runtime
// we fetch from the local bundle; if missing (e.g. dev with no bundle), we
// fall back to the live Thaqalayn API.
//
// Returns the same shape as hadithService.js so the existing UI is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const BUNDLE_BASE = "/hadith/shia";
const API         = "https://www.thaqalayn-api.net/api/v2";

const cache = new Map();
function ck(k)         { return `tq:${k}`; }
function readCache(k)  { return cache.get(ck(k)) || null; }
function writeCache(k, v) { cache.set(ck(k), v); }

// Map collection.id → Thaqalayn API bookId (for fallback path)
const BOOK_MAP = {
  "kafi-1": "Al-Kafi-Volume-1-Kulayni",
  "kafi-2": "Al-Kafi-Volume-2-Kulayni",
  "kafi-3": "Al-Kafi-Volume-3-Kulayni",
  "kafi-4": "Al-Kafi-Volume-4-Kulayni",
  "kafi-5": "Al-Kafi-Volume-5-Kulayni",
  "kafi-6": "Al-Kafi-Volume-6-Kulayni",
  "kafi-7": "Al-Kafi-Volume-7-Kulayni",
  "kafi-8": "Al-Kafi-Volume-8-Kulayni",
  "manlayahduruh-1": "Man-La-Yahduruh-al-Faqih-Volume-1-Saduq",
  "manlayahduruh-2": "Man-La-Yahduruh-al-Faqih-Volume-2-Saduq",
  "manlayahduruh-3": "Man-La-Yahduruh-al-Faqih-Volume-3-Saduq",
  "manlayahduruh-4": "Man-La-Yahduruh-al-Faqih-Volume-4-Saduq",
  "manlayahduruh-5": "Man-La-Yahduruh-al-Faqih-Volume-5-Saduq",
  "nahjbalagha":     "Nahj-al-Balagha-Radi",
};

export function getApiBookId(collectionId) {
  return BOOK_MAP[collectionId] || null;
}

// ─── Full-book loader: bundle first, API fallback ──────────────────────────
async function getFullBook(collectionId, signal) {
  const key = `book:${collectionId}`;
  const cached = readCache(key);
  if (cached) return cached;

  // Bundle attempt
  try {
    const res = await fetch(`${BUNDLE_BASE}/${collectionId}.json`, { signal });
    if (res.ok) {
      const all = await res.json();
      writeCache(key, all);
      return all;
    }
    // Non-OK means file isn't there — fall through to API
  } catch (err) {
    if (err.name === "AbortError") throw err;
    // Network error reaching the local bundle is rare; fall through
  }

  // API fallback
  console.warn(`[thaqalayn] bundle missing for ${collectionId}, trying API...`);
  const bookId = BOOK_MAP[collectionId];
  if (!bookId) throw new Error(`No Thaqalayn mapping for ${collectionId}`);

  const r = await fetch(`${API}/${bookId}`, { signal });
  if (!r.ok) throw new Error(`HTTP ${r.status} — ${API}/${bookId}`);
  const all = await r.json();
  writeCache(key, all);
  return all;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function uniqueCategories(arr) {
  const seen = new Map();
  for (const h of arr) {
    const id = String(h.categoryId);
    if (!seen.has(id)) seen.set(id, { id, title: h.category || `Section ${id}` });
  }
  return Array.from(seen.values());
}

function normalize(h, collection) {
  return {
    collectionId:    collection.id,
    collectionName:  collection.name,
    hadithNumber:    h.id,
    arabicNumber:    h.id,
    textEng:         h.englishText || "",
    textAra:         h.arabicText  || "",
    sectionNumber:   Number(h.categoryId),
    sectionTitle:    h.category || "",
    referenceBook:   h.book || "",
    referenceHadith: h.id,
    grades:          h.majlisiGrading
      ? [{ name: "Majlisi", grade: h.majlisiGrading }]
      : [],
  };
}

// ─── Public API (same shape as hadithService consumers expect) ─────────────

export async function getSectionIndex(collection, { signal } = {}) {
  const all = await getFullBook(collection.id, signal);
  const cats = uniqueCategories(all);
  const sections = cats.map(c => ({ number: Number(c.id), title: c.title }));
  return { collection, sections, total: all.length };
}

export async function getSection(collection, sectionNumber, { signal } = {}) {
  const all = await getFullBook(collection.id, signal);
  const inSection = all.filter(h => String(h.categoryId) === String(sectionNumber));
  const title = inSection[0]?.category || `Section ${sectionNumber}`;
  const hadiths = inSection.map(h => normalize(h, collection));
  return { section: { number: Number(sectionNumber), title }, hadiths };
}

export async function getHadith(collection, hadithNumber, { signal } = {}) {
  const all = await getFullBook(collection.id, signal);
  const match = all.find(h => String(h.id) === String(hadithNumber));
  if (!match) throw new Error(`Hadith ${hadithNumber} not found in ${collection.id}`);
  return normalize(match, collection);
}
