import React from "react";
import Icon from "../common/Icon";
import { getDailyInsight } from "../../services/insights";
import { useBranch } from "../../hooks/useBranch";

export default function InsightCard() {
  const { branch } = useBranch();
  const insight = getDailyInsight(branch || "sunni");
  if (!insight) return null;

  return (
    <div
      className="w-full text-left rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #0F3D2E 0%, #1A5C44 100%)",
        boxShadow: "0 4px 20px rgba(15, 61, 46, 0.15)",
        height: 185,
      }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: "linear-gradient(180deg, #C8A951, #A88730)",
        }}
      />
      <div className="p-4 pl-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(200, 169, 81, 0.18)",
              color: "#D9BF7A",
            }}>
            <Icon name="sparkle" size={10} />
            Reflection
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            {insight.category}
          </span>
        </div>
        <div className="flex items-start gap-3.5">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(200, 169, 81, 0.15)",
              color: "#D9BF7A",
              boxShadow: "inset 0 0 0 1px rgba(200, 169, 81, 0.25)",
            }}>
            <Icon name="bookOpen" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] text-white leading-relaxed mb-2 font-medium line-clamp-4">
              {insight.text}
            </p>
            <div className="flex items-center gap-2">
              <div style={{ width: 14, height: 1, background: "rgba(200, 169, 81, 0.5)" }} />
              <p className="text-[11px] text-white/60 tracking-wide">
                {insight.source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
