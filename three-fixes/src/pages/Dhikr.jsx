// src/pages/Dhikr.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Dhikr counter — picker → counter flow.
//
//   /dhikr          → picker screen (list of 6 dhikr types, each with count)
//   /dhikr/:id      → counter screen (big tap target, count, reset)
//
// Counts are stored separately per dhikr in localStorage and persist forever
// (until the user taps Reset). A daily total is also tracked.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";

// ─── Tokens ────────────────────────────────────────────────────────────────
const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", primaryDark: "#082819",
  accent: "#C8A951", accentLight: "#D9BF7A", accentDark: "#A88730",
  ivory: "#FAF7F2", parchment: "#EDE7D9",
  ink: "#1C1814", body: "#3A3530", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

// ─── Dhikr catalog ─────────────────────────────────────────────────────────
// Six standard + post-prayer dhikr that a Muslim would actually use during tasbih.
// `recommended` is the traditional count after each obligatory prayer.

export const DHIKR_LIST = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّه",
    translit: "Subḥān Allāh",
    english: "Glory be to Allah",
    meaning: "Acknowledging Allah's perfection and freedom from any flaw.",
    recommended: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "ٱلْحَمْدُ لِلَّٰه",
    translit: "Al-ḥamdu lillāh",
    english: "All praise is for Allah",
    meaning: "Thanking and praising Allah for every blessing.",
    recommended: 33,
  },
  {
    id: "allahuakbar",
    arabic: "ٱللَّٰهُ أَكْبَر",
    translit: "Allāhu akbar",
    english: "Allah is the greatest",
    meaning: "Affirming Allah's greatness above all things.",
    recommended: 34,
  },
  {
    id: "lailahaillaallah",
    arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰه",
    translit: "Lā ilāha illā Allāh",
    english: "There is no god but Allah",
    meaning: "The foundational statement of tawhid.",
    recommended: 100,
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ ٱللَّٰه",
    translit: "Astaghfir Allāh",
    english: "I seek Allah's forgiveness",
    meaning: "Seeking forgiveness for known and unknown sins.",
    recommended: 100,
  },
  {
    id: "salawat",
    arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّد",
    translit: "Allāhumma ṣalli ʿalā Muḥammad",
    english: "O Allah, send blessings upon Muhammad ﷺ",
    meaning: "Asking Allah to honor and bless the Prophet ﷺ.",
    recommended: 100,
  },
];

export function dhikrById(id) {
  return DHIKR_LIST.find(d => d.id === id) ?? null;
}

// ─── Storage ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "sirat_dhikr_counts_v1";

function loadCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveCounts(counts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {}
}

// ─── Page entry ────────────────────────────────────────────────────────────
// Single Dhikr.jsx file handles both picker and counter via params.

export default function Dhikr() {
  const { id } = useParams();
  if (id) {
    return <DhikrCounter dhikrId={id} />;
  }
  return <DhikrPicker />;
}

// ─── Picker screen ─────────────────────────────────────────────────────────

function DhikrPicker() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(loadCounts);

  // Refresh counts when the user navigates back here from a counter screen
  useEffect(() => {
    const onFocus = () => setCounts(loadCounts());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const totalCount = useMemo(
    () => Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0),
    [counts]
  );

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Dhikr"
        subtitle="ٱلذِّكْر"
      />

      {/* Total counter banner */}
      <div className="px-4 pt-4">
        <div
          style={{
            background: "linear-gradient(135deg," + C.primary + "," + C.primaryLight + ")",
            borderRadius: 18,
            padding: "16px 18px",
            color: "white",
            boxShadow: "0 6px 18px rgba(15,61,46,0.18)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(200,169,81,0.22)",
              border: "1px solid rgba(200,169,81,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.accentLight, flexShrink: 0,
            }}>
            <Icon name="beads" size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(217,191,122,0.85)",
              marginBottom: 2,
            }}>
              All-time total
            </p>
            <p style={{ fontSize: 24, fontWeight: 900 }}>
              {totalCount.toLocaleString()}
            </p>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
            across all dhikr
          </p>
        </div>
      </div>

      {/* Picker list */}
      <div className="scroll-area px-4 pt-4 pb-8">
        <p style={{
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: C.muted, paddingLeft: 4, marginBottom: 10,
        }}>
          Choose a Dhikr
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DHIKR_LIST.map(dhikr => (
            <DhikrCard
              key={dhikr.id}
              dhikr={dhikr}
              count={counts[dhikr.id] ?? 0}
              onClick={() => navigate(`/dhikr/${dhikr.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DhikrCard({ dhikr, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="press text-left"
      style={{
        background: "white",
        borderRadius: 16,
        border: `0.5px solid ${C.border}`,
        boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
        padding: 14,
        display: "flex", flexDirection: "column", gap: 8,
        width: "100%",
      }}>
      <div className="flex items-start justify-between gap-3">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            dir="rtl"
            style={{
              fontFamily: "Amiri, serif",
              fontSize: 22, fontWeight: 600,
              color: C.primary,
              lineHeight: 1.4,
              marginBottom: 4,
            }}>
            {dhikr.arabic}
          </p>
          <p style={{
            fontSize: 13, fontWeight: 700,
            color: C.ink, marginBottom: 1,
            fontStyle: "italic",
          }}>
            {dhikr.translit}
          </p>
          <p style={{ fontSize: 11, color: C.muted }}>
            {dhikr.english}
          </p>
        </div>

        {/* Count pill */}
        <div
          style={{
            flexShrink: 0,
            background: count > 0 ? "rgba(200,169,81,0.18)" : "rgba(15,61,46,0.06)",
            color: count > 0 ? C.accentDark : C.muted,
            padding: "5px 11px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            border: count > 0 ? "0.5px solid rgba(200,169,81,0.3)" : "0.5px solid " + C.border,
          }}>
          {count.toLocaleString()}
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 2 }}>
        <p style={{ fontSize: 11, color: C.subtle }}>
          Recommended: {dhikr.recommended}×
        </p>
        <Icon name="chevronRight" size={14} style={{ color: C.subtle }} />
      </div>
    </button>
  );
}

// ─── Counter screen ────────────────────────────────────────────────────────

function DhikrCounter({ dhikrId }) {
  const navigate = useNavigate();
  const dhikr = dhikrById(dhikrId);

  // Hooks must be called before any early returns.
  // If dhikr is invalid we'll redirect after the hooks.
  const [count, setCount] = useState(() => loadCounts()[dhikrId] ?? 0);
  const [pulse, setPulse] = useState(false);

  // Persist on every change
  useEffect(() => {
    if (!dhikr) return;
    const all = loadCounts();
    all[dhikrId] = count;
    saveCounts(all);
  }, [count, dhikrId, dhikr]);

  const increment = useCallback(() => {
    setCount(c => c + 1);
    setPulse(true);
    // Haptic feedback on iOS, silent fallback elsewhere
    try {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(8);
      }
    } catch {}
    // Reset pulse after animation
    setTimeout(() => setPulse(false), 180);
  }, []);

  const reset = useCallback(() => {
    if (!window.confirm(`Reset count for ${dhikr?.translit ?? "this dhikr"}?`)) return;
    setCount(0);
  }, [dhikr]);

  if (!dhikr) {
    return (
      <div className="screen bg-ivory items-center justify-center text-center px-6">
        <p style={{ fontSize: 14, color: C.muted }}>Dhikr not found.</p>
        <button
          onClick={() => navigate("/dhikr")}
          className="press mt-4 px-5 py-2.5 rounded-full font-semibold"
          style={{
            background: C.primary, color: "white", fontSize: 13,
          }}>
          Back to Dhikr list
        </button>
      </div>
    );
  }

  // Progress to recommended count (e.g. 33, 100)
  const progress = Math.min(1, count / dhikr.recommended);
  const completedRecommended = Math.floor(count / dhikr.recommended);

  return (
    <div className="screen" style={{
      background: "linear-gradient(160deg," + C.primaryDark + " 0%," + C.primary + " 60%," + C.primaryLight + " 100%)",
    }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-safe relative">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button
            onClick={() => navigate("/dhikr")}
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
            <Icon name="chevronLeft" size={17} />
          </button>
          <p style={{
            fontSize: 11, color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.18em", textTransform: "uppercase",
            fontWeight: 700,
          }}>
            Dhikr
          </p>
          <button
            onClick={reset}
            className="press"
            style={{
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)",
              padding: "6px 12px", borderRadius: 99,
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.15)",
            }}>
            Reset
          </button>
        </div>
      </div>

      {/* Dhikr text block */}
      <div className="px-6 pt-4 text-center">
        <p
          dir="rtl"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: 36, fontWeight: 600,
            color: "white",
            lineHeight: 1.5,
            marginBottom: 10,
          }}>
          {dhikr.arabic}
        </p>
        <p style={{
          fontSize: 15, fontWeight: 700, fontStyle: "italic",
          color: C.accentLight, marginBottom: 4,
        }}>
          {dhikr.translit}
        </p>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.7)",
        }}>
          {dhikr.english}
        </p>
      </div>

      {/* Progress to recommended */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between mb-2">
          <p style={{
            fontSize: 9, color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.18em", textTransform: "uppercase",
            fontWeight: 700,
          }}>
            This round
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            {count % dhikr.recommended} / {dhikr.recommended}
            {completedRecommended > 0 && ` · ${completedRecommended}× complete`}
          </p>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.12)",
            overflow: "hidden",
          }}>
          <div
            style={{
              height: "100%",
              width: `${(count % dhikr.recommended) / dhikr.recommended * 100}%`,
              background: "linear-gradient(90deg," + C.accentLight + "," + C.accent + ")",
              borderRadius: 99,
              transition: "width 0.25s",
            }}
          />
        </div>
      </div>

      {/* Big tap target */}
      <button
        onClick={increment}
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          width: "100%",
          minHeight: 0,
          color: "white",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}>
        <div
          style={{
            width: 220, height: 220,
            borderRadius: "50%",
            background: pulse
              ? "linear-gradient(135deg, rgba(200,169,81,0.35), rgba(200,169,81,0.18))"
              : "linear-gradient(135deg, rgba(200,169,81,0.22), rgba(200,169,81,0.10))",
            border: "2px solid " + (pulse ? C.accent : "rgba(200,169,81,0.45)"),
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: pulse
              ? "0 0 50px rgba(200,169,81,0.45), inset 0 0 30px rgba(200,169,81,0.15)"
              : "0 0 30px rgba(200,169,81,0.18)",
            transform: pulse ? "scale(0.96)" : "scale(1)",
            transition: "transform 0.18s, box-shadow 0.18s, background 0.18s, border-color 0.18s",
          }}>
          <span style={{
            fontSize: 64, fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            fontVariantNumeric: "tabular-nums",
          }}>
            {count}
          </span>
        </div>
        <p style={{
          marginTop: 22,
          fontSize: 11, color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.12em", textTransform: "uppercase",
          fontWeight: 600,
        }}>
          Tap anywhere to count
        </p>
      </button>

      <div style={{ height: 36 }} />
    </div>
  );
}
