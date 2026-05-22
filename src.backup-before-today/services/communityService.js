// src/services/communityService.js
// ─────────────────────────────────────────────────────────────────────────────
// SECURED community service.
//
// Reads go directly to the DB (RLS enforces who can see what).
// Writes go through Edge Functions which:
//   • Verify the JWT server-side
//   • Validate + sanitise input server-side
//   • Rate-limit per IP
//   • Audit-log every attempt
//
// Client-side validation is a UX nicety only — the server is authoritative.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase, requireUserId } from './supabaseClient';

const VALID_TAGS = new Set(['general', 'spirituality', 'quran', 'hadith', 'fiqh']);
const PAGE_SIZE  = 20;

// Client-side limits — match the server exactly so UX feels responsive.
// These are NOT security boundaries — the DB + edge functions enforce the real limits.
const LIMITS = {
  postTitle:   200,
  postContent: 500,
  comment:     300,
};

// ── Input helpers ─────────────────────────────────────────────────────────────

function sanitizeClient(value, max) {
  if (typeof value !== 'string') return '';
  // Strip null bytes + control chars except tab/newline (mirrors server)
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function isUuid(s) {
  return typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

/**
 * Calls a Supabase Edge Function and returns a normalised { data, error } shape.
 * Never throws — errors are always surfaced as strings.
 */
async function invokeFn(name, body) {
  try {
    const { data, error } = await supabase.functions.invoke(name, { body });
    if (error) {
      // Supabase wraps non-2xx responses. Try to extract the server's message.
      let msg = error.message || 'Request failed.';
      try {
        const ctx = error.context?.response;
        if (ctx) {
          const text = await ctx.text();
          const parsed = JSON.parse(text);
          if (parsed?.error) msg = parsed.error;
        }
      } catch { /* keep the default message */ }
      return { data: null, error: msg };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err?.message ?? 'Network error.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS — READ
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a page of posts, newest first. RLS allows all authenticated users to read.
 */
export async function getPosts({ tag = null, page = 0, pageSize = PAGE_SIZE } = {}) {
  try {
    const from = page * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from('posts')
      .select(`
        id, title, content, tag, likes, created_at, user_id,
        users ( id, name ),
        comments ( count )
      `)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (tag && VALID_TAGS.has(tag)) query = query.eq('tag', tag);

    const { data, error } = await query;
    if (error) return { data: [], error: 'Could not load posts.' };

    const posts = (data ?? []).map(p => ({
      ...p,
      commentCount: p.comments?.[0]?.count ?? 0,
    }));
    return { data: posts, error: null };
  } catch {
    return { data: [], error: 'Could not load posts.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS — WRITE (via edge function)
// ─────────────────────────────────────────────────────────────────────────────

export async function createPost({ title, content, tag = 'general' } = {}) {
  // Client-side sanity check for instant feedback (server re-validates)
  const cleanTitle   = sanitizeClient(title,   LIMITS.postTitle);
  const cleanContent = sanitizeClient(content, LIMITS.postContent);
  const cleanTag     = VALID_TAGS.has(tag) ? tag : 'general';

  if (!cleanTitle || !cleanContent) {
    return { data: null, error: 'Title and content are required.' };
  }
  if (title.length > LIMITS.postTitle) {
    return { data: null, error: `Title exceeds ${LIMITS.postTitle} characters.` };
  }
  if (content.length > LIMITS.postContent) {
    return { data: null, error: `Content exceeds ${LIMITS.postContent} characters.` };
  }

  const { data, error } = await invokeFn('create-post', {
    title:   cleanTitle,
    content: cleanContent,
    tag:     cleanTag,
  });
  return { data: data?.post ?? null, error };
}

/**
 * Delete a post. RLS enforces "only the author can delete" — no edge function needed.
 */
export async function deletePost(postId) {
  if (!isUuid(postId)) return { error: 'Invalid post id.' };
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    return { error: error ? 'Could not delete post.' : null };
  } catch {
    return { error: 'Could not delete post.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIKES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Toggle like via edge function. Server derives user from auth.uid(),
 * rate-limits, and returns 'liked' | 'unliked'.
 */
export async function toggleLike(postId) {
  if (!isUuid(postId)) return { liked: null, error: 'Invalid post id.' };
  const { data, error } = await invokeFn('toggle-like', { post_id: postId });
  if (error) return { liked: null, error };
  return { liked: data?.action === 'liked', error: null };
}

export async function getUserLikedPostIds() {
  try {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) return { data: new Set(), error: 'Could not load likes.' };
    return { data: new Set((data ?? []).map(r => r.post_id)), error: null };
  } catch {
    return { data: new Set(), error: 'Could not load likes.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getComments(postId) {
  if (!isUuid(postId)) return { data: [], error: 'Invalid post id.' };
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id, content, created_at, user_id,
        users ( id, name )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) return { data: [], error: 'Could not load comments.' };
    return { data: data ?? [], error: null };
  } catch {
    return { data: [], error: 'Could not load comments.' };
  }
}

export async function addComment({ postId, content }) {
  if (!isUuid(postId)) return { data: null, error: 'Invalid post id.' };
  const clean = sanitizeClient(content, LIMITS.comment);
  if (!clean) return { data: null, error: 'Comment cannot be empty.' };
  if (content.length > LIMITS.comment) {
    return { data: null, error: `Comment exceeds ${LIMITS.comment} characters.` };
  }

  const { data, error } = await invokeFn('create-comment', {
    post_id: postId,
    content: clean,
  });
  return { data: data?.comment ?? null, error };
}

/**
 * Delete a comment. RLS enforces author-only — no edge function needed.
 */
export async function deleteComment(commentId) {
  if (!isUuid(commentId)) return { error: 'Invalid comment id.' };
  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    return { error: error ? 'Could not delete comment.' : null };
  } catch {
    return { error: 'Could not delete comment.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REALTIME
// ─────────────────────────────────────────────────────────────────────────────

export function subscribeToPostsTable({ onInsert, onUpdate, onDelete }) {
  return supabase
    .channel('public:posts')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      p => onInsert?.(p.new))
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'posts' },
      p => onUpdate?.(p.new))
    .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'posts' },
      p => onDelete?.(p.old))
    .subscribe();
}

export function subscribeToComments(postId, onInsert) {
  if (!isUuid(postId)) return null;
  return supabase
    .channel(`comments:${postId}`)
    .on('postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'comments',
        filter: `post_id=eq.${postId}`,
      },
      p => onInsert?.(p.new))
    .subscribe();
}

// ── Re-export limits so UI can show character counters matching the server ───
export const CLIENT_LIMITS = LIMITS;
