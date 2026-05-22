#!/usr/bin/env python3
"""Sirat Al Huda — Home.jsx prayer rows polish.

1. Sunrise/Sunset rows: render as slim info-only rows (sun glyph, no checkbox,
   muted typography, subtle tint). Not tappable.
2. currentIdx / nextIdx logic: skip Sunrise/Sunset so they can never claim
   the NEXT badge or current-prayer highlight.
3. Regular prayer rows: padding 9 -> 7 (further compresses the card).
"""

from pathlib import Path
import sys

FILE = Path.home() / "Downloads/sirat-capacitor-3/src/pages/Home.jsx"

if not FILE.exists():
    print(f"❌ Cannot find {FILE}")
    sys.exit(1)

src = FILE.read_text()
original = src

# ─── 1. Skip Sunrise/Sunset in current/next loop ──────────────────────────────
old_loop = """    for (let i = 0; i < PRAYERS.length; i++) {
      const t = timeToMinutes(PRAYERS[i].time);
      if (t == null) continue;
      if (t <= nowMins) cur = i;
      if (nxt === -1 && t > nowMins) nxt = i;
    }"""

new_loop = """    for (let i = 0; i < PRAYERS.length; i++) {
      if (PRAYERS[i].name === "Sunrise" || PRAYERS[i].name === "Sunset") continue;
      const t = timeToMinutes(PRAYERS[i].time);
      if (t == null) continue;
      if (t <= nowMins) cur = i;
      if (nxt === -1 && t > nowMins) nxt = i;
    }"""

if old_loop not in src:
    print("❌ Could not locate the currentIdx/nextIdx loop. Aborting.")
    sys.exit(1)
src = src.replace(old_loop, new_loop)

# ─── 2. Replace PrayerRow function ────────────────────────────────────────────
old_prayer_row = """function PrayerRow({ prayer, isLast, isChecked, isCurrent, isNext, countdown, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 press text-left"
      style={{
        paddingTop: 9, paddingBottom: 9,
        borderBottom: isLast ? "none" : "0.5px solid #E8E2D8",
        background: isChecked
          ? "rgba(15,61,46,0.02)"
          : isCurrent
            ? "rgba(200,169,81,0.05)"
            : "transparent",
        transition: "background 0.2s",
      }}>

      {/* Status indicator */}
      <div className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: 28, height: 28,
          background: isChecked
            ? "#0F3D2E"
            : isCurrent
              ? "#C8A951"
              : "transparent",
          border: !isChecked && !isCurrent
            ? "1.5px solid #E8E2D8"
            : "none",
          color: "white",
          transition: "all 0.2s",
        }}>
        {isChecked && <Icon name="check" size={13} />}
      </div>

      {/* Name + time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: "#1C1814",
          }}>
            {prayer.name}
          </span>
          {isNext && (
            <span style={{
              fontSize: 8.5, fontWeight: 800,
              padding: "2px 6px", borderRadius: 99,
              background: "#C8A951", color: "#082819",
              letterSpacing: "0.08em",
            }}>
              NEXT
            </span>
          )}
        </div>
        <span style={{
          fontSize: 11, color: "#7A7268",
          marginTop: 1, display: "block",
        }}>
          {prayer.time && prayer.time !== "—" ? formatTime(prayer.time) : prayer.time}
          {isNext && countdown && ` · in ${countdown}`}
        </span>
      </div>

      {/* Arabic name */}
      <span dir="rtl"
        style={{
          fontFamily: "Amiri, serif",
          fontSize: 14, color: "#A09890",
        }}>
        {prayer.arabic}
      </span>
    </button>
  );
}"""

new_prayer_row = """function PrayerRow({ prayer, isLast, isChecked, isCurrent, isNext, countdown, onToggle }) {
  const isInfoOnly = prayer.name === "Sunrise" || prayer.name === "Sunset";

  // ── Sunrise / Sunset: slim info row, not tappable ──
  if (isInfoOnly) {
    return (
      <div
        className="w-full flex items-center gap-3 px-4"
        style={{
          paddingTop: 5, paddingBottom: 5,
          borderBottom: isLast ? "none" : "0.5px solid #E8E2D8",
          background: "rgba(232,226,216,0.28)",
        }}>
        {/* Sun glyph */}
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ width: 28, height: 28 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="#C8A951" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="18" r="3.2" />
            <path d="M2 22h20" />
            <path d="M5 18h1M18 18h1M6.5 13.5l.7.7M17.5 13.5l-.7.7" />
            {prayer.name === "Sunrise" ? (
              <>
                <path d="M12 2v8" />
                <path d="m8.5 5.5 3.5-3.5 3.5 3.5" />
              </>
            ) : (
              <>
                <path d="M12 10V2" />
                <path d="m8.5 6.5 3.5 3.5 3.5-3.5" />
              </>
            )}
          </svg>
        </div>

        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#7A7268" }}>
            {prayer.name}
          </span>
          <span style={{ fontSize: 11, color: "#A09890" }}>
            {prayer.time && prayer.time !== "—" ? formatTime(prayer.time) : prayer.time}
          </span>
        </div>

        <span dir="rtl"
          style={{
            fontFamily: "Amiri, serif",
            fontSize: 12.5, color: "#A09890",
          }}>
          {prayer.arabic}
        </span>
      </div>
    );
  }

  // ── Real prayer rows ──
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 press text-left"
      style={{
        paddingTop: 7, paddingBottom: 7,
        borderBottom: isLast ? "none" : "0.5px solid #E8E2D8",
        background: isChecked
          ? "rgba(15,61,46,0.02)"
          : isCurrent
            ? "rgba(200,169,81,0.05)"
            : "transparent",
        transition: "background 0.2s",
      }}>

      {/* Status indicator */}
      <div className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: 28, height: 28,
          background: isChecked
            ? "#0F3D2E"
            : isCurrent
              ? "#C8A951"
              : "transparent",
          border: !isChecked && !isCurrent
            ? "1.5px solid #E8E2D8"
            : "none",
          color: "white",
          transition: "all 0.2s",
        }}>
        {isChecked && <Icon name="check" size={13} />}
      </div>

      {/* Name + time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: "#1C1814",
          }}>
            {prayer.name}
          </span>
          {isNext && (
            <span style={{
              fontSize: 8.5, fontWeight: 800,
              padding: "2px 6px", borderRadius: 99,
              background: "#C8A951", color: "#082819",
              letterSpacing: "0.08em",
            }}>
              NEXT
            </span>
          )}
        </div>
        <span style={{
          fontSize: 11, color: "#7A7268",
          marginTop: 1, display: "block",
        }}>
          {prayer.time && prayer.time !== "—" ? formatTime(prayer.time) : prayer.time}
          {isNext && countdown && ` · in ${countdown}`}
        </span>
      </div>

      {/* Arabic name */}
      <span dir="rtl"
        style={{
          fontFamily: "Amiri, serif",
          fontSize: 14, color: "#A09890",
        }}>
        {prayer.arabic}
      </span>
    </button>
  );
}"""

if old_prayer_row not in src:
    print("❌ Could not locate PrayerRow function (exact match). Aborting.")
    print("   The function may have been modified since the last edit.")
    sys.exit(1)
src = src.replace(old_prayer_row, new_prayer_row)

# ─── Write & confirm ──────────────────────────────────────────────────────────
if src == original:
    print("⚠️  No changes were made.")
    sys.exit(1)

FILE.write_text(src)
print("✓ All three edits applied to Home.jsx")
print("  • Sunrise/Sunset excluded from current/next selection")
print("  • PrayerRow rewritten with info-only branch for Sunrise/Sunset")
print("  • Regular prayer rows tightened to 7px padding")
