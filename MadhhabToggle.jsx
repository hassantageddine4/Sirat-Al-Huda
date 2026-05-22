// src/components/prayer/MadhhabToggle.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Sunni / Shia pill toggle. Persists selection to localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

const KEY = "sirat_madhhab_v1";

export function loadMadhhab() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "shia" ? "shia" : "sunni";
  } catch { return "sunni"; }
}

export function saveMadhhab(value) {
  try { localStorage.setItem(KEY, value); } catch {}
}

export default function MadhhabToggle({ value, onChange, compact = false }) {
  const sizes = compact
    ? { padX: "px-2.5", padY: "py-1", text: "text-[10px]", gap: "gap-1" }
    : { padX: "px-4",   padY: "py-1.5", text: "text-[11px]", gap: "gap-1.5" };

  function set(next) {
    onChange(next);
    saveMadhhab(next);
  }

  return (
    <div
      role="tablist"
      aria-label="Madhhab"
      className={`inline-flex ${sizes.gap} p-1 rounded-full`}
      style={{ background: "rgba(255,255,255,0.06)", border: "0.6px solid rgba(255,255,255,0.12)" }}>
      <Button active={value === "sunni"} onClick={() => set("sunni")} sizes={sizes}>
        Sunni
      </Button>
      <Button active={value === "shia"} onClick={() => set("shia")} sizes={sizes}>
        Shia
      </Button>
    </div>
  );
}

function Button({ active, onClick, sizes, children }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`press rounded-full font-semibold tracking-wide transition-colors ${sizes.padX} ${sizes.padY} ${sizes.text}`}
      style={{
        background: active ? "rgba(217,191,122,0.22)" : "transparent",
        color: active ? "#D9BF7A" : "rgba(255,255,255,0.6)",
        border: active ? "0.6px solid rgba(217,191,122,0.4)" : "0.6px solid transparent",
      }}>
      {children}
    </button>
  );
}
