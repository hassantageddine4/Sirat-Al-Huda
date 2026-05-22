// src/pages/Adhkar.jsx
// Post-Prayer Adhkar — per-prayer counter for SubhanAllah / Alhamdulillah / Allahu Akbar.
// Accessed via /practice/adhkar?prayer=Fajr or from Home button.

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBranch } from "../hooks/useBranch";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { getSession, incrementCounter, resetSession, TARGETS_PUBLIC } from "../services/adhkarService";

const C = {
  primary:      "#0F3D2E",
  primaryLight: "#1A5C44",
  primaryDark:  "#082819",
  accent:       "#C8A951",
  accentDark:   "#A88730",
  accentLight:  "#D9BF7A",
  ivory:        "#FAF7F2",
  ink:          "#1C1814",
  muted:        "#7A7268",
  subtle:       "#A09890",
};

const COUNTERS_SUNNI = [
  { key: "subhanAllah",   arabic: "سُبْحَانَ اللَّهِ",  trans: "SubhanAllah",   target: 33 },
  { key: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ",   trans: "Alhamdulillah", target: 33 },
  { key: "allahuAkbar",   arabic: "اللَّهُ أَكْبَرُ",     trans: "Allahu Akbar",  target: 34 },
];

const COUNTERS_SHIA = [
  { key: "allahuAkbar",   arabic: "اللَّهُ أَكْبَرُ",     trans: "Allahu Akbar",  target: 34 },
  { key: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ",   trans: "Alhamdulillah", target: 33 },
  { key: "subhanAllah",   arabic: "سُبْحَانَ اللَّهِ",  trans: "SubhanAllah",   target: 33 },
];

export default function Adhkar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prayerName = searchParams.get("prayer") || "General";
  const { branch } = useBranch();
  const COUNTERS = branch === "shia" ? COUNTERS_SHIA : COUNTERS_SUNNI;

  const [session, setSession] = useState(() => getSession(prayerName));

  useEffect(() => {
    setSession(getSession(prayerName));
  }, [prayerName]);

  const handleTap = useCallback((key) => {
    try { Haptics.impact({ style: ImpactStyle.Light }); } catch {}
    const updated = incrementCounter(prayerName, key);
    setSession(updated);
  }, [prayerName]);

  const handleReset = useCallback(() => {
    if (window.confirm(`Reset adhkar for ${prayerName}?`)) {
      resetSession(prayerName);
      setSession(getSession(prayerName));
    }
  }, [prayerName]);

  const allDone = session.completed;
  return (
    <div style={{ minHeight: "100vh", background: C.ivory, paddingBottom: 100 }}>
      <ScreenHeader title={`${prayerName} · Tasbīḥāt`} onBack={() => navigate(-1)} />
      <div style={{ padding: "8px 18px 24px" }}>
        {allDone && (
          <div style={{ marginBottom: 18, padding: "14px 16px", borderRadius: 14, background: "linear-gradient(135deg, #1B5E48 0%, #2D7D5F 100%)", color: "white", fontFamily: "Fraunces, serif", fontSize: 15, letterSpacing: "-0.01em", boxShadow: "0 4px 14px rgba(15,61,46,0.18)" }}>
            Tasbīḥāt complete for {prayerName}. Taqabbal Allāh.
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {COUNTERS.map((c) => {
            const count = session[c.key] || 0;
            const done = count >= c.target;
            const pct = Math.min(100, (count / c.target) * 100);
            return (
              <button key={c.key} onClick={() => handleTap(c.key)} disabled={done} className="w-full text-left transition-transform active:scale-[0.985]"
                style={{ background: "white", border: done ? `1px solid ${C.primaryLight}` : "0.5px solid #E8E2D8", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 14px rgba(10,8,6,0.05)", opacity: done ? 0.78 : 1, cursor: done ? "default" : "pointer" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontFamily: "Amiri, serif", fontSize: 26, color: C.ink, direction: "rtl" }}>{c.arabic}</div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: done ? C.primary : C.ink, letterSpacing: "-0.02em" }}>{count}<span style={{ color: C.subtle, fontSize: 16 }}> / {c.target}</span></div>
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: C.muted, letterSpacing: "0.01em" }}>{c.trans}</div>
                <div style={{ marginTop: 12, height: 4, borderRadius: 3, background: "#F0EAE0", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: done ? C.primary : "linear-gradient(90deg, #1B5E48, #2D7D5F)", transition: "width 200ms ease" }} />
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={handleReset} style={{ marginTop: 22, width: "100%", padding: "14px", borderRadius: 14, border: "0.5px solid #E8E2D8", background: "transparent", color: C.muted, fontFamily: "Fraunces, serif", fontSize: 14, letterSpacing: "0.01em", cursor: "pointer" }}>
          Reset {prayerName}
        </button>
      </div>
    </div>
  );
}
