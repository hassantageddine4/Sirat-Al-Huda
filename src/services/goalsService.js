const KEY = "sirat:goals_v1";

function todayKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function saveAll(g) { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch {} }
function newId() { return "g_" + Math.random().toString(36).slice(2, 10); }

export function getAllGoals({ includeArchived = false } = {}) {
  const all = loadAll();
  return includeArchived ? all : all.filter(g => !g.archived);
}
export function getActiveGoals() { return loadAll().filter(g => !g.archived && !g.completed); }
export function getCompletedGoals() { return loadAll().filter(g => g.completed && !g.archived); }
export function getGoalById(id) { return loadAll().find(g => g.id === id) ?? null; }

export function createGoal(p) {
  const now = new Date().toISOString();
  const goal = {
    id: newId(), title: p.title ?? "Untitled goal",
    category: p.category ?? "custom", type: p.type ?? "streak",
    target: p.target ?? 7, period: p.period ?? "daily",
    startDate: p.startDate ?? todayKey(), endDate: p.endDate ?? null,
    notes: p.notes ?? "", icon: p.icon ?? "target", color: p.color ?? "#0F3D2E",
    streakHistory: [], counterValue: 0,
    checklistItems: (p.checklistItems ?? []).map((c, i) => ({
      id: c.id ?? `i_${i}`, label: c.label ?? "", done: !!c.done })),
    completed: false, completedAt: null, archived: false,
    createdAt: now, updatedAt: now,
  };
  const all = loadAll(); all.unshift(goal); saveAll(all); return goal;
}

export function updateGoal(id, patch) {
  const all = loadAll();
  const idx = all.findIndex(g => g.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  saveAll(all); return all[idx];
}
export function deleteGoal(id) { saveAll(loadAll().filter(g => g.id !== id)); }
export function archiveGoal(id) { return updateGoal(id, { archived: true }); }

export function markStreakToday(id) {
  const g = getGoalById(id);
  if (!g || g.type !== "streak") return null;
  const t = todayKey();
  if (g.streakHistory.includes(t)) return g;
  const h = [...g.streakHistory, t].sort();
  return updateGoal(id, checkCompletion({ ...g, streakHistory: h }));
}
export function unmarkStreakToday(id) {
  const g = getGoalById(id);
  if (!g || g.type !== "streak") return null;
  const t = todayKey();
  const h = g.streakHistory.filter(d => d !== t);
  return updateGoal(id, { streakHistory: h, completed: false, completedAt: null });
}
export function isStreakDoneToday(g) { return !!g && g.streakHistory?.includes(todayKey()); }

export function getCurrentStreak(g) {
  if (!g || !g.streakHistory?.length) return 0;
  const sorted = [...g.streakHistory].sort().reverse();
  let streak = 0;
  let cursor = new Date(); cursor.setHours(0, 0, 0, 0);
  for (const dStr of sorted) {
    const d = new Date(dStr + "T00:00:00");
    const diff = Math.round((cursor - d) / 86400000);
    if (streak === 0 && diff <= 1) { streak = 1; cursor = d; continue; }
    if (diff === 1) { streak++; cursor = d; } else break;
  }
  return streak;
}

export function incrementCounter(id, delta = 1) {
  const g = getGoalById(id);
  if (!g || g.type !== "counter") return null;
  return updateGoal(id, checkCompletion({ ...g, counterValue: Math.max(0, (g.counterValue ?? 0) + delta) }));
}
export function setCounter(id, v) {
  const g = getGoalById(id);
  if (!g || g.type !== "counter") return null;
  return updateGoal(id, checkCompletion({ ...g, counterValue: Math.max(0, v) }));
}

export function toggleChecklistItem(id, itemId) {
  const g = getGoalById(id);
  if (!g || g.type !== "checklist") return null;
  const items = g.checklistItems.map(it => it.id === itemId ? { ...it, done: !it.done } : it);
  return updateGoal(id, checkCompletion({ ...g, checklistItems: items }));
}
function checkCompletion(g) {
  let done = false;
  if (g.type === "streak") done = (g.streakHistory?.length ?? 0) >= g.target;
  else if (g.type === "counter") done = (g.counterValue ?? 0) >= g.target;
  else if (g.type === "checklist") done = g.checklistItems?.length > 0 && g.checklistItems.every(it => it.done);
  if (done && !g.completed) return { ...g, completed: true, completedAt: new Date().toISOString() };
  if (!done && g.completed) return { ...g, completed: false, completedAt: null };
  return g;
}

export function getProgress(g) {
  if (!g) return 0;
  if (g.type === "streak") return Math.min(100, Math.round(((g.streakHistory?.length ?? 0) / g.target) * 100));
  if (g.type === "counter") return Math.min(100, Math.round(((g.counterValue ?? 0) / g.target) * 100));
  if (g.type === "checklist") {
    const n = g.checklistItems?.length ?? 0;
    if (n === 0) return 0;
    return Math.min(100, Math.round((g.checklistItems.filter(it => it.done).length / n) * 100));
  }
  return 0;
}

export function getProgressLabel(g) {
  if (!g) return "—";
  if (g.type === "streak") return `${g.streakHistory?.length ?? 0} / ${g.target} days`;
  if (g.type === "counter") return `${g.counterValue ?? 0} / ${g.target}`;
  if (g.type === "checklist") {
    const done = g.checklistItems?.filter(it => it.done).length ?? 0;
    return `${done} / ${g.checklistItems?.length ?? 0} items`;
  }
  return "—";
}

export function getGoalStats() {
  const all = getAllGoals();
  const today = todayKey();
  const progressToday = all.filter(g => !g.completed && g.type === "streak" && g.streakHistory?.includes(today)).length;
  return { total: all.length, active: all.filter(g => !g.completed).length, completed: all.filter(g => g.completed).length, progressToday };
}
