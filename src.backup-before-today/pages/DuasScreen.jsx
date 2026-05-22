// src/pages/DuasScreen.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DUAS, DUA_CATEGORIES } from "../data/duas";

function DuaCard({ dua, expanded, onToggle }) {
  return (
    <div className="card overflow-hidden mb-3">
      <button onClick={onToggle} className="w-full flex items-start gap-3 p-4 press text-left">
        <div className="flex-1">
          <p className="text-ink font-bold text-[14px] leading-tight">{dua.title}</p>
          {dua.source && (
            <p className="text-muted text-[10px] mt-0.5">{dua.source}</p>
          )}
          {!expanded && (
            <p className="text-muted text-xs mt-1 line-clamp-1 italic" dir="rtl">{dua.arabic}</p>
          )}
        </div>
        <span style={{ color: "#A09890", fontSize: 18, transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "none" }}>›</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#E8E2D8] pt-3">
          {/* Arabic */}
          <div className="bg-primary/5 rounded-2xl p-4 text-center">
            <p className="text-primary font-bold text-lg leading-relaxed" dir="rtl">{dua.arabic}</p>
          </div>

          {/* Transliteration */}
          <div>
            <p className="text-[9px] font-bold text-muted tracking-[0.15em] uppercase mb-1">Transliteration</p>
            <p className="text-body text-sm italic leading-relaxed">{dua.transliteration}</p>
          </div>

          {/* Translation */}
          <div className="bg-accent/8 rounded-xl p-3">
            <p className="text-[9px] font-bold text-accent tracking-[0.15em] uppercase mb-1">Meaning</p>
            <p className="text-body text-sm italic leading-relaxed">"{dua.translation}"</p>
          </div>

          {/* Note */}
          {dua.note && (
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <span className="text-blue-500 text-xs flex-shrink-0 mt-0.5">ℹ</span>
              <p className="text-blue-700 text-xs leading-relaxed">{dua.note}</p>
            </div>
          )}

          {dua.source && (
            <p className="text-muted text-[11px]">Source: {dua.source}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function DuasScreen() {
  const navigate  = useNavigate();
  const [category,  setCategory]  = useState("daily");
  const [query,     setQuery]     = useState("");
  const [expanded,  setExpanded]  = useState(null);

  const filtered = useMemo(() => {
    return DUAS.filter(d => {
      const matchCat = !query && d.category === category;
      const matchSearch = query &&
        (d.title.toLowerCase().includes(query.toLowerCase()) ||
         d.translation.toLowerCase().includes(query.toLowerCase()) ||
         d.transliteration.toLowerCase().includes(query.toLowerCase()));
      return matchCat || matchSearch;
    });
  }, [category, query]);

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe" style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-lg">Daily Duas</p>
            <p className="text-white/55 text-xs">{DUAS.length} authentic supplications</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mx-4 mb-3 bg-white/15 rounded-xl px-3 py-2">
          <span className="text-white/50 text-sm">🔍</span>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setExpanded(null); }}
            placeholder="Search duas…"
            className="flex-1 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
          />
          {query && <button onClick={() => setQuery("")} className="text-white/50 press text-sm">✕</button>}
        </div>
      </div>

      {/* Category pills */}
      {!query && (
        <div className="flex-shrink-0 bg-white border-b border-[#E8E2D8] px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {DUA_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setCategory(cat.id); setExpanded(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap press border transition-colors ${
                  category === cat.id ? "bg-primary text-white border-primary" : "bg-white text-muted border-[#E8E2D8]"
                }`}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duas list */}
      <div className="scroll-area px-4 py-4">
        {query && (
          <p className="text-muted text-xs mb-3 px-1">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"</p>
        )}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🤲</p>
            <p className="text-ink font-bold">No duas found</p>
            <p className="text-muted text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          filtered.map(dua => (
            <DuaCard
              key={dua.id}
              dua={dua}
              expanded={expanded === dua.id}
              onToggle={() => setExpanded(prev => prev === dua.id ? null : dua.id)}
            />
          ))
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}
