// src/pages/Settings.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Settings — premium iOS-style grouped list. No emojis, no decorative dots.
// Every row uses a real icon from the Icon library.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { deleteAccount } from "../services/authService";
import Icon from "../components/common/Icon";
import { Share } from "@capacitor/share";

const SUPPORT_EMAIL = "support@sirat.app";

// ─── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <section className="mb-5">
      <p className="text-[11px] font-bold text-muted tracking-[0.18em] uppercase px-1.5 mb-2">
        {title}
      </p>
      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        {children}
      </div>
    </section>
  );
}

// ─── Row ────────────────────────────────────────────────────────────────────
function Row({ icon, label, sub, onPress, right, danger, last }) {
  return (
    <button
      onClick={onPress}
      className={`w-full flex items-center gap-3 px-4 py-3.5 press text-left transition-colors hover:bg-parchment/40 ${
        !last ? "border-b border-border/40" : ""
      }`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        danger ? "bg-red-50 text-red-600" : "bg-primary/8 text-primary"
      }`}>
        <Icon name={icon} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-semibold ${danger ? "text-red-600" : "text-ink"}`}>
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-muted mt-0.5 truncate">{sub}</p>
        )}
      </div>
      {right ?? (
        <Icon name="forward" size={14} className="text-muted/60 flex-shrink-0" />
      )}
    </button>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function Settings() {
  const navigate = useNavigate();
  const { userProfile, signOut, updateProfile } = useApp();

  const [notifs,   setNotifs]   = useState(userProfile.notificationsEnabled ?? true);
  const [showDel,  setShowDel]  = useState(false);
  const [delLoad,  setDelLoad]  = useState(false);
  const [delError, setDelError] = useState(null);

  function toggleNotifs() {
    const next = !notifs;
    setNotifs(next);
    updateProfile({ notificationsEnabled: next });
  }

  async function handleDelete() {
    setDelLoad(true);
    setDelError(null);
    try {
      await deleteAccount();
    } catch (err) {
      setDelError(err.message ?? "Account deletion failed. Please try again.");
    } finally {
      setDelLoad(false);
      setShowDel(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        title: "Sirat Al Huda",
        text: "I am using Sirat Al Huda for my daily Islamic practice. You should try it.",
        url: "https://apps.apple.com/app/id000000000",
        dialogTitle: "Share Sirat Al Huda",
      });
    } catch (_) { /* user cancelled or unavailable */ }
  }

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe bg-white border-b border-border/60">
        <div className="flex items-center px-3 py-3 gap-1">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="press w-10 h-10 flex items-center justify-center rounded-full hover:bg-parchment">
            <Icon name="back" size={20} className="text-ink" />
          </button>
          <h1 className="text-ink text-xl font-bold flex-1 text-center pr-10">
            Settings
          </h1>
        </div>
      </div>

      <div className="scroll-area px-4 py-5">

        {/* Account */}
        <Section title="Account">
          <Row
            icon="user"
            label={userProfile.name ?? "Profile"}
            sub={userProfile.email ?? "Manage your profile"}
            onPress={() => navigate("/profile")}
          />
          <Row
            icon="globe"
            label="Language"
            sub={userProfile.language ?? "English"}
            onPress={() => {}}
            last
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row
            icon="bell"
            label="Prayer Reminders"
            sub="Receive alerts before each prayer time"
            onPress={toggleNotifs}
            right={
              <button
                onClick={(e) => { e.stopPropagation(); toggleNotifs(); }}
                role="switch"
                aria-checked={notifs}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  notifs ? "bg-primary" : "bg-border"
                }`}>
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notifs ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            }
          />
          <Row
            icon="settings"
            label="Notification Settings"
            onPress={() => navigate("/account/notifications")}
            sub="Prayer alerts and daily reminders"
            last
          />
        </Section>


        {/* Support */}
        <Section title="Support">
          <Row
            icon="message"
            label="Send feedback"
            sub="Help us improve Sirat"
            onPress={() =>
              window.open(`mailto:${SUPPORT_EMAIL}?subject=Sirat%20feedback`, "_blank")
            }
          />
          <Row
            icon="share"
            label="Share with a friend"
            sub="Invite others to use Sirat"
            onPress={handleShare}
            last
          />
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <Row
            icon="info"
            label="Privacy Policy"
            sub="How we handle your data"
            onPress={() => navigate("/legal/privacy")}
          />
          <Row
            icon="scroll"
            label="Terms of Service"
            sub="How Sirat may be used"
            onPress={() => navigate("/legal/terms")}
          />
          <Row
            icon="external"
            label="Apple Standard EULA"
            sub="Required by the App Store"
            onPress={() =>
              window.open(
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
                "_blank"
              )
            }
          />
        </Section>

        {/* About */}
        <Section title="About">
          <Row
            icon="star"
            label="Rate Sirat on the App Store"
            sub="Help others find the app"
            onPress={() => {}}
            last
          />
        </Section>

        {/* App version footer (separate, not a row) */}
        <div className="text-center pt-1 pb-4">
          <p className="text-[11px] text-muted/70">Sirat Al Huda · Version 1.0.0</p>
        </div>

        {/* Account actions */}
        <Section title="Account">
          <Row
            icon="arrowRight"
            label="Sign Out"
            onPress={async () => {
              if (window.confirm("Sign out of Sirat?")) await signOut();
            }}
          />
          <Row
            icon="trash"
            label="Delete Account"
            sub="Permanently remove all your data"
            onPress={() => setShowDel(true)}
            danger
            last
          />
        </Section>
      </div>

      {/* Delete Account modal */}
      {showDel && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={() => !delLoad && setShowDel(false)}>
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}>

            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-red-600">
              <Icon name="trash" size={26} />
            </div>

            <h2 className="text-ink text-xl font-bold text-center mb-2">
              Delete Account
            </h2>
            <p className="text-muted text-sm text-center leading-relaxed mb-2">
              This will permanently delete your account, all posts, journal entries, and personal data.
            </p>
            <p className="text-ink font-bold text-sm text-center mb-6">
              This cannot be undone.
            </p>

            {delError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <Icon name="alert" size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-[13px] leading-relaxed">{delError}</p>
              </div>
            )}

            <button
              onClick={handleDelete}
              disabled={delLoad}
              className="w-full h-12 rounded-2xl bg-red-500 text-white font-bold text-sm mb-3 press disabled:opacity-60 flex items-center justify-center gap-2">
              {delLoad ? "Deleting…" : "Permanently Delete My Account"}
            </button>
            <button
              onClick={() => { setShowDel(false); setDelError(null); }}
              disabled={delLoad}
              className="w-full h-12 rounded-2xl border-[1.5px] border-border text-body font-semibold text-sm press disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
