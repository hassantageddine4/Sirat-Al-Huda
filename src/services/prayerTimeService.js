// src/services/prayerTimeService.js
// ─────────────────────────────────────────────────────────────────────────────
// Fetches real prayer times from Al-Adhan API (aladhan.com)
// Caches daily to localStorage to avoid redundant API calls.
// Supports location-based times, calculation methods, and madhabs.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL   = "https://api.aladhan.com/v1";
const CACHE_KEY  = "sirat_prayer_times_cache";
const PREFS_KEY  = "sirat_prayer_prefs";
const CACHE_TTL  = 12 * 60 * 60 * 1000; // 12 hours

// ── Calculation methods supported by Aladhan API ─────────────────────────────
export const CALC_METHODS = {
  ISNA:       { id: 2,  name: "ISNA",        full: "Islamic Society of North America" },
  MWL:        { id: 3,  name: "MWL",         full: "Muslim World League"               },
  Egypt:      { id: 5,  name: "Egypt",       full: "Egyptian General Authority of Survey" },
  Makkah:     { id: 4,  name: "Makkah",      full: "Umm Al-Qura University, Makkah"    },
  Karachi:    { id: 1,  name: "Karachi",     full: "University of Islamic Sciences, Karachi" },
  Tehran:     { id: 7,  name: "Tehran",      full: "Institute of Geophysics, University of Tehran" },
  Jafari:     { id: 0,  name: "Jafari",      full: "Shia Ithna-Ansari (Jafari)"        },
  Gulf:       { id: 8,  name: "Gulf",        full: "Gulf Region"                        },
  Kuwait:     { id: 9,  name: "Kuwait",      full: "Kuwait"                             },
  Qatar:      { id: 10, name: "Qatar",       full: "Qatar"                              },
  Singapore:  { id: 11, name: "Singapore",   full: "Majlis Ugama Islam Singapura"       },
  France:     { id: 12, name: "France",      full: "Union des organisations islamiques de France" },
  Turkey:     { id: 13, name: "Turkey",      full: "Diyanet İşleri Başkanlığı"          },
  Russia:     { id: 14, name: "Russia",      full: "Spiritual Administration of Muslims of Russia" },
};

// ── Madhab IDs for Asr calculation ───────────────────────────────────────────
export const MADHABS = {
  Hanafi:   { id: 1, name: "Hanafi"  },
  "Shafi'i":{ id: 0, name: "Shafi'i" },
  Maliki:   { id: 0, name: "Maliki"  },
  Hanbali:  { id: 0, name: "Hanbali" },
  "Ja'farī":{ id: 0, name: "Ja'farī" },
};

// ── Prayer names (Aladhan response keys → friendly names) ────────────────────
export const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const PRAYER_ARABIC = {
  Fajr:    { arabic: "الفجر" },
  Dhuhr:   { arabic: "الظهر" },
  Asr:     { arabic: "العصر" },
  Maghrib: { arabic: "المغرب" },
  Isha:    { arabic: "العشاء" },
};

// ── Saved preferences ─────────────────────────────────────────────────────────
export function loadPrayerPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    calcMethod:  "ISNA",
    madhab:      "Hanafi",
    notifEnabled: true,
    prayers: {
      Fajr:    true,
      Dhuhr:   true,
      Asr:     true,
      Maghrib: true,
      Isha:    true,
      Tahajjud: false,
    },
    offsetMinutes: {   // per-prayer early reminder offset (0 = at prayer time)
      Fajr:    0,
      Dhuhr:   0,
      Asr:     0,
      Maghrib: 0,
      Isha:    0,
    },
    quranNotif: {
      enabled: true,
      time:    "08:00",   // 24h format — default 8:00 AM
    },
  };
}

export function savePrayerPrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

// ── Cache helpers ─────────────────────────────────────────────────────────────
function getCacheKey(lat, lon, dateStr, methodId, madhab) {
  return `${CACHE_KEY}_${lat.toFixed(3)}_${lon.toFixed(3)}_${dateStr}_${methodId}_${madhab}`;
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

// ── Fetch prayer times for a single date ─────────────────────────────────────
// Returns: { timings: { Fajr, Dhuhr, Asr, Maghrib, Isha, Sunrise, Midnight },
//            date:    { hijri, gregorian },
//            meta:    { timezone, method } }
export async function fetchPrayerTimings({ lat, lon, date, calcMethod = "ISNA", madhab = "Hanafi" }) {
  const methodId  = CALC_METHODS[calcMethod]?.id ?? 2;
  const madhabId  = MADHABS[madhab]?.id ?? 1;
  const dateStr   = date ?? new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // DD-MM-YYYY
  const cacheKey  = getCacheKey(lat, lon, dateStr, methodId, madhabId);

  // Return cached value if fresh
  const cached = readCache(cacheKey);
  if (cached) return { data: cached, fromCache: true, error: null };

  const url = `${BASE_URL}/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${methodId}&school=${madhabId}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    if (json.code !== 200 || json.status !== "OK") {
      throw new Error(json.data ?? "Aladhan API error");
    }
    const payload = {
      timings:  json.data.timings,   // { Fajr: "05:42", Dhuhr: "12:30", ... }
      date:     json.data.date,      // { hijri: {...}, gregorian: {...} }
      meta:     json.data.meta,      // { timezone, method }
    };
    writeCache(cacheKey, payload);
    return { data: payload, fromCache: false, error: null };
  } catch (err) {
    return { data: null, fromCache: false, error: err.message ?? "Network error" };
  }
}

// ── Fetch times for today AND tomorrow (needed for midnight scheduling) ───────
export async function fetchTodayAndTomorrow({ lat, lon, calcMethod, madhab }) {
  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  function toDateStr(d) {
    return [
      String(d.getDate()).padStart(2, "0"),
      String(d.getMonth() + 1).padStart(2, "0"),
      d.getFullYear(),
    ].join("-");
  }

  const [todayRes, tomorrowRes] = await Promise.all([
    fetchPrayerTimings({ lat, lon, date: toDateStr(today),    calcMethod, madhab }),
    fetchPrayerTimings({ lat, lon, date: toDateStr(tomorrow), calcMethod, madhab }),
  ]);

  return { today: todayRes, tomorrow: tomorrowRes };
}

// ── Parse "HH:MM" string → today's Date object ───────────────────────────────
export function parseTimeToDate(timeStr, baseDate = new Date()) {
  // timeStr can be "05:42" or "05:42 (CDT)" — strip annotation
  const clean = timeStr.split(" ")[0].trim();
  const [h, m] = clean.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

// ── Estimate Tahajjud time (last third of night) ──────────────────────────────
// Between Isha and Fajr (next day), last third
export function calcTahajjud(ishaTime, fajrTomorrowTime) {
  const diff  = fajrTomorrowTime - ishaTime;  // ms
  const third = diff / 3;
  return new Date(fajrTomorrowTime - third);  // start of last third
}

// ── Format time string for display ───────────────────────────────────────────
export function formatTime(timeStr) {
  const clean = timeStr.split(" ")[0];
  const [h, m] = clean.split(":").map(Number);
  const period  = h >= 12 ? "PM" : "AM";
  const h12     = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

// ── Clean all prayer-related caches ──────────────────────────────────────────
export function clearPrayerCache() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY));
  keys.forEach(k => localStorage.removeItem(k));
}
