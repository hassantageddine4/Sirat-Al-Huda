// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Home screen.
//
// Sections in order:
//   1. Greeting hero — As-salamu alaykum + name
//   2. Islamic Calendar card  ← replaces the old Quick Access grid
//   3. Today's prayers (next-up + checklist)
//   4. Daily verse
//   5. Streak / quick stats
//
// Performance notes:
//   • All async data lives in dedicated hooks; this component just composes
//   • PRAYERS array is module-level so it's not re-created per render
//   • nextPrayerIdx receives prayers explicitly to keep the helper pure
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../components/common/Icon";
import IslamicCalendarCard from "../components/home/IslamicCalendarCard";
import { useAuth } from "../hooks/useAuth";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { useDailyVerse } from "../hooks/useDailyVerse";
import { useCompletedPrayers } from "../hooks/useCompletedPrayers";

const PRAYERS = [
  { key: "fajr",     name: "Fajr",     arabic: "الفجر"   },
  { key: "dhuhr",    name: "Dhuhr",    arabic: "الظهر"   },
  { key: "asr",      name: "Asr",      arabic: "العصر"   },
  { key: "maghrib",  name: "Maghrib",  arabic: "المغرب"  },
  { key: "isha",     name: "Isha",     arabic: "العشاء"  },
];

// Pure helper: which prayer is next up given today's progress?
function nextPrayerIdx(completedSet, prayers) {
  for (let i = 0; i < prayers.length; i++) {
    if (!completedSet.has(prayers[i].key)) return i;
  }
  return -1;
}

export default function Home() {
  const navigate = useNavigate();
  const { user }     = useAuth();
  const { times }    = usePrayerTimes();
  const { verse }    = useDailyVerse();
  const { completed, toggle } = useCompletedPrayers();

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const nextIdx      = nextPrayerIdx(completedSet, PRAYERS);
  const todayDone    = completedSet.size;

  const firstName = user?.name?.split(" ")?.[0] ?? "";

  return (
    <div className="screen bg-ivory">
      {/* ── 1. Greeting ──────────────────────────────────────────── */}
      <header className="px-6 pt-6 pb-2">
        <p className="text-[11px] tracking-[0.22em] uppercase text-muted font-semibold">
          As-salamu alaykum
        </p>
        <h1 className="font-display text-3xl text-primary tracking-tight mt-1">
          {firstName ? `Welcome, ${firstName}` : "Welcome"}
        </h1>
      </header>

      <div className="scroll-area pb-12">
        {/* ── 2. Islamic Calendar (replaces Quick Access) ─────────── */}
        <IslamicCalendarCard />

        {/* ── 3. Today's prayers ──────────────────────────────────── */}
        <section className="mx-4 mt-4 rounded-3xl bg-white/70 border border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-primary tracking-tight">
              Today's prayers
            </h2>
            <span className="text-[11px] text-muted">
              {todayDone}/5 complete
            </span>
          </div>

          <ul className="space-y-2">
            {PRAYERS.map((p, i) => {
              const done   = completedSet.has(p.key);
              const isNext = i === nextIdx;
              const t      = times?.[p.key];

              return (
                <li key={p.key}>
                  <button
                    onClick={() => toggle(p.key)}
                    className={`press w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                      isNext
                        ? "bg-primary/8 border-primary/30"
                        : done
                        ? "bg-emerald-50/60 border-emerald-200/60"
                        : "bg-parchment/40 border-border/40"
                    }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done
                        ? "bg-emerald-600 text-white"
                        : isNext
                        ? "bg-primary text-ivory"
                        : "bg-white border border-border text-muted"
                    }`}>
                      {done
                        ? <Icon name="check" size={14} />
                        : <Icon name="prayer" size={14} />}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-display text-base ${done ? "text-emerald-800" : "text-ink"}`}>
                          {p.name}
                        </span>
                        <span
                          className="text-[13px] text-accent-dark/80"
                          style={{ fontFamily: "Amiri, serif" }}>
                          {p.arabic}
                        </span>
                      </div>
                      {isNext && !done && (
                        <p className="text-[11px] text-primary/80 mt-0.5">Up next</p>
                      )}
                    </div>
                    {t && (
                      <span className={`text-[13px] font-medium tabular-nums ${
                        done ? "text-emerald-800/70 line-through" : "text-ink/80"
                      }`}>
                        {t}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── 4. Daily verse ──────────────────────────────────────── */}
        {verse && (
          <section
            onClick={() => navigate(`/quran/${verse.chapterId}`)}
            className="press mx-4 mt-4 rounded-3xl bg-parchment/70 border border-border/60 p-5 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="bookOpen" size={14} className="text-accent-dark" />
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">
                Verse of the day
              </p>
            </div>
            <p
              className="text-right text-[20px] text-ink leading-loose mb-3"
              style={{ fontFamily: "Amiri, serif", direction: "rtl" }}>
              {verse.arabic}
            </p>
            <div className="mx-auto w-10 h-px bg-accent/30 mb-3" />
            <p className="text-[14px] text-body leading-relaxed italic">
              "{verse.translation}"
            </p>
            <p className="text-[11px] text-muted mt-2">
              — {verse.surahName} {verse.chapterId}:{verse.verseNumber}
            </p>
          </section>
        )}

        {/* ── 5. Quick links — clean icons, no emojis ─────────────── */}
        <section className="mx-4 mt-4 grid grid-cols-3 gap-2">
          <QuickLink to="/quran"      icon="bookOpen" label="Qur'an"  navigate={navigate} />
          <QuickLink to="/hadith"     icon="scroll"   label="Hadith"  navigate={navigate} />
          <QuickLink to="/qibla"      icon="compass"  label="Qibla"   navigate={navigate} />
        </section>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label, navigate }) {
  return (
    <button
      onClick={() => navigate(to)}
      className="press flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 transition-colors">
      <Icon name={icon} size={20} className="text-primary" />
      <span className="text-[12px] font-semibold text-body">{label}</span>
    </button>
  );
}
