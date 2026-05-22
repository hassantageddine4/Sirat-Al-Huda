// src/data/prayerWalkthrough/salatAlTasbih.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Tasbīḥ — The Prayer of Glorification
//
// 4 rakahs total (2 sets of 2 rakahs, with tashahhud + salām between sets).
// 75 tasbīḥs per rakah × 4 = 300 total.
//
// Distribution of the 75 per rakah:
//   15 — standing after al-Fātiḥah + sūrah (before rukūʿ)
//   10 — in rukūʿ (after the usual tasbīḥ of rukūʿ)
//   10 — standing after rising from rukūʿ
//   10 — in the first sujūd (after the usual tasbīḥ of sujūd)
//   10 — sitting between the two prostrations
//   10 — in the second sujūd
//   10 — sitting briefly after the second sujūd (before standing for next rakah)
//
// Surahs (Hassan's spec, both branches):
//   r1: al-Takāthur (Q102)
//   r2: al-ʿAṣr (Q103)
//   r3: al-Kāfirūn (Q109)
//   r4: al-Ikhlāṣ (Q112)
//
// The tasbīḥ: "Subḥāna llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh, wa-llāhu akbar"
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
  POSTURES,
} from "./instructions_drafts/_sharedShia";

const P = "salatAlTasbih";

const tasbihText = {
  arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna-llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh, wa-llāhu akbar.",
  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",
  reference: "Sunan Abī Dāwūd 1297; al-Kāfī vol. 3.",
  audioId: null,
};

// ─── Specialised tasbīḥ moments ─────────────────────────────────────────────

function tasbihStanding(rakah) {
  return {
    id: `${P}-r${rakah}-tasbih-standing`,
    title: "Recite the Tasbīḥ 15× — Standing",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Before bowing into rukūʿ, while still standing, recite the tasbīḥ slowly fifteen times.",
    recitation: tasbihText,
    recitationNote: "Recited 15 times silently.",
    tip: "Keep count on your fingers or a tasbīḥ bead. Move at a steady, mindful pace.",
    transition: "After the fifteenth tasbīḥ, bow into rukūʿ.",
    source: "Sunan Abī Dāwūd 1297.",
    madhhabNote: null,
  };
}

function tasbihAfterSujud(rakah, isLastInSet) {
  return {
    id: `${P}-r${rakah}-tasbih-postsujud`,
    title: "Recite the Tasbīḥ 10× — Sitting",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "After the second prostration, sit briefly and recite the tasbīḥ ten more times. This completes 75 tasbīḥs for this rakah.",
    recitation: tasbihText,
    recitationNote: "Recited 10 times silently.",
    tip: "This 'jalsat al-istirāḥah' (resting sitting) is when the final 10 tasbīḥs of the rakah are recited.",
    transition: isLastInSet
      ? "After the tenth, recite the final tashahhud."
      : "After the tenth, rise to standing for the next rakah.",
    source: "Sunan Abī Dāwūd 1297.",
    madhhabNote: null,
  };
}

// Extra-instruction strings used to add the 10x tasbīḥ to the existing
// posture steps (ruku, iitidal, sujud1, jalsa, sujud2).
const rukuExtra =
  "After the tasbīḥ of rukūʿ, recite the Ṣalāt al-Tasbīḥ formula ten times before rising.";
const rukuNote =
  "Three (or one long) tasbīḥ of rukūʿ, then 10× the Tasbīḥ formula.";

const iitidalExtra =
  "While standing upright, recite the Ṣalāt al-Tasbīḥ formula ten times before descending into sujūd.";

const sujud1Extra =
  "After the tasbīḥ of sujūd, recite the Ṣalāt al-Tasbīḥ formula ten times before rising.";
const sujud1Note =
  "Three (or one long) tasbīḥ of sujūd, then 10× the Tasbīḥ formula.";

const jalsaExtra =
  "While seated between the two prostrations, recite the Ṣalāt al-Tasbīḥ formula ten times.";

const sujud2Extra =
  "After the tasbīḥ of sujūd, recite the Ṣalāt al-Tasbīḥ formula ten more times.";

// ─── Rakah constructors ────────────────────────────────────────────────────

function rakahShia(rakah, chapterId, surahName, isFirst, isLastInSet) {
  const steps = [];
  if (isFirst) {
    steps.push(
      shiaQiyamIntention(
        P,
        "Ṣalāt al-Tasbīḥ",
        "two rakahs",
        "Salāt al-Tasbīḥ is prayed as 2 sets of 2 rakahs. This is the first set."
      ),
      shiaTakbir(P),
    );
  } else {
    steps.push(shiaQiyamMid(P, rakah));
  }
  steps.push(
    shiaFatiha(P, rakah),
    shiaSurahFromQuran(P, rakah, chapterId, surahName),
    tasbihStanding(rakah),
    shiaRuku(P, rakah, rukuExtra, rukuNote),
    shiaIitidal(P, rakah, iitidalExtra),
    shiaSujud1(P, rakah, sujud1Extra, sujud1Note),
    shiaJalsa(P, rakah, jalsaExtra),
    shiaSujud2(P, rakah, null, sujud2Extra),
    tasbihAfterSujud(rakah, isLastInSet),
  );
  if (isLastInSet) {
    steps.push(
      shiaFinalTashahhud(P, rakah),
      shiaSalam(P, rakah, rakah === 2
        ? "Now stand again and begin the next 2 rakahs with a fresh intention."
        : "Ṣalāt al-Tasbīḥ is complete. May Allah accept your worship."),
    );
  }
  return steps;
}

function rakahSunni(rakah, chapterId, surahName, isFirst, isLastInSet) {
  const steps = [];
  if (isFirst) {
    steps.push(
      sunniQiyamIntention(
        P,
        "Ṣalāt al-Tasbīḥ",
        "two rakahs",
        "Salāt al-Tasbīḥ is prayed as 2 sets of 2 rakahs. This is the first set."
      ),
      sunniTakbir(P),
    );
  } else {
    steps.push(sunniQiyamMid(P, rakah));
  }
  steps.push(
    sunniFatiha(P, rakah),
    sunniSurahFromQuran(P, rakah, chapterId, surahName),
    tasbihStanding(rakah),
    sunniRuku(P, rakah, rukuExtra, rukuNote),
    sunniIitidal(P, rakah, iitidalExtra),
    sunniSujud1(P, rakah, sujud1Extra, sujud1Note),
    sunniJalsa(P, rakah, jalsaExtra),
    sunniSujud2(P, rakah, null, sujud2Extra),
    tasbihAfterSujud(rakah, isLastInSet),
  );
  if (isLastInSet) {
    steps.push(
      sunniFinalTashahhud(P, rakah),
      sunniSalam(P, rakah, rakah === 2
        ? "Now stand again and begin the next 2 rakahs with a fresh intention."
        : "Ṣalāt al-Tasbīḥ is complete. May Allah accept your worship."),
    );
  }
  return steps;
}

export const salatAlTasbih = {
  id: "salatAlTasbih",
  name: "Ṣalāt al-Tasbīḥ",
  arabicName: "صلاة التسبيح",
  subtitle: "Prayer of glorification — 300 tasbīḥs",
  rakahCount: 4,
  category: "recommended",
  tradition: "both",
  summary: "Four rakahs of voluntary prayer in which the tasbīḥ formula ('Subḥāna-llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh, wa-llāhu akbar') is recited 75 times per rakah, distributed across all postures, totalling 300 tasbīḥs. Prayed as two sets of two rakahs with tashahhud and salām between them.",
  draftNotice: "DRAFT — Scholar review required.",
  rakahs: [
    { number: 1, stepsSunni: rakahSunni(1, 102, "al-Takāthur", true, false),  stepsShia: rakahShia(1, 102, "al-Takāthur", true, false) },
    { number: 2, stepsSunni: rakahSunni(2, 103, "al-ʿAṣr",    false, true),  stepsShia: rakahShia(2, 103, "al-ʿAṣr",    false, true) },
    { number: 3, stepsSunni: rakahSunni(3, 109, "al-Kāfirūn", true, false),  stepsShia: rakahShia(3, 109, "al-Kāfirūn", true, false) },
    { number: 4, stepsSunni: rakahSunni(4, 112, "al-Ikhlāṣ",  false, true),  stepsShia: rakahShia(4, 112, "al-Ikhlāṣ",  false, true) },
  ],
};
