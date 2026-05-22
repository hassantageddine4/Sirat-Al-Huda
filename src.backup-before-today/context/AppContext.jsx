// src/context/AppContext.jsx
// Auth state is driven by Supabase's onAuthStateChange listener.
// localStorage is only used for onboarding preferences (non-sensitive).

import React, {
  createContext, useContext, useState, useEffect, useCallback
} from "react";
import { supabase }           from "../lib/supabase";
import { logout, updateProfile as updateSupabaseProfile } from "../services/authService";

const PREF_KEY = "sirat_prefs"; // stores language, religion, goals only

const INITIAL_PROFILE = {
  id          : null,
  name        : null,
  email       : null,
  authProvider: null,
  language    : "English",
  religion    : "Muslim",
  goals       : [],
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isFirstLaunch,   setIsFirstLaunch]   = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile,     setUserProfile]     = useState(INITIAL_PROFILE);
  const [isRestoring,     setIsRestoring]     = useState(true);

  // ── Restore onboarding prefs from localStorage ──────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) {
        const prefs = JSON.parse(raw);
        setIsFirstLaunch(false);
        setUserProfile(prev => ({ ...prev, ...prefs }));
      }
    } catch { /* ignore parse errors */ }
  }, []);

  // ── Listen to Supabase Auth state ────────────────────────────────────────
  useEffect(() => {
    // getSession() resolves immediately from the persisted JWT in localStorage.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        applySession(session.user);
      }
      setIsRestoring(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          applySession(session.user);
        }
        if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserProfile(prev => ({
            ...INITIAL_PROFILE,
            language: prev.language,
            religion: prev.religion ?? "Muslim",
            goals   : prev.goals,
          }));
        }
        if (event === "TOKEN_REFRESHED" && session?.user) {
          applySession(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  function applySession(user) {
    setIsAuthenticated(true);
    setUserProfile(prev => ({
      ...prev,
      id          : user.id,
      email       : user.email,
      name        : user.user_metadata?.name ?? prev.name,
      authProvider: user.app_metadata?.provider ?? "email",
    }));
  }

  // ── Onboarding ────────────────────────────────────────────────────────────
  const completeOnboarding = useCallback((preferences) => {
    const prefs = {
      language: preferences.language ?? "English",
      religion: preferences.religion ?? "Muslim",
      goals   : preferences.goals    ?? [],
    };
    setIsFirstLaunch(false);
    setUserProfile(prev => ({ ...prev, ...prefs }));
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  }, []);

  // ── signIn — called by Auth/Login/Register pages after successful auth ────
  // Supabase's onAuthStateChange handles the state update automatically,
  // but we expose this for pages that want to immediately reflect name, etc.
  const signIn = useCallback((authData) => {
    setUserProfile(prev => ({ ...prev, ...authData }));
    setIsAuthenticated(true);
  }, []);

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const { error } = await logout();
    if (error) console.warn("[AppContext] signOut error:", error);
    // onAuthStateChange SIGNED_OUT fires and clears the state automatically.
  }, []);

  // ── updateProfile ─────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (fields) => {
    // Update local state immediately for a snappy UI.
    setUserProfile(prev => ({ ...prev, ...fields }));

    // Persist non-sensitive prefs locally.
    const prefsFields = {};
    if (fields.language !== undefined) prefsFields.language = fields.language;
    if (fields.religion !== undefined) prefsFields.religion = fields.religion ?? "Muslim";
    if (fields.goals    !== undefined) prefsFields.goals    = fields.goals;
    if (Object.keys(prefsFields).length > 0) {
      try {
        const existing = JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}");
        localStorage.setItem(PREF_KEY, JSON.stringify({ ...existing, ...prefsFields }));
      } catch { /* ignore */ }
    }

    // Persist to Supabase if the user is authenticated.
    if (isAuthenticated) {
      const { error } = await updateSupabaseProfile(fields);
      if (error) console.warn("[AppContext] updateProfile error:", error);
    }
  }, [isAuthenticated]);

  return (
    <AppContext.Provider value={{
      isFirstLaunch,
      isAuthenticated,
      isRestoring,
      userProfile,
      completeOnboarding,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
