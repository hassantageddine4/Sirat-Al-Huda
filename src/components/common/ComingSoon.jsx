// src/components/common/ComingSoon.jsx
import React from "react";
import Icon from "./Icon";

const C = {
  primary: "#0F3D2E", gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", muted: "#7A7268", hairline: "#E8E2D8",
};

export default function ComingSoon({ title, description, icon = "sparkle" }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "32px 24px",
      border: `0.5px solid ${C.hairline}`, textAlign: "center",
      boxShadow: "0 4px 14px rgba(10,8,6,0.05)",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 999,
        background: `linear-gradient(135deg, ${C.gold}15, ${C.primary}10)`,
        color: C.gold, margin: "0 auto 16px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `0.5px solid ${C.gold}30`,
      }}>
        <Icon name={icon} size={28} />
      </div>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500,
        color: C.ink, letterSpacing: "-0.01em", marginBottom: 6,
      }}>{title || "Coming soon"}</div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, maxWidth: 280, margin: "0 auto" }}>
        {description || "We're working on this — check back soon."}
      </div>
      <div style={{
        marginTop: 16, display: "inline-block",
        padding: "6px 14px", borderRadius: 999,
        background: `${C.gold}15`, border: `0.5px solid ${C.gold}40`,
        color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      }}>In development</div>
    </div>
  );
}
