import { useState } from "react";

export function usePrayerNotifications() {
  return {
    prefs:           { notifEnabled: false, prayers: {}, quranNotif: { enabled: false } },
    prayerTimes:     null,
    hijriDate:       null,
    location:        null,
    notifPermission: "prompt",
    locPermission:   "prompt",
    pendingCount:    0,
    lastScheduled:   null,
    loading:         false,
    error:           null,
    scheduleStatus:  null,

    toggleMasterNotif:  () => {},
    togglePrayer:       () => {},
    setCalcMethod:      () => {},
    setMadhab:          () => {},
    setReminderOffset:  () => {},
    refreshLocation:    () => {},
    requestPermission:  () => {},
    toggleQuranNotif:   () => {},
    setQuranNotifTime:  () => {},
    clearError:         () => {},

    PRAYER_KEYS:   ["Fajr","Dhuhr","Asr","Maghrib","Isha"],
    CALC_METHODS:  [],
    MADHABS:       [],
  };
}
