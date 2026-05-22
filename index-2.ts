// supabase/functions/schedule-prayers/index.ts
//
// Daily scheduler — computes prayer times per user and queues notifications.
//
// For each row in user_prayer_prefs:
//   1. Determine the user's local "today" and "tomorrow" (their timezone)
//   2. Run adhan with their lat/lng + calculation method for each date
//   3. Insert rows into scheduled_notifications for every enabled prayer
//      (plus Tahajjud, computed as Fajr - tahajjud_minutes_before_fajr)
//
// Idempotent: the (user_id, prayer_name, prayer_date) unique constraint plus
// `ignoreDuplicates: true` means already-queued prayers are skipped, and rows
// that have already been sent are never overwritten.
//
// Past-time guard: never queues a prayer whose send_at is already in the past.
//
// Deploy:
//   supabase functions deploy schedule-prayers
//
// Run manually (testing):
//   curl -X POST 'https://lonvxszifdululavoemp.supabase.co/functions/v1/schedule-prayers' \
//     -H 'Authorization: Bearer <SERVICE_ROLE_KEY>'

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes,
} from "https://esm.sh/adhan@4.4.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UserPrefs {
  user_id: string;
  latitude: number;
  longitude: number;
  timezone: string;
  calculation_method: string;
  madhab: "shafi" | "hanafi";
  branch: "sunni" | "shia";
  fajr_enabled: boolean;
  dhuhr_enabled: boolean;
  asr_enabled: boolean;
  maghrib_enabled: boolean;
  isha_enabled: boolean;
  tahajjud_enabled: boolean;
  tahajjud_minutes_before_fajr: number;
  fajr_offset_minutes: number;
  dhuhr_offset_minutes: number;
  asr_offset_minutes: number;
  maghrib_offset_minutes: number;
  isha_offset_minutes: number;
}

interface ScheduledRow {
  user_id: string;
  prayer_name: string;
  prayer_date: string;   // YYYY-MM-DD (user's local date)
  send_at: string;       // ISO timestamp (UTC)
}

// ---------------------------------------------------------------------------
// adhan helpers
// ---------------------------------------------------------------------------
// Map our calculation_method strings -> adhan params builders.
// NOTE: adhan has no built-in "Jafari". Tehran is the closest preset (Shia
// scholars commonly accept it). If your client uses different angles, mirror
// them here so server times match what your app shows.
function buildParams(method: string, madhab: string) {
  const factory: Record<string, () => any> = {
    Jafari:             () => CalculationMethod.Tehran(),
    Tehran:             () => CalculationMethod.Tehran(),
    NorthAmerica:       () => CalculationMethod.NorthAmerica(),
    MuslimWorldLeague:  () => CalculationMethod.MuslimWorldLeague(),
    Egyptian:           () => CalculationMethod.Egyptian(),
    Karachi:            () => CalculationMethod.Karachi(),
    UmmAlQura:          () => CalculationMethod.UmmAlQura(),
    Dubai:              () => CalculationMethod.Dubai(),
    Qatar:              () => CalculationMethod.Qatar(),
    Kuwait:             () => CalculationMethod.Kuwait(),
    Singapore:          () => CalculationMethod.Singapore(),
    Turkey:             () => CalculationMethod.Turkey(),
    MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
  };
  const params = (factory[method] ?? factory.MuslimWorldLeague)();
  params.madhab = madhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
/** YYYY-MM-DD for the given instant in the given IANA timezone. */
function localDateYMD(at: Date, tz: string): string {
  // en-CA happens to format as YYYY-MM-DD reliably across runtimes.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/**
 * Construct a Date whose UTC year/month/day match the given calendar day.
 * adhan reads getFullYear/getMonth/getDate, which in Deno (UTC env) returns
 * UTC components — so a UTC-noon Date for "YYYY-MM-DD" makes adhan compute
 * prayer times for that calendar day at the user's coordinates.
 */
function dateForCalendarDay(ymd: string): Date {
  return new Date(`${ymd}T12:00:00Z`);
}

function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000);
}

// ---------------------------------------------------------------------------
// Per-user scheduling
// ---------------------------------------------------------------------------
function buildRowsForUser(user: UserPrefs, now: Date): ScheduledRow[] {
  const params = buildParams(user.calculation_method, user.madhab);
  const coords = new Coordinates(user.latitude, user.longitude);

  const today    = localDateYMD(now, user.timezone);
  const tomorrow = localDateYMD(addMinutes(now, 24 * 60), user.timezone);

  const rows: ScheduledRow[] = [];

  for (const date of [today, tomorrow]) {
    let times: any;
    try {
      times = new PrayerTimes(coords, dateForCalendarDay(date), params);
    } catch (e) {
      console.error(`[schedule] adhan failed user=${user.user_id} date=${date}:`, e);
      continue;
    }

    const obligatory: Array<[string, Date, boolean, number]> = [
      ["fajr",    times.fajr,    user.fajr_enabled,    user.fajr_offset_minutes],
      ["dhuhr",   times.dhuhr,   user.dhuhr_enabled,   user.dhuhr_offset_minutes],
      ["asr",     times.asr,     user.asr_enabled,     user.asr_offset_minutes],
      ["maghrib", times.maghrib, user.maghrib_enabled, user.maghrib_offset_minutes],
      ["isha",    times.isha,    user.isha_enabled,    user.isha_offset_minutes],
    ];

    for (const [name, t, enabled, offset] of obligatory) {
      if (!enabled) continue;
      const sendAt = addMinutes(t, offset);
      if (sendAt.getTime() <= now.getTime()) continue;       // skip already-past
      rows.push({
        user_id: user.user_id,
        prayer_name: name,
        prayer_date: date,
        send_at: sendAt.toISOString(),
      });
    }

    // Tahajjud — fires `tahajjud_minutes_before_fajr` before Fajr.
    if (user.tahajjud_enabled) {
      const sendAt = addMinutes(times.fajr, -user.tahajjud_minutes_before_fajr);
      if (sendAt.getTime() > now.getTime()) {
        rows.push({
          user_id: user.user_id,
          prayer_name: "tahajjud",
          prayer_date: date,
          send_at: sendAt.toISOString(),
        });
      }
    }
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (_req) => {
  const startedAt = Date.now();
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  // Pull every user with a prefs row. For larger scales, paginate / shard.
  const { data: users, error } = await supabase
    .from("user_prayer_prefs")
    .select("*");

  if (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const now = new Date();
  const summary = {
    users_processed: 0,
    users_skipped: 0,
    rows_attempted: 0,
    errors: [] as Array<{ user_id: string; message: string }>,
  };

  for (const u of (users ?? []) as UserPrefs[]) {
    summary.users_processed++;
    const rows = buildRowsForUser(u, now);
    if (rows.length === 0) { summary.users_skipped++; continue; }

    summary.rows_attempted += rows.length;

    const { error: upsertErr } = await supabase
      .from("scheduled_notifications")
      .upsert(rows, {
        onConflict: "user_id,prayer_name,prayer_date",
        ignoreDuplicates: true,
      });

    if (upsertErr) {
      console.error(`[schedule] upsert failed user=${u.user_id}:`, upsertErr.message);
      summary.errors.push({ user_id: u.user_id, message: upsertErr.message });
      continue;
    }

    // Track the latest local date we've scheduled up to (informational).
    const latest = localDateYMD(addMinutes(now, 24 * 60), u.timezone);
    await supabase
      .from("user_prayer_prefs")
      .update({ last_scheduled_for: latest })
      .eq("user_id", u.user_id);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      duration_ms: Date.now() - startedAt,
      ...summary,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
