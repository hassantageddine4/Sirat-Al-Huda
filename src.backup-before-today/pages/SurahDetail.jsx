// src/pages/SurahDetail.jsx
// Surah detail view — shows surah info + verses placeholder.
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SurahDetail() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const surah     = state?.surah;

  if (!surah) {
    return (
      <div className="screen bg-ivory">
        <div className="flex-shrink-0 pt-safe bg-primary">
          <div className="flex items-center px-4 py-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press">
              <span className="text-white text-xl">‹</span>
            </button>
            <p className="text-white font-bold text-lg flex-1 text-center">Surah</p>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">Surah not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg, #0F3D2E, #1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base">{surah.name}</p>
            <p className="text-white/55 text-xs">{surah.meaning} · {surah.type}</p>
          </div>
          <div className="w-10 text-right">
            <p className="text-white/70 text-xs font-semibold">#{surah.number}</p>
          </div>
        </div>

        {/* Bismillah */}
        <div className="px-6 pb-5 text-center">
          <p className="text-accent/80 text-lg leading-relaxed" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="scroll-area px-4 py-4 space-y-4">
        <div className="card p-5 flex justify-between items-center">
          {[
            ["Surah", surah.number],
            ["Verses", surah.verses],
            ["Type", surah.type],
          ].map(([label, val]) => (
            <div key={label} className="text-center flex-1">
              <p className="text-muted text-[10px] font-semibold tracking-wide uppercase mb-1">{label}</p>
              <p className="text-ink font-bold text-base">{val}</p>
            </div>
          ))}
        </div>

        {/* Arabic name card */}
        <div className="card p-5 text-center">
          <p className="text-muted text-xs mb-2 tracking-wide uppercase font-semibold">Arabic Name</p>
          <p className="text-primary font-bold text-3xl mb-1" dir="rtl">{surah.arabic}</p>
          <p className="text-muted text-sm">{surah.meaning}</p>
        </div>

        {/* Coming soon notice */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "rgba(15,61,46,0.05)", border: "1px solid rgba(15,61,46,0.1)" }}
        >
          <p className="text-primary font-semibold text-sm mb-1">Full recitation & translation</p>
          <p className="text-muted text-xs">Complete verse-by-verse content coming in the next update.</p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
