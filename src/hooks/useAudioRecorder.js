// src/hooks/useAudioRecorder.js
// ─────────────────────────────────────────────────────────────────────────────
// Web MediaRecorder hook — handles mic permission, recording lifecycle,
// elapsed timer, and live audio-level readout for waveform animation.
//
// Returns a Blob (webm/opus or audio/webm) that can be sent straight to
// the /transcribe edge function via multipart/form-data.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_DURATION_MS = 60_000;   // hard 60 s cap so users don't upload huge files

export function useAudioRecorder() {
  const [state,    setState]    = useState("idle"); // idle | requesting | recording | processing | error
  const [error,    setError]    = useState(null);
  const [elapsed,  setElapsed]  = useState(0);      // seconds
  const [level,    setLevel]    = useState(0);      // 0..1 for waveform

  const mediaRecorder   = useRef(null);
  const stream          = useRef(null);
  const chunks          = useRef([]);
  const startedAt       = useRef(0);
  const tickInterval    = useRef(null);
  const audioCtx        = useRef(null);
  const analyser        = useRef(null);
  const rafId           = useRef(null);
  const resolveStop     = useRef(null);
  const maxDurationTimer = useRef(null);

  // ── Clean up on unmount ───────────────────────────────────────────────────
  useEffect(() => () => teardown(), []);

  function teardown() {
    try { mediaRecorder.current?.stop?.(); } catch { /* */ }
    stream.current?.getTracks?.().forEach(t => t.stop());
    audioCtx.current?.close?.().catch(() => {});
    if (rafId.current)        cancelAnimationFrame(rafId.current);
    if (tickInterval.current) clearInterval(tickInterval.current);
    if (maxDurationTimer.current) clearTimeout(maxDurationTimer.current);
    mediaRecorder.current = null;
    stream.current        = null;
    audioCtx.current      = null;
    analyser.current      = null;
    rafId.current         = null;
    tickInterval.current  = null;
    maxDurationTimer.current = null;
  }

  // ── Start recording ───────────────────────────────────────────────────────
  const start = useCallback(async () => {
    setError(null);
    setElapsed(0);
    setLevel(0);
    chunks.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Recording is not supported on this device.");
      setState("error");
      return;
    }

    setState("requesting");

    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      setError(err.name === "NotAllowedError"
        ? "Microphone access was denied. Please enable it in Settings."
        : "Could not access microphone.");
      setState("error");
      return;
    }

    // Audio-level meter for waveform
    try {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.current.createMediaStreamSource(stream.current);
      analyser.current = audioCtx.current.createAnalyser();
      analyser.current.fftSize = 256;
      src.connect(analyser.current);

      const buf = new Uint8Array(analyser.current.frequencyBinCount);
      const tick = () => {
        if (!analyser.current) return;
        analyser.current.getByteTimeDomainData(buf);
        // Peak deviation from 128 → normalized 0..1
        let peak = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = Math.abs(buf[i] - 128);
          if (v > peak) peak = v;
        }
        setLevel(Math.min(1, peak / 64));
        rafId.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // AudioContext not critical — recording still works
    }

    // Pick a supported mime type (prefer webm/opus, fall back to default)
    let mimeType = "audio/webm;codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "audio/webm";
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "";

    try {
      mediaRecorder.current = mimeType
        ? new MediaRecorder(stream.current, { mimeType })
        : new MediaRecorder(stream.current);
    } catch (err) {
      setError("Recording is not supported on this device.");
      setState("error");
      teardown();
      return;
    }

    mediaRecorder.current.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: mediaRecorder.current?.mimeType ?? "audio/webm" });
      const fn = resolveStop.current;
      resolveStop.current = null;
      teardown();
      setState("idle");
      fn?.(blob);
    };

    startedAt.current = Date.now();
    mediaRecorder.current.start();
    setState("recording");

    // Elapsed timer
    tickInterval.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 250);

    // Hard max duration
    maxDurationTimer.current = setTimeout(() => {
      stop();
    }, MAX_DURATION_MS);
  }, []);

  // ── Stop recording — returns the Blob ─────────────────────────────────────
  const stop = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || mediaRecorder.current.state === "inactive") {
        resolve(null);
        return;
      }
      resolveStop.current = resolve;
      setState("processing");
      try { mediaRecorder.current.stop(); }
      catch {
        teardown();
        setState("idle");
        resolve(null);
      }
    });
  }, []);

  // ── Cancel without returning audio ────────────────────────────────────────
  const cancel = useCallback(() => {
    chunks.current = [];
    teardown();
    setState("idle");
    setElapsed(0);
    setLevel(0);
  }, []);

  return { state, error, elapsed, level, start, stop, cancel };
}
