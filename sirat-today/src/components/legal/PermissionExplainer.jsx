// src/components/legal/PermissionExplainer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Pre-prompt explainer sheet. Shown ONCE before triggering the native iOS
// permission popup, so the user understands why we're asking. Apple's HIG
// allows (and encourages) this — what it forbids is showing your own popup
// that *imitates* the system one.
//
// Flow:
//   1. <PermissionExplainer> renders a sheet describing the use case
//   2. User taps "Continue" → onContinue fires → caller invokes the real
//      requestX() permissions service function → native popup appears
//   3. If user taps "Not now" → onCancel fires, no native popup is shown
//
// We do NOT auto-trigger the native prompt on screen mount. That behavior
// would be indistinguishable from a "permission grab" and is a fast track
// to App Store rejection.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Icon from "../common/Icon";

// Prebuilt copy for the four permissions Sirat actually uses.
// Keep these short, factual, and benefit-led.
export const PERMISSION_COPY = {
  location: {
    icon:    "pin",
    title:   "Allow location access",
    purpose: "Sirat uses your location to determine accurate prayer times for where you are and to point the qibla in the right direction.",
    privacy: "Your location stays on your device and is never sent to Sirat servers.",
    button:  "Continue",
  },
  notifications: {
    icon:    "alert",
    title:   "Allow notifications",
    purpose: "Receive a gentle reminder a few minutes before each prayer time, so you can prepare without missing salah.",
    privacy: "Reminders are scheduled locally on your device. No notification content is sent to a server.",
    button:  "Continue",
  },
  microphone: {
    icon:    "volume",
    title:   "Allow microphone access",
    purpose: "The recitation practice feature listens to your voice to provide feedback on your Qur'an recitation.",
    privacy: "Audio is processed locally on your device wherever possible. Nothing is recorded or stored without your action.",
    button:  "Continue",
  },
  speech: {
    icon:    "message",
    title:   "Allow speech recognition",
    purpose: "Sirat compares your recitation to the Qur'an text using on-device speech recognition.",
    privacy: "iOS handles the speech recognition. Sirat does not store transcripts.",
    button:  "Continue",
  },
  camera: {
    icon:    "user",
    title:   "Allow camera access",
    purpose: "Update your profile picture by taking a new photo.",
    privacy: "Photos are only sent if you choose to upload them.",
    button:  "Continue",
  },
};

export default function PermissionExplainer({
  permission,                  // key into PERMISSION_COPY
  onContinue,                  // () => triggers the real native prompt
  onCancel,                    // () => closes without prompting
  // Optional overrides
  title, purpose, privacy, icon, button,
}) {
  const copy = PERMISSION_COPY[permission] ?? {};
  const _icon    = icon    ?? copy.icon    ?? "info";
  const _title   = title   ?? copy.title   ?? "Permission needed";
  const _purpose = purpose ?? copy.purpose ?? "";
  const _privacy = privacy ?? copy.privacy ?? "";
  const _button  = button  ?? copy.button  ?? "Continue";

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perm-title"
      onClick={onCancel}>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-ivory w-full sm:max-w-md rounded-t-3xl px-6 pt-6"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
          animation: "permIn 280ms cubic-bezier(0.22,0.61,0.36,1) both",
        }}>

        {/* Drag handle */}
        <div className="mx-auto w-10 h-1 rounded-full bg-muted/30 mb-5" />

        {/* Icon hero */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center text-primary mb-4">
          <Icon name={_icon} size={26} />
        </div>

        {/* Title */}
        <h2
          id="perm-title"
          className="font-display text-2xl text-primary tracking-tight text-center leading-tight">
          {_title}
        </h2>

        {/* Purpose */}
        <p className="text-[14px] text-body leading-relaxed text-center mt-3">
          {_purpose}
        </p>

        {/* Privacy note — small and reassuring */}
        {_privacy && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-parchment/60 flex items-start gap-2.5">
            <Icon name="info" size={14} className="text-accent-dark mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-muted leading-relaxed">{_privacy}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={onContinue}
            className="press w-full py-3.5 rounded-full bg-primary text-ivory font-semibold text-[15px]">
            {_button}
          </button>
          <button
            onClick={onCancel}
            className="press w-full py-3 rounded-full text-body/70 font-medium text-[14px]">
            Not now
          </button>
        </div>

        {/* Tiny disclaimer */}
        <p className="text-center text-[11px] text-muted/60 mt-3">
          You'll be asked by iOS next.
        </p>
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
