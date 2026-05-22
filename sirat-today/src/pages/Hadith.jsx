// src/pages/Hadith.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Hadith landing — two tabs:
//   • Collections — choose a book to browse
//   • Bookmarks   — quickly jump to saved hadiths
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { EmptyState } from "../components/common/DataStates";
import { COLLECTIONS } from "../services/hadithService";
import { useBookmarks } from "../hooks/useHadith";

export default function Hadith() {
  const [tab, setTab] = useState("collections");

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Hadith"
        subtitle="الحَدِيث الشَّرِيف"
      />

      {/* Tabs */}
      <div className="px-4 pt-3 pb-3 flex gap-2 border-b border-border/60 bg-ivory">
        <TabPill
          active={tab === "collections"}
          onClick={() => setTab("collections")}>
          Collections
        </TabPill>
        <TabPill
          active={tab === "bookmarks"}
          onClick={() => setTab("bookmarks")}>
          <span className="flex items-center gap-1.5">
            <BookmarkIcon size={13} filled={tab === "bookmarks"} />
            Bookmarks
          </span>
        </TabPill>
      </div>

      <div className="scroll-area pb-12">
        {tab === "collections" ? <CollectionsList /> : <BookmarksList />}
      </div>
    </div>
  );
}

// ─── Collections tab ────────────────────────────────────────────────────────
function CollectionsList() {
  const navigate = useNavigate();
  return (
    <ul className="px-4 pt-4 space-y-3">
      {COLLECTIONS.map(c => (
        <li key={c.id}>
          <button
            onClick={() => navigate(`/hadith/${c.id}`)}
            className="press w-full text-left p-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-primary tracking-tight leading-tight">
                  {c.name}
                </h3>
                <p
                  className="text-[15px] text-accent-dark mt-0.5"
                  style={{ fontFamily: "Amiri, serif" }}>
                  {c.arabic}
                </p>
                <p className="text-[12px] text-muted mt-1.5 leading-snug">
                  {c.compiler} · {c.period}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {c.grade && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {c.grade}
                  </span>
                )}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6"
                    stroke="#7A7268" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </button>
        </li>
      ))}

      <p className="text-center text-[11px] text-muted/70 mt-6 px-8 leading-relaxed">
        Hadith content provided by the Hadith API
        <span className="block">(github.com/fawazahmed0/hadith-api)</span>
      </p>
    </ul>
  );
}

// ─── Bookmarks tab ──────────────────────────────────────────────────────────
function BookmarksList() {
  const items = useBookmarks();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BookmarkIcon size={24} />}
        title="No bookmarks yet"
        description="Tap the bookmark icon on any hadith to save it for later."
      />
    );
  }

  return (
    <ul className="px-4 pt-4 space-y-2.5">
      {items.map(h => (
        <li key={`${h.collectionId}:${h.hadithNumber}`}>
          <button
            onClick={() => navigate(`/hadith/${h.collectionId}/hadith/${h.hadithNumber}`)}
            className="press w-full text-left p-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-primary">
                {h.collectionName}
              </span>
              <span className="text-[11px] text-muted">
                Hadith #{h.hadithNumber}
              </span>
            </div>
            {h.sectionTitle && (
              <p className="text-[12px] text-muted/80 italic mb-2 truncate">
                {h.sectionTitle}
              </p>
            )}
            <p className="text-[14px] text-body leading-relaxed line-clamp-3">
              {h.textEng}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Bits ───────────────────────────────────────────────────────────────────
function TabPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`press px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
        active ? "bg-primary text-ivory" : "bg-parchment text-body"
      }`}>
      {children}
    </button>
  );
}

function BookmarkIcon({ size = 16, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
