// src/hooks/useReciter.js
// ─────────────────────────────────────────────────────────────────────────────
// Persistent reciter selection hook.
//
//   • The selected reciter ID survives reloads (localStorage)
//   • The selection is shared across components via a module-level pub/sub
//     so changing it in Settings updates the audio player in SurahReader
//     immediately — no full page reload or prop drilling.
//   • Falls back to DEFAULT_RECITER_ID if no preference is saved yet.
//   • Validates against CURATED_RECITERS so a stale/invalid stored ID
//     resets to the default instead of breaking playback.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";
import { CURATED_RECITERS, DEFAULT_RECITER_ID } from "../services/quranService";

const STORAGE_KEY = "sirat_selected_reciter_id";

// ── Module-level state + subscribers ─────────────────────────────────────────
// Used so every mounted component stays in sync when the user picks a new
// reciter anywhere in the app.
let currentId = readInitialId();
const listeners = new Set();

function readInitialId() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (isValidReciterId(parsed)) return parsed;
  } catch { /* localStorage unavailable */ }
  return DEFAULT_RECITER_ID;
}

function isValidReciterId(id) {
  return Number.isInteger(id) && CURATED_RECITERS.some(r => r.id === id);
}

function writeId(id) {
  currentId = id;
  try { localStorage.setItem(STORAGE_KEY, String(id)); } catch { /* ignore */ }
  listeners.forEach(fn => fn(id));
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the currently selected reciter plus a setter.
 *
 * @returns {{
 *   reciterId: number,
 *   reciter:   {id:number, name:string, style:string},
 *   setReciter: (id:number) => void,
 *   reciters:  Array,
 * }}
 */
export function useReciter() {
  const [reciterId, setReciterId] = useState(currentId);

  // Subscribe to cross-component changes
  useEffect(() => {
    const listener = (id) => setReciterId(id);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const setReciter = useCallback((id) => {
    if (!isValidReciterId(id)) return;
    if (id === currentId) return;
    writeId(id);
  }, []);

  const reciter =
    CURATED_RECITERS.find(r => r.id === reciterId)
    ?? CURATED_RECITERS.find(r => r.id === DEFAULT_RECITER_ID);

  return {
    reciterId,
    reciter,
    setReciter,
    reciters: CURATED_RECITERS,
  };
}

// ── Non-hook accessor for non-React code (e.g. services) ─────────────────────
export function getSelectedReciterId() {
  return currentId;
}
