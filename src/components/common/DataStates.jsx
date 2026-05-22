// src/components/common/DataStates.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in loading / empty / error states for any data-fetching screen.
//
//   <LoadingState label="Loading hadiths…" />
//   <EmptyState title="No bookmarks yet" description="..." icon={<Icon ... />} />
//   <ErrorRetry message="Couldn't load." onRetry={refetch} />
//   <InlineError message="..." />
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "./Icon";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
      <div
        style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "2px solid rgba(15,61,46,0.15)",
          borderTopColor: "#0F3D2E",
          animation: "spin 0.9s linear infinite",
        }}
        aria-hidden="true"
      />
      <p className="text-[12px] text-muted">{label}</p>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-2">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-parchment flex items-center justify-center text-muted mb-2">
          {icon}
        </div>
      )}
      {title && (
        <p className="font-display text-lg text-primary tracking-tight">{title}</p>
      )}
      {description && (
        <p className="text-[13px] text-muted leading-relaxed max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorRetry({ message = "Something went wrong.", onRetry, retryLabel = "Try again" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-2.5">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-1">
        <Icon name="warning" size={22} />
      </div>
      <p className="font-display text-base text-primary tracking-tight">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="press mt-2 px-4 py-2 rounded-full bg-primary text-ivory text-[13px] font-semibold flex items-center gap-1.5">
          <Icon name="refresh" size={12} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function InlineError({ message }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
      <Icon name="alert" size={14} className="text-red-700 flex-shrink-0" />
      <p className="text-[12px] text-red-800 leading-tight">{message}</p>
    </div>
  );
}
