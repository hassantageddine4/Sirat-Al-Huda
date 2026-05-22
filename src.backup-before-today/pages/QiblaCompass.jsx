// src/pages/QiblaCompass.jsx
// Premium Qibla compass screen.
// Uses useQibla() hook for all sensor/location/haptic logic.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQibla from '../hooks/useQibla';

// ── Kaaba SVG icon ────────────────────────────────────────────────────────────
function KaabaIcon({ size = 28, color = '#C8A951' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Main cube body */}
      <rect x="6" y="10" width="20" height="16" rx="1.5"
        fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* Kiswah cloth band */}
      <rect x="6" y="15" width="20" height="5"
        fill={color} opacity="0.35"/>
      {/* Gold Quranic band detail */}
      <line x1="6" y1="15" x2="26" y2="15" stroke={color} strokeWidth="1"/>
      <line x1="6" y1="20" x2="26" y2="20" stroke={color} strokeWidth="1"/>
      {/* Door */}
      <rect x="13" y="18" width="6" height="8" rx="1"
        fill={color} opacity="0.6" stroke={color} strokeWidth="1"/>
      {/* Top finial */}
      <circle cx="16" cy="9" r="2" fill={color} opacity="0.8"/>
      <line x1="16" y1="7" x2="16" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Compass needle (points toward Qibla) ─────────────────────────────────────
function QiblaNeedle({ isAligned }) {
  return (
    <svg width="60" height="160" viewBox="0 0 60 160" fill="none">
      {/* North tail */}
      <path
        d="M30 90 L38 130 Q30 138 22 130 Z"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      {/* Qibla head — gold when aligned, white otherwise */}
      <path
        d="M30 70 L40 110 Q30 118 20 110 Z"
        fill={isAligned ? '#C8A951' : 'rgba(255,255,255,0.9)'}
        stroke={isAligned ? '#A88730' : 'rgba(255,255,255,0.5)'}
        strokeWidth="1.5"
        style={{ filter: isAligned ? 'drop-shadow(0 0 8px rgba(200,169,81,0.9))' : 'none' }}
      />
      {/* Tip */}
      <polygon
        points="30,30 37,72 23,72"
        fill={isAligned ? '#C8A951' : 'white'}
        style={{ filter: isAligned ? 'drop-shadow(0 0 6px rgba(200,169,81,1))' : 'none' }}
      />
      {/* Centre bearing */}
      <circle cx="30" cy="80" r="7"
        fill={isAligned ? '#C8A951' : '#0F3D2E'}
        stroke={isAligned ? '#A88730' : 'rgba(255,255,255,0.4)'}
        strokeWidth="2"
      />
    </svg>
  );
}

// ── Calibration overlay ───────────────────────────────────────────────────────
function CalibrationOverlay({ onDismiss }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(8,40,25,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', textAlign: 'center',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Figure-8 animation */}
      <div style={{ marginBottom: 28, position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <ellipse cx="26" cy="40" rx="18" ry="26"
            stroke="#C8A951" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
          <ellipse cx="54" cy="40" rx="18" ry="26"
            stroke="#C8A951" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
          <circle cx="26" cy="14" r="5" fill="#C8A951">
            <animateMotion
              dur="2.5s" repeatCount="indefinite"
              path="M0,0 C0,26 28,26 28,0 C28,-26 0,-26 0,0"
            />
          </circle>
        </svg>
      </div>
      <p style={{ color: '#C8A951', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 10 }}>
        COMPASS CALIBRATION
      </p>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
        Move your phone in a figure-8
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
        Tilt your device forward and back, then side to side, tracing a figure-8 until the accuracy improves.
      </p>
      <button
        onClick={onDismiss}
        style={{
          background: 'rgba(200,169,81,0.15)',
          border: '1px solid rgba(200,169,81,0.4)',
          borderRadius: 99, color: '#C8A951',
          fontSize: 14, fontWeight: 600,
          padding: '10px 28px', cursor: 'pointer',
        }}
      >
        Got it
      </button>
    </div>
  );
}

// ── Permission / Error screen ─────────────────────────────────────────────────
function PermissionScreen({ icon, title, body, action, actionLabel }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 52, marginBottom: 20 }}>{icon}</div>
      <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</p>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, marginBottom: 32 }}>{body}</p>
      {action && (
        <button onClick={action} style={{
          background: '#C8A951', color: '#0F3D2E',
          border: 'none', borderRadius: 99,
          padding: '13px 32px', fontSize: 15, fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(200,169,81,0.40)',
        }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function QiblaCompass() {
  const navigate = useNavigate();
  const {
    location, locationStatus, locationError, requestLocation,
    compassStatus, needsCalibration, compassLabel, startCompass,
    qiblaBearing, distanceText, arrowAngle, isAligned,
    accuracyLabel,
  } = useQibla();

  const [showCalibration,    setShowCalibration]    = useState(false);
  const [started,            setStarted]            = useState(false);
  const [alignedFlash,       setAlignedFlash]       = useState(false);

  // Show calibration overlay when needed
  useEffect(() => {
    if (needsCalibration && started) setShowCalibration(true);
  }, [needsCalibration, started]);

  // Flash the background green on alignment
  useEffect(() => {
    if (isAligned) {
      setAlignedFlash(true);
      const t = setTimeout(() => setAlignedFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [isAligned]);

  // Start everything on mount (user gesture already happened via Practice card tap)
  useEffect(() => {
    requestLocation();
    startCompass();
    setStarted(true);
  }, []);

  const ready = location && compassStatus === 'active' && qiblaBearing !== null;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: alignedFlash
        ? 'linear-gradient(160deg, #082819 0%, #1A5C44 100%)'
        : 'linear-gradient(160deg, #04100A 0%, #0F3D2E 55%, #082819 100%)',
      transition: 'background 0.4s ease',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Subtle dot-grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(200,169,81,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        paddingTop: 'max(44px, env(safe-area-inset-top))',
        padding: 'max(44px, env(safe-area-inset-top)) 16px 0',
        display: 'flex', alignItems: 'center', gap: 8,
        position: 'relative', zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, cursor: 'pointer',
            color: '#fff', fontSize: 20,
          }}
        >
          ‹
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ color: 'rgba(200,169,81,0.8)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            QIBLA COMPASS
          </p>
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>Direction of the Kaaba</p>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* ── Permission / Error states ── */}
      {locationStatus === 'denied' && (
        <PermissionScreen
          icon="📍"
          title="Location Required"
          body="Please enable location access in your device settings to find the Qibla direction."
          action={() => {}}
          actionLabel="Open Settings"
        />
      )}

      {locationStatus === 'unavailable' && locationError && (
        <PermissionScreen
          icon="⚠️"
          title="Location Unavailable"
          body={locationError}
          action={requestLocation}
          actionLabel="Try Again"
        />
      )}

      {compassStatus === 'unavailable' && (
        <PermissionScreen
          icon="🧭"
          title="Compass Not Available"
          body="Your device does not have the sensors required for compass functionality."
        />
      )}

      {/* ── Loading state ── */}
      {!ready && locationStatus !== 'denied' && locationStatus !== 'unavailable' && compassStatus !== 'unavailable' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            border: '2px solid rgba(200,169,81,0.3)',
            borderTop: '2px solid #C8A951',
            animation: 'spin 1.2s linear infinite',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {locationStatus === 'requesting' ? 'Getting your location…' : 'Starting compass…'}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Main compass UI ── */}
      {ready && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 24px 32px',
          position: 'relative', zIndex: 5,
        }}>

          {/* Distance + bearing info */}
          <div style={{
            display: 'flex', gap: 20, marginBottom: 28,
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Distance</p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{distanceText}</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', margin: '4px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Bearing</p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{Math.round(qiblaBearing)}°</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', margin: '4px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Accuracy</p>
              <p style={{ color: isAligned ? '#C8A951' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, marginTop: 4 }}>{accuracyLabel}</p>
            </div>
          </div>

          {/* Aligned banner */}
          {isAligned && (
            <div style={{
              background: 'rgba(200,169,81,0.18)',
              border: '1px solid rgba(200,169,81,0.5)',
              borderRadius: 99, padding: '6px 20px',
              marginBottom: 20,
              animation: 'pulseIn 0.3s ease',
            }}>
              <p style={{ color: '#C8A951', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>
                ✦ FACING THE KAABA
              </p>
            </div>
          )}
          <style>{`
            @keyframes pulseIn {
              from { transform: scale(0.9); opacity: 0; }
              to   { transform: scale(1);   opacity: 1; }
            }
          `}</style>

          {/* ── Compass dial ── */}
          <div style={{ position: 'relative', width: 300, height: 300 }}>

            {/* Outer ring — glassy */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              border: isAligned
                ? '2px solid rgba(200,169,81,0.7)'
                : '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: isAligned
                ? '0 0 40px rgba(200,169,81,0.25), inset 0 0 30px rgba(200,169,81,0.08)'
                : '0 0 40px rgba(15,61,46,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }} />

            {/* Tick marks ring */}
            <svg
              style={{ position: 'absolute', inset: 0 }}
              width="300" height="300" viewBox="0 0 300 300"
            >
              {Array.from({ length: 72 }, (_, i) => {
                const angle = (i * 5 * Math.PI) / 180;
                const isMajor = i % 6 === 0;
                const r1 = isMajor ? 132 : 136;
                const r2 = 142;
                const cx = 150, cy = 150;
                return (
                  <line
                    key={i}
                    x1={cx + r1 * Math.sin(angle)}
                    y1={cy - r1 * Math.cos(angle)}
                    x2={cx + r2 * Math.sin(angle)}
                    y2={cy - r2 * Math.cos(angle)}
                    stroke={isMajor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}
            </svg>

            {/* Cardinal directions — rotate with compass so they are fixed relative to world */}
            {[['N', 0], ['E', 90], ['S', 180], ['W', 270]].map(([label, deg]) => {
              // Position the label at the correct angle, but counter-rotate text
              // so it always reads upright on screen.
              const rad = ((deg - 0) * Math.PI) / 180; // no heading applied — static ring
              const r   = 118;
              const cx  = 150, cy = 150;
              return (
                <div
                  key={label}
                  style={{
                    position: 'absolute',
                    left: cx + r * Math.sin(rad) - 10,
                    top:  cy - r * Math.cos(rad) - 10,
                    width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: label === 'N' ? '#ef4444' : 'rgba(255,255,255,0.7)',
                    fontSize: 13, fontWeight: 800,
                    pointerEvents: 'none',
                  }}
                >
                  {label}
                </div>
              );
            })}

            {/* Needle — rotates to point toward Qibla */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `rotate(${arrowAngle}deg)`,
              transition: 'transform 0.12s ease-out',
            }}>
              <QiblaNeedle isAligned={isAligned} />
            </div>

            {/* Centre Kaaba icon */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 52, height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(15,61,46,0.9), rgba(8,40,25,0.95))',
              border: isAligned
                ? '2px solid rgba(200,169,81,0.8)'
                : '1.5px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              transition: 'border-color 0.3s',
            }}>
              <KaabaIcon size={26} color={isAligned ? '#C8A951' : 'rgba(200,169,81,0.6)'} />
            </div>

            {/* Alignment zone arc (thin gold arc at top ±4°) */}
            <svg
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              width="300" height="300" viewBox="0 0 300 300"
            >
              <path
                d={describeArc(150, 150, 143, -4, 4)}
                stroke={isAligned ? '#C8A951' : 'rgba(200,169,81,0.35)'}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s' }}
              />
            </svg>
          </div>

          {/* Compass status / calibration nudge */}
          {compassLabel !== '' && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{compassLabel}</p>
              {needsCalibration && (
                <button
                  onClick={() => setShowCalibration(true)}
                  style={{
                    marginTop: 8,
                    background: 'rgba(200,169,81,0.12)',
                    border: '1px solid rgba(200,169,81,0.3)',
                    borderRadius: 99, color: '#C8A951',
                    fontSize: 12, fontWeight: 600,
                    padding: '6px 16px', cursor: 'pointer',
                  }}
                >
                  Calibrate compass
                </button>
              )}
            </div>
          )}

          {/* Heading readout */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Device heading
            </p>
          </div>

        </div>
      )}

      {/* Calibration overlay */}
      {showCalibration && (
        <CalibrationOverlay onDismiss={() => setShowCalibration(false)} />
      )}

    </div>
  );
}

// ── SVG arc helper ────────────────────────────────────────────────────────────

function describeArc(cx, cy, r, startDeg, endDeg) {
  const toRad = (d) => (d * Math.PI) / 180;
  const start = {
    x: cx + r * Math.sin(toRad(startDeg)),
    y: cy - r * Math.cos(toRad(startDeg)),
  };
  const end = {
    x: cx + r * Math.sin(toRad(endDeg)),
    y: cy - r * Math.cos(toRad(endDeg)),
  };
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}
