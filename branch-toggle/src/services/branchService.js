// src/services/branchService.js
// ─────────────────────────────────────────────────────────────────────────────
// Branch-aware defaults: Sunni vs Shia.
//
// Each branch has a different set of "reasonable" calculation methods.
// For Sunni, we pick a regional default based on the user's lat/lon
// (e.g. North America → ISNA, Gulf → Makkah, South Asia → Karachi).
// For Shia, the answer is always "Jafari" (Ithna-Ansari), no region branching.
//
// The branch also influences which madhab options are shown:
//   Sunni → Hanafi / Shafi'i / Maliki / Hanbali (4 options)
//   Shia  → Ja'farī (1 option, locked)
// ─────────────────────────────────────────────────────────────────────────────

export const BRANCHES = {
  sunni: { id: "sunni", label: "Sunni" },
  shia:  { id: "shia",  label: "Shia"  },
};

// ─── Calculation method per branch ──────────────────────────────────────────

// Sunni-appropriate calculation methods (subset of the full 14-method list)
export const SUNNI_METHODS = [
  "ISNA",     // Islamic Society of North America
  "MWL",      // Muslim World League
  "Egypt",    // Egyptian General Authority
  "Makkah",   // Umm al-Qura, Makkah
  "Karachi",  // University of Islamic Sciences, Karachi
  "Gulf",     // Gulf Region
  "Kuwait",   // Kuwait
  "Qatar",    // Qatar
  "Singapore",// Majlis Ugama Islam Singapura
  "France",   // Union des organisations islamiques de France
  "Turkey",   // Diyanet
  "Russia",   // Spiritual Administration of Muslims of Russia
];

// Shia-appropriate calculation methods (only one — universal across Shia regions)
export const SHIA_METHODS = ["Jafari"];

export function getMethodsForBranch(branch) {
  if (branch === "shia") return SHIA_METHODS;
  return SUNNI_METHODS;
}

// ─── Madhab per branch ──────────────────────────────────────────────────────

export const SUNNI_MADHABS = ["Hanafi", "Shafi'i", "Maliki", "Hanbali"];
export const SHIA_MADHABS  = ["Ja'farī"];

export function getMadhabsForBranch(branch) {
  if (branch === "shia") return SHIA_MADHABS;
  return SUNNI_MADHABS;
}

// ─── Region-aware default calculation method ────────────────────────────────

// Rough country/region detection by lat/lon bounding boxes.
// Not a full geocoder — just enough to pick a sensible default.
function detectRegion(lat, lon) {
  if (lat == null || lon == null) return "unknown";

  // North America (USA, Canada, Mexico)
  if (lat >= 15 && lat <= 72 && lon >= -170 && lon <= -50) return "north_america";

  // Europe (continental + UK + Ireland)
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) return "europe";

  // Turkey (specific — uses Diyanet)
  if (lat >= 36 && lat <= 42 && lon >= 26 && lon <= 45) return "turkey";

  // Russia (large bbox)
  if (lat >= 41 && lat <= 82 && lon >= 19 && lon <= 180) return "russia";

  // Middle East / Gulf (Saudi, UAE, Bahrain, Qatar, Kuwait, Oman, Yemen, Iraq)
  if (lat >= 12 && lat <= 33 && lon >= 34 && lon <= 60) return "gulf";

  // Egypt + North Africa (Egypt, Libya, Tunisia, Algeria, Morocco)
  if (lat >= 19 && lat <= 38 && lon >= -18 && lon <= 36) return "egypt";

  // South Asia (Pakistan, India, Bangladesh, Afghanistan, Sri Lanka)
  if (lat >= 5 && lat <= 38 && lon >= 60 && lon <= 95) return "south_asia";

  // Southeast Asia (Indonesia, Malaysia, Singapore, Brunei, Philippines south)
  if (lat >= -11 && lat <= 8 && lon >= 95 && lon <= 142) return "southeast_asia";

  // Iran (Shia majority — Tehran method default for Shia in this region)
  if (lat >= 25 && lat <= 40 && lon >= 44 && lon <= 64) return "iran";

  return "unknown";
}

/**
 * Returns the default calculation method for a Sunni user based on their location.
 * For Shia users, returns "Jafari" regardless of location.
 *
 * @param {string} branch - "sunni" | "shia"
 * @param {Object} location - { lat, lon } | null
 * @returns {string} method key (e.g. "ISNA", "MWL", "Jafari")
 */
export function getDefaultMethod(branch, location) {
  if (branch === "shia") return "Jafari";

  const region = detectRegion(location?.lat, location?.lon);

  // Sunni regional defaults
  switch (region) {
    case "north_america":  return "ISNA";
    case "europe":         return "MWL";
    case "turkey":         return "Turkey";
    case "russia":         return "Russia";
    case "gulf":           return "Makkah";
    case "egypt":          return "Egypt";
    case "south_asia":     return "Karachi";
    case "southeast_asia": return "Singapore";
    case "iran":           return "Jafari"; // even Sunni in Iran often follow regional time tables
    case "unknown":        return "MWL";    // safest international default
    default:               return "MWL";
  }
}

/**
 * Returns the default madhab for a branch.
 * For Shia: always Ja'farī.
 * For Sunni: Hanafi (most common globally — user can override).
 *
 * @param {string} branch
 * @returns {string} madhab key
 */
export function getDefaultMadhab(branch) {
  if (branch === "shia") return "Ja'farī";
  return "Hanafi";
}

/**
 * Returns BOTH defaults at once, useful for setBranch action.
 */
export function getBranchDefaults(branch, location) {
  return {
    calcMethod: getDefaultMethod(branch, location),
    madhab:     getDefaultMadhab(branch),
  };
}

// ─── Validation: is this method/madhab valid for this branch? ──────────────

export function isMethodValidForBranch(branch, method) {
  return getMethodsForBranch(branch).includes(method);
}

export function isMadhabValidForBranch(branch, madhab) {
  return getMadhabsForBranch(branch).includes(madhab);
}
