// src/services/journalService.js
// ─────────────────────────────────────────────────────────────────────────────
// SECURED journal service.
//
// Journal entries are user-private. RLS alone is sufficient security:
//   • SELECT/INSERT/UPDATE/DELETE policies all check auth.uid() = user_id
//   • FORCE ROW LEVEL SECURITY is enabled (see migration_security.sql)
//   • DB triggers enforce length (≤2000), non-empty, null-byte stripping
//
// No edge function needed — the client talks to Postgres directly and RLS
// guarantees the user can never touch anyone else's entries.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase, requireUserId } from '../lib/supabase';

const VALID_MOODS = new Set(['grateful','reflective','hopeful','struggling','peaceful']);
const PAGE_SIZE   = 50;
const MAX_CONTENT = 2000;
const MAX_TITLE   = 100;

function sanitizeClient(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function isUuid(s) {
  return typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

export async function getEntries({ page = 0, pageSize = PAGE_SIZE, mood = null } = {}) {
  try {
    const from = page * pageSize;
    const to   = from + pageSize - 1;

    let query = supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (mood && VALID_MOODS.has(mood)) query = query.eq('mood', mood);

    const { data, error } = await query;
    if (error) return { data: [], error: 'Could not load entries.' };
    return { data: data ?? [], error: null };
  } catch {
    return { data: [], error: 'Could not load entries.' };
  }
}

export async function getEntry(entryId) {
  if (!isUuid(entryId)) return { data: null, error: 'Invalid entry id.' };
  try {
    const { data, error } = await supabase
      .from('journal_entries').select('*').eq('id', entryId).single();
    if (error) return { data: null, error: 'Could not load entry.' };
    return { data: data ?? null, error: null };
  } catch {
    return { data: null, error: 'Could not load entry.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE  (direct DB — RLS enforces user_id = auth.uid())
// ─────────────────────────────────────────────────────────────────────────────

export async function createEntry({ title, content, mood = 'reflective' } = {}) {
  const cleanTitle   = sanitizeClient(title,   MAX_TITLE);
  const cleanContent = sanitizeClient(content, MAX_CONTENT);
  if (!cleanTitle)   return { data: null, error: 'Title is required.' };
  if (!cleanContent) return { data: null, error: 'Entry content is required.' };
  const cleanMood = VALID_MOODS.has(mood) ? mood : 'reflective';

  try {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ user_id: userId, title: cleanTitle, content: cleanContent, mood: cleanMood })
      .select()
      .single();

    if (error) {
      if (error.code === '23514') return { data: null, error: 'Content is invalid or too long.' };
      return { data: null, error: 'Could not save entry.' };
    }
    return { data: data ?? null, error: null };
  } catch (err) {
    if (err?.message === 'Not authenticated') {
      return { data: null, error: 'Please sign in to save entries.' };
    }
    return { data: null, error: 'Could not save entry.' };
  }
}

export async function updateEntry(entryId, { title, content, mood } = {}) {
  if (!isUuid(entryId)) return { data: null, error: 'Invalid entry id.' };

  const updates = {};
  if (title !== undefined) {
    const clean = sanitizeClient(title, MAX_TITLE);
    if (!clean) return { data: null, error: 'Title is required.' };
    updates.title = clean;
  }
  if (content !== undefined) {
    const clean = sanitizeClient(content, MAX_CONTENT);
    if (!clean) return { data: null, error: 'Entry content is required.' };
    updates.content = clean;
  }
  if (mood !== undefined) {
    updates.mood = VALID_MOODS.has(mood) ? mood : 'reflective';
  }
  if (!Object.keys(updates).length) return { data: null, error: 'Nothing to update.' };

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) return { data: null, error: 'Could not update entry.' };
    return { data: data ?? null, error: null };
  } catch {
    return { data: null, error: 'Could not update entry.' };
  }
}

export async function deleteEntry(entryId) {
  if (!isUuid(entryId)) return { error: 'Invalid entry id.' };
  try {
    const { error } = await supabase.from('journal_entries').delete().eq('id', entryId);
    return { error: error ? 'Could not delete entry.' : null };
  } catch {
    return { error: 'Could not delete entry.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REALTIME — filter by user_id so only own changes arrive
// Even without the filter, RLS would still apply — this is defence in depth.
// ─────────────────────────────────────────────────────────────────────────────

export async function subscribeToJournal({ onInsert, onUpdate, onDelete }) {
  const userId = await requireUserId();

  return supabase
    .channel(`journal:${userId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${userId}` },
      p => onInsert?.(p.new))
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${userId}` },
      p => onUpdate?.(p.new))
    .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${userId}` },
      p => onDelete?.(p.old))
    .subscribe();
}

export const JOURNAL_LIMITS = { content: MAX_CONTENT };
