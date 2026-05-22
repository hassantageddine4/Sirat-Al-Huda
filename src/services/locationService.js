// src/services/locationService.js
// ─────────────────────────────────────────────────────────────────────────────
// Capacitor Geolocation with graceful fallback to stored coords or
// IP-based geolocation. Handles all permission states.
// ─────────────────────────────────────────────────────────────────────────────

import { Geolocation } from "@capacitor/geolocation";

const LOC_KEY    = "sirat_location";
const LOC_TTL    = 60 * 60 * 1000;  // 1 hour — refresh GPS after this

export const LocationStatus = {
  GRANTED:         "granted",
  DENIED:          "denied",
  PROMPT:          "prompt",
  ERROR:           "error",
  CACHED:          "cached",
  IP_FALLBACK:     "ip_fallback",
};

// ── Saved location ────────────────────────────────────────────────────────────
export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    return loc;
  } catch { return null; }
}

export function saveLocation(loc) {
  try {
    localStorage.setItem(LOC_KEY, JSON.stringify({ ...loc, ts: Date.now() }));
  } catch {}
}

function isFresh(ts) {
  return ts && (Date.now() - ts) < LOC_TTL;
}

// ── IP-based fallback (free, no key) ─────────────────────────────────────────
async function ipGeolocation() {
  try {
    const res  = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error("ipapi failed");
    const json = await res.json();
    if (!json.latitude) throw new Error("No lat from ipapi");
    return {
      lat:     json.latitude,
      lon:     json.longitude,
      city:    json.city ?? "Unknown",
      country: json.country_name ?? "",
      source:  LocationStatus.IP_FALLBACK,
    };
  } catch {
    // Last resort: Mecca coordinates so prayer times always work
    return {
      lat:     21.3891,
      lon:     39.8579,
      city:    "Mecca (default)",
      country: "Saudi Arabia",
      source:  "default_mecca",
    };
  }
}

// ── Main: get best available location ────────────────────────────────────────
// Returns { lat, lon, city, country, source, status }
export async function getBestLocation({ forceRefresh = false } = {}) {
  // 1. Return cached if fresh and not forcing refresh
  const cached = getSavedLocation();
  if (!forceRefresh && cached && isFresh(cached.ts) && cached.source !== "default_mecca") {
    return { ...cached, status: LocationStatus.CACHED };
  }

  // 2. Try Capacitor GPS
  try {
    const perms = await Geolocation.checkPermissions();

    if (perms.location === "denied") {
      // Fall through to IP fallback but remember denial
      throw new Error("denied");
    }

    if (perms.location === "prompt" || perms.location === "prompt-with-rationale") {
      await Geolocation.requestPermissions();
      const afterReq = await Geolocation.checkPermissions();
      if (afterReq.location === "denied") throw new Error("denied");
    }

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 8000,
    });

    const loc = {
      lat:    pos.coords.latitude,
      lon:    pos.coords.longitude,
      city:   "",        // enriched below if possible
      country:"",
      source: LocationStatus.GRANTED,
    };

    // Reverse geocode via Nominatim (free, no key)
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lon}&format=json`,
        { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(5000) }
      );
      if (geoRes.ok) {
        const geo  = await geoRes.json();
        loc.city    = geo.address?.city ?? geo.address?.town ?? geo.address?.village ?? "";
        loc.country = geo.address?.country ?? "";
      }
    } catch { /* city not critical */ }

    saveLocation(loc);
    return { ...loc, status: LocationStatus.GRANTED };

  } catch (err) {
    const isDenied = err.message === "denied";

    // 3. IP fallback
    const ipLoc = await ipGeolocation();
    if (!isDenied) saveLocation(ipLoc); // don't cache if user denied, try GPS again later
    return { ...ipLoc, status: isDenied ? LocationStatus.DENIED : LocationStatus.IP_FALLBACK };
  }
}

// ── Request permissions explicitly (for settings screen) ──────────────────────
export async function requestLocationPermission() {
  try {
    const result = await Geolocation.requestPermissions();
    return result.location; // "granted" | "denied" | "prompt"
  } catch {
    return "error";
  }
}

// ── Check current permission status ──────────────────────────────────────────
export async function checkLocationPermission() {
  try {
    const result = await Geolocation.checkPermissions();
    return result.location;
  } catch {
    return "error";
  }
}
