// src/pages/Journal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Personal spiritual journal. Entries support an optional mood marker.
//
// Moods used to be set with emojis (🤲 ✨ 📿 💭 🌿). They are now icon
// chips drawn from the Icon library so the screen reads as professional,
// not playful.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { LoadingState, EmptyState, ErrorRetry } from "../components/common/DataStates";
import { useJournal } from "../hooks/useJournal";

// ─── Mood vocabulary — icon-based, no emoji ────────────────────────────────
const MOODS = [
  { id: "grateful",  label: "Grateful",  icon: "heart"   },
  { id: "reflecting",label: "Reflective",icon: "moon"    },
  { id: "seeking",   label: "Seeking",   icon: "compass" },
  { id: "calm",      label: "Calm",      icon: "star"    },
  { id: "praying",   label: "In du'a",   icon: "prayer"  },
];

const MAX_LEN = 1200;

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Journal() {
  const { entries, loading, error, addEntry, deleteEntry, refetch } = useJournal();

  return (
    <div className="screen bg-ivory">
      <ScreenHeader title="Journal" subtitle="مذكرات روحية" />

      <div className="scroll-area pb-12">
        {/* New entry composer */}
        <Composer onSave={addEntry} />

        {/* Entries */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorRetry message={error} onRetry={refetch} />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<Icon name="bookOpen" size={22} />}
            title="No entries yet"
            description="Your reflections, du'as, and notes appear here. Write your first entry above."
          />
        ) : (
          <ul className="px-4 pt-2 space-y-3">
            {entries.map((entry, idx) => (
              <EntryCard
                key={entry.id ?? idx}
                entry={entry}
                onDelete={() => deleteEntry(entry.id)}
                index={idx}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Composer ───────────────────────────────────────────────────────────────
function Composer({ onSave }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [saving, setSaving] = useState(false);
  const taRef = useRef(null);

  const remaining = MAX_LEN - text.length;
  const canSave = text.trim().length > 0 && !saving;

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ text: text.trim(), mood });
      setText("");
      setMood(null);
      if (taRef.current) taRef.current.style.height = "auto";
    } finally {
      setSaving(false);
    }
  }, [canSave, text, mood, onSave]);

  // Auto-grow textarea
  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 240) + "px";
  }, [text]);

  return (
    <section className="mx-4 mt-4 rounded-3xl bg-white/70 border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon name="edit" size={14} className="text-accent-dark" />
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">
          New entry
        </p>
      </div>

      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
        placeholder="What's on your heart today?"
        rows={3}
        className="w-full resize-none bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none leading-relaxed"
      />

      {/* Mood chips */}
      <div className="mt-3 flex gap-1.5 flex-wrap">
        {MOODS.map(m => {
          const active = mood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMood(active ? null : m.id)}
              className={`press flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-primary text-ivory"
                  : "bg-parchment text-body hover:bg-parchment/70"
              }`}>
              <Icon name={m.icon} size={12} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-[11px] text-muted">
          {remaining < 200 ? `${remaining} characters left` : ""}
        </span>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`press flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold ${
            canSave
              ? "bg-primary text-ivory"
              : "bg-muted/20 text-muted cursor-not-allowed"
          }`}>
          {saving ? "Saving…" : "Save entry"}
          {!saving && canSave && <Icon name="check" size={12} />}
        </button>
      </div>
    </section>
  );
}

// ─── Entry card ─────────────────────────────────────────────────────────────
function EntryCard({ entry, onDelete, index }) {
  const [confirming, setConfirming] = useState(false);
  const mood = MOODS.find(m => m.id === entry.mood);
  const dateStr = useMemo(() => {
    if (!entry.createdAt) return "";
    const d = new Date(entry.createdAt);
    const sameYear = d.getFullYear() === new Date().getFullYear();
    return d.toLocaleDateString(undefined, sameYear
      ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", year: "numeric" });
  }, [entry.createdAt]);

  return (
    <li
      style={{ animation: `fadeIn 320ms ease-out ${Math.min(index, 12) * 18}ms both` }}>
      <article className="rounded-2xl bg-white/70 border border-border/60 p-4">
        <header className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {mood && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-parchment text-primary/90">
                <Icon name={mood.icon} size={11} />
                {mood.label}
              </span>
            )}
            <span className="text-[11px] text-muted truncate">{dateStr}</span>
          </div>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              aria-label="Delete entry"
              className="press w-7 h-7 rounded-full flex items-center justify-center hover:bg-parchment text-muted">
              <Icon name="trash" size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setConfirming(false)}
                className="press text-[11px] font-semibold text-muted px-2 py-1">
                Cancel
              </button>
              <button
                onClick={() => { onDelete(); setConfirming(false); }}
                className="press text-[11px] font-semibold text-red-700 px-2 py-1">
                Delete
              </button>
            </div>
          )}
        </header>

        <p className="text-[14px] text-body leading-relaxed whitespace-pre-wrap">
          {entry.text}
        </p>
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
