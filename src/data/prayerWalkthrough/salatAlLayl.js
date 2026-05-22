// src/data/prayerWalkthrough/salatAlLayl.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Layl (Night Prayer Cycle) — Shia
//
// 11 rakahs total, structured as 3 separate prayer units:
//   1. Ṣalāt al-Layl proper  — 4 pairs of 2 rakahs = 8 rakahs of Nāfilat al-Layl
//   2. Ṣalāt al-Shafaʿ       — 2 rakahs
//   3. Ṣalāt al-Witr         — 1 rakah with qunūt
//
// Each unit has its own intention and salām, so each is exported as a
// separate prayer for the catalog to register independently.
//
// Surahs per Hassan's spec:
//   Nāfilat al-Layl — r1: al-Ikhlāṣ, r2: al-Kāfirūn
//   Shafaʿ          — r1: al-Ikhlāṣ, r2: al-Ikhlāṣ (Hassan didn't specify; safe default)
//   Witr            — three-qul practice: al-Ikhlāṣ + al-Falaq + al-Nās, then qunūt
//
// ⚠️ DRAFT — Scholar review required before shipping.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "./recitations";
import * as S from "./commonSurahs";

const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// SHIA STEP FACTORIES (self-contained for this file)
// ═════════════════════════════════════════════════════════════════════════════

function shiaQiyamIntention(prayer, prayerName, rakahPhrase) {
  return {
    id: `${prayer}-r1-qiyam`,
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Your arms rest naturally at your sides — they are not folded during qiyām in the Shia tradition. Lower your gaze toward the spot of prostration. Form the intention silently in your heart: 'I am praying ${rakahPhrase} of ${prayerName}, qurbatan ilā-llāh — seeking nearness to Allah.'`,
    recitation: null,
    recitationNote: null,
    tip: "The orientation toward 'qurbatan ilā-llāh' is essential — the act must be for Allah alone.",
    transition: "Once your intention is firm, raise both hands to begin the prayer.",
    source: "Wasāʾil al-Shīʿa, Book of Prayer. Sistani, Tawḍīḥ al-Masāʾil §942–943.",
    madhhabNote: "Hands rest at the sides throughout qiyām, not folded.",
  };
}

function shiaTakbir(prayer) {
  return {
    id: `${prayer}-r1-takbir`,
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: "Raise both hands to the level of your ears with the palms facing the qiblah. As your hands reach their highest point, say the takbīr softly to yourself (night prayers are recited silently). This is the takbīr of consecration — the formal entry into prayer.",
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Obligatory — this is a pillar of the prayer.",
    tip: "Six additional takbīrs before the takbīrat al-iḥrām are recommended (mustaḥabb), with hands raised at each.",
    transition: "After the takbīr, lower your hands back to your sides.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §989–991. al-Kāfī vol. 3.",
    madhhabNote: null,
  };
}

function shiaFatiha(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite Al-Fātiḥah silently. Begin with the basmalah (which is the first verse of the sūrah in the Shia tradition). Continue through all seven verses, pausing briefly at each verse ending. Night prayers are recited silently in the Shia tradition.",
    recitation: R.fatiha,
    recitationNote: "Recited silently. Obligatory.",
    tip: "The basmalah is counted as part of Al-Fātiḥah.",
    transition: "After Al-Fātiḥah, recite the recommended sūrah.",
    source: "Qurʾan 1:1–7. Sistani, Tawḍīḥ al-Masāʾil §993.",
    madhhabNote: null,
  };
}

function shiaSurah(prayer, rakah, surahObj, surahName) {
  return {
    id: `${prayer}-r${rakah}-surah`,
    title: `Second Sūrah — ${surahName}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `After Al-Fātiḥah, recite the complete Sūrat ${surahName} silently. The Shia tradition requires a full sūrah be recited — not just a portion. This sūrah is the recommended pairing for this rakah.`,
    recitation: surahObj,
    recitationNote: "Recited silently. The complete sūrah is obligatory.",
    tip: "If you have not yet memorised this sūrah, you may substitute another complete sūrah you know well.",
    transition: "After completing the sūrah, prepare to bow into rukūʿ.",
    source: surahObj.reference || null,
    madhhabNote: null,
  };
}

function shiaRuku(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow forward, placing your hands on your knees with fingers spread. The back is flat, the head aligned with the back. Once settled, recite the tasbīḥ of rukūʿ — three times of the short form or once of the longer.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory.",
    tip: "Calmness (ṭumaʾnīna) in rukūʿ is obligatory.",
    transition: "Rise to the standing position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  };
}

function shiaIitidal(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise from the bow to a fully upright standing position. It is recommended to say 'Samiʿa-llāhu liman ḥamidah' as you rise. Settle briefly before descending into prostration.",
    recitation: R.samiAllah,
    recitationNote: "Recommended; the standing itself is obligatory.",
    tip: "Standing fully upright after rukūʿ — even briefly — is required for the prayer to be valid.",
    transition: "Say 'Allāhu Akbar' and descend to sujūd.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function shiaSujud1(prayer, rakah, withTurbahTip) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate. The forehead must rest on the turbah (a clay tablet ideally from the earth of Karbalāʾ). The other six points of contact — both palms, both knees, and the big toes of both feet — rest on the ground. Once settled, recite the tasbīḥ of sujūd: three times of the short form or once of the longer.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory.",
    tip: withTurbahTip
      ? "If no turbah is available, prostrate on something earthen or plant-based that is not eaten or worn — paper, a leaf, unprocessed wood, or natural stone."
      : null,
    transition: "Rise to the seated position between the two prostrations.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067, §1075–1080.",
    madhhabNote: null,
  };
}

function shiaJalsa(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Rise from the first sujūd to a brief seated position. Sit in the mutawarrik posture — on your left thigh, with both feet passed to the right side, the right foot resting on the sole of the left. Place your hands palms-down on your thighs. Settle calmly before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended. Calmness in the sitting is obligatory.",
    tip: "The mutawarrik sitting on the left thigh is the standard Shia posture.",
    transition: "Say 'Allāhu Akbar' and descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  };
}

function shiaSujud2(prayer, rakah, transition) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah, with all seven points of contact as before. Recite the tasbīḥ at least three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition,
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  };
}

function shiaQiyamMid(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-qiyam`,
    title: `Standing for Rakah ${rakah}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to a standing position saying 'Allāhu Akbar', with arms naturally at the sides.",
    recitation: null,
    recitationNote: null,
    tip: "While rising, it is recommended to say 'bi-ḥawli-llāhi wa quwwatihī aqūmu wa aqʿud'.",
    transition: "Begin Al-Fātiḥah directly.",
    source: "Mafātīḥ al-Jinān.",
    madhhabNote: null,
  };
}

function shiaFinalTashahhud(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-tashahhud`,
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_shia",
    instruction: "Sit in the mutawarrik posture — on the left thigh, both feet to the right. Place your hands palms-down on your thighs. Recite the Shia form of the tashahhud, including the testimony of faith and the ṣalawāt upon Muḥammad and his family.",
    recitation: R.tashahhudShia,
    recitationNote: "Recited silently. Obligatory in the final sitting.",
    tip: "Sending blessings on the Prophet and his family is part of the tashahhud itself in Shia practice.",
    transition: "After the tashahhud, prepare for the closing salām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1126.",
    madhhabNote: null,
  };
}

function shiaSalam(prayer, rakah, transition = "The prayer is now complete.") {
  return {
    id: `${prayer}-r${rakah}-salam`,
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_shia",
    instruction: "While still seated facing the qiblah, recite the salām. The obligatory form is 'As-salāmu ʿalaykum wa raḥmatu-llāhi wa barakātuh' said once. It is recommended to precede this with two further salām phrases addressed to the Prophet ﷺ and to the righteous servants of Allah.",
    recitation: R.salam,
    recitationNote: "The third (final) salām is obligatory. The first two are recommended.",
    tip: "After the salām, recite Tasbīḥ al-Zahrāʾ (ʿa): 34 takbīrs, 33 alḥamdulillāhs, 33 subḥāna-llāhs.",
    transition,
    source: "Sistani, Tawḍīḥ al-Masāʾil §1133–1136.",
    madhhabNote: null,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SALAT AL-LAYL (Nāfilat al-Layl — 2-rakah pair, repeat 4 times for 8 rakahs)
// ═════════════════════════════════════════════════════════════════════════════

const salatAlLaylRakah1 = [
  shiaQiyamIntention("salatAlLayl", "Nāfilat al-Layl", "two rakahs of Nāfilat al-Layl (one pair of the 8-rakah set)"),
  shiaTakbir("salatAlLayl"),
  shiaFatiha("salatAlLayl", 1),
  shiaSurah("salatAlLayl", 1, R.ikhlas, "Al-Ikhlāṣ"),
  shiaRuku("salatAlLayl", 1),
  shiaIitidal("salatAlLayl", 1),
  shiaSujud1("salatAlLayl", 1, true),
  shiaJalsa("salatAlLayl", 1),
  shiaSujud2("salatAlLayl", 1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const salatAlLaylRakah2 = [
  shiaQiyamMid("salatAlLayl", 2),
  shiaFatiha("salatAlLayl", 2),
  shiaSurah("salatAlLayl", 2, S.surahKafirun, "Al-Kāfirūn"),
  shiaRuku("salatAlLayl", 2),
  shiaIitidal("salatAlLayl", 2),
  shiaSujud1("salatAlLayl", 2, false),
  shiaJalsa("salatAlLayl", 2),
  shiaSujud2("salatAlLayl", 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("salatAlLayl", 2),
  shiaSalam("salatAlLayl", 2),
  {
    id: "salatAlLayl-continue",
    title: "Continue the Cycle",
    posture: POSTURES.KNEELING,
    assetName: null,
    instruction: "You have completed ONE pair of Nāfilat al-Layl. The full Nāfilat al-Layl is FOUR pairs total (8 rakahs). Repeat this same 2-rakah unit three more times. After completing all 8 rakahs of Nāfilat al-Layl, proceed to Ṣalāt al-Shafaʿ (2 rakahs), then Ṣalāt al-Witr (1 rakah). Open those prayers separately from the prayer guide.",
    recitation: null,
    recitationNote: null,
    tip: "If you do not have time for all 11 rakahs, the Witr alone still counts and earns reward.",
    transition: "Open Ṣalāt al-Shafaʿ next to continue the night-prayer cycle.",
    source: null,
    madhhabNote: null,
  },
];

export const salatAlLayl = {
  id: "salatAlLayl",
  name: "Ṣalāt al-Layl",
  arabicName: "صلاة الليل",
  subtitle: "Night prayer cycle — Nāfilat al-Layl pair",
  rakahCount: 2,
  category: "recommended",
  tradition: "shia",
  summary: "First unit of the 11-rakah night prayer cycle. This walkthrough is one 2-rakah pair of Nāfilat al-Layl — repeat it four times for the full 8 rakahs, then continue to Ṣalāt al-Shafaʿ and Ṣalāt al-Witr.",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: salatAlLaylRakah1 },
    { number: 2, stepsSunni: [], stepsShia: salatAlLaylRakah2 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// SALAT AL-SHAFAʿ (2 rakahs)
// ═════════════════════════════════════════════════════════════════════════════

const salatAlShafaRakah1 = [
  shiaQiyamIntention("salatAlShafa", "Ṣalāt al-Shafaʿ", "two rakahs of Shafaʿ"),
  shiaTakbir("salatAlShafa"),
  shiaFatiha("salatAlShafa", 1),
  shiaSurah("salatAlShafa", 1, R.ikhlas, "Al-Ikhlāṣ"),
  shiaRuku("salatAlShafa", 1),
  shiaIitidal("salatAlShafa", 1),
  shiaSujud1("salatAlShafa", 1, true),
  shiaJalsa("salatAlShafa", 1),
  shiaSujud2("salatAlShafa", 1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const salatAlShafaRakah2 = [
  shiaQiyamMid("salatAlShafa", 2),
  shiaFatiha("salatAlShafa", 2),
  shiaSurah("salatAlShafa", 2, R.ikhlas, "Al-Ikhlāṣ"),
  shiaRuku("salatAlShafa", 2),
  shiaIitidal("salatAlShafa", 2),
  shiaSujud1("salatAlShafa", 2, false),
  shiaJalsa("salatAlShafa", 2),
  shiaSujud2("salatAlShafa", 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("salatAlShafa", 2),
  shiaSalam("salatAlShafa", 2, "Now proceed to Ṣalāt al-Witr — the final rakah of the night cycle."),
];

export const salatAlShafa = {
  id: "salatAlShafa",
  name: "Ṣalāt al-Shafaʿ",
  arabicName: "صلاة الشفع",
  subtitle: "Two-rakah unit of the night cycle",
  rakahCount: 2,
  category: "recommended",
  tradition: "shia",
  summary: "Two rakahs prayed after the four pairs of Nāfilat al-Layl, before Ṣalāt al-Witr. Part of the 11-rakah Ṣalāt al-Layl cycle.",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: salatAlShafaRakah1 },
    { number: 2, stepsSunni: [], stepsShia: salatAlShafaRakah2 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// SALAT AL-WITR (1 rakah, Shia — three-qul practice + qunūt)
// ═════════════════════════════════════════════════════════════════════════════

const salatAlWitrShiaQunut = {
  id: "salatAlWitr-r1-dua",
  title: "Du'a",
  posture: POSTURES.STANDING,
  assetName: "pose_qunut",
  instruction: "Before bowing into rukūʿ, raise both hands palms-up to the level of your face and recite the qunūt. This is the great moment of supplication in Ṣalāt al-Layl. Take your time. Pray for the believing men and women, your loved ones who have passed, your own needs, and forgiveness.",
  recitation: R.qunutShia,
  recitationNote: "Recited once with hands raised. Strongly recommended; personal supplications and salawāt may be added freely.",
  tip: "The qunūt in Witr is the prescribed moment for heartfelt personal du'a. Speak to Allah in your own language after the formulaic Arabic.",
  transition: "After the du'a, lower your hands and say 'Allāhu Akbar' as you bow into rukūʿ.",
  source: "Mafātīḥ al-Jinān; Sistani, Tawḍīḥ al-Masāʾil §1116–1119.",
  madhhabNote: "Shia practice: qunūt is BEFORE rukūʿ in the Witr rakah, hands raised palms-up.",
};

const salatAlWitrRakah1 = [
  shiaQiyamIntention("salatAlWitr", "Ṣalāt al-Witr", "one rakah of Witr"),
  shiaTakbir("salatAlWitr"),
  shiaFatiha("salatAlWitr", 1),
  shiaSurah("salatAlWitr", 1, R.ikhlas, "Al-Ikhlāṣ"),
  {
    id: "salatAlWitr-r1-falaq",
    title: "Third Sūrah — Al-Falaq",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "After Sūrat al-Ikhlāṣ, recite the complete Sūrat al-Falaq silently. In Ṣalāt al-Witr, the three protective sūrahs (Ikhlāṣ, Falaq, Nās) are recited in sequence before the qunūt.",
    recitation: S.surahFalaq,
    recitationNote: "Recited silently. The complete sūrah.",
    tip: "Reciting the three quls (Ikhlāṣ, Falaq, Nās) in sequence in Witr is a strongly recommended practice.",
    transition: "After al-Falaq, recite al-Nās.",
    source: S.surahFalaq.reference || "Qur'an 113:1-5",
    madhhabNote: null,
  },
  {
    id: "salatAlWitr-r1-nas",
    title: "Fourth Sūrah — Al-Nās",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "After Sūrat al-Falaq, recite the complete Sūrat al-Nās silently. This completes the three-qul recitation.",
    recitation: S.surahNas,
    recitationNote: "Recited silently. The complete sūrah.",
    tip: null,
    transition: "After al-Nās, raise your hands for the qunūt.",
    source: S.surahNas.reference || "Qur'an 114:1-6",
    madhhabNote: null,
  },
  salatAlWitrShiaQunut,
  shiaRuku("salatAlWitr", 1),
  shiaIitidal("salatAlWitr", 1),
  shiaSujud1("salatAlWitr", 1, true),
  shiaJalsa("salatAlWitr", 1),
  shiaSujud2("salatAlWitr", 1, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("salatAlWitr", 1),
  shiaSalam("salatAlWitr", 1, "The 11-rakah Ṣalāt al-Layl cycle is now complete."),
];

export const salatAlWitr = {
  id: "salatAlWitr",
  name: "Ṣalāt al-Witr",
  arabicName: "صلاة الوتر",
  subtitle: "Final rakah of the night cycle",
  rakahCount: 1,
  category: "recommended",
  tradition: "shia",
  summary: "Single-rakah closing prayer of the Ṣalāt al-Layl cycle. Recites the three quls (Ikhlāṣ, Falaq, Nās) after al-Fātiḥah, then qunūt with extended du'a before rukūʿ.",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: salatAlWitrRakah1 },
  ],
};
