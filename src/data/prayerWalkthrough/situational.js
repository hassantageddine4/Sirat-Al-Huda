// src/data/prayerWalkthrough/situational.js
// ─────────────────────────────────────────────────────────────────────────────
// Situational guidance entries — Travel/Qasr and Rawatib. Direct ports of
// TravelGuidance.swift and RawatibGuidance.swift.
//
// These aren't walkthroughs of physical prayer — they're explanatory entries
// that share the walkthrough engine. Each "step" is informational.
// ─────────────────────────────────────────────────────────────────────────────

import { POSTURES } from "./stepBuilders";

// ─── Travel & Qasr ──────────────────────────────────────────────────────────

function travelSteps(madhhab) {
  const distance = madhhab === "sunni"
    ? "Approximately 48 miles (about 80 km), or roughly the distance traditionally walked in two days. Modern scholars often interpret this as the threshold for international or significantly long travel."
    : "Approximately 8 farsakh (about 44 km / 27 miles) by land, with a return planned in less than 10 days.";
  const duration = madhhab === "sunni"
    ? "If you intend to stay at your destination for more than 4 days (excluding the days of arrival and departure), you become resident and pray fully. The Hanafī school sets the threshold at 15 days."
    : "If you intend to stay 10 days or more, you pray fully. Less than 10 days, continue praying qaṣr.";
  const combiningNote = madhhab === "sunni"
    ? "Combining (jamʿ) of Dhuhr+Asr or Maghrib+Isha is permitted while travelling — pray them together at the time of either, joined but each shortened."
    : "Combining is permitted not only in travel but at home as well in the Shia tradition: Dhuhr+Asr together (with their adhāns), Maghrib+Isha together. Many practising Shia Muslims combine these as their normal practice.";

  return [
    {
      id: "travel-intro",
      title: "What is Qaṣr?",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "Qaṣr (literally 'shortening') is the concession given to travellers to pray the four-rakah obligatory prayers as two rakahs instead. Fajr (2 rakahs) and Maghrib (3 rakahs) remain unchanged. This concession is mentioned in Qur'an 4:101.",
      recitation: null,
      tip: null,
      madhhabNote: null,
    },
    {
      id: "travel-distance",
      title: "Threshold Distance",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: `Qaṣr applies when your journey exceeds the threshold distance from your city of residence.\n\n${distance}`,
      recitation: null,
      tip: null,
      madhhabNote: "The exact threshold has classical and modern interpretations. Confirm with a scholar of your madhhab if in doubt.",
    },
    {
      id: "travel-duration",
      title: "How Long You're Travelling",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: `Qaṣr is a concession for travel, not for residency at the destination.\n\n${duration}`,
      recitation: null,
      tip: null,
      madhhabNote: null,
    },
    {
      id: "travel-which",
      title: "Which Prayers Are Shortened?",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "Shortened to 2 rakahs:  Dhuhr, Asr, Isha.\n\nUnchanged:  Fajr (2 rakahs), Maghrib (3 rakahs).\n\nWhen you pray a shortened prayer, simply walk through 2 rakahs of the prayer in this app — the guide for Fajr's structure is the closest match. Make the intention for the shortened version of the prayer.",
      recitation: null,
      tip: null,
      madhhabNote: null,
    },
    {
      id: "travel-combining",
      title: "Combining Prayers (Jamʿ)",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: `Travelling also permits combining certain prayers together at the time of one of them.\n\n${combiningNote}`,
      recitation: null,
      tip: "When combining, pray each prayer in full sequence — finish one prayer entirely, then begin the next.",
      madhhabNote: null,
    },
    {
      id: "travel-prayer-behind-resident",
      title: "Praying Behind a Resident",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "If you (a traveller) pray behind a resident imam who is praying the full 4 rakahs, you complete the full prayer with him — you do not shorten. If a resident prays behind a traveller who shortens, the resident completes the remaining rakahs after the traveller's salām.",
      recitation: null,
      tip: null,
      madhhabNote: null,
    },
  ];
}

export const travelGuidance = {
  id: "travel",
  tradition: "both",
  name: "Travel & Qaṣr",
  arabicName: "القصر",
  subtitle: "Shortening prayers while travelling",
  rakahCount: 1,
  category: "situational",
  summary: "When travelling beyond a defined distance, the four-rakah obligatory prayers (Dhuhr, Asr, Isha) are shortened to two rakahs. This is a guidance entry, not a walkthrough.",
  rakahs: [
    {
      number: 1,
      stepsSunni: travelSteps("sunni"),
      stepsShia:  travelSteps("shia"),
    },
  ],
};

// ─── Rawatib ────────────────────────────────────────────────────────────────

function rawatibStep(id, title, instruction) {
  return {
    id,
    title,
    posture: POSTURES.STANDING,
    assetName: null,
    instruction,
    recitation: null,
    tip: null,
    madhhabNote: null,
  };
}

const rawatibIntroStep = {
  id: "rawatib-intro",
  title: "What are Rawātib?",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Rawātib are voluntary prayers performed before or after the obligatory daily prayers. The Prophet ﷺ regularly observed twelve rakahs of these daily, with the promise that whoever maintains them will have a house built for them in Paradise (Sunan al-Tirmidhī).",
  recitation: null,
  tip: "Each rawātib unit is 2 rakahs — pray them like any standard voluntary 2-rakah prayer.",
  madhhabNote: null,
};

function rawatibSteps(madhhab) {
  if (madhhab === "sunni") {
    return [
      rawatibIntroStep,
      rawatibStep("rawatib-fajr",
        "Before Fajr — 2 rakahs",
        "Two rakahs prayed BEFORE Fajr's obligatory prayer. These are the most strongly emphasized rawātib — the Prophet ﷺ rarely missed them, even while travelling. Recite Al-Fātiḥah and a short sūrah; keep them brief."),
      rawatibStep("rawatib-dhuhr-before",
        "Before Dhuhr — 4 rakahs",
        "Four rakahs prayed BEFORE Dhuhr (in two pairs of 2). Some scholars recommend 2 instead of 4."),
      rawatibStep("rawatib-dhuhr-after",
        "After Dhuhr — 2 rakahs",
        "Two rakahs prayed AFTER Dhuhr's obligatory prayer."),
      rawatibStep("rawatib-maghrib",
        "After Maghrib — 2 rakahs",
        "Two rakahs prayed AFTER Maghrib's obligatory prayer."),
      rawatibStep("rawatib-isha",
        "After Isha — 2 rakahs",
        "Two rakahs prayed AFTER Isha's obligatory prayer.\n\nTotal daily: 12 rakahs of regularly-observed sunnah."),
      rawatibStep("rawatib-asr",
        "Before Asr — 4 rakahs (additional)",
        "Four rakahs before Asr are additionally recommended (sunnah ghayr mu'akkadah). The Prophet ﷺ said: 'May Allah have mercy on the one who prays four before Asr.'"),
    ];
  }
  return [
    rawatibIntroStep,
    rawatibStep("rawatib-fajr-shia",
      "Before Fajr — 2 rakahs (nāfilat al-fajr)",
      "Two rakahs prayed BEFORE Fajr's obligatory prayer."),
    rawatibStep("rawatib-dhuhr-shia",
      "Before Dhuhr — 8 rakahs (nāfilat aẓ-ẓuhr)",
      "Eight rakahs prayed BEFORE Dhuhr (in 2-rakah pairs)."),
    rawatibStep("rawatib-asr-shia",
      "Before Asr — 8 rakahs (nāfilat al-ʿaṣr)",
      "Eight rakahs prayed BEFORE Asr (in 2-rakah pairs)."),
    rawatibStep("rawatib-maghrib-shia",
      "After Maghrib — 4 rakahs (nāfilat al-maghrib)",
      "Four rakahs prayed AFTER Maghrib (in 2-rakah pairs)."),
    rawatibStep("rawatib-isha-shia",
      "After Isha — 2 rakahs (al-witīra, sitting)",
      "Two rakahs prayed AFTER Isha — performed while seated, counted as one in the Shia tradition."),
    rawatibStep("rawatib-layl-shia",
      "Ṣalāt al-Layl — 11 rakahs (night)",
      "Eleven rakahs at night before Fajr: 8 rakahs of nāfilat al-layl, 2 rakahs of shafʿ, and 1 rakah of witr.\n\nTotal daily nawāfil: 34 rakahs in the standard Shia schedule, twice the obligatory count."),
  ];
}

export const rawatibGuidance = {
  id: "rawatib",
  tradition: "sunni",
  name: "Rawātib",
  arabicName: "الرواتب",
  subtitle: "Regular sunnah prayers",
  rakahCount: 1,
  category: "situational",
  summary: "Voluntary 2-rakah prayers that accompany the daily 5. This guide explains the schedule; pray each unit using the standard 2-rakah structure.",
  rakahs: [
    {
      number: 1,
      stepsSunni: rawatibSteps("sunni"),
      stepsShia:  rawatibSteps("shia"),
    },
  ],
};

export const situational = [travelGuidance, rawatibGuidance];
