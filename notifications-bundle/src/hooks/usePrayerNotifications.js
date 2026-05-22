// src/hooks/usePrayerNotifications.js
// ─────────────────────────────────────────────────────────────────────────────
// Central hook for prayer times + notification management.
//
// Responsibilities:
//   - Load + persist prayer notification preferences (localStorage)
//   - Fetch current prayer times via Aladhan
//   - Resolve user location (Capacitor Geolocation, with IP fallback)
//   - Schedule prayer notifications for the next 7 days
//   - Schedule daily reminders (Quran/dhikr/evening/Tahajjud)
//   - Manage permission state
//   - Expose toggle/setter functions consumed by Profile + NotificationSettings
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import {
  loadPrayerPrefs,
  savePrayerPrefs,
  fetchTodayAndTomorrow,
  fetchPrayerTimings,
  PRAYER_KEYS,
  formatTime,
  CALC_METHODS,
  MADHABS,
} from "../services/prayerTimeService";
import {
  getBestLocation,
  checkLocationPermission,
} from "../services/locationService";
import {
  schedulePrayerNotifications,
  scheduleDailyReminders,
  cancelAllNotifications,
  cancelPrayerNotifs,
  cancelDailyReminders,
  cancelQuranNotifications,
  checkNotificationPermission,
  ensurePermission,
  requestNotificationPermission,
  getLastScheduleInfo,
  getPendingCount,
} from "../services/notificationService";

// ─── Defaults for the reminder section ──────────────────────────────────────
const DEFAULT_REMINDER_CONFIG = {
  quranMorning:   { enabled: true,  hour: 9,  minute: 0  },
  dhikr:          { enabled: true,  hour: 10, minute: 30 },
  quranMidday:    { enabled: true,  hour: 12, minute: 30 },
  quranAfternoon: { enabled: true,  hour: 16, minute: 30 },
  evening:        { enabled: true,  hour: 19, minute: 30 },
  tahajjud:       { enabled: false, hour: 2,  minute: 30 },
};

// Merges saved prefs with defaults so newly added reminders aren't missing
function mergeWithDefaults(saved) {
  const prefs = saved ?? {};
  const out = {
    notifEnabled: prefs.notifEnabled ?? false,
    calcMethod:   prefs.calcMethod   ?? "ISNA",
    madhab:       prefs.madhab       ?? "Shafi'i",
    prayers:      { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true, ...(prefs.prayers ?? {}) },
    reminderOffsets: prefs.reminderOffsets ?? {},
  };
  for (const [k, v] of Object.entries(DEFAULT_REMINDER_CONFIG)) {
    out[k] = { ...v, ...(prefs[k] ?? {}) };
  }
  return out;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function usePrayerNotifications() {
  const [prefs,           setPrefs]           = useState(() => mergeWithDefaults(loadPrayerPrefs()));
  const [prayerTimes,     setPrayerTimes]     = useState(null);
  const [hijriDate,       setHijriDate]       = useState(null);
  const [location,        setLocation]        = useState(null);
  const [notifPermission, setNotifPermission] = useState("prompt");
  const [locPermission,   setLocPermission]   = useState("prompt");
  const [pendingCount,    setPendingCount]    = useState(0);
  const [lastScheduled,   setLastScheduled]   = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [scheduleStatus,  setScheduleStatus]  = useState(null);

  // Re-entrancy guard for re-scheduling
  const reschedulingRef = useRef(false);

  // ── persist prefs to localStorage on change
  useEffect(() => {
    savePrayerPrefs(prefs);
  }, [prefs]);

  // ── initial setup: check permissions, fetch location + prayer times
  useEffect(() => {
    (async () => {
      try {
        const np = await checkNotificationPermission();
        setNotifPermission(np);
      } catch {}
      try {
        const lp = await checkLocationPermission();
        setLocPermission(lp);
      } catch {}
      try {
        const pc = await getPendingCount();
        setPendingCount(pc);
      } catch {}
      try {
        const last = await getLastScheduleInfo();
        setLastScheduled(last);
      } catch {}

      await refreshLocationInternal();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── fetch prayer times whenever location or method/madhab changes
  useEffect(() => {
    if (!location) return;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchTodayAndTomorrow({
          lat:        location.latitude,
          lon:        location.longitude,
          calcMethod: prefs.calcMethod,
          madhab:     prefs.madhab,
        });
        const todayPayload = result?.today?.data;
        if (todayPayload?.timings) {
          setPrayerTimes(todayPayload.timings);
        }
        if (todayPayload?.date?.hijri) {
          setHijriDate(todayPayload.date.hijri);
        }
        setError(null);
      } catch (e) {
        setError(e?.message ?? "Could not fetch prayer times");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, prefs.calcMethod, prefs.madhab]);

  // ── auto-reschedule on prefs change (debounced via re-entrancy guard)
  useEffect(() => {
    if (!prefs.notifEnabled)   return;
    if (notifPermission !== "granted") return;
    if (!prayerTimes)          return;

    void rescheduleAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    prefs.notifEnabled,
    prefs.prayers,
    prefs.quranMorning,
    prefs.dhikr,
    prefs.quranMidday,
    prefs.quranAfternoon,
    prefs.evening,
    prefs.tahajjud,
    notifPermission,
    prayerTimes,
  ]);

  // ── helpers
  async function refreshLocationInternal() {
    try {
      const loc = await getBestLocation();
      if (loc) setLocation(loc);
      const lp = await checkLocationPermission();
      setLocPermission(lp);
    } catch (e) {
      setError(e?.message ?? "Could not get location");
    }
  }

  async function rescheduleAll() {
    if (reschedulingRef.current) return;
    reschedulingRef.current = true;
    try {
      const fetchTimesForDate = async (dateStr) => {
        if (!location) return null;
        const result = await fetchPrayerTimings({
          lat:        location.latitude,
          lon:        location.longitude,
          date:       dateStr,
          calcMethod: prefs.calcMethod,
          madhab:     prefs.madhab,
        });
        // Returns the inner { timings, date, meta } payload
        return result?.data ?? null;
      };
      const r1 = await schedulePrayerNotifications({
        prayerTimes,
        prefs,
        fetchTimesForDate,
        reminderOffsets: prefs.reminderOffsets ?? {},
      });
      const r2 = await scheduleDailyReminders(prefs);

      setScheduleStatus({
        prayer: r1.scheduled, prayerError: r1.error,
        daily:  r2.scheduled, dailyError:  r2.error,
        at: new Date().toISOString(),
      });
      setPendingCount(await getPendingCount());
      setLastScheduled(await getLastScheduleInfo());
    } finally {
      reschedulingRef.current = false;
    }
  }

  // ─── Actions exposed to components ────────────────────────────────────────

  const toggleMasterNotif = useCallback(async () => {
    const next = !prefs.notifEnabled;
    if (next) {
      const perm = await ensurePermission();
      setNotifPermission(perm);
      if (perm !== "granted") {
        // User declined; don't enable
        setError("Notifications permission was not granted");
        return;
      }
    } else {
      await cancelAllNotifications();
    }
    setPrefs(p => ({ ...p, notifEnabled: next }));
  }, [prefs.notifEnabled]);

  const togglePrayer = useCallback((prayerKey) => {
    setPrefs(p => ({
      ...p,
      prayers: { ...p.prayers, [prayerKey]: !(p.prayers?.[prayerKey] ?? true) },
    }));
  }, []);

  const toggleReminder = useCallback((reminderKey) => {
    setPrefs(p => {
      const current = p[reminderKey] ?? DEFAULT_REMINDER_CONFIG[reminderKey];
      return { ...p, [reminderKey]: { ...current, enabled: !current.enabled } };
    });
  }, []);

  const setReminderTime = useCallback((reminderKey, hour, minute) => {
    setPrefs(p => {
      const current = p[reminderKey] ?? DEFAULT_REMINDER_CONFIG[reminderKey];
      return { ...p, [reminderKey]: { ...current, hour, minute } };
    });
  }, []);

  const setCalcMethod = useCallback((m) => {
    setPrefs(p => ({ ...p, calcMethod: m }));
  }, []);

  const setMadhab = useCallback((m) => {
    setPrefs(p => ({ ...p, madhab: m }));
  }, []);

  const setReminderOffset = useCallback((prayerKey, minutes) => {
    setPrefs(p => ({
      ...p,
      reminderOffsets: { ...(p.reminderOffsets ?? {}), [prayerKey]: minutes },
    }));
  }, []);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    await refreshLocationInternal();
    setLoading(false);
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === "granted") {
      // Auto-enable master toggle on first grant
      setPrefs(p => ({ ...p, notifEnabled: true }));
    }
    return result;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ── Legacy aliases for older callsites
  const toggleQuranNotif  = useCallback(() => toggleReminder("quranMorning"), [toggleReminder]);
  const setQuranNotifTime = useCallback((h, m) => setReminderTime("quranMorning", h, m), [setReminderTime]);

  return {
    prefs,
    prayerTimes,
    hijriDate,
    location,
    notifPermission,
    locPermission,
    pendingCount,
    lastScheduled,
    loading,
    error,
    scheduleStatus,

    toggleMasterNotif,
    togglePrayer,
    toggleReminder,
    setReminderTime,
    setCalcMethod,
    setMadhab,
    setReminderOffset,
    refreshLocation,
    requestPermission,
    toggleQuranNotif,
    setQuranNotifTime,
    clearError,

    PRAYER_KEYS,
    CALC_METHODS,
    MADHABS,
  };
}
