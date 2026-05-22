// src/pages/account/LanguagePicker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Language preference picker. Currently English is the only fully supported
// language; others show as "Coming soon."
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", accent: "#C8A951",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

const LANGUAGES = [
  { id: "en", label: "English",  native: "English",  available: true  },
  { id: "ar", label: "Arabic",   native: "العربية",   available: false },
  { id: "ur", label: "Urdu",     native: "اردو",       available: false },
  { id: "id", label: "Indonesian", native: "Bahasa Indonesia", available: false },
  { id: "tr", label: "Turkish",  native: "Türkçe",   available: false },
  { id: "fr", label: "French",   native: "Français", available: false },
  { id: "es", label: "Spanish",  native: "Español",  available: false },
];

export default function LanguagePicker() {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useApp() ?? {};
  const [selected, setSelected] = useState(userProfile?.language ?? "English");

  async function pick(lang) {
    if (!lang.available) return;
    setSelected(lang.label);
    if (updateProfile) {
      try {
        await updateProfile({ language: lang.label });
      } catch {}
    }
    navigate(-1);
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Language"
        onBack={() => navigate(-1)}
      />
      <div className="scroll-area px-4 pt-4 pb-nav">
        <div style={{
          background: "white", borderRadius: 14,
          border: `0.5px solid ${C.border}`,
          boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
          overflow: "hidden",
        }}>
          {LANGUAGES.map((lang, i) => {
            const isSelected = selected === lang.label;
            return (
              <button
                key={lang.id}
                onClick={() => pick(lang)}
                disabled={!lang.available}
                className="press"
                style={{
                  width: "100%", textAlign: "left",
                  padding: "14px 16px",
                  borderBottom: i < LANGUAGES.length - 1 ? `0.5px solid ${C.border}` : "none",
                  background: "transparent",
                  border: "none",
                  cursor: lang.available ? "pointer" : "not-allowed",
                  opacity: lang.available ? 1 : 0.5,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {lang.label}
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                    {lang.native}
                    {!lang.available && " · Coming soon"}
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    color: C.primary, display: "flex",
                  }}>
                    <Icon name="check" size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p style={{
          fontSize: 11, color: C.muted, marginTop: 12, paddingLeft: 4,
          lineHeight: 1.5,
        }}>
          Sirat is currently available in English. We're working on bringing it to more languages — thank you for your patience.
        </p>
      </div>
    </div>
  );
}
