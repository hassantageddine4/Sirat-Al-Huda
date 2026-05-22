// src/data/prayerWalkthrough/instructions_drafts/jumuah.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Jumuʿah — Friday congregational prayer (replaces Dhuhr on Friday)
//
// Structure:
//   • Both: 2 rakahs, audible recitation by the imām
//   • Sunni: no qunūt/du'a steps
//   • Shia: TWO du'as (one in rakah 1 BEFORE rukūʿ, one in rakah 2 AFTER rukūʿ)
//
// Surahs (per Hassan):
//   • Rakah 1: Sūrat al-Jumuʿah (Q62) — pulled from in-app Qur'an via chapterId
//   • Rakah 2: Sūrat al-Munāfiqūn (Q63) — same
//
// ⚠️ DRAFT — Scholar review required before shipping.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";

const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// JUMUʿAH DU'A (used only in Shia rakahs — called "Du'a" per project convention)
// ═════════════════════════════════════════════════════════════════════════════

const jumuahDua = {
  arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
  transliteration: "Allāhumma hdinī fīman hadayt, wa ʿāfinī fīman ʿāfayt, wa tawallanī fīman tawallayt, wa bārik lī fīmā aʿṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ʿalayk, innahū lā yadhillu man wālayt, wa lā yaʿizzu man ʿādayt, tabārakta rabbanā wa taʿālayt.",
  translation: "O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me as a friend among those You have taken as friends, bless me in what You have given, protect me from the evil of what You have decreed — for You decree and none decrees against You; none whom You befriend is humbled, and none whom You oppose is honoured. Blessed and exalted are You, our Lord.",
  reference: "al-Kāfī vol. 3 — Book of Prayer; tradition of Imam al-Bāqir (ʿa)",
  audioId: null,
};

// ═════════════════════════════════════════════════════════════════════════════
// SUNNI STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function sunniQiyamIntention() {
  return {
    id: "jumuah-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Stand upright facing the qiblah in line with the congregation, shoulder-to-shoulder and foot-to-foot. Lower your gaze. Form the intention silently: 'I intend to pray two rakahs of Ṣalāt al-Jumuʿah behind this imām, for the sake of Allah.'",
    recitation: null,
    recitationNote: null,
    tip: "Jumuʿah replaces Dhuhr on Friday. Two rakahs behind the imām, with audible recitation.",
    transition: "When the iqāmah is complete, raise both hands for takbīrat al-iḥrām.",
    source: "Ṣaḥīḥ al-Bukhārī 877; Qur'an 62:9.",
    madhhabNote: null,
  };
}

function sunniTakbir() {
  return {
    id: "jumuah-r1-takbir",
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_sunni",
    instruction: "Raise both hands to the level of your ears, palms facing the qiblah. Say 'Allāhu Akbar' silently to yourself as the imām says it aloud. Then fold the right hand over the left on or just above the navel.",
    recitation: R.takbirOpening,
    recitationNote: "The imām says it aloud; you say it silently.",
    tip: null,
    transition: "The imām begins reciting al-Fātiḥah aloud.",
    source: "Ṣaḥīḥ al-Bukhārī 735.",
    madhhabNote: null,
  };
}

function sunniListenFatiha() {
  return {
    id: "jumuah-r1-fatiha",
    title: "Listen to Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites al-Fātiḥah aloud. Listen attentively. According to the dominant view, the maʾmūm does not recite anything while the imām recites aloud — the imām's recitation suffices.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly by the imām. Say 'āmīn' aloud after the imām finishes.",
    tip: "Some scholars (notably Shāfiʿī) hold that the maʾmūm should still recite al-Fātiḥah silently during the imām's audible recitation. Follow your local school.",
    transition: "After 'āmīn', the imām recites Sūrat al-Jumuʿah.",
    source: "Qur'an 7:204; Ṣaḥīḥ Muslim 404.",
    madhhabNote: null,
  };
}

function sunniListenSurah1() {
  return {
    id: "jumuah-r1-surah",
    title: "Sūrat al-Jumuʿah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites Sūrat al-Jumuʿah (Q62, 11 verses) aloud. Follow along silently and reflect on its meaning — a sūrah named for this very day.",
    chapterId: 62,
    recitation: null,
    recitationNote: "Recited audibly by the imām. The maʾmūm listens silently.",
    tip: "The Prophet ﷺ regularly chose al-Jumuʿah in the first rakah and al-Munāfiqūn in the second.",
    transition: "Say 'Allāhu Akbar' silently and bow into rukūʿ with the imām.",
    source: "Ṣaḥīḥ Muslim 877; Qur'an 62.",
    madhhabNote: null,
  };
}

function sunniRuku(rakah) {
  return {
    id: `jumuah-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: "Say 'Allāhu Akbar' silently and bow forward with the imām. Place your hands on your knees with fingers spread. Keep the back flat. Once settled, recite the tasbīḥ of rukūʿ silently three times.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ silently.",
    tip: "Calmness (ṭumaʾnīna) in rukūʿ is obligatory.",
    transition: "Rise when the imām rises, saying 'samiʿa-llāhu liman ḥamidah'.",
    source: "Ṣaḥīḥ al-Bukhārī 794.",
    madhhabNote: null,
  };
}

function sunniIitidal(rakah) {
  return {
    id: `jumuah-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to a fully upright standing position. The imām says 'samiʿa-llāhu liman ḥamidah' aloud. You respond silently with 'rabbanā laka l-ḥamd'. Settle briefly before going down to prostration.",
    recitation: R.samiAllah,
    recitationNote: "Imām: 'Samiʿa-llāhu liman ḥamidah'. Maʾmūm: 'Rabbanā laka l-ḥamd'.",
    tip: null,
    transition: "Say 'Allāhu Akbar' silently and descend into sujūd.",
    source: "Ṣaḥīḥ al-Bukhārī 795.",
    madhhabNote: null,
  };
}

function sunniSujud1(rakah) {
  return {
    id: `jumuah-r${rakah}-sujud-1`,
    title: "First Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Prostrate with seven points touching the ground: forehead and nose, both palms, both knees, and the toes of both feet. Recite the tasbīḥ of sujūd silently three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ.",
    tip: "Sujūd is the closest a servant comes to their Lord — make personal duʿāʾ here.",
    transition: "Rise to the seated position between the two prostrations.",
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

function sunniJalsa(rakah) {
  return {
    id: `jumuah-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Rise from the first sujūd and sit briefly. Sit on the left foot with the right foot upright (iftirāsh). Place your hands palms-down on your thighs. Settle calmly.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Say 'Allāhu Akbar' silently and descend to the second prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 824.",
    madhhabNote: null,
  };
}

function sunniSujud2(rakah, transition) {
  return {
    id: `jumuah-r${rakah}-sujud-2`,
    title: "Second Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Prostrate again with all seven points touching the ground. Recite the tasbīḥ silently three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ.",
    tip: null,
    transition,
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

function sunniQiyamR2() {
  return {
    id: "jumuah-r2-qiyam",
    title: "Standing for Rakah 2",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to standing for the second rakah, saying 'Allāhu Akbar' silently. Fold the right hand over the left.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "The imām recites al-Fātiḥah aloud — listen attentively.",
    source: "Ṣaḥīḥ al-Bukhārī 803.",
    madhhabNote: null,
  };
}

function sunniListenSurah2() {
  return {
    id: "jumuah-r2-surah",
    title: "Sūrat al-Munāfiqūn",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites Sūrat al-Munāfiqūn (Q63, 11 verses) aloud. Follow along silently. The sūrah warns of hypocrisy and calls for sincerity — fitting for a community gathered for worship.",
    chapterId: 63,
    recitation: null,
    recitationNote: "Recited audibly by the imām. The maʾmūm listens silently.",
    tip: null,
    transition: "Bow into rukūʿ with the imām.",
    source: "Ṣaḥīḥ Muslim 877; Qur'an 63.",
    madhhabNote: null,
  };
}

function sunniTashahhud() {
  return {
    id: "jumuah-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "After the second sujūd of rakah 2, sit in the tawarruk posture (left foot passed under, sitting on the ground). Place your hands palms-down on your thighs. Recite the tashahhud silently. When you reach 'ashhadu an lā ilāha illa-llāh', raise the right index finger and lower it. Then send ṣalawāt on the Prophet ﷺ.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited silently. Includes the testimony of faith and ṣalawāt on the Prophet ﷺ.",
    tip: "The pointing of the index finger is from the sunnah; some schools keep it raised, others raise-then-lower.",
    transition: "After the ṣalawāt, give the salām to end the prayer.",
    source: "Ṣaḥīḥ al-Bukhārī 831; Ṣaḥīḥ Muslim 402.",
    madhhabNote: null,
  };
}

function sunniSalam() {
  return {
    id: "jumuah-r2-salam",
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_sunni",
    instruction: "Turn your head to the right and say 'As-salāmu ʿalaykum wa raḥmatu-llāh' clearly. Then turn to the left and repeat. The Jumuʿah prayer is complete.",
    recitation: R.salam,
    recitationNote: "Said audibly to the right, then to the left.",
    tip: "Remain seated briefly after the salām for adhkār before leaving the masjid.",
    transition: "The Jumuʿah prayer is complete. Recite adhkār and make duʿāʾ — the hour before Maghrib is a time of accepted supplication.",
    source: "Ṣaḥīḥ Muslim 582.",
    madhhabNote: null,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SHIA STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function shiaQiyamIntention() {
  return {
    id: "jumuah-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Stand upright facing the qiblah in line with the congregation. Arms rest naturally at the sides — they are not folded in Shia practice. Form the intention silently: 'I am praying two rakahs of Ṣalāt al-Jumuʿah, qurbatan ilā-llāh — seeking nearness to Allah.'",
    recitation: null,
    recitationNote: null,
    tip: "Shia Jumuʿah requires specific conditions (presence of a just imām, minimum five worshippers, etc.); during the occultation many Shia pray Dhuhr instead. Follow the ruling of your marjaʿ.",
    transition: "When the iqāmah is complete, raise both hands for takbīrat al-iḥrām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1437–1450.",
    madhhabNote: "Hands rest at the sides throughout qiyām.",
  };
}

function shiaTakbir() {
  return {
    id: "jumuah-r1-takbir",
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: "Raise both hands to the level of your ears, palms facing the qiblah. Say 'Allāhu Akbar' silently as the imām says it aloud. Then lower your hands back to your sides.",
    recitation: R.takbirOpening,
    recitationNote: "Said silently by the maʾmūm.",
    tip: null,
    transition: "The imām recites al-Fātiḥah aloud — listen attentively.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §989–991.",
    madhhabNote: null,
  };
}

function shiaListenFatiha() {
  return {
    id: "jumuah-r1-fatiha",
    title: "Listen to Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "The imām recites al-Fātiḥah aloud. Listen attentively. In the Shia tradition, the maʾmūm does not recite al-Fātiḥah or the sūrah when the imām is reciting audibly; the imām's recitation suffices.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly by the imām.",
    tip: null,
    transition: "After al-Fātiḥah, the imām recites Sūrat al-Jumuʿah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1469.",
    madhhabNote: null,
  };
}

function shiaListenSurah1() {
  return {
    id: "jumuah-r1-surah",
    title: "Sūrat al-Jumuʿah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "The imām recites Sūrat al-Jumuʿah (Q62, 11 verses) aloud. Follow along silently and reflect — this is the sūrah named for this very day, with its famous call: 'When the call is proclaimed for the prayer on Friday, hasten to the remembrance of Allah.'",
    chapterId: 62,
    recitation: null,
    recitationNote: "Recited audibly by the imām.",
    tip: "Sūrat al-Jumuʿah and Sūrat al-Munāfiqūn are the recommended sūrahs for the Friday prayer in both traditions.",
    transition: "Before going into rukūʿ, raise the hands for the first du'a.",
    source: "Qur'an 62; al-Kāfī vol. 3.",
    madhhabNote: null,
  };
}

function shiaDuaBeforeRuku() {
  return {
    id: "jumuah-r1-dua",
    title: "Du'a Before Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "Before bowing into rukūʿ, raise both hands palms-up to the level of your face and recite the du'a. The imām may extend with further supplication. Personal duʿāʾ in your own words is also valid.",
    recitation: jumuahDua,
    recitationNote: "Said with hands raised palms-up. Strongly recommended in Shia Jumuʿah.",
    tip: "The two Jumuʿah du'as are a distinguishing feature of Shia practice. The first comes BEFORE rukūʿ in rakah 1; the second comes AFTER rukūʿ in rakah 2.",
    transition: "After the du'a, lower your hands and say 'Allāhu Akbar' as you bow into rukūʿ.",
    source: "al-Kāfī vol. 3; Sistani, Tawḍīḥ al-Masāʾil §1471.",
    madhhabNote: "Shia practice: du'a BEFORE rukūʿ in rakah 1; hands raised palms-up.",
  };
}

function shiaRuku(rakah) {
  return {
    id: `jumuah-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' silently and bow forward with the imām. Place your hands on your knees with fingers spread. The back is flat. Recite the tasbīḥ of rukūʿ silently.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the standing position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  };
}

function shiaIitidal(rakah) {
  return {
    id: `jumuah-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise from the bow to a fully upright standing position. It is recommended to say 'Samiʿa-llāhu liman ḥamidah' as you rise. Settle briefly before descending into prostration.",
    recitation: R.samiAllah,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and descend to sujūd.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function shiaSujud1(rakah) {
  return {
    id: `jumuah-r${rakah}-sujud-1`,
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate. The forehead rests on the turbah; the other six points of contact (palms, knees, big toes) rest on the ground. Recite the tasbīḥ of sujūd silently.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the seated position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067, §1075–1080.",
    madhhabNote: null,
  };
}

function shiaJalsa(rakah) {
  return {
    id: `jumuah-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Sit in the mutawarrik posture — on the left thigh with both feet passed to the right. Place your hands palms-down on your thighs. Settle calmly.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  };
}

function shiaSujud2(rakah, transition) {
  return {
    id: `jumuah-r${rakah}-sujud-2`,
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah. Recite the tasbīḥ silently three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ.",
    tip: null,
    transition,
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  };
}

function shiaQiyamR2() {
  return {
    id: "jumuah-r2-qiyam",
    title: "Standing for Rakah 2",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to standing for the second rakah, saying 'Allāhu Akbar' silently. Arms remain at the sides.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "The imām recites al-Fātiḥah aloud.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function shiaListenSurah2() {
  return {
    id: "jumuah-r2-surah",
    title: "Sūrat al-Munāfiqūn",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "The imām recites Sūrat al-Munāfiqūn (Q63, 11 verses) aloud. Follow along silently. The sūrah is a warning against hypocrisy and a call to sincerity in faith.",
    chapterId: 63,
    recitation: null,
    recitationNote: "Recited audibly by the imām.",
    tip: null,
    transition: "Bow into rukūʿ with the imām.",
    source: "Qur'an 63.",
    madhhabNote: null,
  };
}

function shiaDuaAfterRuku() {
  return {
    id: "jumuah-r2-dua",
    title: "Du'a After Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "After rising from rukūʿ in the second rakah, raise both hands palms-up to the level of your face and recite the du'a. This is the second of the two Jumuʿah du'as that distinguish the Shia Friday prayer.",
    recitation: jumuahDua,
    recitationNote: "Said with hands raised palms-up.",
    tip: "The first du'a came BEFORE rukūʿ in rakah 1; this one comes AFTER rukūʿ in rakah 2 — a unique feature of Shia Jumuʿah.",
    transition: "After the du'a, lower your hands and say 'Allāhu Akbar' as you descend into sujūd.",
    source: "al-Kāfī vol. 3; Sistani, Tawḍīḥ al-Masāʾil §1471.",
    madhhabNote: "Shia practice: du'a AFTER rukūʿ in rakah 2; hands raised palms-up.",
  };
}

function shiaFinalTashahhud() {
  return {
    id: "jumuah-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_shia",
    instruction: "Sit in the mutawarrik posture. Place your hands palms-down on your thighs. Recite the Shia form of the tashahhud — the testimony of faith and the ṣalawāt upon Muḥammad and his family.",
    recitation: R.tashahhudShia,
    recitationNote: "Recited silently.",
    tip: "Sending blessings on the Prophet and his family is part of the tashahhud itself in Shia practice.",
    transition: "After the tashahhud, give the salām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1126.",
    madhhabNote: null,
  };
}

function shiaSalam() {
  return [
  {
    id: "jumuah-r2-closing-sequence",
    title: "Closing Sequence",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_shia",
    instruction: "Still seated facing the qiblah, recite the salawāt upon the Prophet ﷺ and his family. Then say the salām to the Prophet ﷺ, followed by the salām to us and the righteous servants of Allah. After this, recite three takbīrs — raising the hands to the ears each time. All of these are mustaḥabb (recommended) and prepare you for the obligatory final salām.",
    recitation: R.salamShiaPreparations,
    recitationNote: "These salāms and three takbīrs are mustaḥabb. They precede the obligatory final salām.",
    tip: "Raise both hands to the level of the ears with each Allāhu Akbar — palms facing forward — just as in the opening takbīr of the prayer.",
    transition: "Prepare for the final salām, which ends the prayer.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1126–1133.",
    madhhabNote: null,
  },
  {
    id: "jumuah-r2-salam",
    title: "Salām to the Angels",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_shia",
    instruction: "Turn your head gently to the right, then to the left, reciting the final salām. This is the obligatory salām that exits the prayer — you are greeting the angels who record your deeds on each shoulder.",
    recitation: R.salamShiaFinal,
    recitationNote: "This final salām is obligatory and completes the prayer.",
    tip: "After the salām, recite Tasbīḥ al-Zahrāʾ (ʿa): 34 takbīrs, 33 alḥamdulillāhs, 33 subḥāna-llāhs. Highly recommended after every obligatory prayer.",
    transition: "The prayer is now complete. Take a moment of stillness before standing.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1133–1136. Tasbīḥ al-Zahrāʾ: al-Kāfī vol. 3.",
    madhhabNote: null,
  },
  ];
}

// ═════════════════════════════════════════════════════════════════════════════
// ASSEMBLY
// ═════════════════════════════════════════════════════════════════════════════

const rakah1Sunni = [
  sunniQiyamIntention(),
  sunniTakbir(),
  sunniListenFatiha(),
  sunniListenSurah1(),
  sunniRuku(1),
  sunniIitidal(1),
  sunniSujud1(1),
  sunniJalsa(1),
  sunniSujud2(1, "Rise — saying 'Allāhu Akbar' silently — to standing for the second rakah."),
];

const rakah2Sunni = [
  sunniQiyamR2(),
  sunniListenFatiha(),
  sunniListenSurah2(),
  sunniRuku(2),
  sunniIitidal(2),
  sunniSujud1(2),
  sunniJalsa(2),
  sunniSujud2(2, "Rise to the seated position for the final tashahhud."),
  sunniTashahhud(),
  sunniSalam(),
];

const rakah1Shia = [
  shiaQiyamIntention(),
  shiaTakbir(),
  shiaListenFatiha(),
  shiaListenSurah1(),
  shiaDuaBeforeRuku(),
  shiaRuku(1),
  shiaIitidal(1),
  shiaSujud1(1),
  shiaJalsa(1),
  shiaSujud2(1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const rakah2Shia = [
  shiaQiyamR2(),
  shiaListenFatiha(),
  shiaListenSurah2(),
  shiaRuku(2),
  shiaIitidal(2),
  shiaDuaAfterRuku(),
  shiaSujud1(2),
  shiaJalsa(2),
  shiaSujud2(2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud(),
  ...shiaSalam(),
];

export const jumuahDraft = {
  id: "jumuah",
  name: "Ṣalāt al-Jumuʿah",
  arabicName: "صلاة الجمعة",
  subtitle: "Friday congregational prayer",
  rakahCount: 2,
  category: "obligatory",
  tradition: "both",
  summary: "Two audible rakahs prayed in congregation on Friday, replacing Dhuhr. Sunni: standard two rakahs with audible recitation; the maʾmūm listens. Shia: same structure plus two distinguishing du'as — one BEFORE rukūʿ in rakah 1, one AFTER rukūʿ in rakah 2.",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: rakah1Sunni, stepsShia: rakah1Shia },
    { number: 2, stepsSunni: rakah2Sunni, stepsShia: rakah2Shia },
  ],
};
