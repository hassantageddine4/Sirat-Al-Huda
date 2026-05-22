// src/hooks/useAudioDownload.js
// ─────────────────────────────────────────────────────────────────────────────
// React hooks for audio download UI:
//
//   useAudioDownload(reciterId, chapterId)
//     → { status, download, remove, sizeBytes }
//     status: "none" | "downloading" | "downloaded" | "error"
//
//   useBulkAudioDownload()
//     → { active, reciterId, completed, total, error, start, cancel }
//
//   useDownloadIndex()
//     → the localStorage index, live (re-renders on any change)
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import {
  downloadChapter,
  deleteChapter,
  isChapterDownloaded,
  getIndex,
  subscribeIndex,
  startBulkDownload,
  cancelBulkDownload,
  getBulkState,
  subscribeBulk,
} from "../services/audioDownloadService";

// ─── Per-surah hook ─────────────────────────────────────────────────────────
export function useAudioDownload(reciterId, chapterId) {
  const [status,    setStatus]    = useState("none");
  const [sizeBytes, setSizeBytes] = useState(0);
  const [error,     setError]     = useState(null);

  // Sync from index on mount + on every index change
  useEffect(() => {
    function sync() {
      if (!reciterId || !chapterId) {
        setStatus("none");
        setSizeBytes(0);
        return;
      }
      const idx = getIndex();
      const entry = idx[`${reciterId}-${chapterId}`];
      if (entry) {
        setStatus(prev => prev === "downloading" ? prev : "downloaded");
        setSizeBytes(entry.size ?? 0);
      } else {
        setStatus(prev => prev === "downloading" ? prev : "none");
        setSizeBytes(0);
      }
    }
    sync();
    return subscribeIndex(sync);
  }, [reciterId, chapterId]);

  const download = useCallback(async () => {
    if (!reciterId || !chapterId) return;
    if (isChapterDownloaded(reciterId, chapterId)) return;
    setStatus("downloading");
    setError(null);
    try {
      const r = await downloadChapter(reciterId, chapterId);
      setSizeBytes(r.size ?? 0);
      setStatus("downloaded");
    } catch (err) {
      setError(err.message || "Download failed.");
      setStatus("error");
    }
  }, [reciterId, chapterId]);

  const remove = useCallback(async () => {
    if (!reciterId || !chapterId) return;
    await deleteChapter(reciterId, chapterId);
    setStatus("none");
    setSizeBytes(0);
  }, [reciterId, chapterId]);

  return { status, error, sizeBytes, download, remove };
}

// ─── Bulk hook ──────────────────────────────────────────────────────────────
export function useBulkAudioDownload() {
  const [state, setState] = useState(getBulkState);

  useEffect(() => subscribeBulk(setState), []);

  const start = useCallback(async (reciterId) => {
    try { await startBulkDownload(reciterId); }
    catch (err) { console.warn("[bulkDownload] start failed:", err.message); }
  }, []);

  const cancel = useCallback(() => cancelBulkDownload(), []);

  return {
    active:     state.active,
    reciterId:  state.reciterId,
    completed:  state.completed,
    total:      state.total,
    error:      state.error,
    cancelled:  state.cancelled,
    start,
    cancel,
  };
}

// ─── Live index hook ────────────────────────────────────────────────────────
export function useDownloadIndex() {
  const [idx, setIdx] = useState(getIndex);
  useEffect(() => subscribeIndex(() => setIdx(getIndex())), []);
  return idx;
}
