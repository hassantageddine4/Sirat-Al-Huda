// src/services/recitationProgress.js
// ─────────────────────────────────────────────────────────────────────────────
// Local-first recitation progress tracker.
//
// Data model is intentionally backend-ready: every record is keyed by
// surahId + ayahNumber so it can be synced to Supabase later with a simple
// upsert on those two columns.
//
// Exposed API:
//   recordAttempt({ surahId, ayahNumber, accuracy, totalAyahs })
//   getSurahProgress(surahId)
//   getAyahHistory(surahId, ayahNumber)
//   getOverallStats()
//   getDailyStreak()
//   resetAllProgress()
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sirat_recitation_progress_v1";
const ACCURACY_HISTORY_CAP = 30;   // keep last 30 attempts per ayah

// ── Internal store shape ─────────────────────────────────────────────────────
//
// {
//   surahs: {
//     [surahId]: {
//       totalAyahs:     number,
//       completedAyahs: number[],
//       lastPracticed:  ISO string,
//       ayahs: {
//         [ayahNumber]: {
//           attempts:        number,
//           bestAccuracy:    0..1,
//           lastAccuracy:    0..1,
//           lastAttempt:     ISO string,
//           accuracyHistory: Array<{date:ISO, accuracy:number}>,
//         }
//       }
//     }
//   },
//   totalXp:       number,
//   totalAttempts: number,
//   activityDays:  string[]   // ISO YYYY-MM-DD, unique sorted
// }

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch { /* quota exceeded — silent */ }
}

function emptyStore() {
  return {
    surahs:        {},
    totalXp:       0,
    totalAttempts: 0,
    activityDays:  [],
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// RECORD ATTEMPT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Records a practice attempt and returns a summary of what changed.
 *
 * @param {object} opts
 * @param {number} opts.surahId
 * @param {number} opts.ayahNumber
 * @param {number} opts.accuracy      0..1
 * @param {number} opts.totalAyahs    so we can calculate surah completion
 * @returns {{
 *   xpEarned:          number,
 *   ayahNewlyCompleted: boolean,
 *   surahNewlyCompleted: boolean,
 *   surahProgress:     number,     // 0..1
 *   streak:            number,
 *   totalXp:           number,
 * }}
 */
export function recordAttempt({ surahId, ayahNumber, accuracy, totalAyahs }) {
  const store = readStore();
  const now   = new Date().toISOString();
  const day   = today();

  // Ensure surah entry
  if (!store.surahs[surahId]) {
    store.surahs[surahId] = {
      totalAyahs,
      completedAyahs: [],
      lastPracticed:  now,
      ayahs:          {},
    };
  }
  const surahEntry = store.surahs[surahId];
  surahEntry.lastPracticed = now;
  surahEntry.totalAyahs    = totalAyahs;

  // Ensure ayah entry
  if (!surahEntry.ayahs[ayahNumber]) {
    surahEntry.ayahs[ayahNumber] = {
      attempts:        0,
      bestAccuracy:    0,
      lastAccuracy:    0,
      lastAttempt:     now,
      accuracyHistory: [],
    };
  }
  const ayahEntry = surahEntry.ayahs[ayahNumber];
  ayahEntry.attempts    += 1;
  ayahEntry.lastAccuracy = accuracy;
  ayahEntry.lastAttempt  = now;
  ayahEntry.bestAccuracy = Math.max(ayahEntry.bestAccuracy, accuracy);

  ayahEntry.accuracyHistory.push({ date: now, accuracy });
  if (ayahEntry.accuracyHistory.length > ACCURACY_HISTORY_CAP) {
    ayahEntry.accuracyHistory.shift();
  }

  // Completion tracking (≥85 % counts as completed)
  const wasCompleted = surahEntry.completedAyahs.includes(ayahNumber);
  const isPassing    = accuracy >= 0.85;
  let ayahNewlyCompleted = false;

  if (isPassing && !wasCompleted) {
    surahEntry.completedAyahs.push(ayahNumber);
    ayahNewlyCompleted = true;
  }

  // Activity day for streak
  if (!store.activityDays.includes(day)) {
    store.activityDays.push(day);
    store.activityDays.sort();
  }

  // XP
  const xpEarned = calculateXp(accuracy, ayahNewlyCompleted);
  store.totalXp       += xpEarned;
  store.totalAttempts += 1;

  // Surah completion
  const surahProgress = surahEntry.completedAyahs.length / totalAyahs;
  const surahNewlyCompleted =
    ayahNewlyCompleted && surahEntry.completedAyahs.length === totalAyahs;

  writeStore(store);

  return {
    xpEarned,
    ayahNewlyCompleted,
    surahNewlyCompleted,
    surahProgress,
    streak:  computeStreak(store.activityDays),
    totalXp: store.totalXp,
  };
}

// ── XP calculation ───────────────────────────────────────────────────────────
function calculateXp(accuracy, newlyCompleted) {
  let xp = 5;                            // base per attempt
  if (accuracy >= 0.65) xp += 5;
  if (accuracy >= 0.85) xp += 10;        // passing threshold
  if (accuracy >= 0.95) xp += 10;        // excellence bonus
  if (newlyCompleted)   xp += 15;        // first-time completion
  return xp;
}

// ─────────────────────────────────────────────────────────────────────────────
// READ APIs
// ─────────────────────────────────────────────────────────────────────────────

export function getSurahProgress(surahId) {
  const store  = readStore();
  const surah  = store.surahs[surahId];
  if (!surah) return { completedAyahs: [], totalAyahs: 0, progress: 0, lastPracticed: null };

  return {
    completedAyahs: [...surah.completedAyahs].sort((a, b) => a - b),
    totalAyahs:     surah.totalAyahs,
    progress:       surah.totalAyahs ? surah.completedAyahs.length / surah.totalAyahs : 0,
    lastPracticed:  surah.lastPracticed,
  };
}

export function getAyahHistory(surahId, ayahNumber) {
  const ayah = readStore().surahs[surahId]?.ayahs?.[ayahNumber];
  return ayah ?? null;
}

export function getOverallStats() {
  const store = readStore();
  const surahIds = Object.keys(store.surahs);

  let totalCompletedAyahs = 0;
  let totalAyahsAttempted = 0;

  for (const id of surahIds) {
    const s = store.surahs[id];
    totalCompletedAyahs += s.completedAyahs.length;
    totalAyahsAttempted += Object.keys(s.ayahs).length;
  }

  return {
    totalXp:              store.totalXp,
    totalAttempts:        store.totalAttempts,
    surahsStarted:        surahIds.length,
    totalCompletedAyahs,
    totalAyahsAttempted,
    streak:               computeStreak(store.activityDays),
    activityDays:         store.activityDays,
  };
}

export function getDailyStreak() {
  return computeStreak(readStore().activityDays);
}

// Streak = consecutive days ending on today (or yesterday if user hasn't
// practiced today yet — streak doesn't reset until a full day is missed).
function computeStreak(days) {
  if (!days.length) return 0;
  const set = new Set(days);
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  // If they haven't practiced today, start counting from yesterday
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function resetAllProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
