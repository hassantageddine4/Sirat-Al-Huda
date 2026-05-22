// src/services/permissionsService.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralized permission handling.
//
// Design principle: this module ONLY talks to native APIs. The pre-prompt
// "explainer" screens live in /components/legal/PermissionExplainer.jsx so
// the UX flow looks like:
//
//     1. User taps a feature that needs a permission
//     2. App shows a brief in-app explainer (optional, only when helpful)
//     3. App calls requestX() → triggers the *native* iOS popup
//     4. Result returned; if denied, fall back to instructions
//
// Apple's HIG strictly forbids showing your own popup that imitates the
// system one. The explainer is a screen/sheet, not a popup, and it always
// leads to the real native prompt.
//
// Required plugins (install with `npm install`):
//   @capacitor/geolocation
//   @capacitor/push-notifications
//   @capacitor/local-notifications
//   @capacitor-community/speech-recognition
//   @capacitor-community/voice-recorder      (or a microphone plugin you trust)
//
// All Info.plist usage description strings are documented in INFO_PLIST_USAGE.md
// alongside this bundle.
// ─────────────────────────────────────────────────────────────────────────────

import { Capacitor } from "@capacitor/core";

// Lazy-import each plugin so a missing plugin doesn't crash the whole module.
// On web, every native plugin returns "unsupported" — caller decides what to do.
async function lazyImport(path) {
  try { return await import(/* @vite-ignore */ path); }
  catch { return null; }
}

const PLATFORM_IS_NATIVE = Capacitor.isNativePlatform?.() ?? false;

// Standardized permission state. All requestX() functions resolve to one of:
//   "granted"   — go ahead, use the feature
//   "denied"    — user said no; show instructions to enable in Settings
//   "prompt"    — never asked yet, you can prompt
//   "unsupported" — not running on a platform that supports this
const STATES = Object.freeze({
  granted:     "granted",
  denied:      "denied",
  prompt:      "prompt",
  unsupported: "unsupported",
});

// ─── Location ───────────────────────────────────────────────────────────────
export async function getLocationPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/geolocation");
  if (!mod?.Geolocation) return STATES.unsupported;
  try {
    const { location } = await mod.Geolocation.checkPermissions();
    return mapWebPermissionState(location);
  } catch { return STATES.prompt; }
}

export async function requestLocationPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/geolocation");
  if (!mod?.Geolocation) return STATES.unsupported;
  try {
    const { location } = await mod.Geolocation.requestPermissions();
    return mapWebPermissionState(location);
  } catch { return STATES.denied; }
}

// ─── Notifications (push or local) ─────────────────────────────────────────
// We use local notifications for prayer reminders. If you also use push,
// register the push plugin similarly.
export async function getNotificationPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/local-notifications");
  if (!mod?.LocalNotifications) return STATES.unsupported;
  try {
    const { display } = await mod.LocalNotifications.checkPermissions();
    return mapNotificationState(display);
  } catch { return STATES.prompt; }
}

export async function requestNotificationPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/local-notifications");
  if (!mod?.LocalNotifications) return STATES.unsupported;
  try {
    const { display } = await mod.LocalNotifications.requestPermissions();
    return mapNotificationState(display);
  } catch { return STATES.denied; }
}

// ─── Microphone ─────────────────────────────────────────────────────────────
// We piggyback on the speech-recognition plugin's permission, since the
// recitation feature needs both. If you also need pure-audio recording,
// add @capacitor-community/voice-recorder calls here.
export async function getMicrophonePermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor-community/speech-recognition");
  if (!mod?.SpeechRecognition) return STATES.unsupported;
  try {
    // The plugin's checkPermissions returns { permission: "granted" | ... }
    const result = await mod.SpeechRecognition.checkPermissions();
    return mapPluginState(result?.permission);
  } catch { return STATES.prompt; }
}

export async function requestMicrophonePermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor-community/speech-recognition");
  if (!mod?.SpeechRecognition) return STATES.unsupported;
  try {
    const result = await mod.SpeechRecognition.requestPermissions();
    return mapPluginState(result?.permission);
  } catch { return STATES.denied; }
}

// Speech recognition is a *separate* iOS permission from microphone.
// On iOS you must request both for the recitation feature.
// The community plugin's requestPermissions() asks for both in one prompt
// pair, which is the simplest path; we expose it under both names so call
// sites can reason about each independently.
export const getSpeechRecognitionPermission = getMicrophonePermission;
export const requestSpeechRecognitionPermission = requestMicrophonePermission;

// ─── Camera / Photos (currently unused, scaffold for future) ───────────────
export async function getCameraPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/camera");
  if (!mod?.Camera) return STATES.unsupported;
  try {
    const { camera } = await mod.Camera.checkPermissions();
    return mapPluginState(camera);
  } catch { return STATES.prompt; }
}
export async function requestCameraPermission() {
  if (!PLATFORM_IS_NATIVE) return STATES.unsupported;
  const mod = await lazyImport("@capacitor/camera");
  if (!mod?.Camera) return STATES.unsupported;
  try {
    const { camera } = await mod.Camera.requestPermissions();
    return mapPluginState(camera);
  } catch { return STATES.denied; }
}

// ─── State mappers ──────────────────────────────────────────────────────────
// Capacitor's PermissionState is a stable enum: 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale'
function mapWebPermissionState(s) {
  if (s === "granted") return STATES.granted;
  if (s === "denied")  return STATES.denied;
  return STATES.prompt;
}
function mapNotificationState(s) {
  // LocalNotifications uses 'granted' | 'denied' | 'prompt'
  if (s === "granted") return STATES.granted;
  if (s === "denied")  return STATES.denied;
  return STATES.prompt;
}
function mapPluginState(s) {
  if (s === "granted") return STATES.granted;
  if (s === "denied")  return STATES.denied;
  return STATES.prompt;
}

// ─── Open iOS Settings (deep link) ──────────────────────────────────────────
// When permission is denied, we can't re-prompt — iOS only allows the popup
// once. The fallback is to deep-link to the app's Settings page.
export async function openAppSettings() {
  if (!PLATFORM_IS_NATIVE) return false;
  const mod = await lazyImport("@capacitor/app");
  // @capacitor/app exposes openUrl on iOS for app-settings: schemes
  try {
    if (mod?.App?.openUrl) {
      await mod.App.openUrl({ url: "app-settings:" });
      return true;
    }
  } catch {}
  // Fallback: try Browser plugin to open iOS URL scheme
  const browser = await lazyImport("@capacitor/browser");
  try {
    if (browser?.Browser?.open) {
      await browser.Browser.open({ url: "app-settings:" });
      return true;
    }
  } catch {}
  return false;
}

// ─── External link helper (for ToS / Privacy / Apple EULA) ─────────────────
// Opens in the system browser (Safari on iOS) so legal links open natively.
export async function openExternal(url) {
  if (!PLATFORM_IS_NATIVE) {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return;
  }
  const mod = await lazyImport("@capacitor/browser");
  if (mod?.Browser?.open) {
    await mod.Browser.open({ url, presentationStyle: "popover" });
  } else if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener");
  }
}

export { STATES as PermissionState };
