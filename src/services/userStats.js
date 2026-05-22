// src/services/userStats.js
// ─────────────────────────────────────────────────────────────────────────────
// User-wide stats aggregator. Reads from existing services + tracks prayer
// completion history. localStorage-backed, no DB.
//
// Stats surfaced:
//   - totalPrayers       — count of prayers ever marked complete
//   - prayerStreak       — consecutive days with all 5 prayers completed
//   - daysActive         — unique days with any activity logged
//   - completedSurahs    — count from recitationProgress
//   - totalAyahs         — count from recitationProgress
//   - journalEntries     — fetched async from journalService
//   - dhikrCount         — taps from tasbih (if tracked) — defaults 0
// ─────────────────────────────────────────────────────────────────────────────

import { getOverallStats as getRecitationStats } from "./recitationProgress";

const HISTORY_KEY = "sirat:prayerHistory";

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

export function recordPrayerCompleted(prayerName) {
  const today = new Date().toDateString();
  const history = loadHistory();
  if (!history[today]) history[today] = [];
  if (!history[today].includes(prayerName)) {
    history[today].push(prayerName);
    saveHistory(history);
  }
}

export function recordPrayerUncompleted(prayerName) {
  const today = new Date().toDateString();
  const history = loadHistory();
  if (history[today]) {
    history[today] = history[today].filter(p => p !== prayerName);
    if (history[today].length === 0) delete history[today];
    saveHistory(history);
  }
}

function computeStreak(history) {
  const ALL = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toDateString();
    const day = history[key] || [];
    const allDone = ALL.every(p => day.includes(p));
    if (!allDone) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function totalPrayersFromHistory(history) {
  return Object.values(history).reduce((sum, arr) => sum + (arr?.length || 0), 0);
}

function daysActiveFromHistory(history) {
  return Object.keys(history).length;
}

export async function getOverallStats() {
  const history = loadHistory();
  const recitation = getRecitationStats();

  let journalEntries = 0;
  try {
    const { listEntries } = await import("./journalService");
    const result = await listEntries();
    journalEntries = Array.isArray(result?.data) ? result.data.length : 0;
  } catch {
    journalEntries = 0;
  }

  return {
    prayerStreak:    computeStreak(history),
    totalPrayers:    totalPrayersFromHistory(history),
    daysActive:      daysActiveFromHistory(history),
    completedSurahs: recitation?.completedSurahs ?? 0,
    totalAyahs:      recitation?.totalCompletedAyahs ?? 0,
    journalEntries,
  };
}

export function resetAllStats() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch { /* ignore */ }
}

export function getTodayPrayerCount() {
  const today = new Date().toDateString();
  const history = loadHistory();
  return (history[today] || []).length;
}
