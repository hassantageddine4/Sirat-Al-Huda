// src/components/prayer/PoseStage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// The pose card.
//
// Each pose asset (in /public/poses/*.jpg) is a full composite — mihrab
// archway, master character in the prayer position, and side ornaments all
// baked into a single image.
//
// Layout: the card spans the full screen width with a fixed height (60vh)
// and uses object-fit: cover so the image fills the card edge-to-edge with
// no side gaps. Because the source art has a tall 1:2.17 portrait aspect,
// some top and bottom will be cropped — the character stays centered and
// the main mihrab body remains visible.
//
// Pose name resolution: the resolver always normalizes any branch suffix on
// the assetName to the current user's madhhab.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";

const GOLD = "rgba(242, 204, 115, 1)";

// ─── Asset registry — must mirror /public/poses/ ────────────────────────────
const AVAILABLE_POSES = new Set([
  "pose_dua_shia",        "pose_dua_sunni",
  "pose_julus_shia",      "pose_julus_sunni",
  "pose_qiyam_shia",      "pose_qiyam_sunni",
  "pose_qunut",
  "pose_ruku_shia",       "pose_ruku_sunni",
  "pose_salam_shia",      "pose_salam_sunni",
  "pose_salam_left_shia", "pose_salam_left_sunni",
  "pose_standing_shia",   "pose_standing_sunni",
  "pose_sujood_shia",     "pose_sujood_sunni",
  "pose_takbir_shia",     "pose_takbir_sunni",
  "pose_tashahhud_shia",  "pose_tashahhud_sunni",
]);

// ─── Resolver ───────────────────────────────────────────────────────────────
function resolvePoseAsset(assetName, posture, madhhab, stepId) {
  const branch = madhhab === "shia" ? "shia" : "sunni";

  if (assetName) {
    let candidate = assetName;
    candidate = candidate.replace(/^pose_sujud(_|$)/, "pose_sujood$1");
    candidate = candidate.replace(/^pose_jalsa(_|$)/, "pose_julus$1");

    if (candidate === "pose_qunut") return "pose_qunut";

    if (/^pose_salam_left(_|$)/.test(candidate)) {
      return `pose_salam_left_${branch}`;
    }

    const base = candidate.replace(/_(sunni|shia)$/, "");
    const final = `${base}_${branch}`;
    if (AVAILABLE_POSES.has(final)) return final;
  }

  if (stepId) {
    const id = stepId.toLowerCase();
    if (id.includes("salam-left") || id.includes("salam_left"))
      return `pose_salam_left_${branch}`;
    if (id.includes("salam"))     return `pose_salam_${branch}`;
    if (id.includes("takbir"))    return `pose_takbir_${branch}`;
    if (id.includes("qunut"))     return "pose_qunut";
    if (id.includes("tashahhud")) return `pose_tashahhud_${branch}`;
    if (id.includes("dua") || id.includes("istikhara"))
      return `pose_dua_${branch}`;
    if (id.includes("salawat"))   return `pose_dua_${branch}`;
    if (id.includes("jalsa") || id.includes("julus"))
      return `pose_julus_${branch}`;
    if (id.includes("ruku"))      return `pose_ruku_${branch}`;
    if (id.includes("sujud") || id.includes("sujood"))
      return `pose_sujood_${branch}`;
    if (id.includes("qiyam"))     return `pose_qiyam_${branch}`;
    if (id.includes("itidal") || id.includes("iitidal") || id.includes("rising"))
      return `pose_qiyam_${branch}`;
    if (id.includes("fatiha") || id.includes("surah") || id.includes("istiftah") || id.includes("taawwudh"))
      return `pose_qiyam_${branch}`;
  }

  const postureMap = {
    standing:    `pose_qiyam_${branch}`,
    bowing:      `pose_ruku_${branch}`,
    prostrating: `pose_sujood_${branch}`,
    kneeling:    `pose_tashahhud_${branch}`,
  };
  return postureMap[posture] || `pose_standing_${branch}`;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function PoseStage({ step, madhhab }) {
  const [imageOk, setImageOk] = useState(false);

  const resolved = resolvePoseAsset(step.assetName, step.posture, madhhab, step.id);
  const assetSrc = `/poses/${resolved}.jpg`;

  useEffect(() => {
    setImageOk(false);
  }, [step.id, madhhab]);

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        // Full screen width × fixed height. No aspectRatio constraint so the
        // card fills horizontally and lets object-fit: cover crop the image.
        width: "100%",
        height: "60vh",
        background: "#08291D",
        border: `0.7px solid ${GOLD}40`,
      }}
      aria-label={`Illustration of ${step.title}`}>

      {/* Pose image — fills the card edge-to-edge, some top/bottom cropping */}
      <div
        key={`${step.id}_${madhhab}`}
        className="absolute inset-0"
        style={{ animation: "poseFade 320ms ease-out" }}>
        <img
          src={assetSrc}
          alt=""
          onLoad={() => setImageOk(true)}
          onError={() => setImageOk(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 55%",
            opacity: imageOk ? 1 : 0,
            transition: "opacity 200ms ease-out",
          }}
        />
      </div>

      <style>{`
        @keyframes poseFade {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}
