import { Capacitor } from "@capacitor/core";
import {
  ensurePushPermission,
  registerForPush,
  upsertPushToken,
} from "./pushRegistration";
import { ensurePrayerPrefs } from "./prayerPrefsSync";

let initializedFor = null;        // userId we're currently bootstrapped for
let lastTokenForUser = null;      // dedupe rapid re-registrations

/**
 * Bootstrap server-side push for the current user.
 *   - ensures user_prayer_prefs row exists (seeded from local location/branch)
 *   - requests push permission if not yet granted
 *   - registers with APNs and upserts the device token
 *
 * Idempotent per (userId). Safe to call from a useEffect deps array.
 *
 * @param {{ userId: string, location: {latitude:number,longitude:number}, branch: 'sunni'|'shia' }} args
 */
export async function initServerPush({ userId, location, branch }) {
  if (!userId) return;
  if (!Capacitor.isNativePlatform()) return;
  if (initializedFor === userId) return;

  initializedFor = userId;

  // 1) Make sure the user has a prefs row (seeds from local state on first run)
  if (location?.latitude != null && location?.longitude != null) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    await ensurePrayerPrefs(userId, {
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: tz,
      branch,
    });
  }

  // 2) Permission
  const granted = await ensurePushPermission();
  if (!granted) {
    console.info("[push] permission not granted — skipping registration");
    return;
  }

  // 3) Register + upsert token on every refresh
  await registerForPush({
    onToken: async (deviceToken) => {
      if (deviceToken === lastTokenForUser) return;
      lastTokenForUser = deviceToken;
      await upsertPushToken(userId, deviceToken);
    },
    onError: (e) => console.warn("[push] APNs registration error:", e),
  });
}

/** Call on sign-out so a subsequent sign-in re-bootstraps cleanly. */
export function resetServerPushInit() {
  initializedFor = null;
  lastTokenForUser = null;
}
