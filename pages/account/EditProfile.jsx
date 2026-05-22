// src/pages/account/EditProfile.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Simple Edit Profile page. Name + display preferences. Saves via useApp.updateProfile.
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

export default function EditProfile() {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useApp();
  const [name, setName] = useState(userProfile?.name ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({ name });
      }
      navigate(-1);
    } catch (err) {
      alert("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Edit Profile"
        onBack={() => navigate(-1)}
      />
      <div className="scroll-area px-4 pt-4 pb-8">
        <div style={{
          background: "white", borderRadius: 14, border: `0.5px solid ${C.border}`,
          padding: 16, boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
        }}>
          <label style={{
            fontSize: 11, color: C.muted, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            display: "block", marginBottom: 6,
          }}>
            Display Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: "100%", fontSize: 15, color: C.ink,
              padding: "10px 12px", borderRadius: 10,
              border: `1px solid ${C.border}`, background: C.ivory,
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="press"
          style={{
            marginTop: 16, width: "100%",
            background: saving || !name.trim() ? C.muted : C.primary,
            color: "white", fontSize: 14, fontWeight: 700,
            padding: "14px", borderRadius: 14, border: "none",
            cursor: saving || !name.trim() ? "not-allowed" : "pointer",
          }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
