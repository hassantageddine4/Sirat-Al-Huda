// src/lib/siratWidget.js
// JS bridge to the iOS widget plugin (SiratWidgetPlugin.swift).
// No-ops on web and Android.

import { Capacitor, registerPlugin } from '@capacitor/core';

const SiratWidget = registerPlugin('SiratWidget');

function isIOS() {
  return Capacitor.getPlatform() === 'ios';
}

/**
 * Push location + calculation config to the widget. The widget will compute
 * today's prayer times locally via AdhanSwift.
 *
 * @param {Object} cfg
 * @param {number} cfg.lat
 * @param {number} cfg.lon
 * @param {string} [cfg.method]       e.g. "ISNA", "MWL", "NorthAmerica"
 * @param {number} [cfg.methodCode]   Aladhan numeric code (0-15) — used as fallback
 * @param {string} [cfg.madhab]       "Shafi" | "Hanafi"
 * @param {string} [cfg.branch]       "sunni" | "shia"
 * @param {string} [cfg.locationName] Display name e.g. "Detroit, MI"
 * @param {string} [cfg.theme]        Theme key (emerald, sapphire, …)
 */
export async function pushWidgetConfig(cfg) {
  if (!isIOS()) return;
  try {
    const payload = {};
    if (typeof cfg.lat === 'number' && Number.isFinite(cfg.lat)) payload.lat = cfg.lat;
    if (typeof cfg.lon === 'number' && Number.isFinite(cfg.lon)) payload.lon = cfg.lon;
    if (cfg.method != null) payload.method = String(cfg.method);
    if (cfg.methodCode != null && Number.isFinite(Number(cfg.methodCode))) {
      payload.methodCode = Number(cfg.methodCode);
    }
    if (cfg.madhab != null) payload.madhab = String(cfg.madhab);
    if (cfg.branch != null) payload.branch = String(cfg.branch);
    if (cfg.locationName != null) payload.locationName = String(cfg.locationName);
    if (cfg.theme != null) payload.theme = String(cfg.theme);
    await SiratWidget.setConfig(payload);
  } catch (e) {
    console.warn('[siratWidget] setConfig failed', e);
  }
}

/**
 * Push only the theme key to the widget (faster than full config).
 * @param {string} theme  one of: emerald, sapphire, royal, crimson, gold,
 *                        midnight, silver, teal, sandstone
 */
export async function pushWidgetTheme(theme) {
  if (!isIOS()) return;
  try {
    await SiratWidget.setTheme({ theme: String(theme) });
  } catch (e) {
    console.warn('[siratWidget] setTheme failed', e);
  }
}

/**
 * Legacy: previously pushed daily prayer times. Now a no-op shim that just
 * forwards location and triggers a reload.
 */
export async function pushPrayerTimesToWidget(times, location) {
  if (!isIOS()) return;
  try {
    await SiratWidget.setPrayerTimes({ times: times || {}, location: location || '' });
  } catch (e) {
    console.warn('[siratWidget] setPrayerTimes failed', e);
  }
}

export async function reloadWidget() {
  if (!isIOS()) return;
  try {
    await SiratWidget.reload();
  } catch {
    /* ignore */
  }
}

export default {
  pushWidgetConfig,
  pushWidgetTheme,
  pushPrayerTimesToWidget,
  reloadWidget,
};
