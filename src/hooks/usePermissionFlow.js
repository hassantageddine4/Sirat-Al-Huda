// src/hooks/usePermissionFlow.js
// ─────────────────────────────────────────────────────────────────────────────
// Orchestrates the full permission flow in one hook so screens don't have
// to wire up the state machine themselves.
//
// Usage:
//
//   const flow = usePermissionFlow();
//
//   <button onClick={() =>
//     flow.request("location", {
//       onGranted: () => startQiblaCompass(),
//     })
//   }>Find qibla</button>
//
//   {flow.element}  // renders the explainer + denied-state sheet when active
//
// Returns:
//   request(permKey, { onGranted, skipExplainer })
//   element            JSX node to mount once at the page level
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import PermissionExplainer from "../components/legal/PermissionExplainer";
import PermissionDenied    from "../components/legal/PermissionDenied";

import * as P from "../services/permissionsService";

// Map our internal keys to the matching service functions
const REGISTRY = {
  location: {
    check:   P.getLocationPermission,
    request: P.requestLocationPermission,
  },
  notifications: {
    check:   P.getNotificationPermission,
    request: P.requestNotificationPermission,
  },
  microphone: {
    check:   P.getMicrophonePermission,
    request: P.requestMicrophonePermission,
  },
  speech: {
    check:   P.getSpeechRecognitionPermission,
    request: P.requestSpeechRecognitionPermission,
  },
  camera: {
    check:   P.getCameraPermission,
    request: P.requestCameraPermission,
  },
};

export function usePermissionFlow() {
  // Single-state machine: { stage, permission, callbacks }
  const [state, setState] = useState({ stage: "idle" });

  const close = useCallback(() => setState({ stage: "idle" }), []);

  const request = useCallback(async (permKey, opts = {}) => {
    const entry = REGISTRY[permKey];
    if (!entry) {
      // eslint-disable-next-line no-console
      console.warn(`[usePermissionFlow] unknown permission "${permKey}"`);
      return;
    }

    // Fast-path: already granted? Just call the callback.
    const current = await entry.check();
    if (current === P.PermissionState.granted) {
      opts.onGranted?.();
      return;
    }
    if (current === P.PermissionState.unsupported) {
      // Web / dev: pretend granted so flows stay testable in the browser
      opts.onGranted?.();
      return;
    }
    if (current === P.PermissionState.denied) {
      // Skip explainer; iOS won't re-show the popup. Show "Open Settings" sheet.
      setState({ stage: "denied", permission: permKey, opts });
      return;
    }

    // Default: show explainer first (unless caller explicitly suppresses it)
    if (opts.skipExplainer) {
      doNativeRequest(permKey, opts);
    } else {
      setState({ stage: "explain", permission: permKey, opts });
    }
  }, []);

  const doNativeRequest = useCallback(async (permKey, opts) => {
    const entry = REGISTRY[permKey];
    if (!entry) return;
    setState({ stage: "idle" });
    const result = await entry.request();
    if (result === P.PermissionState.granted) {
      opts.onGranted?.();
    } else if (result === P.PermissionState.denied) {
      // Show the "Open Settings" sheet
      setState({ stage: "denied", permission: permKey, opts });
    } else {
      // 'prompt' = user dismissed the popup; just close
      opts.onCancel?.();
    }
  }, []);

  const element = (() => {
    if (state.stage === "explain") {
      return (
        <PermissionExplainer
          permission={state.permission}
          onContinue={() => doNativeRequest(state.permission, state.opts)}
          onCancel={() => { close(); state.opts?.onCancel?.(); }}
        />
      );
    }
    if (state.stage === "denied") {
      return (
        <PermissionDenied
          permission={state.permission}
          onClose={() => { close(); state.opts?.onCancel?.(); }}
        />
      );
    }
    return null;
  })();

  return { request, element };
}
