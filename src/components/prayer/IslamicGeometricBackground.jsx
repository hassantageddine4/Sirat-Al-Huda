// src/components/prayer/IslamicGeometricBackground.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Premium Islamic background composition. Original design — inspired by
// classical emerald-and-gold reference but distinct in composition:
//
//   • Deep emerald base with central radial glow
//   • Two layered 8-pointed star (khatim) tessellation patterns, both
//     semi-transparent to avoid the flat-wallpaper effect
//   • Diagonal corner ornaments (top-left + bottom-right) — soft mihrab-arch
//     silhouettes with denser pattern fill, gold trim
//   • Two 4-pointed gold sparkle stars accenting the empty diagonal corners
//   • Edge vignette to draw attention inward
//   • Subtle gold edge trim, top and bottom
//
// Renders as a fixed full-screen layer behind all content. Pointer-events
// disabled so it never blocks UI. No image assets — everything is SVG + CSS.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// Palette tokens — warmer brass-gold than typical Islamic green/gold sets
const EMERALD_DEEP    = "#08291D";
const EMERALD_MID     = "#0F3D2E";
const EMERALD_LIGHT   = "#1A5C44";
const GOLD            = "#C8A14D";
const GOLD_BRIGHT     = "#E2C273";
const GOLD_DEEP       = "#8B6F2C";

export default function IslamicGeometricBackground() {
  return (
    <div className="islamic-bg" aria-hidden="true">
      {/* Layer 1: base emerald gradient */}
      <div className="bg-base" />

      {/* Layer 2: warm radial glow from center */}
      <div className="bg-glow" />

      {/* Layer 3: tessellated geometric SVG (pattern + ornaments + sparkles) */}
      <svg
        className="bg-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* ── Tile A: smaller 8-pointed star tessellation ────────────── */}
          <pattern id="khatim-fine" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <g stroke={GOLD} strokeWidth="0.4" fill="none" opacity="0.55">
              {/* Two overlapping squares forming 8-pointed star */}
              <rect x="16" y="16" width="16" height="16" />
              <rect x="16" y="16" width="16" height="16" transform="rotate(45 24 24)" />
              {/* Center dot */}
              <circle cx="24" cy="24" r="1.1" fill={GOLD} stroke="none" opacity="0.8" />
            </g>
            {/* Tile corner accents */}
            <circle cx="0"  cy="0"  r="0.9" fill={GOLD} opacity="0.4" />
            <circle cx="48" cy="0"  r="0.9" fill={GOLD} opacity="0.4" />
            <circle cx="0"  cy="48" r="0.9" fill={GOLD} opacity="0.4" />
            <circle cx="48" cy="48" r="0.9" fill={GOLD} opacity="0.4" />
          </pattern>

          {/* ── Tile B: denser star + lattice for the corner ornaments ── */}
          <pattern id="khatim-dense" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <g stroke={GOLD_BRIGHT} strokeWidth="0.5" fill="none" opacity="0.9">
              <rect x="11" y="11" width="14" height="14" />
              <rect x="11" y="11" width="14" height="14" transform="rotate(45 18 18)" />
              <circle cx="18" cy="18" r="3.5" />
              <line x1="0" y1="18" x2="36" y2="18" opacity="0.35" />
              <line x1="18" y1="0" x2="18" y2="36" opacity="0.35" />
            </g>
          </pattern>

          {/* ── Corner ornament masks (soft mihrab-arch silhouettes) ────── */}
          {/* Top-left scalloped wedge */}
          <clipPath id="corner-tl" clipPathUnits="userSpaceOnUse">
            <path d="M 0,0 L 180,0 Q 160,30 140,55 Q 110,90 70,120 Q 35,150 0,170 Z" />
          </clipPath>
          {/* Bottom-right scalloped wedge (mirrored) */}
          <clipPath id="corner-br" clipPathUnits="userSpaceOnUse">
            <path d="M 400,800 L 220,800 Q 240,770 260,745 Q 290,710 330,680 Q 365,650 400,630 Z" />
          </clipPath>

          {/* Radial glow gradient for center warm spot */}
          <radialGradient id="warm-center" cx="50%" cy="42%" r="50%">
            <stop offset="0%"  stopColor={GOLD_BRIGHT} stopOpacity="0.10" />
            <stop offset="60%" stopColor={GOLD}        stopOpacity="0"    />
          </radialGradient>

          {/* Vertical gold-edge fade — top */}
          <linearGradient id="edge-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
          </linearGradient>
          <linearGradient id="edge-bottom" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Fine pattern tessellated across whole viewport, low opacity */}
        <rect width="100%" height="100%" fill="url(#khatim-fine)" opacity="0.18" />

        {/* Warm center glow on top of the pattern */}
        <rect width="100%" height="100%" fill="url(#warm-center)" />

        {/* Top edge gold haze (8% height) */}
        <rect x="0" y="0" width="400" height="80" fill="url(#edge-top)" />

        {/* Bottom edge gold haze */}
        <rect x="0" y="720" width="400" height="80" fill="url(#edge-bottom)" />

        {/* ── Top-left corner ornament ──────────────────────────────── */}
        <g clipPath="url(#corner-tl)">
          {/* Inner emerald wash (darker than base, creates depth) */}
          <rect width="400" height="800" fill={EMERALD_DEEP} opacity="0.55" />
          {/* Dense pattern inside the wedge */}
          <rect width="400" height="800" fill="url(#khatim-dense)" opacity="0.85" />
        </g>
        {/* Gold trim along corner-tl outline */}
        <path
          d="M 0,0 L 180,0 Q 160,30 140,55 Q 110,90 70,120 Q 35,150 0,170"
          fill="none"
          stroke={GOLD_BRIGHT}
          strokeWidth="1.2"
          opacity="0.85"
        />
        {/* Thinner accent line just inside the trim */}
        <path
          d="M 0,8 L 174,8 Q 154,36 134,60 Q 105,93 66,121 Q 33,150 0,166"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* ── Bottom-right corner ornament ─────────────────────────── */}
        <g clipPath="url(#corner-br)">
          <rect width="400" height="800" fill={EMERALD_DEEP} opacity="0.55" />
          <rect width="400" height="800" fill="url(#khatim-dense)" opacity="0.85" />
        </g>
        <path
          d="M 400,800 L 220,800 Q 240,770 260,745 Q 290,710 330,680 Q 365,650 400,630"
          fill="none"
          stroke={GOLD_BRIGHT}
          strokeWidth="1.2"
          opacity="0.85"
        />
        <path
          d="M 400,792 L 226,792 Q 246,762 266,737 Q 294,705 332,674 Q 367,648 400,638"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* ── 4-pointed sparkle stars (top-right and bottom-left) ──── */}
        <g opacity="0.95">
          {/* Top-right sparkle */}
          <FourPointStar cx={340} cy={130} size={14} />
          {/* Bottom-left sparkle */}
          <FourPointStar cx={60} cy={680} size={14} />
        </g>

        {/* Subtle ambient particles for spiritual atmosphere */}
        <g opacity="0.5" fill={GOLD}>
          <circle cx="120" cy="240" r="0.8" />
          <circle cx="280" cy="320" r="0.6" />
          <circle cx="320" cy="500" r="0.9" />
          <circle cx="90"  cy="450" r="0.7" />
          <circle cx="180" cy="600" r="0.6" />
          <circle cx="250" cy="200" r="0.5" />
        </g>
      </svg>

      {/* Layer 4: edge vignette (darker around perimeter, pushes focus inward) */}
      <div className="bg-vignette" />

      <style>{`
        .islamic-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
          background: ${EMERALD_DEEP};
        }
        .bg-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 42%,
              ${EMERALD_LIGHT} 0%,
              ${EMERALD_MID}  45%,
              ${EMERALD_DEEP} 100%);
        }
        .bg-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 38% at 50% 42%,
              rgba(226, 194, 115, 0.10) 0%,
              rgba(226, 194, 115, 0)    70%);
          mix-blend-mode: screen;
        }
        .bg-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .bg-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 70% at 50% 50%,
              transparent 35%,
              rgba(0, 0, 0, 0.30) 90%,
              rgba(0, 0, 0, 0.55) 100%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// Small SVG primitive: a 4-pointed star (sparkle) at (cx,cy) with the
// given size (half-width of the long axis).
function FourPointStar({ cx, cy, size }) {
  const s = size;
  const thin = size * 0.18;
  const points = [
    `${cx},${cy - s}`,
    `${cx + thin},${cy - thin}`,
    `${cx + s},${cy}`,
    `${cx + thin},${cy + thin}`,
    `${cx},${cy + s}`,
    `${cx - thin},${cy + thin}`,
    `${cx - s},${cy}`,
    `${cx - thin},${cy - thin}`,
  ].join(" ");
  return (
    <g>
      <polygon points={points} fill={GOLD_BRIGHT} opacity="0.95" />
      {/* Soft glow ring */}
      <circle cx={cx} cy={cy} r={s * 1.6} fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.35" />
      <circle cx={cx} cy={cy} r={s * 2.4} fill="none" stroke={GOLD_DEEP} strokeWidth="0.3" opacity="0.20" />
    </g>
  );
}
