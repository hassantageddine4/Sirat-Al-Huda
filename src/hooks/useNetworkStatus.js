// src/hooks/useNetworkStatus.js
// ─────────────────────────────────────────────────────────────────────────────
// Reactive network status backed by Capacitor's Network plugin.
//
//   const { isOnline, connectionType } = useNetworkStatus();
//
// On iOS this uses native reachability (CoreTelephony / NSURLSession-based);
// on web it falls back to navigator.onLine + online/offline events. Both paths
// expose the same shape, so the React tree never has to care which it is.
//
// Optimistic default: starts in `isOnline: true` to avoid a one-frame "offline"
// flash on cold start before Network.getStatus() resolves.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    isOnline: true,
    connectionType: "unknown",
  });

  useEffect(() => {
    let cancelled = false;
    let handle = null;

    Network.getStatus()
      .then(s => {
        if (cancelled) return;
        setStatus({ isOnline: !!s.connected, connectionType: s.connectionType ?? "unknown" });
      })
      .catch(() => {
        // Plugin unavailable — leave optimistic default in place
      });

    // addListener returns a Promise<PluginListenerHandle> in Capacitor 6
    Network.addListener("networkStatusChange", s => {
      setStatus({ isOnline: !!s.connected, connectionType: s.connectionType ?? "unknown" });
    })
      .then(h => {
        if (cancelled) { h.remove(); return; }
        handle = h;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (handle) handle.remove();
    };
  }, []);

  return status;
}
