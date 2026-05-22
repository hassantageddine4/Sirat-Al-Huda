// src/pages/account/CalculationMethodPicker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Picker for the prayer-time calculation method.
// The method affects Fajr and Isha angle assumptions; pick the authority
// most relevant to your region or community.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";
import { getMethodsForBranch } from "../../services/branchService";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  accent: "#C8A951", accentDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

// Brief, plain-English regional/community note for each method.
// Keeps the picker informative without overwhelming the user.
const METHOD_NOTES = {
  ISNA:      "Common in North America. Fajr/Isha at 15° below horizon.",
  MWL:       "Used by many international communities. Fajr 18°, Isha 17°.",
  Egypt:     "Standard across much of the Arab world.",
  Makkah:    "Used in and around Makkah and most of Saudi Arabia.",
  Karachi:   "Common in South Asia (Pakistan, India, Bangladesh, Afghanistan).",
  Tehran:    "Used in Iran by the Institute of Geophysics, Tehran.",
  Jafari:    "Shia Ithna-Ashari calculation (different angles).",
  Gulf:      "Used across Gulf states.",
  Kuwait:    "Official method of Kuwait.",
  Qatar:     "Official method of Qatar.",
  Singapore: "Used by Majlis Ugama Islam Singapura (MUIS).",
  France:    "Union des organisations islamiques de France.",
  Turkey:    "Diyanet İşleri Başkanlığı (Turkish Directorate of Religious Affairs).",
  Russia:    "Spiritual Administration of Muslims of Russia.",
};

export default function CalculationMethodPicker() {
  const navigate = useNavigate();
  const { prefs, setCalcMethod, setBranch, CALC_METHODS } = usePrayerNotifications();
  const branch = prefs?.branch ?? null;
  const visibleMethods = Object.fromEntries(Object.entries(CALC_METHODS).filter(([k]) => getMethodsForBranch(branch || "shia").includes(k)));

  function pick(methodKey) {
    setCalcMethod(methodKey);
    navigate(-1);
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Calculation Method"
        subtitle="How prayer times are computed"
        onBack={() => navigate(-1)}
      />

      <div className="scroll-area px-4 pt-4 pb-nav">

        {/* Explanation banner */}
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          padding: 14, marginBottom: 16,
        }}>
          <p style={{ fontSize: 12, color: C.body, lineHeight: 1.55 }}>
            Different communities use slightly different angles for calculating Fajr and Isha. Pick whichever your local mosque or community uses for the most accurate times.
          </p>
        </div>

        {/* Sunni / Shia toggle */}
        <div style={{
          display: "flex",
          padding: 3,
          background: "#EDE7D9",
          borderRadius: 12,
          marginBottom: 18,
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

        {/* Shia educational banner */}
        {(branch || "shia") === "shia" && (
          <div style={{
            background: "rgba(15,61,46,0.04)",
            borderLeft: `3px solid ${C.accent}`,
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 12, color: C.ink, lineHeight: 1.55, fontWeight: 600, marginBottom: 4 }}>
              Unified Shia method
            </p>
            <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.55 }}>
              Twelver Shia calculations are unified through the Leva Institute (Qum) and Tehran University. Regional variations (Sistani, Khoei, Hakim) follow the same astronomical method but may differ in fatwa rulings on visibility.
            </p>
          </div>
        )}

        {/* Picker list */}
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
          overflow: "hidden",
        }}>
          {Object.entries(visibleMethods).map(([key, method], i, arr) => {
            const isSelected = prefs.calcMethod === key;
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
                    {method.full ?? method.name}
                  </p>
                  <p style={{
                    fontSize: 11, color: C.muted, lineHeight: 1.5,
                  }}>
                    {METHOD_NOTES[key] ?? method.name}
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
          Times update automatically when you change the method.
        </p>
      </div>
    </div>
  );
}
