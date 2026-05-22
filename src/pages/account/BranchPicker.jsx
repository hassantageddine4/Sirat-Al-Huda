// src/pages/account/BranchPicker.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";
import { useBranch } from "../../hooks/useBranch";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

const OPTIONS = [
  { id: "sunni", label: "Sunni", description: "Follows the Sunnah of the Prophet ﷺ and the consensus of his companions. Hadith from the six canonical collections (Kutub al-Sittah)." },
  { id: "shia", label: "Shia", description: "Twelver tradition (Ithna Ashari). Hadith from the Four Books and Nahj al-Balagha. Recognizes the Imamate of the Ahlul Bayt." },
];

export default function BranchPicker() {
  const navigate = useNavigate();
  const { branch, setBranch } = useBranch();

  function choose(id) {
    setBranch(id);
    setTimeout(() => navigate(-1), 200);
  }

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Branch" subtitle="Tradition for hadith, prayer, and practices" onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {OPTIONS.map(o => <Option key={o.id} option={o} active={branch === o.id} onTap={() => choose(o.id)} />)}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 18, padding: "0 6px", lineHeight: 1.55 }}>
          Your choice tailors hadith collections, prayer rituals, and other practices throughout the app. You can change this any time.
        </div>
      </div>
    </div>
  );
}

function Option({ option, active, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      width: "100%", textAlign: "left", background: "white",
      borderRadius: 16, padding: "18px 20px",
      border: `1.5px solid ${active ? C.primary : C.hairline}`,
      boxShadow: active ? "0 4px 14px rgba(15,61,46,0.12)" : "0 2px 8px rgba(10,8,6,0.04)",
      display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 999, flexShrink: 0, marginTop: 2,
        background: active ? C.primary : "transparent",
        border: `2px solid ${active ? C.primary : C.hairline}`,
        display: "flex", alignItems: "center", justifyContent: "center", color: "white",
      }}>{active && <Icon name="check" size={14} />}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
          {option.label}
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
          {option.description}
        </div>
      </div>
    </button>
  );
}
