// src/services/deepLinkHandler.js
// ─────────────────────────────────────────────────────────────────────────────
// Catches deep links sent to the app via the `sirat://` URL scheme and feeds
// OAuth / magic-link / email-verification callbacks back into Supabase.
//
// Without this handler, after the user signs in via OAuth or clicks a magic
// link, iOS opens the app at sirat://auth/callback with tokens in the URL —
// but the web view never sees the URL, so the session is never established
// and the user is left staring at a white screen.
//
// We register exactly one Capacitor App.addListener('appUrlOpen', ...) at app
// boot, parse the URL, and call supabase.auth.setSession() with the tokens.
// ─────────────────────────────────────────────────────────────────────────────

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { supabase } from './supabaseClient';

const REDIRECT_SCHEME = 'sirat';
const REDIRECT_HOST   = 'auth';
const REDIRECT_PATH   = '/callback';

/** Public redirect URL used everywhere we hand a URL to Supabase. */
export const REDIRECT_URL = `${REDIRECT_SCHEME}://${REDIRECT_HOST}${REDIRECT_PATH}`;

/**
 * Whether the app is running inside a Capacitor native shell (iOS or Android).
 * On the web (vite dev server, browser preview), deep links are not used —
 * Supabase will redirect back to window.location.origin instead.
 */
export const IS_NATIVE = Capacitor.isNativePlatform?.() ?? false;

let listenerHandle = null;
let listenerRegistered = false;

// ─── Logging ─────────────────────────────────────────────────────────────────
// Keep a small in-memory ring buffer of auth events so a Settings → Debug
// screen can show what happened without enabling verbose console logging.
const debugLog = [];
function log(...args) {
  const ts = new Date().toISOString();
  const msg = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  debugLog.push(`[${ts}] ${msg}`);
  if (debugLog.length > 50) debugLog.shift();
  // eslint-disable-next-line no-console
  console.log('[auth-deep-link]', ...args);
}
export function getDeepLinkLog() {
  return [...debugLog];
}

// ─── URL parsing ─────────────────────────────────────────────────────────────
/**
 * Supabase puts auth artefacts in BOTH the query string and the URL hash
 * depending on flow type. PKCE/code: ?code=...  |  Implicit: #access_token=...
 * We collect both and merge.
 */
function extractAuthParams(rawUrl) {
  let u;
  try { u = new URL(rawUrl); }
  catch { return null; }

  const params = new URLSearchParams(u.search);
  const hash   = new URLSearchParams(u.hash.startsWith('#') ? u.hash.slice(1) : u.hash);

  return {
    code:         params.get('code'),
    error:        params.get('error') || hash.get('error'),
    errorDesc:    params.get('error_description') || hash.get('error_description'),
    accessToken:  hash.get('access_token'),
    refreshToken: hash.get('refresh_token'),
    type:         hash.get('type') || params.get('type'),  // 'recovery'|'signup'|'magiclink'
    rawUrl,
  };
}

// ─── Callback processing ─────────────────────────────────────────────────────
async function handleAuthCallback(rawUrl) {
  log('appUrlOpen received', rawUrl);

  const parsed = extractAuthParams(rawUrl);
  if (!parsed) {
    log('Could not parse URL — ignoring');
    return;
  }

  if (parsed.error) {
    log('Auth error in callback:', parsed.error, parsed.errorDesc);
    // Surface a friendly message via the auth state listener; don't throw.
    return;
  }

  // Close the in-app browser if it's still up
  try { await Browser.close(); } catch { /* ok if not open */ }

  // ── PKCE / code exchange flow (preferred for OAuth on native) ─────────
  if (parsed.code) {
    log('Exchanging code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(parsed.code);
    if (error) {
      log('exchangeCodeForSession failed:', error.message);
      return;
    }
    log('Session established for user', data?.user?.id ?? '(unknown)');
    return;
  }

  // ── Implicit flow / hash tokens (magic link, recovery, signup verify) ─
  if (parsed.accessToken && parsed.refreshToken) {
    log('Setting session from hash tokens (type:', parsed.type, ')');
    const { error } = await supabase.auth.setSession({
      access_token:  parsed.accessToken,
      refresh_token: parsed.refreshToken,
    });
    if (error) {
      log('setSession failed:', error.message);
      return;
    }
    log('Session set from hash tokens');
    return;
  }

  log('Callback contained no code or tokens — nothing to do');
}

// ─── Public API ──────────────────────────────────────────────────────────────
/**
 * Register the listener exactly once. Safe to call multiple times.
 * Should be invoked from main.jsx before React renders.
 */
export async function initDeepLinkHandler() {
  if (listenerRegistered) {
    log('initDeepLinkHandler called again — ignoring');
    return;
  }
  listenerRegistered = true;

  if (!IS_NATIVE) {
    log('Web platform — deep link handler not needed');
    return;
  }

  log('Registering Capacitor App.appUrlOpen listener');
  listenerHandle = await App.addListener('appUrlOpen', (event) => {
    handleAuthCallback(event?.url ?? '').catch(err => {
      log('Unhandled error in callback:', err?.message ?? String(err));
    });
  });

  // Some iOS versions deliver the launch URL via getLaunchUrl() instead of
  // appUrlOpen if the app was cold-started by the link. Check once at boot.
  try {
    const launch = await App.getLaunchUrl();
    if (launch?.url) {
      log('Cold-start launch URL detected', launch.url);
      handleAuthCallback(launch.url).catch(() => {});
    }
  } catch { /* getLaunchUrl unsupported on this platform — ok */ }
}

export async function teardownDeepLinkHandler() {
  if (listenerHandle) {
    try { await listenerHandle.remove(); } catch { /* ignore */ }
  }
  listenerHandle = null;
  listenerRegistered = false;
}
