// src/pages/Register.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { register } from "../services/authService";

function getStrength(password) {
  if (!password) return null;
  return (password.length >= 8 ? 1 : 0)
       + (/[A-Z]/.test(password) ? 1 : 0)
       + (/[0-9]/.test(password) ? 1 : 0);
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Strong"];
const STRENGTH_COLORS = ["text-muted", "text-red-500", "text-amber-600", "text-green-600"];
const BAR_COLORS      = ["bg-[#E8E2D8]", "bg-red-400", "bg-amber-400", "bg-green-500"];

function PasswordStrengthBar({ password }) {
  const score = getStrength(password);
  if (!score && score !== 0) return null;
  return (
    <div className="flex items-center gap-2 mt-1.5">
      {[1,2,3].map(i => (
        <div key={i} className={`flex-1 h-1 rounded-full ${i <= score ? BAR_COLORS[score] : "bg-[#E8E2D8]"}`} />
      ))}
      <span className={`text-xs font-semibold ${STRENGTH_COLORS[score] ?? ""}`}>
        {STRENGTH_LABELS[score] ?? ""}
      </span>
    </div>
  );
}

export default function Register() {
  const navigate   = useNavigate();
  const { signIn } = useApp();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  async function handleRegister(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data, error: authError } = await register({
        name    : name.trim(),
        email   : email.trim(),
        password,
      });
      if (authError) { setError(authError); return; }
      const user = data?.user;
      if (user) signIn({
        id          : user.id,
        email       : user.email,
        name        : name.trim(),
        authProvider: "email",
      });
    } catch {
      setError("Registration failed. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(135deg, #082819, #0F3D2E)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press">
            <span className="text-white text-xl">‹</span>
          </button>
          <div className="text-center">
            <p className="text-white font-bold text-base">Create Account</p>
            <p className="text-white/55 text-xs">Join the community</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="h-6" />
      </div>

      <div className="scroll-area px-6 pt-8">
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
            <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="card p-6 mb-6">
          <div className="mb-4">
            <label className="text-body text-xs font-semibold tracking-wide mb-1.5 block">FULL NAME</label>
            <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="Ahmad Al-Rashid" autoCapitalize="words"
              className="w-full h-12 rounded-xl border-[1.5px] border-[#E8E2D8] bg-ivory px-4 text-ink text-sm focus:outline-none focus:border-primary"
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); }}}
            />
          </div>

          <div className="mb-4">
            <label className="text-body text-xs font-semibold tracking-wide mb-1.5 block">EMAIL</label>
            <input type="email" value={email} ref={emailRef}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className="w-full h-12 rounded-xl border-[1.5px] border-[#E8E2D8] bg-ivory px-4 text-ink text-sm focus:outline-none focus:border-primary"
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); passwordRef.current?.focus(); }}}
            />
          </div>

          <div className="mb-5">
            <label className="text-body text-xs font-semibold tracking-wide mb-1.5 block">PASSWORD</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} ref={passwordRef}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Min. 8 characters"
                className="w-full h-12 rounded-xl border-[1.5px] border-[#E8E2D8] bg-ivory px-4 pr-12 text-ink text-sm focus:outline-none focus:border-primary" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 press text-lg">
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#7A7268" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7A7268" strokeWidth="1.75"/>
                    <circle cx="12" cy="12" r="3" stroke="#7A7268" strokeWidth="1.75"/>
                  </svg>
                )}
              </button>
            </div>
            {!error && <PasswordStrengthBar password={password} />}
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-green press disabled:opacity-60">
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-subtle text-xs text-center mt-4">
            By registering you agree to our{" "}
            <span className="text-accent-dark font-semibold">Terms</span>
            {" "}and{" "}
            <span className="text-accent-dark font-semibold">Privacy Policy</span>.
          </p>
        </form>

        <p className="text-center text-muted text-sm pb-8">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-primary font-bold press">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
