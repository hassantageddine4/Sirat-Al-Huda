// src/services/authService.js
// ─────────────────────────────────────────────────────────────────────────────
// Auth surface for the app.
//
// Every flow that ends in a redirect (OAuth, magic link, password reset,
// signup verification) hands Supabase the SAME redirect URL — the one our
// deep-link handler is listening for. Without this, the iOS simulator
// either lands in mobile Safari or shows a white screen because no
// listener catches the callback.
// ─────────────────────────────────────────────────────────────────────────────

import { Browser } from '@capacitor/browser';
import { supabase } from './supabaseClient';
import { REDIRECT_URL, IS_NATIVE } from './deepLinkHandler';

// ── Validation helpers ───────────────────────────────────────────────────────
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

/**
 * Picks the right redirect URL for the platform.
 *  - Native (iOS / Android): sirat://auth/callback  → caught by deepLinkHandler
 *  - Web:                    window.location.origin  → caught by Supabase JS
 */
function getRedirectUrl() {
  if (IS_NATIVE) return REDIRECT_URL;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/auth/callback`;
  }
  return REDIRECT_URL;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER (email + password)
// ─────────────────────────────────────────────────────────────────────────────
export async function register({ name, email, password }) {
  const cleanName  = sanitizeText(name, 100);
  const cleanEmail = sanitizeText(email, 200).toLowerCase();

  if (!cleanName)                  return { data: null, error: 'Name is required.' };
  if (!validateEmail(cleanEmail))  return { data: null, error: 'Please enter a valid email address.' };
  if (!validatePassword(password)) return { data: null, error: 'Password must be at least 8 characters.' };

  const { data, error } = await supabase.auth.signUp({
    email:    cleanEmail,
    password: password,
    options:  {
      data: { name: cleanName },
      emailRedirectTo: getRedirectUrl(),
    },
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

// ─────────────────────────────────────────────────────────────────────────────
// SIGN IN (email + password)
// ─────────────────────────────────────────────────────────────────────────────
export async function signIn({ email, password }) {
  const cleanEmail = sanitizeText(email, 200).toLowerCase();
  if (!validateEmail(cleanEmail))  return { data: null, error: 'Please enter a valid email address.' };
  if (!validatePassword(password)) return { data: null, error: 'Incorrect email or password.' };

  const { data, error } = await supabase.auth.signInWithPassword({
    email:    cleanEmail,
    password: password,
  });
  if (error) return { data: null, error: 'Incorrect email or password.' };
  return { data, error: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAGIC LINK / OTP
// ─────────────────────────────────────────────────────────────────────────────
export async function sendMagicLink(email) {
  const cleanEmail = sanitizeText(email, 200).toLowerCase();
  if (!validateEmail(cleanEmail)) return { error: 'Please enter a valid email address.' };

  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: { emailRedirectTo: getRedirectUrl() },
  });
  return { error: error ? error.message : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────────────────────────────────────
export async function requestPasswordReset(email) {
  const cleanEmail = sanitizeText(email, 200).toLowerCase();
  if (!validateEmail(cleanEmail)) return { error: 'Please enter a valid email address.' };

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: getRedirectUrl(),
  });
  return { error: error ? error.message : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// OAUTH (Google / Apple / etc.)
// ─────────────────────────────────────────────────────────────────────────────
export async function signInWithOAuth(provider) {
  if (!['google', 'apple', 'facebook', 'github'].includes(provider)) {
    return { error: 'Unsupported provider.' };
  }

  if (IS_NATIVE) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: REDIRECT_URL,
        skipBrowserRedirect: true,
      },
    });
    if (error) return { error: error.message };
    if (!data?.url) return { error: 'OAuth init failed.' };

    try {
      await Browser.open({ url: data.url, presentationStyle: 'popover' });
    } catch (err) {
      return { error: err?.message ?? 'Could not open browser.' };
    }
    return { error: null };
  }

  // Web
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: getRedirectUrl() },
  });
  return { error: error ? error.message : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN OUT  /  DELETE ACCOUNT
// ─────────────────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

export async function deleteAccount() {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STATE / SESSION
// ─────────────────────────────────────────────────────────────────────────────
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error: error.message };
  return { session: data?.session ?? null, error: null };
}
