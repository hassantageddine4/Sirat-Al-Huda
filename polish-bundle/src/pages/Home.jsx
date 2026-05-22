// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Home — keeps all your real data hooks (AppContext, usePrayerNotifications,
// quranVerseService, hijri util). The Islamic Calendar section at the bottom
// is rewritten as a premium gradient card matching the rest of the app's
// visual language.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getAccurateHijriDate, getUpcomingIslamicEvents } from "../utils/hijri";
import { usePrayerNotifications } from "../hooks/usePrayerNotifications";
import { getDailyVerse } from "../services/quranVerseService";
import Icon from "../components/common/Icon";

const PRAYER_ARABIC_MAP = {
  Fajr:    { arabic: "الفجر",  iconName: "sunrise" },
  Dhuhr:   { arabic: "الظهر",  iconName: "clock"   },
  Asr:     { arabic: "العصر",  iconName: "clock"   },
  Maghrib: { arabic: "المغرب", iconName: "sunset"  },
  Isha:    { arabic: "العشاء", iconName: "moon"    },
};
const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const FALLBACK_TIMES = { Fajr: "5:42 AM", Dhuhr: "12:30 PM", Asr: "3:45 PM", Maghrib: "6:18 PM", Isha: "7:52 PM" };
const VERSES = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Indeed, with hardship comes ease.", ref: "Surah 94:6" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", translation: "Whoever relies upon Allah — He is sufficient for him.", ref: "Surah 65:3" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Indeed, Allah is with the patient.", ref: "Surah 2:153" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", translation: "Remember Me, and I will remember you.", ref: "Surah 2:152" },
];
const QUICK = [
  { iconName: "bookOpen", label: "Quran",   sub: "Continue reading", route: "/quran"         },
  { iconName: "beads",    label: "Dhikr",   sub: "Tasbih counter",   route: "/practice"      },
  { iconName: "prayer",   label: "Duas",    sub: "Supplications",    route: "/practice/duas" },
  { iconName: "edit",     label: "Journal", sub: "Write today",      route: "/journal"       },
];
const WEEK_DATA = [4, 5, 3, 5, 4, 5, 0];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function todayDayIndex() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }
function nextPrayerIdx(completedSet, prayerList) {
  for (let i = 0; i < prayerList.length; i++) if (!completedSet.has(prayerList[i].name)) return i;
  return -1;
}
function useCountdown(timeStr) {
  const [label, setLabel] = useState("—");
  useEffect(() => {
    function calc() {
      if (!timeStr) return;
      const [t, period] = timeStr.split(" ");
      let [h, m] = t.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      const now = new Date();
      const tgt = new Date(); tgt.setHours(h, m, 0, 0);
      let diff = tgt - now;
      if (diff < 0) diff += 86400000;
      const hh = Math.floor(diff / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      setLabel(hh > 0 ? `${hh}h ${mm}m` : `${mm}m`);
    }
    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, [timeStr]);
  return label;
}

function PrayerRow({ prayer, idx, isChecked, isCurrent, isNext, onToggle }) {
  return (
    <button onClick={() => onToggle(prayer.name)} className="w-full flex items-center gap-3 px-4 press text-left"
      style={{ paddingTop: 13, paddingBottom: 13, borderBottom: idx < 4 ? "1px solid #E8E2D8" : "none",
               background: isCurrent ? "rgba(15,61,46,0.05)" : "transparent", transition: "background 0.2s" }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: isChecked ? "#0F3D2E" : "rgba(15,61,46,0.08)", border: isChecked ? "none" : "1.5px solid #E8E2D8" }}>
        {isChecked ? <Icon name="check" size={13} className="text-white" />
          : <span style={{ fontSize: 9, color: "#0F3D2E", fontWeight: 700 }}>{prayer.name.slice(0,3).toUpperCase()}</span>}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold" style={{ color: "#1C1814" }}>{prayer.name}</span>
          {isCurrent && !isChecked && (<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(15,61,46,0.12)", color: "#0F3D2E" }}>NOW</span>)}
          {isNext && !isCurrent && (<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(200,169,81,0.18)", color: "#A88730" }}>NEXT</span>)}
        </div>
        <span className="text-xs" style={{ color: "#7A7268" }}>{prayer.time}</span>
      </div>
      <span className="text-sm" style={{ color: "#A09890", fontFamily: "serif" }} dir="rtl">{prayer.arabic}</span>
    </button>
  );
}

function SectionLabel({ children, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A7268" }}>{children}</p>
      {action && (<button onClick={onAction} className="press" style={{ fontSize: 12, fontWeight: 600, color: "#0F3D2E" }}>{action}</button>)}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const { prayerTimes: apiTimes, location, loading: timesLoading, error: timesError } = usePrayerNotifications();

  const liveTimes = useMemo(() => ({ ...FALLBACK_TIMES, ...(apiTimes ?? {}) }), [apiTimes]);
  const PRAYERS = useMemo(() => PRAYER_ORDER.map(name => ({
    name, arabic: PRAYER_ARABIC_MAP[name]?.arabic ?? "",
    iconName: PRAYER_ARABIC_MAP[name]?.iconName ?? "prayer", time: liveTimes[name] ?? "—",
  })), [liveTimes]);

  const [checked, setChecked] = useState(() => new Set(["Fajr"]));
  const [dismissVerse, setDismissVerse] = useState(false);
  const staticVerse = useMemo(() => VERSES[new Date().getDate() % VERSES.length], []);
  const [verse, setVerse] = useState(staticVerse);

  useEffect(() => {
    let cancelled = false;
    getDailyVerse().then(r => {
      if (!cancelled && r.verse) {
        setVerse({ arabic: r.verse.arabic, translation: r.verse.translation,
                   ref: r.verse.reference ?? r.verse.ref ?? "" });
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const firstName  = userProfile.name?.split(" ")[0] ?? "Friend";
  const hijri      = useMemo(() => getAccurateHijriDate(), []);
  const events     = useMemo(() => getUpcomingIslamicEvents(), []);
  const completed  = checked.size;
  const pct        = (completed / 5) * 100;
  const todayIdx   = todayDayIndex();
  const nextIdx    = nextPrayerIdx(checked, PRAYERS);
  const nextPrayer = PRAYERS[nextIdx] ?? null;
  const countdown  = useCountdown(nextPrayer?.time ?? "");

  const currentIdx = useMemo(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const tMins = PRAYERS.map(p => {
      const t = p.time.replace(" AM","").replace(" PM","");
      const [h, m] = t.split(":").map(Number);
      const raw = p.time;
      const isPM = raw.includes("PM") && h !== 12;
      const isAM_12 = raw.includes("AM") && h === 12;
      const h24 = isPM ? h + 12 : isAM_12 ? 0 : h;
      return h24 * 60 + m;
    });
    let cur = 4;
    for (let i = tMins.length - 1; i >= 0; i--) if (mins >= tMins[i]) { cur = i; break; }
    return cur;
  }, [PRAYERS]);

  const statusLabel = completed === 5 ? "All complete" : completed >= 3 ? "On track" : completed >= 1 ? "In progress" : "Not started";
  const statusBg = completed === 5 ? "rgba(46,125,90,0.2)" : completed >= 3 ? "rgba(200,169,81,0.18)" : "rgba(255,255,255,0.1)";
  const statusFg = completed === 5 ? "#6BFFB0" : completed >= 3 ? "#D9BF7A" : "rgba(255,255,255,0.6)";

  function toggle(name) {
    setChecked(prev => { const next = new Set(prev); next.has(name) ? next.delete(name) : next.add(name); return next; });
  }

  const todayGregorianStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 52%,#1A5C44 100%)" }}>
        <div className="flex items-start justify-between px-5 pt-4">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{greeting()},</p>
            <h1 className="text-2xl font-black text-white">{firstName}</h1>
            <div className="flex items-center gap-1 mt-1">
              <Icon name="pin" size={10} className="text-white/40" />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                {timesLoading ? "Fetching prayer times…" : timesError ? "Times unavailable — check connection"
                  : location?.city ? location.city : "Locating…"}
              </p>
              {timesLoading && (<div style={{ width: 8, height: 8, borderRadius: "50%",
                border: "1.5px solid rgba(200,169,81,0.6)", borderTopColor: "transparent",
                animation: "spin 0.9s linear infinite" }} />)}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{hijri.day} {hijri.month.split(" ")[0]}</p>
            </div>
            <button onClick={() => navigate("/settings")} className="w-9 h-9 rounded-full flex items-center justify-center press"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon name="settings" size={17} className="text-white" />
            </button>
          </div>
        </div>

        <div className="mx-4 mt-4 mb-4 rounded-2xl px-4 py-3.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-start justify-between mb-2.5">
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Prayers today</p>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-white" style={{ fontSize: 26 }}>{completed}</span>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>/5</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: statusBg, color: statusFg }}>{statusLabel}</span>
              {nextPrayer && (<p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{nextPrayer.name} in {countdown}</p>)}
              {!nextPrayer && (<p className="flex items-center gap-1" style={{ fontSize: 11, color: "rgba(107,255,176,0.7)" }}>
                <Icon name="check" size={10} className="text-emerald-300" />All prayers done today</p>)}
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2.5" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
              background: "linear-gradient(90deg,#D9BF7A,#C8A951)" }} />
          </div>
          <div className="flex gap-1.5">
            {PRAYERS.map(p => (
              <div key={p.name} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full" style={{ background: checked.has(p.name) ? "#C8A951" : "rgba(255,255,255,0.15)", transition: "background 0.3s" }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{p.name.slice(0,3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-area px-4 pt-4 pb-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {nextPrayer && (
          <div className="rounded-2xl animate-fade-in overflow-hidden" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Icon name="clock" size={22} className="text-accent" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Next prayer</p>
                <p className="font-black text-white" style={{ fontSize: 20, lineHeight: 1.1 }}>{nextPrayer.name}</p>
                <p style={{ fontSize: 12, color: "#D9BF7A" }}>{nextPrayer.time}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-white" style={{ fontSize: 28 }}>{countdown}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>remaining</p>
              </div>
            </div>
          </div>
        )}

        <div className="animate-fade-in" style={{ animationDelay: "0.04s" }}>
          <SectionLabel>Quick Access</SectionLabel>
          <div className="flex gap-3">
            {QUICK.map(a => (
              <button key={a.label} onClick={() => navigate(a.route)} className="flex flex-col items-center gap-2 press" style={{ flex: 1 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "white", border: "1px solid #E8E2D8", boxShadow: "0 2px 8px rgba(10,8,6,0.07)" }}>
                  <Icon name={a.iconName} size={22} className="text-primary" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1C1814" }}>{a.label}</p>
                  <p style={{ fontSize: 9, color: "#7A7268" }}>{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.08s" }}>
          <SectionLabel action="Details →" onAction={() => navigate("/progress")}>Today's Prayers</SectionLabel>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E8E2D8", boxShadow: "0 4px 16px rgba(10,8,6,0.08)" }}>
            {PRAYERS.map((p, i) => (
              <PrayerRow key={p.name} prayer={p} idx={i} isChecked={checked.has(p.name)} isCurrent={i === currentIdx} isNext={i === nextIdx} onToggle={toggle} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.12s" }}>
          {[
            { val: "14", label: "Day streak", iconName: "flame", gold: true },
            { val: `${completed}/5`, label: "Today", iconName: "mosque", gold: false },
            { val: "86%", label: "This week", iconName: "arrowUp", gold: false },
          ].map(s => (
            <div key={s.label} className="rounded-2xl flex flex-col items-center gap-1 py-3 px-2"
              style={{ background: "white", border: "1px solid #E8E2D8", boxShadow: "0 2px 8px rgba(10,8,6,0.06)" }}>
              <Icon name={s.iconName} size={20} className={s.gold ? "text-accent" : "text-primary"} />
              <p className="font-black" style={{ fontSize: 20, color: s.gold ? "#C8A951" : "#0F3D2E" }}>{s.val}</p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#7A7268", textAlign: "center" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 animate-fade-in" style={{ animationDelay: "0.14s", background: "white", border: "1px solid #E8E2D8", boxShadow: "0 4px 16px rgba(10,8,6,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>This Week</SectionLabel>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#0F3D2E" }}>86% consistent</p>
          </div>
          <div className="flex gap-2 items-end" style={{ height: 72 }}>
            {WEEK_DATA.map((count, i) => {
              const isToday = i === todayIdx;
              const val = isToday ? completed : count;
              const barH = Math.max(6, Math.round((val / 5) * 56));
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                  <div className="w-full rounded-xl overflow-hidden flex items-end" style={{ height: 56, background: "rgba(15,61,46,0.07)" }}>
                    <div className="w-full rounded-xl" style={{ height: barH, transition: "height 0.5s cubic-bezier(.4,0,.2,1)",
                      background: isToday ? "linear-gradient(0deg,#0F3D2E,#1A5C44)" : val === 5 ? "rgba(15,61,46,0.45)" : "rgba(15,61,46,0.25)" }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: isToday ? 700 : 500, color: isToday ? "#0F3D2E" : "#A09890" }}>{DAYS[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {!dismissVerse && (
          <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.18s", background: "linear-gradient(135deg,#082819,#0F3D2E)" }}>
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A951" }}>Verse of the Day</p>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                </div>
                <button onClick={() => setDismissVerse(true)} aria-label="Dismiss"
                  className="press w-7 h-7 -mr-1 rounded-full flex items-center justify-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon name="close" size={14} />
                </button>
              </div>
              <p className="text-right leading-relaxed mb-2" style={{ fontSize: 19, color: "rgba(255,255,255,0.9)", fontFamily: "serif" }} dir="rtl">{verse.arabic}</p>
              <p className="italic leading-relaxed mb-1.5" style={{ fontSize: 13, color: "rgba(255,255,255,0.62)" }}>"{verse.translation}"</p>
              <div className="flex items-center gap-2">
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8A951", flexShrink: 0 }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: "#D9BF7A" }}>{verse.ref}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── REDESIGNED Islamic Calendar — premium gradient hero ─────────── */}
        <div
          className="rounded-3xl overflow-hidden animate-fade-in relative"
          style={{
            animationDelay: "0.2s",
            background: "linear-gradient(135deg,#0F3D2E 0%,#1A5C44 60%,#082819 100%)",
          }}>

          {/* Decorative ornament SVGs */}
          <svg width="180" height="180" viewBox="0 0 180 180" className="absolute top-0 right-0 -mt-4 -mr-6 text-accent/12 pointer-events-none" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6">
              <path d="M90 30 a60 60 0 0 1 0 120 a60 60 0 0 1 0 -120" />
              <path d="M90 50 a40 40 0 0 1 0 80 a40 40 0 0 1 0 -80" />
              <path d="M90 30 L100 70 L140 70 L108 95 L120 140 L90 115 L60 140 L72 95 L40 70 L80 70 Z" />
            </g>
          </svg>

          {/* Header label */}
          <div className="relative px-5 pt-5 flex items-center gap-2">
            <Icon name="moon" size={13} className="text-accent-light/90" />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(217,191,122,0.9)" }}>
              Islamic Calendar
            </p>
            <span className="ml-auto text-[10px] text-white/50">{todayGregorianStr}</span>
          </div>

          {/* Hero hijri date */}
          <div className="relative px-5 pt-3 pb-4 flex items-end gap-3">
            <span className="font-black text-white leading-none tracking-tight" style={{ fontSize: 60 }}>
              {hijri.day}
            </span>
            <div className="pb-2">
              <p className="font-bold text-white leading-tight" style={{ fontSize: 20 }}>
                {hijri.month}
              </p>
              <p className="leading-tight" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                {hijri.year} AH
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mx-5 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Upcoming events */}
          <div className="relative px-5 pt-3.5 pb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Icon name="star" size={11} className="text-accent-light/80" />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(217,191,122,0.7)" }}>
                Upcoming Events
              </p>
            </div>

            {events.length > 0 ? (
              <ul style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {events.slice(0, 4).map((ev, i) => {
                  const isMajor = /eid|ramadan|laylat|ashura|mawlid/i.test(ev.name);
                  return (
                    <li key={ev.name + i} className="flex items-center gap-3">
                      <div
                        className="rounded-full flex-shrink-0"
                        style={{
                          width: 7, height: 7,
                          background: isMajor ? "#D9BF7A" : "rgba(217,191,122,0.45)",
                        }}
                      />
                      <p className="flex-1 font-semibold text-white truncate" style={{ fontSize: 13 }}>
                        {ev.name}
                      </p>
                      <p className="text-white/50" style={{ fontSize: 11 }}>{ev.hijriLabel}</p>
                      <span
                        className="font-bold rounded-full px-2 py-0.5"
                        style={{
                          fontSize: 10,
                          background: isMajor ? "rgba(217,191,122,0.22)" : "rgba(255,255,255,0.08)",
                          color:      isMajor ? "#D9BF7A" : "rgba(255,255,255,0.7)",
                        }}>
                        {ev.days}d
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-white/50 text-xs italic">No major events in the next 60 days.</p>
            )}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
