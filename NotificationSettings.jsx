// src/pages/account/NotificationSettings.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Notifications Settings — premium iOS-style page.
//
// Layout:
//   • Permission banner (only when not granted)
//   • All Notifications card (master toggle, no count clutter)
//   • Prayer Times section (5 toggles)
//   • Daily Reminders section (6 reminder rows with time pickers)
//   • Quiet footer line
//
// Visual language:
//   - Emerald primary, gold accents, cream surface
//   - 0.5px hairline dividers (iOS standard)
//   - 14px corner radius on cards
//   - Single icon family across the screen
//   - Subtle elevation, no harsh shadows
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  primary:      "#0F3D2E",
  primaryLight: "#1A5C44",
  primaryDark:  "#082819",
  accent:       "#C8A951",
  accentLight:  "#D9BF7A",
  accentDark:   "#A88730",
  ivory:        "#FAF7F2",
  parchment:    "#EDE7D9",
  ink:          "#1C1814",
  body:         "#3A342C",
  muted:        "#7A7268",
  subtle:       "#A09890",
  hairline:     "rgba(60, 50, 40, 0.08)",  // iOS-style very thin divider
  cardBorder:   "rgba(60, 50, 40, 0.06)",
};

// ─── Prayer config (5 prayers) ──────────────────────────────────────────────
const PRAYERS = [
  { key: "Fajr",    label: "Fajr",    arabic: "الفجر",  icon: "sunrise" },
  { key: "Dhuhr",   label: "Dhuhr",   arabic: "الظهر",  icon: "mosque"  },
  { key: "Asr",     label: "Asr",     arabic: "العصر",  icon: "mihrab"  },
  { key: "Maghrib", label: "Maghrib", arabic: "المغرب", icon: "sunset"  },
  { key: "Isha",    label: "Isha",    arabic: "العشاء", icon: "moon"    },
];

// ─── Daily reminder config (6 types) ────────────────────────────────────────
const REMINDERS = [
  { key: "quranMorning",   label: "Morning Qur'an",      desc: "A daily verse to begin your day",         defaultHour: 9,  defaultMinute: 0  },
  { key: "dhikr",          label: "Dhikr Reminder",      desc: "A mid-morning moment of remembrance",     defaultHour: 10, defaultMinute: 30 },
  { key: "quranMidday",    label: "Midday Reflection",   desc: "A short verse for the middle of the day", defaultHour: 12, defaultMinute: 30 },
  { key: "quranAfternoon", label: "Read Qur'an",         desc: "A late-afternoon reading reminder",       defaultHour: 16, defaultMinute: 30 },
  { key: "evening",        label: "Prayer Check-in",     desc: "Have you prayed all five today?",         defaultHour: 19, defaultMinute: 30 },
  { key: "tahajjud",       label: "Tahajjud (optional)", desc: "Late-night prayer reminder",              defaultHour: 2,  defaultMinute: 30 },
];

// ═════════════════════════════════════════════════════════════════════════════

export default function NotificationSettings() {
  const navigate = useNavigate();
  const {
    prefs,
    notifPermission,
    loading,
    toggleMasterNotif,
    togglePrayer,
    toggleReminder,
    setReminderTime,
    requestPermission,
  } = usePrayerNotifications();

  const masterOn          = prefs?.notifEnabled ?? false;
  const permissionGranted = notifPermission === "granted";
  const permissionDenied  = notifPermission === "denied";
  const permissionPrompt  = !permissionGranted && !permissionDenied;

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader
        title="Notifications"
        subtitle="Spiritual reminders throughout the day"
        onBack={() => navigate(-1)}
      />

      <div
        className="scroll-area"
        style={{
          padding: "8px 16px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}>

        {/* ── Permission banner (only when permission isn't granted) ──────── */}
        {permissionDenied && <DeniedBanner />}
        {permissionPrompt  && <PromptBanner onAllow={requestPermission} />}

        {/* ── All Notifications master card ───────────────────────────────── */}
        <Card>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px",
          }}>
            <IconTile color={C.primary}>
              <Icon name="bell" size={18} />
            </IconTile>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 15, fontWeight: 600, color: C.ink,
                letterSpacing: "-0.01em",
              }}>
                All Notifications
              </p>
              <p style={{
                fontSize: 12, color: C.muted, marginTop: 2,
                lineHeight: 1.45,
              }}>
                {loading
                  ? "Updating…"
                  : "Spiritual reminders throughout the day"}
              </p>
            </div>

            <Toggle
              on={masterOn}
              onToggle={toggleMasterNotif}
              disabled={!permissionGranted}
            />
          </div>
        </Card>

        {/* ── Prayer Times section ────────────────────────────────────────── */}
        <Section title="Prayer Times">
          <Card>
            {PRAYERS.map((p, i) => (
              <PrayerRow
                key={p.key}
                prayer={p}
                on={prefs?.prayers?.[p.key] !== false}
                onToggle={() => togglePrayer(p.key)}
                disabled={!masterOn || !permissionGranted}
                last={i === PRAYERS.length - 1}
              />
            ))}
          </Card>
        </Section>

        {/* ── Daily Reminders section ─────────────────────────────────────── */}
        <Section title="Daily Reminders">
          <Card>
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

        {/* ── Quiet footer ────────────────────────────────────────────────── */}
        <p style={{
          fontSize: 11, color: C.subtle,
          textAlign: "center", lineHeight: 1.55,
          padding: "8px 24px 0",
        }}>
          Notifications are scheduled locally on your device. Prayer alerts use your selected calculation method and madhab.
        </p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Building blocks
// ═════════════════════════════════════════════════════════════════════════════

function Section({ title, children }) {
  return (
    <div>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.accentDark,
        paddingLeft: 6,
        marginBottom: 10,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 14,
      border: `0.5px solid ${C.cardBorder}`,
      boxShadow: "0 1px 2px rgba(10,8,6,0.03), 0 4px 12px rgba(10,8,6,0.04)",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

function IconTile({ children, color }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "rgba(15,61,46,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color ?? C.primary,
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

// iOS-style toggle (switch)
function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      aria-pressed={on}
      className="press"
      style={{
        width: 50,
        height: 30,
        borderRadius: 999,
        background: on ? C.primary : "rgba(15,61,46,0.18)",
        border: "none",
        flexShrink: 0,
        position: "relative",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.22s ease",
        padding: 0,
      }}>
      <div style={{
        position: "absolute",
        top: 2,
        left: on ? 22 : 2,
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: "white",
        transition: "left 0.22s ease",
        boxShadow: "0 1px 1px rgba(0,0,0,0.04), 0 3px 8px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

// Prayer-time row
function PrayerRow({ prayer, on, onToggle, disabled, last }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      borderBottom: last ? "none" : `0.5px solid ${C.hairline}`,
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s ease",
    }}>
      <IconTile>
        <Icon name={prayer.icon} size={18} />
      </IconTile>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}>
            {prayer.label}
          </p>
          <span dir="rtl" style={{
            fontFamily: "Amiri, 'Times New Roman', serif",
            fontSize: 14,
            color: C.subtle,
            fontWeight: 500,
          }}>
            {prayer.arabic}
          </span>
        </div>
        <p style={{
          fontSize: 12,
          color: C.muted,
          marginTop: 2,
          lineHeight: 1.45,
        }}>
          Notification at prayer time
        </p>
      </div>

      <Toggle on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

// Daily-reminder row with optional inline time picker
function ReminderRow({ reminder, config, onToggle, onTimeChange, disabled, last }) {
  const enabled = config?.enabled ?? false;
  const hour    = config?.hour   ?? reminder.defaultHour;
  const minute  = config?.minute ?? reminder.defaultMinute;
  const timeLabel = formatTime12(hour, minute);

  return (
    <div style={{
      borderBottom: last ? "none" : `0.5px solid ${C.hairline}`,
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s ease",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
      }}>
        <IconTile color={C.accentDark}>
          <Icon name="bell" size={18} />
        </IconTile>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}>
            {reminder.label}
          </p>
          <p style={{
            fontSize: 12,
            color: C.muted,
            marginTop: 2,
            lineHeight: 1.45,
          }}>
            {reminder.desc}
          </p>
        </div>

        <Toggle on={enabled} onToggle={onToggle} disabled={disabled} />
      </div>

      {enabled && !disabled && (
        <div style={{
          padding: "0 18px 14px",
          marginLeft: 50, // align with text column (icon width + gap)
        }}>
          <TimePicker
            hour={hour}
            minute={minute}
            label={timeLabel}
            onChange={onTimeChange}
          />
        </div>
      )}
    </div>
  );
}

// Refined time picker — iOS-feeling input + caption
function TimePicker({ hour, minute, label, onChange }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      borderRadius: 10,
      background: C.ivory,
      border: `0.5px solid ${C.cardBorder}`,
    }}>
      <input
        type="time"
        value={`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
        onChange={(e) => {
          const [h, m] = e.target.value.split(":").map(n => parseInt(n, 10));
          if (!Number.isNaN(h) && !Number.isNaN(m)) onChange(h, m);
        }}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.ink,
          background: "transparent",
          border: "none",
          outline: "none",
          padding: 0,
          fontFamily: "inherit",
        }}
      />
      <span style={{
        fontSize: 11,
        color: C.subtle,
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── Permission banners ─────────────────────────────────────────────────────

function DeniedBanner() {
  return (
    <div style={{
      background: "#FEF6F4",
      borderRadius: 14,
      padding: "14px 16px",
      border: "0.5px solid rgba(220, 60, 50, 0.18)",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "rgba(220, 60, 50, 0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#C42B1C", flexShrink: 0,
      }}>
        <Icon name="alert" size={16} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#922018", marginBottom: 4 }}>
          Notifications are disabled
        </p>
        <p style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.5 }}>
          To receive prayer alerts and spiritual reminders, enable notifications for Sirat Al Huda in your iOS Settings.
        </p>
      </div>
    </div>
  );
}

function PromptBanner({ onAllow }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 14,
      padding: 18,
      border: `0.5px solid ${C.accentLight}`,
      boxShadow: "0 1px 2px rgba(10,8,6,0.03), 0 6px 18px rgba(168, 135, 48, 0.08)",
    }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 6 }}>
        Enable spiritual reminders
      </p>
      <p style={{ fontSize: 13, color: C.body, lineHeight: 1.55, marginBottom: 14 }}>
        Receive gentle reminders for prayer times, daily verses from the Qur'an, and moments of dhikr — without being overwhelmed.
      </p>
      <button
        onClick={onAllow}
        className="press"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          background: C.primary,
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          border: "none",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}>
        Allow Notifications
      </button>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime12(hour, minute) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12  = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  const mm   = String(minute).padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}
