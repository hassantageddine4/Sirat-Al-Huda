// src/pages/JuzDetail.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function JuzDetail() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const juz       = state?.juz;

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg, #0F3D2E, #1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base">{juz?.name ?? "Juz"}</p>
            {juz?.range && <p className="text-white/55 text-xs">{juz.range}</p>}
          </div>
          <div className="w-10" />
        </div>
      </div>
      <div className="scroll-area flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-5 border border-primary/12">
          <span className="text-primary text-2xl font-black">{juz?.number}</span>
        </div>
        <h2 className="text-ink text-xl font-black mb-2">{juz?.name ?? "Juz Reader"}</h2>
        {juz?.range && <p className="text-muted text-sm mb-6">{juz.range}</p>}
        <div className="px-5 py-2.5 rounded-full" style={{ background: "rgba(15,61,46,0.07)", border: "1px solid rgba(15,61,46,0.15)" }}>
          <p className="text-primary text-sm font-semibold">Full Juz content coming soon</p>
        </div>
      </div>
    </div>
  );
}
