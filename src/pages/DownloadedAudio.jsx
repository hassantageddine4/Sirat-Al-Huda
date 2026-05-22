// src/pages/DownloadedAudio.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Manage offline Qur'an recitation downloads.
//
//   • Per-reciter sections with chapter list
//   • Per-surah delete buttons
//   • Per-reciter bulk download (entire 114-surah Qur'an, ~1 GB) + delete
//   • Global delete-all
//   • Live progress for the active bulk download
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useApp } from "../context/AppContext";
import { useReciter } from "../hooks/useReciter";
import { useBulkAudioDownload, useDownloadIndex } from "../hooks/useAudioDownload";
import { useChapters } from "../hooks/useQuran";
import {
  getReciterTotals,
  getTotalBytes,
  deleteAllForReciter,
  deleteAll,
  deleteChapter,
} from "../services/audioDownloadService";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  accent: "#C8A951", accentDark: "#A88730",
  ivory: "#FAF7F2", offwhite: "#F4F0E8",
  ink: "#1A1614", body: "#3A342C", muted: "#7A7268",
  border: "#E8E2D8",
  danger: "#dc2626",
};

function formatBytes(n) {
  if (!n) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function DownloadedAudio() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const { reciters } = useReciter();
  const { chapters } = useChapters();
  const index = useDownloadIndex();
  const bulk = useBulkAudioDownload();

  // Recompute totals whenever the index changes
  const reciterTotals = useMemo(() => getReciterTotals(), [index]);
  const totalBytes    = useMemo(() => getTotalBytes(), [index]);

  const reciterById   = useMemo(
    () => new Map(reciters.map(r => [r.id, r])),
    [reciters]
  );
  const chapterById   = useMemo(
    () => new Map(chapters.map(c => [c.id, c])),
    [chapters]
  );

  // Available reciters that don't yet have everything downloaded
  const availableForBulk = useMemo(() => {
    return reciters.map(r => {
      const t = reciterTotals.find(rt => rt.reciterId === r.id);
      return {
        ...r,
        downloadedCount: t?.count ?? 0,
        bytes:           t?.bytes ?? 0,
        complete:        (t?.count ?? 0) >= 114,
      };
    });
  }, [reciters, reciterTotals]);

  async function handleDeleteAll() {
    if (!confirm("Delete all downloaded audio? This cannot be undone.")) return;
    await deleteAll();
  }

  async function handleDeleteReciter(reciterId, name) {
    if (!confirm(`Delete all downloaded surahs for ${name}?`)) return;
    await deleteAllForReciter(reciterId);
  }

  async function handleDeleteChapter(reciterId, chapterId) {
    await deleteChapter(reciterId, chapterId);
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader title="Downloaded Audio" subtitle="إدارة التلاوات" onBack={() => navigate(-1)} />

      <div className="scroll-area px-4 py-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Total size + global delete */}
        <Card>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
                Total storage
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>
                {formatBytes(totalBytes)}
              </p>
              <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                Across {reciterTotals.length} reciter{reciterTotals.length === 1 ? "" : "s"}
              </p>
            </div>
            {reciterTotals.length > 0 && (
              <button onClick={handleDeleteAll} className="press" style={{
                fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 99,
                border: `1.5px solid ${C.danger}`, background: "transparent", color: C.danger,
              }}>
                Delete all
              </button>
            )}
          </div>
        </Card>

        {/* Active bulk download progress */}
        {bulk.active && (
          <BulkProgressCard
            bulk={bulk}
            reciterName={reciterById.get(bulk.reciterId)?.name ?? "Reciter"}
          />
        )}

        {/* Bulk-download options */}
        <div>
          <SectionLabel>Download an entire reciter</SectionLabel>
          {!isOnline && (
            <p style={{ fontSize: 12, color: C.muted, paddingLeft: 4, marginBottom: 8, lineHeight: 1.5 }}>
              You're offline. Reconnect to download new recitations.
            </p>
          )}
          <Card style={{ overflow: "hidden" }}>
            {availableForBulk.map((r, i) => (
              <BulkRow
                key={r.id}
                reciter={r}
                last={i === availableForBulk.length - 1}
                disabled={!isOnline || bulk.active}
                onStart={() => bulk.start(r.id)}
              />
            ))}
          </Card>
          <p style={{ fontSize: 11, color: C.muted, paddingLeft: 4, marginTop: 8, lineHeight: 1.5 }}>
            Full Qur'an downloads use ~700 MB-1 GB depending on the reciter and can take 20-40 minutes on Wi-Fi.
          </p>
        </div>

        {/* Downloaded content by reciter */}
        {reciterTotals.length > 0 && (
          <div>
            <SectionLabel>Downloaded</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reciterTotals.map(rt => {
                const reciter = reciterById.get(rt.reciterId);
                if (!reciter) return null;
                return (
                  <ReciterSection
                    key={rt.reciterId}
                    reciter={reciter}
                    chapters={rt.chapters}
                    bytes={rt.bytes}
                    chapterById={chapterById}
                    onDeleteReciter={() => handleDeleteReciter(reciter.id, reciter.name)}
                    onDeleteChapter={(chapterId) => handleDeleteChapter(reciter.id, chapterId)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {reciterTotals.length === 0 && !bulk.active && (
          <EmptyState />
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Reusable bits ──────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: C.muted,
                paddingLeft: 2, marginBottom: 8, marginTop: 4 }}>
      {children}
    </p>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`,
                  boxShadow: "0 4px 16px rgba(10,8,6,0.08)", ...style }}>
      {children}
    </div>
  );
}

function BulkProgressCard({ bulk, reciterName }) {
  const pct = bulk.total > 0 ? Math.round((bulk.completed / bulk.total) * 100) : 0;
  return (
    <Card>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                        textTransform: "uppercase", color: C.accentDark, marginBottom: 3 }}>
              Downloading
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{reciterName}</p>
          </div>
          <button onClick={bulk.cancel} className="press" style={{
            fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 99,
            border: `1px solid ${C.border}`, background: "transparent", color: C.muted,
          }}>
            Cancel
          </button>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "rgba(15,61,46,0.08)", overflow: "hidden", marginBottom: 6 }}>
          <div style={{
            height: "100%", borderRadius: 99,
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.primaryLight}, ${C.primary})`,
            transition: "width 0.4s",
          }} />
        </div>
        <p style={{ fontSize: 11, color: C.muted }}>
          Surah {bulk.completed} of {bulk.total} · {pct}%
        </p>
        {bulk.error && (
          <p style={{ fontSize: 11, color: C.danger, marginTop: 6 }}>{bulk.error}</p>
        )}
      </div>
    </Card>
  );
}

function BulkRow({ reciter, last, disabled, onStart }) {
  const isComplete = reciter.complete;
  const hasSome    = reciter.downloadedCount > 0;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
      borderBottom: last ? "none" : `1px solid ${C.border}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{reciter.name}</p>
        <p style={{ fontSize: 11, color: C.muted }}>
          {isComplete
            ? `All 114 surahs downloaded · ${formatBytes(reciter.bytes)}`
            : hasSome
              ? `${reciter.downloadedCount} of 114 surahs · ${formatBytes(reciter.bytes)}`
              : reciter.style ? reciter.style : "Tap to download all 114 surahs"}
        </p>
      </div>
      {isComplete ? (
        <div style={{
          fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
          background: "rgba(15,61,46,0.08)", color: C.primary, letterSpacing: "0.04em",
        }}>
          Complete
        </div>
      ) : (
        <button onClick={onStart} disabled={disabled} className="press" style={{
          fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 99,
          border: "none",
          background: disabled ? C.border : C.primary,
          color: disabled ? C.muted : "white",
          cursor: disabled ? "default" : "pointer",
        }}>
          {hasSome ? "Resume" : "Download all"}
        </button>
      )}
    </div>
  );
}

function ReciterSection({ reciter, chapters, bytes, chapterById, onDeleteReciter, onDeleteChapter }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={{ overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="press"
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "13px 16px", background: "transparent",
          border: "none", textAlign: "left", cursor: "pointer",
          borderBottom: expanded ? `1px solid ${C.border}` : "none",
        }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{reciter.name}</p>
          <p style={{ fontSize: 11, color: C.muted }}>
            {chapters.length} surah{chapters.length === 1 ? "" : "s"} · {formatBytes(bytes)}
          </p>
        </div>
        <span style={{ color: C.muted, fontSize: 14 }}>{expanded ? "▴" : "▾"}</span>
      </button>

      {expanded && (
        <>
          {chapters.map((ch, i) => {
            const chapter = chapterById.get(ch.chapterId);
            const last = i === chapters.length - 1;
            return (
              <div key={ch.chapterId} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px",
                borderBottom: last ? "none" : `1px solid ${C.border}`,
              }}>
                <div style={{ width: 28, textAlign: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{ch.chapterId}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 1 }}>
                    {chapter?.nameSimple ?? chapter?.name_simple ?? `Surah ${ch.chapterId}`}
                  </p>
                  <p style={{ fontSize: 10, color: C.muted }}>{formatBytes(ch.size)}</p>
                </div>
                <button
                  onClick={() => onDeleteChapter(ch.chapterId)}
                  aria-label="Delete"
                  className="press w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(220,38,38,0.08)", color: C.danger, border: "none" }}>
                  <TrashGlyph />
                </button>
              </div>
            );
          })}
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={onDeleteReciter}
              className="press"
              style={{
                width: "100%", fontSize: 12, fontWeight: 700, padding: "8px 14px",
                borderRadius: 99, border: `1.5px solid ${C.danger}`,
                background: "transparent", color: C.danger,
              }}>
              Delete all from {reciter.name}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

function EmptyState() {
  return (
    <div style={{
      padding: "32px 20px", textAlign: "center",
      background: "white", borderRadius: 16,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 999, margin: "0 auto 14px",
        background: `${C.accent}18`, color: C.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
        No downloads yet
      </p>
      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, maxWidth: 280, margin: "0 auto" }}>
        Download individual surahs from the Qur'an reader, or download an entire reciter above for full offline access.
      </p>
    </div>
  );
}

function TrashGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
