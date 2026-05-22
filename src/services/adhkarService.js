// src/services/adhkarService.js
// Per-prayer post-prayer adhkar (tasbihat) counters.
// Resets daily. Tracks SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34).

const KEY = "sirat:adhkarSessions";

const TARGETS = {
  subhanAllah:   33,
  alhamdulillah: 33,
  allahuAkbar:   34,
};

function todayKey() {
  return new Date().toDateString();
}

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function getSession(prayerName) {
  const all = loadAll();
  const today = todayKey();
  return all[today]?.[prayerName] ?? {
    subhanAllah:   0,
    alhamdulillah: 0,
    allahuAkbar:   0,
    completed:     false,
  };
}

export function incrementCounter(prayerName, key) {
  if (!TARGETS[key]) return;
  const all = loadAll();
  const today = todayKey();
  if (!all[today]) all[today] = {};
  if (!all[today][prayerName]) {
    all[today][prayerName] = { subhanAllah: 0, alhamdulillah: 0, allahuAkbar: 0, completed: false };
  }
  const session = all[today][prayerName];
  if (session[key] < TARGETS[key]) {
    session[key]++;
  }
  if (
    session.subhanAllah   >= TARGETS.subhanAllah &&
    session.alhamdulillah >= TARGETS.alhamdulillah &&
    session.allahuAkbar   >= TARGETS.allahuAkbar
  ) {
    session.completed = true;
  }
  saveAll(all);
  return session;
}

export function resetSession(prayerName) {
  const all = loadAll();
  const today = todayKey();
  if (all[today]?.[prayerName]) {
    delete all[today][prayerName];
    saveAll(all);
  }
}

export function isSessionComplete(prayerName) {
  return getSession(prayerName).completed;
}

export const TARGETS_PUBLIC = TARGETS;
