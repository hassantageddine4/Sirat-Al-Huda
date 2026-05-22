// src/pages/account/NotificationSettings.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Notification Settings page.
//
// Lets the user:
//   - Master toggle (enable/disable all notifications)
//   - Per-prayer toggles (Fajr, Dhuhr, Asr, Maghrib, Isha)
//   - Per-reminder toggles + time pickers (Quran morning, dhikr, Quran midday,
//     Quran afternoon, evening prayer reminder, Tahajjud)
//
// Persists preferences via usePrayerNotifications hook (which writes to
// localStorage and triggers re-scheduling).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  accent: "#C8A951", accentLight: "#D9BF7A", accentDark: "#A88730",
  ivory: "#FAF7F2", ink: "#1C1814", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

const PRAYERS = [
  { key: "Fajr",    label: "Fajr",    arabic: "الفجر",   icon: "sunrise" },
  { key: "Dhuhr",   label: "Dhuhr",   arabic: "الظهر",   icon: "sun" },
  { key: "Asr",     label: "Asr",     arabic: "العصر",   icon: "sunset" },
  { key: "Maghrib", label: "Maghrib", arabic: "المغرب",  icon: "moon" },
  { key: "Isha",    label: "Isha",    arabic: "العشاء",  icon: "stars" },
];

const REMINDERS = [
  { key: "quranMorning",   label: "Morning Qur'an",      desc: "Daily verse to begin your day",      defaultHour: 9,  defaultMinute: 0  },
  { key: "dhikr",          label: "Dhikr Reminder",      desc: "Mid-morning remembrance",            defaultHour: 10, defaultMinute: 30 },
  { key: "quranMidday",    label: "Midday Reflection",   desc: "A short verse for the middle of the day", defaultHour: 12, defaultMinute: 30 },
  { key: "quranAfternoon", label: "Read Qur'an",         desc: "Late afternoon reading reminder",    defaultHour: 16, defaultMinute: 30 },
  { key: "evening",        label: "Prayer Check-in",     desc: "Have you prayed all five today?",    defaultHour: 19, defaultMinute: 30 },
  { key: "tahajjud",       label: "Tahajjud (optional)", desc: "Late-night prayer reminder",         defaultHour: 2,  defaultMinute: 30 },
];

export default function NotificationSettings() {
  const navigate = useNavigate();
  const {
    prefs,
    notifPermission,
    pendingCount,
    loading,
    toggleMasterNotif,
    togglePrayer,
    toggleReminder,
    setReminderTime,
    requestPermission,
  } = usePrayerNotifications();

  const masterOn = prefs?.notifEnabled ?? false;
  const permissionGranted = notifPermission === "granted";
  const permissionDenied  = notifPermission === "denied";

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="Notifications"
        subtitle="Spiritual reminders throughout the day"
        onBack={() => navigate(-1)}
      />

      <div className="scroll-area px-4 pt-4 pb-8" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Permission status banner */}
        {permissionDenied && (
          <div style={{
            background: "#fef2f2", borderRadius: 14, padding: 14,
            border: "1.5px solid #fecaca",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>
              Notifications are disabled
            </p>
            <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>
              To receive prayer alerts and spiritual reminders, enable notifications for Sirat Al Huda in your iOS Settings.
            </p>
          </div>
        )}

        {!permissionGranted && !permissionDenied && (
          <div style={{
            background: "white", borderRadius: 14, padding: 16,
            border: `1.5px solid ${C.accent}`,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 6 }}>
              Enable spiritual reminders
            </p>
            <p style={{ fontSize: 12, color: C.body, lineHeight: 1.55, marginBottom: 12 }}>
              Receive gentle reminders for prayer times, daily verses from the Qur'an, and moments of dhikr — without being overwhelmed.
            </p>
            <button
              onClick={requestPermission}
              className="press"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 12,
                background: C.primary, color: "white",
                fontSize: 13, fontWeight: 700, border: "none",
              }}>
              Allow Notifications
            </button>
          </div>
        )}

        {/* Master toggle */}
        <Card>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(15,61,46,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.primary, flexShrink: 0,
            }}>
              <Icon name="bell" size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>All Notifications</p>
              <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                {loading ? "Updating…"
                  : masterOn
                    ? `${pendingCount} reminders scheduled`
                    : "Currently disabled"}
              </p>
            </div>
            <Toggle on={masterOn} onToggle={toggleMasterNotif} disabled={!permissionGranted} />
          </div>
        </Card>

        {/* Prayer notifications */}
        <Section title="Prayer Times">
          <Card style={{ overflow: "hidden" }}>
            {PRAYERS.map((p, i) => (
              <ToggleRow
                key={p.key}
                iconName={p.icon}
                label={p.label}
                arabic={p.arabic}
                desc="Notification at prayer time"
                on={prefs?.prayers?.[p.key] !== false}
                onToggle={() => togglePrayer(p.key)}
                disabled={!masterOn || !permissionGranted}
                last={i === PRAYERS.length - 1}
              />
            ))}
          </Card>
        </Section>

        {/* Daily reminders */}
        <Section title="Daily Reminders">
          <Card style={{ overflow: "hidden" }}>
            {REMINDERS.map((r, i) => {
              const config = prefs?.[r.key] ?? {
                enabled: false,
                hour: r.defaultHour,
                minute: r.defaultMinute,
              };
              return (
                <ReminderRow
                  key={r.key}
                  reminder={r}
                  config={config}
                  onToggle={() => toggleReminder(r.key)}
                  onTimeChange={(hh, mm) => setReminderTime(r.key, hh, mm)}
                  disabled={!masterOn || !permissionGranted}
                  last={i === REMINDERS.length - 1}
                />
              );
            })}
          </Card>
        </Section>

        {/* Footer help */}
        <p style={{
          fontSize: 11, color: C.muted, textAlign: "center",
          paddingLeft: 16, paddingRight: 16, marginTop: 4,
          lineHeight: 1.55,
        }}>
          Notifications are scheduled locally on your device — no server required. Prayer alerts use your selected calculation method and madhab.
        </p>
      </div>
    </div>
  );
}

// ─── Building blocks ────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <p style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase", color: C.muted,
        paddingLeft: 4, marginBottom: 10,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 14,
      border: `0.5px solid ${C.border}`,
      boxShadow: "0 3px 10px rgba(10,8,6,0.05)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className="press"
      style={{
        width: 44, height: 26, borderRadius: 99,
        background: on ? C.primary : "rgba(15,61,46,0.15)",
        border: "none", flexShrink: 0,
        position: "relative",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.18s",
      }}>
      <div style={{
        position: "absolute",
        top: 2, left: on ? 20 : 2,
        width: 22, height: 22, borderRadius: "50%",
        background: "white",
        transition: "left 0.18s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

function ToggleRow({ iconName, label, arabic, desc, on, onToggle, disabled, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px",
      borderBottom: last ? "none" : `0.5px solid ${C.border}`,
      opacity: disabled ? 0.55 : 1,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: "rgba(15,61,46,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.primary, flexShrink: 0,
      }}>
        <Icon name={iconName} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{label}</p>
          {arabic && (
            <span dir="rtl" style={{
              fontFamily: "Amiri, serif", fontSize: 13,
              color: C.subtle,
            }}>{arabic}</span>
          )}
        </div>
        <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{desc}</p>
      </div>
      <Toggle on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

function ReminderRow({ reminder, config, onToggle, onTimeChange, disabled, last }) {
  const enabled = config?.enabled ?? false;
  const hour    = config?.hour ?? reminder.defaultHour;
  const minute  = config?.minute ?? reminder.defaultMinute;
  const timeLabel = formatTime12(hour, minute);

  return (
    <div style={{
      padding: "13px 16px",
      borderBottom: last ? "none" : `0.5px solid ${C.border}`,
      opacity: disabled ? 0.55 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "rgba(200,169,81,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.accentDark, flexShrink: 0,
        }}>
          <Icon name="bell" size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{reminder.label}</p>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{reminder.desc}</p>
        </div>
        <Toggle on={enabled} onToggle={onToggle} disabled={disabled} />
      </div>

      {enabled && (
        <div style={{ marginTop: 10, paddingLeft: 44 }}>
          <input
            type="time"
            value={`${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(n => parseInt(n, 10));
              onTimeChange(h, m);
            }}
            disabled={disabled}
            style={{
              fontSize: 13, color: C.ink,
              padding: "6px 10px", borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.ivory,
            }}
          />
          <span style={{
            fontSize: 11, color: C.muted, marginLeft: 10,
          }}>
            ({timeLabel})
          </span>
        </div>
      )}
    </div>
  );
}

function formatTime12(hour, minute) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12  = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  const mm   = String(minute).padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}
