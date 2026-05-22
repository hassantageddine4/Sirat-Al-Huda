// src/hooks/useNotifications.js
// ─────────────────────────────────────────────────────────────────────────────
// Notification hook:
//   • Fetches user's notifications (paginated)
//   • Real-time INSERT via Supabase channel
//   • Exposes unread badge count
//   • markRead / markAllRead actions
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  subscribeToNotifications,
  formatNotification,
  relativeTime,
} from '../services/notificationService';

const PAGE_SIZE = 30;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [loadingMore,   setLoadingMore]   = useState(false);
  const [error,         setError]         = useState(null);
  const [hasMore,       setHasMore]       = useState(true);

  const pageRef    = useRef(0);
  const channelRef = useRef(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    pageRef.current = 0;

    const [notifResult, countResult] = await Promise.all([
      getNotifications({ page: 0, pageSize: PAGE_SIZE }),
      getUnreadCount(),
    ]);

    if (notifResult.error) setError(notifResult.error);
    else {
      setNotifications(notifResult.data);
      setHasMore(notifResult.data.length === PAGE_SIZE);
    }

    if (!countResult.error) setUnreadCount(countResult.count);
    setLoading(false);
  }, []);

  // ── Load more ─────────────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    const { data, error: err } = await getNotifications({ page: nextPage, pageSize: PAGE_SIZE });

    if (!err) {
      pageRef.current = nextPage;
      setNotifications(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoadingMore(false);
  }, [loadingMore, hasMore]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    load();

    let mounted = true;

    const sub = subscribeToNotifications(newNotif => {
      if (!mounted) return;
      setNotifications(prev => {
        if (prev.find(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      setUnreadCount(c => c + 1);
    });
    if (mounted) channelRef.current = sub;
    else sub?.unsubscribe?.();

    return () => {
      mounted = false;
      channelRef.current?.unsubscribe();
    };
  }, []);

  // ── Mark single read ──────────────────────────────────────────────────────
  const read = useCallback(async (notificationId) => {
    // Optimistic
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(c => Math.max(0, c - 1));

    const { error: err } = await markRead(notificationId);
    if (err) load(); // rollback
    return { error: err ?? null };
  }, [load]);

  // ── Mark all read ─────────────────────────────────────────────────────────
  const readAll = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    const { error: err } = await markAllRead();
    if (err) load();
    return { error: err ?? null };
  }, [load]);

  // ── Decorated notification objects (add display helpers) ──────────────────
  const decorated = notifications.map(n => ({
    ...n,
    displayText:    formatNotification(n),
    timeAgo:        relativeTime(n.created_at),
  }));

  return {
    notifications: decorated,
    unreadCount,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh:   load,
    loadMore,
    markRead:  read,
    markAllRead: readAll,
  };
}
