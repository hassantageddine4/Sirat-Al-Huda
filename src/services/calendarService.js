// src/services/calendarService.js
// Aladhan API — no key required.
const BASE = "https://api.aladhan.com/v1";
const cache = new Map();

export async function getGregorianMonth(month, year) {
  const k = `g:${year}-${month}`;
  if (cache.has(k)) return cache.get(k);
  const res = await fetch(`${BASE}/gToHCalendar/${month}/${year}`);
  const json = await res.json();
  const data = json?.data || [];
  cache.set(k, data);
  return data;
}

export async function getHijriHolidays(hijriYear) {
  const k = `h:${hijriYear}`;
  if (cache.has(k)) return cache.get(k);
  const res = await fetch(`${BASE}/specialDays`);
  const json = await res.json();
  const days = (json?.data || []).map(d => ({ ...d, hijriYear }));
  cache.set(k, days);
  return days;
}

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function gregorianKey(dayEntry) {
  const g = dayEntry?.gregorian;
  if (!g) return "";
  const [d, m, y] = g.date.split("-");
  return `${y}-${m}-${d}`;
}
export function hijriLabel(dayEntry) {
  const h = dayEntry?.hijri;
  if (!h) return "";
  return `${h.day} ${h.month.en} ${h.year} AH`;
}
