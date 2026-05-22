import { useApp } from "../context/AppContext";
import { useServerPushPrefs } from "../hooks/useServerPushPrefs";

/**
 * Settings screen for server-side prayer push notifications.
 * Renders only the per-prayer enable toggles + Tahajjud opt-in.
 * Location/method live on the existing Prayer Times settings screen.
 */
export default function ServerPushSettings() {
  // AppContext shape may vary — try both `session` and `user`.
  const app = useApp() || {};
  const userId = app.session?.user?.id || app.user?.id || null;

  const { prefs, loading, saving, updatePref } = useServerPushPrefs(userId);

  if (!userId) return <div className="sps-empty">Sign in to manage notifications.</div>;
  if (loading) return <div className="sps-empty">Loading preferences…</div>;
  if (!prefs)
    return (
      <div className="sps-empty">
        No preferences found. Open Prayer Times and set your location first.
      </div>
    );

  const Toggle = ({ label, name, sub }) => (
    <label className="sps-row">
      <span className="sps-row-text">
        <span className="sps-row-label">{label}</span>
        {sub && <span className="sps-row-sub">{sub}</span>}
      </span>
      <input
        type="checkbox"
        className="sps-toggle"
        checked={!!prefs[name]}
        disabled={saving}
        onChange={(e) => updatePref({ [name]: e.target.checked })}
      />
    </label>
  );

  return (
    <div className="sps-screen">
      <header className="sps-header">
        <h1>Prayer Reminders</h1>
        <p>
          Receive a push notification at each prayer time — even when the app is
          closed or your phone is offline.
        </p>
      </header>

      <section className="sps-group">
        <div className="sps-group-title">Obligatory Prayers</div>
        <Toggle label="Fajr"    name="fajr_enabled" />
        <Toggle label="Dhuhr"   name="dhuhr_enabled" />
        <Toggle label="Asr"     name="asr_enabled" />
        <Toggle label="Maghrib" name="maghrib_enabled" />
        <Toggle label="Isha"    name="isha_enabled" />
      </section>

      <section className="sps-group">
        <div className="sps-group-title">Voluntary</div>
        <Toggle
          label="Tahajjud"
          name="tahajjud_enabled"
          sub="Wake-up reminder before Fajr."
        />
        {prefs.tahajjud_enabled && (
          <div className="sps-slider-row">
            <div className="sps-row-text">
              <span className="sps-row-label">Remind me before Fajr</span>
              <span className="sps-row-sub">
                {prefs.tahajjud_minutes_before_fajr} minutes earlier
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={prefs.tahajjud_minutes_before_fajr}
              disabled={saving}
              onChange={(e) =>
                updatePref({ tahajjud_minutes_before_fajr: Number(e.target.value) })
              }
              className="sps-slider"
            />
          </div>
        )}
      </section>

      <footer className="sps-foot">
        Notifications are sent based on your location and calculation method.
        Update offsets in <em>Prayer Times → Adjustments</em> to match your local masjid.
      </footer>

      <style>{`
        .sps-screen {
          padding: 1.25rem 1rem 4rem;
          max-width: 640px;
          margin: 0 auto;
          color: var(--text-primary, #efe9d9);
        }
        .sps-header h1 {
          font-size: 1.45rem;
          margin: 0 0 0.4rem;
          letter-spacing: -0.01em;
        }
        .sps-header p {
          margin: 0 0 1.6rem;
          color: var(--text-secondary, rgba(239,233,217,0.65));
          font-size: 0.93rem;
          line-height: 1.5;
        }
        .sps-group {
          background: var(--surface, rgba(255,255,255,0.04));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 0.1rem 1rem;
          margin-bottom: 1.2rem;
        }
        .sps-group-title {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--gold, #c9a96b);
          padding: 0.95rem 0 0.6rem;
          font-weight: 600;
        }
        .sps-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
        }
        .sps-row:first-of-type, .sps-group-title + .sps-row { border-top: none; }
        .sps-row-text { display: flex; flex-direction: column; gap: 0.18rem; min-width: 0; }
        .sps-row-label { font-size: 1rem; }
        .sps-row-sub {
          color: var(--text-secondary, rgba(239,233,217,0.55));
          font-size: 0.82rem;
        }
        .sps-toggle {
          width: 46px;
          height: 28px;
          appearance: none;
          background: rgba(255,255,255,0.18);
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: background 0.18s ease;
          flex-shrink: 0;
          margin: 0;
        }
        .sps-toggle::after {
          content: '';
          position: absolute;
          top: 2px; left: 2px;
          width: 24px; height: 24px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.18s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        .sps-toggle:checked { background: var(--emerald, #2d6a4f); }
        .sps-toggle:checked::after { transform: translateX(18px); }
        .sps-toggle:disabled { opacity: 0.55; cursor: progress; }

        .sps-slider-row {
          padding: 0.4rem 0 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .sps-slider {
          width: 100%;
          margin-top: 0.65rem;
          accent-color: var(--emerald, #2d6a4f);
        }

        .sps-foot {
          margin-top: 1.4rem;
          font-size: 0.8rem;
          color: var(--text-secondary, rgba(239,233,217,0.5));
          line-height: 1.55;
          padding: 0 0.4rem;
        }
        .sps-empty {
          padding: 2.5rem 1rem;
          text-align: center;
          color: var(--text-secondary, rgba(239,233,217,0.6));
        }
      `}</style>
    </div>
  );
}
