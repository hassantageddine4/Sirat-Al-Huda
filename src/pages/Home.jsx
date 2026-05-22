// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Home — premium Islamic dashboard.
//
// Layout (Option B — glanceable header):
//   1. Header: greeting + location + hijri pill + settings
//      └─ Glanceable progress block: count + countdown + bar + 5 dots
//   2. Verse of the Day — emerald gradient card (English + Arabic + reference)
//   3. Islamic Calendar — cream card (hijri date hero + gregorian + events)
//   4. Today's Prayers — clean white list with tap-to-toggle rows
//
// All hooks and services preserved from the previous Home.jsx:
//   • useApp() for user profile
//   • usePrayerNotifications() for live prayer times + location
//   • getDailyVerse() for daily verse
//   • getAccurateHijriDate() + getUpcomingIslamicEvents() for hijri util
//
// Removed: old Quick Access tile section, old prayer-progress-inside-header,
//          old "next prayer" hero card, weekly chart, all decorative emojis.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getAccurateHijriDate, getUpcomingIslamicEvents } from "../utils/hijri";
import { usePrayerNotifications } from "../hooks/usePrayerNotifications";
import { formatTime } from "../services/prayerTimeService";
import { getDailyVerse } from "../services/quranVerseService";
import { getSession, isSessionComplete, TARGETS_PUBLIC } from "../services/adhkarService";
import Icon from "../components/common/Icon";

// ─── Constants ──────────────────────────────────────────────────────────────

const PRAYER_ARABIC_MAP = {
  Fajr:    "الفجر",
  Sunrise: "الشروق",
  Dhuhr:   "الظهر",
  Asr:     "العصر",
  Sunset:  "الغروب",
  Maghrib: "المغرب",
  Isha:    "العشاء",
};
const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Sunset", "Maghrib", "Isha"];
const FALLBACK_TIMES = {
  Fajr: "5:42 AM", Sunrise: "7:01 AM", Dhuhr: "12:30 PM", Asr: "3:45 PM", Sunset: "6:15 PM",
  Maghrib: "6:18 PM", Isha: "7:52 PM",
};
const FALLBACK_VERSE = {
  arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
  translation: "Indeed, with hardship comes ease.",
  ref: "Sūrah Ash-Sharḥ · 94:6",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [t, period] = timeStr.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function useCountdown(timeStr) {
  const [label, setLabel] = useState("—");
  useEffect(() => {
    function calc() {
      const tMins = timeToMinutes(timeStr);
      if (tMins == null) return;
      const now = new Date();
      const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      let diff = tMins * 60 - nowSecs;
      if (diff < 0) diff += 86400;
      const hh = Math.floor(diff / 3600);
      const mm = Math.floor((diff % 3600) / 60); const ss = diff % 60;
      setLabel(hh > 0 ? `${hh}h ${mm}m ${ss}s` : mm > 0 ? `${mm}m ${ss}s` : `${ss}s`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [timeStr]);
  return label;
}

// localStorage persistence for completed prayers (today only)
import { recordPrayerCompleted, recordPrayerUncompleted } from "../services/userStats";

const CHECKED_KEY = "sirat_prayers_done_today";
function loadCheckedForToday() {
  try {
    const raw = localStorage.getItem(CHECKED_KEY);
    if (!raw) return new Set();
    const { date, list } = JSON.parse(raw);
    const today = new Date().toDateString();
    if (date !== today) return new Set();
    return new Set(list || []);
  } catch { return new Set(); }
}
function saveChecked(set) {
  try {
    localStorage.setItem(CHECKED_KEY, JSON.stringify({
      date: new Date().toDateString(),
      list: [...set],
    }));
  } catch {}
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const {
    prayerTimes: apiTimes,
    location,
    loading: timesLoading,
    error: timesError,
  } = usePrayerNotifications();

  const liveTimes = useMemo(
    () => ({ ...FALLBACK_TIMES, ...(apiTimes ?? {}) }),
    [apiTimes]
  );

  const PRAYERS = useMemo(
    () => PRAYER_ORDER.map(name => ({
      name,
      arabic: PRAYER_ARABIC_MAP[name] ?? "",
      time: liveTimes[name] ?? "—",
    })),
    [liveTimes]
  );

  const [checked, setChecked] = useState(() => loadCheckedForToday());
  const [verse, setVerse] = useState(FALLBACK_VERSE);

  // Day key — flips at local midnight, on app resume, and every 60s. Drives
  // the verse useEffect below so a new verse appears every 24h reliably,
  // even if the app stays open across midnight.
  const [verseDayKey, setVerseDayKey] = useState(() => new Date().toDateString());
  useEffect(() => {
    const tick = () => {
      const k = new Date().toDateString();
      setVerseDayKey(prev => (prev === k ? prev : k));
    };
    const id = setInterval(tick, 60_000);
    let appHandle;
    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        appHandle = await App.addListener("appStateChange", ({ isActive }) => {
          if (isActive) tick();
        });
      } catch {}
    })();
    return () => {
      clearInterval(id);
      appHandle?.remove?.();
    };
  }, []);

  // Load daily verse from service — re-runs whenever the day flips
  useEffect(() => {
    let cancelled = false;
    getDailyVerse()
      .then(r => {
        if (cancelled || !r?.verse) return;
        setVerse({
          arabic:      r.verse.arabic,
          translation: r.verse.translation,
          surah:       r.verse.surah ?? "",
          ref:         r.verse.reference ?? r.verse.ref ?? "",
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [verseDayKey]);

  // Persist checked state
  useEffect(() => { saveChecked(checked); }, [checked]);

  function toggle(name) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        recordPrayerUncompleted(name);
      } else {
        next.add(name);
        recordPrayerCompleted(name);
      }
      return next;
    });
  }

  const firstName  = userProfile.name?.split(" ")[0] ?? "Friend";
  const hijri      = useMemo(() => getAccurateHijriDate(), []);
  const events     = useMemo(() => getUpcomingIslamicEvents(), []);
  const completed  = checked.size;
  const pct        = (completed / 5) * 100;

  // Determine current prayer (most recent past) and next (first upcoming)
  const { currentIdx, nextIdx } = useMemo(() => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let cur = -1, nxt = -1;
    for (let i = 0; i < PRAYERS.length; i++) {
      if (PRAYERS[i].name === "Sunrise" || PRAYERS[i].name === "Sunset") continue;
      const t = timeToMinutes(PRAYERS[i].time);
      if (t == null) continue;
      if (t <= nowMins) cur = i;
      if (nxt === -1 && t > nowMins) nxt = i;
    }
    if (nxt === -1) nxt = 0; // wrap to next day's Fajr
    return { currentIdx: cur, nextIdx: nxt };
  }, [PRAYERS]);

  const nextPrayer = PRAYERS[nextIdx] ?? null;
  const countdown = useCountdown(nextPrayer?.time ?? "");
  const todayGregorian = new Date().toLocaleDateString("en-US",
    { month: "long", day: "numeric" });
  const todayWeekday = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayYear = new Date().getFullYear();

  return (
    <div className="screen bg-ivory">

      {/* ═══════════════ HEADER ═══════════════════════════════════════════ */}
      <div className="flex-shrink-0 pt-safe relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)",
        }}>

        {/* Soft gold radial glow at top right */}
        <div className="absolute pointer-events-none"
          style={{
            top: -40, right: -40, width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,169,81,0.18), transparent 70%)",
          }}
        />

        <div className="relative px-5 pt-4 pb-5">
          {/* Top row: greeting + actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.55)",
                marginBottom: 2, fontWeight: 500,
              }}>
                {greeting()},
              </p>
              <h1 className="text-white font-black"
                  style={{ fontSize: 26, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                {firstName}
              </h1>
              <div className="flex items-center gap-1 mt-1.5"
                   style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>
                <Icon name="pin" size={10} />
                <span>
                  {timesLoading
                    ? "Fetching prayer times…"
                    : timesError
                      ? "Times unavailable"
                      : location?.city ?? "Locating…"}
                </span>
                {timesLoading && (
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    border: "1.5px solid rgba(200,169,81,0.6)",
                    borderTopColor: "transparent",
                    animation: "spin 0.9s linear infinite",
                    marginLeft: 4,
                  }} />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* Hijri pill */}
              <div className="px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                }}>
                <p style={{
                  fontSize: 11, fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                }}>
                  {hijri.day} {hijri.month.split(" ")[0]}
                </p>
              </div>
              {/* Settings */}
              <button onClick={() => navigate("/settings")}
                className="w-9 h-9 rounded-full flex items-center justify-center press"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                }}>
                <Icon name="settings" size={17} className="text-white" />
              </button>
            </div>
          </div>

          {/* Glanceable progress block */}
          <div className="rounded-2xl px-4 py-3.5"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.10)",
            }}>
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <p style={{
                  fontSize: 10, color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  Today's Progress
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-black text-white" style={{ fontSize: 24 }}>
                    {completed}
                  </span>
                  <span style={{
                    fontSize: 14, color: "rgba(255,255,255,0.45)",
                    fontWeight: 600,
                  }}>
                    /5 prayers
                  </span>
                </div>
              </div>
              <div className="text-right">
                {nextPrayer && completed < 5 ? (
                  <>
                    <p style={{
                      fontSize: 9, color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      fontWeight: 600,
                    }}>
                      Next
                    </p>
                    <p style={{
                      fontSize: 13, fontWeight: 700,
                      color: "#D9BF7A", marginTop: 2,
                    }}>
                      {nextPrayer.name} · {countdown}
                    </p>
                  </>
                ) : completed === 5 ? (
                  <p className="flex items-center gap-1.5"
                    style={{ fontSize: 12, color: "#6BFFB0", fontWeight: 600 }}>
                    <Icon name="check" size={11} />
                    All complete
                  </p>
                ) : null}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-2.5"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg,#D9BF7A,#C8A951)",
                  transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                }}
              />
            </div>

            {/* 5 prayer dots */}
            <div className="flex gap-1.5">
              {PRAYERS.filter(p => p.name !== "Sunrise" && p.name !== "Sunset").map(p => (
                <div key={p.name} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-full"
                    style={{
                      height: 3,
                      background: checked.has(p.name)
                        ? "#C8A951"
                        : "rgba(255,255,255,0.15)",
                      transition: "background 0.3s",
                    }}
                  />
                  <span style={{
                    fontSize: 9, color: "rgba(255,255,255,0.4)",
                    fontWeight: 500,
                  }}>
                    {p.name.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ BODY ═════════════════════════════════════════════ */}
      <div className="scroll-area px-4 pt-5 pb-nav"
           style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ─── Verse of the Day — premium emerald card ─────────────────── */}
        <VerseCard verse={verse} />

        {/* ─── Islamic Calendar ────────────────────────────────────────── */}
        <section>
          <SectionLabel>Islamic Calendar</SectionLabel>
          <CalendarCard
            hijri={hijri}
            gregorianMonth={todayGregorian}
            gregorianYear={todayYear}
            weekday={todayWeekday}
            events={events}
          />
        </section>

        {/* ─── Today's Prayers ─────────────────────────────────────────── */}
        <section>
          <SectionLabel>Today's Prayers</SectionLabel>
          <div className="rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: "0.5px solid #E8E2D8",
              boxShadow: "0 4px 14px rgba(10,8,6,0.05)",
            }}>
            {PRAYERS.map((prayer, i) => (
              <PrayerRow
                key={prayer.name}
                prayer={prayer}
                isLast={i === PRAYERS.length - 1}
                isChecked={checked.has(prayer.name)}
                isCurrent={i === currentIdx && !checked.has(prayer.name)}
                isNext={i === nextIdx && !checked.has(prayer.name)}
                countdown={i === nextIdx ? countdown : null}
                onToggle={() => toggle(prayer.name)}
              />
            ))}
          </div>
        </section>


        {/* ─── Post-Prayer Adhkar ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Post-Prayer Adhkar</SectionLabel>
          {(() => {
            let resume = null;
            for (const p of PRAYER_ORDER) {
              const s = getSession(p);
              const c = s.subhanAllah + s.alhamdulillah + s.allahuAkbar;
              if (c > 0 && !isSessionComplete(p)) { resume = { prayer: p, count: c }; break; }
            }
            const progress = resume ? Math.min(100, Math.round((resume.count / 100) * 100)) : 0;
            return (
              <button
                onClick={() => navigate(resume ? `/practice/adhkar?prayer=${resume.prayer}` : "/practice/adhkar")}
                className="w-full rounded-2xl text-left transition-transform active:scale-[0.98]"
                style={{
                  background: "white",
                  border: "0.5px solid #E8E2D8",
                  boxShadow: "0 4px 14px rgba(10,8,6,0.05)",
                  padding: "16px 18px",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: 46,
                      height: 46,
                      background: "linear-gradient(135deg, #1B5E48 0%, #2D7D5F 100%)",
                      color: "white",
                      fontFamily: "Fraunces, serif",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ٣٣
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#1A1614",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {resume ? `Resume ${resume.prayer} Tasbīḥāt` : "Begin Post-Prayer Adhkar"}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#7A7268",
                        marginTop: 2,
                      }}
                    >
                      {resume
                        ? `${resume.count} of 100 · Subḥān · Ḥamd · Akbar`
                        : "SubḥānAllāh · Alḥamdulillāh · Allāhu Akbar"}
                    </div>
                    {resume && (
                      <div
                        style={{
                          marginTop: 8,
                          height: 3,
                          borderRadius: 2,
                          background: "#F0EAE0",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #1B5E48, #2D7D5F)",
                            transition: "width 240ms ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B8AFA3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })()}
        </section>

        {/* ─── Quick Access ─────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Quick Access</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <QuickTile
              iconName="bookOpen"
              label="Quran"
              sub="Continue reading"
              onClick={() => navigate("/quran")}
            />
            <QuickTile
              iconName="beads"
              label="Dhikr"
              sub="Tasbih counter"
              onClick={() => navigate("/dhikr")}
            />
            <QuickTile
              iconName="duaBook"
              label="Duas"
              sub="Supplications"
              onClick={() => navigate("/practice/duas")}
            />
            <QuickTile
              iconName="edit"
              label="Journal"
              sub="Write today"
              onClick={() => navigate("/journal")}
            />
          </div>
        </section>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      color: "#7A7268", paddingLeft: 4, marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

// ─── Verse of the Day card ─────────────────────────────────────────────────

function formatVerseRef(verse) {
  if (!verse) return "";
  const surah = (verse.surah || "").trim();
  const ref   = (verse.ref || "").trim();
  if (surah && ref) return `${surah} · ${ref}`;
  return surah || ref;
}

function VerseCard({ verse }) {
  const ARABIC  = verse?.arabic      || "إِنَّ مَعَ الْعُسْرِ يُسْرًا";
  const ENGLISH = verse?.translation || "Indeed, with hardship comes ease.";
  const REF     = formatVerseRef(verse) || "Sūrah Ash-Sharḥ · 94:6";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        background: "linear-gradient(135deg,#0a2e22 0%,#0F3D2E 50%,#0a2e22 100%)",
        boxShadow: "0 8px 24px rgba(15,61,46,0.2)",
        padding: "16px 18px",
      }}>

      <div
        style={{
          position: "absolute",
          top: 12, left: 20, right: 20, height: 0.5,
          background: "linear-gradient(90deg,transparent,rgba(200,169,81,0.4),transparent)",
          pointerEvents: "none",
        }}
      />

      <p style={{
        fontSize: 9, color: "#D9BF7A",
        letterSpacing: "0.25em", textTransform: "uppercase",
        fontWeight: 700, opacity: 0.85,
        marginBottom: 12, textAlign: "center",
      }}>
        — Verse of the Day —
      </p>

      <p dir="rtl" style={{
        fontSize: 18, lineHeight: 1.7,
        fontFamily: "Amiri, serif",
        color: "white", fontWeight: 600,
        textAlign: "center", marginBottom: 14,
      }}>
        {ARABIC}
      </p>

      <p style={{
        fontSize: 13, lineHeight: 1.5,
        color: "rgba(255,255,255,0.92)",
        fontStyle: "italic", textAlign: "center",
        marginBottom: 14,
      }}>
        "{ENGLISH}"
      </p>

      <div style={{
        height: 0.5,
        background: "linear-gradient(90deg,transparent,rgba(200,169,81,0.3),transparent)",
        marginBottom: 10,
      }} />

      <p style={{
        fontSize: 11, color: "#D9BF7A",
        fontWeight: 600, letterSpacing: "0.1em",
        textAlign: "center",
      }}>
        {REF}
      </p>
    </div>
  );
}

// ─── Calendar card ─────────────────────────────────────────────────────────

function CalendarCard({ hijri, gregorianMonth, gregorianYear, weekday, events }) {
  const isMajorEvent = name => /eid|ramadan|laylat|ashura|mawlid|arafah/i.test(name);

  return (
    <div className="rounded-3xl relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#F4F0E8 0%,#EDE7D9 100%)",
        border: "0.5px solid #E8E2D8",
        boxShadow: "0 4px 16px rgba(10,8,6,0.06)",
        padding: 18,
      }}>

      {/* Top gold accent line */}
      <div className="absolute pointer-events-none"
        style={{
          top: 0, left: 18, right: 18, height: 1.5,
          background: "linear-gradient(90deg,transparent,#C8A951,transparent)",
          opacity: 0.6,
        }}
      />

      {/* Hijri + Gregorian row */}
      <div className="flex items-start justify-between mb-4 pt-1">
        <div className="flex-1">
          <p style={{
            fontSize: 36, fontWeight: 900,
            color: "#0F3D2E", lineHeight: 1, marginBottom: 2,
            letterSpacing: "-1px",
          }}>
            {hijri.day}
          </p>
          <p style={{
            fontSize: 16, fontWeight: 700,
            color: "#1C1814", marginBottom: 1,
          }}>
            {hijri.month}
          </p>
          <p style={{
            fontSize: 11, color: "#7A7268", fontWeight: 500,
          }}>
            {hijri.year} AH
          </p>
        </div>
        <div className="text-right pl-4"
          style={{ borderLeft: "0.5px solid #E8E2D8" }}>
          <p style={{
            fontSize: 14, fontWeight: 700,
            color: "#1C1814", marginBottom: 2,
          }}>
            {gregorianMonth}
          </p>
          <p style={{
            fontSize: 11, color: "#7A7268", fontWeight: 500,
          }}>
            {gregorianYear} · {weekday}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 0.5, background: "#E8E2D8", marginBottom: 14,
      }} />

      {/* Events label */}
      <p style={{
        fontSize: 9, color: "#A88730",
        letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, marginBottom: 10,
      }}>
        Upcoming Events
      </p>

      {events.length === 0 ? (
        <p className="italic"
          style={{ fontSize: 12, color: "#7A7268" }}>
          No major events in the next 60 days.
        </p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.slice(0, 4).map((ev, i) => {
            const major = isMajorEvent(ev.name);
            return (
              <li key={ev.name + i}
                  className="flex items-center gap-2.5">
                <div className="rounded-full flex-shrink-0"
                  style={{
                    width: 6, height: 6,
                    background: major ? "#C8A951" : "#A09890",
                  }}
                />
                <span className="flex-1 truncate"
                  style={{
                    fontSize: 13, fontWeight: 600, color: "#1C1814",
                  }}>
                  {ev.name}
                </span>
                <span style={{ fontSize: 11, color: "#7A7268" }}>
                  {ev.hijriLabel}
                </span>
                <span className="font-bold rounded-full px-2 py-0.5"
                  style={{
                    fontSize: 10,
                    background: major
                      ? "rgba(200,169,81,0.18)"
                      : "rgba(15,61,46,0.06)",
                    color: major ? "#A88730" : "#7A7268",
                  }}>
                  {ev.days}d
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Prayer row ────────────────────────────────────────────────────────────

function PrayerRow({ prayer, isLast, isChecked, isCurrent, isNext, countdown, onToggle }) {
  const isInfoOnly = prayer.name === "Sunrise" || prayer.name === "Sunset";

  // ── Sunrise / Sunset: slim info row, not tappable ──
  if (isInfoOnly) {
    return (
      <div
        className="w-full flex items-center gap-3 px-4"
        style={{
          paddingTop: 5, paddingBottom: 5,
          borderBottom: isLast ? "none" : "0.5px solid #E8E2D8",
          background: "rgba(232,226,216,0.28)",
        }}>
        {/* Sun glyph */}
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ width: 28, height: 28 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="#C8A951" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="18" r="3.2" />
            <path d="M2 22h20" />
            <path d="M5 18h1M18 18h1M6.5 13.5l.7.7M17.5 13.5l-.7.7" />
            {prayer.name === "Sunrise" ? (
              <>
                <path d="M12 2v8" />
                <path d="m8.5 5.5 3.5-3.5 3.5 3.5" />
              </>
            ) : (
              <>
                <path d="M12 10V2" />
                <path d="m8.5 6.5 3.5 3.5 3.5-3.5" />
              </>
            )}
          </svg>
        </div>

        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#7A7268" }}>
            {prayer.name}
          </span>
          <span style={{ fontSize: 11, color: "#A09890" }}>
            {prayer.time && prayer.time !== "—" ? formatTime(prayer.time) : prayer.time}
          </span>
        </div>

        <span dir="rtl"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: 12.5, color: "#A09890",
          }}>
          {prayer.arabic}
        </span>
      </div>
    );
  }

  // ── Real prayer rows ──
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 press text-left"
      style={{
        paddingTop: 7, paddingBottom: 7,
        borderBottom: isLast ? "none" : "0.5px solid #E8E2D8",
        background: isChecked
          ? "rgba(15,61,46,0.02)"
          : isCurrent
            ? "rgba(200,169,81,0.05)"
            : "transparent",
        transition: "background 0.2s",
      }}>

      {/* Status indicator */}
      <div className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: 28, height: 28,
          background: isChecked
            ? "#0F3D2E"
            : isCurrent
              ? "#C8A951"
              : "transparent",
          border: !isChecked && !isCurrent
            ? "1.5px solid #E8E2D8"
            : "none",
          color: "white",
          transition: "all 0.2s",
        }}>
        {isChecked && <Icon name="check" size={13} />}
      </div>

      {/* Name + time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: "#1C1814",
          }}>
            {prayer.name}
          </span>
          {isNext && (
            <span style={{
              fontSize: 8.5, fontWeight: 800,
              padding: "2px 6px", borderRadius: 99,
              background: "#C8A951", color: "#082819",
              letterSpacing: "0.08em",
            }}>
              NEXT
            </span>
          )}
        </div>
        <span style={{
          fontSize: 11, color: "#7A7268",
          marginTop: 1, display: "block",
        }}>
          {prayer.time && prayer.time !== "—" ? formatTime(prayer.time) : prayer.time}
          {isNext && countdown && ` · in ${countdown}`}
        </span>
      </div>

      {/* Arabic name */}
      <span dir="rtl"
        style={{
          fontFamily: "Amiri, serif",
          fontSize: 14, color: "#A09890",
        }}>
        {prayer.arabic}
      </span>
    </button>
  );
}

// ─── Quick access tile ────────────────────────────────────────────────────

function QuickTile({ iconName, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="press text-left"
      style={{
        background: "white",
        borderRadius: 16,
        border: "0.5px solid #E8E2D8",
        boxShadow: "0 2px 8px rgba(10,8,6,0.05)",
        padding: 14,
        display: "flex", flexDirection: "column", gap: 8,
        minHeight: 92,
      }}>
      <div
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, rgba(15,61,46,0.08), rgba(200,169,81,0.12))",
          border: "0.5px solid rgba(200,169,81,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0F3D2E",
        }}>
        <Icon name={iconName} size={18} strokeWidth={1.6} />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1814", marginBottom: 1 }}>
          {label}
        </p>
        <p style={{ fontSize: 11, color: "#7A7268" }}>
          {sub}
        </p>
      </div>
    </button>
  );
}
