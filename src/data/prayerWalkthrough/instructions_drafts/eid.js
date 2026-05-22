// src/data/prayerWalkthrough/instructions_drafts/eid.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-ʿĪd — Eid al-Fiṭr and Eid al-Aḍḥā
//
// 2 audible rakahs prayed in congregation. Distinguished by EXTRA TAKBĪRS:
//
//   Sunni:
//     • Rakah 1: 7 extra takbīrs BEFORE al-Fātiḥah (after the opening takbīr)
//     • Rakah 2: 5 extra takbīrs BEFORE al-Fātiḥah (after standing)
//     • Brief Sunni dhikr between each takbīr
//
//   Shia:
//     • Rakah 1: 5 takbīrs AFTER al-Fātiḥah + sūrah (each followed by a du'a)
//     • Rakah 2: 4 takbīrs AFTER al-Fātiḥah + sūrah (each followed by a du'a)
//     • A long supplication (the "Eid Du'a") after each takbīr
//
// Surahs (Hassan's spec, both branches):
//   • Rakah 1: Sūrat al-Aʿlā (Q87)
//   • Rakah 2: Sūrat al-Ghāshiyah (Q88)
// Both pulled from in-app Qur'an via chapterId.
//
// No istiftāh, no khuṭbah step (per project rules).
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
// SUNNI between-takbir dhikr (silent, brief)
// ═════════════════════════════════════════════════════════════════════════════

const sunniBetweenTakbirs = {
  arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna-llāh, wa l-ḥamdu li-llāh, wa lā ilāha illa-llāh, wa-llāhu akbar.",
  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",
  reference: "Reported from the practice of Ibn Masʿūd (ra); Sunan al-Bayhaqī.",
  audioId: null,
};

// ═════════════════════════════════════════════════════════════════════════════
// SHIA Eid du'a (recited after each extra takbīr) — long supplication
// ═════════════════════════════════════════════════════════════════════════════

const shiaEidDua = {
  arabic: "اللَّهُمَّ أَهْلَ الْكِبْرِيَاءِ وَالْعَظَمَةِ، وَأَهْلَ الْجُودِ وَالْجَبَرُوتِ، وَأَهْلَ الْعَفْوِ وَالرَّحْمَةِ، وَأَهْلَ التَّقْوَىٰ وَالْمَغْفِرَةِ، أَسْأَلُكَ بِحَقِّ هَٰذَا الْيَوْمِ الَّذِي جَعَلْتَهُ لِلْمُسْلِمِينَ عِيداً، وَلِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ ذُخْراً وَشَرَفاً وَكَرَامَةً وَمَزِيداً، أَنْ تُصَلِّيَ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَأَنْ تُدْخِلَنِي فِي كُلِّ خَيْرٍ أَدْخَلْتَ فِيهِ مُحَمَّداً وَآلَ مُحَمَّدٍ، وَأَنْ تُخْرِجَنِي مِنْ كُلِّ سُوءٍ أَخْرَجْتَ مِنْهُ مُحَمَّداً وَآلَ مُحَمَّدٍ، صَلَوَاتُكَ عَلَيْهِ وَعَلَيْهِمْ",
  transliteration: "Allāhumma ahla l-kibriyāʾi wa l-ʿaẓamah, wa ahla l-jūdi wa l-jabarūt, wa ahla l-ʿafwi wa r-raḥmah, wa ahla t-taqwā wa l-maghfirah. Asʾaluka bi-ḥaqqi hādhā l-yawmi lladhī jaʿaltahū li-l-muslimīna ʿīdā, wa li-Muḥammadin ṣalla-llāhu ʿalayhi wa ālihī dhukhran wa sharafan wa karāmatan wa mazīdā, an tuṣalliya ʿalā Muḥammadin wa āli Muḥammad, wa an tudkhilanī fī kulli khayrin adkhalta fīhi Muḥammadan wa āla Muḥammad, wa an tukhrijanī min kulli sūʾin akhrajta minhu Muḥammadan wa āla Muḥammad — ṣalawātuka ʿalayhi wa ʿalayhim.",
  translation: "O Allah, Lord of grandeur and majesty, Lord of generosity and dominion, Lord of pardon and mercy, Lord of piety and forgiveness — I ask You by the right of this day which You have made an Eid for the Muslims, and a treasure, honour, dignity, and increase for Muḥammad (Allah's blessings be upon him and his family): that You send blessings upon Muḥammad and the family of Muḥammad, that You include me in every good in which You have included Muḥammad and the family of Muḥammad, and that You take me out of every evil from which You have taken out Muḥammad and the family of Muḥammad. Your blessings be upon him and upon them.",
  reference: "Mafātīḥ al-Jinān; Miṣbāḥ al-Mutahajjid (recommended du'a after each Eid takbīr).",
  audioId: null,
};

// ═════════════════════════════════════════════════════════════════════════════
// SUNNI STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function sunniQiyamIntention() {
  return {
    id: "eid-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Stand upright facing the qiblah in line with the congregation. Form the silent intention: 'I intend to pray two rakahs of Ṣalāt al-ʿĪd behind this imām, for the sake of Allah.'",
    recitation: null,
    recitationNote: null,
    tip: "Eid prayer is two audible rakahs, distinguished by extra takbīrs in each rakah.",
    transition: "Raise both hands for takbīrat al-iḥrām.",
    source: "Ṣaḥīḥ al-Bukhārī 956.",
    madhhabNote: null,
  };
}

function sunniOpeningTakbir() {
  return {
    id: "eid-r1-takbir",
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_sunni",
    instruction: "Raise both hands to the level of your ears, palms facing the qiblah, and say 'Allāhu Akbar' silently as the imām says it aloud. Then fold the right hand over the left.",
    recitation: R.takbirOpening,
    recitationNote: "Said silently by the maʾmūm.",
    tip: null,
    transition: "Seven extra takbīrs follow before al-Fātiḥah.",
    source: "Ṣaḥīḥ al-Bukhārī 735.",
    madhhabNote: null,
  };
}

function sunniExtraTakbir(rakah, position, total) {
  return {
    id: `eid-r${rakah}-takbir-${position}`,
    title: `Extra Takbīr (${position} of ${total})`,
    posture: POSTURES.STANDING,
    assetName: position === 1 ? "pose_takbir_sunni" : null,
    instruction: "Raise both hands to the level of your ears, say 'Allāhu Akbar' silently with the imām, then lower the hands. Between takbīrs, recite the brief dhikr silently.",
    recitation: sunniBetweenTakbirs,
    recitationNote: "Recited silently between each takbīr.",
    tip: position === total ? "After this final extra takbīr, fold the hands over the chest and the imām begins al-Fātiḥah." : null,
    transition: position === total
      ? "Fold the hands; the imām recites al-Fātiḥah aloud."
      : `Next extra takbīr (${position + 1} of ${total}).`,
    source: "Sunan Abī Dāwūd 1149 (Ibn Masʿūd: 7 in r1, 5 in r2).",
    madhhabNote: null,
  };
}

function sunniListenFatiha(rakah) {
  return {
    id: `eid-r${rakah}-fatiha`,
    title: "Listen to Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites al-Fātiḥah aloud. Listen attentively. Say 'āmīn' aloud after the imām finishes.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly by the imām. Maʾmūm says 'āmīn' aloud.",
    tip: null,
    transition: rakah === 1 ? "The imām recites Sūrat al-Aʿlā." : "The imām recites Sūrat al-Ghāshiyah.",
    source: "Qur'an 7:204; Ṣaḥīḥ Muslim 404.",
    madhhabNote: null,
  };
}

function sunniListenSurah1() {
  return {
    id: "eid-r1-surah",
    title: "Sūrat al-Aʿlā",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites Sūrat al-Aʿlā (Q87, 19 verses) aloud. Follow along silently — the Prophet ﷺ regularly chose this sūrah for the first rakah of Eid.",
    chapterId: 87,
    recitation: null,
    recitationNote: "Recited audibly by the imām.",
    tip: null,
    transition: "Bow into rukūʿ with the imām.",
    source: "Ṣaḥīḥ Muslim 878 (the Prophet ﷺ recited al-Aʿlā and al-Ghāshiyah in Eid).",
    madhhabNote: null,
  };
}

function sunniListenSurah2() {
  return {
    id: "eid-r2-surah",
    title: "Sūrat al-Ghāshiyah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "The imām recites Sūrat al-Ghāshiyah (Q88, 26 verses) aloud. Follow along silently — a sūrah of vivid contrast between the gardens of the believers and the fate of the deniers.",
    chapterId: 88,
    recitation: null,
    recitationNote: "Recited audibly by the imām.",
    tip: null,
    transition: "Bow into rukūʿ with the imām.",
    source: "Ṣaḥīḥ Muslim 878.",
    madhhabNote: null,
  };
}

function sunniRuku(rakah) {
  return {
    id: `eid-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: "Say 'Allāhu Akbar' silently and bow with the imām. Hands on knees, back flat. Recite the tasbīḥ of rukūʿ silently.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions silently.",
    tip: null,
    transition: "Rise when the imām rises.",
    source: "Ṣaḥīḥ al-Bukhārī 794.",
    madhhabNote: null,
  };
}

function sunniIitidal(rakah) {
  return {
    id: `eid-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to a fully upright standing position. The imām says 'samiʿa-llāhu liman ḥamidah' aloud; respond silently with 'rabbanā laka l-ḥamd'. Settle briefly.",
    recitation: R.samiAllah,
    recitationNote: "Imām aloud; maʾmūm silent response.",
    tip: null,
    transition: "Descend into sujūd.",
    source: "Ṣaḥīḥ al-Bukhārī 795.",
    madhhabNote: null,
  };
}

function sunniSujud1(rakah) {
  return {
    id: `eid-r${rakah}-sujud-1`,
    title: "First Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Prostrate with seven points: forehead and nose, both palms, both knees, toes of both feet. Recite the tasbīḥ silently three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions silently.",
    tip: null,
    transition: "Rise to the seated position.",
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

function sunniJalsa(rakah) {
  return {
    id: `eid-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Sit briefly on the left foot with the right foot upright. Place your hands palms-down on your thighs. Settle calmly.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to the second prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 824.",
    madhhabNote: null,
  };
}

function sunniSujud2(rakah, transition) {
  return {
    id: `eid-r${rakah}-sujud-2`,
    title: "Second Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Prostrate again. Recite the tasbīḥ silently three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions silently.",
    tip: null,
    transition,
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

function sunniQiyamR2() {
  return {
    id: "eid-r2-qiyam",
    title: "Standing for Rakah 2",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to standing, saying 'Allāhu Akbar' silently. Fold the right hand over the left.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "Five extra takbīrs follow before al-Fātiḥah.",
    source: "Sunan Abī Dāwūd 1149.",
    madhhabNote: null,
  };
}

function sunniTashahhud() {
  return {
    id: "eid-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Sit in the tawarruk posture. Recite the tashahhud silently, raise the right index finger at 'ashhadu an lā ilāha illa-llāh', then send ṣalawāt on the Prophet ﷺ.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited silently. Includes the testimony of faith and ṣalawāt.",
    tip: null,
    transition: "Give the salām to end the prayer.",
    source: "Ṣaḥīḥ al-Bukhārī 831.",
    madhhabNote: null,
  };
}

function sunniSalam() {
  return {
    id: "eid-r2-salam",
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_sunni",
    instruction: "Turn the head to the right and say 'As-salāmu ʿalaykum wa raḥmatu-llāh'. Then turn left and repeat. The Eid prayer is complete.",
    recitation: R.salam,
    recitationNote: "Audibly to the right, then to the left.",
    tip: "Listen to the khuṭbah that follows the Eid prayer.",
    transition: "The Eid prayer is complete. The imām will deliver the Eid khuṭbah next.",
    source: "Ṣaḥīḥ Muslim 582.",
    madhhabNote: null,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SHIA STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function shiaQiyamIntention() {
  return {
    id: "eid-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Stand upright facing the qiblah in line with the congregation. Arms rest naturally at the sides. Form the intention silently: 'I am praying two rakahs of Ṣalāt al-ʿĪd, qurbatan ilā-llāh — seeking nearness to Allah.'",
    recitation: null,
    recitationNote: null,
    tip: "Shia Eid prayer requires specific conditions for congregational performance; during the occultation it is often prayed individually. Follow the ruling of your marjaʿ.",
    transition: "Raise both hands for takbīrat al-iḥrām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1517–1530.",
    madhhabNote: "Hands rest at the sides throughout qiyām.",
  };
}

function shiaOpeningTakbir() {
  return {
    id: "eid-r1-takbir",
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: "Raise both hands to the level of your ears, palms facing the qiblah. Say 'Allāhu Akbar' silently. Then lower your hands back to your sides.",
    recitation: R.takbirOpening,
    recitationNote: "Said silently.",
    tip: null,
    transition: "Al-Fātiḥah is recited next.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §989–991.",
    madhhabNote: null,
  };
}

function shiaFatiha(rakah) {
  return {
    id: `eid-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite al-Fātiḥah silently. Begin with the basmalah (which is the first verse of the sūrah in the Shia tradition).",
    recitation: R.fatiha,
    recitationNote: "Recited silently. Obligatory.",
    tip: null,
    transition: rakah === 1 ? "Recite Sūrat al-Aʿlā next." : "Recite Sūrat al-Ghāshiyah next.",
    source: "Qur'an 1; Sistani, Tawḍīḥ al-Masāʾil §993.",
    madhhabNote: null,
  };
}

function shiaSurah1() {
  return {
    id: "eid-r1-surah",
    title: "Sūrat al-Aʿlā",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite Sūrat al-Aʿlā (Q87, 19 verses) silently — the recommended sūrah for the first rakah of Eid.",
    chapterId: 87,
    recitation: null,
    recitationNote: "Recited silently. The complete sūrah.",
    tip: null,
    transition: "After the sūrah, raise the hands for the first of the five extra takbīrs.",
    source: "al-Kāfī vol. 3; Wasāʾil al-Shīʿa.",
    madhhabNote: null,
  };
}

function shiaSurah2() {
  return {
    id: "eid-r2-surah",
    title: "Sūrat al-Ghāshiyah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite Sūrat al-Ghāshiyah (Q88, 26 verses) silently — the recommended sūrah for the second rakah of Eid.",
    chapterId: 88,
    recitation: null,
    recitationNote: "Recited silently. The complete sūrah.",
    tip: null,
    transition: "After the sūrah, raise the hands for the first of the four extra takbīrs.",
    source: "al-Kāfī vol. 3; Wasāʾil al-Shīʿa.",
    madhhabNote: null,
  };
}

function shiaExtraTakbirWithDua(rakah, position, total) {
  return {
    id: `eid-r${rakah}-takbir-${position}`,
    title: `Takbīr & Du'a (${position} of ${total})`,
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "Raise both hands to the level of your face, palms-up, and say 'Allāhu Akbar'. Then recite the Eid du'a with hands still raised. After completing the du'a, lower your hands briefly before the next takbīr.",
    recitation: shiaEidDua,
    recitationNote: "Recited with hands raised palms-up, after each of the extra takbīrs.",
    tip: position === 1
      ? "The Shia Eid du'a after each takbīr is a hallmark of the prayer. It is the same supplication after every takbīr."
      : null,
    transition: position === total
      ? "After the final du'a, say 'Allāhu Akbar' once more and bow into rukūʿ."
      : `Next takbīr & du'a (${position + 1} of ${total}).`,
    source: "Mafātīḥ al-Jinān; Miṣbāḥ al-Mutahajjid.",
    madhhabNote: "Shia practice: takbīrs and du'as come AFTER al-Fātiḥah + sūrah, BEFORE rukūʿ.",
  };
}

function shiaRuku(rakah) {
  return {
    id: `eid-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow forward. Place your hands on your knees with fingers spread. Recite the tasbīḥ of rukūʿ.",
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
    id: `eid-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise from the bow to fully upright. Say 'samiʿa-llāhu liman ḥamidah'. Settle briefly before descending into prostration.",
    recitation: R.samiAllah,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to sujūd.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function shiaSujud1(rakah) {
  return {
    id: `eid-r${rakah}-sujud-1`,
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Prostrate with the forehead on the turbah and the other six points (palms, knees, big toes) on the ground. Recite the tasbīḥ silently.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the seated position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067.",
    madhhabNote: null,
  };
}

function shiaJalsa(rakah) {
  return {
    id: `eid-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Sit in the mutawarrik posture. Hands palms-down on the thighs. Settle calmly.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  };
}

function shiaSujud2(rakah, transition) {
  return {
    id: `eid-r${rakah}-sujud-2`,
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Prostrate again on the turbah. Recite the tasbīḥ silently three more times.",
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
    id: "eid-r2-qiyam",
    title: "Standing for Rakah 2",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to standing, saying 'Allāhu Akbar'. Arms remain at the sides.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "Recite al-Fātiḥah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

function shiaFinalTashahhud() {
  return {
    id: "eid-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_shia",
    instruction: "Sit in the mutawarrik posture. Recite the Shia tashahhud silently — the testimony of faith and the ṣalawāt on Muḥammad and his family.",
    recitation: R.tashahhudShia,
    recitationNote: "Recited silently.",
    tip: null,
    transition: "Give the salām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1126.",
    madhhabNote: null,
  };
}

function shiaSalam() {
  return [
  {
    id: "eid-r2-closing-sequence",
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
    id: "eid-r2-salam",
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

// SUNNI rakah 1: niyyah → takbir → 7 extras → fatiha → surah → ruku → ... → sujud2
const rakah1Sunni = [
  sunniQiyamIntention(),
  sunniOpeningTakbir(),
  ...Array.from({ length: 7 }, (_, i) => sunniExtraTakbir(1, i + 1, 7)),
  sunniListenFatiha(1),
  sunniListenSurah1(),
  sunniRuku(1),
  sunniIitidal(1),
  sunniSujud1(1),
  sunniJalsa(1),
  sunniSujud2(1, "Rise to standing for the second rakah."),
];

// SUNNI rakah 2: stand → 5 extras → fatiha → surah → ruku → ... → tashahhud → salam
const rakah2Sunni = [
  sunniQiyamR2(),
  ...Array.from({ length: 5 }, (_, i) => sunniExtraTakbir(2, i + 1, 5)),
  sunniListenFatiha(2),
  sunniListenSurah2(),
  sunniRuku(2),
  sunniIitidal(2),
  sunniSujud1(2),
  sunniJalsa(2),
  sunniSujud2(2, "Rise to the seated position for the final tashahhud."),
  sunniTashahhud(),
  sunniSalam(),
];

// SHIA rakah 1: niyyah → takbir → fatiha → surah → 5 takbirs+du'a → ruku → ... → sujud2
const rakah1Shia = [
  shiaQiyamIntention(),
  shiaOpeningTakbir(),
  shiaFatiha(1),
  shiaSurah1(),
  ...Array.from({ length: 5 }, (_, i) => shiaExtraTakbirWithDua(1, i + 1, 5)),
  shiaRuku(1),
  shiaIitidal(1),
  shiaSujud1(1),
  shiaJalsa(1),
  shiaSujud2(1, "Rise to standing for the second rakah."),
];

// SHIA rakah 2: stand → fatiha → surah → 4 takbirs+du'a → ruku → ... → tashahhud → salam
const rakah2Shia = [
  shiaQiyamR2(),
  shiaFatiha(2),
  shiaSurah2(),
  ...Array.from({ length: 4 }, (_, i) => shiaExtraTakbirWithDua(2, i + 1, 4)),
  shiaRuku(2),
  shiaIitidal(2),
  shiaSujud1(2),
  shiaJalsa(2),
  shiaSujud2(2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud(),
  ...shiaSalam(),
];

export const eidDraft = {
  id: "eid",
  name: "Ṣalāt al-ʿĪd",
  arabicName: "صلاة العيد",
  subtitle: "Eid prayer",
  rakahCount: 2,
  category: "occasional",
  tradition: "both",
  summary: "Two audible rakahs prayed in congregation on Eid al-Fiṭr and Eid al-Aḍḥā. Distinguished by extra takbīrs in each rakah. Sunni: 7 takbīrs before Fātiḥah in r1, 5 in r2. Shia: 5 takbīrs after Fātiḥah+sūrah in r1, 4 in r2, each followed by the Eid du'a.",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: rakah1Sunni, stepsShia: rakah1Shia },
    { number: 2, stepsSunni: rakah2Sunni, stepsShia: rakah2Shia },
  ],
};
