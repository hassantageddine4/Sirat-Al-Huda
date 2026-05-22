// src/pages/Rights.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Men's and Women's Rights in Islam.
//
// Routing:
//   /practice/rights        → list of topics
//   /practice/rights/:id    → detail page for one topic
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import { RIGHTS_TOPICS, rightById } from "../data/rightsData";

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

const AUDIENCE_LABEL = {
  both: "Both",
  women: "Women",
  men: "Men",
  parents: "Parents",
  children: "Children",
  all: "All",
};

export default function Rights() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    const topic = rightById(id);
    if (!topic) return <NotFound onBack={() => navigate("/practice/rights")} />;
    return <Detail topic={topic} onBack={() => navigate("/practice/rights")} />;
  }
  return <List onPick={tid => navigate(`/practice/rights/${tid}`)} onBack={() => navigate("/practice")} />;
}

// ═════════════════════════════════════════════════════════════════════════════
// LIST
// ═════════════════════════════════════════════════════════════════════════════

function List({ onPick, onBack }) {
  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Rights in Islam" onBack={onBack} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}>
        <Intro />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RIGHTS_TOPICS.map(t => <TopicCard key={t.id} topic={t} onPick={onPick} />)}
        </div>
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
        Rights in Islam
      </div>
      <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.6 }}>
        Islam establishes explicit rights for men, women, children, parents,
        workers, neighbours, and the community. These rights are not optional —
        they are obligations rooted in the Qur'an and the sunnah of the Prophet ﷺ
        and the Ahl al-Bayt (ʿa). Where Sunni and Shia rulings differ
        substantively, the differences are noted in each section.
      </div>
    </div>
  );
}

function TopicCard({ topic, onPick }) {
  return (
    <button
      className="press"
      onClick={() => onPick(topic.id)}
      style={{
        background: "white", borderRadius: 14, padding: "16px 18px",
        border: `1.5px solid ${C.hairline}`,
        textAlign: "left", cursor: "pointer", width: "100%",
        display: "block",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink }}>
            {topic.name}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.goldDark, marginTop: 2 }}>
            {topic.arabicName}
          </div>
        </div>
        <SectionCountBadge count={topic.sections.length} />
      </div>
      <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.5, marginTop: 8 }}>
        {topic.description}
      </div>
    </button>
  );
}

function SectionCountBadge({ count }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      color: C.muted,
      flexShrink: 0,
    }}>
      {count} sections
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
      Content drawn from the Qur'an and major Sunni and Shia hadith corpora.
      For rulings specific to your situation, consult a qualified scholar.
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DETAIL
// ═════════════════════════════════════════════════════════════════════════════

function Detail({ topic, onBack }) {
  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Rights in Islam" onBack={onBack} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16, paddingBottom: 32 }}>
        <TopicHeader topic={topic} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {topic.sections.map((s, i) => <SectionCard key={i} section={s} index={i + 1} />)}
        </div>
      </div>
    </div>
  );
}

function TopicHeader({ topic }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "18px 20px",
      border: `1.5px solid ${C.gold}`, marginBottom: 16,
    }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
        {topic.name}
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: C.goldDark, marginTop: 4 }}>
        {topic.arabicName}
      </div>
      <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.6, marginTop: 10 }}>
        {topic.description}
      </div>
    </div>
  );
}

function SectionCard({ section, index }) {
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "16px 18px",
      border: `0.5px solid ${C.hairline}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Fraunces, serif", fontSize: 11, color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 4,
          }}>
            Section {index}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink, lineHeight: 1.35 }}>
            {section.title}
          </div>
        </div>
        {section.audience && section.audience !== "both" && <AudienceTag audience={section.audience} />}
      </div>
      <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.65, marginBottom: 14 }}>
        {section.content}
      </div>
      {section.citations && section.citations.length > 0 && (
        <CitationsList citations={section.citations} />
      )}
      {section.shiaSunniNote && (
        <NoteBox label="Sunni vs Shia" text={section.shiaSunniNote} />
      )}
    </div>
  );
}

function AudienceTag({ audience }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 999,
      border: `1px solid ${C.goldDark}`,
      color: C.goldDark, background: "rgba(168, 135, 48, 0.10)",
      flexShrink: 0,
    }}>
      {AUDIENCE_LABEL[audience] || audience}
    </div>
  );
}

function CitationsList({ citations }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600,
        marginBottom: 8,
      }}>
        Sources
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {citations.map((c, i) => (
          <div key={i} style={{
            padding: "10px 12px",
            background: "rgba(200, 169, 81, 0.06)",
            borderLeft: `3px solid ${C.gold}`,
            borderRadius: "0 8px 8px 0",
          }}>
            <div style={{
              fontFamily: "Fraunces, serif", fontSize: 12, fontWeight: 600,
              color: C.goldDark, marginBottom: 4,
            }}>
              {c.source}
            </div>
            <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.55, fontStyle: "italic" }}>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteBox({ label, text }) {
  return (
    <div style={{
      marginTop: 12, padding: "10px 12px",
      background: "rgba(15, 61, 46, 0.05)",
      borderLeft: `3px solid ${C.primary}`,
      borderRadius: "0 8px 8px 0",
    }}>
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.primary,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700,
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.55 }}>
        {text}
      </div>
    </div>
  );
}

function NotFound({ onBack }) {
  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Rights in Islam" onBack={onBack} />
      <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
        Topic not found.
      </div>
    </div>
  );
}
