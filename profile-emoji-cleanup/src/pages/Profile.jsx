// src/pages/Profile.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Profile screen — Overview + Settings tabs.
// All emojis replaced with Icon components for a consistent premium iOS feel.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { usePrayerNotifications } from "../hooks/usePrayerNotifications";
import { PRAYER_ARABIC } from "../services/prayerTimeService";
import { getDailyVerse } from "../services/quranVerseService";
import Icon from "../components/common/Icon";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", primaryDark: "#082819",
  accent: "#C8A951", accentLight: "#D9BF7A", accentDark: "#A88730",
  ivory: "#FAF7F2", offwhite: "#F4F0E8", parchment: "#EDE7D9",
  ink: "#1C1814", body: "#3A3530", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

// Per-prayer icon name (used in Settings tab Prayer Reminders rows)
const PRAYER_ICONS = {
  Fajr: "sunrise", Dhuhr: "clock", Asr: "clock",
  Maghrib: "sunset", Isha: "moon", Tahajjud: "moon",
};

// ─── Static mock data ─────────────────────────────────────────────────────────
const WEEKLY = [4, 5, 3, 5, 4, 5, 0]; // Mon–Sun
const DAYS   = ["M","T","W","T","F","S","S"];

const ACHIEVEMENTS = [
  { id: "first7",    icon: "sparkle",    title: "First Week",    desc: "7-day streak",         earned: true  },
  { id: "consistent",icon: "star8",      title: "Consistent",    desc: "14-day streak",        earned: true  },
  { id: "fajr7",     icon: "sunrise",    title: "Fajr Warrior",  desc: "7 Fajr in a row",      earned: true  },
  { id: "30days",    icon: "checkCircle",title: "30 Days",       desc: "30-day streak",        earned: false },
  { id: "allprayers",icon: "mosque",     title: "All 5 Daily",   desc: "All 5 prayers/day x7", earned: false },
  { id: "journal7",  icon: "edit",       title: "Reflective",    desc: "7 journal entries",    earned: false },
];

const GOALS_DEFAULT = [
  { id: "fard",   label: "Pray all 5 prayers",   progress: 60,  icon: "mosque"   },
  { id: "streak", label: "Maintain daily streak",progress: 100, icon: "flame"    },
  { id: "duas",   label: "Read daily duas",      progress: 40,  icon: "duaBook"  },
  { id: "quran",  label: "Quran 10 min/day",     progress: 75,  icon: "bookOpen" },
];

// ─── Shared UI pieces ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: C.muted,
                paddingLeft: 2, marginBottom: 8, marginTop: 4 }}>
      {children}
    </p>
  );
}

function Card({ children, style, className }) {
  return (
    <div className={className}
      style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`,
               boxShadow: "0 4px 16px rgba(10,8,6,0.08)", ...style }}>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className="press flex-shrink-0"
      style={{ width: 44, height: 24, borderRadius: 99, position: "relative",
               background: on ? C.primary : C.border, border: "none",
               transition: "background 0.2s", cursor: "pointer" }}>
      <div style={{ position: "absolute", top: 2,
                    left: on ? 22 : 2, width: 20, height: 20, borderRadius: "50%",
                    background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.2s" }} />
    </button>
  );
}

// RowItem — now takes an `iconName` prop for an SVG icon instead of an emoji string
function RowItem({ iconName, label, sub, chevron = true, onPress, last, right, danger }) {
  return (
    <button onClick={onPress}
      className="w-full flex items-center gap-3 px-4 press text-left"
      style={{ paddingTop: 13, paddingBottom: 13,
               borderBottom: last ? "none" : `1px solid ${C.border}`,
               background: "transparent" }}>
      {iconName && (
        <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: danger ? "rgba(239,68,68,0.08)" : "rgba(15,61,46,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: danger ? "#ef4444" : C.primary }}>
          <Icon name={iconName} size={16} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600,
                    color: danger ? "#ef4444" : C.ink }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{sub}</p>}
      </div>
      {right || (chevron && (
        <span style={{ color: C.subtle, fontSize: 18 }}>›</span>
      ))}
    </button>
  );
}

function StatPill({ value, label, accent }) {
  return (
    <div style={{ flex: 1, background: "white", borderRadius: 14,
                  border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(10,8,6,0.06)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 2, padding: "12px 6px" }}>
      <p style={{ fontSize: 22, fontWeight: 900,
                  color: accent ? C.accent : C.primary }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 600, color: C.muted,
                  textAlign: "center", lineHeight: 1.3 }}>{label}</p>
    </div>
  );
}

// ─── Quran Verse Preview (inside Settings tab) ───────────────────────────────
function QuranVersePreview() {
  const [verse,   setVerse]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDailyVerse()
      .then(r => { if (!cancelled) { setVerse(r.verse); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%",
                      border: "1.5px solid rgba(15,61,46,0.3)",
                      borderTopColor: C.primary,
                      animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontSize: 11, color: C.muted }}>Loading today's verse…</p>
      </div>
    );
  }

  if (!verse) return null;

  return (
    <div style={{ padding: "14px 16px" }}>
      {/* Label */}
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: C.accentDark, marginBottom: 10 }}>
        Today's Verse Preview
      </p>
      {/* Arabic */}
      <div style={{ background: `${C.primary}0A`, borderRadius: 12,
                    padding: "12px 14px", marginBottom: 10 }}>
        <p style={{ fontSize: 18, color: C.primary, fontFamily: "serif",
                    fontWeight: 600, direction: "rtl", textAlign: "right",
                    lineHeight: 2.0 }}>
          {verse.arabic}
        </p>
      </div>
      {/* Translation */}
      <p style={{ fontSize: 13, color: C.body, fontStyle: "italic",
                  lineHeight: 1.65, marginBottom: 6 }}>
        "{verse.translation}"
      </p>
      {/* Reference */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%",
                      background: C.accent, flexShrink: 0 }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>
          {verse.surah} · {verse.reference}
        </p>
      </div>
      {/* Notification preview text — emoji replaced with Icon */}
      <div style={{ marginTop: 10, background: `${C.accent}10`, borderRadius: 10,
                    padding: "8px 12px", borderLeft: `3px solid ${C.accent}40` }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: C.accentDark,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
          Notification Preview
        </p>
        <p style={{ fontSize: 11, color: C.body, lineHeight: 1.5,
                    display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.accentDark, display: "inline-flex" }}>
            <Icon name="bookOpen" size={12} />
          </span>
          Verse of the Day
        </p>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>
          "{verse.shortNotifText}" — {verse.reference}
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate();
  const { userProfile, signOut, updateProfile } = useApp();

  // Prayer notification system
  const notifSys = usePrayerNotifications();
  const [darkMode, setDarkMode] = useState(false);
  const [tab,      setTab]      = useState("overview"); // overview | settings

  // Aliases for readability
  const { prefs, prayerTimes, location, notifPermission, pendingCount,
          lastScheduled, loading: notifLoading, error: notifError,
          toggleMasterNotif, togglePrayer, setCalcMethod, setMadhab,
          setReminderOffset, refreshLocation, requestPermission, clearError,
          toggleQuranNotif, setQuranNotifTime,
          PRAYER_KEYS, CALC_METHODS, MADHABS } = notifSys;

  const todayDone = 3;
  const todayIdx  = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const name     = userProfile.name  ?? "Friend";
  const email    = userProfile.email ?? "";
  const initials = name.split(" ").map(w => w[0] ?? "").join("").slice(0, 2).toUpperCase();

  async function handleSignOut() {
    if (window.confirm("Are you sure you want to sign out?")) await signOut();
  }

  return (
    <div className="screen bg-ivory">

      {/* ────────────── HEADER ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>

        {/* Settings icon */}
        <div className="flex justify-end px-5 pt-3 pb-0">
          <button onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center press"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Icon name="settings" size={17} className="text-white" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center px-5 pb-5 pt-2">
          {/* Avatar */}
          <button className="press" style={{ marginBottom: 12, position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%",
                          border: "2px solid rgba(200,169,81,0.5)",
                          background: "rgba(255,255,255,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 26, fontWeight: 900 }}>{initials}</span>
            </div>
            {/* Edit badge — pencil icon */}
            <div style={{ position: "absolute", bottom: 0, right: 0,
                          width: 24, height: 24, borderRadius: "50%",
                          background: C.accent, border: `2px solid ${C.primary}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white" }}>
              <Icon name="edit" size={11} />
            </div>
            {/* Online dot */}
            <div style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14,
                          borderRadius: "50%", background: "#22c55e",
                          border: `2px solid ${C.primary}` }} />
          </button>

          <h2 className="font-black text-white" style={{ fontSize: 20, marginBottom: 2 }}>{name}</h2>
          {email && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10 }}>{email}</p>}

          {/* Tags */}
          <div className="flex gap-2 items-center">
            {[userProfile.religion ?? "Muslim", userProfile.language ?? "English"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.12)",
                                     color: "rgba(255,255,255,0.85)",
                                     fontSize: 11, fontWeight: 600,
                                     padding: "4px 12px", borderRadius: 99 }}>
                {t}
              </span>
            ))}
            <span style={{ background: "rgba(200,169,81,0.25)",
                           color: C.accentLight, fontSize: 11, fontWeight: 700,
                           padding: "4px 12px", borderRadius: 99,
                           display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="flame" size={11} />
              14 day streak
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 mx-4 mb-0">
          {[["overview","Overview"],["settings","Settings"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 py-2.5 text-sm font-semibold press"
              style={{
                color: tab === id ? "white" : "rgba(255,255,255,0.45)",
                borderBottom: tab === id ? `2px solid ${C.accent}` : "2px solid transparent",
                background: "transparent", transition: "all 0.18s",
              }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ────────────── SCROLL BODY ──────────────────────────────────────── */}
      <div className="scroll-area px-4 py-4">

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Today Summary */}
            <Card>
              <div className="px-4 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <SectionLabel>Today's Summary</SectionLabel>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>
                        {todayDone}
                      </span>
                      <span style={{ fontSize: 16, color: C.muted, fontWeight: 600 }}>/5 prayers</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px",
                                   borderRadius: 99, background: todayDone >= 3
                                     ? "rgba(15,61,46,0.1)" : "rgba(200,169,81,0.15)",
                                   color: todayDone >= 3 ? C.primary : C.accentDark,
                                   display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {todayDone === 5
                        ? (<>Completed <Icon name="check" size={11} /></>)
                        : todayDone >= 3 ? "On track" : "Catch up"}
                    </span>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                      Next: Asr at 3:45 PM
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 8, borderRadius: 99, overflow: "hidden",
                              background: "rgba(15,61,46,0.1)", marginBottom: 12 }}>
                  <div style={{ height: "100%", borderRadius: 99,
                                width: `${(todayDone / 5) * 100}%`,
                                background: `linear-gradient(90deg,${C.primaryLight},${C.primary})`,
                                transition: "width 0.6s" }} />
                </div>
                {/* Prayer dots */}
                <div className="flex gap-2">
                  {["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((p, i) => (
                    <div key={p} style={{ flex: 1, display: "flex",
                                          flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", height: 4, borderRadius: 99,
                                    background: i < todayDone ? C.primary : C.border,
                                    transition: "background 0.3s" }} />
                      <span style={{ fontSize: 9, color: i < todayDone ? C.primary : C.subtle }}>
                        {p.slice(0,3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Stats row */}
            <div>
              <SectionLabel>My Stats</SectionLabel>
              <div className="flex gap-3 mb-3">
                <StatPill value="14"  label="Day Streak"      accent />
                <StatPill value={todayDone}    label="Prayers Today"  />
                <StatPill value="7"   label="Journal Entries" />
              </div>
              <div className="flex gap-3">
                <StatPill value="86%" label="Weekly Consistent" />
                <StatPill value="182" label="Total Prayers"     />
                <StatPill value="14"  label="Longest Streak"    />
              </div>
            </div>

            {/* Weekly chart */}
            <Card>
              <div className="px-4 py-4">
                <SectionLabel>Weekly Progress</SectionLabel>
                <div className="flex gap-2 items-end" style={{ height: 80 }}>
                  {WEEKLY.map((val, i) => {
                    const isToday = i === todayIdx;
                    const v = isToday ? todayDone : val;
                    const barH = Math.max(5, Math.round((v / 5) * 60));
                    const completed5 = v === 5;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                        <span style={{ fontSize: 10, fontWeight: 600,
                                        color: isToday ? C.primary : C.subtle,
                                        display: "inline-flex", alignItems: "center",
                                        height: 12 }}>
                          {completed5
                            ? <Icon name="check" size={10} />
                            : (v || "")}
                        </span>
                        <div style={{ width: "100%", height: 60,
                                      background: "rgba(15,61,46,0.07)", borderRadius: 8,
                                      display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                          <div style={{ width: "100%", height: barH, borderRadius: 8,
                                        background: isToday
                                          ? `linear-gradient(0deg,${C.primary},${C.primaryLight})`
                                          : completed5 ? "rgba(15,61,46,0.5)" : "rgba(15,61,46,0.25)",
                                        transition: "height 0.5s" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: isToday ? 700 : 400,
                                        color: isToday ? C.primary : C.subtle }}>{DAYS[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Goals */}
            <div>
              <SectionLabel>My Goals</SectionLabel>
              <Card>
                {GOALS_DEFAULT.map((g, i) => (
                  <div key={g.id}
                    style={{ padding: "14px 16px",
                             borderBottom: i < GOALS_DEFAULT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{ width: 28, height: 28, borderRadius: 8,
                                    background: "rgba(15,61,46,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: C.primary, flexShrink: 0 }}>
                        <Icon name={g.icon} size={15} />
                      </div>
                      <p style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>{g.label}</p>
                      <span style={{ fontSize: 11, fontWeight: 700,
                                     color: g.progress === 100 ? "#22c55e" : C.primary }}>
                        {g.progress}%
                      </span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: C.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99,
                                    width: `${g.progress}%`, transition: "width 0.7s",
                                    background: g.progress === 100
                                      ? "#22c55e"
                                      : `linear-gradient(90deg,${C.primaryLight},${C.primary})` }} />
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <SectionLabel>Achievements</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {ACHIEVEMENTS.map(a => (
                  <div key={a.id}
                    style={{ background: "white", borderRadius: 14,
                             border: `1px solid ${a.earned ? "rgba(15,61,46,0.18)" : C.border}`,
                             boxShadow: a.earned ? "0 2px 12px rgba(15,61,46,0.1)" : "none",
                             padding: "12px 8px", display: "flex", flexDirection: "column",
                             alignItems: "center", gap: 6,
                             opacity: a.earned ? 1 : 0.45 }}>
                    {/* Icon plate */}
                    <div style={{ width: 44, height: 44, borderRadius: 12,
                                  background: a.earned
                                    ? "linear-gradient(135deg, rgba(15,61,46,0.08), rgba(15,61,46,0.14))"
                                    : "rgba(15,61,46,0.05)",
                                  border: a.earned ? "1px solid rgba(200,169,81,0.3)" : `1px solid ${C.border}`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: a.earned ? C.primary : C.subtle }}>
                      <Icon name={a.icon} size={22} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.ink,
                                textAlign: "center", lineHeight: 1.2 }}>{a.title}</p>
                    <p style={{ fontSize: 9, color: C.muted, textAlign: "center" }}>{a.desc}</p>
                    {a.earned && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.primary,
                                     background: "rgba(15,61,46,0.08)", padding: "2px 8px",
                                     borderRadius: 99 }}>Earned</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <SectionLabel>Tools</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <RowItem iconName="edit"     label="My Journal"     sub="Private reflections"          onPress={() => navigate("/journal")} />
                <RowItem iconName="compass"  label="Qibla Compass"  sub="Find direction of the Kaaba"  onPress={() => navigate("/qibla")}   />
                <RowItem iconName="message"  label="Ask a Scholar"  sub="imam-us.org"                  onPress={() => window.open("https://imam-us.org","_blank","noopener")} />
                <RowItem iconName="arrowUp"  label="My Progress"    sub="Streaks and achievements"      onPress={() => navigate("/progress")} last />
              </Card>
            </div>

            {/* Sign out */}
            <button onClick={handleSignOut}
              className="w-full press rounded-2xl font-semibold"
              style={{ height: 48, borderRadius: 16, border: "1.5px solid #fecaca",
                       background: "#fef2f2", color: "#ef4444", fontSize: 14 }}>
              Sign Out
            </button>

            <p style={{ textAlign: "center", color: C.subtle, fontSize: 11, paddingBottom: 8 }}>
              Sirat · Version 1.0.0
            </p>
            <div style={{ height: 24 }} />
          </div>
        )}

        {/* ══════════ SETTINGS TAB ══════════ */}
        {tab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ── Error banner ── */}
            {notifError && (
              <div style={{ background: "#fef2f2", borderRadius: 12, padding: "12px 14px",
                            border: "1.5px solid #fecaca", display: "flex",
                            alignItems: "flex-start", gap: 10 }}>
                <span style={{ flexShrink: 0, color: "#dc2626", display: "inline-flex", marginTop: 1 }}>
                  <Icon name="warning" size={16} />
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", marginBottom: 2 }}>
                    Notification Issue
                  </p>
                  <p style={{ fontSize: 11, color: "#b91c1c", lineHeight: 1.5 }}>{notifError}</p>
                  {notifPermission === "denied" && (
                    <button onClick={requestPermission}
                      style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#dc2626",
                               background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                      Open Settings to Enable →
                    </button>
                  )}
                </div>
                <button onClick={clearError}
                  style={{ color: "#dc2626", fontSize: 18, background: "transparent",
                           border: "none", cursor: "pointer", flexShrink: 0 }}>×</button>
              </div>
            )}

            {/* Account */}
            <div>
              <SectionLabel>Account</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <RowItem iconName="user"     label="Edit Profile"    sub={name}              onPress={() => navigate("/settings")} />
                <RowItem iconName="message"  label="Email Address"   sub={email || "Not set"} onPress={() => navigate("/settings")} />
                <RowItem iconName="settings" label="Change Password" sub="Update your password" onPress={() => navigate("/settings")} last />
              </Card>
            </div>

            {/* App preferences */}
            <div>
              <SectionLabel>App</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                {/* Master notification toggle */}
                <div className="flex items-center gap-3 px-4"
                  style={{ paddingTop: 13, paddingBottom: 13, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(15,61,46,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: C.primary }}>
                    <Icon name="bell" size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Prayer Notifications</p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                      {notifLoading ? "Updating…"
                        : prefs.notifEnabled
                          ? `${pendingCount} reminders scheduled`
                          : "Disabled"}
                    </p>
                  </div>
                  <Toggle on={prefs.notifEnabled} onToggle={toggleMasterNotif} />
                </div>
                {/* Dark mode */}
                <div className="flex items-center gap-3 px-4"
                  style={{ paddingTop: 13, paddingBottom: 13, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(15,61,46,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: C.primary }}>
                    <Icon name="moon" size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Dark Mode</p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Coming soon</p>
                  </div>
                  <Toggle on={darkMode} onToggle={() => setDarkMode(d => !d)} />
                </div>
                <RowItem iconName="globe" label="Language" sub={userProfile.language ?? "English"}
                  onPress={() => navigate("/settings")} last />
              </Card>
            </div>

            {/* Location status */}
            <div>
              <SectionLabel>Location</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <div className="flex items-center gap-3 px-4"
                  style={{ paddingTop: 13, paddingBottom: 13, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(15,61,46,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: C.primary }}>
                    <Icon name="pin" size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                      {location?.city ? `${location.city}${location.country ? ", " + location.country : ""}` : "Detecting location…"}
                    </p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                      {location
                        ? `${location.source === "granted" ? "GPS" : location.source === "ip_fallback" ? "IP-based (approximate)" : location.source} · ${location.lat?.toFixed(3)}, ${location.lon?.toFixed(3)}`
                        : "Used for prayer times"}
                    </p>
                  </div>
                  <button onClick={refreshLocation} className="press"
                    style={{ fontSize: 11, fontWeight: 700, color: C.primary, padding: "6px 12px",
                             borderRadius: 99, border: `1.5px solid ${C.primary}`, background: "transparent" }}>
                    Refresh
                  </button>
                </div>
                {lastScheduled && (
                  <div style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 11, color: C.muted }}>
                      Last updated: {new Date(lastScheduled.scheduledAt).toLocaleTimeString("en-US",
                        { hour: "numeric", minute: "2-digit" })} · {lastScheduled.count} notifications scheduled
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Prayer Reminders */}
            <div>
              <SectionLabel>Prayer Reminders</SectionLabel>
              {!prefs.notifEnabled && (
                <div style={{ padding: "10px 14px", marginBottom: 8, borderRadius: 12,
                              background: "rgba(15,61,46,0.06)", border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                    Enable notifications above to schedule prayer reminders.
                  </p>
                </div>
              )}
              <Card style={{ overflow: "hidden", opacity: prefs.notifEnabled ? 1 : 0.55 }}>
                {["Fajr","Dhuhr","Asr","Maghrib","Isha","Tahajjud"].map((name, i) => {
                  const isOn   = prefs.prayers[name] ?? false;
                  const time   = prayerTimes?.[name];
                  const offset = prefs.offsetMinutes?.[name] ?? 0;
                  const isLast = i === 5;
                  const iconName = PRAYER_ICONS[name] ?? "moon";
                  return (
                    <div key={name}
                      style={{ padding: "12px 16px",
                               borderBottom: isLast ? "none" : `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: 10,
                                      background: "rgba(15,61,46,0.08)",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      color: C.primary, flexShrink: 0 }}>
                          <Icon name={iconName} size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{name}</p>
                          <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                            {time
                              ? (offset > 0 ? `${offset} min before · ${time}` : time)
                              : notifLoading ? "Loading…" : "Time unavailable"}
                          </p>
                        </div>
                        <Toggle on={isOn} onToggle={() => togglePrayer(name)} />
                      </div>
                      {isOn && prefs.notifEnabled && (
                        <div style={{ marginTop: 8, display: "flex", gap: 6, paddingLeft: 44 }}>
                          {[0, 5, 10, 15].map(mins => (
                            <button key={mins}
                              onClick={() => setReminderOffset(name, mins)}
                              style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px",
                                       borderRadius: 99,
                                       border: `1px solid ${offset === mins ? C.primary : C.border}`,
                                       background: offset === mins ? C.primary : "transparent",
                                       color: offset === mins ? "white" : C.muted,
                                       cursor: "pointer" }}>
                              {mins === 0 ? "On time" : `${mins} min early`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* ── Daily Quran Motivation ── */}
            <div>
              <SectionLabel>Daily Quran Motivation</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <div className="flex items-center gap-3 px-4"
                  style={{ paddingTop: 13, paddingBottom: 13,
                           borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10,
                                background: "rgba(15,61,46,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: C.primary }}>
                    <Icon name="bookOpen" size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                      Daily Verse Reminder
                    </p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                      {prefs.quranNotif?.enabled ?? true
                        ? `Delivered at ${(() => {
                            const t = prefs.quranNotif?.time ?? "08:00";
                            const [h, m] = t.split(":").map(Number);
                            const p = h >= 12 ? "PM" : "AM";
                            const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                            return `${h12}:${String(m).padStart(2,"0")} ${p}`;
                          })()} daily`
                        : "Disabled"}
                    </p>
                  </div>
                  <Toggle
                    on={prefs.quranNotif?.enabled ?? true}
                    onToggle={toggleQuranNotif} />
                </div>

                {(prefs.quranNotif?.enabled ?? true) && prefs.notifEnabled && (
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 10 }}>
                      Delivery time
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {["06:00","07:00","08:00","09:00","12:00","17:00","21:00"].map(t => {
                        const [h, m] = t.split(":").map(Number);
                        const period = h >= 12 ? "PM" : "AM";
                        const h12    = h === 0 ? 12 : h > 12 ? h - 12 : h;
                        const label  = `${h12}:${String(m).padStart(2,"0")} ${period}`;
                        const isOn   = (prefs.quranNotif?.time ?? "08:00") === t;
                        return (
                          <button key={t} onClick={() => setQuranNotifTime(t)}
                            className="press"
                            style={{ fontSize: 11, fontWeight: 600, padding: "5px 11px",
                                     borderRadius: 99, cursor: "pointer",
                                     border: `1px solid ${isOn ? C.primary : C.border}`,
                                     background: isOn ? C.primary : "transparent",
                                     color: isOn ? "white" : C.muted }}>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <QuranVersePreview />
              </Card>
            </div>

            {/* Islamic Preferences */}
            <div>
              <SectionLabel>Islamic Preferences</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <div style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(15,61,46,0.08)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: C.primary }}>
                      <Icon name="mosque" size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Calculation Method</p>
                      <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                        {CALC_METHODS[prefs.calcMethod]?.full ?? prefs.calcMethod}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Object.keys(CALC_METHODS).map(m => (
                      <button key={m} onClick={() => setCalcMethod(m)} className="press"
                        style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px",
                                 borderRadius: 99, border: `1px solid ${prefs.calcMethod === m ? C.primary : C.border}`,
                                 background: prefs.calcMethod === m ? C.primary : "transparent",
                                 color: prefs.calcMethod === m ? "white" : C.muted, cursor: "pointer" }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(15,61,46,0.08)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: C.primary }}>
                      <Icon name="book" size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Madhab (Asr calculation)</p>
                      <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{prefs.madhab}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Object.keys(MADHABS).map(m => (
                      <button key={m} onClick={() => setMadhab(m)} className="press"
                        style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px",
                                 borderRadius: 99, border: `1px solid ${prefs.madhab === m ? C.primary : C.border}`,
                                 background: prefs.madhab === m ? C.primary : "transparent",
                                 color: prefs.madhab === m ? "white" : C.muted, cursor: "pointer" }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <RowItem iconName="pin" label="Prayer Time Location"
                  sub={location?.city ?? "Tap Location above to refresh"} onPress={refreshLocation} last />
              </Card>
            </div>

            {/* Danger zone */}
            <div>
              <SectionLabel>Account Actions</SectionLabel>
              <Card style={{ overflow: "hidden" }}>
                <RowItem iconName="external" label="Sign Out" onPress={handleSignOut} danger />
                <RowItem iconName="trash"    label="Delete Account" sub="Permanently remove your data"
                  onPress={() => navigate("/settings")} danger last />
              </Card>
            </div>

            <p style={{ textAlign: "center", color: C.subtle, fontSize: 11 }}>
              Sirat · Version 1.0.0
            </p>
            <div style={{ height: 24 }} />
          </div>
        )}
      </div>
    </div>
  );
}
