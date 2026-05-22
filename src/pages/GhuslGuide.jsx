// src/pages/GhuslGuide.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Ghusl Guide — list of ghusl types + walkthrough for each.
//
// Routing:
//   /practice/ghusl-guide       → list view (all 10 types, grouped wājib/mustaḥabb)
//   /practice/ghusl-guide/:type → detail view (steps for one type)
//
// Branch handling:
//   • Sunni users see the Sunni method.
//   • Shia users pick between Tartībī and Irtimāsī before seeing steps.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { useBranch } from "../hooks/useBranch";
import { GHUSL_TYPES, ghuslById, ghuslsByCategory } from "../data/ghuslTypes";

const C = {
  primary: "#0F3D2E",
  emerald: "#082319",
  gold: "#C8A951",
  goldLight: "#D9BF7A",
  goldDark: "#A88730",
  ivory: "#FAF7F2",
  ink: "#1A1614",
  body: "#3A342C",
  muted: "#7A7268",
  subtle: "#B0A89E",
  hairline: "#E8E2D8",
};

export default function GhuslGuide() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { branch } = useBranch();

  if (type) {
    const ghusl = ghuslById(type);
    if (!ghusl) {
      return <NotFound onBack={() => navigate("/practice/ghusl-guide")} />;
    }
    return <GhuslDetail ghusl={ghusl} branch={branch || "sunni"} onBack={() => navigate("/practice/ghusl-guide")} />;
  }

  return <GhuslList branch={branch || "sunni"} onPick={id => navigate(`/practice/ghusl-guide/${id}`)} onBack={() => navigate("/practice")} />;
}

// ═════════════════════════════════════════════════════════════════════════════
// LIST VIEW
// ═════════════════════════════════════════════════════════════════════════════

function GhuslList({ branch, onPick, onBack }) {
  const wajib = ghuslsByCategory("wajib").filter(g => g.branches.includes(branch));
  const mustahabb = ghuslsByCategory("mustahabb").filter(g => g.branches.includes(branch));

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Ghusl Guide" onBack={onBack} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}>
        <Intro />
        <Section title="Obligatory (Wājib)" items={wajib} onPick={onPick} />
        <Section title="Recommended (Mustaḥabb)" items={mustahabb} onPick={onPick} />
        <ScholarNote />
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 20,
    }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: 8 }}>
        About Ghusl
      </div>
      <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.6 }}>
        Ghusl is the full-body ritual washing required for major ritual purification.
        Some ghusls are obligatory (wājib) — without them, prayer and other acts of
        worship are not valid. Others are highly recommended (mustaḥabb) for specific
        days and occasions.
      </div>
    </div>
  );
}

function Section({ title, items, onPick }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 11, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600,
        marginBottom: 12, paddingLeft: 4,
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(g => <GhuslCard key={g.id} ghusl={g} onPick={onPick} />)}
      </div>
    </div>
  );
}

function GhuslCard({ ghusl, onPick }) {
  const isWajib = ghusl.status === "wajib";
  return (
    <button
      className="press"
      onClick={() => onPick(ghusl.id)}
      style={{
        background: "white", borderRadius: 14, padding: "16px 18px",
        border: `1.5px solid ${isWajib ? C.gold : C.hairline}`,
        textAlign: "left", cursor: "pointer", width: "100%",
        display: "block",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink }}>
            {ghusl.name}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.goldDark, marginTop: 2 }}>
            {ghusl.arabicName}
          </div>
        </div>
        <StatusBadge status={ghusl.status} />
      </div>
      <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.5, marginTop: 8 }}>
        {ghusl.description}
      </div>
      {ghusl.genderNote && (
        <div style={{
          marginTop: 8,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          color: C.goldDark, textTransform: "uppercase",
        }}>
          {ghusl.genderNote}
        </div>
      )}
    </button>
  );
}

function StatusBadge({ status }) {
  const isWajib = status === "wajib";
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 999,
      border: `1px solid ${isWajib ? C.gold : C.subtle}`,
      color: isWajib ? C.goldDark : C.muted,
      background: isWajib ? "rgba(200, 169, 81, 0.10)" : "transparent",
      flexShrink: 0,
    }}>
      {isWajib ? "Wājib" : "Mustaḥabb"}
    </div>
  );
}

function ScholarNote() {
  return (
    <div style={{
      marginTop: 20, padding: "12px 14px",
      background: "rgba(200, 169, 81, 0.08)", borderRadius: 10,
      fontSize: 12, color: C.body, fontStyle: "italic",
      lineHeight: 1.55, textAlign: "center",
      fontFamily: "Fraunces, serif",
    }}>
      Content is drawn from authentic hadith sources and major jurisprudence
      works. For rulings specific to your situation, consult a qualified scholar.
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DETAIL VIEW
// ═════════════════════════════════════════════════════════════════════════════

function GhuslDetail({ ghusl, branch, onBack }) {
  // Method selection
  const shiaMethods = [];
  if (ghusl.methods.shiaTartibi) shiaMethods.push({ id: "tartibi", label: "Tartībī (Sequential)", steps: ghusl.methods.shiaTartibi });
  if (ghusl.methods.shiaIrtimasi) shiaMethods.push({ id: "irtimasi", label: "Irtimāsī (Immersion)", steps: ghusl.methods.shiaIrtimasi });

  const [methodId, setMethodId] = useState(shiaMethods[0]?.id || "tartibi");

  let steps = null;
  let methodLabel = null;
  if (branch === "shia") {
    if (shiaMethods.length === 0) {
      return <NotForBranch onBack={onBack} />;
    }
    const selected = shiaMethods.find(m => m.id === methodId) || shiaMethods[0];
    steps = selected.steps;
    methodLabel = selected.label;
  } else {
    if (!ghusl.methods.sunni) {
      return <NotForBranch onBack={onBack} />;
    }
    steps = ghusl.methods.sunni;
  }

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Ghusl Guide" onBack={onBack} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16, paddingBottom: 32 }}>
        <DetailHeader ghusl={ghusl} />
        {branch === "shia" && shiaMethods.length > 1 && (
          <MethodPicker methods={shiaMethods} selectedId={methodId} onSelect={setMethodId} />
        )}
        <TriggersCard ghusl={ghusl} />
        <StepsList steps={steps} branch={branch} />
        <SourcesCard sources={ghusl.sources} />
      </div>
    </div>
  );
}

function DetailHeader({ ghusl }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "18px 20px",
      border: `1.5px solid ${ghusl.status === "wajib" ? C.gold : C.hairline}`,
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
            {ghusl.name}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: C.goldDark, marginTop: 4 }}>
            {ghusl.arabicName}
          </div>
        </div>
        <StatusBadge status={ghusl.status} />
      </div>
      <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.6, marginTop: 8 }}>
        {ghusl.description}
      </div>
      {ghusl.genderNote && (
        <div style={{
          marginTop: 10,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          color: C.goldDark, textTransform: "uppercase",
        }}>
          {ghusl.genderNote}
        </div>
      )}
    </div>
  );
}

function MethodPicker({ methods, selectedId, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 11, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600,
        marginBottom: 10, paddingLeft: 4,
      }}>
        Choose Your Method
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {methods.map(m => {
          const selected = m.id === selectedId;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="press"
              style={{
                flex: 1,
                padding: "12px 10px",
                borderRadius: 10,
                border: `1.5px solid ${selected ? C.goldDark : C.hairline}`,
                background: selected ? "rgba(200, 169, 81, 0.10)" : "white",
                color: selected ? C.goldDark : C.body,
                fontFamily: "Fraunces, serif",
                fontSize: 13, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TriggersCard({ ghusl }) {
  if (!ghusl.triggers) return null;
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "14px 16px",
      border: `0.5px solid ${C.hairline}`, marginBottom: 16,
    }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600,
        marginBottom: 8,
      }}>
        When It Applies
      </div>
      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55 }}>
        {ghusl.triggers}
      </div>
    </div>
  );
}

function StepsList({ steps, branch }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 11, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600,
        marginBottom: 12, paddingLeft: 4,
      }}>
        Steps
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "14px 16px",
      border: `0.5px solid ${C.hairline}`,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: step.recitation || step.source ? 10 : 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: C.gold, color: "white",
          fontFamily: "Fraunces, serif", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {index}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 4 }}>
            {step.title}
          </div>
          <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55 }}>
            {renderInlineMarkdown(step.body)}
          </div>
        </div>
      </div>
      {step.recitation && <RecitationBox recitation={step.recitation} />}
      {step.source && (
        <div style={{
          fontFamily: "Fraunces, serif", fontSize: 11, fontStyle: "italic",
          color: C.goldDark, marginTop: 10, paddingLeft: 38,
        }}>
          {step.source}
        </div>
      )}
    </div>
  );
}

function RecitationBox({ recitation }) {
  return (
    <div style={{
      marginTop: 10, marginLeft: 38,
      padding: "12px 14px",
      background: "rgba(200, 169, 81, 0.06)",
      borderRadius: 10,
      border: `0.5px solid ${C.hairline}`,
    }}>
      <div style={{
        fontFamily: "'Amiri', 'Scheherazade New', serif",
        fontSize: 20, lineHeight: 1.8, color: C.ink,
        direction: "rtl", textAlign: "right", marginBottom: 8,
      }}>
        {recitation.arabic}
      </div>
      {recitation.transliteration && (
        <div style={{ fontSize: 12, color: C.body, fontStyle: "italic", marginBottom: 4 }}>
          {recitation.transliteration}
        </div>
      )}
      {recitation.translation && (
        <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.5 }}>
          {recitation.translation}
        </div>
      )}
    </div>
  );
}

function SourcesCard({ sources }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "14px 16px",
      border: `0.5px solid ${C.hairline}`,
    }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600,
        marginBottom: 10,
      }}>
        Hadith Sources
      </div>
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {sources.map((s, i) => (
          <li key={i} style={{
            fontFamily: "Fraunces, serif", fontSize: 12.5,
            color: C.body, lineHeight: 1.6, fontStyle: "italic", marginBottom: 4,
          }}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Utilities ──────────────────────────────────────────────────────────────

// Lightweight markdown — only handles **bold** for "For women:" / "For men:" labels.
function renderInlineMarkdown(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} style={{ color: C.goldDark, fontWeight: 600 }}>
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function NotFound({ onBack }) {
  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Ghusl Guide" onBack={onBack} />
      <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
        That ghusl type wasn't found.
      </div>
    </div>
  );
}

function NotForBranch({ onBack }) {
  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Ghusl Guide" onBack={onBack} />
      <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
        This ghusl is not applicable to your selected tradition.
      </div>
    </div>
  );
}
