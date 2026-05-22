// src/pages/Goals.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import {
  getActiveGoals, getCompletedGoals, getProgress,
  getProgressLabel, getCurrentStreak, isStreakDoneToday,
} from "../services/goalsService";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

export default function Goals() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    function onFocus() { setReloadKey(k => k + 1); }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const active = useMemo(() => getActiveGoals(), [reloadKey, tab]);
  const completed = useMemo(() => getCompletedGoals(), [reloadKey, tab]);
  const goals = tab === "active" ? active : completed;

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Goals" subtitle="Spiritual goals & habits" onBack={() => navigate(-1)} />
      <div className="px-4 pt-2" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", gap: 8, background: "white", borderRadius: 12, padding: 4, border: `0.5px solid ${C.hairline}` }}>
          <Tab label={`Active${active.length ? ` (${active.length})` : ""}`} active={tab === "active"} onTap={() => setTab("active")} />
          <Tab label={`Completed${completed.length ? ` (${completed.length})` : ""}`} active={tab === "completed"} onTap={() => setTab("completed")} />
        </div>
        {tab === "active" && (
          <button onClick={() => navigate("/goals/new")} className="press" style={{
            width: "100%", padding: "16px 18px", borderRadius: 14,
            background: "linear-gradient(135deg, #1B5E48 0%, #2D7D5F 100%)",
            color: "white", border: "none", display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 4px 14px rgba(15,61,46,0.18)",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 300, lineHeight: 1 }}>+</div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500 }}>New goal</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 2 }}>Choose from starters or build your own</div>
            </div>
          </button>
        )}
        {goals.length === 0 ? (
          <EmptyState tab={tab} onNew={() => navigate("/goals/new")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ paddingBottom: 200 }}>{goals.map(g => <GoalCard key={g.id} goal={g} onTap={() => navigate(`/goals/${g.id}`)} />)}</div>
            <div style={{ height: 160 }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ label, active, onTap }) {
  return (
    <button onClick={onTap} className="press" style={{
      flex: 1, padding: "10px 14px", borderRadius: 9,
      background: active ? C.primary : "transparent",
      color: active ? "white" : C.muted, border: "none",
      fontFamily: "Fraunces, serif", fontSize: 14,
      fontWeight: active ? 500 : 400, letterSpacing: "-0.01em",
    }}>{label}</button>
  );
}

function EmptyState({ tab, onNew }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center", background: "white",
      borderRadius: 14, border: `0.5px solid ${C.hairline}` }}>
      <div style={{ width: 56, height: 56, borderRadius: 999, background: `${C.primary}10`,
        color: C.primary, display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 12px" }}>
        <Icon name="checklist" size={26} />
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, color: C.ink, letterSpacing: "-0.01em" }}>
        {tab === "active" ? "No active goals" : "No completed goals yet"}
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
        {tab === "active" ? "Start with a goal — pick from suggested or create your own." : "Your finished goals will appear here, in shaa Allah."}
      </div>
      {tab === "active" && (
        <button onClick={onNew} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10,
          background: C.primary, color: "white", border: "none", fontSize: 13, fontWeight: 500,
        }}>Browse starter goals</button>
      )}
    </div>
  );
}

function GoalCard({ goal, onTap }) {
  const pct = getProgress(goal);
  const label = getProgressLabel(goal);
  const streak = goal.type === "streak" ? getCurrentStreak(goal) : null;
  const todayDone = goal.type === "streak" ? isStreakDoneToday(goal) : null;
  return (
    <button onClick={onTap} className="press" style={{
      width: "100%", textAlign: "left", background: "white",
      borderRadius: 14, border: `0.5px solid ${C.hairline}`,
      padding: "16px 18px", boxShadow: "0 4px 14px rgba(10,8,6,0.05)", cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: `${goal.color}15`,
          color: goal.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={goal.icon || "checklist"} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink,
            letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {goal.title}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <span>{label}</span>{streak > 0 && <><span style={{ margin: "0 4px" }}>·</span><Icon name="flame" size={12} /><span style={{ marginLeft: 2 }}>{streak}</span></>}{goal.completed && <><span style={{ margin: "0 4px" }}>·</span><Icon name="check" size={12} /><span style={{ marginLeft: 2 }}>Complete</span></>}
          </div>
        </div>
        {goal.type === "streak" && !goal.completed && (
          <div style={{ width: 28, height: 28, borderRadius: 999,
            background: todayDone ? goal.color : `${goal.color}10`,
            color: todayDone ? "white" : goal.color,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
          }}>{todayDone && <Icon name="check" size={14} />}</div>
        )}
      </div>
      <div style={{ marginTop: 12, height: 4, borderRadius: 3, background: "#F0EAE0", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%",
          background: goal.completed ? C.primary : `linear-gradient(90deg, ${goal.color}, ${C.primaryLight})`,
          transition: "width 240ms ease" }} />
      </div>
    </button>
  );
}
