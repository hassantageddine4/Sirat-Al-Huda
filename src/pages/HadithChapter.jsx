// src/pages/HadithChapter.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Single chapter (section) of a hadith collection. Lists all hadiths in the
// chapter, with both Arabic and English visible at a glance. Tap any card
// to open the full hadith reader.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { LoadingState, ErrorRetry, EmptyState } from "../components/common/DataStates";
import { getCollectionById } from "../services/hadithService";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useSection, useBookmark } from "../hooks/useHadith";

export default function HadithChapter() {
  const { collectionId, sectionNumber } = useParams();
  const navigate = useNavigate();
  const sectionNum = parseInt(sectionNumber, 10);
  const collection = getCollectionById(collectionId);

  const { data, loading, error, refetch } = useSection(collectionId, sectionNum);

  if (!collection) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Chapter" />
        <ErrorRetry message="Collection not found." />
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={data?.section?.title ?? `Chapter ${sectionNum}`}
        subtitle={collection.name}
      />

      <div className="scroll-area pb-nav">
        {loading ? (
          <LoadingState label="Loading chapter…" />
        ) : error ? (
          <ErrorRetry message={error} onRetry={refetch} />
        ) : !data || data.hadiths.length === 0 ? (
          <EmptyState title="No hadiths" description="This chapter appears to be empty." />
        ) : (
          <>
            {/* Section header */}
            <div className="px-5 pt-5 pb-3 text-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-semibold">
                Chapter {sectionNum}
              </p>
              <h2 className="font-display text-2xl text-primary tracking-tight mt-1.5 leading-tight">
                {data.section.title}
              </h2>
              <p className="text-[12px] text-muted/70 mt-2">
                {data.hadiths.length} {data.hadiths.length === 1 ? "hadith" : "hadiths"}
              </p>
              <div className="mx-auto w-12 h-px bg-accent/40 mt-4" />
            </div>

            {/* Hadith cards (virtualized) */}
            <VirtualHadithList
              hadiths={data.hadiths}
              onOpen={(h) => navigate(`/hadith/${collectionId}/hadith/${h.hadithNumber}`)}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────
function HadithListCard({ hadith, onClick, index }) {
  const { bookmarked, toggle } = useBookmark(hadith.collectionId, hadith.hadithNumber);

  function handleBookmarkClick(e) {
    e.stopPropagation();
    toggle(hadith);
  }

  return (
    <li
      style={{
        animation: `fadeIn 240ms ease-out ${Math.min(index, 12) * 18}ms both`,
      }}>
      <article
        onClick={onClick}
        className="press w-full text-left rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 cursor-pointer p-5 transition-colors">

        <header className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase text-primary">
            Hadith #{hadith.hadithNumber}
          </span>
          <div className="flex items-center gap-2">
            {hadith.grades?.[0]?.grade && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {hadith.grades[0].grade}
              </span>
            )}
            <button
              onClick={handleBookmarkClick}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark hadith"}
              className="press w-8 h-8 -mr-1 rounded-full flex items-center justify-center hover:bg-parchment text-accent-dark">
              <BookmarkIcon size={16} filled={bookmarked} />
            </button>
          </div>
        </header>

        {/* Arabic */}
        {hadith.textAra && (
          <p
            className="text-right text-[18px] text-ink leading-loose mb-3"
            style={{ fontFamily: "Amiri, serif", direction: "rtl" }}>
            {hadith.textAra}
          </p>
        )}

        {/* English */}
        <p className="text-[14px] text-body leading-relaxed line-clamp-4" style={{ fontStyle: hadith.textEng ? "normal" : "italic", opacity: hadith.textEng ? 1 : 0.5 }}>
          {hadith.textEng}
        </p>

        <p className="text-[11px] text-muted mt-3 italic">Tap to read full hadith</p>
      </article>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </li>
  );
}

function BookmarkIcon({ size = 16, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Virtualized list ───────────────────────────────────────────────────────
function VirtualHadithList({ hadiths, onOpen }) {
  const listRef = useRef(null);

  const virtualizer = useWindowVirtualizer({
    count: hadiths.length,
    estimateSize: () => 220,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={listRef} className="px-4">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}>
        {virtualizer.getVirtualItems().map((vRow) => {
          const h = hadiths[vRow.index];
          return (
            <div
              key={h.hadithNumber}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vRow.start - virtualizer.options.scrollMargin}px)`,
                paddingBottom: 12,
              }}>
              <HadithListCard
                hadith={h}
                onClick={() => onOpen(h)}
                index={vRow.index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
