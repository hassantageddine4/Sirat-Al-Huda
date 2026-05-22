import { supabase } from "../../lib/supabase";

/** Per-branch default calculation method (matches adhan-lib names). */
const METHOD_BY_BRANCH = {
  shia: "Jafari",
  sunni: "NorthAmerica",
};

const DEFAULTS = {
  madhab: "shafi",
  fajr_enabled: true,
  dhuhr_enabled: true,
  asr_enabled: true,
  maghrib_enabled: true,
  isha_enabled: true,
  tahajjud_enabled: false,
  tahajjud_minutes_before_fajr: 60,
  fajr_offset_minutes: 0,
  dhuhr_offset_minutes: 0,
  asr_offset_minutes: 0,
  maghrib_offset_minutes: 0,
  isha_offset_minutes: 0,
};

export async function getPrayerPrefs(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_prayer_prefs")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[push] getPrayerPrefs failed:", error.message);
    return null;
  }
  return data;
}

export async function upsertPrayerPrefs(userId, patch) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_prayer_prefs")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) {
    console.warn("[push] upsertPrayerPrefs failed:", error.message);
    return null;
  }
  return data;
}

/**
 * Create a prefs row if one doesn't exist, seeded from local state.
 * No-op if a row already exists — never overwrites user choices.
 */
export async function ensurePrayerPrefs(userId, { latitude, longitude, timezone, branch }) {
  if (!userId || latitude == null || longitude == null || !timezone) return null;
  const existing = await getPrayerPrefs(userId);
  if (existing) return existing;

  const safeBranch = branch === "sunni" ? "sunni" : "shia";
  return upsertPrayerPrefs(userId, {
    latitude,
    longitude,
    timezone,
    branch: safeBranch,
    calculation_method: METHOD_BY_BRANCH[safeBranch],
    ...DEFAULTS,
  });
}
