// src/services/communityService.js
// ─────────────────────────────────────────────────────────────────────────────
// Community service — direct DB writes via RLS (no edge functions).
//
// • Posts table has: id, user_id, content, tag, branch, created_at
// • Like count derived from post_likes table (count aggregate)
// • Comment count derived from comments table (count aggregate)
// • Author info joined from profiles(id, display_name, avatar_url)
// • All writes rely on RLS to enforce auth.uid() = user_id
// ─────────────────────────────────────────────────────────────────────────────

import { supabase, requireUserId } from '../lib/supabase';

const VALID_TAGS     = new Set(['general', 'spirituality', 'quran', 'hadith', 'fiqh']);
const VALID_BRANCHES = new Set(['sunni', 'shia']);
const PAGE_SIZE      = 20;

const LIMITS = {
  postContent: 500,
  comment:     300,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeClient(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function isUuid(s) {
  return typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

/** Normalize a post row returned from supabase into the shape the UI expects. */
function shapePost(p) {
  if (!p) return null;
  return {
    ...p,
    likes:        p.post_likes?.[0]?.count ?? 0,
    commentCount: p.comments?.[0]?.count   ?? 0,
    users: p.profiles ? {
      id:   p.profiles.id,
      name: p.profiles.display_name || 'Anonymous',
    } : null,
  };
}

function shapeComment(c) {
  if (!c) return null;
  return {
    ...c,
    users: c.profiles ? {
      id:   c.profiles.id,
      name: c.profiles.display_name || 'Anonymous',
    } : null,
  };
}

const POST_SELECT = `
  id, content, tag, branch, created_at, user_id,
  profiles!user_id ( id, display_name, avatar_url ),
  post_likes ( count ),
  comments ( count )
`;

const COMMENT_SELECT = `
  id, content, created_at, user_id,
  profiles!user_id ( id, display_name, avatar_url )
`;

// ─── POSTS — READ ──────────────────────────────────────────────────────────

export async function getPosts({ tag = null, page = 0, pageSize = PAGE_SIZE } = {}) {
  try {
    const from = page * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from('posts')
      .select(POST_SELECT)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (tag && VALID_TAGS.has(tag)) query = query.eq('tag', tag);

    const { data, error } = await query;
    if (error) {
      console.error('getPosts error:', error);
      return { data: [], error: 'Could not load posts.' };
    }

    return { data: (data ?? []).map(shapePost), error: null };
  } catch (e) {
    console.error('getPosts exception:', e);
    return { data: [], error: 'Could not load posts.' };
  }
}

// ─── POSTS — WRITE ─────────────────────────────────────────────────────────

export async function createPost({ content, tag = 'general', branch = 'sunni', title } = {}) {
  // title is accepted for backward compatibility but ignored.
  const cleanContent = sanitizeClient(content, LIMITS.postContent);
  const cleanTag     = VALID_TAGS.has(tag) ? tag : 'general';
  const cleanBranch  = VALID_BRANCHES.has(branch) ? branch : 'sunni';

  if (!cleanContent) {
    return { data: null, error: 'Post content cannot be empty.' };
  }
  if (content && content.length > LIMITS.postContent) {
    return { data: null, error: `Content exceeds ${LIMITS.postContent} characters.` };
  }

  try {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: cleanContent,
        tag:     cleanTag,
        branch:  cleanBranch,
      })
      .select(POST_SELECT)
      .single();

    if (error) {
      console.error('createPost error:', error);
      return { data: null, error: error.message || 'Could not create post.' };
    }
    return { data: shapePost(data), error: null };
  } catch (e) {
    console.error('createPost exception:', e);
    return { data: null, error: e?.message || 'Network error.' };
  }
}

export async function deletePost(postId) {
  if (!isUuid(postId)) return { error: 'Invalid post id.' };
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    return { error: error ? 'Could not delete post.' : null };
  } catch {
    return { error: 'Could not delete post.' };
  }
}

// ─── LIKES ─────────────────────────────────────────────────────────────────

export async function toggleLike(postId) {
  if (!isUuid(postId)) return { liked: null, error: 'Invalid post id.' };
  try {
    const userId = await requireUserId();

    const { data: existing, error: lookupErr } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (lookupErr) {
      console.error('toggleLike lookup error:', lookupErr);
      return { liked: null, error: 'Could not toggle like.' };
    }

    if (existing) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) {
        console.error('toggleLike delete error:', error);
        return { liked: null, error: 'Could not unlike.' };
      }
      return { liked: false, error: null };
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
      if (error) {
        console.error('toggleLike insert error:', error);
        return { liked: null, error: 'Could not like.' };
      }
      return { liked: true, error: null };
    }
  } catch (e) {
    return { liked: null, error: e?.message || 'Network error.' };
  }
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

// ─── COMMENTS ──────────────────────────────────────────────────────────────

export async function getComments(postId) {
  if (!isUuid(postId)) return { data: [], error: 'Invalid post id.' };
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(COMMENT_SELECT)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getComments error:', error);
      return { data: [], error: 'Could not load comments.' };
    }
    return { data: (data ?? []).map(shapeComment), error: null };
  } catch {
    return { data: [], error: 'Could not load comments.' };
  }
}

export async function addComment({ postId, content }) {
  if (!isUuid(postId)) return { data: null, error: 'Invalid post id.' };
  const clean = sanitizeClient(content, LIMITS.comment);
  if (!clean) return { data: null, error: 'Comment cannot be empty.' };
  if (content && content.length > LIMITS.comment) {
    return { data: null, error: `Comment exceeds ${LIMITS.comment} characters.` };
  }

  try {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, content: clean })
      .select(COMMENT_SELECT)
      .single();

    if (error) {
      console.error('addComment error:', error);
      return { data: null, error: error.message || 'Could not add comment.' };
    }
    return { data: shapeComment(data), error: null };
  } catch (e) {
    return { data: null, error: e?.message || 'Network error.' };
  }
}

export async function deleteComment(commentId) {
  if (!isUuid(commentId)) return { error: 'Invalid comment id.' };
  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    return { error: error ? 'Could not delete comment.' : null };
  } catch {
    return { error: 'Could not delete comment.' };
  }
}

// ─── REALTIME ──────────────────────────────────────────────────────────────

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

export { LIMITS };
