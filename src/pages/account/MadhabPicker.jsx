// src/pages/account/MadhabPicker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Picker for madhab — affects Asr time calculation only.
//
// Three madhabs (Shafi'i, Maliki, Hanbali) compute Asr the same way ("Standard").
// Hanafi uses a longer shadow length (later Asr).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";
import { getMadhabsForBranch } from "../../services/branchService";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  accent: "#C8A951", accentDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

const MADHAB_NOTES = {
  Hanafi:    "Asr begins when an object's shadow is twice its height plus the noon shadow.",
  "Shafi'i": "Asr begins when an object's shadow equals its height plus the noon shadow (standard).",
  Maliki:    "Same Asr calculation as Shafi'i (standard timing).",
  Hanbali:   "Same Asr calculation as Shafi'i (standard timing).",
  "Ja'farī":  "Twelver Shia school. Asr is calculated similarly to Shafi'i, but combining Dhuhr-Asr and Maghrib-Isha is permitted.",
};

export default function MadhabPicker() {
  const navigate = useNavigate();
  const { prefs, setMadhab, setBranch, MADHABS } = usePrayerNotifications();
  const branch = prefs?.branch ?? null;
  const visibleMadhabs = Object.fromEntries(Object.entries(MADHABS).filter(([k]) => getMadhabsForBranch(branch || "shia").includes(k)));

  function pick(madhabKey) {
    setMadhab(madhabKey);
    navigate(-1);
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Madhab"
        subtitle="Affects Asr prayer time"
        onBack={() => navigate(-1)}
      />

      <div className="scroll-area px-4 pt-4 pb-nav">

        {/* Sunni / Shia toggle */}
        <div style={{
          display: "flex",
          padding: 3,
          background: "#EDE7D9",
          borderRadius: 12,
          marginBottom: 14,
        }}>
          {[{ id: "shia", label: "Shia" }, { id: "sunni", label: "Sunni" }].map(p => {
            const active = (branch || "shia") === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setBranch(p.id, null)}
                className="press"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? "white" : "transparent",
                  color: active ? C.primary : C.muted,
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}>
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Explanation banner */}
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          padding: 14, marginBottom: 16,
        }}>
          <p style={{ fontSize: 12, color: C.body, lineHeight: 1.55 }}>
            {(branch || "shia") === "shia"
              ? "Twelver Shia follow the Ja'farī school. Asr is calculated similarly to Shafi'i, but combining Dhuhr-Asr and Maghrib-Isha is permitted under Shia jurisprudence."
              : "Your madhab only affects when Asr begins. Hanafi calculates Asr later in the afternoon than the other three schools, which all use the standard shadow length."}
          </p>
        </div>

        {/* Picker list */}
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
          overflow: "hidden",
        }}>
          {Object.entries(visibleMadhabs).map(([key, _], i, arr) => {
            const isSelected = prefs.madhab === key;
            return (
              <button
                key={key}
                onClick={() => pick(key)}
                className="press"
                style={{
                  width: "100%", textAlign: "left",
                  padding: "14px 16px",
                  borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none",
                  background: isSelected ? "rgba(15,61,46,0.04)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 700, color: C.ink,
                    marginBottom: 2,
                  }}>
                    {key}
                  </p>
                  <p style={{
                    fontSize: 11, color: C.muted, lineHeight: 1.5,
                  }}>
                    {MADHAB_NOTES[key] ?? "Asr calculation school."}
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    color: C.primary, flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <Icon name="check" size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p style={{
          fontSize: 11, color: C.muted, marginTop: 12, paddingLeft: 4,
          lineHeight: 1.5,
        }}>
          Asr time updates automatically when you change your madhab.
        </p>
      </div>
    </div>
  );
}
