// src/components/prayer/WalkthroughNavBar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Previous / Next (or Complete) buttons. Direct port of WalkthroughNavBar
// from WalkthroughComponents.swift.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "../common/Icon";

export default function WalkthroughNavBar({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onDone,
}) {
  return (
    <div className="flex gap-2.5">
      {/* Previous */}
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className="press flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-semibold disabled:opacity-50"
        style={{
          fontSize: 14,
          color: isFirstStep ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
          background: "rgba(255,255,255,0.05)",
          border: "0.6px solid rgba(255,255,255,0.12)",
        }}>
        <Icon name="back" size={14} />
        Previous
      </button>

      {/* Next or Done */}
      <button
        onClick={isLastStep ? onDone : onNext}
        className="press flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-semibold"
        style={{
          fontSize: 14,
          color: "#0a2e22",
          background: "linear-gradient(to bottom, #FCDF8C, #D9A84D)",
          boxShadow: "0 8px 18px rgba(217,168,77,0.32)",
        }}>
        {isLastStep ? "Complete" : "Next"}
        <Icon name={isLastStep ? "check" : "forward"} size={14} />
      </button>
    </div>
  );
}
