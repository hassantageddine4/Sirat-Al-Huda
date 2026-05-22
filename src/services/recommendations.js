// src/services/recommendations.js
import { DUAS } from "../data/duas";

function getTimeWindow(prayerTimings) {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const parseTime = (str) => {
    if (!str) return null;
    const [hh, mm] = str.split(":").map(Number);
    return Number.isNaN(hh) ? null : hh * 60 + (mm || 0);
  };
  const FA = parseTime(prayerTimings?.Fajr)    ?? 5 * 60;
  const AS = parseTime(prayerTimings?.Asr)     ?? 15 * 60 + 30;
  const MA = parseTime(prayerTimings?.Maghrib) ?? 18 * 60;
  const IS = parseTime(prayerTimings?.Isha)    ?? 20 * 60;
  if (minutes < FA)      return "deepNight";
  if (minutes < FA + 90) return "afterFajr";
  if (minutes < AS)      return "daytime";
  if (minutes < MA)      return "lateAfternoon";
  if (minutes < IS + 60) return "earlyNight";
  return "deepNight";
}

const isFriday = () => new Date().getDay() === 5;

const RULES = [
  {
    name: "friday_morning",
    match: (ctx) => isFriday() && (ctx.window === "afterFajr" || ctx.window === "daytime"),
    pick: () => ({
      type: "surah",
      title: "Read Surah Al-Kahf",
      subtitle: "Recommended on Fridays",
      route: "/quran/18",
      icon: "bookOpen",
      reason: "Recommended to read Surah Al-Kahf on Friday.",
    }),
  },
  {
    name: "friday_lateAfternoon",
    match: (ctx) => isFriday() && ctx.window === "lateAfternoon",
    pick: () => ({
      type: "dhikr",
      title: "Send salawat upon the Prophet",
      subtitle: "Last hour of Friday",
      route: "/practice/duas",
      icon: "heart",
      reason: "The last hour before Maghrib on Friday is among the times dua is accepted.",
    }),
  },
  {
    name: "deepNight_sleep",
    match: (ctx) => ctx.window === "deepNight",
    pick: () => ({
      type: "surah",
      title: "Surah Al-Mulk",
      subtitle: "Recommended before sleep",
      route: "/quran/67",
      icon: "moon",
      reason: "Surah Al-Mulk is recommended before sleep.",
    }),
  },
];

RULES.push(
  {
    name: "afterFajr_morning",
    match: (ctx) => ctx.window === "afterFajr",
    pick: () => {
      const dua = DUAS.find(d => d.id === "me1") || DUAS.find(d => d.category === "morning");
      return dua ? {
        type: "dua",
        title: dua.title,
        subtitle: "Morning remembrance",
        route: "/practice/duas",
        icon: "sunrise",
        reason: "Morning adhkar protect the believer throughout the day.",
      } : null;
    },
  },
  {
    name: "daytime_dhikr",
    match: (ctx) => ctx.window === "daytime",
    pick: () => ({
      type: "dhikr",
      title: "Subhanallahi wa bihamdihi",
      subtitle: "Light on the tongue, heavy on the scale",
      route: "/practice",
      icon: "tasbih",
      reason: "Two phrases beloved to Ar-Rahman.",
    }),
  },
  {
    name: "lateAfternoon_evening",
    match: (ctx) => ctx.window === "lateAfternoon",
    pick: () => {
      const dua = DUAS.find(d => d.id === "me3") || DUAS.find(d => d.category === "morning");
      return dua ? {
        type: "dua",
        title: dua.title,
        subtitle: "Evening remembrance",
        route: "/practice/duas",
        icon: "sunset",
        reason: "Evening adhkar protect through the night.",
      } : null;
    },
  },
  {
    name: "earlyNight_sleep",
    match: (ctx) => ctx.window === "earlyNight",
    pick: () => ({
      type: "dua",
      title: "Before sleep",
      subtitle: "Last 3 surahs + Ayat al-Kursi",
      route: "/practice/duas",
      icon: "moon",
      reason: "Recite the last three surahs and Ayat al-Kursi before sleep for protection.",
    }),
  }
);

export function getRecommendation({ prayerTimings } = {}) {
  const window = getTimeWindow(prayerTimings);
  const ctx = { window };
  for (const rule of RULES) {
    if (rule.match(ctx)) {
      const rec = rule.pick();
      if (rec) return { ...rec, ruleName: rule.name, window };
    }
  }
  return null;
}
