// src/pages/MyProgress.jsx
// ─────────────────────────────────────────────────────────────────────────────
// My Progress — dedicated screen for streaks, stats, achievements.
// This is a placeholder/light version; richer stats come when the gamification
// data layer is fully persistent.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", primaryDark: "#082819",
  accent: "#C8A951", accentLight: "#D9BF7A", accentDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

// These will eventually hook into real persistence.
// For now, they show placeholder values and a clear "coming soon" line below.
const STATS = [
  { label: "Day Streak",       value: 14,  accent: true  },
  { label: "Prayers Today",    value: 3,   accent: false },
  { label: "Journal Entries",  value: 7,   accent: false },
  { label: "Weekly Consistent",value: "86%",accent: false },
  { label: "Total Prayers",    value: 182, accent: false },
  { label: "Longest Streak",   value: 14,  accent: false },
];

const ACHIEVEMENTS = [
  { icon: "sparkle",    title: "First Week",   desc: "7-day streak",         earned: true  },
  { icon: "star8",      title: "Consistent",   desc: "14-day streak",        earned: true  },
  { icon: "sunrise",    title: "Fajr Warrior", desc: "7 Fajr in a row",      earned: true  },
  { icon: "checkCircle",title: "30 Days",      desc: "30-day streak",        earned: false },
  { icon: "mosque",     title: "All 5 Daily",  desc: "All 5 prayers/day x7", earned: false },
  { icon: "edit",       title: "Reflective",   desc: "7 journal entries",    earned: false },
];

export default function MyProgress() {
  const navigate = useNavigate();

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="My Progress"
        subtitle="Streaks and achievements"
        onBack={() => navigate(-1)}
      />

      <div className="scroll-area px-4 pt-4 pb-nav" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Streak hero */}
        <div style={{
          background: "linear-gradient(135deg," + C.primary + "," + C.primaryLight + ")",
          borderRadius: 20, padding: "20px 22px",
          color: "white",
          boxShadow: "0 6px 20px rgba(15,61,46,0.18)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(200,169,81,0.22)",
            border: "1px solid rgba(200,169,81,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.accentLight, flexShrink: 0,
          }}>
            <Icon name="flame" size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(217,191,122,0.85)",
              marginBottom: 2,
            }}>
              Current streak
            </p>
            <p style={{ fontSize: 28, fontWeight: 900 }}>
              14 days
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              Keep it going — pray Maghrib to extend the streak today.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <section>
          <SectionLabel>Stats</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.label} style={{
                background: "white", borderRadius: 14,
                border: `0.5px solid ${C.border}`,
                boxShadow: "0 2px 8px rgba(10,8,6,0.05)",
                padding: "12px 6px",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 2,
              }}>
                <p style={{
                  fontSize: 22, fontWeight: 900,
                  color: s.accent ? C.accent : C.primary,
                }}>{s.value}</p>
                <p style={{
                  fontSize: 10, fontWeight: 600,
                  color: C.muted, textAlign: "center", lineHeight: 1.3,
                }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <SectionLabel>Achievements</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.title} style={{
                background: "white", borderRadius: 14,
                border: a.earned ? `1px solid rgba(15,61,46,0.18)` : `1px solid ${C.border}`,
                boxShadow: a.earned ? "0 2px 12px rgba(15,61,46,0.1)" : "none",
                padding: "12px 8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                opacity: a.earned ? 1 : 0.45,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: a.earned
                    ? "linear-gradient(135deg, rgba(15,61,46,0.08), rgba(15,61,46,0.14))"
                    : "rgba(15,61,46,0.05)",
                  border: a.earned
                    ? "1px solid rgba(200,169,81,0.3)"
                    : `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: a.earned ? C.primary : C.subtle,
                }}>
                  <Icon name={a.icon} size={22} strokeWidth={1.5} />
                </div>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: C.ink,
                  textAlign: "center", lineHeight: 1.2,
                }}>{a.title}</p>
                <p style={{ fontSize: 9, color: C.muted, textAlign: "center" }}>{a.desc}</p>
                {a.earned && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: C.primary,
                    background: "rgba(15,61,46,0.08)",
                    padding: "2px 8px", borderRadius: 99,
                  }}>Earned</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <p style={{
          fontSize: 11, color: C.muted, textAlign: "center",
          paddingLeft: 8, paddingRight: 8, marginTop: 4,
          lineHeight: 1.5,
        }}>
          More detailed progress tracking coming soon.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
      textTransform: "uppercase", color: C.muted,
      paddingLeft: 4, marginBottom: 10,
    }}>
      {children}
    </p>
  );
}
