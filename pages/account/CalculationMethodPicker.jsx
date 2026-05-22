// src/pages/account/CalculationMethodPicker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Picker for the prayer-time calculation method.
// The method affects Fajr and Isha angle assumptions; pick the authority
// most relevant to your region or community.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";
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
  const { prefs, setCalcMethod, CALC_METHODS } = usePrayerNotifications();

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

      <div className="scroll-area px-4 pt-4 pb-8">

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

        {/* Picker list */}
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
          overflow: "hidden",
        }}>
          {Object.entries(CALC_METHODS).map(([key, method], i, arr) => {
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
