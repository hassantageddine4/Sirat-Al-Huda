// src/pages/IslamicCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { getGregorianMonth, todayKey, gregorianKey } from "../services/calendarService";
import { EVENTS, WEEKLY_EVENTS } from "../data/islamicEvents";
import { gregorianDateKey, getEventCompletions, toggleCompletion } from "../services/eventCompletions";
import Sheet from "../components/common/Sheet";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", emerald: "#082319",
  gold: "#C8A951", goldLight: "#D9BF7A", goldDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", subtle: "#B0A89E", hairline: "#E8E2D8",
};
const SECT_COLOR = { both: C.gold, sunni: C.primary, shia: C.goldDark };
const SECT_LABEL = { both: "", sunni: "Sunni", shia: "Shia" };
const WEEKDAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

export default function IslamicCalendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear]   = useState(today.getFullYear());
  const [days, setDays]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    getGregorianMonth(month, year)
      .then(d => { if (!cancel) { setDays(d); setLoading(false); } })
      .catch(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [month, year]);

  const tk = todayKey();
  const monthEvents = useMemo(() => collectEvents(days), [days]);
  const hijriRange = useMemo(() => buildHijriLabel(days), [days]);

  function prevMonth() { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); }
  function goToday()   { setMonth(today.getMonth() + 1); setYear(today.getFullYear()); }

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Islamic Calendar" onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16 }}>
        <HeaderCard
          month={month} year={year}
          hijriRange={hijriRange}
          onPrev={prevMonth} onNext={nextMonth}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
          {WEEKDAYS.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: "0.05em", padding: "6px 0" }}>{d}</div>
          ))}
        </div>
        {loading && <LoadingState />}
        {!loading && days.length > 0 && <CalendarGrid days={days} tk={tk} onSelect={setSelectedDay} />}
        <div style={{ marginTop: 14, marginBottom: 4, textAlign: "center" }}>
          <button onClick={goToday} className="press" style={{
            padding: "10px 22px", borderRadius: 999, background: C.primary, color: "white",
            border: "none", fontFamily: "Fraunces, serif", fontSize: 13, fontWeight: 500,
          }}>Jump to today</button>
        </div>
        <Legend />
        {monthEvents.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
              fontFamily: "Fraunces, serif", fontSize: 11, color: C.muted,
              textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600,
              padding: "0 6px 4px",
            }}>This month's events</div>
            {monthEvents.map((e, i) => <EventCard key={i} entry={e} />)}
          </div>
        )}
      </div>
      {selectedDay && <DaySheet day={selectedDay} onClose={() => setSelectedDay(null)} />}
    </div>
  );
}

function HeaderCard({ month, year, hijriRange, onPrev, onNext }) {
  return (
    <div style={{
      background: "white", borderRadius: 18, padding: "18px 18px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 16,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <button onClick={onPrev} className="press" style={navBtnStyle()}>‹</button>
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{monthName(month)}</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.goldDark, marginTop: 4, fontWeight: 500 }}>{hijriRange.startMonth} {hijriRange.startDay}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{year}</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.goldDark, marginTop: 4, fontWeight: 500 }}>{hijriRange.year}</div>
        </div>
      </div>
      <button onClick={onNext} className="press" style={navBtnStyle()}>›</button>
    </div>
  );
}

function CalendarGrid({ days, tk, onSelect }) {
  const first = days[0];
  const firstDow = first ? new Date(gregorianKey(first) + "T00:00:00").getDay() : 0;
  const last = days[days.length - 1];
  const lastDow = last ? new Date(gregorianKey(last) + "T00:00:00").getDay() : 6;
  const beforeBlanks = Array.from({ length: firstDow });
  const afterBlanks  = Array.from({ length: 6 - lastDow });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
      {beforeBlanks.map((_, i) => <BlankCell key={`pre${i}`} />)}
      {days.map(d => <DayCell key={gregorianKey(d)} day={d} isToday={gregorianKey(d) === tk} onSelect={onSelect} />)}
      {afterBlanks.map((_, i) => <BlankCell key={`post${i}`} />)}
    </div>
  );
}
function BlankCell() { return <div style={{ aspectRatio: "1 / 1" }} />; }

function DayCell({ day, isToday, onSelect }) {
  const g = day.gregorian, h = day.hijri;
  const yearlyEvs = EVENTS.filter(e => e.month === Number(h.month.number) && e.day === Number(h.day));
  const dow = new Date(gregorianKey(day) + "T00:00:00").getDay();
  const weeklyEvs = WEEKLY_EVENTS.filter(e => e.dayOfWeek === dow);
  const evs = [...yearlyEvs, ...weeklyEvs];
  const hasEvent = evs.length > 0;
  const sect = hasEvent ? evs[0].sect : null;
  const dotColor = sect ? SECT_COLOR[sect] : null;

  return (
    <button
      className="press"
      onClick={() => onSelect(day)}
      style={{
        aspectRatio: "1 / 1",
        background: isToday ? C.primary : "transparent",
        color: isToday ? "white" : C.ink,
        border: "none",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 0,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div style={{
        fontFamily: "Fraunces, serif",
        fontSize: 17,
        fontWeight: 500,
        color: isToday ? "white" : C.ink,
        lineHeight: 1,
      }}>
        {String(g.day).padStart(2, "0")}
      </div>
      <div style={{
        fontSize: 9,
        color: isToday ? "rgba(255,255,255,0.7)" : C.subtle,
        lineHeight: 1,
      }}>
        {h.day}
      </div>
      {dotColor && (
        <div style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: dotColor,
          position: "absolute",
          bottom: 6,
        }} />
      )}
    </button>
  );
}

function EventCard({ entry }) {
  const dotColor = SECT_COLOR[entry.sect];
  return (
    <div style={{
      background: "white",
      borderRadius: 14,
      padding: "14px 16px",
      border: `1px solid ${C.hairline}`,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 2 }}>
            {entry.name}
          </div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
            {entry.gregorianLabel} · {entry.hijriLabel}
          </div>
        </div>
        {entry.sect !== "both" && (
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: dotColor,
            textTransform: "uppercase",
            padding: "3px 8px",
            border: `1px solid ${dotColor}`,
            borderRadius: 999,
            flexShrink: 0,
          }}>
            {SECT_LABEL[entry.sect]}
          </div>
        )}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div style={{
      marginTop: 14,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      flexWrap: "wrap",
    }}>
      <LegendItem color={C.gold} label="Both" />
      <LegendItem color={C.primary} label="Sunni" />
      <LegendItem color={C.goldDark} label="Shia" />
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      <div style={{ fontSize: 11, color: C.body, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: "40px 0", textAlign: "center", color: C.muted, fontSize: 13 }}>
      Loading calendar…
    </div>
  );
}

function DaySheet({ day, onClose }) {
  const g = day.gregorian, h = day.hijri;

  // Yearly events keyed by Hijri month + day
  const yearlyEvs = EVENTS.filter(e => e.month === Number(h.month.number) && e.day === Number(h.day));

  // Weekly events keyed by Gregorian day-of-week (e.g. Friday)
  const dayOfWeek = new Date(gregorianKey(day) + "T00:00:00").getDay();
  const weeklyEvs = WEEKLY_EVENTS.filter(e => e.dayOfWeek === dayOfWeek);

  const evs = [...yearlyEvs, ...weeklyEvs];

  const dateKey = gregorianDateKey(g);

  return (
    <Sheet open={true} onClose={onClose} background={C.ivory}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.hairline }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: C.ink }}>
            {g.month.en} {g.day}, {g.year}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, color: C.goldDark, marginTop: 4 }}>
            {h.day} {h.month.en} {h.year} AH
          </div>
        </div>
        {evs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: C.muted, fontSize: 13 }}>
            No notable Islamic events recorded for this day.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {evs.map((e, i) => (
              <EventCardWithChecklist key={e.id || i} event={e} dateKey={dateKey} />
            ))}
          </div>
        )}
    </Sheet>
  );
}

function EventCardWithChecklist({ event, dateKey }) {
  const hasChecklist = !!(event.id && event.recommendations && event.recommendations.length > 0);
  const [state, setState] = useState(() => hasChecklist ? getEventCompletions(event.id, dateKey) : {});

  function toggle(practiceId) {
    const next = toggleCompletion(event.id, dateKey, practiceId);
    setState(next);
  }

  const completed = hasChecklist ? event.recommendations.filter(r => state[r.id]).length : 0;
  const total = hasChecklist ? event.recommendations.length : 0;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `1.5px solid ${SECT_COLOR[event.sect]}`,
    }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: event.sect === "both" ? 0 : 4 }}>
        {event.name}
      </div>
      {event.sect !== "both" && (
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: SECT_COLOR[event.sect], textTransform: "uppercase" }}>
          {SECT_LABEL[event.sect]}
        </div>
      )}
      {event.description && (
        <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55, marginTop: 6 }}>{event.description}</div>
      )}
      {hasChecklist && (
        <RecommendationsChecklist
          recommendations={event.recommendations}
          state={state}
          onToggle={toggle}
          completed={completed}
          total={total}
          pct={pct}
        />
      )}
    </div>
  );
}

function RecommendationsChecklist({ recommendations, state, onToggle, completed, total, pct }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ borderTop: `0.5px solid ${C.hairline}`, margin: "14px 0 12px" }} />
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 10,
      }}>
        Recommended Practices
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.body, fontWeight: 500 }}>
          Today's deeds
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 12, color: C.goldDark, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {completed} of {total} completed
        </div>
      </div>
      <div style={{ height: 5, background: C.hairline, borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
          transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)", borderRadius: 999,
        }} />
      </div>
      <div>
        {recommendations.map(r => (
          <PracticeRow
            key={r.id}
            recommendation={r}
            checked={!!state[r.id]}
            onToggle={() => onToggle(r.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PracticeRow({ recommendation: r, checked, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: "flex", gap: 12, padding: "12px 8px", borderRadius: 10,
      cursor: "pointer", userSelect: "none", WebkitTapHighlightColor: "transparent",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
        border: `1.5px solid ${checked ? C.goldDark : C.subtle}`,
        background: checked ? C.goldDark : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s, border-color 0.2s",
      }}>
        {checked && (
          <div style={{
            width: 10, height: 5, borderLeft: "2px solid white", borderBottom: "2px solid white",
            transform: "rotate(-45deg) translateY(-1px)",
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            fontFamily: "Fraunces, serif", fontSize: 14.5, fontWeight: 500, lineHeight: 1.35,
            color: checked ? C.muted : C.ink,
            textDecoration: checked ? "line-through" : "none",
            textDecorationColor: C.subtle, textDecorationThickness: "1px",
          }}>
            {r.title}
          </div>
          <TraditionTag tradition={r.tradition} />
        </div>
        <div style={{
          fontSize: 12.5, lineHeight: 1.5, marginTop: 4,
          color: checked ? C.subtle : C.body,
        }}>
          {r.description}
        </div>
        <div style={{
          fontFamily: "Fraunces, serif", fontSize: 11, fontStyle: "italic", marginTop: 6,
          color: checked ? C.subtle : C.goldDark,
        }}>
          {r.source}
        </div>
      </div>
    </div>
  );
}

function TraditionTag({ tradition }) {
  const colors = {
    both:  { color: C.goldDark, border: C.gold,     bg: "rgba(200, 169, 81, 0.10)" },
    sunni: { color: C.primary,  border: C.primary,  bg: "rgba(15, 61, 46, 0.06)"   },
    shia:  { color: C.goldDark, border: C.goldDark, bg: "rgba(168, 135, 48, 0.10)" },
  };
  const labels = { both: "Both", sunni: "Sunni", shia: "Shia" };
  const c = colors[tradition] || colors.both;
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 999, border: `1px solid ${c.border}`,
      color: c.color, background: c.bg, flexShrink: 0,
    }}>
      {labels[tradition]}
    </div>
  );
}

// ─── Helper utilities ───────────────────────────────────────────────────────

function navBtnStyle() {
  return {
    width: 36, height: 36, borderRadius: "50%",
    background: C.ivory, border: `0.5px solid ${C.hairline}`,
    color: C.body, fontSize: 20, fontWeight: 400,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  };
}

function monthName(m) {
  const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return names[m - 1] || "";
}

function buildHijriLabel(days) {
  if (!days || days.length === 0) {
    return { startMonth: "", startDay: "", year: "" };
  }
  const first = days[0].hijri;
  const last = days[days.length - 1].hijri;
  if (first.month.en === last.month.en) {
    return { startMonth: first.month.en, startDay: "", year: `${first.year} AH` };
  }
  return {
    startMonth: `${first.month.en} – ${last.month.en}`,
    startDay: "",
    year: `${first.year} AH`,
  };
}

function collectEvents(days) {
  if (!days || days.length === 0) return [];
  const out = [];
  for (const d of days) {
    const h = d.hijri, g = d.gregorian;
    const matches = EVENTS.filter(e => e.month === Number(h.month.number) && e.day === Number(h.day));
    for (const e of matches) {
      out.push({
        ...e,
        gregorianLabel: `${g.month.en.slice(0, 3)} ${g.day}, ${g.year}`,
        hijriLabel:     `${h.month.en} ${h.day}, ${h.year}`,
      });
    }
  }
  return out;
}
