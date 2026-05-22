// src/lib/supabase.js
// Never import this file in tests without mocking — it reads env vars at module load time.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    // Persist session in localStorage so the user stays logged in after restart
    persistSession    : true,
    autoRefreshToken  : true,
    detectSessionInUrl: true,
    storageKey        : 'sirat_auth_session',
  },
});
