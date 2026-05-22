// src/pages/RecitationPractice.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full Recitation Practice screen.
//
// Flow:
//   1. Pick a surah
//   2. Pick a reciter
//   3. For each ayah:
//      • See word-by-word Arabic
//      • Play correct recitation
//      • Record your own
//      • Get feedback (green / red / yellow per word)
//      • If accuracy ≥ 85 %, advance to next ayah
//      • Otherwise stay on the same ayah and try again
//   4. XP + streak + achievements update after every attempt
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChapters, useChapterAudio } from "../hooks/useQuran";
import { getVersesWithWords } from "../services/quranService";
import { useReciter } from "../hooks/useReciter";
import { ReciterDropdown } from "../components/quran/ReciterPicker";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { transcribeAudio } from "../services/transcriptionService";
import { analyzePronunciation } from "../services/pronunciationAnalyzer";
import {
  recordAttempt,
  getSurahProgress,
} from "../services/recitationProgress";
import { getLevel, getAchievements, diffAchievements } from "../services/gamification";

const PASS_THRESHOLD = 0.85;

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function RecitationPractice() {
  const navigate = useNavigate();
  const [step, setStep]           = useState("select"); // select | practice
  const [surahId, setSurahId]     = useState(null);

  const { chapters, loading: chaptersLoading } = useChapters();

  return (
    <div className="screen bg-ivory">
      {step === "select" && (
        <SelectScreen
          chapters={chapters}
          loading={chaptersLoading}
          onBack={() => navigate("/practice")}
          onStart={(id) => { setSurahId(id); setStep("practice"); }}
        />
      )}
      {step === "practice" && surahId && (
        <PracticeScreen
          surahId={surahId}
          chapter={chapters.find(c => c.id === surahId)}
          onExit={() => setStep("select")}
        />
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — SELECT SURAH + RECITER
// ═════════════════════════════════════════════════════════════════════════════

function SelectScreen({ chapters, loading, onBack, onStart }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(c =>
      c.nameSimple.toLowerCase().includes(q) ||
      c.translatedName.toLowerCase().includes(q) ||
      String(c.id) === q
    );
  }, [chapters, query]);

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center px-4 pt-4 pb-3">
          <button onClick={onBack}
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span className="text-white text-lg">‹</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-xs text-white/50">Practice</p>
            <p className="text-white font-bold text-base">Recitation</p>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <div className="px-5 pb-3">
          <h1 className="text-2xl font-black text-white">Choose a Surah</h1>
          <p className="text-white/55 text-xs mt-1">
            Listen, recite, and get word-by-word feedback
          </p>
        </div>

        {/* Reciter selector in header */}
        <div className="px-4 pb-3">
          <ReciterDropdown />
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-white/50 text-sm">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/35 outline-none"
              placeholder="Search surah"
            />
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <ProgressSummary />

      {/* Surah list */}
      <div className="scroll-area">
        {loading && (
          <div className="flex justify-center pt-12">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="px-4 py-3 space-y-2">
            {visible.map(c => (
              <SurahRowWithProgress key={c.id} chapter={c} onClick={() => onStart(c.id)} />
            ))}
            <div className="h-4" />
          </div>
        )}
      </div>
    </>
  );
}

function SurahRowWithProgress({ chapter, onClick }) {
  const progress = getSurahProgress(chapter.id);
  const pct = Math.round(progress.progress * 100);

  return (
    <button onClick={onClick}
      className="w-full text-left press rounded-xl overflow-hidden flex items-center gap-3 px-3 py-3 animate-fade-in"
      style={{ background: "white", border: "1px solid #E8E2D8" }}>
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
        <span className="text-white font-black text-sm">{chapter.id}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-primary truncate">{chapter.nameSimple}</p>
          <span className="text-lg font-semibold text-primary/80 flex-shrink-0 font-arabic">
            {chapter.nameArabic}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted truncate">{chapter.translatedName}</p>
          <span className="text-xs text-muted/50">·</span>
          <p className="text-xs text-muted">{chapter.versesCount} verses</p>
        </div>

        {/* Progress bar */}
        {progress.totalAyahs > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F4F0E8" }}>
              <div className="h-full rounded-full"
                style={{ width: `${pct}%`, background: "#C8A951" }} />
            </div>
            <p className="text-xs font-bold text-accent">{pct}%</p>
          </div>
        )}
      </div>

      <span className="text-muted/40 text-base flex-shrink-0">›</span>
    </button>
  );
}

function ProgressSummary() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    import("../services/recitationProgress").then(m => {
      setStats({
        overall: m.getOverallStats(),
      });
    });
  }, []);

  if (!stats) return null;
  const { overall } = stats;
  const level = getLevel(overall.totalXp);

  return (
    <div className="px-4 pt-3 pb-1">
      <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #E8E2D8" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted">Level</p>
            <p className="text-base font-black" style={{ color: level.current.color }}>
              {level.current.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Streak</p>
            <p className="text-base font-black text-accent">
              {overall.streak} 🔥
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">XP</p>
            <p className="text-base font-black text-primary">{overall.totalXp}</p>
          </div>
        </div>
        {level.next && (
          <>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F4F0E8" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${level.progressToNext * 100}%`, background: level.current.color }} />
            </div>
            <p className="text-xs text-muted mt-1.5">
              {level.xpToNext - level.xpIntoLevel} XP to {level.next.name}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — PRACTICE SCREEN
// ═════════════════════════════════════════════════════════════════════════════

function PracticeScreen({ surahId, chapter, onExit }) {
  const { reciterId } = useReciter();

  // Load verses with word data
  const [verses, setVerses]           = useState([]);
  const [versesLoading, setVersesLoading] = useState(true);
  const [versesError, setVersesError]     = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setVersesLoading(true);
    getVersesWithWords(surahId, { signal: ctrl.signal }).then(({ data, error }) => {
      if (ctrl.signal.aborted) return;
      setVerses(data);
      setVersesError(error);
      setVersesLoading(false);
    });
    return () => ctrl.abort();
  }, [surahId]);

  // Jump to first incomplete ayah
  const [ayahIndex, setAyahIndex] = useState(0);
  useEffect(() => {
    if (!verses.length) return;
    const progress = getSurahProgress(surahId);
    const done = new Set(progress.completedAyahs);
    const firstIncomplete = verses.findIndex(v => !done.has(v.verseNumber));
    setAyahIndex(firstIncomplete === -1 ? 0 : firstIncomplete);
  }, [verses, surahId]);

  const currentAyah = verses[ayahIndex];

  // Audio for reference recitation
  const { url: audioUrl } = useChapterAudio(reciterId, surahId);

  // Recording + analysis state
  const recorder = useAudioRecorder();
  const [pipelineState, setPipelineState] = useState("idle"); // idle | transcribing | analyzing | done
  const [analysis,      setAnalysis]      = useState(null);
  const [pipelineError, setPipelineError] = useState(null);
  const [lastAttempt,   setLastAttempt]   = useState(null);

  // ── Record + analyze flow ─────────────────────────────────────────────────
  const handleStopAndAnalyze = useCallback(async () => {
    const blob = await recorder.stop();
    if (!blob || !currentAyah) return;

    setPipelineError(null);
    setPipelineState("transcribing");

    const { text, error } = await transcribeAudio(blob);
    if (error) {
      setPipelineError(error);
      setPipelineState("idle");
      return;
    }

    setPipelineState("analyzing");
    const result = analyzePronunciation(currentAyah.arabic, text);
    setAnalysis(result);

    // Record progress + gamification
    const before = getAchievements(
      verses.length ? [{ id: surahId, versesCount: verses.length }] : []
    );
    const attempt = recordAttempt({
      surahId,
      ayahNumber: currentAyah.verseNumber,
      accuracy:   result.accuracy,
      totalAyahs: verses.length,
    });
    const after = getAchievements([{ id: surahId, versesCount: verses.length }]);

    setLastAttempt({
      ...attempt,
      newAchievements: diffAchievements(before, after),
      transcription:   text,
    });
    setPipelineState("done");
  }, [recorder, currentAyah, verses.length, surahId]);

  // ── Advance to next ayah (only if passed) ─────────────────────────────────
  function goNext() {
    if (ayahIndex < verses.length - 1) {
      setAyahIndex(ayahIndex + 1);
      setAnalysis(null);
      setLastAttempt(null);
      setPipelineState("idle");
    } else {
      // finished surah — back to picker
      onExit();
    }
  }

  function retry() {
    setAnalysis(null);
    setLastAttempt(null);
    setPipelineState("idle");
    setPipelineError(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (versesLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="w-10 h-10 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
      </div>
    );
  }

  if (versesError || !currentAyah) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-4xl mb-3">📖</p>
        <p className="text-ink font-bold mb-2">Could not load surah.</p>
        <button onClick={onExit}
          className="press px-4 py-2 rounded-full bg-accent text-primary font-bold text-sm">
          Go back
        </button>
      </div>
    );
  }

  const isPass = analysis && analysis.accuracy >= PASS_THRESHOLD;

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center px-4 pt-4 pb-3">
          <button onClick={onExit}
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span className="text-white text-lg">‹</span>
          </button>
          <div className="flex-1 text-center px-3">
            <p className="text-xs text-white/50">
              {chapter?.nameSimple ?? "Surah"} · Ayah {currentAyah.verseNumber} of {verses.length}
            </p>
            <p className="text-white font-bold text-sm">
              {chapter?.translatedName}
            </p>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${((ayahIndex + 1) / verses.length) * 100}%`,
                background: "#C8A951"
              }} />
          </div>
        </div>
      </div>

      <div className="scroll-area">
        {/* Ayah display — word-by-word */}
        <div className="p-5">
          <AyahDisplay
            ayah={currentAyah}
            analysis={analysis}
          />
        </div>

        {/* Audio controls */}
        <div className="px-5 pb-4">
          <ReferenceAudioBar surahId={surahId} chapter={chapter} audioUrl={audioUrl} />
        </div>

        {/* Error */}
        {pipelineError && (
          <div className="mx-5 mb-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-red-600 text-sm">{pipelineError}</p>
          </div>
        )}

        {recorder.error && (
          <div className="mx-5 mb-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-red-600 text-sm">{recorder.error}</p>
          </div>
        )}

        {/* Feedback card */}
        {analysis && (
          <div className="px-5 pb-4">
            <FeedbackCard
              analysis={analysis}
              lastAttempt={lastAttempt}
              isPass={isPass}
            />
          </div>
        )}

        {/* Space for bottom bar */}
        <div style={{ height: 120 }} />
      </div>

      {/* Bottom action bar — record / stop / retry / next */}
      <div className="flex-shrink-0 border-t px-4 py-3 flex items-center gap-3"
        style={{
          background: "white", borderColor: "#E8E2D8",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
        }}>
        <ActionBar
          recorder={recorder}
          pipelineState={pipelineState}
          analysis={analysis}
          isPass={isPass}
          isLastAyah={ayahIndex === verses.length - 1}
          onStart={recorder.start}
          onStop={handleStopAndAnalyze}
          onCancel={recorder.cancel}
          onRetry={retry}
          onNext={goNext}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORD-BY-WORD AYAH DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function AyahDisplay({ ayah, analysis }) {
  // Map analyzer word-status onto the display words.
  // Analyzer works on normalized strings, so we align by position in sequence.
  const statusMap = useMemo(() => {
    if (!analysis) return new Map();
    const m = new Map();
    let idx = 0;
    for (const w of analysis.words) {
      if (w.status === "extra") continue; // extras don't correspond to a ref word
      m.set(idx++, w);
    }
    return m;
  }, [analysis]);

  return (
    <div className="rounded-2xl p-5 shadow-sm"
      style={{ background: "white", border: "1px solid #E8E2D8" }}>
      {/* Ayah header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
          <span className="text-white text-xs font-black">{ayah.verseNumber}</span>
        </div>
        <p className="text-xs text-muted">
          {ayah.words.length} word{ayah.words.length !== 1 && "s"}
        </p>
      </div>

      {/* Words */}
      <div className="flex flex-wrap gap-x-2 gap-y-3 justify-end" dir="rtl">
        {ayah.words.map((w, i) => {
          const status = statusMap.get(i)?.status;
          return <WordChip key={w.id} word={w} status={status} />;
        })}
      </div>

      {/* Translation */}
      {ayah.translation && (
        <div className="mt-4 pt-4 border-t border-[#E8E2D8]/60">
          <p className="text-body text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ayah.translation }} />
        </div>
      )}
    </div>
  );
}

function WordChip({ word, status }) {
  // Status colour key: green=correct, red=incorrect, yellow=missing
  const palette = {
    correct:   { bg: "#DCFCE7", fg: "#15803D", border: "#86EFAC" },
    incorrect: { bg: "#FEE2E2", fg: "#B91C1C", border: "#FCA5A5" },
    missing:   { bg: "#FEF3C7", fg: "#A16207", border: "#FDE68A" },
  };
  const style = status ? palette[status] : null;

  return (
    <div className="inline-flex flex-col items-center px-2 py-1 rounded-lg"
      style={{
        background: style?.bg ?? "transparent",
        border:     style ? `1px solid ${style.border}` : "1px solid transparent",
      }}>
      <span className="font-arabic leading-snug"
        style={{ fontSize: "1.45rem", color: style?.fg ?? "#0F3D2E" }}>
        {word.text}
      </span>
      {word.translation && (
        <span className="text-[9px] text-muted/70 mt-0.5"
          style={{ color: style?.fg ?? undefined }}>
          {word.translation}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE AUDIO BAR (listen to correct recitation)
// ─────────────────────────────────────────────────────────────────────────────

function ReferenceAudioBar({ audioUrl, chapter }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (playing) a.pause();
    else         a.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
  }, [audioUrl]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        disabled={!audioUrl}
        className="press w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
        style={{ background: "#C8A951" }}>
        {playing ? (
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-primary rounded-sm" />
            <div className="w-1 h-3 bg-primary rounded-sm" />
          </div>
        ) : (
          <span className="text-primary font-black text-base ml-0.5">▶</span>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold">Listen first</p>
        <p className="text-white/55 text-xs truncate">
          {chapter?.nameSimple ?? "Surah"} · Full recitation
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM ACTION BAR
// ─────────────────────────────────────────────────────────────────────────────

function ActionBar({
  recorder, pipelineState, analysis, isPass, isLastAyah,
  onStart, onStop, onCancel, onRetry, onNext,
}) {
  // Pipeline running — show spinner only
  if (pipelineState === "transcribing" || pipelineState === "analyzing") {
    const label = pipelineState === "transcribing"
      ? "Transcribing…"
      : "Analyzing…";
    return (
      <div className="flex-1 flex items-center justify-center gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        <p className="text-sm font-semibold text-muted">{label}</p>
      </div>
    );
  }

  // Results shown — show retry + next
  if (analysis) {
    return (
      <>
        <button onClick={onRetry}
          className="press flex-1 py-3 rounded-xl font-bold text-sm"
          style={{ background: "#F4F0E8", color: "#0F3D2E" }}>
          Retry
        </button>
        <button
          onClick={onNext}
          disabled={!isPass}
          className="press flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
          style={{ background: isPass ? "#22C55E" : "#C8A951", color: "#082819" }}>
          {!isPass ? "Keep practicing" : isLastAyah ? "Finish" : "Next Ayah →"}
        </button>
      </>
    );
  }

  // Recording in progress
  if (recorder.state === "recording") {
    return (
      <>
        <button onClick={onCancel}
          className="press w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#F4F0E8" }}>
          <span className="text-muted text-base">✕</span>
        </button>

        <div className="flex-1 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <p className="text-sm font-mono font-bold text-ink flex-shrink-0">
            {formatTime(recorder.elapsed)}
          </p>
          <WaveformMini level={recorder.level} />
        </div>

        <button onClick={onStop}
          className="press w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#EF4444" }}>
          <div className="w-5 h-5 bg-white rounded-sm" />
        </button>
      </>
    );
  }

  // Idle — show record button
  return (
    <button onClick={onStart}
      className="press flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
      style={{ background: "#C8A951", color: "#082819" }}>
      <span>🎙</span>
      <span>Start recording</span>
    </button>
  );
}

// Compact 20-bar waveform
function WaveformMini({ level }) {
  const bars = 20;
  return (
    <div className="flex-1 flex items-center justify-center gap-0.5" style={{ height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const phase = (i / bars) * Math.PI * 2;
        const sine  = (Math.sin(phase + Date.now() * 0.006) + 1) / 2;
        const h     = Math.max(3, Math.min(24, level * 22 + sine * level * 8));
        return (
          <div key={i}
            className="w-0.5 rounded-full transition-all"
            style={{ height: h, background: "#C8A951" }} />
        );
      })}
    </div>
  );
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK CARD
// ─────────────────────────────────────────────────────────────────────────────

function FeedbackCard({ analysis, lastAttempt, isPass }) {
  const accuracy = analysis.accuracyPercent;

  const levelColor =
    accuracy >= 95 ? "#22C55E"
    : accuracy >= 85 ? "#C8A951"
    : accuracy >= 65 ? "#F97316"
    : "#EF4444";

  return (
    <div className="rounded-2xl p-5"
      style={{
        background: "white",
        border: `1px solid ${levelColor}33`,
      }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted">Your accuracy</p>
          <p className="text-3xl font-black" style={{ color: levelColor }}>
            {accuracy}%
          </p>
        </div>
        <div className="text-right">
          {lastAttempt?.xpEarned > 0 && (
            <div className="inline-block px-3 py-1.5 rounded-full"
              style={{ background: "rgba(200,169,81,0.15)" }}>
              <p className="text-xs font-bold" style={{ color: "#A88730" }}>
                +{lastAttempt.xpEarned} XP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatTile label="Correct"   count={analysis.correctCount}   color="#22C55E" />
        <StatTile label="Incorrect" count={analysis.incorrectCount} color="#EF4444" />
        <StatTile label="Missing"   count={analysis.missingCount}   color="#F97316" />
      </div>

      {/* Feedback text */}
      <div className="rounded-xl p-3"
        style={{ background: isPass ? "rgba(34,197,94,0.08)" : "#F4F0E8" }}>
        <p className="text-sm text-body leading-relaxed">{analysis.feedback}</p>
      </div>

      {/* New achievements */}
      {lastAttempt?.newAchievements?.length > 0 && (
        <div className="mt-3 rounded-xl p-3"
          style={{ background: "rgba(200,169,81,0.12)", border: "1px solid rgba(200,169,81,0.3)" }}>
          <p className="text-xs font-bold text-accent mb-2">🎉 Achievement unlocked!</p>
          {lastAttempt.newAchievements.map(a => (
            <p key={a.id} className="text-sm font-semibold text-ink">
              {a.icon} {a.title}
            </p>
          ))}
        </div>
      )}

      {/* Surah completed banner */}
      {lastAttempt?.surahNewlyCompleted && (
        <div className="mt-3 rounded-xl p-3"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <p className="text-sm font-bold text-green-800">🏆 Surah complete — well done!</p>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, count, color }) {
  return (
    <div className="rounded-xl p-2 text-center" style={{ background: `${color}10` }}>
      <p className="text-xl font-black" style={{ color }}>{count}</p>
      <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{label}</p>
    </div>
  );
}
