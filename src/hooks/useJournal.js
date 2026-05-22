// src/hooks/useJournal.js
// ─────────────────────────────────────────────────────────────────────────────
// Private journal hook.
// Handles paginated fetch, CRUD, and real-time sync.
// Because RLS restricts journal_entries to auth.uid() = user_id,
// there is ZERO risk of exposing another user's entries.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  subscribeToJournal,
} from '../services/journalService';

const PAGE_SIZE = 50;

export function useJournal({ mood = null } = {}) {
  const [entries,     setEntries]    = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving,      setSaving]     = useState(false);
  const [error,       setError]      = useState(null);
  const [hasMore,     setHasMore]    = useState(true);

  const pageRef    = useRef(0);
  const channelRef = useRef(null);

  // ── Load entries ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    pageRef.current = 0;

    const { data, error: err } = await getEntries({ page: 0, pageSize: PAGE_SIZE, mood });

    if (err) setError(err);
    else {
      setEntries(data);
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoading(false);
  }, [mood]);

  // ── Load more ─────────────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    const { data, error: err } = await getEntries({ page: nextPage, pageSize: PAGE_SIZE, mood });

    if (!err) {
      pageRef.current = nextPage;
      setEntries(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoadingMore(false);
  }, [mood, loadingMore, hasMore]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    load();

    let mounted = true;

    subscribeToJournal({
      onInsert: newEntry => {
        if (!mounted) return;
        setEntries(prev => {
          if (prev.find(e => e.id === newEntry.id)) return prev;
          return [newEntry, ...prev]; // newest first
        });
      },
      onUpdate: updated => {
        if (!mounted) return;
        setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
      },
      onDelete: deleted => {
        if (!mounted) return;
        setEntries(prev => prev.filter(e => e.id !== deleted.id));
      },
    }).then(ch => {
      if (mounted) channelRef.current = ch;
      else ch?.unsubscribe();
    });

    return () => {
      mounted = false;
      channelRef.current?.unsubscribe();
    };
  }, [mood]);

  // ── Create ────────────────────────────────────────────────────────────────
  const create = useCallback(async ({ title, content, mood: entryMood = 'reflective' }) => {
    setSaving(true);
    const { data, error: err } = await createEntry({ title, content, mood: entryMood });
    setSaving(false);
    if (err) return { error: err };
    // Realtime will add it; optimistic-prepend for instant feedback
    if (data) setEntries(prev => [data, ...prev]);
    return { data, error: null };
  }, []);

  // ── Update ────────────────────────────────────────────────────────────────
  const update = useCallback(async (entryId, { title, content, mood: entryMood }) => {
    setSaving(true);
    const { data, error: err } = await updateEntry(entryId, { title, content, mood: entryMood });
    setSaving(false);
    if (err) return { error: err };
    if (data) setEntries(prev => prev.map(e => e.id === entryId ? data : e));
    return { data, error: null };
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const remove = useCallback(async (entryId) => {
    // Optimistic removal
    setEntries(prev => prev.filter(e => e.id !== entryId));
    const { error: err } = await deleteEntry(entryId);
    if (err) {
      load(); // roll back
      return { error: err };
    }
    return { error: null };
  }, [load]);

  return {
    entries,
    loading,
    loadingMore,
    saving,
    error,
    hasMore,
    refresh:  load,
    loadMore,
    create,
    update,
    remove,
  };
}
