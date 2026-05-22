// src/pages/Sins.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useBranch } from "../hooks/useBranch";
import { getMajorSins, getMinorSins } from "../data/sins";

const C = {
  primary: "#0F3D2E", gold: "#C8A951", goldLight: "#D9BF7A",
  red: "#A63D2A", redLight: "#C85A45",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

export default function Sins() {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const [tab, setTab] = useState("major");
  const [expanded, setExpanded] = useState(null);

  const majorSins = getMajorSins(branch);
  const minorSins = getMinorSins(branch);
  const sins = tab === "major" ? majorSins : minorSins;

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Major & Minor Sins" subtitle="الكَبَائِر وَالصَّغَائِر" onBack={() => navigate(-1)} />
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        <Tab active={tab === "major"} onClick={() => { setTab("major"); setExpanded(null); }}>Major Sins</Tab>
        <Tab active={tab === "minor"} onClick={() => { setTab("minor"); setExpanded(null); }}>Minor Sins</Tab>
      </div>
      <div className="scroll-area" style={{ padding: "16px" }}>
        <IntroBanner tab={tab} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sins.map(s => <SinCard key={s.id} sin={s} expanded={expanded === s.id} onToggle={() => setExpanded(expanded === s.id ? null : s.id)} />)}
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="press" style={{
      flex: 1, padding: "10px 12px", borderRadius: 999,
      background: active ? C.red : "white",
      color: active ? "white" : C.body,
      border: `0.5px solid ${active ? C.red : C.hairline}`,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

function IntroBanner({ tab }) {
  const text = tab === "major"
    ? "Major sins (Kaba'ir) are those for which Allah has prescribed a punishment, threatened Hellfire, or whose perpetrator is cursed in the Qur'an or Sunnah. They require sincere tawbah."
    : "Minor sins (Saghair) accumulate and can become major sins through persistence. The Prophet ﷺ warned: 'Beware of trivial sins — they are like a people who camped in a valley and each gathered one stick until they could cook their meal.'";
  return (
    <div style={{
      background: `${C.red}10`, border: `0.5px solid ${C.red}30`,
      borderRadius: 12, padding: "12px 14px", marginBottom: 14,
    }}>
      <div style={{ fontSize: 12, color: C.body, lineHeight: 1.55 }}>{text}</div>
    </div>
  );
}

function SinCard({ sin, expanded, onToggle }) {
  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: `0.5px solid ${C.hairline}`, boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
      overflow: "hidden",
    }}>
      <button onClick={onToggle} className="press" style={{
        width: "100%", textAlign: "left", padding: "14px 16px",
        background: "transparent", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 4 }}>
            {sin.title}
          </div>
          {!expanded && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{sin.desc}</div>}
        </div>
        <Icon name={expanded ? "arrowUp" : "arrowDown"} size={16} />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6, marginBottom: 14 }}>
            {sin.desc}
          </div>
          <div style={{
            background: C.ivory, borderRadius: 10, padding: "12px 14px",
            border: `0.5px solid ${C.hairline}`, marginBottom: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gold, textTransform: "uppercase", marginBottom: 6 }}>
              Qur'an · {sin.quran.ref}
            </div>
            <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55, fontStyle: "italic" }}>
              "{sin.quran.text}"
            </div>
          </div>
          <div style={{
            background: C.ivory, borderRadius: 10, padding: "12px 14px",
            border: `0.5px solid ${C.hairline}`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.primary, textTransform: "uppercase", marginBottom: 6 }}>
              Hadith · {sin.hadith.source}
            </div>
            <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55, fontStyle: "italic" }}>
              "{sin.hadith.text}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
