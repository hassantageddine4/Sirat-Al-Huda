// src/hooks/usePosts.js
// ─────────────────────────────────────────────────────────────────────────────
// Complete posts hook:
//   • Paginated fetch (load-more pattern)
//   • Optimistic like toggle
//   • Real-time INSERT/UPDATE/DELETE via Supabase channel
//   • Inline comment loading per post
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPosts,
  createPost,
  deletePost,
  toggleLike,
  getUserLikedPostIds,
  getComments,
  addComment,
  deleteComment,
  subscribeToPostsTable,
  subscribeToComments,
} from '../services/communityService';

const PAGE_SIZE = 20;

export function usePosts({ tag = null } = {}) {
  const [posts,       setPosts]      = useState([]);
  const [likedIds,    setLikedIds]   = useState(new Set());
  const [loading,     setLoading]    = useState(false);
  const [loadingMore, setLoadingMore]= useState(false);
  const [error,       setError]      = useState(null);
  const [hasMore,     setHasMore]    = useState(true);

  const pageRef    = useRef(0);
  const channelRef = useRef(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    pageRef.current = 0;

    const [postsResult, likedResult] = await Promise.all([
      getPosts({ tag, page: 0, pageSize: PAGE_SIZE }),
      getUserLikedPostIds(),
    ]);

    if (postsResult.error) {
      setError(postsResult.error);
    } else {
      setPosts(postsResult.data);
      setHasMore(postsResult.data.length === PAGE_SIZE);
    }

    if (!likedResult.error) {
      setLikedIds(likedResult.data);
    }

    setLoading(false);
  }, [tag]);

  // ── Load more (pagination) ────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    const { data, error: err } = await getPosts({ tag, page: nextPage, pageSize: PAGE_SIZE });

    if (err) {
      setError(err);
    } else {
      pageRef.current = nextPage;
      setPosts(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    }

    setLoadingMore(false);
  }, [tag, loadingMore, hasMore]);

  // ── Real-time subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    load();

    channelRef.current = subscribeToPostsTable({
      onInsert: newPost => {
        // Prepend new post — reload to get author name join
        setPosts(prev => {
          // Avoid duplicate if we already have it
          if (prev.find(p => p.id === newPost.id)) return prev;
          return [newPost, ...prev];
        });
      },
      onUpdate: updatedPost => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
      },
      onDelete: deletedPost => {
        setPosts(prev => prev.filter(p => p.id !== deletedPost.id));
      },
    });

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [tag]);

  // ── Create post ───────────────────────────────────────────────────────────
  const create = useCallback(async ({ title, content, tag: postTag = 'general' }) => {
    const { data, error: err } = await createPost({ title, content, tag: postTag });
    if (err) return { error: err };
    // Realtime subscription will pick it up; optionally optimistic-add:
    if (data) setPosts(prev => [data, ...prev]);
    return { error: null };
  }, []);

  // ── Delete post ───────────────────────────────────────────────────────────
  const remove = useCallback(async (postId) => {
    // Optimistic removal
    setPosts(prev => prev.filter(p => p.id !== postId));
    const { error: err } = await deletePost(postId);
    if (err) {
      // Roll back
      load();
      return { error: err };
    }
    return { error: null };
  }, [load]);

  // ── Toggle like (optimistic) ──────────────────────────────────────────────
  const like = useCallback(async (postId) => {
    const isLiked = likedIds.has(postId);

    // Optimistic update
    setLikedIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes: p.likes + (isLiked ? -1 : 1) }
        : p
    ));

    const { liked, error: err } = await toggleLike(postId);
    if (err) {
      // Roll back optimistic update
      setLikedIds(prev => {
        const next = new Set(prev);
        isLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, likes: p.likes + (isLiked ? 1 : -1) }
          : p
      ));
    }

    return { liked, error: err ?? null };
  }, [likedIds]);

  return {
    posts,
    likedIds,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh:  load,
    loadMore,
    create,
    remove,
    like,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useComments — for a single post's comment thread
// ─────────────────────────────────────────────────────────────────────────────

export function useComments(postId) {
  const [comments,  setComments] = useState([]);
  const [loading,   setLoading]  = useState(false);
  const [submitting,setSub]      = useState(false);
  const [error,     setError]    = useState(null);
  const channelRef               = useRef(null);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    const { data, error: err } = await getComments(postId);
    if (err) setError(err);
    else setComments(data);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    load();

    // Subscribe to live comments for this post
    channelRef.current = subscribeToComments(postId, newComment => {
      setComments(prev => {
        if (prev.find(c => c.id === newComment.id)) return prev;
        return [...prev, newComment];
      });
    });

    return () => { channelRef.current?.unsubscribe(); };
  }, [postId]);

  const submit = useCallback(async (content) => {
    setSub(true);
    const { data, error: err } = await addComment({ postId, content });
    setSub(false);
    if (err) return { error: err };
    // Realtime will add it; also optimistically add if the row includes user join
    if (data) setComments(prev => [...prev, data]);
    return { error: null };
  }, [postId]);

  const remove = useCallback(async (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    const { error: err } = await deleteComment(commentId);
    if (err) { load(); return { error: err }; }
    return { error: null };
  }, [load]);

  return { comments, loading, submitting, error, submit, remove, refresh: load };
}
