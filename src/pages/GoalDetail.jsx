// src/pages/GoalDetail.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import {
  getGoalById, markStreakToday, unmarkStreakToday,
  isStreakDoneToday, getCurrentStreak,
  incrementCounter, setCounter, toggleChecklistItem,
  deleteGoal, archiveGoal, getProgress, getProgressLabel,
} from "../services/goalsService";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", subtle: "#A09890", hairline: "#E8E2D8", danger: "#C0392B",
};

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(() => getGoalById(id));
  const refresh = useCallback(() => setGoal(getGoalById(id)), [id]);
  useEffect(() => { refresh(); }, [id, refresh]);

  if (!goal) {
    return (
      <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
        <ScreenHeader title="Goal not found" onBack={() => navigate(-1)} />
        <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>
          This goal no longer exists.
        </div>
      </div>
    );
  }

  const pct = getProgress(goal);
  const label = getProgressLabel(goal);
  function hap() { try { Haptics.impact({ style: ImpactStyle.Light }); } catch {} }
  function handleStreakTap() { hap(); if (isStreakDoneToday(goal)) unmarkStreakToday(id); else markStreakToday(id); refresh(); }
  function handleCounterChange(delta) { hap(); incrementCounter(id, delta); refresh(); }
  function handleCounterSet(value) { setCounter(id, value); refresh(); }
  function handleChecklistTap(itemId) { hap(); toggleChecklistItem(id, itemId); refresh(); }
  function handleDelete() { if (window.confirm("Delete this goal? This cannot be undone.")) { deleteGoal(id); navigate(-1); } }
  function handleArchive() { if (window.confirm("Archive this goal?")) { archiveGoal(id); navigate(-1); } }

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title={goal.title} onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ padding: "8px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ background: "white", borderRadius: 18, padding: "22px 20px",
          border: `0.5px solid ${C.hairline}`, boxShadow: "0 4px 14px rgba(10,8,6,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 999, background: `${goal.color}15`,
              color: goal.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={goal.icon || "checklist"} size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
              </div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em", marginTop: 2 }}>
                {goal.title}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 32, fontWeight: 500, color: goal.color, letterSpacing: "-0.02em" }}>{pct}%</div>
            <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: "#F0EAE0", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%",
              background: goal.completed ? C.primary : `linear-gradient(90deg, ${goal.color}, ${C.primaryLight})`,
              transition: "width 280ms ease" }} />
          </div>

          {goal.completed && (
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10,
              background: `${C.primary}10`, color: C.primary,
              fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 500, textAlign: "center" }}>
              Goal complete — Alhamdulillah
            </div>
          )}
          {goal.notes && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${C.hairline}`, fontSize: 13, color: C.body, lineHeight: 1.55 }}>
              {goal.notes}
            </div>
          )}
        </div>
        {goal.type === "streak"    && <StreakControl    goal={goal} onTap={handleStreakTap} />}
        {goal.type === "counter"   && <CounterControl   goal={goal} onChange={handleCounterChange} onSet={handleCounterSet} />}
        {goal.type === "checklist" && <ChecklistControl goal={goal} onTap={handleChecklistTap} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={handleArchive} style={{ width: "100%", padding: "12px", borderRadius: 12,
            border: `0.5px solid ${C.hairline}`, background: "white", color: C.body,
            fontSize: 14, fontFamily: "Fraunces, serif", fontWeight: 500 }}>Archive goal</button>
          <button onClick={handleDelete} style={{ width: "100%", padding: "12px", borderRadius: 12,
            border: `0.5px solid ${C.danger}20`, background: "transparent", color: C.danger,
            fontSize: 14, fontFamily: "Fraunces, serif", fontWeight: 500 }}>Delete goal</button>
        </div>
      </div>
    </div>
  );
}

function StreakControl({ goal, onTap }) {
  const done = isStreakDoneToday(goal);
  const streak = getCurrentStreak(goal);
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "18px 20px",
      border: `0.5px solid ${C.hairline}`, boxShadow: "0 4px 14px rgba(10,8,6,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onTap} className="press" disabled={goal.completed} style={{
          width: 64, height: 64, borderRadius: 999,
          background: done ? goal.color : "transparent",
          border: `2px solid ${goal.color}`,
          color: done ? "white" : goal.color, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: goal.completed ? "default" : "pointer",
          opacity: goal.completed ? 0.6 : 1, flexShrink: 0,
        }}>{done && <Icon name="check" size={26} />}</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: C.ink, fontWeight: 500 }}>
            {done ? "Marked complete today" : "Tap when done today"}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
            Current streak: {streak} {streak === 1 ? "day" : "days"}
          </div>
        </div>
      </div>
    </div>
  );
}

function CounterControl({ goal, onChange, onSet }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px",
      border: `0.5px solid ${C.hairline}`, boxShadow: "0 4px 14px rgba(10,8,6,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
        <button onClick={() => onChange(-1)} className="press" disabled={goal.counterValue <= 0} style={{
          width: 44, height: 44, borderRadius: 999, background: `${goal.color}10`, color: goal.color,
          border: "none", fontSize: 22, cursor: goal.counterValue <= 0 ? "default" : "pointer",
          opacity: goal.counterValue <= 0 ? 0.4 : 1,
        }}>−</button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 36, fontWeight: 500, color: goal.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {goal.counterValue ?? 0}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>of {goal.target}</div>
        </div>
        <button onClick={() => onChange(1)} className="press" disabled={goal.completed} style={{
          width: 44, height: 44, borderRadius: 999, background: goal.color, color: "white",
          border: "none", fontSize: 22, cursor: goal.completed ? "default" : "pointer",
          opacity: goal.completed ? 0.6 : 1,
        }}>+</button>
      </div>
      <button onClick={() => {
        const val = window.prompt("Set count:", String(goal.counterValue ?? 0));
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 0) onSet(n);
      }} style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 10,
        background: "transparent", border: `0.5px solid ${C.hairline}`, color: C.muted, fontSize: 12,
      }}>Set exact count…</button>
    </div>
  );
}

function ChecklistControl({ goal, onTap }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "8px 0",
      border: `0.5px solid ${C.hairline}`, boxShadow: "0 4px 14px rgba(10,8,6,0.05)", overflow: "hidden" }}>
      {goal.checklistItems.map((item, i) => (
        <button key={item.id} onClick={() => onTap(item.id)} className="press" disabled={goal.completed} style={{
          width: "100%", padding: "14px 18px", background: "transparent", border: "none",
          borderBottom: i < goal.checklistItems.length - 1 ? `0.5px solid ${C.hairline}` : "none",
          display: "flex", alignItems: "center", gap: 14, textAlign: "left",
          cursor: goal.completed ? "default" : "pointer",
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 6,
            border: `1.5px solid ${item.done ? goal.color : C.subtle}`,
            background: item.done ? goal.color : "transparent",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>{item.done && <Icon name="check" size={14} />}</div>
          <div style={{ fontSize: 14, color: C.body,
            textDecoration: item.done ? "line-through" : "none",
            opacity: item.done ? 0.6 : 1 }}>{item.label}</div>
        </button>
      ))}
    </div>
  );
}
