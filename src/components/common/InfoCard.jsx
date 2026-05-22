// src/components/common/InfoCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Canonical info / note / tip / warning callout. Replaces the old blue
// info-emoji blocks (and any other emoji-prefixed callout) used across
// prayer guides, journal hints, etc.
//
// Variants:
//   info    (default) — neutral parchment, accent stripe
//   tip     — warm gold background
//   warning — amber, for cautions
//   success — emerald, for confirmations
//
// Usage:
//   <InfoCard>You can combine Dhuhr and Asr while travelling.</InfoCard>
//   <InfoCard variant="tip" title="Tip">Wash hands first.</InfoCard>
//   <InfoCard variant="warning" icon="alert">Make wudu before salah.</InfoCard>
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "./Icon";

const VARIANTS = {
  info: {
    bg:     "bg-white/70",
    border: "border-border/60",
    stripe: "bg-accent/40",
    iconColor: "text-accent-dark",
    titleColor: "text-primary",
    bodyColor: "text-body",
    defaultIcon: "info",
  },
  tip: {
    bg:     "bg-accent/8",
    border: "border-accent/30",
    stripe: "bg-accent",
    iconColor: "text-accent-dark",
    titleColor: "text-accent-dark",
    bodyColor: "text-body",
    defaultIcon: "star",
  },
  warning: {
    bg:     "bg-amber-50/60",
    border: "border-amber-300/50",
    stripe: "bg-amber-500/70",
    iconColor: "text-amber-700",
    titleColor: "text-amber-900",
    bodyColor: "text-amber-900/90",
    defaultIcon: "warning",
  },
  success: {
    bg:     "bg-emerald-50/60",
    border: "border-emerald-300/50",
    stripe: "bg-emerald-600/70",
    iconColor: "text-emerald-700",
    titleColor: "text-emerald-900",
    bodyColor: "text-emerald-900/90",
    defaultIcon: "checkCircle",
  },
};

export default function InfoCard({
  variant = "info",
  icon,
  title,
  children,
  className = "",
}) {
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const iconName = icon ?? v.defaultIcon;

  return (
    <aside
      className={`relative flex gap-3 pl-4 pr-4 py-3.5 rounded-xl border ${v.bg} ${v.border} ${className}`}>
      {/* Left accent stripe */}
      <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${v.stripe}`} aria-hidden="true" />

      <Icon name={iconName} size={16} className={`${v.iconColor} mt-0.5 flex-shrink-0`} />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-[12px] font-semibold tracking-wide ${v.titleColor} mb-0.5`}>
            {title}
          </p>
        )}
        <div className={`text-[13px] leading-relaxed ${v.bodyColor}`}>
          {children}
        </div>
      </div>
    </aside>
  );
}
