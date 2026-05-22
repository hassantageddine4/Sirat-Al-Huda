// src/pages/RamadanMode.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useApp } from "../context/AppContext";
import { useRamadan } from "../hooks/useRamadan";
import { getDailyContent } from "../data/ramadanContent";
import { getCountdown, nextIftarTime, nextSuhoorTime } from "../services/ramadanService";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", emerald: "#082319",
  gold: "#C8A951", goldLight: "#D9BF7A", goldDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
  ramadanPurple: "#3D2E5C", ramadanPurpleLight: "#5C447A",
};

export default function RamadanMode() {
  const navigate = useNavigate();
  const { prayerTimes } = useApp();
  const { isRamadan, day, isLast10 } = useRamadan();
  const [countdown, setCountdown] = useState(null);
  const [target, setTarget] = useState("iftar");

  useEffect(() => {
    function tick() {
      const targetTime = target === "iftar"
        ? nextIftarTime(prayerTimes?.maghrib)
        : nextSuhoorTime(prayerTimes?.fajr);
      if (targetTime) setCountdown(getCountdown(targetTime));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, prayerTimes]);

  const content = getDailyContent(day || 1);

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Ramadan Mode" subtitle={`Day ${day || "—"} of Ramadan`} onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ padding: "16px 16px 120px" }}>
        {!isRamadan && <NotRamadanCard />}
        {isRamadan && (
          <>
            <CountdownCard countdown={countdown} target={target} setTarget={setTarget} isLast10={isLast10} />
            {isLast10 && <Last10NightsCard day={day} />}
            <DailyHadithCard hadith={content.hadith} day={day} />
            <DailyDuaCard dua={content.dua} day={day} />
            <GoalsCard />
          </>
        )}
      </div>
    </div>
  );
}

function NotRamadanCard() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`,
      borderRadius: 16, padding: "24px 22px", color: "white",
      boxShadow: "0 6px 20px rgba(15,61,46,0.18)",
    }}>
      <Icon name="moon" size={32} />
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, marginTop: 12, marginBottom: 8 }}>
        Ramadan Mode
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
        Ramadan Mode activates automatically during the blessed month of Ramadan. It will include daily hadith, daily dua, iftar and suhoor countdowns, last 10 nights focus, and Ramadan goals.
      </div>
    </div>
  );
}

function CountdownCard({ countdown, target, setTarget, isLast10 }) {
  const bg = isLast10
    ? `linear-gradient(135deg, ${C.ramadanPurple} 0%, ${C.ramadanPurpleLight} 100%)`
    : `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`;
  return (
    <div style={{
      background: bg, borderRadius: 16, padding: "20px 22px",
      color: "white", marginBottom: 16,
      boxShadow: "0 6px 20px rgba(15,61,46,0.18)",
    }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <Pill active={target === "iftar"} onClick={() => setTarget("iftar")} label="Iftar" />
        <Pill active={target === "suhoor"} onClick={() => setTarget("suhoor")} label="Suhoor" />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 6 }}>
        Time until {target === "iftar" ? "iftar" : "suhoor cutoff"}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontFamily: "Fraunces, serif" }}>
        <Digit n={countdown?.hours ?? 0} label="hr" />
        <Digit n={countdown?.minutes ?? 0} label="min" />
        <Digit n={countdown?.seconds ?? 0} label="sec" />
      </div>
    </div>
  );
}

function Pill({ active, onClick, label }) {
  return (
    <button onClick={onClick} className="press" style={{
      flex: 1, padding: "8px 14px", borderRadius: 999, border: "none",
      background: active ? "rgba(255,255,255,0.2)" : "transparent",
      color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}>{label}</button>
  );
}

function Digit({ n, label }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em" }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{label}</span>
    </div>
  );
}

function Last10NightsCard({ day }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `1.5px solid ${C.gold}`, marginBottom: 16,
      boxShadow: "0 2px 8px rgba(200,169,81,0.15)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon name="star" size={18} style={{ color: C.gold }} />
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600, color: C.goldDark, letterSpacing: "0.05em" }}>
          LAST TEN NIGHTS · Night {day - 20} of 10
        </div>
      </div>
      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>
        The Prophet ﷺ would stay awake the entire night, wake his family, and tighten his belt for worship. Laylat al-Qadr — better than 1,000 months — is in these nights, likely on the odd ones. Recite: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni."
      </div>
    </div>
  );
}

function DailyHadithCard({ hadith, day }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 12,
      boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>
        Hadith of Day {day}
      </div>
      <div style={{ fontSize: 14, color: C.body, lineHeight: 1.65, marginBottom: 10 }}>
        "{hadith.text}"
      </div>
      <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>
        {hadith.source}
      </div>
    </div>
  );
}

function DailyDuaCard({ dua, day }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 12,
      boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>
        Dua of Day {day}
      </div>
      <div style={{ fontFamily: "Amiri, serif", fontSize: 22, color: C.ink, lineHeight: 1.8, textAlign: "right", direction: "rtl", marginBottom: 10 }}>
        {dua.arabic}
      </div>
      <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 6 }}>
        {dua.transliteration}
      </div>
      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>
        {dua.translation}
      </div>
    </div>
  );
}

function GoalsCard() {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 12,
      boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>
        Ramadan Goals
      </div>
      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>
        Set targets for Qur'an pages per day, dhikr counts, and tarawih nights. Track your progress through the month.
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 10, fontStyle: "italic" }}>
        Coming soon — goal-setting integrates with the existing Goals system.
      </div>
    </div>
  );
}
