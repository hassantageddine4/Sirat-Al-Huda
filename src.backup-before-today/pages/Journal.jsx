// src/pages/Journal.jsx
import React, { useState, useCallback } from "react";
import { useJournal } from "../hooks/useJournal";

const MOODS = [
  { id:"grateful",   emoji:"🤲", label:"Grateful",   color:"#22C55E" },
  { id:"reflective", emoji:"💭", label:"Reflective", color:"#A78BFA" },
  { id:"hopeful",    emoji:"🌱", label:"Hopeful",    color:"#F59E0B" },
  { id:"struggling", emoji:"💪", label:"Struggling", color:"#3B82F6" },
  { id:"peaceful",   emoji:"🕊", label:"Peaceful",   color:"#06B6D4" },
];

function moodObj(id) { return MOODS.find(m => m.id === id) ?? MOODS[1]; }

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday:"short", month:"short", day:"numeric",
    hour:"numeric", minute:"2-digit",
  });
}

export default function Journal() {
  const [activeMood, setActiveMood] = useState(null);
  const [editing,    setEditing]    = useState(null); // null | { id?, isNew, content, mood }
  const [draftBody,  setDraftBody]  = useState("");
  const [draftMood,  setDraftMood]  = useState("reflective");

  const {
    entries, loading, loadingMore, saving, error,
    hasMore, refresh, loadMore, create, update, remove,
  } = useJournal({ mood: activeMood });

  // ── Open editor ────────────────────────────────────────────────────────────
  function openNew() {
    setEditing({ isNew: true });
    setDraftBody("");
    setDraftMood("reflective");
  }

  function openEdit(entry) {
    setEditing({ id: entry.id, isNew: false });
    setDraftBody(entry.content);
    setDraftMood(entry.mood);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    if (!draftBody.trim()) return;
    const result = editing.isNew
      ? await create({ content: draftBody, mood: draftMood })
      : await update(editing.id, { content: draftBody, mood: draftMood });
    if (result.error) { alert(result.error); return; }
    setEditing(null);
  }

  return (
    <div className="screen bg-ivory">

      {/* ── Header ── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background:"linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <p className="text-xs text-white/50 mb-0.5">Private · Synced</p>
            <h1 className="text-2xl font-black text-white">My Journal</h1>
          </div>
          <button
            onClick={openNew}
            className="press px-4 py-2 rounded-full font-bold text-sm"
            style={{ background:"#C8A951", color:"#082819" }}>
            + Entry
          </button>
        </div>

        {/* Mood filter */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveMood(null)}
            className="flex-shrink-0 press px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: activeMood === null ? "#C8A951" : "rgba(255,255,255,0.1)",
              color:      activeMood === null ? "#082819"  : "rgba(255,255,255,0.65)",
            }}>
            📓 All
          </button>
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMood(activeMood === m.id ? null : m.id)}
              className="flex-shrink-0 press px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: activeMood === m.id ? "#C8A951" : "rgba(255,255,255,0.1)",
                color:      activeMood === m.id ? "#082819"  : "rgba(255,255,255,0.65)",
              }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center justify-between"
          style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <button onClick={refresh} className="text-accent text-sm font-bold ml-3">Retry</button>
        </div>
      )}

      {/* ── Entries ── */}
      <div className="scroll-area px-4 py-4 space-y-3">
        {loading && !entries.length ? (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center pt-16">
            <p className="text-4xl mb-4">📓</p>
            <p className="text-white font-bold text-lg mb-2">Your journal is empty</p>
            <p className="text-white/40 text-sm">Write your first reflection ✍️</p>
          </div>
        ) : (
          entries.map(entry => {
            const mood = moodObj(entry.mood);
            return (
              <button
                key={entry.id}
                onClick={() => openEdit(entry)}
                className="w-full text-left press rounded-2xl overflow-hidden animate-fade-in"
                style={{ background:"#1A2B1F", border:"1px solid #2A3F2E" }}>
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{ background:`${mood.color}18`, border:`1px solid ${mood.color}30` }}>
                      <span className="text-sm">{mood.emoji}</span>
                      <span className="text-xs font-bold capitalize"
                        style={{ color: mood.color }}>{mood.label}</span>
                    </div>
                    <p className="text-white/35 text-xs">{formatDate(entry.created_at)}</p>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {entry.content}
                  </p>
                </div>
                <div className="flex justify-end px-4 pb-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm("Delete this entry?")) remove(entry.id);
                    }}
                    className="press text-xs text-white/25 px-2 py-1 rounded-lg"
                    style={{ background:"rgba(255,255,255,0.04)" }}>
                    Delete
                  </button>
                </div>
              </button>
            );
          })
        )}

        {hasMore && !loading && (
          <button onClick={loadMore} disabled={loadingMore}
            className="w-full py-3 text-sm font-semibold text-accent/70 press">
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        )}
        <div className="h-4" />
      </div>

      {/* ── Editor modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background:"rgba(0,0,0,0.65)" }}>
          <div className="w-full rounded-t-3xl overflow-hidden flex flex-col"
            style={{ background:"#0F1B14", maxHeight:"92vh" }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
              <button onClick={() => setEditing(null)} className="text-white/50 text-sm press">
                Cancel
              </button>
              <h2 className="text-white font-bold text-base">
                {editing.isNew ? "New Entry" : "Edit Entry"}
              </h2>
              <button
                onClick={handleSave}
                disabled={saving || !draftBody.trim()}
                className="press px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-40"
                style={{ background:"#C8A951", color:"#082819" }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>

            {/* Mood selector */}
            <div className="flex gap-2 overflow-x-auto px-5 py-3 flex-shrink-0 no-scrollbar">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setDraftMood(m.id)}
                  className="flex-shrink-0 press px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: draftMood === m.id ? "#C8A951" : "rgba(255,255,255,0.08)",
                    color:      draftMood === m.id ? "#082819"  : "rgba(255,255,255,0.55)",
                  }}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            {/* Text area */}
            <textarea
              className="flex-1 w-full px-5 py-3 text-white text-base leading-relaxed resize-none outline-none"
              style={{ background:"transparent", minHeight:200 }}
              placeholder="Write your reflection…"
              value={draftBody}
              onChange={e => setDraftBody(e.target.value)}
              maxLength={10000}
              autoFocus
            />

            <div className="flex justify-end px-5 pb-safe pb-4 flex-shrink-0">
              <p className="text-white/25 text-xs">{draftBody.length} / 10,000</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
