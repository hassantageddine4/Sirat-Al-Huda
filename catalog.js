// src/data/prayerWalkthrough/catalog.js
// ─────────────────────────────────────────────────────────────────────────────
// Top-level catalog. Mirrors PrayerCatalog from PrayerData.swift.
//
// Usage:
//   import { PRAYER_CATALOG, prayerById } from "../data/prayerWalkthrough/catalog";
//   const fajr = prayerById("fajr");
//
// Note on tradition flags:
//   • salatAlLayl, jafarAtTayyar, wahshatAlQabr → tradition: "shia"
//     (appear only when user's branch is Shia)
//   • salatAlTasbih, salatAlAyat, laylatAlQadr → tradition: "both"
//     (visible to both Sunni and Shia users)
//   • The branch filter in PrayerList handles all of this.
// ─────────────────────────────────────────────────────────────────────────────

import { dailyFive }                  from "./dailyFive";
import { recommended as recCore }     from "./voluntary";
import { congregational }             from "./congregational";
import { occasional as occCore }      from "./occasional";
import { situational }                from "./situational";

// Shia-specific
import { salatAlLayl }                from "./salatAlLayl";
import { jafarAtTayyar }              from "./jafarAtTayyar";
import { wahshatAlQabr }              from "./wahshatAlQabr";

// Cross-tradition specialised
import { salatAlTasbih }              from "./salatAlTasbih";
import { salatAlAyat }                from "./salatAlAyat";
import { laylatAlQadr }               from "./laylatAlQadr";

// Augment categories with the new prayers
const recommended = [
  ...recCore,
  salatAlTasbih,
  salatAlLayl,
  jafarAtTayyar,
];

const occasional = [
  ...occCore,
  salatAlAyat,
  laylatAlQadr,
  wahshatAlQabr,
];

export const PRAYER_CATALOG = {
  dailyFive,
  congregational,
  recommended,
  occasional,
  situational,
  all: [...dailyFive, ...congregational, ...recommended, ...occasional, ...situational],
};

export function prayerById(id) {
  return PRAYER_CATALOG.all.find(p => p.id === id) ?? null;
}

// SF Symbol → Lucide-equivalent icon name mapping
export function iconForPrayer(prayerId) {
  switch (prayerId) {
    case "fajr":            return "sunrise";
    case "dhuhr":           return "sun";
    case "asr":             return "cloudSun";
    case "maghrib":         return "sunset";
    case "isha":            return "moonStars";
    case "witr":            return "moon";
    case "jumuah":          return "users";
    case "janazah":         return "leaf";
    case "eid":             return "star";
    case "tahajjud":        return "moon";
    case "duha":            return "sunrise";
    case "taraweeh":        return "moon";
    case "tawbah":          return "heart";
    case "istikhara":       return "help";
    case "travel":          return "plane";
    case "rawatib":         return "list";

    // Shia-specific specialised prayers
    case "salatAlLayl":     return "moonStars";
    case "jafarAtTayyar":   return "star";
    case "wahshatAlQabr":   return "heart";

    // Cross-tradition specialised prayers
    case "salatAlTasbih":   return "star";
    case "salatAlAyat":     return "cloudSun";
    case "laylatAlQadr":    return "moonStars";

    default:                return "moon";
  }
}
