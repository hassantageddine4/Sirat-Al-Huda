// src/pages/DailyRoutine.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Daily spiritual routine tracker. Shows the day's habits grouped by part
// of day (morning, prayers, Qur'an, dhikr, night) and tracks streaks.
//
// All emojis (🔥 streak flame, 🤲 dua, 📿 dhikr, 🌿 evening, etc.) have
// been replaced with the Icon component for visual consistency.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState, useCallback } from "react";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";

const STORAGE_KEY = "sirat_routine_v1";

// ─── Routine definition ────────────────────────────────────────────────────
// Each section has an icon (replaces previous emojis). Items are ordered
// in the way one would naturally move through the day.
const SECTIONS = [
  {
    id: "morning",
    title: "Morning",
    arabic: "الصباح",
    icon: "sunrise",
    items: [
      { id: "wake_dua",        label: "Wake-up du'a" },
      { id: "wudu",            label: "Wudu"         },
      { id: "morning_adhkar",  label: "Morning adhkar" },
    ],
  },
  {
    id: "prayers",
    title: "Five prayers",
    arabic: "الصلوات",
    icon: "prayer",
    items: [
      { id: "fajr",    label: "Fajr"    },
      { id: "dhuhr",   label: "Dhuhr"   },
      { id: "asr",     label: "Asr"     },
      { id: "maghrib", label: "Maghrib" },
      { id: "isha",    label: "Isha"    },
    ],
  },
  {
    id: "quran",
    title: "Qur'an",
    arabic: "القرآن",
    icon: "bookOpen",
    items: [
      { id: "quran_recite", label: "Read or recite Qur'an" },
      { id: "quran_reflect",label: "Reflect on a verse"     },
    ],
  },
  {
    id: "dhikr",
    title: "Dhikr & du'a",
    arabic: "الذكر والدعاء",
    icon: "beads",
    items: [
      { id: "tasbih",     label: "Tasbih (33 / 33 / 34)" },
      { id: "salawat",    label: "Salawat on the Prophet ﷺ" },
      { id: "personal_du", label: "Personal du'a" },
    ],
  },
  {
    id: "night",
    title: "Night",
    arabic: "الليل",
    icon: "moon",
    items: [
      { id: "evening_adhkar", label: "Evening adhkar" },
      { id: "sleep_dua",      label: "Sleep du'a" },
      { id: "muhasaba",       label: "Muhasaba — review the day" },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}
function saveHistory(history) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }
  catch {}
}

const TOTAL_ITEMS = SECTIONS.reduce((n, s) => n + s.items.length, 0);
const STREAK_THRESHOLD = 0.8;   // a "completed" day = 80%+ items checked

function computeStreak(history) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const day = history[key];
    if (!day) {
      // Today not yet started doesn't break the streak; previous day must exist
      if (i === 0) continue;
      break;
    }
    const completion = (day.completed?.length ?? 0) / TOTAL_ITEMS;
    if (completion >= STREAK_THRESHOLD) streak++;
    else if (i > 0) break;   // any day below threshold breaks (except today)
  }
  return streak;
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function DailyRoutine() {
  const [history, setHistory] = useState(loadHistory);
  const today = dateKey();
  const todayDone = useMemo(
    () => new Set(history[today]?.completed ?? []),
    [history, today]
  );

  useEffect(() => { saveHistory(history); }, [history]);

  const toggle = useCallback((itemId) => {
    setHistory(prev => {
      const day = prev[today] ?? { completed: [] };
      const set = new Set(day.completed);
      if (set.has(itemId)) set.delete(itemId);
      else                 set.add(itemId);
      return { ...prev, [today]: { completed: Array.from(set) } };
    });
  }, [today]);

  const streak     = useMemo(() => computeStreak(history), [history]);
  const completion = todayDone.size / TOTAL_ITEMS;
  const completionPct = Math.round(completion * 100);

  return (
    <div className="screen bg-ivory">
      <ScreenHeader title="Daily routine" subtitle="ورد يومي" />

      <div className="scroll-area pb-12">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-ivory p-6 relative overflow-hidden"
          style={{ animation: "fadeIn 360ms ease-out both" }}>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.22em] uppercase font-semibold text-accent-light/90">
                Today's progress
              </p>
              <p className="font-display text-5xl tracking-tight mt-1 leading-none">
                {todayDone.size}<span className="text-2xl text-ivory/50">/{TOTAL_ITEMS}</span>
              </p>
              <p className="text-[13px] text-ivory/70 mt-1">
                {completionPct}% complete
              </p>
            </div>

            {/* Streak — flame icon, no emoji */}
            <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-ivory/10 border border-ivory/15">
              <Icon name="flame" size={20} className="text-accent" />
              <p className="font-display text-2xl mt-1 leading-none">{streak}</p>
              <p className="text-[10px] tracking-wider uppercase text-ivory/60 mt-0.5">
                day streak
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-ivory/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </section>

        {/* ── Sections ─────────────────────────────────────────── */}
        {SECTIONS.map((section, sIdx) => {
          const sectionDone = section.items.filter(it => todayDone.has(it.id)).length;
          return (
            <section
              key={section.id}
              className="mx-4 mt-4 rounded-3xl bg-white/70 border border-border/60 overflow-hidden"
              style={{ animation: `fadeIn 360ms ease-out ${sIdx * 60 + 80}ms both` }}>

              <header className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <div className="w-9 h-9 rounded-full bg-parchment flex items-center justify-center text-primary flex-shrink-0">
                  <Icon name={section.icon} size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base text-primary tracking-tight leading-tight">
                    {section.title}
                  </h3>
                  <p
                    className="text-[12px] text-accent-dark/70 leading-tight"
                    style={{ fontFamily: "Amiri, serif" }}>
                    {section.arabic}
                  </p>
                </div>
                <span className="text-[11px] text-muted">
                  {sectionDone}/{section.items.length}
                </span>
              </header>

              <ul>
                {section.items.map((item, iIdx) => {
                  const done = todayDone.has(item.id);
                  return (
                    <li key={item.id} className={iIdx > 0 ? "border-t border-border/40" : ""}>
                      <button
                        onClick={() => toggle(item.id)}
                        className={`press w-full flex items-center gap-3 px-5 py-3 text-left ${
                          done ? "bg-emerald-50/30" : ""
                        }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          done
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-border"
                        }`}>
                          {done && <Icon name="check" size={12} />}
                        </div>
                        <span className={`text-[14px] ${
                          done
                            ? "text-emerald-800 line-through decoration-emerald-700/40"
                            : "text-body"
                        }`}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
