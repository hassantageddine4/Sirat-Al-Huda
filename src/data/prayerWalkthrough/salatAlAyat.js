// src/data/prayerWalkthrough/salatAlAyat.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Āyāt — Prayer for signs (eclipses, earthquakes, fearful winds, etc.)
//
// Becomes wājib in the Shia tradition upon the occurrence of certain
// celestial or terrestrial signs (kusūf, khusūf, zalzala, etc.).
//
// Structure: 2 rakahs, 5 rukūʿs per rakah. Two valid recitation patterns:
//
//   Pattern A (split one long sūrah across 5 rukūʿs):
//     - Recite al-Fātiḥah once
//     - Split a chosen sūrah into 5 portions; recite a portion before each rukūʿ
//     - After the 5th rukūʿ → sujūd
//
//   Pattern B (a complete short sūrah before each rukūʿ):
//     - Recite al-Fātiḥah + a complete short sūrah, then rukūʿ
//     - Rise, recite al-Fātiḥah + another short sūrah, rukūʿ — repeat 5×
//
// Hassan's recommended example (Pattern A):
//   Rakah 1: al-Fātiḥah + Sūrat Yāsīn (Q36) split across 5 rukūʿs
//   Rakah 2: al-Fātiḥah + Sūrat al-Nūr (Q24) split across 5 rukūʿs
//
// This walkthrough models Pattern A. The intro step notes Pattern B as an
// alternative. The full sūrah is shown via QuranInlineSurah; the user
// chooses where to split.
//
// ⚠️ DRAFT — Scholar review required.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "./recitations";
import {
  shiaTakbir, shiaFatiha, shiaIitidal,
  shiaSujud1, shiaJalsa, shiaSujud2,
  shiaQiyamMid, shiaFinalTashahhud, shiaSalam,
  POSTURES,
} from "./instructions_drafts/_sharedShia";

const P = "salatAlAyat";

// ─── Intention ──────────────────────────────────────────────────────────────

const qiyamIntention = {
  id: `${P}-r1-qiyam`,
  title: "Standing & Intention",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_shia",
  instruction: "Stand upright facing the qiblah, arms at the sides. Form the intention silently: 'I am praying two rakahs of Ṣalāt al-Āyāt for [reason — eclipse, earthquake, etc.], qurbatan ilā-llāh.'",
  recitation: null,
  recitationNote: null,
  tip: "Ṣalāt al-Āyāt has a unique structure: 5 rukūʿs per rakah. Two valid recitation patterns: (A) split one long sūrah across the 5 rukūʿs, or (B) recite al-Fātiḥah + a complete short sūrah before each rukūʿ. This walkthrough uses Pattern A.",
  transition: "Raise both hands for takbīrat al-iḥrām.",
  source: "Sistani, Tawḍīḥ al-Masāʾil §1490–1510.",
  madhhabNote: "Becomes wājib in the Shia tradition upon certain natural signs.",
};

// ─── Sūrah display (full sūrah; user picks where to split) ──────────────────

function surahFullDisplay(rakah, chapterId, surahName) {
  return {
    id: `${P}-r${rakah}-surah-display`,
    title: `Sūrat ${surahName} — Choose Your Five Splits`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `After al-Fātiḥah, recite Sūrat ${surahName} in five portions — one portion before each rukūʿ. You may split the sūrah at any natural break points. Glance through the sūrah below and decide your splits before beginning.`,
    chapterId,
    recitation: null,
    recitationNote: "The complete sūrah, to be split across 5 rukūʿs.",
    tip: "Common practice is to divide the sūrah into roughly equal portions; the exact splits are up to the worshipper.",
    transition: "Begin reciting the first portion silently, then bow into the first rukūʿ.",
    source: "Mafātīḥ al-Jinān; Sistani, Tawḍīḥ al-Masāʾil §1500.",
    madhhabNote: null,
  };
}

// ─── Portion + Rukūʿ pair (1 of 5) ──────────────────────────────────────────

function portionStep(rakah, position) {
  return {
    id: `${P}-r${rakah}-portion-${position}`,
    title: `Portion ${position} of 5 — Standing`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Standing upright, recite the ${ordinal(position)} portion of the sūrah silently.`,
    recitation: null,
    recitationNote: "Recite silently the next portion of the chosen sūrah.",
    tip: position === 1
      ? "If you forget where you left off, you may begin again from the start of the sūrah."
      : null,
    transition: "Bow into rukūʿ.",
    source: null,
    madhhabNote: null,
  };
}

function rukuStep(rakah, position) {
  const isFinal = position === 5;
  return {
    id: `${P}-r${rakah}-ruku-${position}`,
    title: `Rukūʿ ${position} of 5`,
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow forward. Hands on knees, back flat. Recite the tasbīḥ of rukūʿ.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ.",
    tip: null,
    transition: isFinal
      ? "Rise to standing — this was the fifth rukūʿ. Next, descend into sujūd."
      : `Rise to standing for portion ${position + 1}.`,
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  };
}

function riseStep(rakah, position) {
  return {
    id: `${P}-r${rakah}-rise-${position}`,
    title: `Rise — Between Rukūʿ ${position} and ${position + 1}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to a fully upright standing position. It is recommended to say 'Samiʿa-llāhu liman ḥamidah'. Settle briefly.",
    recitation: R.samiAllah,
    recitationNote: "Recommended.",
    tip: null,
    transition: `Recite the next portion of the sūrah.`,
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function ordinal(n) {
  return ["first", "second", "third", "fourth", "fifth"][n - 1] || `${n}th`;
}

// ─── Rakah constructor (5 rukūʿ + sujūd sequence) ──────────────────────────

function rakah(rakahNum, chapterId, surahName, isFirst, isLast) {
  const steps = [];

  // Stand and intend
  if (isFirst) {
    steps.push(qiyamIntention, shiaTakbir(P));
  } else {
    steps.push(shiaQiyamMid(P, rakahNum));
  }

  // Fātiḥah once, then show the full sūrah for the user to choose splits
  steps.push(
    shiaFatiha(P, rakahNum),
    surahFullDisplay(rakahNum, chapterId, surahName),
  );

  // 5 portion + rukūʿ cycles
  for (let i = 1; i <= 5; i++) {
    steps.push(portionStep(rakahNum, i));
    steps.push(rukuStep(rakahNum, i));
    if (i < 5) {
      steps.push(riseStep(rakahNum, i));
    }
  }

  // After the 5th rukūʿ, proceed to sujūd
  steps.push(
    shiaIitidal(P, rakahNum, "Settle briefly before descending into the first sujūd."),
    shiaSujud1(P, rakahNum),
    shiaJalsa(P, rakahNum),
    shiaSujud2(P, rakahNum, isLast
      ? "Rise to the seated position for the final tashahhud."
      : "Rise to standing for the second rakah."),
  );

  if (isLast) {
    steps.push(
      shiaFinalTashahhud(P, rakahNum),
      shiaSalam(P, rakahNum, "Ṣalāt al-Āyāt is complete."),
    );
  }

  return steps;
}

export const salatAlAyat = {
  id: "salatAlAyat",
  name: "Ṣalāt al-Āyāt",
  arabicName: "صلاة الآيات",
  subtitle: "Prayer for natural signs",
  rakahCount: 2,
  category: "occasional",
  tradition: "shia",
  summary: "Two rakahs with five rukūʿs each, prayed upon certain natural signs (solar/lunar eclipses, earthquakes, frightening winds, etc.). The worshipper may split one long sūrah across the five rukūʿs of each rakah, or recite al-Fātiḥah + a complete short sūrah before each rukūʿ. This walkthrough models the split-sūrah pattern using Sūrat Yāsīn (r1) and Sūrat al-Nūr (r2) as Hassan's recommended example.",
  draftNotice: "DRAFT — Scholar review required.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: rakah(1, 36, "Yāsīn", true, false) },
    { number: 2, stepsSunni: [], stepsShia: rakah(2, 24, "al-Nūr", false, true) },
  ],
};
