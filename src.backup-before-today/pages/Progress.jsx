// src/pages/Progress.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const STATS = [
  { label: "Current Streak",   value: "14 days",  icon: "🔥" },
  { label: "Longest Streak",   value: "21 days",  icon: "⭐" },
  { label: "Total Prayers",    value: "320",      icon: "🕌" },
  { label: "Journal Entries",  value: "7",        icon: "📔" },
  { label: "Dhikr Count",      value: "1,430",    icon: "📿" },
];

export default function Progress() {
  const navigate = useNavigate();
  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg, #0F3D2E, #1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <p className="text-white font-bold text-lg flex-1 text-center">My Progress</p>
          <div className="w-10" />
        </div>
      </div>
      <div className="scroll-area px-4 py-5 space-y-3">
        <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase px-1 mb-3">Your Statistics</p>
        {STATS.map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center text-xl flex-shrink-0">
              {s.icon}
            </div>
            <div className="flex-1">
              <p className="text-muted text-xs font-semibold">{s.label}</p>
              <p className="text-ink font-black text-lg">{s.value}</p>
            </div>
          </div>
        ))}
        <div className="rounded-2xl p-5 text-center mt-2" style={{ background: "rgba(15,61,46,0.05)", border: "1px solid rgba(15,61,46,0.1)" }}>
          <p className="text-primary font-semibold text-sm mb-1">Detailed analytics</p>
          <p className="text-muted text-xs">Charts and trends coming in the next update.</p>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}
