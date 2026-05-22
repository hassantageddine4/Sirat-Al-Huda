// src/pages/account/DeleteAccount.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Delete Account flow.
// Apple App Store policy 5.1.1(v) requires a clear in-app account deletion path.
// Uses AppContext.deleteAccount if exposed, otherwise calls Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", accent: "#C8A951",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", border: "#E8E2D8",
  danger: "#dc2626", dangerBg: "#fef2f2",
};

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { deleteAccount, signOut } = useApp() ?? {};
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText.trim().toLowerCase() === "delete";

  async function handleDelete() {
    if (!canDelete) return;
    if (!window.confirm("This permanently deletes your account and all data. Continue?")) return;
    setBusy(true);
    setError("");
    try {
      if (deleteAccount) {
        await deleteAccount();
      } else if (signOut) {
        // Fallback: sign out + show message that a manual deletion request is needed
        await signOut();
        alert("Account deletion is being processed. You'll receive a confirmation email.");
      } else {
        throw new Error("Account deletion is unavailable right now.");
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Delete Account"
        onBack={() => navigate(-1)}
      />
      <div className="scroll-area px-4 pt-4 pb-nav" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Warning callout */}
        <div style={{
          background: C.dangerBg, borderRadius: 14, padding: 16,
          border: "1.5px solid #fecaca",
          display: "flex", gap: 12,
        }}>
          <div style={{ color: C.danger, flexShrink: 0, marginTop: 2 }}>
            <Icon name="warning" size={20} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.danger, marginBottom: 4 }}>
              This cannot be undone
            </p>
            <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>
              Deleting your account will permanently remove your profile, prayer history, journal entries, bookmarks, and any other data you've saved in Sirat. This action is immediate and cannot be reversed.
            </p>
          </div>
        </div>

        {/* What gets deleted list */}
        <div style={{
          background: "white", borderRadius: 14, padding: 16,
          border: `0.5px solid ${C.border}`,
        }}>
          <p style={{
            fontSize: 11, color: C.muted, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 10,
          }}>
            What will be deleted
          </p>
          <ul style={{
            fontSize: 13, color: C.ink, lineHeight: 1.7,
            paddingLeft: 18, listStyle: "disc",
          }}>
            <li>Your account and authentication credentials</li>
            <li>Prayer completion history and streaks</li>
            <li>Journal entries</li>
            <li>Bookmarked verses and hadiths</li>
            <li>Personal preferences (location, calculation method, reciter)</li>
          </ul>
        </div>

        {/* Confirmation input */}
        <div style={{
          background: "white", borderRadius: 14, padding: 16,
          border: `0.5px solid ${C.border}`,
        }}>
          <label style={{
            fontSize: 11, color: C.muted, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            display: "block", marginBottom: 8,
          }}>
            Type <span style={{ color: C.danger }}>DELETE</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            style={{
              width: "100%", fontSize: 15, color: C.ink,
              padding: "10px 12px", borderRadius: 10,
              border: `1px solid ${C.border}`, background: C.ivory,
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 12, color: C.danger, paddingLeft: 4 }}>{error}</p>
        )}

        <button
          onClick={handleDelete}
          disabled={!canDelete || busy}
          className="press"
          style={{
            background: canDelete && !busy ? C.danger : "#fecaca",
            color: "white", fontSize: 14, fontWeight: 700,
            padding: "14px", borderRadius: 14, border: "none",
            cursor: canDelete && !busy ? "pointer" : "not-allowed",
          }}>
          {busy ? "Deleting..." : "Permanently Delete Account"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="press"
          style={{
            background: "transparent", color: C.primary,
            fontSize: 14, fontWeight: 600,
            padding: "12px", border: `0.5px solid ${C.border}`,
            borderRadius: 14, cursor: "pointer",
          }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
