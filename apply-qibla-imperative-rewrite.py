#!/usr/bin/env python3
"""Sirat Al Huda — Qibla compass smoothness rewrite.

Switches from React-state-driven needle rotation (60Hz setState + CSS
transition = catch-up jitter) to imperative DOM updates inside the RAF
loop. React state is now used only for discrete events (alignment
crossing, calibration status). The needle updates every display frame
with zero React reconciler overhead — same pattern Apple Compass uses.

Files touched:
  • src/hooks/useQibla.js     (full replacement)
  • src/pages/QiblaCompass.jsx (two surgical edits)
"""

from pathlib import Path
import sys

ROOT = Path.home() / "Downloads/sirat-capacitor-3"
HOOK = ROOT / "src/hooks/useQibla.js"
PAGE = ROOT / "src/pages/QiblaCompass.jsx"

for f in (HOOK, PAGE):
    if not f.exists():
        print(f"❌ Cannot find {f}")
        sys.exit(1)

# ─── 1. New useQibla.js ───────────────────────────────────────────────────────

NEW_HOOK = '''// src/hooks/useQibla.js
// Custom React hook that fuses:
//   1. GPS (navigator.geolocation) → qibla bearing + distance
//   2. Native CoreMotion compass (capacitor-compass-heading) → fused heading
//   3. Haptic feedback via Capacitor Haptics / Web Vibration API
//
// Heading source: capacitor-compass-heading plugin wraps
//   CMMotionManager.startDeviceMotionUpdates(using: .xTrueNorthZVertical)
// which delivers Apple-fused (accel + gyro + mag) heading at 60Hz.
//
// CRITICAL ARCHITECTURE: the needle DOM element is updated imperatively
// inside the RAF loop, NOT through React state. 60Hz setState +
// CSS transition causes catch-up jitter; direct style.transform writes
// at display refresh rate are what Apple does internally. React state
// is reserved for discrete events (alignment crossing, calibration).
//
// Consumers attach the needle element via attachNeedle(el).

import { useState, useEffect, useRef, useCallback } from 'react';
import { CompassHeading } from 'capacitor-compass-heading';
import {
  getQiblaBearing,
  getDistanceToKaaba,
  formatDistance,
  lowPassAngle,
  angleDiff,
  isAlignedWithQibla,
} from '../utils/qibla';

// ── Tuning ────────────────────────────────────────────────────────────────────

const VISUAL_LERP_ALPHA        = 0.30;  // Per-frame interpolation toward target
const STATE_UPDATE_INTERVAL_MS = 100;   // Throttle reactive state to ~10Hz
const ALIGNMENT_TOLERANCE      = 4;     // Degrees — half-width of "aligned"
const HAPTIC_COOLDOWN_MS       = 2000;
const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout           : 15_000,
  maximumAge        : 10_000,
};

// ── Haptic helpers ────────────────────────────────────────────────────────────

async function triggerAlignmentHaptic() {
  try {
    if (window?.Capacitor?.isPluginAvailable?.('Haptics')) {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }
  } catch { /* fall through */ }

  if (navigator.vibrate) navigator.vibrate([0, 30, 60, 30]);
}

function triggerProximityTick() {
  if (navigator.vibrate) navigator.vibrate(8);
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export default function useQibla() {
  // Location state
  const [location,        setLocation]        = useState(null);
  const [locationError,   setLocationError]   = useState(null);
  const [locationStatus,  setLocationStatus]  = useState('idle');

  // Compass state — reactive but updated at ~10Hz only
  const [heading,          setHeading]          = useState(null);
  const [rawHeading,       setRawHeading]       = useState(null);
  const [compassStatus,    setCompassStatus]    = useState('idle');
  const [needsCalibration, setNeedsCalibration] = useState(false);

  // Derived state
  const [qiblaBearing, setQiblaBearing] = useState(null);
  const [distanceText, setDistanceText] = useState('');
  const [isAligned,    setIsAligned]    = useState(false);
  const [arrowAngle,   setArrowAngle]   = useState(0);  // for any text display

  // ── Refs (no rerenders) ──
  // Imperative pipeline
  const latestHeadingRef   = useRef(null);  // freshest fused value from native
  const smoothedHeadingRef = useRef(null);  // post-lerp value
  const qiblaBearingRef    = useRef(null);  // synced from state for RAF
  const needleElRef        = useRef(null);  // DOM element to rotate
  const lastStateUpdateRef = useRef(0);
  const lastAlignedRef     = useRef(false);

  // Plugin lifecycle
  const compassSubRef = useRef(null);
  const errorSubRef   = useRef(null);
  const rafIdRef      = useRef(null);
  const isRunningRef  = useRef(false);

  // Haptics / GPS
  const lastHapticRef    = useRef(0);
  const lastProximityRef = useRef(0);
  const watchIdRef       = useRef(null);

  // Keep qiblaBearingRef in sync with state so RAF reads latest
  useEffect(() => {
    qiblaBearingRef.current = qiblaBearing;
  }, [qiblaBearing]);

  // ── Location ───────────────────────────────────────────────────────────────

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported by this device.');
      return;
    }

    setLocationStatus('requesting');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setLocation({ lat, lng, accuracy });
        setLocationStatus('granted');
        setLocationError(null);

        const bearing = getQiblaBearing(lat, lng);
        const km      = getDistanceToKaaba(lat, lng);
        setQiblaBearing(bearing);
        setDistanceText(formatDistance(km));
      },
      (err) => {
        setLocationStatus(err.code === 1 ? 'denied' : 'unavailable');
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please enable it in Settings.'
            : 'Unable to determine your location. Please try again.'
        );
      },
      GPS_OPTIONS
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ── Imperative needle attachment ───────────────────────────────────────────

  const attachNeedle = useCallback((el) => {
    needleElRef.current = el;
  }, []);

  // ── Native compass + RAF loop ──────────────────────────────────────────────

  const startCompass = useCallback(async () => {
    if (isRunningRef.current) return;

    try {
      const { available } = await CompassHeading.isAvailable();
      if (!available) {
        setCompassStatus('unavailable');
        return;
      }

      // Subscribe BEFORE start() so we don't miss early events.
      compassSubRef.current = await CompassHeading.addListener('heading', (e) => {
        latestHeadingRef.current = e.heading;

        // accuracy < 0 means uncalibrated → figure-8 motion needed.
        const isCalibrating = e.accuracy < 0;
        setNeedsCalibration(isCalibrating);
        setCompassStatus(isCalibrating ? 'calibrating' : 'active');
      });

      errorSubRef.current = await CompassHeading.addListener('error', (e) => {
        console.warn('[useQibla] native compass error:', e?.message);
      });

      await CompassHeading.start();
      isRunningRef.current = true;

      // ── RAF tick: imperative needle update + throttled reactive state ──
      const tick = () => {
        const target  = latestHeadingRef.current;
        const bearing = qiblaBearingRef.current;

        if (target !== null) {
          const current = smoothedHeadingRef.current;
          const next = current === null
            ? target
            : lowPassAngle(current, target, VISUAL_LERP_ALPHA);
          smoothedHeadingRef.current = next;

          // ── HOT PATH: imperative DOM update (no React reconciliation) ──
          if (bearing !== null && needleElRef.current) {
            const needle = ((bearing - next) + 360) % 360;
            needleElRef.current.style.transform = `rotate(${needle.toFixed(2)}deg)`;
          }

          // ── Alignment crossing detection (per-frame) ──
          if (bearing !== null) {
            const aligned = isAlignedWithQibla(next, bearing, ALIGNMENT_TOLERANCE);
            if (aligned !== lastAlignedRef.current) {
              lastAlignedRef.current = aligned;
              setIsAligned(aligned);

              if (aligned) {
                const tNow = Date.now();
                if (tNow - lastHapticRef.current > HAPTIC_COOLDOWN_MS) {
                  triggerAlignmentHaptic();
                  lastHapticRef.current = tNow;
                }
              }
            }

            // Proximity micro-tick (within 15° but not yet aligned)
            if (!aligned) {
              const diff = Math.abs(angleDiff(next, bearing));
              const tNow = Date.now();
              if (diff < 15 && tNow - lastProximityRef.current > 300) {
                triggerProximityTick();
                lastProximityRef.current = tNow;
              }
            }
          }

          // ── Throttled reactive state for status displays only ──
          const perfNow = performance.now();
          if (perfNow - lastStateUpdateRef.current >= STATE_UPDATE_INTERVAL_MS) {
            setHeading(next);
            setRawHeading(target);
            if (bearing !== null) {
              setArrowAngle(((bearing - next) + 360) % 360);
            }
            lastStateUpdateRef.current = perfNow;
          }
        }

        rafIdRef.current = requestAnimationFrame(tick);
      };
      rafIdRef.current = requestAnimationFrame(tick);

    } catch (err) {
      console.error('[useQibla] startCompass failed:', err);
      setCompassStatus('unavailable');
    }
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (compassSubRef.current) {
        compassSubRef.current.remove();
        compassSubRef.current = null;
      }
      if (errorSubRef.current) {
        errorSubRef.current.remove();
        errorSubRef.current = null;
      }
      if (isRunningRef.current) {
        CompassHeading.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, []);

  // ── Labels ─────────────────────────────────────────────────────────────────

  const accuracyLabel = (() => {
    if (locationStatus === 'requesting')   return 'Locating…';
    if (locationStatus === 'denied')       return 'Location denied';
    if (locationStatus === 'unavailable')  return 'Location unavailable';
    if (!location)                         return 'Waiting for GPS';
    if (location.accuracy <= 10)           return 'High accuracy';
    if (location.accuracy <= 50)           return 'Good accuracy';
    if (location.accuracy <= 200)          return 'Low accuracy';
    return 'Very low accuracy';
  })();

  const compassLabel = (() => {
    if (compassStatus === 'unavailable') return 'Compass unavailable';
    if (compassStatus === 'idle')        return 'Tap to start compass';
    if (needsCalibration)                return 'Calibrating — move device in figure-8';
    return '';
  })();

  // ── Public API ─────────────────────────────────────────────────────────────

  return {
    // Location
    location,
    locationStatus,
    locationError,
    requestLocation,

    // Compass
    heading,
    rawHeading,
    compassStatus,
    needsCalibration,
    compassLabel,
    startCompass,

    // Qibla
    qiblaBearing,
    distanceText,
    arrowAngle,
    isAligned,

    // Labels
    accuracyLabel,

    // Imperative needle attachment (NEW — pass to ref={attachNeedle})
    attachNeedle,
  };
}
'''

HOOK.write_text(NEW_HOOK)
print(f"✓ Rewrote {HOOK.name}")

# ─── 2. QiblaCompass.jsx — surgical edits ─────────────────────────────────────

page_src = PAGE.read_text()
original = page_src

# Edit A: add attachNeedle to the destructured useQibla()
old_destructure = '''  const {
    location, locationStatus, locationError, requestLocation,
    compassStatus, needsCalibration, compassLabel, startCompass,
    qiblaBearing, distanceText, arrowAngle, isAligned,
    accuracyLabel,
  } = useQibla();'''

new_destructure = '''  const {
    location, locationStatus, locationError, requestLocation,
    compassStatus, needsCalibration, compassLabel, startCompass,
    qiblaBearing, distanceText, arrowAngle, isAligned,
    accuracyLabel, attachNeedle,
  } = useQibla();'''

if old_destructure not in page_src:
    print("❌ Could not locate useQibla() destructuring. Aborting.")
    sys.exit(1)
page_src = page_src.replace(old_destructure, new_destructure)

# Edit B: replace the needle wrapper div — remove transform/transition,
# attach the imperative ref instead.
old_needle = '''            {/* Needle — rotates to point toward Qibla */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `rotate(${arrowAngle}deg)`,
              transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}>
              <QiblaNeedle isAligned={isAligned} />
            </div>'''

new_needle = '''            {/* Needle — imperatively updated via RAF in useQibla (60Hz, no React on hot path) */}
            <div ref={attachNeedle} style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              willChange: 'transform',
            }}>
              <QiblaNeedle isAligned={isAligned} />
            </div>'''

if old_needle not in page_src:
    print("❌ Could not locate needle wrapper div. Aborting.")
    sys.exit(1)
page_src = page_src.replace(old_needle, new_needle)

if page_src == original:
    print("⚠️  QiblaCompass.jsx unchanged. Aborting.")
    sys.exit(1)

PAGE.write_text(page_src)
print(f"✓ Patched {PAGE.name}")
print()
print("Architecture summary:")
print("  • Needle DOM element updated imperatively at 60Hz inside RAF")
print("  • React state updates throttled to ~10Hz (status displays only)")
print("  • CSS transition on transform: REMOVED (was causing catch-up jitter)")
print("  • Alignment crossings still trigger reactive state + haptics")
