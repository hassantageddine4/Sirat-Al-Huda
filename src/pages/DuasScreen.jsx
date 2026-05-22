// src/pages/DuasScreen.jsx
import Icon from "../components/common/Icon";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DUAS, DUA_CATEGORIES } from "../data/duas";
import { useBranch } from "../hooks/useBranch";
import { getBookmarks, toggleBookmark, isBookmarked as isB } from "../services/bookmarks";

function DuaCard({ dua, expanded, onToggle, isBookmarked, onToggleBookmark }) {
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
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          className="press p-1.5 -m-1.5 mr-1"
          style={{ color: isBookmarked ? "#C8A951" : "#A09890" }}>
          <Icon name="bookmark" size={16} filled={isBookmarked} />
        </button>
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
            <div className="bg-blue-50 rounded-xl p-3">
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
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const showingBookmarks = category === "bookmarks";
  const handleToggleBookmark = (duaId) => { toggleBookmark(duaId); setBookmarks(getBookmarks()); };
  const { branch } = useBranch();
  const matchBranch = (d) => !branch || !d.tradition || d.tradition === "both" || d.tradition === branch;

  const filtered = useMemo(() => {
    if (showingBookmarks) {
      return DUAS.filter(d => bookmarks.includes(d.id) && matchBranch(d));
    }
    return DUAS.filter(d => {
      if (!matchBranch(d)) return false;
      const matchCat = !query && d.category === category;
      const matchSearch = query &&
        (d.title.toLowerCase().includes(query.toLowerCase()) ||
         d.translation.toLowerCase().includes(query.toLowerCase()) ||
         d.transliteration.toLowerCase().includes(query.toLowerCase()));
      return matchCat || matchSearch;
    });
  }, [category, query, bookmarks, showingBookmarks]);

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
          <span className="text-white/50 flex items-center"><Icon name="search" size={16} /></span>
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
            <button
              onClick={() => { setCategory("bookmarks"); setExpanded(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap press border transition-colors ${
                showingBookmarks ? "bg-primary text-white border-primary" : "bg-white text-muted border-[#E8E2D8]"
              }`}>
              <Icon name="bookmark" size={12} filled={showingBookmarks} />
              Saved
            </button>
            {DUA_CATEGORIES.filter(cat => cat.id !== "shiaImams" || branch === "shia").map(cat => (
              <button key={cat.id} onClick={() => { setCategory(cat.id); setExpanded(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap press border transition-colors ${
                  category === cat.id ? "bg-primary text-white border-primary" : "bg-white text-muted border-[#E8E2D8]"
                }`}>
                {cat.label}
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
            <div className="mb-3" style={{ color: "#C8A951" }}><Icon name="duaBook" size={40} /></div>
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
              isBookmarked={bookmarks.includes(dua.id)}
              onToggleBookmark={() => handleToggleBookmark(dua.id)}
            />
          ))
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}
