// src/components/common/ScreenHeader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable iOS-style screen header.
//
//   <ScreenHeader title="Journal" subtitle="مذكرات روحية" />
//   <ScreenHeader title="Hadith" onBack={() => navigate(-1)} />
//   <ScreenHeader title="Settings" rightAction={{ icon: ..., onClick: ... }} />
//
// Auto-back: if onBack isn't supplied, defaults to navigate(-1).
// Offline pill: shows a subtle "Offline" badge below the subtitle when the
//   device has no connectivity. Driven by AppContext's isOnline.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useApp } from "../../context/AppContext";

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,        // { label, icon, onClick }
  showBack = true,
  className = "",
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const { isOnline } = useApp();

  return (
    <header
      className={`flex-shrink-0 px-4 pt-3 pb-2 flex items-center gap-2 bg-ivory ${className}`}
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>

      {showBack && (
        <button
          onClick={handleBack}
          aria-label="Back"
          className="press w-9 h-9 -ml-2 rounded-full flex items-center justify-center hover:bg-parchment">
          <Icon name="back" size={20} className="text-primary" />
        </button>
      )}

      <div className="flex-1 min-w-0 text-center px-2">
        {title && (
          <h1 className="font-display text-base text-primary tracking-tight leading-tight truncate">
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className="text-[12px] text-accent-dark/80 leading-tight truncate"
            style={{ fontFamily: "Amiri, serif" }}>
            {subtitle}
          </p>
        )}
        {!isOnline && <OfflinePill />}
      </div>

      {rightAction ? (
        <button
          onClick={rightAction.onClick}
          aria-label={rightAction.label}
          className="press w-9 h-9 -mr-2 rounded-full flex items-center justify-center hover:bg-parchment">
          {rightAction.icon}
        </button>
      ) : (
        // Spacer so the title stays centered when only the back button is on the left
        showBack && <div className="w-9 h-9 -mr-2" aria-hidden="true" />
      )}
    </header>
  );
}

function OfflinePill() {
  return (
    <div
      role="status"
      aria-label="Offline"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "1px 8px",
        marginTop: 3,
        borderRadius: 999,
        background: "rgba(122, 114, 104, 0.10)",
        color: "#7A7268",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}>
      <span
        aria-hidden="true"
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: "#C8A951",
        }} />
      Offline
    </div>
  );
}
