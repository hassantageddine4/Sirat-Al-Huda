// src/services/postService.js
// All functions return { data, error } — never throw.
// user_id is always derived from the active Supabase session via auth.uid(),
// matching the RLS policies — no userId param needed from the UI layer.
import { supabase } from '../lib/supabase';

// Must exactly match the DB CHECK constraint on posts.tag
const VALID_TAGS = ['general', 'quran', 'hadith', 'fiqh', 'spirituality'];

function sanitize(value, maxLen = 5000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

async function getCurrentUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

// ── Posts ──────────────────────────────────────────────────────────────────────

/**
 * Fetch community posts, newest first.
 * Includes the author name from the joined users table.
 */
export async function getPosts({ tag = null, limit = 20, offset = 0 } = {}) {
  let query = supabase
    .from('posts')
    .select(`
      id, title, content, tag, likes, created_at, user_id,
      users ( id, name )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (tag && VALID_TAGS.includes(tag.toLowerCase())) {
    query = query.eq('tag', tag.toLowerCase());
  }

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}

/**
 * Fetch a single post with its replies.
 */
export async function getPostById(postId) {
  if (!postId) return { data: null, error: 'postId is required.' };

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id, title, content, tag, likes, created_at, user_id,
      users ( id, name ),
      replies (
        id, content, created_at, user_id,
        users ( id, name )
      )
    `)
    .eq('id', postId)
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

/**
 * Create a new post. user_id is set from the active session.
 */
export async function createPost({ title, content, tag = 'general' } = {}) {
  const cleanTitle   = sanitize(title, 300);
  const cleanContent = sanitize(content, 5000);
  const cleanTag     = VALID_TAGS.includes(tag) ? tag : 'general';

  if (!cleanTitle)   return { data: null, error: 'Title is required (max 300 characters).' };
  if (!cleanContent) return { data: null, error: 'Content is required (max 5000 characters).' };

  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, title: cleanTitle, content: cleanContent, tag: cleanTag })
    .select(`id, title, content, tag, likes, created_at, user_id, users ( id, name )`)
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

/**
 * Delete a post. RLS ensures only the owner can delete.
 */
export async function deletePost(postId) {
  if (!postId) return { error: 'postId is required.' };

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  return { error: error?.message ?? null };
}

/**
 * Atomically toggle a like via the DB function.
 * Returns { data: true|false, error }.
 */
export async function toggleLike(postId) {
  if (!postId) return { data: null, error: 'postId is required.' };

  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not authenticated.' };

  const { data, error } = await supabase
    .rpc('toggle_post_like', { p_post_id: postId, p_user_id: userId });

  return { data: data ?? null, error: error?.message ?? null };
}

/**
 * Fetch post ids the current user has liked (seeds the liked{} UI map).
 */
export async function getUserLikes() {
  const userId = await getCurrentUserId();
  if (!userId) return { data: [], error: null };

  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', userId);

  return {
    data : (data ?? []).map(r => r.post_id),
    error: error?.message ?? null,
  };
}

// ── Replies ────────────────────────────────────────────────────────────────────

export async function createReply({ postId, content } = {}) {
  const cleanContent = sanitize(content, 2000);
  if (!cleanContent) return { data: null, error: 'Reply content is required.' };
  if (!postId)       return { data: null, error: 'postId is required.' };

  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('replies')
    .insert({ post_id: postId, user_id: userId, content: cleanContent })
    .select()
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

export async function deleteReply(replyId) {
  if (!replyId) return { error: 'replyId is required.' };
  const { error } = await supabase.from('replies').delete().eq('id', replyId);
  return { error: error?.message ?? null };
}

// ── Reports ────────────────────────────────────────────────────────────────────

export async function reportContent({ contentType, contentId, reason } = {}) {
  const validTypes = ['post', 'reply'];
  const cleanReason = sanitize(reason, 500);

  if (!validTypes.includes(contentType)) return { data: null, error: 'contentType must be "post" or "reply".' };
  if (!cleanReason)                      return { data: null, error: 'Reason is required.' };
  if (!contentId)                        return { data: null, error: 'contentId is required.' };

  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id  : userId,
      content_type : contentType,
      content_id   : contentId,
      reason       : cleanReason,
    })
    .select()
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}
