// src/utils/qibla.js
// Great-circle bearing and distance calculations to the Kaaba.
// Uses the Haversine formula — accurate to within a few metres
// at any point on Earth.

const KAABA = { lat: 21.4225, lng: 39.8262 };
const R_KM  = 6371; // Mean Earth radius in km

/**
 * Convert degrees to radians.
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Convert radians to degrees.
 */
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Calculate the initial great-circle bearing from a point to the Kaaba.
 *
 * Formula:
 *   θ = atan2(
 *         sin(Δλ) · cos(φ₂),
 *         cos(φ₁) · sin(φ₂) − sin(φ₁) · cos(φ₂) · cos(Δλ)
 *       )
 *
 * @param {number} lat  User latitude  (degrees)
 * @param {number} lng  User longitude (degrees)
 * @returns {number} Bearing in degrees [0, 360)
 */
export function getQiblaBearing(lat, lng) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return ((toDeg(θ) + 360) % 360); // Normalise to [0, 360)
}

/**
 * Calculate the Haversine distance (km) from a point to the Kaaba.
 *
 * @param {number} lat  User latitude  (degrees)
 * @param {number} lng  User longitude (degrees)
 * @returns {number} Distance in kilometres
 */
export function getDistanceToKaaba(lat, lng) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δφ = toRad(KAABA.lat - lat);
  const Δλ = toRad(KAABA.lng - lng);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return 2 * R_KM * Math.asin(Math.sqrt(a));
}

/**
 * Format a distance in km into a human-readable string.
 * < 1 km  → "850 m"
 * >= 1 km → "2,450 km"
 *
 * @param {number} km
 * @returns {string}
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

/**
 * Exponential low-pass filter for smoothing noisy angle readings.
 * Handles the 0°/360° wraparound correctly.
 *
 * α close to 1 → more responsive, less smooth
 * α close to 0 → very smooth, less responsive
 * Recommended: α = 0.15 – 0.25 for compass heading
 *
 * @param {number} previous  Last smoothed angle (degrees)
 * @param {number} current   Raw angle reading   (degrees)
 * @param {number} alpha     Smoothing factor [0, 1]
 * @returns {number} Smoothed angle (degrees)
 */
export function lowPassAngle(previous, current, alpha = 0.18) {
  // Convert to unit vectors to avoid wraparound discontinuity
  const prevRad = toRad(previous);
  const currRad = toRad(current);

  const x = alpha * Math.cos(currRad) + (1 - alpha) * Math.cos(prevRad);
  const y = alpha * Math.sin(currRad) + (1 - alpha) * Math.sin(prevRad);

  return ((toDeg(Math.atan2(y, x)) + 360) % 360);
}

/**
 * Calculate the shortest signed angular difference between two angles.
 * Returns a value in (-180, 180].
 *
 * @param {number} a  Angle A (degrees)
 * @param {number} b  Angle B (degrees)
 * @returns {number}
 */
export function angleDiff(a, b) {
  let diff = ((a - b + 540) % 360) - 180;
  return diff;
}

/**
 * Determine whether the device is currently pointing within `tolerance`
 * degrees of the Qibla bearing.
 *
 * @param {number} deviceHeading   Compass heading (degrees, 0 = North)
 * @param {number} qiblaBearing    Bearing to Kaaba (degrees)
 * @param {number} tolerance       Half-width of alignment zone (degrees)
 * @returns {boolean}
 */
export function isAlignedWithQibla(deviceHeading, qiblaBearing, tolerance = 4) {
  return Math.abs(angleDiff(deviceHeading, qiblaBearing)) <= tolerance;
}
