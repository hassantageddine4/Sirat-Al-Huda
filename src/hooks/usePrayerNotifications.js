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
import { getBranchDefaults } from "../services/branchService";
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
import { pushPrayerTimesToWidget, pushWidgetConfig } from '../lib/siratWidget';

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
    adhanEnabled: prefs.adhanEnabled ?? false,
    calcMethod:   prefs.calcMethod   ?? "ISNA",
    madhab:       prefs.madhab       ?? "Shafi'i",
    prayers:      { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true, ...(prefs.prayers ?? {}) },
    reminderOffsets: prefs.reminderOffsets ?? {},
    branch: prefs.branch ?? null,
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
          lat:        location.lat,
          lon:        location.lon,
          calcMethod: prefs.calcMethod,
          madhab:     prefs.madhab,
        });
        const todayPayload = result?.today?.data;
        if (todayPayload?.timings) {
          setPrayerTimes(todayPayload.timings);

          // Push location + calculation config so the widget computes prayer
          // times locally via AdhanSwift. Runs whenever times refresh.
          try {
            pushWidgetConfig({
              lat: location?.lat,
              lon: location?.lon,
              method: prefs?.calcMethod != null ? String(prefs.calcMethod) : undefined,
              methodCode: typeof prefs?.calcMethod === 'number' ? prefs.calcMethod : undefined,
              madhab: prefs?.madhab != null ? String(prefs.madhab) : 'Shafi',
              branch: (typeof localStorage !== 'undefined' ? localStorage.getItem('sirat_branch') : null) || 'sunni',
              locationName: location?.city || location?.name || location?.address || '',
            });
          } catch (_e) { /* widget config push best-effort */ }

          // ── Push to Home Screen widget ─────────────────────────────
          const tm = todayPayload.timings;
          const _now = new Date();
          const _y = _now.getFullYear(), _m = _now.getMonth(), _d = _now.getDate();
          const _parse = (s) => {
            if (!s) return null;
            const m = String(s).match(/^(\d{1,2}):(\d{2})/);
            return m ? new Date(_y, _m, _d, +m[1], +m[2]) : null;
          };
          const _loc = location?.city || location?.name || location?.address || "";
          void pushPrayerTimesToWidget({
            fajr:    _parse(tm.Fajr),
            sunrise: _parse(tm.Sunrise),
            dhuhr:   _parse(tm.Dhuhr),
            asr:     _parse(tm.Asr),
            maghrib: _parse(tm.Maghrib),
            isha:    _parse(tm.Isha),
          }, _loc);
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
          lat:        location.lat,
          lon:        location.lon,
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
    branch: prefs.branch ?? null,
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
      const next = { ...p, [reminderKey]: { ...current, enabled: !current.enabled } }; scheduleDailyReminders(next).catch(() => {}); return next;
    });
  }, []);

  const setReminderTime = useCallback((reminderKey, hour, minute) => {
    setPrefs(p => {
      const current = p[reminderKey] ?? DEFAULT_REMINDER_CONFIG[reminderKey];
      const next = { ...p, [reminderKey]: { ...current, hour, minute } }; scheduleDailyReminders(next).catch(() => {}); return next;
    });
  }, []);

  const setCalcMethod = useCallback((m) => {
    setPrefs(p => ({ ...p, calcMethod: m }));
  }, []);

  const setBranch = useCallback((branch, location) => {
    const { calcMethod, madhab } = getBranchDefaults(branch, location);
    setPrefs(p => ({ ...p, branch, calcMethod, madhab }));
  }, []);

  const setMadhab = useCallback((m) => {
    setPrefs(p => ({ ...p, madhab: m }));
  }, []);

  const setAdhanEnabled = useCallback((enabled) => {
    setPrefs(p => ({ ...p, adhanEnabled: !!enabled }));
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
    setBranch,
    setReminderOffset,
    setAdhanEnabled,
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
