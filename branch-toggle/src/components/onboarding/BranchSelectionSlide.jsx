// src/components/onboarding/BranchSelectionSlide.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Onboarding slide — required step where the user picks their branch (Sunni
// or Shia). Displays a respectful intro, the two-option toggle, and a
// confirmation button that becomes active only after the user has made a
// selection.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import BranchToggle from "../common/BranchToggle";

export default function BranchSelectionSlide({ onConfirm, defaultValue = null }) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div
      className="min-w-full h-full flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #04100A 0%, #0F3D2E 55%, #1A5C44 100%)" }}>

      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(200,169,81,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1 px-8 pt-16 pb-10">

        {/* Top label */}
        <p style={{
          fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(200,169,81,0.7)", fontWeight: 700,
          textAlign: "center", marginBottom: 14,
        }}>
          One last thing
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize: 28, fontWeight: 800, color: "white",
          textAlign: "center", lineHeight: 1.25, marginBottom: 14,
        }}>
          Which tradition do you follow?
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.7)",
          textAlign: "center", lineHeight: 1.6,
          maxWidth: 320, alignSelf: "center", marginBottom: 38,
        }}>
          Sirat Al Huda adapts prayer times, the prayer guide, and other content based on your selection. You can change this anytime in Settings.
        </p>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
          <BranchToggle value={selected} onChange={setSelected} size="lg" />
        </div>

        {/* Selection feedback */}
        {selected && (
          <div style={{
            background: "rgba(200,169,81,0.1)",
            border: "1px solid rgba(200,169,81,0.25)",
            borderRadius: 16,
            padding: "14px 18px",
            maxWidth: 340,
            alignSelf: "center",
            marginBottom: 24,
          }}>
            <p style={{
              fontSize: 12, color: "rgba(217,191,122,0.9)",
              fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", marginBottom: 6,
            }}>
              {selected === "sunni" ? "Sunni" : "Shia"}
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
              {selected === "sunni"
                ? "Calculation method will be set based on your location. You can pick your madhab (Hanafi, Shafi'i, Maliki, or Hanbali) in Settings."
                : "Prayer times will use the Ja'farī (Shia Ithna-Ansari) calculation method."}
            </p>
          </div>
        )}

        {/* Confirm button */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className="press"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 999,
              background: selected ? "#C8A951" : "rgba(255,255,255,0.1)",
              color: selected ? "#082819" : "rgba(255,255,255,0.4)",
              fontSize: 15, fontWeight: 800,
              border: "none",
              cursor: selected ? "pointer" : "not-allowed",
              transition: "background 0.18s, color 0.18s",
            }}>
            {selected ? "Confirm and continue" : "Choose to continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
