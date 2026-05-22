// src/pages/Auth.jsx
import Icon from "../components/common/Icon";
// Apple Sign In requires the Capacitor @capacitor-community/apple-sign-in plugin on device.
// Google OAuth uses Supabase's browser redirect flow (works in Capacitor with a custom scheme).
// Both flows complete via the onAuthStateChange listener in AppContext — no manual signIn() needed.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error,   setError]   = useState(null);

  async function handleGoogle() {
    setLoading("google");
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options : {
          // For Capacitor, use your app's custom URL scheme.
          // e.g. "com.sirat.app://auth/callback"
          // For web dev, redirectTo can be omitted or set to window.location.origin.
          redirectTo: window.location.origin,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handleApple() {
    setLoading("apple");
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options : {
          redirectTo: window.location.origin,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Apple sign-in failed. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="screen" style={{ background: "linear-gradient(160deg, #04100A 0%, #0F3D2E 60%, #1A5C44 100%)" }}>
      <div className="absolute w-96 h-96 rounded-full bg-accent/5 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-primary-light/15 bottom-0 right-0 pointer-events-none" />

      {/* Brand */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-full border border-accent/60 bg-accent/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z"
                fill="#C8A951" opacity="0.9"/>
            </svg>
          </div>
        </div>
        <h1 className="text-white text-4xl font-black tracking-[0.5em] mb-1">SIRAT</h1>
        <p className="text-white/38 text-xs tracking-[0.2em] font-medium">THE STRAIGHT PATH</p>
      </div>

      {/* Auth card */}
      <div className="flex-shrink-0 bg-white rounded-t-[2rem] px-6 pt-3 pb-safe">
        <div className="w-9 h-1 rounded-full bg-parchment mx-auto mb-6" />

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <span className="text-red-500 flex-shrink-0"><Icon name="warning" size={16} /></span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <h2 className="text-ink text-2xl font-bold mb-1">Continue Your Journey</h2>
        <p className="text-muted text-sm mb-6 leading-relaxed">
          Sign in to save your progress and personalize your experience.
        </p>

        {/* Apple */}
        <button onClick={handleApple} disabled={!!loading}
          className="w-full h-14 rounded-2xl bg-black text-white font-semibold text-[15px] flex items-center justify-center gap-3 mb-3 press shadow-md disabled:opacity-60">
          {loading === "apple" ? (
            <span className="text-white/60 text-sm">Signing in...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              Sign in with Apple
            </>
          )}
        </button>

        {/* Google */}
        <button onClick={handleGoogle} disabled={!!loading}
          className="w-full h-14 rounded-2xl bg-white text-ink font-semibold text-[15px] flex items-center justify-center gap-3 mb-4 press border-[1.5px] border-[#E8E2D8] shadow-sm disabled:opacity-60">
          {loading === "google" ? (
            <span className="text-muted text-sm">Signing in...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E8E2D8]" />
          <span className="text-subtle text-sm font-semibold">or</span>
          <div className="flex-1 h-px bg-[#E8E2D8]" />
        </div>

        <button onClick={() => navigate("/login")}
          className="w-full h-14 rounded-2xl border-[1.5px] border-primary text-primary font-bold text-[15px] press mb-4">
          Continue with Email
        </button>

        <p className="text-center text-muted text-sm mb-4">
          New to Sirat?{" "}
          <button onClick={() => navigate("/register")} className="text-primary font-bold press">
            Create account
          </button>
        </p>

        <p className="text-subtle text-xs text-center">
          By continuing you agree to our{" "}
          <span className="text-accent-dark font-semibold">Terms</span>
          {" "}and{" "}
          <span className="text-accent-dark font-semibold">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
