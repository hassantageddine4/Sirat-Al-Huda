// src/pages/SurahReader.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { LoadingState, ErrorRetry } from "../components/common/DataStates";

import { useChapters, useVerses, useChapterAudio } from "../hooks/useQuran";
import { useReciter } from "../hooks/useReciter";
import { useAudioDownload } from "../hooks/useAudioDownload";
import { useApp } from "../context/AppContext";
import { ReciterDropdown } from "../components/quran/ReciterPicker";

const PREF_KEY = "sirat_quran_reader_v1";
const SIZES = ["sm", "md", "lg", "xl"];
const TRANSLATIONS = [
  { id: "en.sahih",     name: "Saheeh International", short: "Saheeh"    },
  { id: "en.pickthall", name: "Pickthall",            short: "Pickthall" },
  { id: "en.yusufali",  name: "Yusuf Ali",            short: "Yusuf Ali" },
  { id: "en.asad",      name: "Muhammad Asad",        short: "Asad"      },
  { id: "en.hilali",    name: "Hilali & Khan",        short: "Hilali"    },
];
const DEFAULT_PREFS = { fontSize: "md", showTranslation: true, translationId: "en.sahih" };

const TRANSLATION_MIGRATION_KEY = "sirat_quran_translation_migrated_v1";

function loadPrefs() {
  try {
    const saved = { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}") };
    if (!localStorage.getItem(TRANSLATION_MIGRATION_KEY)) {
      saved.showTranslation = true;
      localStorage.setItem(TRANSLATION_MIGRATION_KEY, "1");
    }
    return saved;
  } catch { return DEFAULT_PREFS; }
}
function savePrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
}

export default function SurahReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chapterId = parseInt(id, 10);

  const { chapters } = useChapters();
  const chapter = useMemo(() => chapters.find(c => c.id === chapterId), [chapters, chapterId]);

  const [prefs, setPrefs] = useState(loadPrefs);
  useEffect(() => { savePrefs(prefs); }, [prefs]);

  const { verses, loading: vLoad, error: vErr } = useVerses(chapterId, { translationId: prefs.translationId });

  const { reciter } = useReciter();
  const reciterId = reciter?.id ?? null;
  const { url: audioUrl, loading: aLoad, fromLocal } = useChapterAudio(reciterId, chapterId);
  const { status: dlStatus, download, remove } = useAudioDownload(reciterId, chapterId);
  const { isOnline } = useApp();

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [audioUrl]);

  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!chapter) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Loading…" onBack={() => navigate(-1)} />
        <LoadingState />
      </div>
    );
  }

  // Status text — context-aware
  const playable = !!audioUrl && !aLoad;
  let statusText;
  if (aLoad) {
    statusText = "Loading recitation…";
  } else if (audioUrl) {
    statusText = fromLocal ? "Downloaded · tap to play" : "Tap to play full surah";
  } else if (!isOnline) {
    statusText = "Recitation requires internet";
  } else {
    statusText = "Recitation unavailable";
  }

  // Download button rendering
  const canDownload = isOnline && audioUrl && !fromLocal && dlStatus !== "downloaded";
  const showDeleteButton = fromLocal || dlStatus === "downloaded";

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={chapter.nameSimple ?? chapter.name_simple}
        subtitle={chapter.nameArabic ?? chapter.name_arabic}
        rightAction={{
          label: "Reading settings",
          icon: <Icon name="text" size={20} className="text-primary" />,
          onClick: () => setSettingsOpen(true),
        }}
      />

      <div className="px-4 pt-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-parchment/60">
          <button
            onClick={togglePlay}
            disabled={!playable}
            aria-label={playing ? "Pause" : "Play"}
            className={`press w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              playable ? "bg-primary text-ivory" : "bg-muted/20 text-muted"
            }`}>
            <Icon name={playing ? "pause" : "play"} size={14} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-muted leading-tight truncate">{statusText}</p>
          </div>

          {/* Download / delete control */}
          {dlStatus === "downloading" ? (
            <div aria-label="Downloading" title="Downloading"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,61,46,0.08)" }}>
              <Spinner />
            </div>
          ) : showDeleteButton ? (
            <button
              onClick={remove}
              aria-label="Remove downloaded audio"
              title="Remove downloaded audio"
              className="press w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,61,46,0.10)", color: "#0F3D2E" }}>
              <CheckGlyph />
            </button>
          ) : canDownload ? (
            <button
              onClick={download}
              aria-label="Download for offline"
              title="Download for offline"
              className="press w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(200,169,81,0.16)", color: "#A88730" }}>
              <DownloadGlyph />
            </button>
          ) : null}

          <ReciterDropdown />
        </div>
      </div>

      <div className="text-center pt-6 pb-2 px-6">
        <p className="text-[24px] text-accent-dark leading-tight" style={{ fontFamily: "Amiri, serif" }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="text-[11px] text-muted/70 tracking-[0.2em] uppercase mt-1.5">
          {chapter.versesCount ?? chapter.verses_count} verses
          {chapter.revelationPlace ? ` · ${chapter.revelationPlace}` : ""}
        </p>
        <div className="mx-auto mt-3 w-12 h-px bg-accent/40" />
      </div>

      <div className="scroll-area px-4 pb-nav">
        {vLoad ? (
          <LoadingState label="Loading verses…" />
        ) : vErr ? (
          <ErrorRetry message={vErr} />
        ) : (
          <VirtualizedAyahList verses={verses} chapterId={chapterId} prefs={prefs} />
        )}
      </div>

      {settingsOpen && (
        <ReadingSettings prefs={prefs} onChange={setPrefs} onClose={() => setSettingsOpen(false)} />
      )}

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="none" onEnded={() => setPlaying(false)} />
      )}
    </div>
  );
}

// ─── Small inline glyphs (no extra Icon names needed) ───────────────────────
function DownloadGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 12, height: 12, borderRadius: "50%",
      border: "2px solid rgba(15,61,46,0.25)",
      borderTopColor: "#0F3D2E",
      animation: "spin 0.9s linear infinite",
    }} />
  );
}

function VirtualizedAyahList({ verses, chapterId, prefs }) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(() => {
    const init = new Set();
    for (let i = 0; i < Math.min(8, verses.length); i++) init.add(i);
    return init;
  });

  useEffect(() => {
    const init = new Set();
    for (let i = 0; i < Math.min(8, verses.length); i++) init.add(i);
    setVisible(init);
  }, [verses.length, chapterId]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      setVisible(prev => {
        let changed = false;
        const next = new Set(prev);
        entries.forEach(e => {
          const idx = parseInt(e.target.dataset.idx, 10);
          if (e.isIntersecting) {
            if (!next.has(idx)) { next.add(idx); changed = true; }
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
        const isVisible = visible.has(idx);
        return (
          <li
            key={v.id ?? idx}
            ref={el => refs.current[idx] = el}
            data-idx={idx}
            style={{ minHeight: isVisible ? undefined : minHeightFor(prefs.fontSize, prefs.showTranslation) }}>
            {isVisible && (
              <AyahCard
                verseNumber={v.verseNumber}
                arabicText={v.arabic}
                translation={v.translation}
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
  const arabic = { sm: 90, md: 110, lg: 140, xl: 170 }[size] ?? 110;
  const tr = showTranslation ? 60 : 0;
  return arabic + tr + 40;
}

const AyahCard = memo(function AyahCard({ verseNumber, arabicText, translation, showTranslation, fontSize }) {
  const arabicSize = { sm: "text-[20px]", md: "text-[24px]", lg: "text-[28px]", xl: "text-[34px]" }[fontSize] ?? "text-[24px]";
  const englishSize = { sm: "text-[13px]", md: "text-[15px]", lg: "text-[17px]", xl: "text-[19px]" }[fontSize] ?? "text-[15px]";

  return (
    <article className="rounded-2xl bg-white/70 border border-border/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-accent/40 text-accent-dark font-display font-bold text-[13px]">
          {verseNumber}
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted/70 font-semibold">
          Ayah {verseNumber}
        </span>
      </div>
      <p className={`text-right text-ink leading-loose ${arabicSize}`}
        style={{ fontFamily: "Amiri, serif", direction: "rtl" }}>
        {arabicText}
      </p>
      {showTranslation && translation && (
        <>
          <div className="my-4 mx-auto w-10 h-px bg-accent/30" />
          <p className={`text-body leading-relaxed ${englishSize}`}>{translation}</p>
        </>
      )}
    </article>
  );
});

function ReadingSettings({ prefs, onChange, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="bg-ivory w-full sm:max-w-md rounded-t-3xl px-6 py-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>
        <header className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-primary tracking-tight">Reading</h2>
          <button onClick={onClose} aria-label="Close" className="press w-9 h-9 -mr-2 rounded-full flex items-center justify-center hover:bg-parchment">
            <Icon name="close" size={18} className="text-ink" />
          </button>
        </header>

        <section className="mb-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold mb-2.5">Font size</p>
          <div className="flex gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => onChange({ ...prefs, fontSize: s })}
                className={`press flex-1 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wide ${
                  prefs.fontSize === s ? "bg-primary text-ivory" : "bg-parchment text-body"
                }`}>{s}</button>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <label className="flex items-center justify-between gap-3 px-1">
            <div>
              <p className="font-display text-base text-ink">Show translation</p>
              <p className="text-[12px] text-muted">English under each ayah</p>
            </div>
            <Switch on={prefs.showTranslation} onChange={v => onChange({ ...prefs, showTranslation: v })} />
          </label>
        </section>

        {prefs.showTranslation && (
          <section className="mb-2">
            <p className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold mb-2.5">Translation</p>
            <ul className="space-y-1.5">
              {TRANSLATIONS.map(t => {
                const active = prefs.translationId === t.id;
                return (
                  <li key={t.id}>
                    <button onClick={() => onChange({ ...prefs, translationId: t.id })}
                      className={`press w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                        active ? "bg-primary/8 border border-primary/30" : "bg-white border border-border/60"
                      }`}>
                      <div className="text-left">
                        <p className={`text-[14px] font-semibold ${active ? "text-primary" : "text-ink"}`}>{t.name}</p>
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
    <button onClick={() => onChange(!on)}
      className={`press w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-muted/30"}`}
      role="switch" aria-checked={on}>
      <div className={`w-5 h-5 rounded-full bg-ivory transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
