// src/pages/NewGoal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { createGoal } from "../services/goalsService";
import { STARTER_GOALS, CATEGORIES } from "../data/starterGoals";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

export default function NewGoal() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("starters");
  const [categoryFilter, setCategoryFilter] = useState(null);

  function adoptStarter(starter) {
    const goal = createGoal({
      title: starter.title, category: starter.category, type: starter.type,
      target: starter.target, period: starter.period, notes: starter.description,
      icon: starter.icon, color: starter.color, checklistItems: starter.checklistItems,
    });
    navigate(`/goals/${goal.id}`, { replace: true });
  }

  const filtered = categoryFilter
    ? STARTER_GOALS.filter(g => g.category === categoryFilter)
    : STARTER_GOALS;

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="New Goal" subtitle="Choose a starter or build your own" onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ paddingTop: 8, paddingLeft: 16, paddingRight: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, background: "white", borderRadius: 12, padding: 4, border: `0.5px solid ${C.hairline}` }}>
          <ModeTab label="Starter goals" active={mode === "starters"} onTap={() => setMode("starters")} />
          <ModeTab label="Custom" active={mode === "custom"} onTap={() => setMode("custom")} />
        </div>
        {mode === "starters" ? (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <CategoryChip label="All" active={categoryFilter === null} onTap={() => setCategoryFilter(null)} />
              {CATEGORIES.filter(c => c.key !== "custom").map(c => (
                <CategoryChip key={c.key} label={c.label} color={c.color}
                  active={categoryFilter === c.key} onTap={() => setCategoryFilter(c.key)} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(s => <StarterCard key={s.id} starter={s} onTap={() => adoptStarter(s)} />)}
            </div>
          </>
        ) : (
          <CustomBuilder onCreate={(p) => { const g = createGoal(p); navigate(`/goals/${g.id}`, { replace: true }); }} />
        )}
      </div>
    </div>
  );
}

function ModeTab({ label, active, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      flex: 1, padding: "10px 8px", borderRadius: 9,
      background: active ? C.primary : "transparent",
      color: active ? "white" : C.muted, border: "none",
      fontFamily: "Fraunces, serif", fontSize: 13, whiteSpace: "nowrap",
      fontWeight: active ? 500 : 400, letterSpacing: "-0.01em",
    }}>{label}</button>
  );
}

function CategoryChip({ label, color, active, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      padding: "8px 14px", borderRadius: 999,
      background: active ? (color || C.primary) : "white",
      color: active ? "white" : C.body,
      border: `0.5px solid ${active ? (color || C.primary) : C.hairline}`,
      fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
    }}>{label}</button>
  );
}

function StarterCard({ starter, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      textAlign: "left", background: "white", borderRadius: 14,
      border: `0.5px solid ${C.hairline}`, padding: "16px 18px",
      boxShadow: "0 4px 14px rgba(10,8,6,0.05)", cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999,
          background: `${starter.color}15`, color: starter.color,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={starter.icon} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
            {starter.title}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>
            {starter.description}
          </div>
        </div>
      </div>
    </button>
  );
}

function CustomBuilder({ onCreate }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("streak");
  const [target, setTarget] = useState(7);
  const [category, setCategory] = useState("spiritual");
  const [notes, setNotes] = useState("");
  const [checklistText, setChecklistText] = useState("");

  function submit() {
    if (!title.trim()) return alert("Please enter a title.");
    const cat = CATEGORIES.find(c => c.key === category);
    const partial = { title: title.trim(), category, type,
      target: Math.max(1, parseInt(target, 10) || 1),
      period: "daily", notes: notes.trim(), icon: "checklist", color: cat?.color ?? C.primary };
    if (type === "checklist") {
      partial.checklistItems = checklistText.split("\n").map(s => s.trim()).filter(Boolean)
        .map((label, i) => ({ id: `i_${i}`, label, done: false }));
      partial.target = partial.checklistItems.length;
      if (partial.checklistItems.length === 0) return alert("Add at least one checklist item.");
    }
    onCreate(partial);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field label="Title">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Pray Tahajjud once a week" style={inputStyle()} />
      </Field>
      <Field label="Category">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.filter(c => c.key !== "custom").map(c => (
            <CategoryChip key={c.key} label={c.label} color={c.color}
              active={category === c.key} onTap={() => setCategory(c.key)} />
          ))}
        </div>
      </Field>
      <Field label="Tracking type">
        <div style={{ display: "flex", gap: 8 }}>
          <TypeChip label="Streak"    active={type === "streak"}    onTap={() => setType("streak")} />
          <TypeChip label="Counter"   active={type === "counter"}   onTap={() => setType("counter")} />
          <TypeChip label="Checklist" active={type === "checklist"} onTap={() => setType("checklist")} />
        </div>
      </Field>
      {type !== "checklist" && (
        <Field label={type === "streak" ? "Target days" : "Target count"}>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} min="1" style={inputStyle()} />
        </Field>
      )}
      {type === "checklist" && (
        <Field label="Checklist items (one per line)">
          <textarea value={checklistText} onChange={e => setChecklistText(e.target.value)} rows={5}
            placeholder={"Memorize ayah 1-5\nMemorize ayah 6-10"}
            style={{ ...inputStyle(), height: "auto", resize: "vertical", fontFamily: "inherit" }} />
        </Field>
      )}
      <Field label="Notes (optional)">
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Why this matters to you…"
          style={{ ...inputStyle(), height: "auto", resize: "vertical", fontFamily: "inherit" }} />
      </Field>
      <button onClick={submit} className="press" style={{
        width: "100%", padding: "14px", borderRadius: 12,
        background: C.primary, color: "white", border: "none",
        fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, marginTop: 6,
      }}>Create goal</button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.15em",
        textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>{label}</div>
      {children}
    </div>
  );
}

function TypeChip({ label, active, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      flex: 1, padding: "10px 12px", borderRadius: 10,
      background: active ? C.primary : "white",
      color: active ? "white" : C.body,
      border: `0.5px solid ${active ? C.primary : C.hairline}`,
      fontSize: 13, fontWeight: 500,
    }}>{label}</button>
  );
}

function inputStyle() {
  return {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `0.5px solid ${C.hairline}`, background: "white",
    fontSize: 14, color: C.ink, outline: "none",
  };
}
