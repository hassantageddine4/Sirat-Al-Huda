// src/data/prayerWalkthrough/instructions_drafts/voluntary_batch4.js
// ─────────────────────────────────────────────────────────────────────────────
// BATCH 4 — Witr, Tahajjud, Duha, Taraweeh
//
// ⚠️ DRAFT — REQUIRES SCHOLAR REVIEW BEFORE FINAL RELEASE
//
// Branch visibility:
//   • Witr     → Sunni only (Shia equivalent is part of Ṣalāt al-Layl)
//   • Tahajjud → Sunni only (Shia equivalent is Ṣalāt al-Layl)
//   • Duha     → both branches
//   • Taraweeh → Sunni only
//
// Surahs per rakah (Hassan's spec):
//   Witr Sunni  — r1: al-Aʿlā, r2: al-Kāfirūn, r3: al-Ikhlāṣ
//   Tahajjud    — r1: al-Kāfirūn, r2: al-Ikhlāṣ
//   Duha (both) — r1: al-Shams, r2: al-Ḍuḥā
//   Taraweeh    — left on Al-Ikhlāṣ default (imam-recited Qur'an portions in
//                 practice; no fixed sūrah pairing)
//
// No Du'a al-Istiftāḥ anywhere. Shia rakah-2 standing supplication is titled
// "Du'a" (not "Qunūt") per Hassan's preference.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";
import * as S from "../commonSurahs";

const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// SUNNI STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function sunniQiyamIntention(prayer, prayerName, rakahPhrase) {
  return {
    id: `${prayer}-r1-qiyam`,
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Distribute your weight evenly between both feet. Lower your gaze toward the spot on the ground where your forehead will rest during prostration. Form the intention silently in your heart: that you are about to pray ${rakahPhrase} of ${prayerName} for the sake of Allah.`,
    recitation: null,
    recitationNote: null,
    tip: "The intention is an act of the heart's resolve. There is no requirement to speak it aloud.",
    transition: "Once your intention is firm, raise both hands to begin the prayer.",
    source: "Body posture: Ṣaḥīḥ al-Bukhārī 757. Intention: Ṣaḥīḥ al-Bukhārī 1.",
    madhhabNote: null,
  };
}

function sunniTakbir(prayer, audible) {
  return {
    id: `${prayer}-r1-takbir`,
    title: "Opening Takbīr — Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_sunni",
    instruction: `Raise both hands to the level of your ears (or your shoulders — both are valid sunnah positions) with the palms facing the qiblah. As your hands reach their highest point, say the takbīr ${audible ? "aloud" : "softly to yourself"}. This is the takbīr of consecration — the formal entry into prayer.`,
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Required — this is a pillar of the prayer.",
    tip: "The voice should be clear enough that you can hear it. Do not whisper.",
    transition: "Lower your hands and fold them on your chest or just above the navel.",
    source: "Ṣaḥīḥ al-Bukhārī 735; Sunan Abī Dāwūd 730.",
    madhhabNote: null,
  };
}

function sunniFold(prayer) {
  return {
    id: `${prayer}-r1-fold`,
    title: "Folding the Hands",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Place your right hand over the back of your left hand, with the right hand resting on the left wrist or forearm. Hold the hands gently against the chest below the collarbone, or just above the navel, depending on the practice you follow. The arms rest naturally — neither stiff nor limp.",
    recitation: null,
    recitationNote: null,
    tip: "Choose one hand placement and remain consistent.",
    transition: "With hands folded, seek refuge in Allah before beginning the recitation of the Qurʾan.",
    source: "Ṣaḥīḥ Muslim 401; Sunan Abī Dāwūd 758.",
    madhhabNote: "Hanafi: hands below the navel. Shafi'i and Hanbali: on the chest. Maliki: may be left at the sides.",
  };
}

function sunniTaawwudh(prayer) {
  return {
    id: `${prayer}-r1-taawwudh`,
    title: "Seeking Refuge — Taʿawwudh",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite the taʿawwudh silently, seeking refuge in Allah from Shayṭān. This precedes every Qurʾan recitation in prayer, but is said verbally only in the first rakah.",
    recitation: R.taawwudh,
    recitationNote: "Recited silently, once per prayer, before the first Fātiḥah.",
    tip: "A reminder that the heart must turn away from distractions before approaching the words of Allah.",
    transition: "Begin Al-Fātiḥah with the basmalah.",
    source: "Qurʾan 16:98.",
    madhhabNote: null,
  };
}

function sunniFatiha(prayer, rakah, audible) {
  return {
    id: `${prayer}-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}. Begin with the basmalah, then move through the seven verses, pausing briefly at the end of each verse.${audible ? "" : " Move the lips quietly; the recitation should not be heard by others."}`,
    recitation: R.fatiha,
    recitationNote: `Recited ${audible ? "audibly" : "silently"}. Required — Al-Fātiḥah must be recited in every rakah.`,
    tip: "The Prophet ﷺ recited Al-Fātiḥah verse by verse, pausing at each one.",
    transition: "After Al-Fātiḥah, pause briefly, then recite the recommended sūrah.",
    source: "Qurʾan 1:1–7. Requirement: Ṣaḥīḥ Muslim 394.",
    madhhabNote: "Shafi'i: basmalah audible as part of Al-Fātiḥah. Hanafi/Hanbali: basmalah silent. Maliki: omitted in obligatory prayers.",
  };
}

// Generic Sunni surah step with custom surah and name
function sunniSurah(prayer, rakah, audible, surahObj, surahName) {
  return {
    id: `${prayer}-r${rakah}-surah`,
    title: `Second Sūrah — ${surahName}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `After Al-Fātiḥah, recite Sūrat ${surahName} ${audible ? "audibly" : "silently"}. This sūrah is the recommended pairing for this rakah of the prayer.`,
    recitation: surahObj,
    recitationNote: `Recited ${audible ? "audibly" : "silently"}. Sunnah (recommended pairing).`,
    tip: "If you have not yet memorised this sūrah, you may substitute another short sūrah you know well.",
    transition: "After the sūrah, say 'Allāhu Akbar' and bow into rukūʿ.",
    source: surahObj.reference || null,
    madhhabNote: null,
  };
}

function sunniRuku(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: "Say 'Allāhu Akbar' as you bow forward. Place your hands firmly on your knees with fingers spread, the back flat and parallel to the ground. The neck and head form a single line with the back. Keep your eyes on the spot of prostration. Once settled, recite the tasbīḥ of rukūʿ at least three times.",
    recitation: R.tasbihRuku,
    recitationNote: "Recited a minimum of three times. Five or seven is also recommended.",
    tip: "Do not bow only halfway. The back must be flat and level.",
    transition: "Rise from rukūʿ to the upright standing position.",
    source: "Ṣaḥīḥ al-Bukhārī 828; Sunan Abī Dāwūd 869.",
    madhhabNote: null,
  };
}

function sunniIitidal(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ — Iʿtidāl",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to a fully upright standing position, saying 'Samiʿa-llāhu liman ḥamidah' as you rise and 'Rabbanā wa laka l-ḥamd' once standing. Pause briefly before descending into prostration.",
    recitation: R.samiAllah,
    recitationNote: "Said while rising and once standing. Sunnah; the standing is obligatory.",
    tip: "Calmness in iʿtidāl is a pillar of the prayer.",
    transition: "Say 'Allāhu Akbar' and descend into prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: null,
  };
}

function sunniSujud1(prayer, rakah, withDuaTip) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate so that seven body parts touch the ground: the forehead (together with the nose), both palms, both knees, and the toes of both feet. The elbows should be lifted away from the floor and from the sides of your body. Once settled, recite the tasbīḥ of sujūd at least three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times.",
    tip: withDuaTip
      ? "Sujūd is the moment of greatest closeness to Allah. The Prophet ﷺ said: 'A servant is closest to his Lord when in prostration, so increase your supplication in it.'"
      : null,
    transition: "Rise to the sitting position between the two prostrations.",
    source: "Ṣaḥīḥ al-Bukhārī 812; Sunan Abī Dāwūd 870.",
    madhhabNote: null,
  };
}

function sunniJalsa(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations — Jalsa",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Sit briefly in the iftirāsh position (left foot folded beneath, right foot upright) with hands flat on the thighs. Recite the du'a of forgiveness twice before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recited twice. Sunnah; the sitting itself is required.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and prostrate again for the second sujūd.",
    source: "Sunan Abī Dāwūd 874.",
    madhhabNote: null,
  };
}

function sunniSujud2(prayer, rakah, transition) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate again with the same seven points of contact. Recite the tasbīḥ at least three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times.",
    tip: null,
    transition,
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: null,
  };
}

function sunniQiyamMid(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-qiyam`,
    title: `Standing for Rakah ${rakah}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to the standing position saying 'Allāhu Akbar', and once upright, fold your hands again. There is no opening supplication or taʿawwudh in this rakah — those belong only to the first.",
    recitation: null,
    recitationNote: null,
    tip: "Pause and settle into the standing posture before beginning recitation.",
    transition: "Begin Al-Fātiḥah directly.",
    source: null,
    madhhabNote: null,
  };
}

function sunniFirstTashahhud(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-first-tashahhud`,
    title: "First Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Sit in the iftirāsh position — left foot folded beneath you, right foot upright with toes facing the qiblah. Place the left hand flat on the left thigh; make a fist with the right hand and release the index finger to point forward. Recite the tashahhud through the testimony of faith. At 'lā ilāha illa-llāh', raise the right index finger and lower it afterward. Do NOT recite the ṣalawāt here — that is only in the final tashahhud.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited silently. Sunnah; the sitting itself is required.",
    tip: "Keep this sitting brief — it is a pause, not a closing.",
    transition: "Say 'Allāhu Akbar' and rise to standing for the next rakah.",
    source: "Ṣaḥīḥ al-Bukhārī 831; Sunan Abī Dāwūd 970.",
    madhhabNote: "Hanafi: brief ṣalawāt may be added here. Shafi'i/Maliki/Hanbali: just the tashahhud.",
  };
}

function sunniFinalTashahhud(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-tashahhud`,
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Sit in the tawarruk position (left leg passed under the right, left buttock on the floor, right foot upright) per Maliki and Shafi'i practice; Hanafis and Hanbalis use iftirāsh in the final sitting also. Place the left hand flat on the left thigh, make a fist with the right hand, and release the index finger. Recite the tashahhud, raising the right index finger at 'lā ilāha illa-llāh' and lowering it after the testimony.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited once, silently. Required in the final sitting.",
    tip: "The index finger is raised at the testimony of faith — a small physical sign of the soul's testimony.",
    transition: "Continue directly to the ṣalawāt.",
    source: "Ṣaḥīḥ al-Bukhārī 831; Ṣaḥīḥ Muslim 580; Ṣaḥīḥ al-Bukhārī 828.",
    madhhabNote: "Final sitting: Maliki/Shafi'i use tawarruk. Hanafi/Hanbali use iftirāsh.",
  };
}

function sunniSalawat(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-salawat`,
    title: "Blessings on the Prophet ﷺ — Ṣalawāt",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Continue from the tashahhud into the ṣalawāt, sending blessings upon the Prophet Muḥammad ﷺ and the family of Ibrāhīm and Muḥammad. This is the Ibrāhīmiyya form taught by the Prophet ﷺ when his companions asked how to send blessings upon him.",
    recitation: R.salawat,
    recitationNote: "Recited silently. Sunnah muʾakkadah — strongly recommended.",
    tip: "Recite with awareness of the one being blessed.",
    transition: "After the ṣalawāt, prepare for the closing salām.",
    source: "Ṣaḥīḥ al-Bukhārī 3370.",
    madhhabNote: null,
  };
}

function sunniSalam(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-salam`,
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_sunni",
    instruction: "Turn your head to the right shoulder until your cheek is visible to those behind you, and say the salām aloud. Then turn your head to the left shoulder and repeat. With the second salām, the prayer is complete.",
    recitation: R.salam,
    recitationNote: "Recited once to the right, then once to the left.",
    tip: "After the salām, remain seated for post-prayer dhikr.",
    transition: "The prayer is now complete.",
    source: "Sunan Abī Dāwūd 996.",
    madhhabNote: "Hanafi/Hanbali: both salāms required. Shafi'i: only the first required. Maliki: one salām suffices.",
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SHIA STEP FACTORIES
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

function shiaTakbir(prayer, audible) {
  return {
    id: `${prayer}-r1-takbir`,
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: `Raise both hands to the level of your ears with the palms facing the qiblah. As your hands reach their highest point, say the takbīr ${audible ? "aloud" : "softly to yourself"}. This is the takbīr of consecration — the formal entry into prayer.`,
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Obligatory — this is a pillar of the prayer.",
    tip: "Six additional takbīrs before the takbīrat al-iḥrām are recommended (mustaḥabb), with hands raised at each.",
    transition: "After the takbīr, lower your hands back to your sides.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §989–991. al-Kāfī vol. 3.",
    madhhabNote: null,
  };
}

function shiaFatiha(prayer, rakah, audible) {
  return {
    id: `${prayer}-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}. Begin with the basmalah (which is the first verse of the sūrah in the Shia tradition). Continue through all seven verses, pausing briefly at each verse ending.`,
    recitation: R.fatiha,
    recitationNote: `Recited ${audible ? "audibly" : "silently"}. Obligatory.`,
    tip: "The basmalah is counted as part of Al-Fātiḥah.",
    transition: "After Al-Fātiḥah, recite the recommended sūrah.",
    source: "Qurʾan 1:1–7. Sistani, Tawḍīḥ al-Masāʾil §993.",
    madhhabNote: null,
  };
}

// Generic Shia surah step with custom surah and name
function shiaSurah(prayer, rakah, audible, surahObj, surahName) {
  return {
    id: `${prayer}-r${rakah}-surah`,
    title: `Second Sūrah — ${surahName}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `After Al-Fātiḥah, recite the complete Sūrat ${surahName} ${audible ? "audibly" : "silently"}. The Shia tradition requires a full sūrah be recited — not just a portion. This sūrah is the recommended pairing for this rakah.`,
    recitation: surahObj,
    recitationNote: `Recited ${audible ? "audibly" : "silently"}. The complete sūrah is obligatory.`,
    tip: "If you have not yet memorised this sūrah, you may substitute another complete sūrah you know well.",
    transition: "After completing the sūrah, prepare to bow into rukūʿ.",
    source: surahObj.reference || null,
    madhhabNote: null,
  };
}

function shiaDua(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-dua`,
    title: "Du'a",
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "Before bowing into rukūʿ, raise both hands palms-up to the level of your face, fingers held together, and recite the du'a. The simplest valid form is Rabbanā ātinā (Qurʾan 2:201) followed by ṣalawāt on Muḥammad and his family. Longer du'as and personal supplications may be added.",
    recitation: R.qunutShia,
    recitationNote: "Strongly recommended (mustaḥabb muʾakkad) in every prayer's second rakah, before rukūʿ.",
    tip: "Du'a may be recited in any language with personal supplication, though Arabic forms are most rewarded.",
    transition: "After the du'a, lower your hands and say 'Allāhu Akbar' as you bow.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1116–1119.",
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
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory to recite at least once.",
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
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory to recite at least once.",
    tip: withTurbahTip
      ? "If no turbah is available, prostrate on something earthen or plant-based that is not eaten or worn — paper, a leaf, unprocessed wood, or natural stone. Prostration on cloth or carpet is not valid in the Shia tradition."
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

function shiaSalam(prayer, rakah) {
  return [
  {
    id: `${prayer}-r${rakah}-closing-sequence`,
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
    id: `${prayer}-r${rakah}-salam`,
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
// WITR (Sunni only)
// ═════════════════════════════════════════════════════════════════════════════

const witrSunniRakah1 = [
  sunniQiyamIntention("witr", "the Witr prayer", "three rakahs of Witr"),
  sunniTakbir("witr", true),
  sunniFold("witr"),
  sunniTaawwudh("witr"),
  sunniFatiha("witr", 1, true),
  sunniSurah("witr", 1, true, S.surahAla, "Al-Aʿlā"),
  sunniRuku("witr", 1),
  sunniIitidal("witr", 1),
  sunniSujud1("witr", 1, true),
  sunniJalsa("witr", 1),
  sunniSujud2("witr", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const witrSunniRakah2 = [
  sunniQiyamMid("witr", 2),
  sunniFatiha("witr", 2, true),
  sunniSurah("witr", 2, true, S.surahKafirun, "Al-Kāfirūn"),
  sunniRuku("witr", 2),
  sunniIitidal("witr", 2),
  sunniSujud1("witr", 2, false),
  sunniJalsa("witr", 2),
  sunniSujud2("witr", 2, "Rise to the seated position for the first tashahhud."),
  sunniFirstTashahhud("witr", 2),
];

const witrSunniRakah3 = [
  sunniQiyamMid("witr", 3),
  sunniFatiha("witr", 3, true),
  sunniSurah("witr", 3, true, R.ikhlas, "Al-Ikhlāṣ"),
  {
    id: "witr-r3-dua",
    title: "Du'a",
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "After completing the sūrah, raise both hands to the level of your ears and say 'Allāhu Akbar'. Then bring the hands back together (or hold them palms-up at chest level — both forms are reported) and recite the du'a. This is the heart of the Witr prayer — a moment of intimate supplication.",
    recitation: R.qunutWitr,
    recitationNote: "Recited once in the third rakah of Witr. Hanafi: BEFORE rukūʿ as shown. Shafi'i/Hanbali: AFTER rising from rukūʿ.",
    tip: "Personal du'a may be added in your own language after the formulaic Arabic.",
    transition: "After the du'a, say 'Allāhu Akbar' and bow into rukūʿ.",
    source: "Sunan al-Tirmidhī 464 — hadith of al-Ḥasan ibn ʿAlī ؓ.",
    madhhabNote: "Position varies by school. Hanafi: before rukūʿ. Shafi'i and Hanbali: after iʿtidāl. Maliki: not recited in Witr (only Fajr).",
  },
  sunniRuku("witr", 3),
  sunniIitidal("witr", 3),
  sunniSujud1("witr", 3, true),
  sunniJalsa("witr", 3),
  sunniSujud2("witr", 3, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("witr", 3),
  sunniSalawat("witr", 3),
  sunniSalam("witr", 3),
];

export const witrDraft = {
  id: "witr",
  name: "Witr",
  arabicName: "الوتر",
  subtitle: "Odd-numbered night prayer",
  rakahCount: 3,
  category: "recommended",
  tradition: "sunni",
  summary: "Three rakahs prayed after Isha, ending with a special du'a in the third rakah.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: witrSunniRakah1, stepsShia: [] },
    { number: 2, stepsSunni: witrSunniRakah2, stepsShia: [] },
    { number: 3, stepsSunni: witrSunniRakah3, stepsShia: [] },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// TAHAJJUD (Sunni only)
// ═════════════════════════════════════════════════════════════════════════════

const tahajjudSunniRakah1 = [
  sunniQiyamIntention("tahajjud", "the Tahajjud prayer", "two rakahs of Tahajjud"),
  sunniTakbir("tahajjud", true),
  sunniFold("tahajjud"),
  sunniTaawwudh("tahajjud"),
  sunniFatiha("tahajjud", 1, true),
  sunniSurah("tahajjud", 1, true, S.surahKafirun, "Al-Kāfirūn"),
  sunniRuku("tahajjud", 1),
  sunniIitidal("tahajjud", 1),
  sunniSujud1("tahajjud", 1, true),
  sunniJalsa("tahajjud", 1),
  sunniSujud2("tahajjud", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const tahajjudSunniRakah2 = [
  sunniQiyamMid("tahajjud", 2),
  sunniFatiha("tahajjud", 2, true),
  sunniSurah("tahajjud", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  sunniRuku("tahajjud", 2),
  sunniIitidal("tahajjud", 2),
  sunniSujud1("tahajjud", 2, false),
  sunniJalsa("tahajjud", 2),
  sunniSujud2("tahajjud", 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("tahajjud", 2),
  sunniSalawat("tahajjud", 2),
  sunniSalam("tahajjud", 2),
];

export const tahajjudDraft = {
  id: "tahajjud",
  name: "Tahajjud",
  arabicName: "التهجد",
  subtitle: "Late-night voluntary prayer",
  rakahCount: 2,
  category: "recommended",
  tradition: "sunni",
  summary: "Prayed in the last third of the night after waking from sleep. Performed in pairs of 2 rakahs; you may pray as many pairs as you wish.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: tahajjudSunniRakah1, stepsShia: [] },
    { number: 2, stepsSunni: tahajjudSunniRakah2, stepsShia: [] },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// DUHA (both branches)
// ═════════════════════════════════════════════════════════════════════════════

const duhaSunniRakah1 = [
  sunniQiyamIntention("duha", "Ṣalāt al-Ḍuḥā", "two rakahs of Ḍuḥā"),
  sunniTakbir("duha", false),
  sunniFold("duha"),
  sunniTaawwudh("duha"),
  sunniFatiha("duha", 1, false),
  sunniSurah("duha", 1, false, S.surahShams, "Al-Shams"),
  sunniRuku("duha", 1),
  sunniIitidal("duha", 1),
  sunniSujud1("duha", 1, true),
  sunniJalsa("duha", 1),
  sunniSujud2("duha", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const duhaSunniRakah2 = [
  sunniQiyamMid("duha", 2),
  sunniFatiha("duha", 2, false),
  sunniSurah("duha", 2, false, S.surahDuha, "Al-Ḍuḥā"),
  sunniRuku("duha", 2),
  sunniIitidal("duha", 2),
  sunniSujud1("duha", 2, false),
  sunniJalsa("duha", 2),
  sunniSujud2("duha", 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("duha", 2),
  sunniSalawat("duha", 2),
  sunniSalam("duha", 2),
];

const duhaShiaRakah1 = [
  shiaQiyamIntention("duha", "Ṣalāt al-Ḍuḥā", "two rakahs of Ḍuḥā"),
  shiaTakbir("duha", false),
  shiaFatiha("duha", 1, false),
  shiaSurah("duha", 1, false, S.surahShams, "Al-Shams"),
  shiaRuku("duha", 1),
  shiaIitidal("duha", 1),
  shiaSujud1("duha", 1, true),
  shiaJalsa("duha", 1),
  shiaSujud2("duha", 1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const duhaShiaRakah2 = [
  shiaQiyamMid("duha", 2),
  shiaFatiha("duha", 2, false),
  shiaSurah("duha", 2, false, S.surahDuha, "Al-Ḍuḥā"),
  shiaDua("duha", 2),
  shiaRuku("duha", 2),
  shiaIitidal("duha", 2),
  shiaSujud1("duha", 2, false),
  shiaJalsa("duha", 2),
  shiaSujud2("duha", 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("duha", 2),
  ...shiaSalam("duha", 2),
];

export const duhaDraft = {
  id: "duha",
  name: "Ḍuḥā",
  arabicName: "الضحى",
  subtitle: "Mid-morning voluntary prayer",
  rakahCount: 2,
  category: "recommended",
  tradition: "both",
  summary: "Prayed after sunrise (about 15-20 minutes after) until shortly before Dhuhr. Minimum 2 rakahs, recommended 4, with up to 8 reported.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: duhaSunniRakah1, stepsShia: duhaShiaRakah1 },
    { number: 2, stepsSunni: duhaSunniRakah2, stepsShia: duhaShiaRakah2 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// TARAWEEH (Sunni only)
// ═════════════════════════════════════════════════════════════════════════════

const taraweehIntroStep = {
  id: "taraweeh-intro",
  title: "Before You Begin",
  posture: POSTURES.STANDING,
  assetName: "pose_standing_sunni",
  instruction: "Tarāwīḥ is performed in 2-rakah pairs after the Isha prayer during Ramadan. After completing this 2-rakah unit, you may rest briefly and then begin another pair. Continue until you have completed the number of rakahs followed in your tradition. After every 4 rakahs, a longer pause (called tarwīḥa, from which the prayer takes its name) is traditional. In practice, the imam typically recites long Qur'anic passages in sequence across the nights of Ramadan rather than fixed pair-specific sūrahs.",
  recitation: null,
  recitationNote: null,
  tip: "20 rakahs is the practice of the major Sunni schools, traceable to the time of ʿUmar ؓ. 8 rakahs is also widely practised based on the report of ʿĀʾisha ؓ on the Prophet's ﷺ qiyām al-layl.",
  transition: "Begin the first rakah by raising both hands for the opening takbīr.",
  source: "Ṣaḥīḥ al-Bukhārī 2010 — establishment of 20-rakah communal Tarāwīḥ by ʿUmar ؓ.",
  madhhabNote: "Tarāwīḥ as a congregational practice is specific to the Sunni traditions.",
};

const taraweehSunniRakah1 = [
  taraweehIntroStep,
  sunniQiyamIntention("taraweeh", "Tarāwīḥ", "two rakahs of Tarāwīḥ"),
  sunniTakbir("taraweeh", true),
  sunniFold("taraweeh"),
  sunniTaawwudh("taraweeh"),
  sunniFatiha("taraweeh", 1, true),
  sunniSurah("taraweeh", 1, true, R.ikhlas, "Al-Ikhlāṣ"),
  sunniRuku("taraweeh", 1),
  sunniIitidal("taraweeh", 1),
  sunniSujud1("taraweeh", 1, true),
  sunniJalsa("taraweeh", 1),
  sunniSujud2("taraweeh", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const taraweehSunniRakah2 = [
  sunniQiyamMid("taraweeh", 2),
  sunniFatiha("taraweeh", 2, true),
  sunniSurah("taraweeh", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  sunniRuku("taraweeh", 2),
  sunniIitidal("taraweeh", 2),
  sunniSujud1("taraweeh", 2, false),
  sunniJalsa("taraweeh", 2),
  sunniSujud2("taraweeh", 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("taraweeh", 2),
  sunniSalawat("taraweeh", 2),
  sunniSalam("taraweeh", 2),
];

export const taraweehDraft = {
  id: "taraweeh",
  name: "Tarāwīḥ",
  arabicName: "التراويح",
  subtitle: "Ramadan night prayer",
  rakahCount: 2,
  category: "recommended",
  tradition: "sunni",
  summary: "Voluntary night prayers during Ramadan, performed in 2-rakah pairs after Isha. The total count varies by tradition.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: taraweehSunniRakah1, stepsShia: [] },
    { number: 2, stepsSunni: taraweehSunniRakah2, stepsShia: [] },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// TAWBAH (both branches) — Prayer of Repentance
// ═════════════════════════════════════════════════════════════════════════════

const tawbahAfterSunni = {
  id: "tawbah-after",
  title: "Du'a of Forgiveness",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_sunni",
  instruction: "After the salām, remain seated facing the qiblah. Praise Allah, send ṣalawāt on the Prophet ﷺ, then ask Allah for forgiveness sincerely. There is no fixed wording — express your repentance in your own words or use a known du'a such as Sayyidu l-istighfār.",
  recitation: null,
  recitationNote: "Personal du'a in any language is recommended.",
  tip: "Sincere repentance includes three elements: regret for what was done, immediate cessation of the sin, and firm resolve not to return to it.",
  transition: "Take time in du'a. Do not rush.",
  source: "Ṣaḥīḥ al-Bukhārī 6306 — Sayyidu l-istighfār, taught by the Prophet ﷺ.",
  madhhabNote: null,
};

const tawbahAfterShia = {
  ...tawbahAfterSunni,
  assetName: "pose_tashahhud_shia",
};

const tawbahSunniRakah1 = [
  sunniQiyamIntention("tawbah", "Ṣalāt al-Tawbah", "two rakahs of the prayer of repentance"),
  sunniTakbir("tawbah", true),
  sunniFold("tawbah"),
  sunniTaawwudh("tawbah"),
  sunniFatiha("tawbah", 1, true),
  sunniSurah("tawbah", 1, true, S.surahKafirun, "Al-Kāfirūn"),
  sunniRuku("tawbah", 1),
  sunniIitidal("tawbah", 1),
  sunniSujud1("tawbah", 1, true),
  sunniJalsa("tawbah", 1),
  sunniSujud2("tawbah", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const tawbahSunniRakah2 = [
  sunniQiyamMid("tawbah", 2),
  sunniFatiha("tawbah", 2, true),
  sunniSurah("tawbah", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  sunniRuku("tawbah", 2),
  sunniIitidal("tawbah", 2),
  sunniSujud1("tawbah", 2, false),
  sunniJalsa("tawbah", 2),
  sunniSujud2("tawbah", 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("tawbah", 2),
  sunniSalawat("tawbah", 2),
  sunniSalam("tawbah", 2),
  tawbahAfterSunni,
];

const tawbahShiaRakah1 = [
  shiaQiyamIntention("tawbah", "Ṣalāt al-Tawbah", "two rakahs of the prayer of repentance"),
  shiaTakbir("tawbah", true),
  shiaFatiha("tawbah", 1, true),
  shiaSurah("tawbah", 1, true, S.surahKafirun, "Al-Kāfirūn"),
  shiaRuku("tawbah", 1),
  shiaIitidal("tawbah", 1),
  shiaSujud1("tawbah", 1, true),
  shiaJalsa("tawbah", 1),
  shiaSujud2("tawbah", 1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const tawbahShiaRakah2 = [
  shiaQiyamMid("tawbah", 2),
  shiaFatiha("tawbah", 2, true),
  shiaSurah("tawbah", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  shiaDua("tawbah", 2),
  shiaRuku("tawbah", 2),
  shiaIitidal("tawbah", 2),
  shiaSujud1("tawbah", 2, false),
  shiaJalsa("tawbah", 2),
  shiaSujud2("tawbah", 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("tawbah", 2),
  ...shiaSalam("tawbah", 2),
  tawbahAfterShia,
];

export const tawbahDraft = {
  id: "tawbah",
  name: "Tawbah",
  arabicName: "التوبة",
  subtitle: "Prayer of repentance",
  rakahCount: 2,
  category: "recommended",
  tradition: "both",
  summary: "Two rakahs prayed when seeking forgiveness for a sin. After the prayer, make du'a sincerely asking Allah for forgiveness.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: tawbahSunniRakah1, stepsShia: tawbahShiaRakah1 },
    { number: 2, stepsSunni: tawbahSunniRakah2, stepsShia: tawbahShiaRakah2 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// ISTIKHARA (both branches) — Prayer for Guidance
// ═════════════════════════════════════════════════════════════════════════════

const istikharaAfterSunni = {
  id: "istikhara-after",
  title: "Du'a al-Istikhāra",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_sunni",
  instruction: "After the salām, while still seated, recite the du'a of istikhāra. When you reach the phrase 'hādhā l-amra' (this matter), name silently in your heart the specific matter you are seeking guidance about. After the du'a, proceed with the matter as your judgment leads you, trusting in Allah's decree.",
  recitation: R.istikharaDua,
  recitationNote: "Recite once with full presence of heart, naming the matter silently.",
  tip: "Istikhāra is not a request for a dream or a sign. It is asking Allah to make easy what is good for you in this matter, and to turn you away from it if it is not good.",
  transition: "Trust the outcome to Allah.",
  source: "Ṣaḥīḥ al-Bukhārī 1162 — hadith of Jābir ibn ʿAbdullāh ؓ.",
  madhhabNote: null,
};

const istikharaAfterShia = {
  ...istikharaAfterSunni,
  assetName: "pose_tashahhud_shia",
};

const istikharaSunniRakah1 = [
  sunniQiyamIntention("istikhara", "Ṣalāt al-Istikhāra", "two rakahs of istikhāra (seeking guidance)"),
  sunniTakbir("istikhara", true),
  sunniFold("istikhara"),
  sunniTaawwudh("istikhara"),
  sunniFatiha("istikhara", 1, true),
  sunniSurah("istikhara", 1, true, S.surahKafirun, "Al-Kāfirūn"),
  sunniRuku("istikhara", 1),
  sunniIitidal("istikhara", 1),
  sunniSujud1("istikhara", 1, true),
  sunniJalsa("istikhara", 1),
  sunniSujud2("istikhara", 1, "Say 'Allāhu Akbar' and rise for the second rakah."),
];

const istikharaSunniRakah2 = [
  sunniQiyamMid("istikhara", 2),
  sunniFatiha("istikhara", 2, true),
  sunniSurah("istikhara", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  sunniRuku("istikhara", 2),
  sunniIitidal("istikhara", 2),
  sunniSujud1("istikhara", 2, false),
  sunniJalsa("istikhara", 2),
  sunniSujud2("istikhara", 2, "Rise to the seated position for the final tashahhud."),
  sunniFinalTashahhud("istikhara", 2),
  sunniSalawat("istikhara", 2),
  sunniSalam("istikhara", 2),
  istikharaAfterSunni,
];

const istikharaShiaRakah1 = [
  shiaQiyamIntention("istikhara", "Ṣalāt al-Istikhāra", "two rakahs of istikhāra (seeking guidance)"),
  shiaTakbir("istikhara", true),
  shiaFatiha("istikhara", 1, true),
  shiaSurah("istikhara", 1, true, S.surahKafirun, "Al-Kāfirūn"),
  shiaRuku("istikhara", 1),
  shiaIitidal("istikhara", 1),
  shiaSujud1("istikhara", 1, true),
  shiaJalsa("istikhara", 1),
  shiaSujud2("istikhara", 1, "Rise — saying 'Allāhu Akbar' — to standing for the second rakah."),
];

const istikharaShiaRakah2 = [
  shiaQiyamMid("istikhara", 2),
  shiaFatiha("istikhara", 2, true),
  shiaSurah("istikhara", 2, true, R.ikhlas, "Al-Ikhlāṣ"),
  shiaDua("istikhara", 2),
  shiaRuku("istikhara", 2),
  shiaIitidal("istikhara", 2),
  shiaSujud1("istikhara", 2, false),
  shiaJalsa("istikhara", 2),
  shiaSujud2("istikhara", 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud("istikhara", 2),
  ...shiaSalam("istikhara", 2),
  istikharaAfterShia,
];

export const istikharaDraft = {
  id: "istikhara",
  name: "Istikhāra",
  arabicName: "الاستخارة",
  subtitle: "Prayer for guidance",
  rakahCount: 2,
  category: "recommended",
  tradition: "both",
  summary: "Two rakahs prayed when seeking Allah's guidance on a specific matter, followed by a specific du'a.",
  draftNotice: "DRAFT — Full instructional rewrite. Scholar review pending.",
  rakahs: [
    { number: 1, stepsSunni: istikharaSunniRakah1, stepsShia: istikharaShiaRakah1 },
    { number: 2, stepsSunni: istikharaSunniRakah2, stepsShia: istikharaShiaRakah2 },
  ],
};
