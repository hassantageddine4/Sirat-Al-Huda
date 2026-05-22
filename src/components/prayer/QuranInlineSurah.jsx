// src/components/prayer/QuranInlineSurah.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders a Qur'an sūrah inline within a prayer walkthrough step.
// Uses the in-app Qur'an as the single source of truth — no duplicated text.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useVerses } from "../../hooks/useQuran";

const GOLD       = "rgba(242, 204, 115, 1)";
const GOLD_SOFT  = "rgba(242, 204, 115, 0.9)";
const GOLD_FAINT = "rgba(242, 204, 115, 0.25)";

export default function QuranInlineSurah({ chapterId, surahName }) {
  const { verses, loading, error } = useVerses(chapterId, { translationId: "en.sahih" });

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `0.7px solid ${GOLD_FAINT}`,
      }}>
      <div
        style={{
          fontSize: 10, letterSpacing: "0.25em",
          color: GOLD_SOFT, fontWeight: 700,
          marginBottom: 12, textTransform: "uppercase",
        }}>
        {surahName ? `SŪRAH ${surahName}` : `QUR'ĀN ${chapterId}`}
      </div>

      {loading && verses.length === 0 && (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", padding: "16px 0", textAlign: "center" }}>
          Loading sūrah…
        </div>
      )}

      {!loading && error && verses.length === 0 && (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", padding: "16px 0", textAlign: "center" }}>
          Sūrah could not be loaded. Follow the imām.
        </div>
      )}

      {verses.map((v, i) => {
        const arabic =
          v.arabic ||
          v.text_uthmani ||
          v.text_imlaei ||
          v.text ||
          "";
        const translation =
          v.translation ||
          (Array.isArray(v.translations) && v.translations[0] && v.translations[0].text) ||
          "";
        const verseNum =
          v.verse_number ||
          (typeof v.verse_key === "string" && v.verse_key.split(":")[1]) ||
          (i + 1);

        return (
          <div
            key={v.id || verseNum || i}
            style={{
              marginBottom: i === verses.length - 1 ? 0 : 14,
              paddingBottom: i === verses.length - 1 ? 0 : 14,
              borderBottom: i === verses.length - 1 ? "none" : `0.5px solid ${GOLD_FAINT}`,
            }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: GOLD_SOFT, fontWeight: 600, marginBottom: 6 }}>
              VERSE {verseNum}
            </div>
            <div
              style={{
                fontFamily: "'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif",
                fontSize: 22, lineHeight: 1.9, color: "white",
                direction: "rtl", textAlign: "right",
                marginBottom: translation ? 10 : 0,
              }}>
              {arabic}
            </div>
            {translation && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.55, fontStyle: "italic" }}>
                {translation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
