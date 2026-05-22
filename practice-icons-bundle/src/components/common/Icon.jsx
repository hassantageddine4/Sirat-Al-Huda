// src/components/common/Icon.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Centralized icon system. Replaces emoji and ad-hoc inline SVGs across the
// app with a single component that takes a `name` prop and emits a clean,
// consistent line-style SVG.
//
//   <Icon name="moon" size={20} />
//   <Icon name="info" size={16} className="text-accent" />
//
// Design rules:
//   • All icons drawn on a 24x24 grid, 1.5–1.75 stroke weight
//   • currentColor stroke + transparent fill — recolour via Tailwind text-*
//   • Outlined only — no filled glyphs to keep the aesthetic refined
//   • Optical-balanced for sizes 14–28; below 14 use minimal variants
//
// Adding a new icon: add an entry to ICONS keyed by name, with a function
// that returns the inner SVG paths. No changes needed at call sites.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// ─── Icon library ───────────────────────────────────────────────────────────
const stroke = (sw = 1.6) => ({
  fill:        "none",
  stroke:      "currentColor",
  strokeWidth: sw,
  strokeLinecap:  "round",
  strokeLinejoin: "round",
});

const ICONS = {
  // ── Navigation / structural ───────────────────────────────────────────
  menu:   () => <path d="M4 7h16M4 12h16M4 17h10"        {...stroke(2)} />,
  close:  () => <path d="M6 6l12 12M18 6L6 18"            {...stroke(2)} />,
  back:   () => <path d="M15 6l-6 6 6 6"                  {...stroke(2)} />,
  forward:() => <path d="M9 6l6 6-6 6"                    {...stroke(1.6)} />,
  search: () => (
    <>
      <circle cx="10" cy="10" r="6" {...stroke(1.75)} />
      <path d="M14.5 14.5L19 19"     {...stroke(1.75)} />
    </>
  ),
  plus:   () => <path d="M12 5v14M5 12h14" {...stroke(2)} />,
  minus:  () => <path d="M5 12h14"          {...stroke(2)} />,
  more:   () => (
    <>
      <circle cx="5"  cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" />
    </>
  ),

  // ── Status / feedback ─────────────────────────────────────────────────
  info: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M12 8h.01M11 12h1v5h1" {...stroke(1.75)} />
    </>
  ),
  warning: () => (
    <>
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...stroke(1.6)} />
      <path d="M12 9v4M12 17h.01" {...stroke(1.75)} />
    </>
  ),
  check: () => <path d="M5 12l5 5L20 7" {...stroke(2)} />,
  checkCircle: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M9 12l2 2 4-4" {...stroke(1.6)} />
    </>
  ),
  alert: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M12 7v6M12 17h.01" {...stroke(1.75)} />
    </>
  ),

  // ── Religious / cultural (clean line-art, never cartoon) ──────────────
  mosque: () => (
    <>
      <path d="M4 21V11l8-6 8 6v10" {...stroke(1.5)} />
      <path d="M9 21v-5a3 3 0 0 1 6 0v5" {...stroke(1.5)} />
      <path d="M12 5V3M11 3h2"     {...stroke(1.5)} />
    </>
  ),

  // Mihrab — the prayer niche in a mosque, indicating qibla direction.
  // Pointed-arch silhouette resting on a small base.
  mihrab: () => (
    <>
      <path d="M5 21V12a7 7 0 0 1 14 0v9" {...stroke(1.5)} />
      <path d="M9 21v-7a3 3 0 0 1 6 0v7" {...stroke(1.5)} />
      <path d="M3 21h18" {...stroke(1.5)} />
      <circle cx="12" cy="13" r="0.7" fill="currentColor" />
    </>
  ),

  // Refined kaaba — cube with the kiswa band across the top.
  // More distinctive than the plain rectangle; clearly reads as kaaba.
  kaaba: () => (
    <>
      {/* main cube */}
      <rect x="5" y="6" width="14" height="14" rx="0.5" {...stroke(1.5)} />
      {/* kiswa (gold band near the top) */}
      <path d="M5 9.5h14" {...stroke(1.4)} />
      <path d="M5 11h14" {...stroke(1)} />
      {/* door indication */}
      <path d="M14 20v-3.5h2V20" {...stroke(1.3)} />
      {/* base shadow */}
      <path d="M3 21h18" {...stroke(1.4)} />
    </>
  ),

  moon: () => <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...stroke(1.5)} />,
  star: () => <path d="M12 2l2.6 6.3 6.8.6-5.2 4.5 1.6 6.7L12 16.7 6.2 20l1.6-6.7L2.6 8.9l6.8-.6L12 2z" {...stroke(1.4)} />,

  // 8-pointed star (Rub el Hizb / khatim Sulayman) — two overlapping squares.
  // Authentic Islamic geometric symbol, often used to mark Qur'an divisions.
  star8: () => (
    <>
      {/* square 1 (axis-aligned, slightly inset for optical balance) */}
      <path d="M5 12L12 5L19 12L12 19Z" {...stroke(1.4)} />
      {/* square 2 (rotated 45°) */}
      <path d="M3.5 12L12 3.5L20.5 12L12 20.5Z" {...stroke(1.4)} />
      {/* center dot */}
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </>
  ),

  prayer:  () => (
    <>
      <circle cx="12" cy="6" r="2.4" {...stroke(1.6)} />
      <path d="M7 21v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3M9 13l1.5-3M15 13l-1.5-3" {...stroke(1.6)} />
    </>
  ),
  compass: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M14 10l-2 6-2-6 4-2-2 6" {...stroke(1.4)} />
    </>
  ),
  beads: () => (
    <>
      <circle cx="6"  cy="14" r="2" {...stroke(1.5)} />
      <circle cx="12" cy="10" r="2" {...stroke(1.5)} />
      <circle cx="18" cy="14" r="2" {...stroke(1.5)} />
      <path d="M7.6 12.7l3-1.4M13.4 11.3l3 1.4" {...stroke(1.4)} />
    </>
  ),

  // ── Content types ─────────────────────────────────────────────────────
  book: () => (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2V5z" {...stroke(1.6)} />
      <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6V3z" {...stroke(1.6)} />
    </>
  ),
  bookOpen: () => <path d="M2 6a2 2 0 0 1 2-2h6v16H4a2 2 0 0 1-2-2V6zM22 6a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 0 2-2V6z" {...stroke(1.6)} />,
  scroll: () => (
    <>
      <path d="M4 4h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2-3-2V6a2 2 0 0 1 1-2z" {...stroke(1.6)} />
      <path d="M9 10h6M9 14h4" {...stroke(1.5)} />
    </>
  ),
  bookmark: ({ filled }) => (
    <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"} />
  ),
  heart: ({ filled }) => (
    <path d="M12 21s-7-4.5-9-9.5A5 5 0 0 1 12 6a5 5 0 0 1 9 5.5C19 16.5 12 21 12 21z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"} />
  ),

  // ── Time / calendar ───────────────────────────────────────────────────
  clock: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M12 7v5l3 2" {...stroke(1.6)} />
    </>
  ),
  calendar: () => (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" {...stroke(1.6)} />
      <path d="M3 10h18M8 3v4M16 3v4" {...stroke(1.6)} />
    </>
  ),
  sunrise: () => (
    <>
      <path d="M2 18h20M6 18a6 6 0 0 1 12 0M12 4v3M5 8l1.4 1.4M19 8l-1.4 1.4" {...stroke(1.6)} />
    </>
  ),
  sunset: () => (
    <>
      <path d="M2 18h20M6 18a6 6 0 0 1 12 0M12 7V4M5 8l1.4 1.4M19 8l-1.4 1.4M9 4l3 3 3-3" {...stroke(1.6)} />
    </>
  ),

  // ── User / community ──────────────────────────────────────────────────
  user: () => (
    <>
      <circle cx="12" cy="8" r="4" {...stroke(1.6)} />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" {...stroke(1.6)} />
    </>
  ),
  users: () => (
    <>
      <circle cx="9"  cy="8" r="3" {...stroke(1.6)} />
      <circle cx="17" cy="8" r="2.4" {...stroke(1.4)} />
      <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5M17 14c1.7 0 4 1.3 4 3.5" {...stroke(1.6)} />
    </>
  ),
  message: () => (
    <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5a8 8 0 1 1 16-3z" {...stroke(1.6)} />
  ),

  // ── Actions ───────────────────────────────────────────────────────────
  share: () => (
    <path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" {...stroke(1.75)} />
  ),
  download: () => (
    <path d="M12 3v12M7 11l5 5 5-5M5 21h14" {...stroke(1.75)} />
  ),
  trash: () => (
    <>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" {...stroke(1.6)} />
      <path d="M10 11v6M14 11v6" {...stroke(1.6)} />
    </>
  ),
  edit: () => (
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" {...stroke(1.6)} />
  ),
  refresh: () => (
    <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" {...stroke(1.75)} />
  ),
  play: () => <path d="M7 4l13 8-13 8V4z" {...stroke(1.5)} />,
  pause: () => <path d="M7 4v16M17 4v16" {...stroke(2)} />,
  volume: () => (
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" {...stroke(1.6)} />
      <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" {...stroke(1.6)} />
    </>
  ),
  sparkle: () => (
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" {...stroke(1.4)} />
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" {...stroke(1.2)} />
    </>
  ),

  // ── Settings / utility ────────────────────────────────────────────────
  settings: () => (
    <>
      <circle cx="12" cy="12" r="3" {...stroke(1.6)} />
      <path d="M19 12c0 .6-.1 1.2-.2 1.7l1.7 1.3-2 3.4-2-.7c-.9.7-1.9 1.2-3 1.5l-.4 2H10l-.4-2c-1.1-.3-2.1-.8-3-1.5l-2 .7-2-3.4 1.7-1.3c-.1-.5-.2-1.1-.2-1.7s.1-1.2.2-1.7L2.6 9l2-3.4 2 .7c.9-.7 1.9-1.2 3-1.5L10 3h4l.4 2c1.1.3 2.1.8 3 1.5l2-.7 2 3.4-1.7 1.3c.1.5.2 1.1.2 1.7z" {...stroke(1.4)} />
    </>
  ),
  text: () => <path d="M5 7h14M9 12h10M5 17h14M5 12h0" {...stroke(1.6)} />,
  globe: () => (
    <>
      <circle cx="12" cy="12" r="9" {...stroke(1.6)} />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...stroke(1.5)} />
    </>
  ),
  flame: () => (
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s2 1 2 4c0-3 2-5 2-10z" {...stroke(1.5)} />
  ),
  bell: () => (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" {...stroke(1.6)} />
      <path d="M10 19a2 2 0 0 0 4 0" {...stroke(1.6)} />
    </>
  ),

  // ── Direction / location ──────────────────────────────────────────────
  pin: () => (
    <>
      <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" {...stroke(1.6)} />
      <circle cx="12" cy="10" r="2.5" {...stroke(1.5)} />
    </>
  ),
  arrowUp:    () => <path d="M12 19V5M5 12l7-7 7 7" {...stroke(1.75)} />,
  arrowDown:  () => <path d="M12 5v14M5 12l7 7 7-7" {...stroke(1.75)} />,
  arrowLeft:  () => <path d="M19 12H5M12 5l-7 7 7 7" {...stroke(1.75)} />,
  arrowRight: () => <path d="M5 12h14M12 5l7 7-7 7"  {...stroke(1.75)} />,
  external:   () => <path d="M7 17L17 7M17 7H8M17 7v9" {...stroke(1.75)} />,
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function Icon({
  name,
  size = 18,
  className = "",
  filled = false,
  strokeWidth,
  ...rest
}) {
  const draw = ICONS[name];
  if (!draw) {
    if (typeof window !== "undefined") {
      // Surface in dev so missing icon names are obvious
      // eslint-disable-next-line no-console
      console.warn(`[Icon] Unknown icon "${name}"`);
    }
    return null;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}>
      {draw({ filled })}
    </svg>
  );
}
