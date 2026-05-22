// src/services/notificationService.js
// ─────────────────────────────────────────────────────────────────────────────
// Local notification service for Sirat Al Huda.
//
// Handles iOS local notifications via @capacitor/local-notifications:
//   - Permission request + status check
//   - Prayer time notifications (Fajr/Dhuhr/Asr/Maghrib/Isha) for 7 days ahead
//   - Daily Quran/dhikr/evening reminders
//   - Optional Tahajjud
//   - Cancellation by category
//   - Pending count + last-schedule tracking
//
// Notification IDs are namespaced by category to allow surgical cancellation:
//   Prayer:       1000-1999  (5 prayers × 7 days = 35 ids in 1000-1034)
//   Quran morning:    2000+
//   Dhikr:            3000+
//   Quran midday:     4000+
//   Quran afternoon:  5000+
//   Evening:          6000+
//   Tahajjud:         7000+
// ─────────────────────────────────────────────────────────────────────────────

import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { pickVerseForDay, getDailyDhikrCopy, getEveningCopy, getQuranReadCopy, getTahajjudCopy } from "./quranVerseBank";

// ─── Notification ID ranges (namespaced for clean cancellation) ─────────────
const ID_RANGE = {
  prayer:         1000,  // 1000 + dayOffset*5 + prayerIdx
  quranMorning:   2000,  // 2000 + dayOffset
  dhikr:          3000,
  quranMidday:    4000,
  quranAfternoon: 5000,
  evening:        6000,
  tahajjud:       7000,
};

// How many days ahead to schedule. iOS allows up to 64 pending notifications;
// 7 days × ~10 per day = 70, so we cap at 7 and trim Tahajjud if disabled.
const SCHEDULE_DAYS = 7;

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_NAMES_ARABIC = {
  Fajr:    "الفجر",
  Dhuhr:   "الظهر",
  Asr:     "العصر",
  Maghrib: "المغرب",
  Isha:    "العشاء",
};

const STORAGE_KEY_LAST_SCHEDULE = "sirat_notif_last_scheduled";

// ─── Capability check ───────────────────────────────────────────────────────
function isNative() {
  return Capacitor.isNativePlatform();
}

// ─── Permission flow ────────────────────────────────────────────────────────

/**
 * Triggers the iOS native permission prompt if the user hasn't decided yet.
 * If already granted/denied, returns the current state without prompting again.
 *
 * @returns {Promise<"granted"|"denied"|"prompt">}
 */
export async function requestNotificationPermission() {
  if (!isNative()) return "prompt";
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display ?? "prompt";
  } catch {
    return "prompt";
  }
}

/**
 * Checks current notification permission state without prompting.
 * @returns {Promise<"granted"|"denied"|"prompt">}
 */
export async function checkNotificationPermission() {
  if (!isNative()) return "prompt";
  try {
    const { display } = await LocalNotifications.checkPermissions();
    return display ?? "prompt";
  } catch {
    return "prompt";
  }
}

/**
 * Convenience: checks + requests if needed. Used at the start of scheduling.
 */
export async function ensurePermission() {
  const current = await checkNotificationPermission();
  if (current === "granted") return "granted";
  if (current === "denied")  return "denied";
  return await requestNotificationPermission();
}

// Legacy alias used by older code paths
export const checkNotifPermission = checkNotificationPermission;

// ─── Listeners (foreground / tap handlers) ──────────────────────────────────

/**
 * Wires up listeners for notifications received while app is open
 * and notifications tapped from the lock screen / notification center.
 * Call once at app startup.
 */
export async function setupNotificationListeners() {
  if (!isNative()) return null;
  try {
    // Foreground delivery (banner shows while app is open) is handled
    // automatically by iOS when scheduled with an appropriate delivery date.
    // We just listen for taps so we can navigate the user appropriately.
    LocalNotifications.removeAllListeners().catch(() => {});

    LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
      const data = event?.notification?.extra ?? {};
      // Future: navigate based on data.category
      // For now, opening the app is enough.
      void data;
    });
  } catch {
    // Listener setup is non-critical; ignore failures
  }
}

// ─── Schedule: prayer notifications ─────────────────────────────────────────

/**
 * Schedules prayer-time notifications for the next 7 days.
 *
 * @param {Object} args
 * @param {Object} args.prayerTimes  - { Fajr: "05:42", Dhuhr: "12:30", ... } (today's times)
 * @param {Object} args.prefs        - notification preferences object
 * @param {Function} args.fetchTimesForDate - async (dateString) => prayerTimes for that date
 *
 * Returns { scheduled, error }
 */
export async function schedulePrayerNotifications({ prayerTimes, prefs, fetchTimesForDate, reminderOffsets = {} }) {
  if (!isNative())                return { scheduled: 0, error: null };
  if (!prefs?.notifEnabled)       return { scheduled: 0, error: null };
  if (!prefs?.prayers)            return { scheduled: 0, error: null };

  const perm = await ensurePermission();
  if (perm !== "granted") return { scheduled: 0, error: "Permission not granted" };

  // Cancel existing prayer notifs before rescheduling to avoid duplicates
  await cancelPrayerNotifs();

  const notifications = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS; dayOffset++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);

    // For day 0, use the prayerTimes we already have. Otherwise fetch.
    let timesForDay = prayerTimes;
    if (dayOffset > 0 && fetchTimesForDate) {
      try {
        const dateStr = formatDateForApi(targetDate);
        const result = await fetchTimesForDate(dateStr);
        timesForDay = result?.timings ?? null;
      } catch {
        continue; // Skip this day if fetch fails, don't break scheduling
      }
    }

    if (!timesForDay) continue;

    PRAYER_NAMES.forEach((prayer, prayerIdx) => {
      // Respect per-prayer toggles (default: true if undefined)
      if (prefs.prayers[prayer] === false) return;

      const timeStr = timesForDay[prayer];
      if (!timeStr) return;

      const fireAt = parseTimeOnDate(timeStr, targetDate);
      // Apply per-prayer reminder offset (minutes before prayer time, default 0)
      const offsetMin = reminderOffsets[prayer] ?? 0;
      if (offsetMin > 0) fireAt.setMinutes(fireAt.getMinutes() - offsetMin);

      // Skip if the fire time has already passed
      if (fireAt.getTime() < now.getTime() + 30_000) return;

      notifications.push({
        id:    ID_RANGE.prayer + dayOffset * 5 + prayerIdx,
        title: prayerTitle(prayer),
        body:  prayerBody(prayer, offsetMin),
        schedule: { at: fireAt, allowWhileIdle: true },
        sound:    prefs?.adhanEnabled ? "adhan.caf" : "default",
        extra:    { category: "prayer", prayer, offsetMin },
      });
    });
  }

  if (notifications.length === 0) return { scheduled: 0, error: null };

  try {
    await LocalNotifications.schedule({ notifications });
    saveLastScheduleInfo({ scheduledAt: new Date().toISOString(), count: notifications.length, category: "prayer" });
    return { scheduled: notifications.length, error: null };
  } catch (err) {
    return { scheduled: 0, error: err?.message ?? "Schedule failed" };
  }
}

// ─── Schedule: daily reminders (Quran morning/midday/afternoon, dhikr, evening) ──

/**
 * Schedules daily non-prayer reminders for the next 7 days.
 * Each reminder fires at its configured time-of-day.
 *
 * @param {Object} prefs - notification preferences
 *   {
 *     quranMorning:    { enabled: true, hour: 9,  minute: 0  },
 *     dhikr:           { enabled: true, hour: 10, minute: 30 },
 *     quranMidday:     { enabled: true, hour: 12, minute: 30 },
 *     quranAfternoon:  { enabled: true, hour: 16, minute: 30 },
 *     evening:         { enabled: true, hour: 19, minute: 30 },
 *     tahajjud:        { enabled: false, hour: 2, minute: 30 },
 *   }
 */
export async function scheduleDailyReminders(prefs) {
  if (!isNative())            return { scheduled: 0, error: null };
  if (!prefs?.notifEnabled)   return { scheduled: 0, error: null };

  const perm = await ensurePermission();
  if (perm !== "granted") return { scheduled: 0, error: "Permission not granted" };

  // Cancel existing daily reminders
  await cancelDailyReminders();

  const notifications = [];
  const now = new Date();

  const categories = [
    { key: "quranMorning",   range: ID_RANGE.quranMorning,   getCopy: (date) => quranVerseCopy(date, "morning") },
    { key: "dhikr",          range: ID_RANGE.dhikr,          getCopy: (date) => getDailyDhikrCopy(date) },
    { key: "quranMidday",    range: ID_RANGE.quranMidday,    getCopy: (date) => quranVerseCopy(date, "midday") },
    { key: "quranAfternoon", range: ID_RANGE.quranAfternoon, getCopy: (date) => getQuranReadCopy(date) },
    { key: "evening",        range: ID_RANGE.evening,        getCopy: (date) => getEveningCopy(date) },
    { key: "tahajjud",       range: ID_RANGE.tahajjud,       getCopy: (date) => getTahajjudCopy(date) },
  ];

  for (const cat of categories) {
    const config = prefs[cat.key];
    if (!config?.enabled) continue;

    const hour   = config.hour ?? defaultHourFor(cat.key);
    const minute = config.minute ?? 0;

    for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS; dayOffset++) {
      const fireAt = new Date(now);
      fireAt.setDate(fireAt.getDate() + dayOffset);
      fireAt.setHours(hour, minute, 0, 0);

      // Skip if in the past
      if (fireAt.getTime() < now.getTime() + 30_000) continue;

      const { title, body } = cat.getCopy(fireAt);

      notifications.push({
        id:       cat.range + dayOffset,
        title,
        body,
        schedule: { at: fireAt, allowWhileIdle: true },
        sound:    "default",
        extra:    { category: cat.key, dayOffset },
      });
    }
  }

  if (notifications.length === 0) return { scheduled: 0, error: null };

  try {
    await LocalNotifications.schedule({ notifications });
    saveLastScheduleInfo({ scheduledAt: new Date().toISOString(), count: notifications.length, category: "daily" });
    return { scheduled: notifications.length, error: null };
  } catch (err) {
    return { scheduled: 0, error: err?.message ?? "Schedule failed" };
  }
}

// ─── Cancellation ───────────────────────────────────────────────────────────

/**
 * Cancels every Sirat-scheduled notification.
 */
export async function cancelAllNotifications() {
  if (!isNative()) return { cancelled: 0 };
  try {
    const { notifications } = await LocalNotifications.getPending();
    if (!notifications?.length) return { cancelled: 0 };
    await LocalNotifications.cancel({ notifications });
    return { cancelled: notifications.length };
  } catch {
    return { cancelled: 0 };
  }
}

/**
 * Cancels prayer-time notifications only (leaves daily reminders alone).
 */
export async function cancelPrayerNotifs() {
  return await cancelByIdRange(ID_RANGE.prayer, ID_RANGE.prayer + 1000);
}

/**
 * Cancels all daily reminders (Quran/dhikr/evening/tahajjud).
 */
export async function cancelDailyReminders() {
  return await cancelByIdRange(ID_RANGE.quranMorning, ID_RANGE.tahajjud + 1000);
}

/**
 * Cancels all Quran-themed notifications (morning, midday, afternoon).
 */
export async function cancelQuranNotifications() {
  const r1 = await cancelByIdRange(ID_RANGE.quranMorning,   ID_RANGE.quranMorning + 1000);
  const r2 = await cancelByIdRange(ID_RANGE.quranMidday,    ID_RANGE.quranMidday + 1000);
  const r3 = await cancelByIdRange(ID_RANGE.quranAfternoon, ID_RANGE.quranAfternoon + 1000);
  return { cancelled: r1.cancelled + r2.cancelled + r3.cancelled };
}

async function cancelByIdRange(minId, maxId) {
  if (!isNative()) return { cancelled: 0 };
  try {
    const { notifications } = await LocalNotifications.getPending();
    const targets = (notifications ?? []).filter(n => n.id >= minId && n.id < maxId);
    if (!targets.length) return { cancelled: 0 };
    await LocalNotifications.cancel({ notifications: targets.map(n => ({ id: n.id })) });
    return { cancelled: targets.length };
  } catch {
    return { cancelled: 0 };
  }
}

// ─── Status / introspection ─────────────────────────────────────────────────

export async function getPendingCount() {
  if (!isNative()) return 0;
  try {
    const { notifications } = await LocalNotifications.getPending();
    return notifications?.length ?? 0;
  } catch {
    return 0;
  }
}

export async function getLastScheduleInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_SCHEDULE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLastScheduleInfo(info) {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_SCHEDULE, JSON.stringify(info));
  } catch {
    // ignore
  }
}

// ─── Stub exports for in-app social notifications (future) ──────────────────
// These keep older imports compiling. The real implementation lives in
// socialNotificationService.js (TODO — separate feature).

export async function getNotifications() { return { data: [], error: null }; }
export async function getUnreadCount()   { return { count: 0, error: null }; }
export async function markRead()         { return { error: null }; }
export async function markAllRead()      { return { error: null }; }
export async function markNotificationRead()     { return { error: null }; }
export async function markAllNotificationsRead() { return { error: null }; }

// ─── Internal helpers ───────────────────────────────────────────────────────

function defaultHourFor(category) {
  return {
    quranMorning:   9,
    dhikr:          10,
    quranMidday:    12,
    quranAfternoon: 16,
    evening:        19,
    tahajjud:       2,
  }[category] ?? 9;
}

function parseTimeOnDate(timeStr, dateBase) {
  // timeStr is "HH:MM" 24-hour from Aladhan API
  const [hh, mm] = (timeStr ?? "00:00").split(":").map(n => parseInt(n, 10));
  const d = new Date(dateBase);
  d.setHours(hh ?? 0, mm ?? 0, 0, 0);
  return d;
}

function formatDateForApi(date) {
  // Aladhan format: DD-MM-YYYY
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = date.getFullYear();
  return `${dd}-${mm}-${yy}`;
}

function prayerTitle(prayer) {
  return `${prayer} · ${PRAYER_NAMES_ARABIC[prayer] ?? ""}`.trim();
}

function prayerBody(prayer, offsetMin) {
  if (offsetMin > 0) return `${prayer} prayer in ${offsetMin} minutes. Prepare for prayer.`;
  return `It's time for ${prayer} prayer.`;
}

function quranVerseCopy(date, slot) {
  const verse = pickVerseForDay(date);
  const slotPrefix = {
    morning: "Begin your day with reflection",
    midday:  "A midday reminder",
  }[slot] ?? "Reflect";

  return {
    title: slotPrefix,
    body:  `"${verse.english}" — ${verse.reference}`,
  };
}

// ─── Additional stubs for in-app social notifications system ────────────────
// These keep the existing useNotifications.js hook compiling. Real
// implementation lives in a future socialNotificationService.js.
export function subscribeToNotifications() { return { unsubscribe: () => {} }; }
export function formatNotification(n) { return n; }
export function relativeTime(t) { return t; }
