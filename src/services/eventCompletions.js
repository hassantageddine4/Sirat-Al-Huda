// src/services/eventCompletions.js
// ─────────────────────────────────────────────────────────────────────────────
// Tracks completion state for Islamic Calendar event recommendations.
//
// State is keyed by `eventId:gregorianDate` so completions persist for the
// specific day the event falls on. Next year's occurrence of the same event
// will be on a different Gregorian date and starts fresh — this gives us
// automatic yearly reset for yearly events and weekly reset for Friday.
//
// localStorage shape:
//   {
//     "arafah:2026-05-26": { fast: true, dua-husayn: true, tahlil: false, ... },
//     "friday:2026-05-15": { ghusl: true, surah-kahf: true, ... },
//     "ashura:2026-07-22": { ... },
//   }
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sirat_event_completions";

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded); silently ignore.
  }
}

function makeKey(eventId, dateKey) {
  return `${eventId}:${dateKey}`;
}

/**
 * Build a stable Gregorian date key from a `g` object with year, month, day.
 * Format: "YYYY-MM-DD" (zero-padded).
 */
export function gregorianDateKey(g) {
  const m = String(g.month).padStart(2, "0");
  const d = String(g.day).padStart(2, "0");
  return `${g.year}-${m}-${d}`;
}

/**
 * Return the completion map for an event on a given date.
 * Empty object if nothing's been checked yet.
 */
export function getEventCompletions(eventId, dateKey) {
  if (!eventId) return {};
  const all = loadAll();
  return all[makeKey(eventId, dateKey)] || {};
}

/**
 * Toggle a single practice for an event on a given date.
 * Returns the updated completion map for that event.
 */
export function toggleCompletion(eventId, dateKey, practiceId) {
  if (!eventId || !practiceId) return {};
  const all = loadAll();
  const key = makeKey(eventId, dateKey);
  const state = { ...(all[key] || {}) };
  state[practiceId] = !state[practiceId];
  all[key] = state;
  saveAll(all);
  return state;
}

/**
 * Clear all completions for an event on a given date.
 */
export function clearEvent(eventId, dateKey) {
  if (!eventId) return;
  const all = loadAll();
  delete all[makeKey(eventId, dateKey)];
  saveAll(all);
}

/**
 * Optional housekeeping — remove completion entries older than N days.
 * Safe to call periodically. Default: keep last 400 days (~13 months).
 */
export function pruneOldCompletions(maxAgeDays = 400) {
  const all = loadAll();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);
  const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
  let changed = false;
  for (const compositeKey of Object.keys(all)) {
    const dateKey = compositeKey.split(":")[1];
    if (dateKey && dateKey < cutoffKey) {
      delete all[compositeKey];
      changed = true;
    }
  }
  if (changed) saveAll(all);
}
