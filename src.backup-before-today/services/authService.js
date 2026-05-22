// src/services/authService.js
import { supabase } from '../lib/supabase';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
function sanitizeText(value, maxLen = 200) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export async function register({ name, email, password }) {
  const cleanName  = sanitizeText(name, 100);
  const cleanEmail = sanitizeText(email, 200).toLowerCase();

  if (!cleanName)                  return { data: null, error: 'Name is required.' };
  if (!validateEmail(cleanEmail))  return { data: null, error: 'Please enter a valid email address.' };
  if (!validatePassword(password)) return { data: null, error: 'Password must be at least 8 characters.' };

  const { data, error } = await supabase.auth.signUp({
    email   : cleanEmail,
    password: password,
    options : { data: { name: cleanName } },
  });

  if (error) return { data: null, error: error.message };

  if (data.user) {
    await supabase
      .from('users')
      .upsert({ id: data.user.id, name: cleanName, email: cleanEmail })
      .eq('id', data.user.id);
  }

  return { data, error: null };
}

export async function login({ email, password }) {
  const cleanEmail = sanitizeText(email, 200).toLowerCase();

  if (!validateEmail(cleanEmail)) return { data: null, error: 'Please enter a valid email address.' };
  if (!password)                  return { data: null, error: 'Password is required.' };

  const { data, error } = await supabase.auth.signInWithPassword({
    email   : cleanEmail,
    password: password,
  });

  if (error) {
    // Surface clear messages for the most common Supabase errors
    if (error.message.includes('Email not confirmed')) {
      return { data: null, error: 'Please check your email and confirm your account first.' };
    }
    if (error.message.includes('Invalid login credentials')) {
      return { data: null, error: 'Incorrect email or password. Please try again.' };
    }
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data: data?.session ?? null, error: error?.message ?? null };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data: data?.user ?? null, error: error?.message ?? null };
}

export async function getProfile(userId) {
  if (!userId) return { data: null, error: 'userId is required.' };

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

export async function updateProfile(fields) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { data: null, error: 'Not authenticated.' };

  const ALLOWED = ['name', 'religion', 'language', 'goals'];
  const updates = {};

  for (const key of ALLOWED) {
    if (fields[key] !== undefined) {
      updates[key] = Array.isArray(fields[key])
        ? fields[key]
        : sanitizeText(String(fields[key]), 200);
    }
  }

  if (Object.keys(updates).length === 0) {
    return { data: null, error: 'No valid fields to update.' };
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

export async function deleteAccount() {
  const { data: sessionData } = await getSession();
  if (!sessionData) throw new Error('Not authenticated.');

  const uid = sessionData.user.id;

  await supabase.from('journal_entries').delete().eq('user_id', uid);
  await supabase.from('post_likes').delete().eq('user_id', uid);
  await supabase.from('replies').delete().eq('user_id', uid);
  await supabase.from('posts').delete().eq('user_id', uid);
  await supabase.from('users').delete().eq('id', uid);

  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return data.subscription.unsubscribe;
}
