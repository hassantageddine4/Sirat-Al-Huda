// src/hooks/useHadith.js
// ─────────────────────────────────────────────────────────────────────────────
// React hooks over hadithService. Each hook handles its own AbortController
// so route changes cancel in-flight requests cleanly.
//
//   useSectionIndex(collectionId)  — chapter list for a collection
//   useSection(collectionId, n)    — one chapter's hadiths
//   useHadith(collectionId, n)     — single hadith
//   useHadithSearch(collectionId, query, page)  — debounced search w/ pagination
//   useBookmark(collectionId, n)   — live bookmark state for a single hadith
//   useBookmarks()                  — full bookmark list, live
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSectionIndex,
  getSection,
  getHadith,
  searchHadiths,
} from "../services/hadithService";
import {
  isBookmarked,
  toggleBookmark,
  getBookmarks,
  subscribe,
} from "../services/hadithBookmarks";

// ─── useSectionIndex ────────────────────────────────────────────────────────
export function useSectionIndex(collectionId) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refetchKey = useRef(0);
  const refetch = useCallback(() => { refetchKey.current += 1; load(); }, []);

  const load = useCallback(() => {
    if (!collectionId) return;
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();

    getSectionIndex(collectionId, { signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Failed to load chapters.");
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [collectionId]);

  useEffect(() => load(), [load, refetchKey.current]);

  return { data, loading, error, refetch };
}

// ─── useSection ─────────────────────────────────────────────────────────────
export function useSection(collectionId, sectionNumber) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(() => {
    if (!collectionId || sectionNumber == null) return;
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();

    getSection(collectionId, sectionNumber, { signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Failed to load chapter.");
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [collectionId, sectionNumber]);

  useEffect(() => load(), [load]);

  return { data, loading, error, refetch: load };
}

// ─── useHadith ──────────────────────────────────────────────────────────────
export function useHadith(collectionId, hadithNumber) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(() => {
    if (!collectionId || hadithNumber == null) return;
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();

    getHadith(collectionId, hadithNumber, { signal: ctrl.signal })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Failed to load hadith.");
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [collectionId, hadithNumber]);

  useEffect(() => load(), [load]);

  return { data, loading, error, refetch: load };
}

// ─── useHadithSearch (debounced) ────────────────────────────────────────────
const SEARCH_DEBOUNCE_MS = 280;
const PAGE_SIZE = 20;

export function useHadithSearch(collectionId, rawQuery) {
  const [query,    setQuery]    = useState(rawQuery);
  const [results,  setResults]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // Debounce the input → committed query
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [rawQuery]);

  // Reset paging when the query changes
  useEffect(() => { setPage(0); }, [query, collectionId]);

  // Fetch
  useEffect(() => {
    if (!collectionId) return;
    let cancelled = false;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    searchHadiths(collectionId, query, {
      page,
      pageSize: PAGE_SIZE,
      signal: ctrl.signal,
    })
      .then(res => {
        if (cancelled) return;
        // Append on subsequent pages, replace on page 0
        setResults(prev => page === 0 ? res.results : [...prev, ...res.results]);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled || err.name === "AbortError") return;
        setError(err.message ?? "Search failed.");
        setLoading(false);
      });

    return () => { cancelled = true; ctrl.abort(); };
  }, [collectionId, query, page]);

  const hasMore = results.length < total;
  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(p => p + 1);
  }, [loading, hasMore]);

  return {
    results,
    total,
    loading,
    error,
    hasMore,
    loadMore,
    committedQuery: query,
  };
}

// ─── useBookmark — live state for a single hadith ───────────────────────────
export function useBookmark(collectionId, hadithNumber) {
  const [bookmarked, setBookmarked] = useState(() =>
    isBookmarked(collectionId, hadithNumber)
  );

  useEffect(() => {
    setBookmarked(isBookmarked(collectionId, hadithNumber));
    return subscribe(() => {
      setBookmarked(isBookmarked(collectionId, hadithNumber));
    });
  }, [collectionId, hadithNumber]);

  const toggle = useCallback((hadithSnapshot) => {
    toggleBookmark(hadithSnapshot);
  }, []);

  return { bookmarked, toggle };
}

// ─── useBookmarks — full list, live ─────────────────────────────────────────
export function useBookmarks() {
  const [items, setItems] = useState(() => getBookmarks());

  useEffect(() => {
    setItems(getBookmarks());
    return subscribe(() => setItems(getBookmarks()));
  }, []);

  return items;
}
