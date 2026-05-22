// src/lib/siratWidget.js
// ─────────────────────────────────────────────────────────────────────────────
// Bridge to the iOS Home Screen widget. No-ops on web/Android.
// ─────────────────────────────────────────────────────────────────────────────

import { registerPlugin, Capacitor } from "@capacitor/core";

const SiratWidget = registerPlugin("SiratWidget");

const isNativeIOS = Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

function toISO(t) {
  if (!t) return null;
  if (t instanceof Date) return t.toISOString();
  if (typeof t === "string") return t;
  if (typeof t === "number") return new Date(t).toISOString();
  return null;
}

/**
 * Push today's prayer times into the App Group so the Home Screen widget reads them.
 *
 * @param times    object with Date or ISO strings: { fajr, sunrise, dhuhr, asr, maghrib, isha }
 * @param location optional human-readable location string for display
 */
export async function pushPrayerTimesToWidget(times = {}, location = "") {
  if (!isNativeIOS) return { ok: false, reason: "not-native-ios" };
  try {
    await SiratWidget.setPrayerTimes({
      fajr:    toISO(times.fajr),
      sunrise: toISO(times.sunrise),
      dhuhr:   toISO(times.dhuhr),
      asr:     toISO(times.asr),
      maghrib: toISO(times.maghrib),
      isha:    toISO(times.isha),
      location,
    });
    return { ok: true };
  } catch (e) {
    console.warn("Widget bridge failed:", e?.message ?? e);
    return { ok: false, reason: e?.message ?? "unknown" };
  }
}

export async function reloadWidget() {
  if (!isNativeIOS) return;
  try { await SiratWidget.reload(); } catch {}
}
