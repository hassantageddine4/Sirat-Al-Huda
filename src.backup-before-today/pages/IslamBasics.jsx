// src/pages/IslamBasics.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIVE_PILLARS, ARTICLES_OF_FAITH } from "../data/islamBasics";

function PillarCard({ pillar, onSelect }) {
  return (
    <button onClick={() => onSelect(pillar)}
      className="w-full card p-5 press text-left overflow-hidden relative mb-3">
      {/* Color accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: pillar.color }} />
      <div className="pl-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: `${pillar.color}18` }}>
              {pillar.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-muted">PILLAR {pillar.number}</span>
              </div>
              <p className="text-ink font-black text-lg leading-tight">{pillar.title}</p>
              <p className="text-muted text-xs">{pillar.subtitle}</p>
            </div>
          </div>
          <span style={{ color: "#A09890", fontSize: 18 }}>›</span>
        </div>
        <p className="text-primary font-semibold text-base mb-1" dir="rtl">{pillar.arabic_text}</p>
        <p className="text-muted text-xs italic mb-2">{pillar.transliteration}</p>
        <p className="text-body text-sm leading-relaxed line-clamp-2">{pillar.explanation}</p>
      </div>
    </button>
  );
}

function PillarDetail({ pillar, onBack }) {
  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: pillar.color }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/15">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-lg">{pillar.title}</p>
            <p className="text-white/70 text-xs">{pillar.subtitle}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="scroll-area px-4 py-5 space-y-4">
        {/* Hero card */}
        <div className="card p-5 text-center">
          <div className="text-4xl mb-3">{pillar.icon}</div>
          <p className="text-ink font-black text-3xl mb-1" dir="rtl">{pillar.arabic}</p>
          <p className="text-primary font-bold text-xl mb-2">{pillar.title}</p>
          <div className="bg-primary/5 rounded-2xl p-4 mb-3">
            <p className="text-primary font-bold text-lg mb-1" dir="rtl">{pillar.arabic_text}</p>
            <p className="text-muted text-xs italic mb-1">{pillar.transliteration}</p>
            <p className="text-body text-sm italic">"{pillar.translation}"</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="card p-4">
          <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-2">What Is It?</p>
          <p className="text-body text-sm leading-relaxed">{pillar.explanation}</p>
        </div>

        {/* Importance */}
        <div className="card p-4">
          <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-2">Why It Matters</p>
          <p className="text-body text-sm leading-relaxed">{pillar.importance}</p>
        </div>

        {/* Details if any */}
        {pillar.details && (
          <div className="card p-4">
            <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase mb-3">Key Points</p>
            <div className="space-y-2">
              {pillar.details.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: pillar.color }} />
                  <p className="text-body text-sm">{d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}

export default function IslamBasics() {
  const navigate = useNavigate();
  const [tab,     setTab]     = useState("pillars");
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <PillarDetail pillar={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-lg">Islam Basics</p>
            <p className="text-white/55 text-xs">Foundations of the faith</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="flex px-5 gap-1 mt-2">
          {[["pillars","Five Pillars"],["aqeedah","Articles of Faith"]].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-t-xl text-sm font-semibold transition-colors ${tab===v?"bg-ivory text-primary":"text-white/60"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-area px-4 py-4">
        {tab === "pillars" ? (
          <>
            <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase px-1 mb-3">The Five Pillars of Islam</p>
            <p className="text-body text-sm leading-relaxed mb-4 px-1">
              The Prophet ﷺ said: "Islam is built on five pillars." (Bukhari & Muslim)
            </p>
            {FIVE_PILLARS.map(p => (
              <PillarCard key={p.id} pillar={p} onSelect={setSelected} />
            ))}
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold text-muted tracking-[0.15em] uppercase px-1 mb-3">The Six Articles of Faith</p>
            <p className="text-body text-sm leading-relaxed mb-4 px-1">
              The Angel Jibreel asked: "What is Iman?" The Prophet ﷺ replied: "To believe in Allah, His angels, His books, His messengers, the Last Day, and divine decree." (Muslim)
            </p>
            <div className="space-y-3">
              {ARTICLES_OF_FAITH.map(a => (
                <div key={a.id} className="card p-4 overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60 rounded-l-2xl" />
                  <div className="pl-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-black">{a.number}</span>
                      </div>
                      <div>
                        <p className="text-ink font-bold text-[15px]">{a.title}</p>
                        <p className="text-muted text-xs" dir="rtl">{a.arabic}</p>
                      </div>
                    </div>
                    <p className="text-body text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
}
