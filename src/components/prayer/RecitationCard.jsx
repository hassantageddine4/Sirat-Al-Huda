// src/components/prayer/RecitationCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Recitation card — Arabic / transliteration / translation with audio buttons
// (disabled for now, "audio coming soon"). Direct port of RecitationCard.swift.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import PrayerIcon from "./PrayerIcon";

const GOLD = "rgba(242, 204, 115, 1)";
const GOLD_FAINT = "rgba(242, 204, 115, 0.25)";

export default function RecitationCard({ recitation }) {
  const [slowMode, setSlowMode] = useState(false);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `0.7px solid ${GOLD_FAINT}`,
      }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="font-semibold"
          style={{
            fontSize: 10, letterSpacing: "0.25em",
            color: "rgba(242, 204, 115, 0.9)",
          }}>
          RECITATION
        </p>
        {recitation.reference && (
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
            {recitation.reference}
          </p>
        )}
      </div>

      {/* Arabic */}
      <p
        dir="rtl"
        className="text-white leading-relaxed mb-3"
        style={{
          fontFamily: "Amiri, serif",
          fontSize: 22,
          lineHeight: 1.85,
        }}
        aria-label="Arabic recitation">
        {recitation.arabic}
      </p>

      <Divider />

      {/* Transliteration */}
      <div className="mt-3">
        <p
          className="font-semibold mb-1"
          style={{
            fontSize: 9, letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.45)",
          }}>
          TRANSLITERATION
        </p>
        <p
          className="italic"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 14, lineHeight: 1.55,
            color: "rgba(255,255,255,0.92)",
          }}>
          {recitation.transliteration}
        </p>
      </div>

      <div className="mt-3"><Divider /></div>

      {/* Translation */}
      <div className="mt-3 mb-3">
        <p
          className="font-semibold mb-1"
          style={{
            fontSize: 9, letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.45)",
          }}>
          TRANSLATION
        </p>
        <p style={{
          fontSize: 13, lineHeight: 1.55,
          color: "rgba(255,255,255,0.85)",
        }}>
          {recitation.translation}
        </p>
      </div>

    </div>
  );
}

function AudioButton({ symbol, label, primary, active, onClick }) {
  const isHighlighted = primary || active;
  return (
    <button
      onClick={onClick}
      disabled
      className="press flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full transition-colors"
      style={{
        background: isHighlighted ? "rgba(242, 204, 115, 0.18)" : "rgba(255,255,255,0.06)",
        border: `0.6px solid ${isHighlighted ? "rgba(242, 204, 115, 0.6)" : "rgba(255,255,255,0.12)"}`,
        color: isHighlighted ? GOLD : "rgba(255,255,255,0.5)",
        opacity: 0.6,
      }}>
      <PrayerIcon name={symbol} size={11} />
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 0.6,
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)",
      }}
    />
  );
}
