// src/pages/WuduGuide.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWuduSteps, WUDU_INTRO, WUDU_NULLIFIERS } from "../data/wudu";
import { useBranch } from "../hooks/useBranch";

// ── SVG Wudu Illustrations ────────────────────────────────────────────────────
function WuduIllustration({ pose }) {
  const gold  = "#C8A951";
  const green = "#0F3D2E";
  const blue  = "#3B82F6";
  const water = "#93C5FD";

  const figures = {
    standing: (
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
        <circle cx="60" cy="22" r="14" fill={gold} opacity=".9"/>
        <rect x="47" y="36" width="26" height="52" rx="8" fill={green}/>
        <rect x="28" y="52" width="18" height="8" rx="4" fill={green}/>
        <rect x="74" y="52" width="18" height="8" rx="4" fill={green}/>
        <rect x="47" y="84" width="11" height="42" rx="5" fill={green}/>
        <rect x="62" y="84" width="11" height="42" rx="5" fill={green}/>
        <ellipse cx="52" cy="128" rx="9" ry="5" fill={green}/>
        <ellipse cx="68" cy="128" rx="9" ry="5" fill={green}/>
      </svg>
    ),
    hands: (
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
        <circle cx="80" cy="22" r="14" fill={gold} opacity=".9"/>
        <rect x="67" y="36" width="26" height="40" rx="8" fill={green}/>
        {/* Hands being washed */}
        <rect x="30" y="68" width="40" height="14" rx="7" fill={green}/>
        <rect x="90" y="68" width="40" height="14" rx="7" fill={green}/>
        {/* Water droplets */}
        <ellipse cx="35" cy="90" rx="3" ry="5" fill={water} opacity=".8"/>
        <ellipse cx="45" cy="95" rx="3" ry="5" fill={water} opacity=".8"/>
        <ellipse cx="115" cy="90" rx="3" ry="5" fill={water} opacity=".8"/>
        <ellipse cx="125" cy="95" rx="3" ry="5" fill={water} opacity=".8"/>
      </svg>
    ),
    mouth: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
        <circle cx="60" cy="35" r="28" fill={gold} opacity=".9"/>
        {/* Hand at mouth */}
        <ellipse cx="60" cy="52" rx="20" ry="8" fill={green} opacity=".7"/>
        {/* Water */}
        <ellipse cx="75" cy="60" rx="4" ry="8" fill={water} opacity=".8"/>
        <ellipse cx="85" cy="65" rx="3" ry="6" fill={water} opacity=".6"/>
      </svg>
    ),
    nose: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
        <circle cx="60" cy="35" r="28" fill={gold} opacity=".9"/>
        <ellipse cx="60" cy="45" rx="10" ry="6" fill={green} opacity=".3"/>
        {/* Water droplets from nose */}
        <ellipse cx="55" cy="60" rx="3" ry="6" fill={water} opacity=".8"/>
        <ellipse cx="65" cy="63" rx="3" ry="6" fill={water} opacity=".8"/>
      </svg>
    ),
    face: (
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
        <circle cx="70" cy="50" r="35" fill={gold} opacity=".9"/>
        {/* Hands on sides of face */}
        <ellipse cx="20" cy="50" rx="16" ry="12" fill={green} opacity=".7"/>
        <ellipse cx="120" cy="50" rx="16" ry="12" fill={green} opacity=".7"/>
        {/* Water flowing down */}
        <rect x="50" y="82" width="4" height="20" rx="2" fill={water} opacity=".8"/>
        <rect x="60" y="84" width="4" height="18" rx="2" fill={water} opacity=".7"/>
        <rect x="76" y="82" width="4" height="20" rx="2" fill={water} opacity=".8"/>
      </svg>
    ),
    right_arm: (
      <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
        <circle cx="30" cy="40" r="14" fill={gold} opacity=".9"/>
        {/* Arm extended */}
        <rect x="42" y="33" width="100" height="16" rx="8" fill={green}/>
        {/* Hand */}
        <ellipse cx="155" cy="41" rx="18" ry="12" fill={green}/>
        {/* Water */}
        <ellipse cx="120" cy="56" rx="3" ry="7" fill={water} opacity=".8"/>
        <ellipse cx="135" cy="58" rx="3" ry="7" fill={water} opacity=".7"/>
        <ellipse cx="150" cy="60" rx="3" ry="6" fill={water} opacity=".8"/>
      </svg>
    ),
    left_arm: (
      <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
        <circle cx="150" cy="40" r="14" fill={gold} opacity=".9"/>
        <rect x="38" y="33" width="100" height="16" rx="8" fill={green}/>
        <ellipse cx="25" cy="41" rx="18" ry="12" fill={green}/>
        <ellipse cx="45" cy="56" rx="3" ry="7" fill={water} opacity=".8"/>
        <ellipse cx="60" cy="58" rx="3" ry="7" fill={water} opacity=".7"/>
        <ellipse cx="75" cy="60" rx="3" ry="6" fill={water} opacity=".8"/>
      </svg>
    ),
    head: (
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
        <circle cx="70" cy="50" r="35" fill={gold} opacity=".9"/>
        {/* Hands wiping from front to back */}
        <rect x="30" y="22" width="80" height="12" rx="6" fill={green} opacity=".7"/>
        {/* Motion lines */}
        <path d="M30 22 Q70 10 110 22" stroke={green} strokeWidth="2" fill="none" strokeDasharray="4 3" opacity=".5"/>
      </svg>
    ),
    ears: (
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
        <circle cx="70" cy="50" r="30" fill={gold} opacity=".9"/>
        {/* Ears */}
        <ellipse cx="32" cy="50" rx="10" ry="16" fill={gold} opacity=".7"/>
        <ellipse cx="108" cy="50" rx="10" ry="16" fill={gold} opacity=".7"/>
        {/* Fingers at ears */}
        <ellipse cx="22" cy="50" rx="8" ry="6" fill={green} opacity=".8"/>
        <ellipse cx="118" cy="50" rx="8" ry="6" fill={green} opacity=".8"/>
      </svg>
    ),
    right_foot: (
      <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
        {/* Leg */}
        <rect x="70" y="10" width="16" height="60" rx="8" fill={green}/>
        {/* Foot */}
        <ellipse cx="78" cy="80" rx="30" ry="12" fill={green}/>
        {/* Water */}
        <ellipse cx="55" cy="92" rx="3" ry="6" fill={water} opacity=".8"/>
        <ellipse cx="65" cy="95" rx="3" ry="5" fill={water} opacity=".7"/>
        <ellipse cx="95" cy="95" rx="3" ry="5" fill={water} opacity=".7"/>
        <ellipse cx="105" cy="92" rx="3" ry="6" fill={water} opacity=".8"/>
        {/* Hand washing */}
        <ellipse cx="78" cy="78" rx="32" ry="14" fill={green} opacity=".3"/>
      </svg>
    ),
    left_foot: (
      <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
        <rect x="94" y="10" width="16" height="60" rx="8" fill={green}/>
        <ellipse cx="102" cy="80" rx="30" ry="12" fill={green}/>
        <ellipse cx="79" cy="92" rx="3" ry="6" fill={water} opacity=".8"/>
        <ellipse cx="89" cy="95" rx="3" ry="5" fill={water} opacity=".7"/>
        <ellipse cx="115" cy="95" rx="3" ry="5" fill={water} opacity=".7"/>
        <ellipse cx="125" cy="92" rx="3" ry="6" fill={water} opacity=".8"/>
      </svg>
    ),
    dua: (
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
        <circle cx="60" cy="22" r="14" fill={gold} opacity=".9"/>
        <rect x="47" y="36" width="26" height="52" rx="8" fill={green}/>
        <rect x="22" y="42" width="24" height="8" rx="4" fill={green} transform="rotate(-30 22 42)"/>
        <rect x="74" y="28" width="24" height="8" rx="4" fill={green} transform="rotate(30 74 28)"/>
        <ellipse cx="20" cy="33" rx="8" ry="5" fill={gold} opacity=".8"/>
        <ellipse cx="100" cy="33" rx="8" ry="5" fill={gold} opacity=".8"/>
        <rect x="47" y="84" width="11" height="42" rx="5" fill={green}/>
        <rect x="62" y="84" width="11" height="42" rx="5" fill={green}/>
        <ellipse cx="52" cy="128" rx="9" ry="5" fill={green}/>
        <ellipse cx="68" cy="128" rx="9" ry="5" fill={green}/>
      </svg>
    ),
  };

  return (
    <div className="flex items-center justify-center py-4">
      {figures[pose] ?? figures.standing}
    </div>
  );
}

// ── Main WuduGuide ────────────────────────────────────────────────────────────
export default function WuduGuide() {
  const navigate = useNavigate();
  const [view, setView] = useState("intro"); // intro | steps | nullifiers
  const [step, setStep] = useState(0);
  const { branch } = useBranch();
  const WUDU_STEPS = getWuduSteps(branch);

  // ── Steps view ──────────────────────────────────────────────────────────────
  if (view === "steps") {
    const current  = WUDU_STEPS[step];
    const progress = ((step + 1) / WUDU_STEPS.length) * 100;

    return (
      <div className="screen bg-ivory">
        <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
          <div className="flex items-center px-4 py-3 gap-2">
            <button onClick={() => setView("intro")} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
              <span className="text-white text-xl">‹</span>
            </button>
            <p className="text-white font-bold text-base flex-1 text-center">Wudu — Step {step+1}</p>
            <div className="w-10" />
          </div>
          <div className="px-4 pb-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-400" style={{ width: `${progress}%` }}/>
            </div>
            <p className="text-white/50 text-xs mt-1 text-right">{step+1} / {WUDU_STEPS.length}</p>
          </div>
        </div>

        <div className="scroll-area px-4 py-4">
          {/* Illustration */}
          <div className="card mb-4 overflow-hidden">
            <div className="bg-gradient-to-b from-blue-50 to-white py-2">
              <WuduIllustration pose={current.pose} />
            </div>
          </div>

          {/* Step card */}
          <div className="card p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{current.step}</span>
                </div>
                <div>
                  <p className="text-ink font-black text-xl">{current.title}</p>
                  <p className="text-muted text-xs">{current.action}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                current.note?.includes("Fard") ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-700"
              }`}>
                {current.note}
              </span>
            </div>

            {/* Arabic */}
            <div className="bg-primary/5 rounded-2xl p-4 mb-3 text-center">
              <p className="text-primary font-bold text-xl leading-relaxed mb-2" dir="rtl">{current.arabic}</p>
              <p className="text-muted text-xs italic">{current.transliteration}</p>
            </div>

            {/* Translation */}
            <div className="bg-accent/8 rounded-xl p-3 mb-3">
              <p className="text-[9px] font-bold text-accent tracking-[0.15em] uppercase mb-1">Translation</p>
              <p className="text-body text-sm italic">"{current.translation}"</p>
            </div>

            {/* Description */}
            <p className="text-body text-sm leading-relaxed">{current.desc}</p>
          </div>
        </div>

        <div className="flex-shrink-0 px-5 pb-safe pt-3 flex gap-3 bg-white border-t border-[#E8E2D8]">
          {step > 0 ? (
            <button onClick={() => setStep(s => s-1)} className="flex-1 h-12 rounded-2xl border-[1.5px] border-primary text-primary font-bold press">
              Previous
            </button>
          ) : (
            <button onClick={() => setView("intro")} className="flex-1 h-12 rounded-2xl border-[1.5px] border-[#E8E2D8] text-muted font-bold press">
              Back
            </button>
          )}
          {step < WUDU_STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s+1)} className="flex-1 h-12 rounded-2xl bg-blue-500 text-white font-bold press">
              Next
            </button>
          ) : (
            <button onClick={() => setView("intro")} className="flex-1 h-12 rounded-2xl bg-accent text-primary font-bold shadow-gold press">
              Complete ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Intro view ──────────────────────────────────────────────────────────────
  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-lg">Wudu Guide</p>
            <p className="text-white/55 text-xs">Purification before prayer</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="scroll-area px-4 py-5 space-y-4">
        {/* Intro */}
        <div className="card p-5 text-center">
          <p className="text-primary font-black text-3xl mb-1" dir="rtl">{WUDU_INTRO.arabic}</p>
          <p className="text-ink font-bold text-xl mb-2">{WUDU_INTRO.title}</p>
          <p className="text-body text-sm leading-relaxed">{WUDU_INTRO.desc}</p>
        </div>

        {/* Conditions */}
        <div className="card p-4">
          <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-3">Conditions</p>
          <div className="space-y-2">
            {WUDU_INTRO.conditions.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-500 text-[10px] font-black">{i+1}</span>
                </div>
                <p className="text-body text-sm">{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps overview */}
        <div className="card p-4">
          <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-3">Steps Overview</p>
          <div className="space-y-2">
            {WUDU_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500 text-[10px] font-black">{s.step}</span>
                </div>
                <p className="text-ink text-sm font-semibold flex-1">{s.title}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  s.note?.includes("Fard") ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-700"
                }`}>{s.note}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { setView("steps"); setStep(0); }}
          className="w-full h-14 rounded-2xl bg-blue-500 text-white font-bold text-base press">
          Start Step-by-Step Wudu
        </button>

        {/* Nullifiers */}
        <div className="card p-4">
          <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-3">What Breaks Wudu</p>
          <div className="space-y-2">
            {WUDU_NULLIFIERS.map((n, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-[10px]">✕</span>
                </div>
                <p className="text-body text-sm">{n}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}
