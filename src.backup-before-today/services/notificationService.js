// src/services/notificationService.js
// Temporary stub — original at notificationService.js.bak

// ── Prayer/local notifications ────────────────────────────────────────────
export async function setupNotificationListeners() { return null; }
export async function schedulePrayerNotifications() { return { scheduled: 0, error: null }; }
export async function cancelAllNotifications() { return { cancelled: 0 }; }
export async function cancelPrayerNotifs() { return { cancelled: 0 }; }
export async function checkNotifPermission() { return "prompt"; }
export async function ensurePermission() { return "prompt"; }
export async function getLastScheduleInfo() { return null; }
export async function getPendingCount() { return 0; }
export async function cancelQuranNotifications() { return { cancelled: 0 }; }

// ── Community / social notifications ──────────────────────────────────────
export async function getNotifications() { return { data: [], error: null }; }
export async function getUnreadCount() { return { count: 0, error: null }; }
export async function markRead() { return { error: null }; }
export async function markAllRead() { return { error: null }; }
export async function markNotificationRead() { return { error: null }; }
export async function markAllNotificationsRead() { return { error: null }; }

export function subscribeToNotifications() {
  return { unsubscribe: () => {} };
}

export function formatNotification(n) { return n; }
export function relativeTime() { return ""; }
