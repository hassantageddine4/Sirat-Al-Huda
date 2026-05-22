// src/pages/Practice.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";

const SCHOLAR_URL = "https://imam-us.org";
function openScholar() {
  if (typeof window !== "undefined") window.open(SCHOLAR_URL, "_blank", "noopener,noreferrer");
}

// Each module declares its own destination via `to`.
// Modules with `external: true` open a website in the system browser.
// Modules with `inline: "dhikr"` toggle an in-component view (no navigation).
const MODULES = [
  { title: "Recitation Practice", desc: "Practice Qur'an recitation with AI feedback", color: "bg-accent/10",   icon: "volume",   to: "/practice/recitation" },
  { title: "Prayer Guide",        desc: "All 5 prayers with step-by-step",             color: "bg-primary/8",   icon: "prayer",   to: "/practice/prayer-guide" },
  { title: "Wudu Guide",          desc: "Purification before prayer",                  color: "bg-blue-50",     icon: "sparkle",  to: "/practice/wudu-guide" },
  { title: "Daily Duas",          desc: "Authentic duas for every occasion",           color: "bg-green-50",    icon: "heart",    to: "/practice/duas" },
  { title: "Islam Basics",        desc: "Five Pillars & Articles of Faith",            color: "bg-amber-50",    icon: "bookOpen", to: "/practice/basics" },
  { title: "Dhikr Counter",       desc: "Digital tasbih & remembrance",                color: "bg-rose-50",     icon: "beads",    inline: "dhikr" },
  { title: "99 Names of Allah",   desc: "Learn and reflect on Asma ul Husna",          color: "bg-purple-50",   icon: "star",     to: "/practice/names" },
  { title: "Hadith Collection",   desc: "Read and reflect on authentic hadith",        color: "bg-orange-50",   icon: "scroll",   to: "/hadith" },
  { title: "Daily Routine",       desc: "Track your daily acts of worship",            color: "bg-teal-50",     icon: "sunrise",  to: "/routine" },
  { title: "Prophets & Imams",    desc: "Stories and lessons from their lives",        color: "bg-yellow-50",   icon: "users",    to: "/practice/prophets" },
  { title: "Qibla Compass",       desc: "Find the direction of the Kaaba",             color: "bg-emerald-50",  icon: "compass",  to: "/qibla" },
  { title: "Ask a Scholar",       desc: "Get answers from trusted scholars",           color: "bg-sky-50",      icon: "message",  external: true, footer: "imam-us.org" },
];

// Built-in dhikr counter
function DhikrCounter({ onBack }) {
  const [count, setCount] = useState(0);
  const [goal,  setGoal]  = useState(33);
  const GOALS = [33, 99, 100, 1000];

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <Icon name="back" size={18} className="text-white" />
          </button>
          <p className="text-white font-bold text-lg flex-1 text-center">Dhikr Counter</p>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        <div className="card p-5 w-full text-center">
          <p className="text-primary font-black text-2xl mb-1" dir="rtl">سُبْحَانَ اللَّهِ</p>
          <p className="text-muted text-sm">SubhanAllah — Glory be to Allah</p>
        </div>

        <button onClick={() => setCount(c => c + 1)}
          className="w-52 h-52 rounded-full flex items-center justify-center shadow-green press active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
          <div className="text-center">
            <span className="text-white text-7xl font-black block">{count}</span>
            <span className="text-white/50 text-sm">tap to count</span>
          </div>
        </button>

        <div className="w-full">
          <div className="flex justify-between text-xs text-muted mb-1.5">
            <span>{count} / {goal}</span>
            <span>{Math.round((count/goal)*100)}%</span>
          </div>
          <div className="h-2.5 bg-[#E8E2D8] rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${Math.min((count/goal)*100,100)}%` }} />
          </div>
          {count >= goal && (
            <p className="text-primary font-bold text-sm mt-2 text-center">
              Alhamdulillah — goal reached!
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {GOALS.map(g => (
            <button key={g} onClick={() => setGoal(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold press border ${goal===g?"bg-primary text-white border-primary":"bg-white text-muted border-[#E8E2D8]"}`}>
              {g}
            </button>
          ))}
        </div>

        <button onClick={() => setCount(0)} className="text-muted text-sm font-semibold press flex items-center gap-1.5">
          <Icon name="refresh" size={12} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default function Practice() {
  const navigate  = useNavigate();
  const [showDhikr, setShowDhikr] = useState(false);

  if (showDhikr) return <DhikrCounter onBack={() => setShowDhikr(false)} />;

  function handleTap(m) {
    if (m.external)        { openScholar(); return; }
    if (m.inline === "dhikr") { setShowDhikr(true); return; }
    if (m.to)              { navigate(m.to); return; }
  }

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <div className="px-5 pt-4 pb-5">
          <h1 className="text-white text-2xl font-black">Practice</h1>
          <p className="text-white/60 text-sm">Learn and build good habits</p>
        </div>
      </div>

      <div className="scroll-area px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map(m => (
            <button key={m.title}
              onClick={() => handleTap(m)}
              className={`card p-4 flex flex-col items-start press ${m.color}`}>
              <div className="w-9 h-9 rounded-2xl bg-white/60 flex items-center justify-center mb-3 text-primary">
                <Icon name={m.icon} size={18} />
              </div>
              <p className="text-ink font-bold text-[13px] mb-1 leading-tight">{m.title}</p>
              <p className="text-muted text-[10px] leading-snug">{m.desc}</p>
              {m.footer && (
                <p className="text-primary text-[10px] font-semibold mt-1 flex items-center gap-1">
                  {m.footer}
                  <Icon name="external" size={9} />
                </p>
              )}
            </button>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}
