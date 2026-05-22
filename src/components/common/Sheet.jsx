// src/components/common/Sheet.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable bottom-sheet modal. Portals to document.body so it always escapes
// parent stacking contexts (transforms, filters, contain, etc.) — preventing
// the recurring "modal traps the screen" bug.
//
// Usage:
//   <Sheet open={!!day} onClose={() => setDay(null)}>
//     <div>...content...</div>
//   </Sheet>
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function Sheet({
  open,
  onClose,
  children,
  maxWidth = 520,
  background = "#FAF7F2",
  zIndex = 9999,
}) {
  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background,
          width: "100%",
          maxWidth,
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 32px",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)",
          maxHeight: "85vh",
          overflowY: "auto",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(node, document.body);
}
