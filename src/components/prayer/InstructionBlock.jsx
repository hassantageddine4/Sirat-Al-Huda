// src/components/prayer/InstructionBlock.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Title + instruction body + optional tip + optional madhhab note.
// Direct port of InstructionBlock from WalkthroughComponents.swift.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "../common/Icon";

const GOLD = "rgba(242, 204, 115, 1)";

export default function InstructionBlock({ step }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2
        className="text-white"
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.2,
        }}>
        {step.title}
      </h2>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.78)",
          whiteSpace: "pre-wrap",
        }}>
        {step.instruction}
      </p>

      {step.madhhabNote && <MadhhabNote text={step.madhhabNote} />}
      {step.tip && <Tip text={step.tip} />}
    </div>
  );
}

function Tip({ text }) {
  return (
    <div
      className="flex items-start gap-2 p-2.5 rounded-xl"
      style={{
        background: "rgba(242, 204, 115, 0.06)",
        border: "0.5px solid rgba(242, 204, 115, 0.2)",
      }}>
      <div className="flex-shrink-0 mt-0.5" style={{ color: GOLD }}>
        <Icon name="sparkle" size={11} />
      </div>
      <p
        className="italic"
        style={{
          fontSize: 12, lineHeight: 1.5,
          color: "rgba(255,255,255,0.7)",
        }}>
        {text}
      </p>
    </div>
  );
}

function MadhhabNote({ text }) {
  return (
    <div
      className="flex items-start gap-2 p-2.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="flex-shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
        <Icon name="info" size={11} />
      </div>
      <p style={{
        fontSize: 11, lineHeight: 1.5,
        color: "rgba(255,255,255,0.65)",
      }}>
        {text}
      </p>
    </div>
  );
}
