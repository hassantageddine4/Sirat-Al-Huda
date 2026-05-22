// src/services/hijriService.js
// ─────────────────────────────────────────────────────────────────────────────
// Hijri / Islamic calendar service.
// Source: AlAdhan API (api.aladhan.com) — free, no auth required, well-cached.
//
// Why AlAdhan over imam.org: imam.org doesn't expose a public REST API.
// AlAdhan provides Gregorian↔Hijri conversion and a 'specialDays' endpoint
// for Islamic holidays. It's the de-facto standard for this category of app.
//
// Architecture mirrors hadithService:
//   • Two-tier cache (memory + localStorage) with daily TTL
//   • AbortController support for route cleanup
//   • Normalized return shapes
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "https://api.aladhan.com/v1";

// ─── Cache ──────────────────────────────────────────────────────────────────
const memCache = new Map();
const STORAGE_PREFIX = "sirat_hijri_v1:";
const TTL_MS = 6 * 60 * 60 * 1000;       // 6 hours — date doesn't change mid-day

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

// ─── Fetch helper ───────────────────────────────────────────────────────────
async function fetchJson(path, { signal, retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, { signal });
      if (!res.ok) { lastErr = new Error(`HTTP ${res.status}`); continue; }
      const json = await res.json();
      if (json?.code !== 200) { lastErr = new Error(json?.status ?? "Bad response"); continue; }
      return json.data;
    } catch (err) {
      if (err.name === "AbortError") throw err;
      lastErr = err;
      if (attempt < retries) await new Promise(r => setTimeout(r, 200 * Math.pow(2, attempt)));
    }
  }
  throw lastErr ?? new Error("Network error");
}

function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}-${mm}-${yy}`;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Convert today (or a given Gregorian date) to Hijri.
 * Returns a normalized shape with both formats and English/Arabic month names.
 */
export async function getTodayHijri({ signal } = {}) {
  const today = new Date();
  const key = `today:${fmtDate(today)}`;
  const cached = readCache(key);
  if (cached) return cached;

  const raw = await fetchJson(`/gToH/${fmtDate(today)}`, { signal });
  const norm = {
    gregorian: {
      day:     parseInt(raw.gregorian.day, 10),
      month:   raw.gregorian.month?.en ?? "",
      monthN:  raw.gregorian.month?.number ?? null,
      year:    parseInt(raw.gregorian.year, 10),
      weekday: raw.gregorian.weekday?.en ?? "",
      readable:raw.gregorian.date,
    },
    hijri: {
      day:     parseInt(raw.hijri.day, 10),
      month:   raw.hijri.month?.en ?? "",
      monthAr: raw.hijri.month?.ar ?? "",
      monthN:  raw.hijri.month?.number ?? null,
      year:    parseInt(raw.hijri.year, 10),
      weekday: raw.hijri.weekday?.en ?? "",
      weekdayAr: raw.hijri.weekday?.ar ?? "",
      readable:raw.hijri.date,
      holidays:Array.isArray(raw.hijri.holidays) ? raw.hijri.holidays : [],
    },
  };
  writeCache(key, norm);
  return norm;
}

/**
 * Get the list of Islamic special days (holidays) for the upcoming N days.
 * We fetch a single Hijri-month calendar and filter by holidays + reachable date.
 */
export async function getUpcomingEvents({ daysAhead = 60, signal } = {}) {
  const today = await getTodayHijri({ signal });
  const month = today.hijri.monthN;
  const year  = today.hijri.year;

  // Two months ahead is enough for a 60-day window in any Hijri month
  const months = [
    { m: month,        y: year },
    { m: month + 1,    y: year },
    { m: month + 2 > 12 ? 1 : month + 2, y: month + 2 > 12 ? year + 1 : year },
  ].map(p => ({ m: p.m > 12 ? p.m - 12 : p.m, y: p.y }));

  const cacheKey = `events:${year}-${month}`;
  const cached = readCache(cacheKey);
  if (cached) return filterUpcoming(cached, daysAhead);

  // hToGCalendar/{month}/{year} returns an array of {gregorian, hijri} for the month
  const allEvents = [];
  for (const { m, y } of months) {
    try {
      const data = await fetchJson(`/hToGCalendar/${m}/${y}`, { signal });
      if (!Array.isArray(data)) continue;
      data.forEach(entry => {
        const holidays = entry?.hijri?.holidays ?? [];
        if (holidays.length === 0) return;
        const [dd, mm, yyyy] = (entry.gregorian.date ?? "").split("-").map(s => parseInt(s, 10));
        if (!dd || !mm || !yyyy) return;
        // Convert from DD-MM-YYYY to a Date object
        const gregDate = new Date(yyyy, mm - 1, dd);
        holidays.forEach(name => {
          allEvents.push({
            name,
            hijriDay:    parseInt(entry.hijri.day, 10),
            hijriMonth:  entry.hijri.month?.en ?? "",
            hijriYear:   parseInt(entry.hijri.year, 10),
            gregorian:   gregDate.toISOString(),
            gregReadable:entry.gregorian.date,
          });
        });
      });
    } catch (err) {
      if (err.name === "AbortError") throw err;
      // Continue — partial results are still useful
    }
  }

  writeCache(cacheKey, allEvents);
  return filterUpcoming(allEvents, daysAhead);
}

function filterUpcoming(events, daysAhead) {
  const now = Date.now();
  const horizon = now + daysAhead * 24 * 60 * 60 * 1000;
  return events
    .map(e => ({ ...e, _ts: new Date(e.gregorian).getTime() }))
    .filter(e => e._ts >= now - 86_400_000 && e._ts <= horizon)  // include today
    .sort((a, b) => a._ts - b._ts);
}

/**
 * Returns a Hijri month calendar (array of days) for the current Hijri month.
 * Used by the expandable monthly view.
 */
export async function getHijriMonth({ year, month, signal } = {}) {
  const cacheKey = `month:${year}-${month}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const data = await fetchJson(`/hToGCalendar/${month}/${year}`, { signal });
  if (!Array.isArray(data)) return [];

  const days = data.map(entry => ({
    hijriDay:    parseInt(entry.hijri.day, 10),
    hijriMonth:  entry.hijri.month?.en ?? "",
    hijriYear:   parseInt(entry.hijri.year, 10),
    gregReadable:entry.gregorian.date,
    gregDay:     parseInt(entry.gregorian.day, 10),
    gregMonth:   entry.gregorian.month?.en ?? "",
    weekday:     entry.gregorian.weekday?.en ?? "",
    holidays:    entry.hijri.holidays ?? [],
  }));

  writeCache(cacheKey, days);
  return days;
}
