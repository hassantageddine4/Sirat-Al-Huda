// src/components/prayer/WalkthroughHeader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Top-of-screen status: prayer name, rakah counter, step counter, progress bar.
// Direct port of WalkthroughHeader.swift.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

const GOLD = "rgba(242, 204, 115, 1)";

export default function WalkthroughHeader({
  prayer,
  currentRakahNumber,
  currentStepIndex, // 0-based
  totalSteps,
}) {
  const progress = totalSteps > 0 ? (currentStepIndex + 1) / totalSteps : 0;

  return (
    <div className="flex flex-col gap-3 px-1">

      {/* Title row */}
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col gap-0.5">
          <p
            className="font-semibold"
            style={{
              fontSize: 11, letterSpacing: "0.3em",
              color: "rgba(242, 204, 115, 0.85)",
            }}>
            {prayer.name.toUpperCase()}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {prayer.subtitle}
          </p>
        </div>
        <p
          style={{
            fontFamily: "Amiri, serif",
            fontSize: 18,
            color: "rgba(255,255,255,0.95)",
          }}>
          {prayer.arabicName}
        </p>
      </div>

      {/* Counters */}
      <div className="flex gap-3.5">
        <CounterPill
          label="RAK'AH"
          value={`${currentRakahNumber}/${prayer.rakahCount}`}
        />
        <CounterPill
          label="STEP"
          value={`${currentStepIndex + 1}/${totalSteps}`}
        />
      </div>

      {/* Progress bar */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${Math.max(2, progress * 100)}%`,
            background: `linear-gradient(to right, rgba(77,217,141,1), ${GOLD})`,
            boxShadow: `0 0 4px ${GOLD}66`,
            transition: "width 550ms cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function CounterPill({ label, value }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "0.5px solid rgba(255,255,255,0.10)",
      }}>
      <span
        className="font-semibold"
        style={{
          fontSize: 9, letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.5)",
        }}>
        {label}
      </span>
      <span
        className="font-semibold tabular-nums"
        style={{ fontSize: 12, color: "white" }}>
        {value}
      </span>
    </div>
  );
}
