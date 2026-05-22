// src/components/quran/ReciterPicker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Three reusable reciter-selection components:
//
//   <ReciterPickerRow />       — full-width Settings row (opens a bottom sheet)
//   <ReciterDropdown />        — compact inline dropdown (used in SurahReader)
//   <ReciterSheet />           — the shared modal, exposed if you want to
//                                 trigger it from elsewhere
//
// All three read + write the persistent reciter via useReciter(), so
// selecting a reciter in Settings instantly updates any open audio player
// without a page reload.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useReciter } from "../../hooks/useReciter";
import { getReciters } from "../../services/quranService";

// ── Live data enrichment ──────────────────────────────────────────────────────
// We render immediately from the static curated list so the UI never waits,
// then swap in the live response when it arrives (for up-to-date style labels).

function useEnrichedReciters(fallbackReciters) {
  const [list, setList] = useState(fallbackReciters);

  useEffect(() => {
    const ctrl = new AbortController();
    getReciters({ signal: ctrl.signal }).then(({ data }) => {
      if (!ctrl.signal.aborted && data.length) setList(data);
    });
    return () => ctrl.abort();
  }, []);

  return list;
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. ReciterPickerRow — for Settings pages
// ═════════════════════════════════════════════════════════════════════════════
export function ReciterPickerRow() {
  const { reciter } = useReciter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3.5 press rounded-xl bg-white"
        style={{ border: "1px solid #E8E2D8" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0F3D2E,#1A5C44)" }}>
            
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs text-muted">Reciter</p>
            <p className="text-sm font-bold text-primary truncate">{reciter.name}</p>
          </div>
        </div>
        <span className="text-muted text-sm flex-shrink-0 ml-2">›</span>
      </button>

      {open && <ReciterSheet onClose={() => setOpen(false)} />}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. ReciterDropdown — compact inline dropdown (used in SurahReader)
// ═════════════════════════════════════════════════════════════════════════════
export function ReciterDropdown() {
  const { reciter, reciters, reciterId, setReciter } = useReciter();
  const [expanded, setExpanded] = useState(false);
  const liveList = useEnrichedReciters(reciters);

  return (
    <div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full press flex items-center justify-between px-4 py-2.5 rounded-xl"
        style={{ background: "#F4F0E8", border: "1px solid #E8E2D8" }}>
        <div className="flex items-center gap-2 min-w-0">
          
          <p className="text-sm font-semibold text-primary truncate">{reciter.name}</p>
          {reciter.style && (
            <span className="text-xs text-muted flex-shrink-0">· {reciter.style}</span>
          )}
        </div>
        <span className="text-muted text-xs flex-shrink-0 ml-2">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 rounded-xl overflow-hidden"
          style={{ background: "#F4F0E8", border: "1px solid #E8E2D8" }}>
          {liveList.map((r, idx) => {
            const active = r.id === reciterId;
            return (
              <button
                key={r.id}
                onClick={() => { setReciter(r.id); setExpanded(false); }}
                className="w-full press text-left px-4 py-2.5 flex items-center justify-between"
                style={{
                  borderBottom: idx === liveList.length - 1 ? "none" : "1px solid #E8E2D8",
                  background: active ? "rgba(200,169,81,0.12)" : "transparent",
                }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate"
                    style={{ color: active ? "#C8A951" : "#0F3D2E" }}>
                    {r.name}
                  </p>
                  {r.style && (
                    <p className="text-xs text-muted mt-0.5">{r.style}</p>
                  )}
                </div>
                {active && (
                  <span className="text-accent text-base flex-shrink-0 ml-2">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. ReciterSheet — bottom-sheet modal (reusable)
// ═════════════════════════════════════════════════════════════════════════════
export function ReciterSheet({ onClose }) {
  const { reciters, reciterId, setReciter } = useReciter();
  const liveList = useEnrichedReciters(reciters);

  function handlePick(id) {
    setReciter(id);
    onClose();
  }

  return (
    <div
      className="fixed left-0 right-0 bottom-0 top-0 z-50 flex items-end"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={el => { if (el) console.log("[DEBUG-SHEET]", { offsetH: el.offsetHeight, scrollH: el.scrollHeight, top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, vh: window.innerHeight }); }} className="w-full rounded-t-3xl overflow-hidden flex flex-col animate-fade-in"
        style={{ background: "#0F1B14", maxHeight: "75dvh" }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
          <button onClick={onClose} className="text-white/50 text-sm press">Close</button>
          <h2 className="text-white font-bold text-base">Choose Reciter</h2>
          <div style={{ width: 40 }} />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {liveList.map(r => {
            const active = r.id === reciterId;
            return (
              <button
                key={r.id}
                onClick={() => handlePick(r.id)}
                className="w-full press text-left px-5 py-4 flex items-center gap-3 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background:  active ? "rgba(200,169,81,0.1)" : "transparent",
                }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: active ? "#C8A951" : "rgba(255,255,255,0.08)",
                  }}>
                  
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{r.name}</p>
                  {r.style && (
                    <p className="text-white/45 text-xs mt-0.5">{r.style}</p>
                  )}
                </div>
                {active && (
                  <span className="text-accent text-xl flex-shrink-0">✓</span>
                )}
              </button>
            );
          })}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
