// src/pages/ScholarsBeliefs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useBranch } from "../hooks/useBranch";
import { getSchools, getBeliefs, getScholars, getFollowingRequirements } from "../data/scholarsBeliefs";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

export default function ScholarsBeliefs() {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const [tab, setTab] = useState("schools");
  const [expanded, setExpanded] = useState(null);

  const schools = getSchools(branch);
  const beliefs = getBeliefs(branch);
  const scholars = getScholars(branch);

  const requirements = getFollowingRequirements(branch);
  const items = tab === "schools" ? schools : tab === "beliefs" ? beliefs : scholars;

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Scholars & Beliefs" subtitle="العلماء والعقائد" onBack={() => navigate(-1)} />
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 6 }}>
        <Tab active={tab === "schools"} onClick={() => { setTab("schools"); setExpanded(null); }}>Schools</Tab>
        <Tab active={tab === "beliefs"} onClick={() => { setTab("beliefs"); setExpanded(null); }}>Beliefs</Tab>
        <Tab active={tab === "scholars"} onClick={() => { setTab("scholars"); setExpanded(null); }}>Scholars</Tab>
      </div>
      <div className="scroll-area" style={{ padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tab === "scholars" && <RequirementsCard data={requirements} />}
          {items.map(item => (
            <Card key={item.id} item={item} tab={tab} expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="press" style={{
      flex: 1, padding: "10px 8px", borderRadius: 999,
      background: active ? C.primary : "white",
      color: active ? "white" : C.body,
      border: `0.5px solid ${active ? C.primary : C.hairline}`,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

function Card({ item, tab, expanded, onToggle }) {
  const title = item.name || item.title;
  const arabic = item.arabicName || "";
  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: `0.5px solid ${C.hairline}`,
      boxShadow: "0 2px 8px rgba(10,8,6,0.04)",
      overflow: "hidden",
    }}>
      <button onClick={onToggle} className="press" style={{
        width: "100%", textAlign: "left", padding: "14px 16px",
        background: "transparent", border: "none", cursor: "pointer",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: arabic ? 2 : 4 }}>{title}</div>
          {arabic && <div style={{ fontFamily: "Amiri, serif", fontSize: 14, color: C.muted, marginBottom: 4 }}>{arabic}</div>}
          {!expanded && (item.desc || item.bio || item.methodology) && (
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
              {(item.desc || item.bio || item.methodology).slice(0, 140)}...
            </div>
          )}
        </div>
        <Icon name={expanded ? "arrowUp" : "arrowDown"} size={16} />
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {item.lifespan && <Field label="Lifespan" value={item.lifespan} />}
          {item.founder && <Field label="Founder" value={item.founder} />}
          {item.region && <Field label="Region" value={item.region} />}
          {item.school && <Field label="School" value={item.school} />}
          {item.bio && <Field label="Biography" value={item.bio} />}
          {item.methodology && <Field label="Methodology" value={item.methodology} />}
          {item.sources && <Field label="Sources of Law" value={item.sources} />}
          {item.works && <Field label="Notable Works" value={item.works} />}
          {item.positions && <Field label="Key Positions" value={item.positions} />}
          {item.rulings && <Field label="Notable Rulings" value={item.rulings} />}
          {item.distinctive && <Field label="Distinctive Practices" value={item.distinctive} />}
          {item.population && <Field label="Population" value={item.population} />}
          {item.detail && <Field label="Detail" value={item.detail} />}
          {item.source && <Field label="Source" value={item.source} accent />}
          {item.website && (
            <Field label="Website" value={item.website} link />
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, accent, link }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: accent ? C.gold : C.primary, textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer"
           style={{ fontSize: 13, color: C.gold, textDecoration: "underline", wordBreak: "break-all" }}>
          {value}
        </a>
      ) : (
        <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55 }}>{value}</div>
      )}
    </div>
  );
}

function RequirementsCard({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`,
      borderRadius: 16, padding: "16px 18px", color: "white",
      boxShadow: "0 6px 20px rgba(15,61,46,0.18)", marginBottom: 4,
    }}>
      <button onClick={() => setOpen(!open)} className="press" style={{
        width: "100%", textAlign: "left", background: "transparent",
        border: "none", color: "white", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10, padding: 0,
      }}>
        <Icon name="scales" size={20} />
        <div style={{ flex: 1, fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500 }}>
          {data.title}
        </div>
        <Icon name={open ? "arrowUp" : "arrowDown"} size={16} />
      </button>
      {open && (
        <>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55, marginTop: 12, marginBottom: 14 }}>
            {data.intro}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.requirements.map(r => (
              <div key={r.num} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: 999,
                  background: C.gold, color: C.primary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>{r.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gold, marginBottom: 3 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
                    {r.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
