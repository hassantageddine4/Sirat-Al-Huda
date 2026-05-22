// src/pages/SurahReader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays one surah with:
//   • Uthmani Arabic (big + centred)
//   • English translation toggle
//   • Audio playback via public Quran.com chapter_recitations endpoint
//   • Reciter selector
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useChapters,
  useVerses,
  useChapterAudio,
} from "../hooks/useQuran";
import { useReciter } from "../hooks/useReciter";
import { ReciterDropdown } from "../components/quran/ReciterPicker";

export default function SurahReader() {
  const { id } = useParams();
  const chapterId = Number(id);
  const navigate = useNavigate();

  const [showTranslation, setShowTranslation] = useState(true);
  const { reciterId, reciter } = useReciter();

  // ── Data ──────────────────────────────────────────────────────────────────
  const { chapters } = useChapters();
  const chapter = useMemo(
    () => chapters.find(c => c.id === chapterId),
    [chapters, chapterId]
  );

  const { verses, loading: versesLoading, error: versesError } =
    useVerses(chapterId);

  const { url: audioUrl, loading: audioLoading } =
    useChapterAudio(reciterId, chapterId);

  // ── Audio player state ────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [current,   setCurrent]   = useState(0);

  // Pause on reciter/surah change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrent(0);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (isPlaying) { a.pause(); }
    else           { a.play().catch(() => setIsPlaying(false)); }
  };

  const seek = (pct) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = pct * duration;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="screen bg-ivory">
      {/* ── Header ── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button
            onClick={() => navigate("/quran")}
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span className="text-white text-lg">‹</span>
          </button>

          <div className="text-center flex-1 px-3">
            <p className="text-xs text-white/50">
              Surah {chapterId}
              {chapter && ` · ${chapter.versesCount} verses`}
            </p>
            <p className="text-white font-bold text-base">
              {chapter?.nameSimple ?? "Loading…"}
            </p>
          </div>

          <button
            onClick={() => setShowTranslation(v => !v)}
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: showTranslation ? "#C8A951" : "rgba(255,255,255,0.1)",
              color:      showTranslation ? "#082819"  : "white",
            }}>
            <span className="text-sm font-bold">T</span>
          </button>
        </div>

        {/* Arabic name & meaning */}
        {chapter && (
          <div className="px-5 pb-4 text-center">
            <p className="text-white font-semibold text-3xl font-arabic">
              {chapter.nameArabic}
            </p>
            <p className="text-accent/80 text-xs mt-1">{chapter.translatedName}</p>
          </div>
        )}
      </div>

      {/* ── Reciter selector ── */}
      <div className="px-4 py-3 flex-shrink-0 bg-white border-b border-[#E8E2D8]">
        <ReciterDropdown />
      </div>

      {/* ── Verses list ── */}
      <div className="scroll-area">
        {versesLoading && (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        )}

        {versesError && (
          <div className="mx-4 mt-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-red-600 text-sm">{versesError}</p>
          </div>
        )}

        {/* Bismillah (except Surah 9 At-Tawbah) */}
        {!versesLoading && chapter?.bismillahPre && (
          <div className="text-center py-6 px-5">
            <p className="text-primary text-2xl font-arabic leading-relaxed">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-muted text-xs mt-2">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        )}

        {!versesLoading && verses.length > 0 && (
          <div className="px-4 pb-8 space-y-3">
            {verses.map(verse => (
              <VerseCard
                key={verse.id}
                verse={verse}
                showTranslation={showTranslation}
              />
            ))}
          </div>
        )}

        {/* Space for bottom audio bar */}
        <div style={{ height: audioUrl ? 96 : 24 }} />
      </div>

      {/* ── Audio player (pinned bottom) ── */}
      {audioUrl && (
        <div className="flex-shrink-0 border-t px-4 py-3"
          style={{
            background: "linear-gradient(135deg,#0F3D2E,#1A5C44)",
            borderColor: "rgba(255,255,255,0.1)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
          }}>
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
            onTimeUpdate={e => {
              const a = e.currentTarget;
              setCurrent(a.currentTime);
              setProgress(a.duration ? a.currentTime / a.duration : 0);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => { setIsPlaying(false); setProgress(0); setCurrent(0); }}
          />

          {/* Progress bar */}
          <div
            className="w-full rounded-full overflow-hidden cursor-pointer mb-3"
            style={{ background: "rgba(255,255,255,0.12)", height: 4 }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${progress * 100}%`, background: "#C8A951" }} />
          </div>

          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={audioLoading}
              className="press w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#C8A951" }}>
              {audioLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              ) : isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-primary rounded-sm" />
                  <div className="w-1 h-3 bg-primary rounded-sm" />
                </div>
              ) : (
                <span className="text-primary font-black text-base ml-0.5">▶</span>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {chapter?.nameSimple ?? "Surah"}
              </p>
              <p className="text-white/55 text-xs truncate">{reciter.name}</p>
            </div>

            <p className="text-white/55 text-xs font-mono flex-shrink-0">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Verse card ────────────────────────────────────────────────────────────────
function VerseCard({ verse, showTranslation }) {
  return (
    <div className="rounded-xl overflow-hidden animate-fade-in"
      style={{ background: "white", border: "1px solid #E8E2D8" }}>
      {/* Header strip */}
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background: "#F4F0E8", borderBottom: "1px solid #E8E2D8" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
          <span className="text-white text-xs font-black">{verse.verseNumber}</span>
        </div>
        <p className="text-muted text-xs">
          Juz {verse.juzNumber} · Page {verse.pageNumber}
        </p>
      </div>

      {/* Arabic */}
      <div className="px-5 py-5 text-right" dir="rtl">
        <p className="text-primary leading-loose font-arabic"
          style={{ fontSize: "1.6rem", lineHeight: 2.1 }}>
          {verse.arabic}
        </p>
      </div>

      {/* Translation */}
      {showTranslation && verse.translation && (
        <div className="px-5 pb-4 pt-1 border-t border-[#E8E2D8]/60">
          <p className="text-body text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: verse.translation }} />
        </div>
      )}
    </div>
  );
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatTime(sec) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
