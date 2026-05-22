// src/pages/Quran.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useChapters } from "../hooks/useQuran";

export default function Quran() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | makkah | madinah

  const { chapters, loading, error } = useChapters();

  // ── Filter + search ───────────────────────────────────────────────────────
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter(c => {
      if (filter !== "all" && c.revelationPlace !== filter) return false;
      if (!q) return true;
      return (
        c.nameSimple.toLowerCase().includes(q) ||
        c.translatedName.toLowerCase().includes(q) ||
        c.nameArabic.includes(q) ||
        String(c.id) === q
      );
    });
  }, [chapters, query, filter]);

  return (
    <div className="screen bg-ivory">
      {/* ── Header ── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="px-5 pt-4 pb-4">
          <p className="text-xs text-white/50 mb-0.5">Read</p>
          <h1 className="text-2xl font-black text-white">The Qur'an</h1>
          <p className="text-xs text-white/45 mt-1">
            114 Surahs · Full Uthmani script · With translation
          </p>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-white/50 text-sm">🔍</span>
            <input
              className="flex-1 bg-transparent text-white text-sm placeholder-white/35 outline-none"
              placeholder="Search surah by name or number"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="press text-white/50 text-sm">✕</button>
            )}
          </div>
        </div>

        {/* Revelation place filter */}
        <div className="flex gap-2 px-5 pb-3">
          {[
            { id: "all",     label: "All" },
            { id: "makkah",  label: "Meccan" },
            { id: "madinah", label: "Medinan" },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className="press px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: filter === opt.id ? "#C8A951" : "rgba(255,255,255,0.1)",
                color:      filter === opt.id ? "#082819"  : "rgba(255,255,255,0.65)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="scroll-area">
        {loading && (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="mx-4 mt-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="text-center pt-16 px-8">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-muted text-sm">No surahs match your search.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="px-4 py-3 space-y-2">
            {visible.map(chapter => (
              <SurahRow
                key={chapter.id}
                chapter={chapter}
                onClick={() => navigate(`/quran/${chapter.id}`)}
              />
            ))}
            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Surah row ─────────────────────────────────────────────────────────────────
function SurahRow({ chapter, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left press rounded-xl overflow-hidden flex items-center gap-3 px-3 py-3 animate-fade-in"
      style={{ background: "white", border: "1px solid #E8E2D8" }}>
      {/* Number badge */}
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 relative"
        style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <span className="text-white font-black text-sm">{chapter.id}</span>
      </div>

      {/* Names + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-primary truncate">
            {chapter.nameSimple}
          </p>
          <span className="text-lg font-semibold text-primary/80 flex-shrink-0 font-arabic">
            {chapter.nameArabic}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted truncate">{chapter.translatedName}</p>
          <span className="text-xs text-muted/50">·</span>
          <p className="text-xs text-muted capitalize">{chapter.revelationPlace}</p>
          <span className="text-xs text-muted/50">·</span>
          <p className="text-xs text-muted">{chapter.versesCount} verses</p>
        </div>
      </div>

      <span className="text-muted/40 text-base flex-shrink-0">›</span>
    </button>
  );
}
