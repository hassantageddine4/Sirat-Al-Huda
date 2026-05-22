// src/hooks/useHijri.js
// ─────────────────────────────────────────────────────────────────────────────
// React hooks over hijriService.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { getTodayHijri, getUpcomingEvents, getHijriMonth } from "../services/hijriService";

export function useTodayHijri() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    getTodayHijri({ signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Couldn't load today's date.");
        setLoading(false);
      });
    return () => ctrl.abort();
  }, []);

  useEffect(() => load(), [load]);

  return { data, loading, error, refetch: load };
}

export function useUpcomingEvents(daysAhead = 60) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    getUpcomingEvents({ daysAhead, signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Couldn't load upcoming events.");
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [daysAhead]);

  return { data, loading, error };
}

export function useHijriMonth(year, month) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!year || !month) return;
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    getHijriMonth({ year, month, signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Couldn't load month.");
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [year, month]);

  return { data, loading, error };
}
