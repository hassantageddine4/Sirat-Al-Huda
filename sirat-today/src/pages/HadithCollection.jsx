// src/pages/HadithCollection.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Single-collection page. Two modes:
//   • Chapter browse — list of all sections in the collection
//   • Search results — when a query is entered, swap to filtered hadiths
//
// Search uses an in-memory filter on the cached full edition. Results are
// paginated with infinite scroll.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { LoadingState, ErrorRetry, EmptyState } from "../components/common/DataStates";
import { getCollectionById } from "../services/hadithService";
import { useSectionIndex, useHadithSearch } from "../hooks/useHadith";

export default function HadithCollection() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const collection = getCollectionById(collectionId);

  const [searchInput, setSearchInput] = useState("");
  const inSearch = searchInput.trim().length > 0;

  if (!collection) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Hadith" />
        <ErrorRetry message="Collection not found." onRetry={() => navigate("/hadith")} retryLabel="Back to Hadith" />
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader title={collection.name} subtitle={collection.arabic} />

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2 sticky top-0 bg-ivory z-10 border-b border-border/60">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${collection.name}…`}
            className="w-full pl-10 pr-10 py-3 rounded-full bg-parchment border border-transparent focus:border-accent/50 focus:outline-none text-sm text-ink placeholder:text-muted"
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.75" />
            <path d="M14.5 14.5L19 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          {inSearch && (
            <button
              onClick={() => setSearchInput("")}
              className="press absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-ivory">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="#7A7268" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="scroll-area pb-12">
        {inSearch
          ? <SearchResults collectionId={collectionId} query={searchInput} />
          : <ChaptersList collectionId={collectionId} />}
      </div>
    </div>
  );
}

// ─── Chapters list ──────────────────────────────────────────────────────────
function ChaptersList({ collectionId }) {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useSectionIndex(collectionId);

  if (loading) return <LoadingState label="Loading chapters…" />;
  if (error)   return <ErrorRetry message={error} onRetry={refetch} />;
  if (!data || data.sections.length === 0) {
    return <EmptyState title="No chapters" description="This collection doesn't have a chapter index." />;
  }

  return (
    <>
      <p className="px-5 pt-4 text-[12px] text-muted">
        {data.sections.length} chapters · {data.total.toLocaleString()} hadiths
      </p>

      <ul className="px-4 pt-3 space-y-1.5">
        {data.sections.map((section, idx) => {
          const detail = data.sectionDetail?.[section.number];
          const range = detail
            ? `#${detail.hadithnumber_first}–${detail.hadithnumber_last}`
            : null;

          return (
            <li
              key={section.number}
              style={{
                animation: `fadeIn 240ms ease-out ${Math.min(idx, 12) * 18}ms both`,
              }}>
              <button
                onClick={() => navigate(`/hadith/${collectionId}/chapter/${section.number}`)}
                className="press w-full flex items-center gap-3 p-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 text-left">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-parchment text-primary/80 font-display font-bold text-sm flex items-center justify-center">
                  {section.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[16px] text-primary tracking-tight leading-tight line-clamp-2">
                    {section.title}
                  </div>
                  {range && (
                    <p className="text-[11px] text-muted/80 mt-0.5">{range}</p>
                  )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path d="M9 6l6 6-6 6" stroke="#7A7268" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </>
  );
}

// ─── Search results ─────────────────────────────────────────────────────────
function SearchResults({ collectionId, query }) {
  const navigate = useNavigate();
  const { results, total, loading, error, hasMore, loadMore, committedQuery } =
    useHadithSearch(collectionId, query);

  const sentinelRef = useRef(null);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) loadMore(); }),
      { rootMargin: "200px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  if (loading && results.length === 0) {
    return <LoadingState label={`Searching "${query}"…`} />;
  }
  if (error) {
    return <ErrorRetry message={error} />;
  }
  if (!loading && results.length === 0 && committedQuery) {
    return (
      <EmptyState
        title={`No matches for "${committedQuery}"`}
        description="Try different keywords or a hadith number."
      />
    );
  }

  return (
    <div className="px-4 pt-3 pb-6">
      <p className="px-1 pb-3 text-[12px] text-muted">
        {total.toLocaleString()} {total === 1 ? "match" : "matches"}
      </p>

      <ul className="space-y-2.5">
        {results.map(h => (
          <li key={`${h.collectionId}:${h.hadithNumber}`}>
            <button
              onClick={() => navigate(`/hadith/${h.collectionId}/hadith/${h.hadithNumber}`)}
              className="press w-full text-left p-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-primary">
                  Hadith #{h.hadithNumber}
                </span>
                {h.sectionTitle && (
                  <span className="text-[11px] text-muted/80 italic truncate ml-2">
                    {h.sectionTitle}
                  </span>
                )}
              </div>
              <p className="text-[14px] text-body leading-relaxed line-clamp-3">
                <Highlighted text={h.textEng} query={committedQuery} />
              </p>
            </button>
          </li>
        ))}
      </ul>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 text-center">
          {loading
            ? <span className="text-[12px] text-muted">Loading more…</span>
            : <span className="text-[12px] text-muted/60">Scroll for more</span>}
        </div>
      )}
    </div>
  );
}

// Render text with the matched query in bold
function Highlighted({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-primary bg-accent/15 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  );
}
