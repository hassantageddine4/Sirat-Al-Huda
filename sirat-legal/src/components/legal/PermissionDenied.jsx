// src/components/legal/PermissionDenied.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shown after a permission has been denied. iOS only allows the native
// permission popup once, so the only way back is the system Settings app.
// We deep-link via app-settings: which lands directly on Sirat's pane.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "../common/Icon";
import { openAppSettings } from "../../services/permissionsService";
import { PERMISSION_COPY } from "./PermissionExplainer";

export default function PermissionDenied({ permission, onClose }) {
  const copy = PERMISSION_COPY[permission] ?? {};
  const _icon  = copy.icon ?? "info";
  const _label = (copy.title ?? "permission").replace(/^Allow /i, "");

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-ivory w-full sm:max-w-md rounded-t-3xl px-6 pt-6"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
          animation: "permIn 280ms cubic-bezier(0.22,0.61,0.36,1) both",
        }}>

        <div className="mx-auto w-10 h-1 rounded-full bg-muted/30 mb-5" />

        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
          <Icon name={_icon} size={26} />
        </div>

        <h2 className="font-display text-2xl text-primary tracking-tight text-center leading-tight">
          {_label} is off
        </h2>

        <p className="text-[14px] text-body leading-relaxed text-center mt-3">
          You'll need to enable it in iOS Settings to use this feature. iOS doesn't allow apps to re-show the permission popup once it's been denied.
        </p>

        <div className="mt-5 space-y-2">
          <button
            onClick={async () => {
              await openAppSettings();
              onClose();
            }}
            className="press w-full py-3.5 rounded-full bg-primary text-ivory font-semibold text-[15px]">
            Open Settings
          </button>
          <button
            onClick={onClose}
            className="press w-full py-3 rounded-full text-body/70 font-medium text-[14px]">
            Not now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes permIn {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
