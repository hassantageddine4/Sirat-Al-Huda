// src/components/home/IslamicCalendarCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Premium calendar card for the Home screen. Replaces "Quick Access".
//
// Layers of detail:
//   1. Big hijri date hero (always visible)
//   2. Upcoming events ribbon (if any in the next 60 days)
//   3. Expandable monthly grid (tap to reveal)
//
// Design language: parchment paper feel, heavy display type for the day
// number, restrained gold accents, Arabic in Amiri set in a smaller key
// beneath the English month.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import Icon from "../common/Icon";
import { useTodayHijri, useUpcomingEvents, useHijriMonth } from "../../hooks/useHijri";

export default function IslamicCalendarCard() {
  const today    = useTodayHijri();
  const upcoming = useUpcomingEvents(60);
  const [expanded, setExpanded] = useState(false);

  if (today.loading && !today.data) return <Skeleton />;
  if (today.error || !today.data) return <FallbackCard onRetry={today.refetch} />;

  const { hijri, gregorian } = today.data;

  return (
    <section
      className="mx-4 mt-4 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-ivory relative"
      style={{ animation: "calIn 480ms cubic-bezier(0.22,0.61,0.36,1) both" }}>

      {/* Decorative arabesque ornament */}
      <Ornament className="absolute top-0 right-0 -mt-4 -mr-6 text-accent/15" />
      <Ornament className="absolute bottom-0 left-0 -mb-4 -ml-6 text-accent/10 rotate-180" />

      {/* Hero */}
      <div className="relative px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 text-accent-light/90">
            <Icon name="moon" size={14} />
            <span className="text-[10px] tracking-[0.22em] uppercase font-semibold">
              Islamic Calendar
            </span>
          </div>
          <span className="text-[11px] text-ivory/70 font-medium">
            {gregorian.weekday}, {gregorian.day} {gregorian.month}
          </span>
        </div>

        <div className="flex items-end gap-3 mt-2">
          <span className="font-display font-bold text-[64px] leading-none tracking-tight">
            {hijri.day}
          </span>
          <div className="pb-2">
            <p className="font-display text-[22px] leading-tight">
              {hijri.month}
            </p>
            <p
              className="text-[15px] text-accent-light/90 leading-tight -mt-0.5"
              style={{ fontFamily: "Amiri, serif" }}
              dir="rtl">
              {hijri.monthAr}
            </p>
          </div>
        </div>

        <p className="text-[12px] text-ivory/60 mt-2">
          {hijri.year} AH · {gregorian.year} CE
        </p>
      </div>

      {/* Today's holidays inline if present */}
      {hijri.holidays?.length > 0 && (
        <div className="relative px-6 pb-3">
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-accent/15 backdrop-blur-sm border border-accent/30">
            <Icon name="star" size={14} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-ivory leading-snug">
              Today: {hijri.holidays.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Upcoming events ribbon */}
      {!upcoming.loading && upcoming.data.length > 0 && (
        <div className="relative">
          <div className="flex items-center gap-2 px-6 pt-2">
            <Icon name="calendar" size={12} className="text-accent-light/80" />
            <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-accent-light/80">
              Upcoming
            </p>
          </div>

          <ul className="flex gap-2 px-6 pt-2 pb-4 overflow-x-auto no-scrollbar">
            {upcoming.data.slice(0, 6).map((evt, i) => (
              <UpcomingPill key={i} event={evt} />
            ))}
          </ul>
        </div>
      )}

      {/* Expand / collapse footer */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="press relative w-full flex items-center justify-center gap-2 py-3 border-t border-ivory/10 text-[12px] font-semibold tracking-wide text-accent-light hover:bg-ivory/5">
        {expanded ? "Hide month view" : "View this month"}
        <Icon name="forward" size={12} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {/* Expandable month grid */}
      <div className={`relative overflow-hidden transition-all duration-400 ease-out ${
        expanded ? "max-h-[640px]" : "max-h-0"
      }`}>
        <MonthGrid
          year={hijri.year}
          month={hijri.monthN}
          today={hijri.day}
        />
      </div>

      <style>{`
        @keyframes calIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

// ─── Upcoming pill ──────────────────────────────────────────────────────────
function UpcomingPill({ event }) {
  const ms = new Date(event.gregorian).getTime() - Date.now();
  const days = Math.max(0, Math.round(ms / 86_400_000));
  const label = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days}d`;

  // Special accent for major events
  const isMajor = /eid|ramadan|ashura|laylat|mawlid/i.test(event.name);

  return (
    <li className={`flex-shrink-0 px-3.5 py-2 rounded-xl border ${
      isMajor
        ? "bg-accent/20 border-accent/40"
        : "bg-ivory/10 border-ivory/15"
    }`}>
      <p className="text-[10px] tracking-wider uppercase text-accent-light/80 font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-[13px] text-ivory font-medium whitespace-nowrap">
        {shortenEventName(event.name)}
      </p>
    </li>
  );
}

function shortenEventName(name) {
  // The Aladhan API sometimes returns very long descriptions; trim parenthetical
  return name.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

// ─── Month grid ─────────────────────────────────────────────────────────────
function MonthGrid({ year, month, today }) {
  const { data, loading } = useHijriMonth(year, month);

  // 7-column grid of hijri days. The Aladhan calendar gives us the gregorian
  // weekday of the 1st, so we can offset properly.
  const grid = useMemo(() => {
    if (!data || data.length === 0) return null;
    const first = data[0];
    const weekdayMap = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
      Thursday: 4, Friday: 5, Saturday: 6,
    };
    const startOffset = weekdayMap[first.weekday] ?? 0;
    return { startOffset, days: data };
  }, [data]);

  if (loading) {
    return (
      <div className="px-6 py-6 text-center">
        <p className="text-[12px] text-ivory/60">Loading month…</p>
      </div>
    );
  }
  if (!grid) return null;

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const cells = [
    ...Array(grid.startOffset).fill(null),
    ...grid.days,
  ];

  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((d, i) => (
          <div key={i} className="text-[10px] text-ivory/50 text-center font-semibold tracking-wider">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday   = d.hijriDay === today;
          const hasEvent  = d.holidays?.length > 0;
          return (
            <div
              key={i}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-colors ${
                isToday
                  ? "bg-accent text-primary-dark font-bold"
                  : hasEvent
                  ? "bg-ivory/10 text-ivory"
                  : "text-ivory/80"
              }`}
              title={d.holidays?.join(", ")}>
              <span className="text-[14px] leading-none font-display">{d.hijriDay}</span>
              <span className={`text-[9px] leading-none mt-0.5 ${
                isToday ? "text-primary-dark/70" : "text-ivory/40"
              }`}>
                {d.gregDay}
              </span>
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── States ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-6 text-ivory">
      <div className="h-3 w-32 bg-ivory/10 rounded mb-3" />
      <div className="h-12 w-24 bg-ivory/10 rounded mb-2" />
      <div className="h-4 w-40 bg-ivory/10 rounded" />
    </section>
  );
}

function FallbackCard({ onRetry }) {
  return (
    <section className="mx-4 mt-4 rounded-3xl bg-parchment p-5 border border-border">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-muted">
          <Icon name="calendar" size={18} />
        </div>
        <div className="flex-1">
          <p className="font-display text-base text-ink">Calendar unavailable</p>
          <p className="text-[12px] text-muted mt-0.5">Couldn't reach the Hijri date service.</p>
          <button
            onClick={onRetry}
            className="press mt-2 text-[12px] font-semibold text-accent-dark">
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Decorative ornament SVG ────────────────────────────────────────────────
function Ornament({ className = "" }) {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.55">
        <path d="M90 30 a60 60 0 0 1 0 120 a60 60 0 0 1 0 -120" />
        <path d="M90 50 a40 40 0 0 1 0 80 a40 40 0 0 1 0 -80" />
        <path d="M90 30 L100 70 L140 70 L108 95 L120 140 L90 115 L60 140 L72 95 L40 70 L80 70 Z" />
      </g>
    </svg>
  );
}
