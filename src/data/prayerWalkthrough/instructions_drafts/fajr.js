// src/data/prayerWalkthrough/instructions_drafts/fajr.js
// ─────────────────────────────────────────────────────────────────────────────
// FAJR — Full step-by-step draft, both branches.
//
// ⚠️ DRAFT — REQUIRES SCHOLAR REVIEW BEFORE MERGING INTO LIVE APP
//
// Not imported anywhere in the app yet. Contains the full instructional
// rewrite per the redesign brief: rich body instructions, recitation notes,
// guidance tips, transitions, and source citations.
//
// To merge after scholar approval:
//   1. InstructionBlock.jsx needs new fields rendered:
//      `recitationNote`, `transition`, `source`
//   2. Replace the Fajr entry in dailyFive.js to use this file's rakahs
//      array directly (bypassing RakahBuilder.first/second for Fajr).
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";

const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// FAJR — SUNNI FORM
// ═════════════════════════════════════════════════════════════════════════════

const fajrSunniRakah1 = [

  {
    id: "fajr-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Distribute your weight evenly between both feet, neither leaning forward nor back. Lower your gaze toward the spot on the ground where your forehead will rest during prostration — keeping the eyes fixed at this single point throughout the prayer is the practice of the Prophet ﷺ and helps the heart settle into stillness. Form the intention silently in your heart: that you are about to pray the two rakahs of obligatory Fajr prayer for the sake of Allah.",
    recitation: null,
    recitationNote: null,
    tip: "The intention is an act of the heart's resolve. There is no requirement to speak it aloud, and the four Sunni schools agree on this.",
    transition: "Once your intention is firm, raise both hands to begin the prayer.",
    source: "Body posture: Ṣaḥīḥ al-Bukhārī 757. Intention requirement: Ṣaḥīḥ al-Bukhārī 1 (the famous hadith on actions and intentions).",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-takbir",
    title: "Opening Takbīr — Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_sunni",
    instruction: "Raise both hands to the level of your ears (or your shoulders — both are valid sunnah positions) with the palms facing the qiblah, fingers neither tightly closed nor splayed wide. As your hands reach their highest point, say the takbīr aloud (since Fajr is an audible prayer) or quietly if praying alone. This is the takbīr of consecration — the moment you formally enter the state of prayer. Until you complete this takbīr you may still turn back; once spoken, you are bound by the rules of salah until the closing salām.",
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Required — this is a pillar (rukn) of the prayer.",
    tip: "The voice should be clear enough that you yourself can hear it. Do not whisper.",
    transition: "Lower your hands and fold them on your chest or just above the navel.",
    source: "Ṣaḥīḥ al-Bukhārī 735 (hands raised to ear level); Sunan Abī Dāwūd 730 (to shoulders). Both narrations are authentic.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-fold",
    title: "Folding the Hands",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Place your right hand over the back of your left hand, with the right hand resting on the left wrist or forearm. Hold the hands gently against the chest below the collarbone, or just above the navel, depending on the practice you follow. The arms should rest naturally — neither stiff nor limp.",
    recitation: null,
    recitationNote: null,
    tip: "Choose one hand placement and stay consistent. Constant switching between positions reflects inattention rather than devotion.",
    transition: "With hands folded, seek refuge in Allah before beginning the recitation of the Qurʾan.",
    source: "Ṣaḥīḥ Muslim 401 (right over left, on the chest); Sunan Abī Dāwūd 758 (just below the navel).",
    madhhabNote: "Hanafi: hands placed below the navel. Shafi'i and Hanbali: on the chest below the collarbone. Maliki: hands may be left at the sides during obligatory prayers.",
  },


  {
    id: "fajr-r1-taawwudh",
    title: "Seeking Refuge — Taʿawwudh",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite the taʿawwudh silently to yourself, seeking refuge in Allah from Shayṭān. This precedes every Qurʾan recitation in prayer, but is verbally said only in the first rakah.",
    recitation: R.taawwudh,
    recitationNote: "Recited silently, once per prayer, before the first Fātiḥah.",
    tip: "The taʿawwudh is a reminder that the heart must turn away from distractions before approaching the words of Allah.",
    transition: "Begin Al-Fātiḥah with the basmalah.",
    source: "Qurʾan 16:98 — the command to seek refuge before reciting the Qurʾan.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-fatiha",
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite Al-Fātiḥah audibly. Begin with the basmalah, then move through the seven verses, pausing briefly at the end of each verse where the verse marker ۝ appears. Fajr is an audible prayer — when leading others, recite so that those behind you can clearly hear; when praying alone, speak at a level you can hear yourself.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly in Fajr. Required — Al-Fātiḥah must be recited in every rakah; no prayer is valid without it.",
    tip: "The Prophet ﷺ recited Al-Fātiḥah verse by verse, pausing at each one. Avoid running the verses together.",
    transition: "After completing Al-Fātiḥah, pause briefly, then recite a sūrah or portion of the Qurʾan.",
    source: "Qurʾan 1:1–7. Requirement: Ṣaḥīḥ al-Bukhārī 756, Ṣaḥīḥ Muslim 394 — 'There is no prayer for one who does not recite Fātiḥat al-Kitāb.'",
    madhhabNote: "Shafi'i: basmalah recited audibly as part of Al-Fātiḥah. Hanafi and Hanbali: basmalah recited silently. Maliki: basmalah omitted in obligatory prayers.",
  },

  {
    id: "fajr-r1-surah",
    title: "Second Sūrah — Al-Ikhlāṣ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "After Al-Fātiḥah, recite a short sūrah or portion of the Qurʾan audibly. Sūrat al-Ikhlāṣ is the most commonly chosen for daily prayers because of its conciseness and theological weight — the Prophet ﷺ said it equals one-third of the Qurʾan. You may also choose another sūrah you have memorised well.",
    recitation: R.ikhlas,
    recitationNote: "Recited audibly. Sunnah (recommended) — required only in the first two rakahs of an obligatory prayer.",
    tip: "Choose a sūrah you have memorised confidently. Hesitation in recitation breaks the flow of the prayer.",
    transition: "After the sūrah, say 'Allāhu Akbar' and bow into rukūʿ.",
    source: "Qurʾan 112:1–4. Equivalent-to-a-third merit: Ṣaḥīḥ al-Bukhārī 5013.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-ruku",
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: "Say 'Allāhu Akbar' as you bow forward. Place your hands firmly on your knees with fingers spread, the back flat and parallel to the ground. The neck and head form a single line with the back. Keep your eyes on the spot of prostration. Once settled, recite the tasbīḥ of rukūʿ at least three times.",
    recitation: R.tasbihRuku,
    recitationNote: "Recited a minimum of three times. Five or seven times is also reported and recommended for added reward. Required to recite at least once.",
    tip: "Do not bow only halfway. The back must be flat and level; a deep, settled bow is a pillar of the prayer.",
    transition: "Rise from rukūʿ to the upright standing position.",
    source: "Bowing form: Ṣaḥīḥ al-Bukhārī 828 — 'When the Prophet ﷺ bowed, if water were poured on his back it would not have moved.' Tasbīḥ: Sunan Abī Dāwūd 869.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-iitidal",
    title: "Rising from Rukūʿ — Iʿtidāl",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise from rukūʿ to a fully upright standing position, saying 'Samiʿa-llāhu liman ḥamidah' as you rise (if leading or praying alone). Once standing, complete the response 'Rabbanā wa laka l-ḥamd'. Stand calmly upright before going into prostration — rushing past this position is among the most common errors corrected by the Prophet ﷺ.",
    recitation: R.samiAllah,
    recitationNote: "First phrase said while rising. Second phrase said once standing. Both are sunnah and the standing itself is obligatory.",
    tip: "Pause and settle into the standing position. Calmness (ṭumaʾnīna) between movements is a pillar of valid prayer.",
    transition: "Say 'Allāhu Akbar' and descend into the first prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 757 — hadith of the man who prayed poorly, in which the Prophet ﷺ instructed him to attain calmness in iʿtidāl.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-sujud-1",
    title: "First Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate so that seven body parts touch the ground: the forehead (together with the nose), both palms, both knees, and the toes of both feet. The elbows should be lifted away from the floor and from the sides of your body. The toes should be turned to face the qiblah where possible. Once settled, recite the tasbīḥ of sujūd at least three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times. Five or seven is also reported. Required to recite at least once.",
    tip: "Sujūd is the moment of greatest closeness to Allah. The Prophet ﷺ said: 'A servant is closest to his Lord when he is in prostration, so increase your supplication in it.'",
    transition: "Rise briefly to the sitting position between the two prostrations.",
    source: "Seven points of contact: Ṣaḥīḥ al-Bukhārī 812. Elbows raised: Ṣaḥīḥ al-Bukhārī 822. Tasbīḥ: Sunan Abī Dāwūd 870. Closeness in sujūd: Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-jalsa",
    title: "Sitting Between Prostrations — Jalsa",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Rise from the first sujūd to a brief seated position with calmness. Sit on your left foot folded beneath you, with the right foot upright and the toes facing the qiblah (the iftirāsh sitting). Place your hands flat on your thighs. Recite the short du'a of forgiveness twice before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recited twice — once for each phrase 'Rabbi-ghfir lī'. Sunnah; the sitting itself is required.",
    tip: "Sit fully upright. A common error is to remain barely lifted between the two prostrations without true settling.",
    transition: "Say 'Allāhu Akbar' and prostrate again for the second sujūd.",
    source: "Sitting form: Ṣaḥīḥ al-Bukhārī 828. Du'a between prostrations: Sunan Abī Dāwūd 874.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-sujud-2",
    title: "Second Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate again, with all seven points of contact on the ground as in the first sujūd. Recite the tasbīḥ at least three more times. This second prostration completes the first rakah of the prayer.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times. Required to recite at least once.",
    tip: "Two prostrations make one rakah. Counting them in your head is a reliable way to avoid losing track.",
    transition: "Say 'Allāhu Akbar' and rise to the standing position for the second rakah.",
    source: "Two prostrations per rakah: Ṣaḥīḥ al-Bukhārī 757, 793. Confirmed by consensus of all schools.",
    madhhabNote: null,
  },
];

const fajrSunniRakah2 = [

  {
    id: "fajr-r2-qiyam",
    title: "Standing for the Second Rakah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to the standing position saying 'Allāhu Akbar', and once upright, fold your hands again in the same position as before. There is no opening supplication (istiftāḥ) or taʿawwudh in this rakah — they belong only to the first.",
    recitation: null,
    recitationNote: null,
    tip: "Pause and settle into the standing posture before beginning recitation.",
    transition: "Begin Al-Fātiḥah directly.",
    source: "Sunan al-Tirmidhī 304 — istiftāḥ recited only in the first rakah.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-fatiha",
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite Al-Fātiḥah audibly, beginning with the basmalah (according to your school's practice) and proceeding through all seven verses with brief pauses between them.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly. Required in every rakah.",
    tip: "The recitation should be neither rushed nor exaggerated. Aim for a natural, contemplative pace.",
    transition: "After Al-Fātiḥah, recite a second sūrah.",
    source: "Qurʾan 1:1–7. Same requirement as the first rakah.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-surah",
    title: "Second Sūrah — Al-Ikhlāṣ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite a second sūrah or portion of the Qurʾan audibly. The sūrah chosen in the second rakah should ideally be a different one from the first, and shorter or of similar length. Sūrat al-Ikhlāṣ remains a sound choice; many follow it with al-Falaq or an-Nās for variety.",
    recitation: R.ikhlas,
    recitationNote: "Recited audibly. Sunnah in the first two rakahs of obligatory prayers.",
    tip: "The Prophet ﷺ recited shorter sūrahs in Fajr than commonly assumed — quality of attention matters more than length of text.",
    transition: "After the sūrah, say 'Allāhu Akbar' and bow into rukūʿ.",
    source: "Qurʾan 112:1–4. Order of sūrahs: Ṣaḥīḥ al-Bukhārī 776.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-ruku",
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: "Say 'Allāhu Akbar' and bow as in the first rakah, hands on the knees, back flat and level. Recite the tasbīḥ of rukūʿ at least three times.",
    recitation: R.tasbihRuku,
    recitationNote: "Recited a minimum of three times.",
    tip: "Maintain the same form as in the first rakah — consistency is part of reverence.",
    transition: "Rise to the upright standing position.",
    source: "Ṣaḥīḥ al-Bukhārī 828; Sunan Abī Dāwūd 869.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-iitidal",
    title: "Rising from Rukūʿ — Iʿtidāl",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to the fully upright standing position, saying 'Samiʿa-llāhu liman ḥamidah' as you rise and completing 'Rabbanā wa laka l-ḥamd' once standing. Pause briefly before descending.",
    recitation: R.samiAllah,
    recitationNote: "Sunnah — said while rising and once standing. Note: Shafi'i and Maliki schools recite Qunūt al-Fajr at this point in the second rakah (see madhhabNote).",
    tip: "Calmness in iʿtidāl is a pillar of the prayer. Settle before moving to sujūd.",
    transition: "Say 'Allāhu Akbar' and descend into the first prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: "Shafi'i: Qunūt al-Fajr is recited here as a sunnah muʾakkadah — hands raised, palms up, reciting the qunūt du'a (see recitations file). Maliki: silently. Hanafi and Hanbali: qunūt is not recited in Fajr except in times of public calamity.",
  },

  {
    id: "fajr-r2-sujud-1",
    title: "First Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate with all seven points of contact as before. Elbows lifted off the floor and away from the body. Recite the tasbīḥ of sujūd at least three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times. Additional du'a is recommended in sujūd, especially in the final rakah.",
    tip: "This is your last chance for supplication in this prayer. Ask Allah for what is most needed.",
    transition: "Rise to the sitting position between the two prostrations.",
    source: "Ṣaḥīḥ al-Bukhārī 812; Sunan Abī Dāwūd 870.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-jalsa",
    title: "Sitting Between Prostrations — Jalsa",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Sit briefly in the iftirāsh position (left foot folded beneath, right foot upright) with hands on the thighs. Recite the du'a of forgiveness twice.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recited twice. Sunnah.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and prostrate for the second sujūd.",
    source: "Sunan Abī Dāwūd 874.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-sujud-2",
    title: "Second Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate for the second time, with the same seven points of contact. Recite the tasbīḥ at least three times. This is the final sujūd of the prayer.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times.",
    tip: null,
    transition: "Rise to the seated position for the final tashahhud.",
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Sit calmly in the tawarruk position (left leg passed under the right, left buttock on the floor, right foot upright) — this sitting is for the final tashahhud in a two-rakah prayer per the Maliki and Shafi'i practice; Hanafis and Hanbalis use the iftirāsh sitting. Place your left hand flat on your left thigh. Make a fist with the right hand, releasing the index finger to point forward toward the qiblah. Recite the tashahhud — when you reach 'lā ilāha illa-llāh', raise the right index finger and lower it after the testimony.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited once, silently. Required in the final sitting of every prayer.",
    tip: "The index finger is raised at the testimony of faith — a small physical sign of the soul's testimony.",
    transition: "Continue to the ṣalawāt upon the Prophet ﷺ.",
    source: "Tashahhud text: Ṣaḥīḥ al-Bukhārī 831 — hadith of Ibn Masʿūd ؓ. Index finger: Ṣaḥīḥ Muslim 580. Sitting form: Ṣaḥīḥ al-Bukhārī 828.",
    madhhabNote: "Sitting position: Maliki and Shafi'i schools use tawarruk in the final sitting of every prayer. Hanafi and Hanbali use iftirāsh (the same sitting as between prostrations).",
  },

  {
    id: "fajr-r2-salawat",
    title: "Blessings on the Prophet ﷺ — Ṣalawāt",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Continue from the tashahhud directly into the ṣalawāt, sending blessings upon the Prophet Muḥammad ﷺ and the family of Ibrāhīm and Muḥammad. This is the well-known Ibrāhīmiyya form taught by the Prophet ﷺ himself when his companions asked how to send blessings upon him.",
    recitation: R.salawat,
    recitationNote: "Recited once, silently. Sunnah muʾakkadah — strongly recommended, and the Shafi'i school considers it required.",
    tip: "The ṣalawāt is the heart of the final sitting. Recite it with awareness of the one upon whom you are sending blessings.",
    transition: "After the ṣalawāt, you may add a personal supplication before the final salām.",
    source: "Ṣaḥīḥ al-Bukhārī 3370 — hadith of Kaʿb ibn ʿUjra ؓ.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-dua-closing",
    title: "Closing Du'a (Optional)",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Before the salām, you may add a personal supplication asking Allah for whatever is in your heart. The Prophet ﷺ taught the du'a 'Rabbanā ātinā fī d-dunyā ḥasanatan...' as a brief and complete supplication when none other comes to mind.",
    recitation: R.rabbanaAtina,
    recitationNote: "Sunnah — said silently between the ṣalawāt and the salām.",
    tip: "Ask for what is needed in this world and the next. The end of the prayer is among the moments most likely to receive a response.",
    transition: "Now prepare for the final salām.",
    source: "Qurʾan 2:201. Recommended du'a in this position: Sunan Abī Dāwūd 1492.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-salam",
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_sunni",
    instruction: "Turn your head to the right shoulder until your cheek is visible to those behind you, and say the salām aloud. Then turn your head to the left shoulder and repeat. The salām is a greeting to the angels recording the prayer on either side and to the believers around you. With the second salām, the prayer is complete and you are no longer bound by its rules.",
    recitation: R.salam,
    recitationNote: "Recited once to the right, then once to the left. Required to recite at least the first salām.",
    tip: "After the salām, remain seated for a moment of dhikr — saying 'Astaghfiru-llāh' three times and the post-prayer adhkār is sunnah of the Prophet ﷺ.",
    transition: "The prayer is now complete. Take a moment of stillness before standing.",
    source: "Sunan Abī Dāwūd 996 — hadith of Wāʾil ibn Ḥujr ؓ. Post-prayer adhkār: Ṣaḥīḥ Muslim 591.",
    madhhabNote: "Hanafi and Hanbali: both salāms are required. Shafi'i: only the first is required; the second is sunnah. Maliki: one salām suffices.",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// FAJR — SHIA (Imāmī Jaʿfarī) FORM
// ═════════════════════════════════════════════════════════════════════════════

const fajrShiaRakah1 = [

  {
    id: "fajr-r1-qiyam",
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Your arms rest naturally at your sides — they are not folded during qiyām in the Shia tradition. Distribute your weight evenly between both feet. Lower your gaze toward the spot of prostration. Form the intention silently in your heart: 'I am praying the two rakahs of obligatory Fajr prayer, qurbatan ilā-llāh — seeking nearness to Allah.'",
    recitation: null,
    recitationNote: null,
    tip: "The intention (niyyah) and the orientation toward 'qurbatan ilā-llāh' (seeking nearness to Allah) is essential — the act must be for Allah alone.",
    transition: "Once your intention is firm, raise both hands to begin the prayer.",
    source: "Wasāʾil al-Shīʿa, Book of Prayer, ch. on intention. Sistani, Tawḍīḥ al-Masāʾil §942–943.",
    madhhabNote: "In the Shia tradition, the hands rest naturally at the sides throughout qiyām, not folded.",
  },

  {
    id: "fajr-r1-takbir",
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: "Raise both hands to the level of your ears with the palms facing the qiblah and the fingers held naturally. As your hands reach their highest point, say the takbīr aloud (Fajr is audible). This is the takbīr of consecration — the formal entry into prayer. Once spoken, you are bound by the rules of salah until the closing salām.",
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Obligatory — this is a pillar of the prayer.",
    tip: "Six additional takbīrs preceding the takbīrat al-iḥrām are recommended (mustaḥabb), with hands raised at each. This is known as takbīrāt al-iftitāḥ.",
    transition: "After the takbīr, lower your hands back to your sides.",
    source: "Wasāʾil al-Shīʿa, Book of Prayer, ch. on takbīrat al-iḥrām. Sistani, Tawḍīḥ al-Masāʾil §989–991. Recommended seven takbīrs: al-Kāfī vol. 3, ḥadīth 311.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-fatiha",
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite Al-Fātiḥah audibly. Begin with the basmalah (which is the first verse of the sūrah in the Shia tradition and is always recited aloud in audible prayers). Continue through all seven verses, pausing briefly at each verse ending.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly in Fajr. Obligatory — Al-Fātiḥah must be recited in the first two rakahs of every obligatory prayer.",
    tip: "The basmalah is counted as part of Al-Fātiḥah and recited aloud in Fajr, Maghrib, and Isha.",
    transition: "After Al-Fātiḥah, recite a second complete sūrah.",
    source: "Qurʾan 1:1–7. Sistani, Tawḍīḥ al-Masāʾil §993. al-Kāfī vol. 3 — basmalah as part of every sūrah.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-surah",
    title: "Second Sūrah — Al-Ikhlāṣ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "After Al-Fātiḥah, recite a complete second sūrah audibly. The Shia tradition requires that a full sūrah be recited — beginning with its basmalah and ending at its conclusion — not just a portion. Sūrat al-Ikhlāṣ is the most commonly chosen for its conciseness and is highly recommended by the Imāms.",
    recitation: R.ikhlas,
    recitationNote: "Recited audibly. The complete sūrah is obligatory in the first two rakahs — a partial recitation is not sufficient.",
    tip: "The requirement to recite a complete sūrah (not a portion) is distinctive to the Shia tradition. Choose a sūrah you have memorised confidently.",
    transition: "After completing the sūrah, prepare to bow into rukūʿ.",
    source: "Qurʾan 112:1–4. Complete-sūrah requirement: Sistani, Tawḍīḥ al-Masāʾil §1005. al-Kāfī vol. 3.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-ruku",
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow forward, placing your hands on your knees with the fingers spread. The back is flat, the head aligned with the back. Once settled, recite the tasbīḥ of rukūʿ — either the longer form three times or the shorter 'Subḥāna rabbiya l-ʿaẓīm wa bi-ḥamdih' three times. The position must be held until you have completed the tasbīḥ.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ, or one repetition of the longer form. Obligatory to recite at least once.",
    tip: "Calmness (ṭumaʾnīna) in rukūʿ is obligatory. Do not begin the tasbīḥ until your body has fully settled into the bow.",
    transition: "Rise to the standing position.",
    source: "Wasāʾil al-Shīʿa, Book of Prayer, chapters on rukūʿ. Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-iitidal",
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise from the bow to a fully upright standing position. It is recommended to say 'Samiʿa-llāhu liman ḥamidah' as you rise. Stand briefly and settle the body before descending into prostration.",
    recitation: R.samiAllah,
    recitationNote: "Recommended (mustaḥabb), said while rising. The standing itself is obligatory.",
    tip: "Standing fully upright after rukūʿ — even briefly — is required for the prayer to be valid. A common error is to bend directly from rukūʿ into sujūd without this pause.",
    transition: "Say 'Allāhu Akbar' and descend to the first prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059. Wasāʾil al-Shīʿa, Book of Prayer.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-sujud-1",
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate. The forehead must rest on something it is permissible to prostrate upon — most commonly a turbah, a small clay tablet ideally taken from the earth of Karbalāʾ. The other six points of contact — both palms, both knees, and the big toes of both feet — rest on the ground. Once settled, recite the tasbīḥ of sujūd: three times of the short form or once of the longer.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory to recite at least once.",
    tip: "If no turbah is available, prostrate on something earthen or plant-based that is not eaten or worn — paper, a leaf, unprocessed wood, or natural stone. Prostration on cloth, carpet, or processed materials is not valid in the Shia tradition.",
    transition: "Rise to the sitting position between the two prostrations.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067 (places of sujūd), §1075–1080 (turbah). al-Kāfī vol. 3.",
    madhhabNote: "The requirement that the forehead rest on natural earth or plant matter (not eaten or worn) is established by the Imāms and distinctive to the Shia tradition.",
  },

  {
    id: "fajr-r1-jalsa",
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Rise from the first sujūd to a brief seated position. Sit in the mutawarrik posture — on your left thigh, with both feet passed to the right side, the right foot resting on the sole of the left. Place your hands palms-down on your thighs. Settle calmly before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recited recommended (mustaḥabb). Calmness in the sitting position is obligatory.",
    tip: "The mutawarrik sitting on the left thigh is the standard Shia posture in the sitting positions of prayer. Calmness in this position is required for the prayer to be valid.",
    transition: "Say 'Allāhu Akbar' and descend to the second prostration.",
    source: "Sitting form: Sistani, Tawḍīḥ al-Masāʾil §1100. al-Kāfī vol. 3.",
    madhhabNote: null,
  },

  {
    id: "fajr-r1-sujud-2",
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah, with all seven points of contact as before. Recite the tasbīḥ at least three more times. The two prostrations together complete one rakah.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: "Two prostrations complete one rakah. Counting them prevents losing track of the prayer's progress.",
    transition: "Rise — saying 'Allāhu Akbar' — to the standing position for the second rakah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  },
];

const fajrShiaRakah2 = [

  {
    id: "fajr-r2-qiyam",
    title: "Standing for the Second Rakah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to a standing position saying 'Allāhu Akbar', with arms naturally at the sides.",
    recitation: null,
    recitationNote: null,
    tip: "While rising, it is recommended (mustaḥabb) to say 'bi-ḥawli-llāhi wa quwwatihī aqūmu wa aqʿud' — 'By the power and strength of Allah I stand and sit'.",
    transition: "Begin Al-Fātiḥah directly.",
    source: "Mafātīḥ al-Jinān — recommended du'a when rising between rakahs.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-fatiha",
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite Al-Fātiḥah audibly, beginning with the basmalah as part of the sūrah, and proceeding through all seven verses.",
    recitation: R.fatiha,
    recitationNote: "Recited audibly. Obligatory.",
    tip: "Maintain the same audible voice as in the first rakah.",
    transition: "After Al-Fātiḥah, recite a second complete sūrah.",
    source: "Qurʾan 1:1–7. Sistani, Tawḍīḥ al-Masāʾil §993.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-surah",
    title: "Second Sūrah — Al-Ikhlāṣ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite a complete second sūrah audibly. Many follow Al-Ikhlāṣ in the first rakah with Sūrat al-Qadr or another short sūrah in the second — though Al-Ikhlāṣ in both is also valid.",
    recitation: R.ikhlas,
    recitationNote: "Recited audibly. Complete sūrah is obligatory.",
    tip: "The recommended pairing in Fajr is Sūrat al-Qadr in the first rakah and al-Tawḥīd (Ikhlāṣ) in the second — the reverse of what is most common today.",
    transition: "After the sūrah, prepare for qunūt before going into rukūʿ.",
    source: "Qurʾan 112:1–4. Recommended pairing: Mafātīḥ al-Jinān, Fajr prayer.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-qunut",
    title: "Du'a",
    posture: POSTURES.STANDING,
    assetName: "pose_qunut",
    instruction: "Before bowing into rukūʿ in the second rakah, raise both hands palms-up to the level of your face, fingers held together, and recite the du'a. The simplest valid form is Rabbanā ātinā (Qurʾan 2:201) followed by ṣalawāt on Muḥammad and his family. Longer du'as and personal supplications may be added — this is a moment of intimate request.",
    recitation: R.qunutShia,
    recitationNote: "Recited audibly. Strongly recommended (mustaḥabb muʾakkad) in every prayer's second rakah, before rukūʿ. Not obligatory — the prayer remains valid if omitted, but its omission is discouraged.",
    tip: "Du'a may be recited in any language with personal supplication, though the formulaic Arabic forms are most rewarded. The hands are held palms-up at face level throughout.",
    transition: "After the du'a, lower your hands and say 'Allāhu Akbar' as you bow into rukūʿ.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1116–1119. al-Kāfī vol. 3, ch. on qunūt.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-ruku",
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow as before, hands on the knees, back flat. Recite the tasbīḥ at least three times in the short form or once in the long.",
    recitation: R.tasbihRuku,
    recitationNote: "Same as the first rakah. Obligatory to recite at least once.",
    tip: null,
    transition: "Rise to the standing position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-iitidal",
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to fully upright standing, saying 'Samiʿa-llāhu liman ḥamidah'. Settle before descending into sujūd.",
    recitation: R.samiAllah,
    recitationNote: "Recommended; the standing itself is obligatory.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and descend to sujūd.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-sujud-1",
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate on the turbah with all seven points of contact. Recite the tasbīḥ at least three times. This is among the moments of greatest closeness to Allah — personal du'a in sujūd is encouraged.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Additional du'a recommended.",
    tip: "Du'a in sujūd may be in any language and on any matter. The Imāms encouraged taking advantage of this moment.",
    transition: "Rise to the seated position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-jalsa",
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Sit briefly in the mutawarrik posture as before. Settle calmly before the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Say 'Allāhu Akbar' and descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-sujud-2",
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate the second time, all seven points of contact on the ground, forehead on the turbah. Recite the tasbīḥ at least three more times. This is the final sujūd of the prayer.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the seated position for the final tashahhud.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-tashahhud",
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_shia",
    instruction: "Sit in the mutawarrik posture — on the left thigh, both feet to the right, right foot resting on the sole of the left. Place your hands palms-down on your thighs. Recite the Shia form of the tashahhud, which includes the testimony of faith, the testimony of Muḥammad's messengership, and the ṣalawāt upon Muḥammad and his family — these are all parts of the tashahhud itself in the Shia tradition.",
    recitation: R.tashahhudShia,
    recitationNote: "Recited silently. Obligatory in the final sitting.",
    tip: "Sending blessings on the Prophet and his family is part of the tashahhud itself in Shia practice, not a separate optional act.",
    transition: "After the tashahhud, prepare for the closing salām.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1126 — standard Shia tashahhud form. al-Kāfī vol. 3, ch. on tashahhud.",
    madhhabNote: null,
  },

  {
    id: "fajr-r2-closing-sequence",
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
    id: "fajr-r2-salam",
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

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

export const fajrDraft = {
  id: "fajr",
  name: "Fajr",
  arabicName: "الفجر",
  subtitle: "Dawn prayer",
  rakahCount: 2,
  category: "obligatory",
  tradition: "both",
  summary: "Two rakahs prayed between dawn and sunrise.",
  draftNotice: "DRAFT — Full instructional rewrite. Requires scholar review before merging into the live app. Sources cited per step.",
  rakahs: [
    { number: 1, stepsSunni: fajrSunniRakah1, stepsShia: fajrShiaRakah1 },
    { number: 2, stepsSunni: fajrSunniRakah2, stepsShia: fajrShiaRakah2 },
  ],
};
