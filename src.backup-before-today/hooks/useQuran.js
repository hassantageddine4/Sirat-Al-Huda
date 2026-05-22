// src/hooks/useQuran.js
// ─────────────────────────────────────────────────────────────────────────────
// React hooks wrapping the Quran.com service.
// Each hook:
//   • Manages its own loading/error state
//   • Cancels in-flight fetches on unmount or param change (AbortController)
//   • Uses the service's cache so repeat calls are instant
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getChapters,
  getVerses,
  getChapterAudio,
  getReciters,
} from "../services/quranService";

// ── useChapters ───────────────────────────────────────────────────────────────
export function useChapters({ language = "en" } = {}) {
  const [chapters, setChapters] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    getChapters({ language, signal: ctrl.signal }).then(({ data, error: err }) => {
      if (ctrl.signal.aborted) return;
      setChapters(data);
      setError(err);
      setLoading(false);
    });

    return () => ctrl.abort();
  }, [language]);

  return { chapters, loading, error };
}

// ── useVerses ─────────────────────────────────────────────────────────────────
export function useVerses(chapterId, { translationId = 131 } = {}) {
  const [verses,  setVerses]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!chapterId) {
      setVerses([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setVerses([]);

    getVerses(chapterId, { translationId, signal: ctrl.signal })
      .then(({ data, error: err }) => {
        if (ctrl.signal.aborted) return;
        setVerses(data);
        setError(err);
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [chapterId, translationId]);

  return { verses, loading, error };
}

// ── useChapterAudio ───────────────────────────────────────────────────────────
// Resolves the audio URL only; playback is handled by the consuming component
// via a plain <audio> element so we stay lightweight on mobile.
export function useChapterAudio(recitationId, chapterId) {
  const [url,     setUrl]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!recitationId || !chapterId) {
      setUrl(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    getChapterAudio(recitationId, chapterId, { signal: ctrl.signal })
      .then(({ url: u, error: err }) => {
        if (ctrl.signal.aborted) return;
        setUrl(u);
        setError(err);
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [recitationId, chapterId]);

  return { url, loading, error };
}

// ── useReciters ───────────────────────────────────────────────────────────────
export function useReciters() {
  const [reciters, setReciters] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    getReciters({ signal: ctrl.signal }).then(({ data }) => {
      if (!ctrl.signal.aborted) {
        setReciters(data);
        setLoading(false);
      }
    });
    return () => ctrl.abort();
  }, []);

  return { reciters, loading };
}
