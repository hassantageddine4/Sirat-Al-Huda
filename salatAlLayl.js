// src/data/prayerWalkthrough/salatAlLayl.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Layl (Night Prayer Cycle)
//
// The Shīʿī Imāmī night-prayer practice consisting of 11 rakahs total:
//   • 8 rakahs of Nāfilat al-Layl (four pairs of 2 rakahs each)
//   • 2 rakahs of Ṣalāt al-Shafʿ
//   • 1 rakah of Ṣalāt al-Witr (with qunūt)
//
// Time: between midnight and dawn (best in the last third of the night).
// All 11 rakahs are highly recommended (muʾakkad) in the Ja'farī tradition.
//
// This walkthrough shows ONE PAIR of Nāfilat al-Layl. The structure of every
// pair is identical — only the niyyah changes for the final 2 (Shafʿ) and
// the closing rakah (Witr with qunūt, covered separately).
//
// ⚠️ DRAFT — All content drawn from public Shia jurisprudence sources
// (al-islam.org, wikishia, Mafātīḥ al-Jinān, Sayyid Sistani's risalah).
// MUST be reviewed by a qualified Ja'farī scholar before being shipped.
// ─────────────────────────────────────────────────────────────────────────────

import { Step, POSTURES } from "./stepBuilders";

// ─── Inline recitations specific to this prayer ─────────────────────────────

// Du'a al-Qunūt (Shia form) for the Witr rakah portion
const qunutShia = {
  arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ الْعَلِيُّ الْعَظِيمُ، سُبْحَانَ اللَّهِ رَبِّ السَّمَاوَاتِ السَّبْعِ وَرَبِّ الْأَرَضِينَ السَّبْعِ، وَمَا فِيهِنَّ وَمَا بَيْنَهُنَّ، وَرَبِّ الْعَرْشِ الْعَظِيمِ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
  transliteration: "Lā ilāha illā llāhu l-ḥalīmu l-karīm. Lā ilāha illā llāhu l-ʿaliyyu l-ʿaẓīm. Subḥāna llāhi rabbi s-samāwāti s-sabʿ wa rabbi l-araḍīna s-sabʿ wa mā fīhinna wa mā baynahunna wa rabbi l-ʿarshi l-ʿaẓīm. Wa l-ḥamdu lillāhi rabbi l-ʿālamīn. Allāhumma ghfir li l-muʾminīna wa l-muʾmināt.",
  translation: "There is no god but Allah, the Forbearing, the Generous. There is no god but Allah, the Most High, the Most Great. Glory to Allah, Lord of the seven heavens and Lord of the seven earths, and what is in them and between them, and Lord of the Mighty Throne. Praise be to Allah, Lord of the worlds. O Allah, forgive the believing men and the believing women.",
  reference: "Mafātīḥ al-Jinān",
  audioId: null,
};

// ─── Niyyah notes ───────────────────────────────────────────────────────────

const niyyahNafilatLayl = "Form the intention silently: 'I am praying two rakahs of Nāfilat al-Layl, qurbatan ilā-llāh (seeking nearness to Allah).'";
const niyyahShaf       = "Form the intention silently: 'I am praying two rakahs of Ṣalāt al-Shafʿ, qurbatan ilā-llāh (seeking nearness to Allah).'";
const niyyahWitr       = "Form the intention silently: 'I am praying one rakah of Ṣalāt al-Witr, qurbatan ilā-llāh (seeking nearness to Allah).'";

// ─── Qunūt step (used in the Witr rakah only) ───────────────────────────────

const qunutStep = {
  id: "salatLayl-witr-qunut",
  title: "Du'a al-Qunūt",
  posture: POSTURES.STANDING,
  assetName: "pose_qunut",
  instruction: "Before going into rukūʿ, raise both hands palms-up to the level of the face and recite the qunūt. You may add personal supplications, prayers for forgiveness, and salawāt upon Muḥammad and his family.",
  recitation: qunutShia,
  tip: "Qunūt in Ṣalāt al-Layl is the prescribed moment to make heartfelt du'a. Take your time. Pray for the believing men and women, your loved ones who have passed, and your own needs.",
  madhhabNote: "Shia practice: qunūt is BEFORE rukūʿ in the Witr rakah. The hands are raised palms-up.",
};

// ─── Rakah construction ─────────────────────────────────────────────────────

function nafilatLaylRakah1() {
  const prayer = "salatAlLayl";
  const rakah = 1;

  const qiyam = Step.qiyamFirst(prayer, rakah);
  qiyam.shia.instruction = `Stand upright facing the qiblah. ${niyyahNafilatLayl}`;
  qiyam.sunni.instruction = qiyam.shia.instruction;

  const takbir = Step.takbirOpening(prayer, rakah);

  const steps = [
    qiyam.shia,
    takbir.shia,
    Step.fatiha(prayer, rakah, false),
    Step.surah(prayer, rakah, false),
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
  ];

  return { number: 1, stepsSunni: steps, stepsShia: steps };
}

function nafilatLaylRakah2() {
  const prayer = "salatAlLayl";
  const rakah = 2;

  const qiyamMid = Step.qiyamMid?.(prayer, rakah) ?? Step.qiyamFirst(prayer, rakah);
  qiyamMid.shia.title = "Stand for the second rakah";
  qiyamMid.shia.instruction = "Rise from sujūd to stand for the second rakah, saying takbīr.";

  const tash = Step.tashahhud(prayer, rakah, true);
  const repeatNote = {
    id: "salatLayl-r2-repeatNote",
    title: "Continue the cycle",
    posture: POSTURES.KNEELING,
    assetName: null,
    instruction: "You have completed one pair of Nāfilat al-Layl. The full cycle is: pray this pair THREE more times (for a total of 8 rakahs of Nāfilat al-Layl), then 2 rakahs of Ṣalāt al-Shafʿ (same structure, different niyyah), then 1 rakah of Ṣalāt al-Witr (with qunūt before rukūʿ).",
    recitation: null,
    tip: "If you don't have time for all 11, the Witr alone still counts.",
    madhhabNote: null,
  };

  const steps = [
    qiyamMid.shia,
    Step.fatiha(prayer, rakah, false),
    Step.surah(prayer, rakah, false),
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
    tash.shia,
    Step.salam(prayer, rakah),
    repeatNote,
  ];

  return { number: 2, stepsSunni: steps, stepsShia: steps };
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const salatAlLayl = {
  id: "salatAlLayl",
  tradition: "shia",
  name: "Ṣalāt al-Layl",
  arabicName: "صلاة الليل",
  subtitle: "Night prayer cycle",
  rakahCount: 2,
  category: "recommended",
  summary: "Eleven rakahs of voluntary night prayer: 8 rakahs of Nāfilat al-Layl (four pairs), 2 rakahs of Shafʿ, and 1 rakah of Witr with qunūt. Best prayed in the last third of the night. This walkthrough shows one Nāfilat al-Layl pair — the structure of every pair is identical; only the niyyah differs for Shafʿ and Witr.",
  draftNotice: "This walkthrough is a draft compiled from public Shia sources. It has not yet been reviewed by a qualified Ja'farī scholar.",
  rakahs: [nafilatLaylRakah1(), nafilatLaylRakah2()],

  // Optional: notes for the prayer detail header
  fullStructureNote: {
    nafilatLayl: "8 rakahs in 4 pairs (this pair × 4)",
    shaf:        "2 rakahs (same structure as above, with niyyah of Shafʿ)",
    witr:        "1 rakah with qunūt before rukūʿ",
    qunutDua:    qunutShia,
    niyyahShaf:  niyyahShaf,
    niyyahWitr:  niyyahWitr,
    qunutStep:   qunutStep,
  },
};
