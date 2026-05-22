import { useEffect, useState, useCallback, useRef } from "react";
import { getPrayerPrefs, upsertPrayerPrefs } from "../services/push/prayerPrefsSync";

/**
 * Read & write user_prayer_prefs for the given user.
 * Optimistic: UI updates immediately, then reconciles with server response.
 */
export function useServerPushPrefs(userId) {
  const [prefs, setPrefs]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (!userId) { setPrefs(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    getPrayerPrefs(userId)
      .then((data) => {
        if (!mountedRef.current) return;
        setPrefs(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!mountedRef.current) return;
        setError(e?.message || String(e));
        setLoading(false);
      });
  }, [userId]);

  const updatePref = useCallback(
    async (patch) => {
      if (!userId) return;
      setSaving(true);
      setPrefs((p) => ({ ...(p || {}), ...patch }));  // optimistic
      const saved = await upsertPrayerPrefs(userId, patch);
      if (mountedRef.current && saved) setPrefs(saved);
      if (mountedRef.current) setSaving(false);
    },
    [userId]
  );

  return { prefs, loading, saving, error, updatePref };
}
