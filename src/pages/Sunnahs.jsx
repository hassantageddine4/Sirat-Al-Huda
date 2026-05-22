// src/pages/Sunnahs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useBranch } from "../hooks/useBranch";
import { DAILY_SUNNAHS, SUNNAH_CATEGORIES, getSunnahPrayers } from "../data/sunnahs";

const C = {
  primary: "#0F3D2E", gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

export default function Sunnahs() {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const [tab, setTab] = useState("daily");
  const [category, setCategory] = useState("eating");

  const sunnahPrayers = getSunnahPrayers(branch);
  const filteredSunnahs = DAILY_SUNNAHS.filter(s =>
    s.category === category &&
    (!branch || !s.tradition || s.tradition === "both" || s.tradition === branch)
  );

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Sunnahs" subtitle="السُّنَن النَّبَوِيَّة" onBack={() => navigate(-1)} />
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        <Tab active={tab === "daily"} onClick={() => setTab("daily")}>Daily Sunnahs</Tab>
        <Tab active={tab === "prayers"} onClick={() => setTab("prayers")}>Sunnah Prayers</Tab>
      </div>
      <div className="scroll-area" style={{ padding: "16px" }}>
        {tab === "daily"
          ? <DailyView category={category} setCategory={setCategory} sunnahs={filteredSunnahs} />
          : <PrayersView prayers={sunnahPrayers} branch={branch} />}
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="press" style={{
      flex: 1, padding: "10px 12px", borderRadius: 999,
      background: active ? C.primary : "white",
      color: active ? "white" : C.body,
      border: `0.5px solid ${active ? C.primary : C.hairline}`,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

function DailyView({ category, setCategory, sunnahs }) {
  return (
    <>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
        {SUNNAH_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className="press" style={{
            padding: "8px 14px", borderRadius: 999, whiteSpace: "nowrap",
            background: category === cat.id ? C.primary : "white",
            color: category === cat.id ? "white" : C.body,
            border: `0.5px solid ${category === cat.id ? C.primary : C.hairline}`,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>{cat.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sunnahs.map(s => (
          <div key={s.id} style={{
            background: "white", borderRadius: 14, padding: "14px 16px",
            border: `0.5px solid ${C.hairline}`, boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
          }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 6 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55, marginBottom: 8 }}>
              {s.desc}
            </div>
            <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>{s.source}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function PrayersView({ prayers, branch }) {
  return (
    <>
      <div style={{
        background: `${C.gold}10`, border: `0.5px solid ${C.gold}40`,
        borderRadius: 12, padding: "12px 14px", marginBottom: 14,
      }}>
        <div style={{ fontSize: 12, color: C.body, lineHeight: 1.5 }}>
          {branch === "shia"
            ? "Total daily nafilah for Twelvers is 34 rakahs across the day, including Salat al-Layl."
            : "Total emphasized rawatib (sunnah mu'akkadah) is 12 rakahs daily. Asr rawatib are recommended but not strongly emphasized."}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {prayers.map(p => (
          <div key={p.id} style={{
            background: "white", borderRadius: 14, padding: "14px 16px",
            border: `0.5px solid ${C.hairline}`, boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink }}>
                {p.prayer}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>· {p.when} · {p.rakahs} rakahs</div>
            </div>
            <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999,
              background: `${C.gold}15`, border: `0.5px solid ${C.gold}40`,
              color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 8,
            }}>{p.emphasis}</div>
            <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55 }}>{p.note}</div>
          </div>
        ))}
      </div>
    </>
  );
}
