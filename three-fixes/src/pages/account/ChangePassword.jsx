// src/pages/account/ChangePassword.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Change password screen. Uses Supabase auth via useApp.changePassword (if exposed)
// or falls back to a placeholder message.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import ScreenHeader from "../../components/common/ScreenHeader";

const C = {
  primary: "#0F3D2E", accent: "#C8A951",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268",
  border: "#E8E2D8",
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, supabase } = useApp() ?? {};
  const [current, setCurrent] = useState("");
  const [next, setNext]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  async function submit() {
    setError("");
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation don't match.");
      return;
    }
    setSaving(true);
    try {
      // Try the AppContext-provided helper first
      if (changePassword) {
        await changePassword({ current, next });
      } else if (supabase?.auth?.updateUser) {
        const { error: e } = await supabase.auth.updateUser({ password: next });
        if (e) throw e;
      } else {
        throw new Error("Password change is not available right now.");
      }
      navigate(-1);
    } catch (err) {
      setError(err.message ?? "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Change Password"
        onBack={() => navigate(-1)}
      />
      <div className="scroll-area px-4 pt-4 pb-8">
        <div style={{
          background: "white", borderRadius: 14, border: `0.5px solid ${C.border}`,
          padding: 16, boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <Field label="Current Password" value={current} onChange={setCurrent} />
          <Field label="New Password"     value={next}    onChange={setNext} />
          <Field label="Confirm New Password" value={confirm} onChange={setConfirm} />
        </div>

        {error && (
          <p style={{
            marginTop: 12, fontSize: 12, color: "#dc2626",
            paddingLeft: 4,
          }}>{error}</p>
        )}

        <button
          onClick={submit}
          disabled={saving}
          className="press"
          style={{
            marginTop: 16, width: "100%",
            background: saving ? C.muted : C.primary,
            color: "white", fontSize: 14, fontWeight: 700,
            padding: "14px", borderRadius: 14, border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}>
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label style={{
        fontSize: 11, color: C.muted, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        display: "block", marginBottom: 6,
      }}>
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="new-password"
        style={{
          width: "100%", fontSize: 15, color: C.ink,
          padding: "10px 12px", borderRadius: 10,
          border: `1px solid ${C.border}`, background: C.ivory,
          outline: "none",
        }}
      />
    </div>
  );
}
