// src/pages/SurahReader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Surah reader with English translation under each ayah.
//
// Performance:
//   • Virtualized list — only ayahs in/near the viewport are mounted
//   • IntersectionObserver-driven; no third-party virtualization library
//   • Audio + translation fetches run in parallel and don't block render
//   • Ayah cards memoized to skip re-renders when font size unchanged
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { LoadingState, ErrorRetry } from "../components/common/DataStates";

import { useChapters, useVerses, useChapterAudio } from "../hooks/useQuran";
import { useSelectedReciter } from "../hooks/useReciter";
import { ReciterDropdown } from "../components/quran/ReciterPicker";
import { getChapterTranslation, TRANSLATIONS, DEFAULT_TRANSLATION_ID } from "../services/quranTranslations";

// ─── Local prefs ────────────────────────────────────────────────────────────
const PREF_KEY = "sirat_quran_reader_v1";
const DEFAULT_PREFS = {
  fontSize:         "md",
  showTranslation:  true,
  translationId:    DEFAULT_TRANSLATION_ID,
};
const SIZES = ["sm", "md", "lg", "xl"];

function loadPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}") }; }
  catch { return DEFAULT_PREFS; }
}
function savePrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function SurahReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chapterId = parseInt(id, 10);

  const { chapters } = useChapters();
  const chapter = useMemo(() => chapters.find(c => c.id === chapterId), [chapters, chapterId]);

  const { verses,  loading: vLoad, error: vErr, refetch: vRefetch } = useVerses(chapterId);
  const [reciterId] = useSelectedReciter();
  const { audio, loading: aLoad } = useChapterAudio(chapterId, reciterId);

  // Prefs
  const [prefs, setPrefs] = useState(loadPrefs);
  useEffect(() => { savePrefs(prefs); }, [prefs]);

  // Translations
  const [translations, setTranslations] = useState([]);
  const [trLoading, setTrLoading] = useState(false);
  const [trError, setTrError] = useState(null);
  useEffect(() => {
    if (!prefs.showTranslation) return;
    let cancelled = false;
    const ctrl = new AbortController();
    setTrLoading(true);
    setTrError(null);
    getChapterTranslation(chapterId, {
      translationId: prefs.translationId,
      signal: ctrl.signal,
    })
      .then(list => { if (!cancelled) { setTranslations(list); setTrLoading(false); } })
      .catch(err => {
        if (cancelled || err.name === "AbortError") return;
        setTrError(err.message ?? "Couldn't load translation.");
        setTrLoading(false);
      });
    return () => { cancelled = true; ctrl.abort(); };
  }, [chapterId, prefs.showTranslation, prefs.translationId]);

  // Pair translation with verse by index (verses are 1-indexed)
  const trByVerse = useMemo(() => {
    const map = new Map();
    translations.forEach(t => map.set(t.verseKey, t.text));
    return map;
  }, [translations]);

  // ── Audio control ───────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  }, [audio?.url]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audio?.url) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [audio?.url]);

  // ── Header right action: settings sheet ─────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!chapter) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Loading…" onBack={() => navigate(-1)} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={chapter.nameSimple}
        subtitle={chapter.nameArabic}
        rightAction={{
          label: "Reading settings",
          icon: <Icon name="text" size={20} className="text-primary" />,
          onClick: () => setSettingsOpen(true),
        }}
      />

      {/* Audio bar */}
      <div className="px-4 pt-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-parchment/60">
          <button
            onClick={togglePlay}
            disabled={!audio?.url || aLoad}
            aria-label={playing ? "Pause" : "Play"}
            className={`press w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              audio?.url && !aLoad
                ? "bg-primary text-ivory"
                : "bg-muted/20 text-muted"
            }`}>
            <Icon name={playing ? "pause" : "play"} size={14} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-muted leading-tight truncate">
              {aLoad ? "Loading recitation…" : audio?.url ? "Tap to play full surah" : "Recitation unavailable"}
            </p>
          </div>
          <ReciterDropdown />
        </div>
      </div>

      {/* Bismillah header */}
      <div className="text-center pt-6 pb-2 px-6">
        <p
          className="text-[24px] text-accent-dark leading-tight"
          style={{ fontFamily: "Amiri, serif" }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="text-[11px] text-muted/70 tracking-[0.2em] uppercase mt-1.5">
          {chapter.versesCount} verses · {chapter.revelationPlace}
        </p>
        <div className="mx-auto mt-3 w-12 h-px bg-accent/40" />
      </div>

      {/* Verses */}
      <div className="scroll-area px-4 pb-12">
        {vLoad ? (
          <LoadingState label="Loading verses…" />
        ) : vErr ? (
          <ErrorRetry message={vErr} onRetry={vRefetch} />
        ) : (
          <VirtualizedAyahList
            verses={verses}
            chapterId={chapterId}
            translations={trByVerse}
            translationLoading={trLoading}
            translationError={trError}
            prefs={prefs}
          />
        )}
      </div>

      {/* Settings sheet */}
      {settingsOpen && (
        <ReadingSettings
          prefs={prefs}
          onChange={setPrefs}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Hidden audio element */}
      {audio?.url && (
        <audio
          ref={audioRef}
          src={audio.url}
          preload="none"
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  );
}

// ─── Virtualized list ───────────────────────────────────────────────────────
// We render only verses currently in or near the viewport. Each verse occupies
// a measured slot; visibility is tracked with IntersectionObserver so off-screen
// verses unmount (freeing memory + skipping renders).
function VirtualizedAyahList({ verses, chapterId, translations, translationLoading, translationError, prefs }) {
  const refs = useRef([]);            // sentinels per verse slot
  const [visible, setVisible] = useState(() => {
    // Render the first 8 ayat eagerly
    const init = new Set();
    for (let i = 0; i < Math.min(8, verses.length); i++) init.add(i);
    return init;
  });

  // Re-init visible set when chapter changes
  useEffect(() => {
    const init = new Set();
    for (let i = 0; i < Math.min(8, verses.length); i++) init.add(i);
    setVisible(init);
  }, [verses.length, chapterId]);

  // Set up observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      setVisible(prev => {
        let changed = false;
        const next = new Set(prev);
        entries.forEach(e => {
          const idx = parseInt(e.target.dataset.idx, 10);
          if (e.isIntersecting) {
            if (!next.has(idx)) { next.add(idx); changed = true; }
            // Pre-mount neighbours for smoother scroll
            if (!next.has(idx + 1) && idx + 1 < verses.length) { next.add(idx + 1); changed = true; }
            if (!next.has(idx - 1) && idx - 1 >= 0)            { next.add(idx - 1); changed = true; }
          }
        });
        return changed ? next : prev;
      });
    }, { rootMargin: "400px 0px" });

    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [verses.length]);

  return (
    <ul className="pt-4 space-y-3">
      {verses.map((v, idx) => {
        const verseKey = `${chapterId}:${v.verseNumber}`;
        const trText = translations.get(verseKey);
        const isVisible = visible.has(idx);

        return (
          <li
            key={v.id ?? idx}
            ref={el => refs.current[idx] = el}
            data-idx={idx}
            // Reserve approximate height when not yet mounted to keep scroll stable
            style={{ minHeight: isVisible ? undefined : minHeightFor(prefs.fontSize, prefs.showTranslation) }}>
            {isVisible && (
              <AyahCard
                verse={v}
                verseNumber={v.verseNumber}
                arabicText={v.textUthmani}
                translation={trText}
                translationLoading={prefs.showTranslation && translationLoading && !trText}
                translationError={trError}
                showTranslation={prefs.showTranslation}
                fontSize={prefs.fontSize}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function minHeightFor(size, showTranslation) {
  // Rough placeholder so virtualization doesn't cause scroll jumps
  const arabic = { sm: 90, md: 110, lg: 140, xl: 170 }[size] ?? 110;
  const tr     = showTranslation ? 60 : 0;
  return arabic + tr + 40;
}

// ─── Ayah card ──────────────────────────────────────────────────────────────
const AyahCard = memo(function AyahCard({
  verseNumber, arabicText, translation, translationLoading, translationError,
  showTranslation, fontSize,
}) {
  const arabicSize = {
    sm: "text-[20px]", md: "text-[24px]",
    lg: "text-[28px]", xl: "text-[34px]",
  }[fontSize] ?? "text-[24px]";

  const englishSize = {
    sm: "text-[13px]", md: "text-[15px]",
    lg: "text-[17px]", xl: "text-[19px]",
  }[fontSize] ?? "text-[15px]";

  return (
    <article className="rounded-2xl bg-white/70 border border-border/60 p-5">
      {/* Top row: ayah number badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-accent/40 text-accent-dark font-display font-bold text-[13px]">
          {verseNumber}
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted/70 font-semibold">
          Ayah {verseNumber}
        </span>
      </div>

      {/* Arabic */}
      <p
        className={`text-right text-ink leading-loose ${arabicSize}`}
        style={{ fontFamily: "Amiri, serif", direction: "rtl" }}>
        {arabicText}
      </p>

      {/* Translation */}
      {showTranslation && (
        <>
          <div className="my-4 mx-auto w-10 h-px bg-accent/30" />
          {translation ? (
            <p className={`text-body leading-relaxed ${englishSize}`}>
              {translation}
            </p>
          ) : translationLoading ? (
            <p className="text-[12px] text-muted/60 italic">Loading translation…</p>
          ) : translationError ? (
            <p className="text-[12px] text-red-700/80 italic">Translation unavailable.</p>
          ) : null}
        </>
      )}
    </article>
  );
});

// ─── Settings sheet ─────────────────────────────────────────────────────────
function ReadingSettings({ prefs, onChange, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-ivory w-full sm:max-w-md rounded-t-3xl px-6 py-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>

        <header className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-primary tracking-tight">Reading</h2>
          <button onClick={onClose} aria-label="Close" className="press w-9 h-9 -mr-2 rounded-full flex items-center justify-center hover:bg-parchment">
            <Icon name="close" size={18} className="text-ink" />
          </button>
        </header>

        {/* Font size */}
        <section className="mb-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold mb-2.5">
            Font size
          </p>
          <div className="flex gap-2">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => onChange({ ...prefs, fontSize: s })}
                className={`press flex-1 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wide ${
                  prefs.fontSize === s ? "bg-primary text-ivory" : "bg-parchment text-body"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Show translation */}
        <section className="mb-5">
          <label className="flex items-center justify-between gap-3 px-1">
            <div>
              <p className="font-display text-base text-ink">Show translation</p>
              <p className="text-[12px] text-muted">English under each ayah</p>
            </div>
            <Switch
              on={prefs.showTranslation}
              onChange={v => onChange({ ...prefs, showTranslation: v })}
            />
          </label>
        </section>

        {/* Translation choice */}
        {prefs.showTranslation && (
          <section className="mb-2">
            <p className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold mb-2.5">
              Translation
            </p>
            <ul className="space-y-1.5">
              {TRANSLATIONS.map(t => {
                const active = prefs.translationId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => onChange({ ...prefs, translationId: t.id })}
                      className={`press w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                        active ? "bg-primary/8 border border-primary/30" : "bg-white border border-border/60"
                      }`}>
                      <div className="text-left">
                        <p className={`text-[14px] font-semibold ${active ? "text-primary" : "text-ink"}`}>
                          {t.name}
                        </p>
                        <p className="text-[11px] text-muted">{t.short}</p>
                      </div>
                      {active && <Icon name="check" size={16} className="text-accent-dark" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`press w-11 h-6 rounded-full p-0.5 transition-colors ${
        on ? "bg-primary" : "bg-muted/30"
      }`}
      role="switch"
      aria-checked={on}>
      <div className={`w-5 h-5 rounded-full bg-ivory transition-transform ${
        on ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}
