// src/pages/Practice.jsx
// Practice — emerald + gold flat-icon grid with Recommended + Reflection cards
import React from "react";
import { useBranch } from "../hooks/useBranch";
import { useNavigate } from "react-router-dom";
import RecommendedCard from "../components/home/RecommendedCard";
import InsightCard from "../components/home/InsightCard";
import SwipeCarousel from "../components/home/SwipeCarousel";
import Icon from "../components/common/Icon";

const SCHOLAR_URL = "https://imam-us.org";
function openScholar() {
  if (typeof window !== "undefined") window.open(SCHOLAR_URL, "_blank", "noopener,noreferrer");
}

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", emerald: "#082319",
  gold: "#C8A951", goldLight: "#D9BF7A", goldDark: "#A88730",
  ivory: "#FAF7F2",
};

const ESSENTIALS = [
  { title: "Prayer Guide",      icon: "mihrab",     to: "/practice/prayer-guide", tone: "gold" },
  { title: "Wudu Guide",        icon: "droplet",    to: "/practice/wudu-guide",   tone: "goldDeep" },
  { title: "Ghusl Guide",       icon: "sunrise",    to: "/practice/ghusl-guide",  tone: "goldBright" },
  { title: "Daily Duas",        icon: "duaBook",    to: "/practice/duas",         tone: "goldCream" },
  { title: "Qibla Compass",     icon: "kaaba",      to: "/qibla",                 tone: "goldBright" },
  { title: "Dhikr Counter",     icon: "beads",      to: "/dhikr",                 tone: "goldBronze" },
  { title: "Ask Sirat",        icon: "message",    to: "/practice/ask",         tone: "gold" },
  { title: "Sunnahs",          icon: "star",    to: "/practice/sunnahs",      tone: "goldBright" },
  { title: "Daily Routine",     icon: "checklist",  to: "/routine",               tone: "gold" },
  { title: "Goals",             icon: "checkCircle",to: "/goals",                 tone: "goldCream" },
  { title: "Recitation Practice", icon: "waveform", to: "/practice/recitation",   tone: "goldDeep" },
];

const KNOWLEDGE = [
  { title: "Islam Basics",      icon: "bookOpen",   to: "/practice/basics",       tone: "goldBright" },
  { title: "Hadith Collection", icon: "scroll",     to: "/hadith",                tone: "gold" },
  { title: "99 Names of Allah", icon: "tasbih",     to: "/practice/names",        tone: "goldCream" },
  { title: "Prophets & Imams",  icon: "users",      to: "/practice/prophets",     tone: "goldDeep" },
  { title: "Scholars & Beliefs", icon: "book",       to: "/practice/scholars",     tone: "gold" },
  { title: "Major & Minor Sins", icon: "warning",    to: "/practice/sins",         tone: "goldDeep" },
  { title: "Rights in Islam",   icon: "scales",     to: "/practice/rights",       tone: "gold" },
  { title: "Ramadan Mode",      icon: "moon",       to: "/ramadan",              tone: "primary" },
  { title: "Islamic Calendar",  icon: "calendar",   to: "/calendar",              tone: "goldBronze" },
  { title: "Ask a Scholar",     icon: "message",    external: true,               tone: "goldBright" },
];

const TONES = {
  gold:        { bg: "linear-gradient(135deg, #D4B560 0%, #A88730 100%)" },
  goldBright:  { bg: "linear-gradient(135deg, #E8C77A 0%, #C8A951 100%)" },
  goldDeep:    { bg: "linear-gradient(135deg, #B89548 0%, #8C6A3D 100%)" },
  goldCream:   { bg: "linear-gradient(135deg, #F2E4BA 0%, #C8A951 100%)" },
  goldBronze:  { bg: "linear-gradient(135deg, #A88730 0%, #6B5220 100%)" },
};

export default function Practice() {
  const { branch } = useBranch();
  const knowledge = KNOWLEDGE.map(t => t.title === "Prophets & Imams" && branch === "sunni" ? { ...t, title: "Prophets" } : t);
  const navigate = useNavigate();

  function handleTap(m) {
    if (m.external) { openScholar(); return; }
    if (m.to) { navigate(m.to); return; }
  }

  return (
    <div className="screen" style={{
      background: `
        radial-gradient(900px 500px at 80% -10%, rgba(200,169,81,0.22), transparent 60%),
        radial-gradient(700px 500px at -10% 30%, rgba(45,125,95,0.45), transparent 65%),
        linear-gradient(180deg, ${C.primary} 0%, ${C.emerald} 100%)`,
      minHeight: "100vh", position: "relative",
    }}>
      <PatternOverlay />
      <Header />
      <div className="scroll-area" style={{ position: "relative", zIndex: 2, paddingTop: 8, paddingLeft: 16, paddingRight: 16 }}>
        <SwipeCarousel>
          <RecommendedCard />
          <InsightCard />
        </SwipeCarousel>

        <SectionLabel>Daily essentials</SectionLabel>
        <Grid items={ESSENTIALS} onTap={handleTap} />

        <SectionLabel>Knowledge</SectionLabel>
        <Grid items={knowledge} onTap={handleTap} />
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex-shrink-0 pt-safe" style={{ position: "relative", zIndex: 2 }}>
      <div style={{ padding: "12px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 38 }} />
        <h1 style={{ margin: 0, color: C.ivory, fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>Practice</h1>
        <button onClick={() => navigate("/settings")} className="press" style={{
          width: 38, height: 38, borderRadius: 999,
          background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.12)",
          color: C.ivory, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="settings" size={18} />
        </button>
      </div>
    </div>
  );
}

function PatternOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='none' stroke='%23C8A951' stroke-width='0.8'><path d='M80 10 L150 80 L80 150 L10 80 Z'/><path d='M80 40 L120 80 L80 120 L40 80 Z'/><circle cx='80' cy='80' r='28'/></g></svg>")`,
      backgroundSize: "220px 220px",
    }} />
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "Fraunces, serif", fontSize: 11.5, fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.22em", color: C.goldLight,
      padding: "24px 6px 10px", display: "flex", alignItems: "center", gap: 10,
    }}>
      <span>{children}</span>
      <span style={{ flex: 1, height: 0.5, background: "linear-gradient(90deg, rgba(200,169,81,0.4), rgba(200,169,81,0))" }} />
    </div>
  );
}

function Grid({ items, onTap }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "22px 8px", padding: "8px 4px 4px" }}>
      {items.map(m => <Tile key={m.title} module={m} onTap={() => onTap(m)} />)}
    </div>
  );
}

function Tile({ module: m, onTap }) {
  const tone = TONES[m.tone] || TONES.gold;
  return (
    <button onClick={onTap} className="press" style={{
      background: "transparent", border: "none", padding: 0, cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    }}>
      <div style={{
        width: 68, height: 68, borderRadius: 999, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: tone.bg, color: "#1A1614",
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.22), 0 10px 22px rgba(168,135,48,0.35)",
      }}>
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%), linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(120,80,20,0.35) 100%)",
        }} />
        <Icon name={m.icon} size={30} strokeWidth={1.7} />
      </div>
      <div style={{
        fontFamily: "Inter, sans-serif", fontSize: 11.5, lineHeight: 1.25,
        color: C.ivory, textAlign: "center", maxWidth: 80, fontWeight: 500, letterSpacing: "-0.01em",
      }}>{m.title}</div>
    </button>
  );
}
