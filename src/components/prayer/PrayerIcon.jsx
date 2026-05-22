// src/components/prayer/PrayerIcon.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wrapper around Icon that supplies inline SVG fallbacks for icons that
// may not be present in the base Icon library yet (sun, sunrise, sunset,
// moon, moonStars, cloudSun, users, leaf, plane, list, help, heart, etc.).
//
// If the base Icon component recognises the name, it renders that. Otherwise
// PrayerIcon renders a minimal SVG inline. Either way the prayer screens
// always show something appropriate.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "../common/Icon";

// Map prayer-specific names → known/likely Icon library names first.
// If the Icon library doesn't know any of these, the inline SVGs below kick in.
const SVGS = {
  sun: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  sunrise: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8M4.93 10.93l1.41-1.41M17.66 9.52l1.41 1.41M2 18h2M20 18h2M22 22H2M16 18a4 4 0 0 0-8 0M8 6l4-4 4 4" />
    </svg>
  ),
  sunset: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10V2M4.93 10.93l1.41-1.41M17.66 9.52l1.41 1.41M2 18h2M20 18h2M22 22H2M16 18a4 4 0 0 0-8 0M16 6l-4 4-4-4" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  moonStars: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      <circle cx="18" cy="5" r="1" fill="currentColor" />
      <circle cx="20" cy="9" r="0.7" fill="currentColor" />
    </svg>
  ),
  cloudSun: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="10" r="3" />
      <path d="M8 4v2M3 10h2M5.6 7.6l-1.4-1.4M10.4 7.6l1.4-1.4" />
      <path d="M11 16a4 4 0 1 0 0 0M19 16h.01M16 18l-1 4-1-4M19 16a3 3 0 0 0 0-6 4 4 0 0 0-7.5-1.5" />
    </svg>
  ),
  users: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  leaf: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2c1 1.5 2 5.5 2 8.5a8.5 8.5 0 0 1-8.6 8.5c-1.6 0-2.6-.5-3.6-1" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  ),
  star: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round">
      <polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.3 21 12 17.8 5.7 21 7 14.1 2 9.3 8.9 8.6" />
    </svg>
  ),
  heart: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  help: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  plane: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  ),
  list: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  play: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 4 20 12 6 20" />
    </svg>
  ),
  repeat: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  turtle: (s) => (
    // simple "tortoise.fill" stand-in: rounded shell + four legs
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="7" ry="5" />
      <circle cx="20" cy="11" r="1.5" />
      <rect x="5" y="16" width="2" height="3" rx="0.5" />
      <rect x="9" y="17" width="2" height="3" rx="0.5" />
      <rect x="13" y="17" width="2" height="3" rx="0.5" />
      <rect x="17" y="16" width="2" height="3" rx="0.5" />
    </svg>
  ),
};

export default function PrayerIcon({ name, size = 16, className = "", style = {} }) {
  if (SVGS[name]) {
    return (
      <span className={className} style={{ display: "inline-flex", color: "currentColor", ...style }}>
        {SVGS[name](size)}
      </span>
    );
  }
  // Fall through to the project's Icon library
  return <Icon name={name} size={size} className={className} style={style} />;
}
