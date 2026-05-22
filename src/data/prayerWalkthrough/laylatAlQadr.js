// src/data/prayerWalkthrough/laylatAlQadr.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Laylat al-Qadr — Night of Power voluntary prayer
//
// 2 rakahs. Surahs (Hassan's spec, both branches):
//   r1: al-Fātiḥah + al-Qadr (Q97)
//   r2: al-Fātiḥah + al-Ikhlāṣ (Q112)
//
// Recommended on the odd nights of the last ten of Ramaḍān, especially 23rd
// (Shia tradition) and 27th (Sunni tradition).
//
// ⚠️ DRAFT — Scholar review required.
// ─────────────────────────────────────────────────────────────────────────────

import {
  shiaQiyamIntention, shiaTakbir, shiaFatiha, shiaSurahFromQuran,
  shiaRuku, shiaIitidal, shiaSujud1, shiaJalsa, shiaSujud2,
  shiaQiyamMid, shiaFinalTashahhud, shiaSalam,
  sunniQiyamIntention, sunniTakbir, sunniFatiha, sunniSurahFromQuran,
  sunniRuku, sunniIitidal, sunniSujud1, sunniJalsa, sunniSujud2,
  sunniQiyamMid, sunniFinalTashahhud, sunniSalam,
} from "./instructions_drafts/_sharedShia";

const P = "laylatAlQadr";

const rakah1Sunni = [
  sunniQiyamIntention(P, "Ṣalāt Laylat al-Qadr", "two rakahs"),
  sunniTakbir(P),
  sunniFatiha(P, 1),
  sunniSurahFromQuran(P, 1, 97, "al-Qadr", "Sūrat al-Qadr — the sūrah that describes this very night."),
  sunniRuku(P, 1),
  sunniIitidal(P, 1),
  sunniSujud1(P, 1),
  sunniJalsa(P, 1),
  sunniSujud2(P, 1, "Rise to standing for the second rakah."),
];

const rakah2Sunni = [
  sunniQiyamMid(P, 2),
  sunniFatiha(P, 2),
  sunniSurahFromQuran(P, 2, 112, "al-Ikhlāṣ"),
  sunniRuku(P, 2),
  sunniIitidal(P, 2),
  sunniSujud1(P, 2),
  sunniJalsa(P, 2),
  sunniSujud2(P, 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud(P, 2),
  sunniSalam(P, 2, "The Laylat al-Qadr prayer is complete. Continue the night with Qur'an, du'a, and istighfār."),
];

const rakah1Shia = [
  shiaQiyamIntention(P, "Ṣalāt Laylat al-Qadr", "two rakahs"),
  shiaTakbir(P),
  shiaFatiha(P, 1),
  shiaSurahFromQuran(P, 1, 97, "al-Qadr", "Sūrat al-Qadr — the sūrah that describes this very night."),
  shiaRuku(P, 1),
  shiaIitidal(P, 1),
  shiaSujud1(P, 1),
  shiaJalsa(P, 1),
  shiaSujud2(P, 1, "Rise to standing for the second rakah."),
];

const rakah2Shia = [
  shiaQiyamMid(P, 2),
  shiaFatiha(P, 2),
  shiaSurahFromQuran(P, 2, 112, "al-Ikhlāṣ"),
  shiaRuku(P, 2),
  shiaIitidal(P, 2),
  shiaSujud1(P, 2),
  shiaJalsa(P, 2),
  shiaSujud2(P, 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud(P, 2),
  shiaSalam(P, 2, "The Laylat al-Qadr prayer is complete. Continue the night with Qur'an, du'a, and the aʿmāl of Laylat al-Qadr from Mafātīḥ al-Jinān."),
];

export const laylatAlQadr = {
  id: "laylatAlQadr",
  name: "Ṣalāt Laylat al-Qadr",
  arabicName: "صلاة ليلة القدر",
  subtitle: "Night of Power prayer",
  rakahCount: 2,
  category: "occasional",
  tradition: "both",
  summary: "Two rakahs of voluntary prayer recommended on the Night of Power — among the most virtuous nights of the year. Sūrat al-Qadr in the first rakah, al-Ikhlāṣ in the second.",
  draftNotice: "DRAFT — Scholar review required.",
  rakahs: [
    { number: 1, stepsSunni: rakah1Sunni, stepsShia: rakah1Shia },
    { number: 2, stepsSunni: rakah2Sunni, stepsShia: rakah2Shia },
  ],
};
