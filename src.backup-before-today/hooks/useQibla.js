// src/hooks/useQibla.js
// Custom React hook that fuses:
//   1. GPS (navigator.geolocation) → qibla bearing + distance
//   2. Device compass (DeviceOrientationEvent) → heading + smoothing
//   3. Haptic feedback via Vibration API (Web) / Capacitor Haptics
//
// Returns a single stable object that the QiblaCompass component
// can destructure and render directly.

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getQiblaBearing,
  getDistanceToKaaba,
  formatDistance,
  lowPassAngle,
  angleDiff,
  isAlignedWithQibla,
} from '../utils/qibla';

// ── Constants ─────────────────────────────────────────────────────────────────

const SMOOTHING_ALPHA    = 0.18;  // Low-pass filter coefficient
const ALIGNMENT_TOLERANCE = 4;    // Degrees — half-width of "aligned" zone
const HAPTIC_COOLDOWN_MS  = 2000; // Min time between haptic pulses (ms)
const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout           : 15_000,
  maximumAge        : 10_000,
};

// ── Haptic helper ─────────────────────────────────────────────────────────────

/**
 * Fire a single short haptic pulse.
 * Uses Capacitor Haptics if available (native iOS/Android),
 * falls back to Web Vibration API.
 */
async function triggerAlignmentHaptic() {
  try {
    // Capacitor Haptics (installed via @capacitor/haptics)
    if (window?.Capacitor?.isPluginAvailable?.('Haptics')) {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }
  } catch { /* ignore — fall through to Web API */ }

  // Web Vibration API fallback (Android WebView, Chrome)
  if (navigator.vibrate) {
    navigator.vibrate([0, 30, 60, 30]); // short double-pulse pattern
  }
}

/**
 * Light micro-tick feedback as the user gets close (< 15°).
 * Only fires on Web Vibration — Capacitor handles its own cadence.
 */
function triggerProximityTick() {
  if (navigator.vibrate) {
    navigator.vibrate(8); // single 8ms micro-vibration
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export default function useQibla() {
  // Location state
  const [location,        setLocation]        = useState(null);   // { lat, lng, accuracy }
  const [locationError,   setLocationError]   = useState(null);
  const [locationStatus,  setLocationStatus]  = useState('idle'); // idle | requesting | granted | denied | unavailable

  // Compass state
  const [heading,         setHeading]         = useState(null);   // smoothed device heading (deg)
  const [rawHeading,      setRawHeading]       = useState(null);
  const [compassStatus,   setCompassStatus]   = useState('idle'); // idle | active | calibrating | unavailable
  const [needsCalibration, setNeedsCalibration] = useState(false);

  // Derived state
  const [qiblaBearing,   setQiblaBearing]    = useState(null);   // bearing to Kaaba (deg)
  const [distanceKm,     setDistanceKm]      = useState(null);
  const [distanceText,   setDistanceText]    = useState('');
  const [isAligned,      setIsAligned]       = useState(false);
  const [arrowAngle,     setArrowAngle]      = useState(0);       // CSS rotation value

  // Internal refs (don't trigger re-renders)
  const smoothedHeadingRef  = useRef(null);
  const wasAlignedRef       = useRef(false);
  const lastHapticRef       = useRef(0);
  const lastProximityRef    = useRef(0);
  const watchIdRef          = useRef(null);

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

        // Recalculate bearing + distance
        const bearing = getQiblaBearing(lat, lng);
        const km      = getDistanceToKaaba(lat, lng);
        setQiblaBearing(bearing);
        setDistanceKm(km);
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

  // Cleanup GPS watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ── Compass / Device Orientation ───────────────────────────────────────────

  const handleOrientation = useCallback((event) => {
    // webkitCompassHeading is available on iOS Safari (degrees from North)
    // alpha is available on Android (degrees from North if absolute=true, else arbitrary)
    let rawDeg;

    if (typeof event.webkitCompassHeading === 'number') {
      // iOS — webkitCompassHeading is already clockwise from North
      rawDeg = event.webkitCompassHeading;
    } else if (event.absolute && typeof event.alpha === 'number') {
      // Android absolute orientation — convert alpha to compass heading
      rawDeg = 360 - event.alpha;
    } else if (typeof event.alpha === 'number') {
      // Relative orientation fallback
      rawDeg = 360 - event.alpha;
    } else {
      setCompassStatus('unavailable');
      return;
    }

    // Detect calibration need (webkitCompassAccuracy > 25° is unreliable)
    if (typeof event.webkitCompassAccuracy === 'number') {
      setNeedsCalibration(event.webkitCompassAccuracy > 25);
    }

    setRawHeading(rawDeg);

    // Apply low-pass smoothing
    const prev = smoothedHeadingRef.current;
    const smoothed = prev === null ? rawDeg : lowPassAngle(prev, rawDeg, SMOOTHING_ALPHA);
    smoothedHeadingRef.current = smoothed;
    setHeading(smoothed);
    setCompassStatus('active');
  }, []);

  const startCompass = useCallback(async () => {
    // iOS 13+ requires permission via a user gesture
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result !== 'granted') {
          setCompassStatus('unavailable');
          return;
        }
      } catch {
        setCompassStatus('unavailable');
        return;
      }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation',         handleOrientation, true);
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation',         handleOrientation, true);
    };
  }, [handleOrientation]);

  // ── Derived: arrow angle + alignment + haptics ─────────────────────────────

  useEffect(() => {
    if (heading === null || qiblaBearing === null) return;

    // The needle should point toward the Qibla.
    // If device heading = H and qibla bearing = Q,
    // the needle rotates Q − H (relative to "up" = North on screen).
    const needle = ((qiblaBearing - heading) + 360) % 360;
    setArrowAngle(needle);

    // Alignment detection
    const aligned = isAlignedWithQibla(heading, qiblaBearing, ALIGNMENT_TOLERANCE);
    setIsAligned(aligned);

    const now = Date.now();

    if (aligned && !wasAlignedRef.current) {
      // User just entered the alignment zone — fire haptic
      if (now - lastHapticRef.current > HAPTIC_COOLDOWN_MS) {
        triggerAlignmentHaptic();
        lastHapticRef.current = now;
      }
    }
    wasAlignedRef.current = aligned;

    // Proximity micro-tick (within 15° but not aligned)
    const diff = Math.abs(angleDiff(heading, qiblaBearing));
    if (!aligned && diff < 15 && now - lastProximityRef.current > 300) {
      triggerProximityTick();
      lastProximityRef.current = now;
    }
  }, [heading, qiblaBearing]);

  // ── Accuracy label ─────────────────────────────────────────────────────────

  const accuracyLabel = (() => {
    if (locationStatus === 'requesting') return 'Locating…';
    if (locationStatus === 'denied')     return 'Location denied';
    if (locationStatus === 'unavailable') return 'Location unavailable';
    if (!location)                        return 'Waiting for GPS';
    if (location.accuracy <= 10)          return 'High accuracy';
    if (location.accuracy <= 50)          return 'Good accuracy';
    if (location.accuracy <= 200)         return 'Low accuracy';
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
  };
}
