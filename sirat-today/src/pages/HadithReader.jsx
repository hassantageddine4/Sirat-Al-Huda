// src/pages/HadithReader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full reader for a single hadith. Designed to feel like a page from a
// finely-printed kitab — generous Arabic typography, calm spacing, the
// chain of grading shown as supplementary detail.
//
// Adjustable reading size persists per-user via localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { LoadingState, ErrorRetry } from "../components/common/DataStates";
import { getCollectionById } from "../services/hadithService";
import { useHadith, useBookmark } from "../hooks/useHadith";

const SIZE_KEY = "sirat_hadith_size_v1";
const SIZES = ["sm", "md", "lg", "xl"];

export default function HadithReader() {
  const { collectionId, hadithNumber } = useParams();
  const navigate = useNavigate();
  const num = parseInt(hadithNumber, 10);
  const collection = getCollectionById(collectionId);

  const { data, loading, error, refetch } = useHadith(collectionId, num);
  const { bookmarked, toggle } = useBookmark(collectionId, num);

  // Reading size
  const [size, setSize] = useState(() => {
    try { return localStorage.getItem(SIZE_KEY) ?? "md"; } catch { return "md"; }
  });
  useEffect(() => {
    try { localStorage.setItem(SIZE_KEY, size); } catch {}
  }, [size]);

  function shareHadith() {
    if (!data) return;
    const text = `"${data.textEng}"\n\n— ${data.collectionName}, Hadith ${data.hadithNumber}`;
    if (navigator.share) {
      navigator.share({ text, title: data.collectionName }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  if (!collection) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Hadith" />
        <ErrorRetry message="Collection not found." />
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={collection.name}
        subtitle={`Hadith ${num}`}
        rightAction={{
          label: bookmarked ? "Remove bookmark" : "Save bookmark",
          icon: <BookmarkIcon size={20} filled={bookmarked} color="#A88730" />,
          onClick: () => data && toggle(data),
        }}
      />

      <div className="scroll-area pb-24">
        {loading ? (
          <LoadingState label="Loading hadith…" />
        ) : error ? (
          <ErrorRetry message={error} onRetry={refetch} />
        ) : !data ? (
          <ErrorRetry message="Hadith not found." />
        ) : (
          <article className="px-6 pt-6">

            {/* Header strip */}
            {data.sectionTitle && (
              <div className="text-center pb-5 mb-5 border-b border-border/60">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-semibold">
                  Chapter {data.sectionNumber}
                </p>
                <p className="font-display text-base text-primary mt-1 italic">
                  {data.sectionTitle}
                </p>
              </div>
            )}

            {/* Arabic */}
            {data.textAra && (
              <p
                className={`text-right text-ink leading-loose mb-7 ${arabicSizeClass(size)}`}
                style={{ fontFamily: "Amiri, serif", direction: "rtl" }}>
                {data.textAra}
              </p>
            )}

            {/* Decorative divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-border/60" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent">
                <path d="M12 2L13.5 9 21 12 13.5 15 12 22 10.5 15 3 12 10.5 9z" fill="currentColor" />
              </svg>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* English */}
            <p className={`text-body leading-relaxed mb-7 ${englishSizeClass(size)}`}>
              {data.textEng}
            </p>

            {/* Grades */}
            {data.grades && data.grades.length > 0 && (
              <section className="mb-7">
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-muted font-semibold mb-2.5">
                  Grading
                </h4>
                <ul className="space-y-1.5">
                  {data.grades.map((g, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 py-1">
                      <span className="text-[13px] text-muted flex-1">{g.name}</span>
                      <span className={`text-[12px] font-semibold flex-shrink-0 ${gradeColor(g.grade)}`}>
                        {g.grade}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reference */}
            <section className="mb-7 p-4 rounded-xl bg-parchment/60">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-muted font-semibold mb-2">
                Reference
              </h4>
              <p className="text-[13px] text-body">
                {data.collectionName}, Hadith #{data.hadithNumber}
                {data.referenceBook != null && data.referenceHadith != null && (
                  <span className="text-muted">
                    {" · "}Book {data.referenceBook}, Hadith {data.referenceHadith}
                  </span>
                )}
              </p>
            </section>

            {/* Actions */}
            <div className="flex gap-2 mb-7">
              <button
                onClick={() => toggle(data)}
                className="press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-ivory font-semibold text-sm">
                <BookmarkIcon size={14} filled={bookmarked} color="#FAF7F2" />
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
              <button
                onClick={shareHadith}
                className="press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-parchment text-primary font-semibold text-sm">
                <ShareIcon size={14} />
                Share
              </button>
            </div>

            {/* Reading size adjuster */}
            <section className="mb-7">
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-muted font-semibold mb-2.5">
                Reading size
              </h4>
              <div className="flex gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`press px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wide ${
                      size === s ? "bg-primary text-ivory" : "bg-parchment text-body"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Prev / Next */}
            <nav className="flex items-stretch gap-2 mb-4">
              {num > 1 && (
                <button
                  onClick={() => navigate(`/hadith/${collectionId}/hadith/${num - 1}`)}
                  className="press flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-border/60 hover:border-accent/40 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="#0F3D2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-semibold text-primary">Hadith {num - 1}</span>
                </button>
              )}
              <button
                onClick={() => navigate(`/hadith/${collectionId}/hadith/${num + 1}`)}
                className="press flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-border/60 hover:border-accent/40 text-sm">
                <span className="font-semibold text-primary">Hadith {num + 1}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#0F3D2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>

            <p className="text-center text-[11px] text-muted/70">
              Hadith data: github.com/fawazahmed0/hadith-api
            </p>
          </article>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function arabicSizeClass(size) {
  return {
    sm: "text-[20px]",
    md: "text-[24px]",
    lg: "text-[28px]",
    xl: "text-[32px]",
  }[size] ?? "text-[24px]";
}
function englishSizeClass(size) {
  return {
    sm: "text-[14px]",
    md: "text-[15px]",
    lg: "text-[17px]",
    xl: "text-[19px]",
  }[size] ?? "text-[15px]";
}
function gradeColor(grade = "") {
  const g = grade.toLowerCase();
  if (g.includes("sahih") || g.includes("authentic")) return "text-emerald-700";
  if (g.includes("hasan")) return "text-amber-700";
  if (g.includes("daif") || g.includes("weak")) return "text-orange-700";
  if (g.includes("mawdu") || g.includes("fabricat")) return "text-red-700";
  return "text-muted";
}

function BookmarkIcon({ size = 16, filled, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
        fill={filled ? color : "none"}
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
        stroke="#0F3D2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
