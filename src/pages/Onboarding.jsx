// src/pages/Onboarding.jsx
import Icon from "../components/common/Icon";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const FEATURES = [
  { title: "Qur'an with Recitation",   desc: "Every surah with Arabic, translation, and audio."     },
  { title: "Step-by-Step Prayer Guide", desc: "Learn every position with its Arabic and meaning."    },
  { title: "Daily Duas & Reminders",    desc: "Morning, evening, and situational supplications."     },
  { title: "Community & Reflection",    desc: "Connect with others and grow in your faith."          },
];

const LANGUAGES = ["English", "Arabic", "Urdu"];

const GOALS = [
  { id: "learnPrayer",    label: "Learn how to pray"   },
  { id: "consistency",    label: "Improve consistency" },
  { id: "quranDaily",     label: "Read Qur'an daily"   },
  { id: "strengthenIman", label: "Strengthen iman"     },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [lang,  setLang]  = useState("English");
  const [goals, setGoals] = useState([]);
  const containerRef = useRef(null);

  function goTo(i) {
    setSlide(i);
    containerRef.current?.children[i]?.scrollIntoView({
      behavior: "smooth", block: "nearest", inline: "start",
    });
  }

  function toggleGoal(id) {
    setGoals(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]);
  }

  function handleComplete() {
    completeOnboarding({ language: lang, religion: "Muslim", goals });
    navigate("/auth");
  }

  const slides = [
    // ── Slide 1 — Intro ───────────────────────────────────────────────────
    <div key="intro" className="min-w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #04100A 0%, #0F3D2E 55%, #1A5C44 100%)" }}>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, rgba(200,169,81,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <p className="text-accent/65 text-base font-light tracking-[0.3em] mb-10">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <div className="w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center mb-2">
          <div className="w-14 h-14 rounded-full border border-accent/50 bg-accent/10 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z"
                fill="#C8A951" opacity="0.9"/>
            </svg>
          </div>
        </div>

        <h1 className="text-white text-5xl font-black tracking-[0.4em] mt-4 mb-8">SIRAT</h1>

        <div className="flex items-center gap-3 w-48 mb-8">
          <div className="flex-1 h-px bg-accent/28" />
          <div className="w-1.5 h-1.5 bg-accent/65 rotate-45" />
          <div className="flex-1 h-px bg-accent/28" />
        </div>

        <h2 className="text-white text-2xl font-bold mb-3">The Path Begins Here</h2>
        <p className="text-white/58 text-base leading-relaxed">
          Sirat helps you stay consistent, connected,<br />and grounded in your faith.
        </p>
      </div>
    </div>,

    // ── Slide 2 — Value ───────────────────────────────────────────────────
    <div key="value" className="min-w-full h-full bg-ivory overflow-y-auto">
      <div className="px-8 pt-16 pb-8">
        <p className="text-accent-dark text-xs font-bold tracking-[0.25em] mb-1">WHAT'S INSIDE</p>
        <h2 className="text-ink text-3xl font-black mb-10 leading-tight">
          Everything You Need,<br />In One Place
        </h2>
        <div className="space-y-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="flex items-start gap-4 card p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-black">{i + 1}</span>
              </div>
              <div>
                <p className="text-ink font-semibold text-[15px] mb-0.5">{f.title}</p>
                <p className="text-muted text-[13px] leading-snug">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // ── Slide 3 — Consistency ─────────────────────────────────────────────
    <div key="consistency" className="min-w-full h-full overflow-y-auto"
      style={{ background: "linear-gradient(160deg, #FAF7F2 0%, #EDE7D9 100%)" }}>
      <div className="px-8 pt-16 pb-8">
        <p className="text-accent-dark text-xs font-bold tracking-[0.25em] mb-1">YOUR JOURNEY</p>
        <h2 className="text-ink text-3xl font-black mb-2 leading-tight">
          Build Consistency,<br />Effortlessly
        </h2>
        <p className="text-muted text-base mb-8 leading-relaxed">
          Track your prayers, grow your habits, and stay on the straight path.
        </p>

        <div className="card p-5 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span style={{ display: "inline-flex" }}><Icon name="flame" size={20} /></span>
            </div>
            <div className="flex-1">
              <p className="text-ink font-bold text-lg">14-day streak</p>
              <p className="text-muted text-xs">Personal best: 21 days</p>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
              ON TRACK
            </span>
          </div>

          <div className="flex justify-between mb-4">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < 6 ? "bg-primary" : "bg-offwhite border-2 border-[#E8E2D8]"
                }`}>
                  {i < 6 && (
                    <span className="text-white text-[11px] font-black">✓</span>
                  )}
                </div>
                <span className="text-[10px] text-muted font-semibold">{d}</span>
              </div>
            ))}
          </div>

          <div className="h-1.5 bg-parchment rounded-full overflow-hidden mb-1">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent to-accent-light" />
          </div>
          <p className="text-muted text-xs">14 of 21 day goal · 67%</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["Prayer Timer", "Dhikr Counter", "Habit Tracker"].map(t => (
            <div key={t} className="card p-3 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-[11px] text-body font-semibold text-center leading-tight">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // ── Slide 4 — Personalization ─────────────────────────────────────────
    <div key="personal" className="min-w-full h-full bg-ivory overflow-y-auto">
      <div className="px-8 pt-16 pb-32">
        <p className="text-accent text-xs font-bold tracking-[0.25em] mb-1">STEP 4 OF 4</p>
        <h2 className="text-ink text-3xl font-black mb-1 leading-tight">Make Sirat Yours</h2>
        <p className="text-muted text-sm mb-8">
          Personalize your experience — change this anytime in Settings.
        </p>

        <div className="mb-6">
          <p className="text-body font-semibold text-sm mb-3">Language</p>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-full border-[1.5px] text-sm font-semibold press transition-colors ${
                  lang === l
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-[#E8E2D8] text-muted"
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-body font-semibold text-sm mb-3">Goals (select all that apply)</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => {
              const active = goals.includes(g.id);
              return (
                <button key={g.id} onClick={() => toggleGoal(g.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-[1.5px] text-sm font-semibold press transition-colors ${
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-[#E8E2D8] text-muted"
                  }`}>
                  {g.label}
                  {active && (
                    <span className="text-primary text-xs font-black">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleComplete}
          className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-green press">
          Get Started
        </button>
        <p className="text-subtle text-xs text-center mt-3">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>,
  ];

  const isIntro = slide === 0;

  return (
    <div className="screen">
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {slides}
        </div>
      </div>

      {slide < 3 && (
        <div className="flex-shrink-0 px-8 pb-safe pt-3 flex items-center justify-between"
          style={{
            background   : isIntro ? "rgba(15,61,46,0.8)" : "white",
            borderTop    : isIntro ? "none" : "1px solid #E8E2D8",
          }}>
          <div className="flex gap-1.5 items-center">
            {[0,1,2,3].map(i => (
              <div key={i} className={`rounded-full transition-all duration-300 ${
                i === slide        ? "w-5 h-1.5 bg-accent"
                : i < slide        ? "w-1.5 h-1.5 bg-accent/40"
                : isIntro          ? "w-1.5 h-1.5 bg-white/25"
                                   : "w-1.5 h-1.5 bg-parchment"
              }`} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => goTo(3)}
              className={`text-sm font-semibold ${isIntro ? "text-white/45" : "text-muted"}`}>
              Skip
            </button>
            <button onClick={() => goTo(slide + 1)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm press shadow-gold ${
                isIntro ? "bg-accent text-primary" : "bg-primary text-white"
              }`}>
              {slide === 2 ? "Personalize" : "Next"} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
