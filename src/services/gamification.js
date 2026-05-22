// src/services/gamification.js
// ─────────────────────────────────────────────────────────────────────────────
// XP level curve + achievement unlocking.
// Pure functions — they read from recitationProgress and don't mutate state.
// ─────────────────────────────────────────────────────────────────────────────

import { getOverallStats, getSurahProgress } from "./recitationProgress";

// ── Level bands ──────────────────────────────────────────────────────────────

const LEVELS = [
  { id: "beginner",   name: "Beginner",    minXp:    0, color: "#7A8A7E" },
  { id: "learner",    name: "Learner",     minXp:  100, color: "#3B82F6" },
  { id: "consistent", name: "Consistent",  minXp:  500, color: "#22C55E" },
  { id: "devoted",    name: "Devoted",     minXp: 1500, color: "#C8A951" },
  { id: "advanced",   name: "Advanced",    minXp: 3500, color: "#A855F7" },
  { id: "hafidh",     name: "Ḥāfiẓ",       minXp: 7500, color: "#EF4444" },
];

/**
 * Compute current level + progress toward the next.
 */
export function getLevel(totalXp) {
  let current = LEVELS[0];
  let next    = LEVELS[1] ?? null;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].minXp) {
      current = LEVELS[i];
      next    = LEVELS[i + 1] ?? null;
      break;
    }
  }

  const xpIntoLevel   = totalXp - current.minXp;
  const xpToNext      = next ? next.minXp - current.minXp : 0;
  const progressToNext = next ? xpIntoLevel / xpToNext : 1;

  return {
    current,
    next,
    xpIntoLevel,
    xpToNext,
    progressToNext: Math.min(1, Math.max(0, progressToNext)),
  };
}

// ── Achievements ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  {
    id:          "first-ayah",
    title:       "First Step",
    description: "Complete your first ayah",
    icon:        "",
    check: (s) => s.totalCompletedAyahs >= 1,
  },
  {
    id:          "first-surah",
    title:       "First Surah",
    description: "Complete an entire surah",
    icon:        "",
    check: (s) => s.completedSurahs >= 1,
  },
  {
    id:          "streak-3",
    title:       "Three in a Row",
    description: "Practice 3 days in a row",
    icon:        "",
    check: (s) => s.streak >= 3,
  },
  {
    id:          "streak-7",
    title:       "One Week Strong",
    description: "7-day practice streak",
    icon:        "",
    check: (s) => s.streak >= 7,
  },
  {
    id:          "streak-30",
    title:       "Consistent Reciter",
    description: "30-day practice streak",
    icon:        "",
    check: (s) => s.streak >= 30,
  },
  {
    id:          "ten-ayahs",
    title:       "Ten Verses",
    description: "Complete 10 ayahs across any surahs",
    icon:        "",
    check: (s) => s.totalCompletedAyahs >= 10,
  },
  {
    id:          "fifty-ayahs",
    title:       "Fifty Verses",
    description: "Complete 50 ayahs",
    icon:        "",
    check: (s) => s.totalCompletedAyahs >= 50,
  },
  {
    id:          "xp-500",
    title:       "500 XP",
    description: "Earn 500 XP through practice",
    icon:        "",
    check: (s) => s.totalXp >= 500,
  },
  {
    id:          "xp-2000",
    title:       "2,000 XP",
    description: "Earn 2,000 XP through practice",
    icon:        "",
    check: (s) => s.totalXp >= 2000,
  },
];

/**
 * Returns the list of achievements annotated with `unlocked: boolean`.
 * `completedSurahs` is computed here rather than stored so the answer is
 * always consistent with the progress store.
 */
export function getAchievements(surahIdsCatalog = []) {
  const stats = getOverallStats();

  // Count fully-completed surahs using the catalogue's total verse counts
  let completedSurahs = 0;
  for (const { id, versesCount } of surahIdsCatalog) {
    const p = getSurahProgress(id);
    if (p.totalAyahs && p.completedAyahs.length >= versesCount) {
      completedSurahs += 1;
    }
  }

  const ctx = { ...stats, completedSurahs };

  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: a.check(ctx),
  }));
}

/**
 * Compare two achievement snapshots and return the ones that just unlocked.
 * Used to show a "New achievement!" toast after a successful attempt.
 */
export function diffAchievements(before, after) {
  const beforeIds = new Set(before.filter(a => a.unlocked).map(a => a.id));
  return after.filter(a => a.unlocked && !beforeIds.has(a.id));
}
