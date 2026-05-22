// src/data/prayerWalkthrough/jafarAtTayyar.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Jaʿfar aṭ-Ṭayyār — Prayer of Jaʿfar the Flyer
//
// Taught by the Prophet ﷺ to his cousin Jaʿfar ibn Abī Ṭālib (ʿa) on his
// return from Abyssinia. Same 75-tasbīḥ-per-rakah structure as Ṣalāt
// al-Tasbīḥ, but with different sūrahs and addressed in the Shia tradition.
//
// 4 rakahs total (2 sets of 2). 300 tasbīḥs total.
//
// Surahs (Hassan's spec):
//   r1: al-Fātiḥah + al-Zalzalah (Q99)
//   r2: al-Fātiḥah + al-ʿĀdiyāt   (Q100)
//   r3: al-Fātiḥah + al-Naṣr      (Q110)
//   r4: al-Fātiḥah + al-Ikhlāṣ    (Q112)
//
// Tasbīḥ formula: "Subḥāna llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh,
// wa-llāhu akbar."
//
// ⚠️ DRAFT — Scholar review required.
// ─────────────────────────────────────────────────────────────────────────────

import {
  shiaQiyamIntention, shiaTakbir, shiaFatiha, shiaSurahFromQuran,
  shiaRuku, shiaIitidal, shiaSujud1, shiaJalsa, shiaSujud2,
  shiaQiyamMid, shiaFinalTashahhud, shiaSalam,
  POSTURES,
} from "./instructions_drafts/_sharedShia";

const P = "jafarAtTayyar";

const tasbihText = {
  arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna-llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh, wa-llāhu akbar.",
  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",
  reference: "al-Kāfī vol. 3; Mafātīḥ al-Jinān.",
  audioId: null,
};

function tasbihStanding(rakah) {
  return {
    id: `${P}-r${rakah}-tasbih-standing`,
    title: "Recite the Tasbīḥ 15× — Standing",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Before bowing into rukūʿ, while still standing, recite the tasbīḥ fifteen times.",
    recitation: tasbihText,
    recitationNote: "Recited 15 times silently.",
    tip: "Keep count on your fingers or a tasbīḥ bead.",
    transition: "After the fifteenth, bow into rukūʿ.",
    source: "Mafātīḥ al-Jinān.",
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
    tip: null,
    transition: isLastInSet
      ? "After the tenth, recite the final tashahhud."
      : "After the tenth, rise to standing for the next rakah.",
    source: "Mafātīḥ al-Jinān.",
    madhhabNote: null,
  };
}

const rukuExtra =
  "After the tasbīḥ of rukūʿ, recite the Jaʿfar aṭ-Ṭayyār tasbīḥ formula ten times before rising.";
const rukuNote =
  "Three tasbīḥ of rukūʿ, then 10× the Jaʿfar tasbīḥ.";

const iitidalExtra =
  "While standing upright, recite the Jaʿfar tasbīḥ ten times before descending into sujūd.";

const sujud1Extra =
  "After the tasbīḥ of sujūd, recite the Jaʿfar tasbīḥ ten times before rising.";
const sujud1Note =
  "Three tasbīḥ of sujūd, then 10× the Jaʿfar tasbīḥ.";

const jalsaExtra =
  "While seated between the two prostrations, recite the Jaʿfar tasbīḥ ten times.";

const sujud2Extra =
  "After the tasbīḥ of sujūd, recite the Jaʿfar tasbīḥ ten more times.";

function rakahShia(rakah, chapterId, surahName, isFirst, isLastInSet) {
  const steps = [];
  if (isFirst) {
    steps.push(
      shiaQiyamIntention(
        P,
        "Ṣalāt Jaʿfar aṭ-Ṭayyār",
        "two rakahs",
        "Prayed as 2 sets of 2 rakahs. Taught by the Prophet ﷺ to Jaʿfar ibn Abī Ṭālib (ʿa)."
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
        : "Ṣalāt Jaʿfar aṭ-Ṭayyār is complete. The Prophet ﷺ said: 'If your sins were like the foam of the sea, they would be forgiven by this prayer.'"),
    );
  }
  return steps;
}

export const jafarAtTayyar = {
  id: "jafarAtTayyar",
  name: "Ṣalāt Jaʿfar aṭ-Ṭayyār",
  arabicName: "صلاة جعفر الطيار",
  subtitle: "The prayer of Jaʿfar the Flyer — 300 tasbīḥs",
  rakahCount: 4,
  category: "recommended",
  tradition: "shia",
  summary: "A 4-rakah voluntary prayer taught by the Prophet ﷺ to his cousin Jaʿfar ibn Abī Ṭālib (ʿa). Same 75-tasbīḥ-per-rakah structure as Ṣalāt al-Tasbīḥ but with different sūrahs. The Prophet ﷺ said: 'If your sins were like the foam of the sea, they would be forgiven by this prayer.'",
  draftNotice: "DRAFT — Scholar review required.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: rakahShia(1,  99, "al-Zalzalah", true, false) },
    { number: 2, stepsSunni: [], stepsShia: rakahShia(2, 100, "al-ʿĀdiyāt",  false, true) },
    { number: 3, stepsSunni: [], stepsShia: rakahShia(3, 110, "al-Naṣr",     true, false) },
    { number: 4, stepsSunni: [], stepsShia: rakahShia(4, 112, "al-Ikhlāṣ",   false, true) },
  ],
};
