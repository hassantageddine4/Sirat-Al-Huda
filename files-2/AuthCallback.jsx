// src/pages/AuthCallback.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Handles the /auth/callback route on web AND native (when the deep-link
// handler navigates to it after processing). Shows a clean loading state
// instead of a white screen while the session is being established.
//
// On native, the deep-link handler in deepLinkHandler.js does the actual
// session work — this page just shows the spinner and waits for the auth
// state listener in AppContext to fire SIGNED_IN.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError]   = useState(null);
  const [stage, setStage]   = useState("verifying");  // verifying | redirecting | error

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // On web, supabase-js processes the URL automatically when
        // detectSessionInUrl is true. We just need to wait briefly.
        // On native, deepLinkHandler has already exchanged the code.
        const url = typeof window !== "undefined" ? window.location.href : "";
        const hasCode = url.includes("code=") || url.includes("access_token=");

        if (hasCode) {
          // Give supabase-js a beat to finish detecting the session
          await new Promise(r => setTimeout(r, 400));
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (cancelled) return;

        if (sessionError) {
          setError(sessionError.message);
          setStage("error");
          return;
        }

        setStage("redirecting");
        // Tiny delay so the user sees the "Signed in" flash, not just a flicker
        setTimeout(() => {
          if (cancelled) return;
          if (data?.session) navigate("/", { replace: true });
          else                navigate("/auth", { replace: true });
        }, 600);

      } catch (err) {
        if (cancelled) return;
        setError(err?.message ?? "Sign-in failed.");
        setStage("error");
      }
    }
    run();

    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="screen flex items-center justify-center bg-ivory">
      <div className="text-center px-8 max-w-sm">
        {stage !== "error" && (
          <>
            <div className="w-12 h-12 mx-auto mb-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
            <p className="text-primary font-bold text-base mb-1">
              {stage === "verifying" ? "Verifying your account…" : "Welcome back"}
            </p>
            <p className="text-muted text-sm">
              {stage === "verifying"
                ? "Just a moment while we sign you in."
                : "Redirecting…"}
            </p>
          </>
        )}

        {stage === "error" && (
          <>
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-ink font-bold text-base mb-2">Sign-in failed</p>
            <p className="text-muted text-sm mb-5">{error}</p>
            <button
              onClick={() => navigate("/auth", { replace: true })}
              className="press px-5 py-2.5 rounded-full bg-accent text-primary font-bold text-sm">
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
