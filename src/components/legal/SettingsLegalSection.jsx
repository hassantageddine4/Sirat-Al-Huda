// src/components/legal/SettingsLegalSection.jsx
// ─────────────────────────────────────────────────────────────────────────────
// "Legal" section for the Settings page. iOS-style grouped list rows.
//
// Drop into Settings.jsx anywhere below your account settings:
//
//   import SettingsLegalSection from "../components/legal/SettingsLegalSection";
//   ...
//   <SettingsLegalSection />
//
// External links (Apple EULA, Contact email) open in the system browser /
// Mail app via the openExternal helper, matching iOS conventions.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import { openExternal } from "../../services/permissionsService";

const APPLE_EULA_URL =
  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

// Update this to your real support address before submitting to App Store
const SUPPORT_EMAIL = "support@sirat.app";

export default function SettingsLegalSection() {
  const navigate = useNavigate();

  const rows = [
    {
      icon: "scroll",
      label: "Terms of Service",
      sub:   "How Sirat may be used",
      onClick: () => navigate("/legal/terms"),
    },
    {
      icon: "info",
      label: "Privacy Policy",
      sub:   "What we collect and why",
      onClick: () => navigate("/legal/privacy"),
    },
    {
      icon: "external",
      label: "Apple Standard EULA",
      sub:   "Required by the App Store",
      onClick: () => openExternal(APPLE_EULA_URL),
      external: true,
    },
    {
      icon: "message",
      label: "Contact Support",
      sub:   SUPPORT_EMAIL,
      onClick: () => openExternal(`mailto:${SUPPORT_EMAIL}?subject=Sirat%20support`),
      external: true,
    },
  ];

  return (
    <section className="mt-6">
      {/* Section header — iOS Settings convention */}
      <h3 className="px-5 pb-2 text-[11px] tracking-[0.18em] uppercase text-muted font-semibold">
        Legal
      </h3>

      <ul className="mx-4 rounded-2xl bg-white/70 border border-border/60 overflow-hidden">
        {rows.map((row, idx) => (
          <li
            key={row.label}
            className={idx > 0 ? "border-t border-border/40" : ""}>
            <button
              onClick={row.onClick}
              className="press w-full flex items-center gap-3 px-4 py-3.5 text-left">

              <div className="w-8 h-8 rounded-lg bg-parchment flex items-center justify-center text-primary flex-shrink-0">
                <Icon name={row.icon} size={15} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-ink font-medium">{row.label}</p>
                {row.sub && (
                  <p className="text-[11px] text-muted truncate">{row.sub}</p>
                )}
              </div>

              <Icon
                name={row.external ? "external" : "forward"}
                size={14}
                className="text-muted flex-shrink-0"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* App version footer */}
      <p className="text-center text-[11px] text-muted/60 mt-4">
        Sirat Al Huda · v{import.meta.env?.VITE_APP_VERSION ?? "1.0.0"}
      </p>
    </section>
  );
}
