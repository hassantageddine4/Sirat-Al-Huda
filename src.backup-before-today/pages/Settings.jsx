// src/pages/Settings.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { deleteAccount } from "../services/authService";
import { ReciterPickerRow } from "../components/quran/ReciterPicker";

const PRIVACY_URL = "https://sirat.app/privacy";
const TERMS_URL   = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

function ChevronRight() {
  return <span style={{ color: "#A09890", fontSize: 16 }}>›</span>;
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold text-muted tracking-[0.12em] uppercase px-1 mb-2">{title}</p>
      <div className="card overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ label, sub, onPress, right, danger, last }) {
  return (
    <button onClick={onPress}
      className={`w-full flex items-center gap-3 px-4 py-3.5 press text-left ${!last ? "border-b border-[#E8E2D8]" : ""}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-50" : "bg-primary/8"}`}>
        <div className={`w-2 h-2 rounded-full ${danger ? "bg-red-400" : "bg-primary/50"}`} />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${danger ? "text-red-500" : "text-ink"}`}>{label}</p>
        {sub && <p className="text-muted text-xs mt-0.5">{sub}</p>}
      </div>
      {right ?? <ChevronRight />}
    </button>
  );
}

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
      // signOut is called inside deleteAccount — AppContext listener clears state.
    } catch (err) {
      setDelError(err.message ?? "Account deletion failed. Please try again.");
    } finally {
      setDelLoad(false);
      setShowDel(false);
    }
  }

  return (
    <div className="screen bg-ivory">
      <div className="flex-shrink-0 pt-safe bg-white border-b border-[#E8E2D8]">
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center press">
            <span className="text-ink text-xl">‹</span>
          </button>
          <h1 className="text-ink text-xl font-bold flex-1">Settings</h1>
        </div>
      </div>

      <div className="scroll-area px-4 py-5">
        <Section title="Account">
          <Row label={userProfile.name ?? "Profile"}
               sub={userProfile.email ?? "Manage your profile"}
               onPress={() => {}} />
          <Row label="Language"
               sub={userProfile.language ?? "English"}
               onPress={() => {}} last />
        </Section>

        <Section title="Notifications">
          <Row label="Prayer Reminders"
               sub="Receive alerts before each prayer time"
               onPress={toggleNotifs}
               right={
                 <div onClick={toggleNotifs}
                   className={`w-11 h-6 rounded-full transition-colors relative ${notifs ? "bg-primary" : "bg-[#E8E2D8]"}`}>
                   <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs ? "translate-x-5" : "translate-x-0.5"}`} />
                 </div>
               } />
          <Row label="Notification Settings"
               sub="Manage in iOS Settings"
               onPress={() => {}} last />
        </Section>

        <Section title="Qur'an Audio">
          <div className="px-4 pt-3 pb-1">
            <ReciterPickerRow />
            <p className="text-xs text-muted mt-2 px-1">
              Your selected reciter is used for all surah audio playback.
            </p>
          </div>
        </Section>

        <Section title="Legal">
          <Row label="Privacy Policy"
               onPress={() => window.open(PRIVACY_URL, "_blank")} />
          <Row label="Terms of Service"
               sub="Apple EULA"
               onPress={() => window.open(TERMS_URL, "_blank")} />
          <Row label="Contact Support"
               sub="support@sirat.app"
               onPress={() => window.open("mailto:support@sirat.app", "_blank")} last />
        </Section>

        <Section title="About">
          <Row label="Rate Sirat on the App Store" onPress={() => {}} />
          <div className="px-4 py-3 text-center">
            <p className="text-muted text-xs">Sirat · Version 1.0.0</p>
          </div>
        </Section>

        <Section title="Account Actions">
          <Row label="Sign Out"
               onPress={async () => { if (confirm("Sign out of Sirat?")) await signOut(); }}
               danger />
          <Row label="Delete Account"
               sub="Permanently remove all your data"
               onPress={() => setShowDel(true)}
               danger last />
        </Section>
      </div>

      {/* Delete Account modal */}
      {showDel && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 px-6"
          onClick={() => !delLoad && setShowDel(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h2 className="text-ink text-xl font-bold text-center mb-2">Delete Account</h2>
            <p className="text-muted text-sm text-center leading-relaxed mb-2">
              This will permanently delete your account, all posts, journal entries, and personal data.
            </p>
            <p className="text-ink font-bold text-sm text-center mb-6">This cannot be undone.</p>

            {delError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm text-center">{delError}</p>
              </div>
            )}

            <button onClick={handleDelete} disabled={delLoad}
              className="w-full h-12 rounded-2xl bg-red-500 text-white font-bold text-sm mb-3 press disabled:opacity-60 flex items-center justify-center">
              {delLoad ? "Deleting…" : "Permanently Delete My Account"}
            </button>
            <button onClick={() => { setShowDel(false); setDelError(null); }} disabled={delLoad}
              className="w-full h-12 rounded-2xl border-[1.5px] border-[#E8E2D8] text-body font-semibold text-sm press disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
