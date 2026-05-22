// src/components/prayer/PoseSilhouette.jsx
// ─────────────────────────────────────────────────────────────────────────────
// SVG silhouettes used as fallbacks when a step has no asset image.
// Five postures: standing, bowing, prostrating, kneeling, qunut (palms up).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

const STROKE = "#0F3D2E";
const FILL   = "#0F3D2E";

export default function PoseSilhouette({ posture = "standing", madhhab = "sunni", className = "" }) {
  const Figure = FIGURES[posture] ?? FIGURES.standing;
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true">
      <Figure madhhab={madhhab} />
    </svg>
  );
}

// ─── Figures ────────────────────────────────────────────────────────────────

const FIGURES = {
  standing({ madhhab }) {
    // Folded-hands (sunni) vs hands-at-sides (shia)
    return (
      <g fill={FILL} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round">
        {/* head */}
        <circle cx="100" cy="40" r="18" />
        {/* body */}
        <path d="M 78 60 Q 78 70 76 90 L 70 200 Q 70 210 80 210 L 120 210 Q 130 210 130 200 L 124 90 Q 122 70 122 60 Z" />
        {madhhab === "sunni" ? (
          // hands folded at chest
          <path d="M 88 110 L 100 105 L 112 110 L 110 130 L 90 130 Z" fill="#1A5C44" />
        ) : (
          // hands at sides
          <>
            <ellipse cx="73" cy="135" rx="6" ry="14" fill="#1A5C44" />
            <ellipse cx="127" cy="135" rx="6" ry="14" fill="#1A5C44" />
          </>
        )}
        {/* feet */}
        <ellipse cx="88" cy="220" rx="10" ry="6" />
        <ellipse cx="112" cy="220" rx="10" ry="6" />
      </g>
    );
  },

  bowing() {
    // Bent forward at waist, hands on knees, back parallel to ground
    return (
      <g fill={FILL} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round">
        {/* legs (vertical) */}
        <path d="M 80 130 L 78 200 L 90 200 L 90 130 Z" />
        <path d="M 110 130 L 110 200 L 122 200 L 120 130 Z" />
        {/* feet */}
        <ellipse cx="84" cy="210" rx="10" ry="5" />
        <ellipse cx="116" cy="210" rx="10" ry="5" />
        {/* horizontal back */}
        <path d="M 70 130 L 65 95 Q 65 85 75 85 L 145 85 Q 155 85 155 95 L 150 130 Z"
              transform="translate(-10 0)" />
        {/* head extending forward */}
        <circle cx="155" cy="100" r="16" />
        {/* arms straight down to knees */}
        <path d="M 80 95 L 78 130 L 86 130 L 86 95 Z" />
        <path d="M 110 95 L 108 130 L 116 130 L 116 95 Z" />
      </g>
    );
  },

  prostrating() {
    // Forehead down, knees down, body curved low
    return (
      <g fill={FILL} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round">
        {/* legs/feet at back */}
        <path d="M 38 170 L 30 200 L 50 205 L 60 175 Z" />
        <path d="M 30 200 Q 30 215 50 215 L 75 210 L 70 200 Z" fill="#1A5C44" />
        {/* curved back/torso */}
        <path d="M 60 170 Q 80 130 130 130 Q 160 130 165 165 L 140 170 Q 130 150 110 155 Q 90 160 80 175 Z" />
        {/* head touching ground */}
        <circle cx="170" cy="180" r="16" />
        {/* forearms forward */}
        <ellipse cx="155" cy="195" rx="20" ry="5" fill="#1A5C44" />
      </g>
    );
  },

  kneeling() {
    // Sitting on heels (tashahhud / jalsa)
    return (
      <g fill={FILL} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round">
        {/* head */}
        <circle cx="100" cy="55" r="17" />
        {/* upright torso */}
        <path d="M 80 73 Q 78 90 76 130 Q 76 150 90 158 L 110 158 Q 124 150 124 130 Q 122 90 120 73 Z" />
        {/* thighs/folded legs */}
        <path d="M 76 155 Q 60 170 60 195 Q 60 205 75 207 L 125 207 Q 140 205 140 195 Q 140 170 124 155 Z"
              fill="#1A5C44" />
        {/* hands resting on thighs */}
        <ellipse cx="78" cy="170" rx="7" ry="10" fill="#0a2a1f" />
        <ellipse cx="122" cy="170" rx="7" ry="10" fill="#0a2a1f" />
      </g>
    );
  },

  qunut() {
    // Standing, palms up at chest level
    return (
      <g fill={FILL} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round">
        {/* head */}
        <circle cx="100" cy="40" r="18" />
        {/* body */}
        <path d="M 78 60 Q 78 70 76 90 L 70 200 Q 70 210 80 210 L 120 210 Q 130 210 130 200 L 124 90 Q 122 70 122 60 Z" />
        {/* palms-up cupped hands */}
        <path d="M 78 100 Q 100 90 122 100 Q 120 115 100 113 Q 80 115 78 100 Z" fill="#D9BF7A" />
        {/* feet */}
        <ellipse cx="88" cy="220" rx="10" ry="6" />
        <ellipse cx="112" cy="220" rx="10" ry="6" />
      </g>
    );
  },
};
