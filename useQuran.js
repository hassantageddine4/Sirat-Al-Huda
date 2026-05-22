// src/hooks/useQuran.js
// ─────────────────────────────────────────────────────────────────────────────
// React hooks wrapping the Quran.com service.
// Each hook:
//   • Manages its own loading/error state
//   • Cancels in-flight fetches on unmount or param change (AbortController)
//   • Uses the service's cache so repeat calls are instant
//
// useChapterAudio additionally checks for a locally-downloaded copy first,
// so offline playback works for any surah the user has saved.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import {
  getChapters,
  getVerses,
  getChapterAudio,
  getReciters,
} from "../services/quranService";
import {
  getLocalAudioUrl,
  subscribeIndex,
} from "../services/audioDownloadService";

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
export function useVerses(chapterId, { translationId = "en.sahih" } = {}) {
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
// Resolves the audio URL. Prefers a locally-downloaded file if one exists;
// otherwise falls back to the Quran.com CDN URL (online only).
//
// Returns:
//   url       — playable URL (file: scheme if local, https: if CDN)
//   loading   — true while resolving
//   error     — resolution error message, if any
//   fromLocal — true when the URL points to a local downloaded file
export function useChapterAudio(recitationId, chapterId) {
  const [url,       setUrl]       = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [fromLocal, setFromLocal] = useState(false);
  const [bump,      setBump]      = useState(0);

  // Re-resolve whenever the download index changes (download completes / delete)
  useEffect(() => {
    return subscribeIndex(() => setBump(b => b + 1));
  }, []);

  useEffect(() => {
    if (!recitationId || !chapterId) {
      setUrl(null);
      setFromLocal(false);
      return;
    }

    let cancelled = false;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      // 1) Try local downloaded file
      try {
        const local = await getLocalAudioUrl(recitationId, chapterId);
        if (cancelled) return;
        if (local) {
          setUrl(local);
          setFromLocal(true);
          setLoading(false);
          return;
        }
      } catch {
        // Filesystem error — fall through to CDN
      }

      // 2) Fall back to CDN
      setFromLocal(false);
      const { url: u, error: err } = await getChapterAudio(recitationId, chapterId, { signal: ctrl.signal });
      if (cancelled) return;
      setUrl(u);
      setError(err);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [recitationId, chapterId, bump]);

  return { url, loading, error, fromLocal };
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
