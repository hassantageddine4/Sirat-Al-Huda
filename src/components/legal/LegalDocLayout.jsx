// src/components/legal/LegalDocLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared layout for legal documents. Provides:
//   • Screen header with back button
//   • "Last updated" pill
//   • Prose typography optimized for long-form reading on mobile
//   • Section helpers (Section, Subsection) used by Terms & Privacy
//
// Typography rules:
//   • Body: Inter 14px / leading-relaxed for readability at length
//   • Headings: display font, but small — this isn't marketing copy
//   • Lists: ample left padding, no bullets where prose flows naturally
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import ScreenHeader from "../common/ScreenHeader";

export function LegalDocLayout({ title, lastUpdated, children }) {
  return (
    <div className="screen bg-ivory">
      <ScreenHeader title={title} />

      <div className="scroll-area pb-16">
        <header className="px-6 pt-4 pb-5 border-b border-border/60">
          <h1 className="font-display text-3xl text-primary tracking-tight leading-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-parchment text-[11px] text-muted font-semibold tracking-wide">
              Last updated {lastUpdated}
            </p>
          )}
        </header>

        <article className="px-6 pt-5">
          {children}
        </article>
      </div>
    </div>
  );
}

// ─── Helpers used by Terms / Privacy bodies ─────────────────────────────────

export function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-lg text-primary tracking-tight mb-2.5">
        {title}
      </h2>
      <div className="space-y-3 text-[14px] text-body leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function Subsection({ title, children }) {
  return (
    <div className="mb-3">
      <h3 className="text-[13px] font-semibold text-ink mb-1.5 tracking-wide">
        {title}
      </h3>
      <div className="text-[14px] text-body leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="text-accent-dark mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
          <span className="text-[14px] text-body leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── External link in legal body — uses native browser via openExternal ─────
import { openExternal } from "../../services/permissionsService";

export function ExternalLink({ href, children }) {
  return (
    <button
      onClick={() => openExternal(href)}
      className="text-accent-dark font-semibold underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
      {children}
    </button>
  );
}
