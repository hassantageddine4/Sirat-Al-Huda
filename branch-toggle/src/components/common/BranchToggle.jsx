// src/components/common/BranchToggle.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Sunni / Shia segmented toggle.
// Used in:
//   - Onboarding (required step)
//   - Settings → Islamic Preferences (changeable anytime)
//
// Displays an iOS-style segmented control with two pills.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

const C = {
  primary: "#0F3D2E",
  primaryLight: "#1A5C44",
  accent: "#C8A951",
  ivory: "#FAF7F2",
  ink: "#1C1814",
  muted: "#7A7268",
  border: "#E8E2D8",
};

export default function BranchToggle({ value, onChange, size = "md" }) {
  const sizeStyles = {
    sm: { padding: "8px 14px",  fontSize: 12 },
    md: { padding: "11px 22px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 16 },
  }[size] ?? { padding: "11px 22px", fontSize: 14 };

  const pills = [
    { id: "sunni", label: "Sunni" },
    { id: "shia",  label: "Shia"  },
  ];

  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        background: "rgba(15,61,46,0.07)",
        borderRadius: 99,
        padding: 4,
        gap: 4,
      }}>
      {pills.map(p => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p.id)}
            className="press"
            style={{
              ...sizeStyles,
              fontWeight: 700,
              borderRadius: 99,
              background: active ? "white" : "transparent",
              color:      active ? C.primary : C.muted,
              border:     active ? `0.5px solid ${C.border}` : "none",
              boxShadow:  active ? "0 1px 3px rgba(10,8,6,0.08)" : "none",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
            }}>
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
