import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
// Adjust this path if your supabase client lives elsewhere.
import { supabase } from "../../lib/supabase";

// Dev builds register against the sandbox APNs. App Store / TestFlight builds
// land on production APNs. Vite's PROD flag tracks `vite build` vs `vite dev`.
const PUSH_ENV = import.meta.env.PROD ? "production" : "sandbox";
const BUNDLE_ID = "com.tageddine.siratalhuda";

let listenersAttached = false;
const listenerHandles = [];

/**
 * Request push permission (Capacitor's prompt). Returns true if granted.
 * Safe to call repeatedly — checks current status first.
 */
export async function ensurePushPermission() {
  if (!Capacitor.isNativePlatform()) return false;
  let perms = await PushNotifications.checkPermissions();
  if (perms.receive === "prompt" || perms.receive === "prompt-with-rationale") {
    perms = await PushNotifications.requestPermissions();
  }
  return perms.receive === "granted";
}

/**
 * Attach token + error listeners (once), then call register().
 * The `registration` event fires asynchronously with the APNs device token.
 */
export async function registerForPush({ onToken, onError } = {}) {
  if (!Capacitor.isNativePlatform()) return;

  if (!listenersAttached) {
    const reg = await PushNotifications.addListener("registration", (t) => {
      try { onToken?.(t.value); } catch (e) { console.warn("[push] onToken threw:", e); }
    });
    const err = await PushNotifications.addListener("registrationError", (e) => {
      try { onError?.(e); } catch {}
    });
    listenerHandles.push(reg, err);
    listenersAttached = true;
  }

  await PushNotifications.register();
}

/**
 * Upsert the device token into user_push_tokens.
 * `device_token` is unique — same token on a new user_id updates ownership.
 */
export async function upsertPushToken(userId, deviceToken, opts = {}) {
  if (!userId || !deviceToken) return null;
  const { data, error } = await supabase
    .from("user_push_tokens")
    .upsert(
      {
        user_id: userId,
        device_token: deviceToken,
        platform: "ios",
        app_version: opts.appVersion ?? null,
        bundle_id: opts.bundleId ?? BUNDLE_ID,
        environment: opts.environment ?? PUSH_ENV,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "device_token" }
    )
    .select()
    .single();
  if (error) {
    console.warn("[push] upsertPushToken failed:", error.message);
    return null;
  }
  return data;
}

/** Call on sign-out so the user stops receiving prayer pushes on this device. */
export async function removePushToken(deviceToken) {
  if (!deviceToken) return;
  await supabase.from("user_push_tokens").delete().eq("device_token", deviceToken);
}

/** Detach listeners (test/cleanup). Not normally needed at runtime. */
export function cleanupPushListeners() {
  listenerHandles.forEach((h) => h?.remove?.());
  listenerHandles.length = 0;
  listenersAttached = false;
}
