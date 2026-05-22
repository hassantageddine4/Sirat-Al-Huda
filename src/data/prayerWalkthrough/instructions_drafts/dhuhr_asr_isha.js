// src/data/prayerWalkthrough/instructions_drafts/dhuhr_asr_isha.js
// ─────────────────────────────────────────────────────────────────────────────
// DHUHR / ASR / ISHA — Full step-by-step draft, both branches.
//
// ⚠️ DRAFT — REQUIRES SCHOLAR REVIEW BEFORE MERGING INTO LIVE APP
//
// These three prayers share the same 4-rakah structure. The differences are:
//   • Prayer name + Arabic name
//   • Audibility in rakahs 1-2:
//       Dhuhr  → silent in all rakahs
//       Asr    → silent in all rakahs
//       Isha   → audible in rakahs 1-2, silent in rakahs 3-4
//
// The step content is defined once below via factory functions and used by
// all three prayer exports at the bottom. Hassan and the scholar reviewer
// can review the step definitions once and they apply to all three prayers.
//
// Structure (each prayer, both branches):
//   Rakah 1 — full opening sequence (intention, takbir, fatiha, surah, etc.)
//   Rakah 2 — fatiha, surah, full rakah, then FIRST tashahhud (sitting only)
//   Rakah 3 — fatiha only (Sunni) or tasbīḥāt al-arbaʿa (Shia option)
//   Rakah 4 — fatiha only, then FINAL tashahhud + salawat (Sunni) / salam
//
// Sources: Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim, Sunan Abī Dāwūd, Sunan al-Tirmidhī
// for Sunni; al-Kāfī, Wasāʾil al-Shīʿa, Sistani's Tawḍīḥ al-Masāʾil for Shia.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";

const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// SUNNI — STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function sunniRakah1(prayer, prayerName, audible) {
  return [
    {
      id: `${prayer}-r1-qiyam`,
      title: "Standing — Qiyām",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: `Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Distribute your weight evenly between both feet. Lower your gaze toward the spot on the ground where your forehead will rest during prostration — keeping the eyes fixed at this single point throughout the prayer is the practice of the Prophet ﷺ. Form the intention silently in your heart: that you are about to pray the four rakahs of obligatory ${prayerName} prayer for the sake of Allah.`,
      recitation: null,
      recitationNote: null,
      tip: "The intention is an act of the heart's resolve. There is no requirement to speak it aloud.",
      transition: "Once your intention is firm, raise both hands to begin the prayer.",
      source: "Body posture: Ṣaḥīḥ al-Bukhārī 757. Intention: Ṣaḥīḥ al-Bukhārī 1.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r1-takbir`,
      title: "Opening Takbīr — Takbīrat al-Iḥrām",
      posture: POSTURES.STANDING,
      assetName: "pose_takbir_sunni",
      instruction: `Raise both hands to the level of your ears (or your shoulders — both are valid sunnah positions) with the palms facing the qiblah. As your hands reach their highest point, say the takbīr ${audible ? "aloud" : "softly to yourself"}. This is the takbīr of consecration — the formal entry into the prayer.`,
      recitation: R.takbirOpening,
      recitationNote: "Recited once. Required — this is a pillar of the prayer.",
      tip: "The voice should be clear enough that you can hear it. Do not whisper.",
      transition: "Lower your hands and fold them on your chest or just above the navel.",
      source: "Ṣaḥīḥ al-Bukhārī 735; Sunan Abī Dāwūd 730.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r1-fold`,
      title: "Folding the Hands",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Place your right hand over the back of your left hand, with the right hand resting on the left wrist or forearm. Hold the hands gently against the chest below the collarbone, or just above the navel, depending on the practice you follow. The arms rest naturally — neither stiff nor limp.",
      recitation: null,
      recitationNote: null,
      tip: "Choose one hand placement and remain consistent. Constant switching reflects inattention.",
      transition: "Seek refuge in Allah before beginning the recitation of the Qurʾan.",
      source: "Ṣaḥīḥ Muslim 401; Sunan Abī Dāwūd 758.",
      madhhabNote: "Hanafi: hands below the navel. Shafi'i and Hanbali: on the chest. Maliki: may be left at the sides.",
    },
        {
      id: `${prayer}-r1-taawwudh`,
      title: "Seeking Refuge — Taʿawwudh",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Recite the taʿawwudh silently, seeking refuge in Allah from Shayṭān. This precedes every Qurʾan recitation in prayer, but is said verbally only in the first rakah.",
      recitation: R.taawwudh,
      recitationNote: "Recited silently, once per prayer, before the first Fātiḥah.",
      tip: "The taʿawwudh is a reminder that the heart must turn away from distractions before approaching the words of Allah.",
      transition: "Begin Al-Fātiḥah with the basmalah.",
      source: "Qurʾan 16:98.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r1-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}. Begin with the basmalah, then move through the seven verses, pausing briefly at the end of each verse where the verse marker ۝ appears.${audible ? " When leading others, recite so those behind can hear; when praying alone, speak at a level you can hear yourself." : " Move the lips quietly; the recitation should not be heard by others."}`,
      recitation: R.fatiha,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Required — Al-Fātiḥah must be recited in every rakah.`,
      tip: "The Prophet ﷺ recited Al-Fātiḥah verse by verse, pausing at each one.",
      transition: "After Al-Fātiḥah, recite a second sūrah.",
      source: "Qurʾan 1:1–7. Requirement: Ṣaḥīḥ Muslim 394.",
      madhhabNote: "Shafi'i: basmalah recited as part of Al-Fātiḥah. Hanafi/Hanbali: basmalah recited silently. Maliki: omitted in obligatory prayers.",
    },
    {
      id: `${prayer}-r1-surah`,
      title: "Second Sūrah — Al-Ikhlāṣ",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: `After Al-Fātiḥah, recite a short sūrah or portion of the Qurʾan ${audible ? "audibly" : "silently"}. Sūrat al-Ikhlāṣ is the most commonly chosen — the Prophet ﷺ said it equals one-third of the Qurʾan.`,
      recitation: R.ikhlas,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Sunnah — required only in the first two rakahs of an obligatory prayer.`,
      tip: "Choose a sūrah you have memorised confidently. Hesitation breaks the flow.",
      transition: "After the sūrah, say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Qurʾan 112:1–4.",
      madhhabNote: null,
    },
    sunniRukuStep(prayer, 1),
    sunniIitidalStep(prayer, 1),
    sunniSujud1Step(prayer, 1, true),
    sunniJalsaStep(prayer, 1),
    sunniSujud2Step(prayer, 1, false),
  ];
}

function sunniRakah2(prayer, audible) {
  return [
    {
      id: `${prayer}-r2-qiyam`,
      title: "Standing for the Second Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Rise to the standing position saying 'Allāhu Akbar', and once upright, fold your hands again. There is no opening supplication or taʿawwudh in this rakah — they belong only to the first.",
      recitation: null,
      recitationNote: null,
      tip: "Pause and settle into the standing posture before beginning recitation.",
      transition: "Begin Al-Fātiḥah directly.",
      source: "Sunan al-Tirmidhī 304 — istiftāḥ recited only in the first rakah.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r2-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}, beginning with the basmalah and proceeding through all seven verses with brief pauses between them.`,
      recitation: R.fatiha,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Required.`,
      tip: "The recitation should be neither rushed nor exaggerated. Aim for a natural, contemplative pace.",
      transition: "After Al-Fātiḥah, recite a second sūrah.",
      source: "Qurʾan 1:1–7.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r2-surah`,
      title: "Second Sūrah — Al-Ikhlāṣ",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: `Recite a second sūrah ${audible ? "audibly" : "silently"}. The sūrah chosen in the second rakah should ideally be a different one from the first, and shorter or of similar length.`,
      recitation: R.ikhlas,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Sunnah in the first two rakahs.`,
      tip: "Quality of attention matters more than length of text.",
      transition: "After the sūrah, say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Qurʾan 112:1–4.",
      madhhabNote: null,
    },
    sunniRukuStep(prayer, 2),
    sunniIitidalStep(prayer, 2),
    sunniSujud1Step(prayer, 2, false),
    sunniJalsaStep(prayer, 2),
    sunniSujud2Step(prayer, 2, false),
    {
      id: `${prayer}-r2-first-tashahhud`,
      title: "First Tashahhud",
      posture: POSTURES.KNEELING,
      assetName: "pose_tashahhud_sunni",
      instruction: "Sit in the iftirāsh position — left foot folded beneath you, right foot upright with toes facing the qiblah. Place the left hand flat on the left thigh; make a fist with the right hand and release the index finger to point forward. Recite the tashahhud through the testimony of faith. At 'lā ilāha illa-llāh', raise the right index finger and lower it afterward. Do NOT recite the ṣalawāt here — that is only in the final tashahhud.",
      recitation: R.tashahhudSunni,
      recitationNote: "Recited silently. Sunnah; the sitting itself is required.",
      tip: "Keep this sitting brief — it is a pause, not a closing. The next rakah follows immediately.",
      transition: "Say 'Allāhu Akbar' and rise to standing for the third rakah.",
      source: "Ṣaḥīḥ al-Bukhārī 831; Sunan Abī Dāwūd 970.",
      madhhabNote: "Hanafi: brief ṣalawāt may be added here. Shafi'i/Maliki/Hanbali: just the tashahhud, no ṣalawāt in this sitting.",
    },
  ];
}

function sunniRakah3(prayer) {
  return [
    {
      id: `${prayer}-r3-qiyam`,
      title: "Standing for the Third Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Rise from the first tashahhud saying 'Allāhu Akbar'. Stand upright and fold your hands as before. The third and fourth rakahs are always recited silently, regardless of whether the prayer's first two rakahs were audible.",
      recitation: null,
      recitationNote: null,
      tip: "From this point onward, the recitation is silent for all prayers.",
      transition: "Begin Al-Fātiḥah silently.",
      source: "Ṣaḥīḥ al-Bukhārī 776 — silent recitation in rakahs 3-4.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r3-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Recite Al-Fātiḥah silently, moving the lips quietly. No additional sūrah is recited in the third rakah — only Al-Fātiḥah.",
      recitation: R.fatiha,
      recitationNote: "Recited silently. Required. No second sūrah is recited.",
      tip: "The omission of the second sūrah in rakahs 3-4 is by sunnah of the Prophet ﷺ; do not add one.",
      transition: "After Al-Fātiḥah, say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Ṣaḥīḥ al-Bukhārī 776.",
      madhhabNote: null,
    },
    sunniRukuStep(prayer, 3),
    sunniIitidalStep(prayer, 3),
    sunniSujud1Step(prayer, 3, false),
    sunniJalsaStep(prayer, 3),
    sunniSujud2Step(prayer, 3, false),
  ];
}

function sunniRakah4(prayer) {
  return [
    {
      id: `${prayer}-r4-qiyam`,
      title: "Standing for the Fourth Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Rise saying 'Allāhu Akbar' and stand upright, folding the hands. This is the final rakah.",
      recitation: null,
      recitationNote: null,
      tip: "The final rakah carries the weight of concluding the prayer with proper attention.",
      transition: "Begin Al-Fātiḥah silently.",
      source: null,
      madhhabNote: null,
    },
    {
      id: `${prayer}-r4-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_sunni",
      instruction: "Recite Al-Fātiḥah silently. No additional sūrah is recited.",
      recitation: R.fatiha,
      recitationNote: "Recited silently. Required.",
      tip: null,
      transition: "Say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Qurʾan 1:1–7.",
      madhhabNote: null,
    },
    sunniRukuStep(prayer, 4),
    sunniIitidalStep(prayer, 4),
    sunniSujud1Step(prayer, 4, true),
    sunniJalsaStep(prayer, 4),
    sunniSujud2Step(prayer, 4, false),
    {
      id: `${prayer}-r4-tashahhud`,
      title: "Final Tashahhud",
      posture: POSTURES.KNEELING,
      assetName: "pose_tashahhud_sunni",
      instruction: "Sit in the tawarruk position (left leg passed under the right, left buttock on the floor, right foot upright) per Maliki and Shafi'i practice; Hanafis and Hanbalis use iftirāsh in the final sitting also. Place the left hand flat on the left thigh, make a fist with the right hand, and release the index finger. Recite the tashahhud, raising the right index finger at 'lā ilāha illa-llāh' and lowering it after the testimony.",
      recitation: R.tashahhudSunni,
      recitationNote: "Recited once, silently. Required in the final sitting.",
      tip: "The index finger is raised at the testimony of faith — a small physical sign of the soul's testimony.",
      transition: "Continue directly to the ṣalawāt.",
      source: "Tashahhud: Ṣaḥīḥ al-Bukhārī 831. Index finger: Ṣaḥīḥ Muslim 580. Sitting form: Ṣaḥīḥ al-Bukhārī 828.",
      madhhabNote: "Final-sitting posture: Maliki/Shafi'i use tawarruk. Hanafi/Hanbali use iftirāsh.",
    },
    {
      id: `${prayer}-r4-salawat`,
      title: "Blessings on the Prophet ﷺ — Ṣalawāt",
      posture: POSTURES.KNEELING,
      assetName: "pose_tashahhud_sunni",
      instruction: "Continue from the tashahhud into the ṣalawāt, sending blessings upon the Prophet Muḥammad ﷺ and the family of Ibrāhīm and Muḥammad. This is the Ibrāhīmiyya form taught by the Prophet ﷺ when his companions asked how to send blessings upon him.",
      recitation: R.salawat,
      recitationNote: "Recited silently. Sunnah muʾakkadah — strongly recommended; the Shafi'i school considers it required.",
      tip: "The ṣalawāt is the heart of the final sitting. Recite with awareness of the one being blessed.",
      transition: "After the ṣalawāt, you may add a personal supplication before the salām.",
      source: "Ṣaḥīḥ al-Bukhārī 3370 — hadith of Kaʿb ibn ʿUjra ؓ.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r4-dua-closing`,
      title: "Closing Du'a (Optional)",
      posture: POSTURES.KNEELING,
      assetName: "pose_tashahhud_sunni",
      instruction: "Before the salām, you may add a personal supplication asking Allah for whatever is in your heart. The Prophet ﷺ taught 'Rabbanā ātinā...' as a brief and complete supplication.",
      recitation: R.rabbanaAtina,
      recitationNote: "Sunnah — said silently between the ṣalawāt and the salām.",
      tip: "Ask for what is needed in this world and the next. The end of the prayer is among the moments most likely to receive a response.",
      transition: "Prepare for the final salām.",
      source: "Qurʾan 2:201. Recommended position: Sunan Abī Dāwūd 1492.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r4-salam`,
      title: "Closing Salām",
      posture: POSTURES.KNEELING,
      assetName: "pose_salam_sunni",
      instruction: "Turn your head to the right shoulder until your cheek is visible to those behind you, and say the salām aloud. Then turn your head to the left shoulder and repeat. With the second salām, the prayer is complete and you are no longer bound by its rules.",
      recitation: R.salam,
      recitationNote: "Recited once to the right, then once to the left. Required to recite at least the first salām.",
      tip: "After the salām, remain seated for a moment of post-prayer dhikr — 'Astaghfiru-llāh' three times and the standard adhkār are sunnah.",
      transition: "The prayer is now complete. Take a moment of stillness before standing.",
      source: "Sunan Abī Dāwūd 996; post-prayer adhkār: Ṣaḥīḥ Muslim 591.",
      madhhabNote: "Hanafi/Hanbali: both salāms are required. Shafi'i: only the first required, the second sunnah. Maliki: one salām suffices.",
    },
  ];
}

// ─── Sunni shared movement steps ─────────────────────────────────────────────

function sunniRukuStep(prayer, rakah) {
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

function sunniIitidalStep(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ — Iʿtidāl",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to a fully upright standing position, saying 'Samiʿa-llāhu liman ḥamidah' as you rise and 'Rabbanā wa laka l-ḥamd' once standing. Pause briefly before descending.",
    recitation: R.samiAllah,
    recitationNote: "Said while rising and once standing. Sunnah; the standing is obligatory.",
    tip: "Calmness in iʿtidāl is a pillar of the prayer.",
    transition: "Say 'Allāhu Akbar' and descend into prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: null,
  };
}

function sunniSujud1Step(prayer, rakah, addDuaTip) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate so that seven body parts touch the ground: the forehead (together with the nose), both palms, both knees, and the toes of both feet. The elbows should be lifted away from the floor and from the sides of your body. Once settled, recite the tasbīḥ of sujūd at least three times.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times. Additional du'a in sujūd is recommended.",
    tip: addDuaTip
      ? "Sujūd is the moment of greatest closeness to Allah. The Prophet ﷺ said: 'A servant is closest to his Lord when in prostration, so increase your supplication in it.'"
      : null,
    transition: "Rise to the sitting position between the two prostrations.",
    source: "Ṣaḥīḥ al-Bukhārī 812; Sunan Abī Dāwūd 870.",
    madhhabNote: null,
  };
}

function sunniJalsaStep(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations — Jalsa",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: "Sit briefly in the iftirāsh position (left foot folded beneath, right foot upright) with hands flat on the thighs. Recite the du'a of forgiveness twice before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recited twice. Sunnah; the sitting itself is required.",
    tip: "Sit fully upright. A common error is to remain barely lifted between the two prostrations.",
    transition: "Say 'Allāhu Akbar' and prostrate again for the second sujūd.",
    source: "Sunan Abī Dāwūd 874.",
    madhhabNote: null,
  };
}

function sunniSujud2Step(prayer, rakah, addTip) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration — Sujūd",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: "Say 'Allāhu Akbar' and prostrate again with the same seven points of contact. Recite the tasbīḥ at least three more times. This completes the prostrations of this rakah.",
    recitation: R.tasbihSujud,
    recitationNote: "Recited a minimum of three times.",
    tip: addTip ? "Two prostrations make one rakah. Counting them keeps you on track." : null,
    transition: rakah === 4 ? "Rise to the seated position for the final tashahhud." : (rakah === 2 ? "Rise to the seated position for the first tashahhud." : "Say 'Allāhu Akbar' and rise to standing for the next rakah."),
    source: "Ṣaḥīḥ al-Bukhārī 757.",
    madhhabNote: null,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SHIA — STEP FACTORIES
// ═════════════════════════════════════════════════════════════════════════════

function shiaRakah1(prayer, prayerName, audible) {
  return [
    {
      id: `${prayer}-r1-qiyam`,
      title: "Standing — Qiyām",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: `Stand upright facing the qiblah with your feet roughly shoulder-width apart and parallel. Your arms rest naturally at your sides — they are not folded during qiyām in the Shia tradition. Lower your gaze toward the spot of prostration. Form the intention silently in your heart: 'I am praying the four rakahs of obligatory ${prayerName} prayer, qurbatan ilā-llāh — seeking nearness to Allah.'`,
      recitation: null,
      recitationNote: null,
      tip: "The orientation toward 'qurbatan ilā-llāh' is essential — the act must be for Allah alone.",
      transition: "Once your intention is firm, raise both hands to begin the prayer.",
      source: "Wasāʾil al-Shīʿa, Book of Prayer, ch. on intention. Sistani, Tawḍīḥ al-Masāʾil §942–943.",
      madhhabNote: "Hands rest at the sides throughout qiyām, not folded.",
    },
    {
      id: `${prayer}-r1-takbir`,
      title: "Takbīrat al-Iḥrām",
      posture: POSTURES.STANDING,
      assetName: "pose_takbir_shia",
      instruction: `Raise both hands to the level of your ears with the palms facing the qiblah. As your hands reach their highest point, say the takbīr ${audible ? "aloud" : "softly to yourself"}. This is the takbīr of consecration — the formal entry into prayer.`,
      recitation: R.takbirOpening,
      recitationNote: "Recited once. Obligatory — this is a pillar of the prayer.",
      tip: "Six additional takbīrs before the takbīrat al-iḥrām are recommended (mustaḥabb), with hands raised at each. This is known as takbīrāt al-iftitāḥ.",
      transition: "After the takbīr, lower your hands back to your sides.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §989–991. Seven takbīrs: al-Kāfī vol. 3, ḥadīth 311.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r1-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}. Begin with the basmalah (which is the first verse of the sūrah in the Shia tradition${audible ? " and is always recited aloud in audible prayers" : ""}). Continue through all seven verses, pausing briefly at each verse ending.`,
      recitation: R.fatiha,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Obligatory in the first two rakahs.`,
      tip: "The basmalah is counted as part of Al-Fātiḥah.",
      transition: "After Al-Fātiḥah, recite a second complete sūrah.",
      source: "Qurʾan 1:1–7. Sistani, Tawḍīḥ al-Masāʾil §993.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r1-surah`,
      title: "Second Sūrah — Al-Ikhlāṣ",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: `After Al-Fātiḥah, recite a complete second sūrah ${audible ? "audibly" : "silently"}. The Shia tradition requires that a full sūrah be recited — beginning with its basmalah and ending at its conclusion — not just a portion.`,
      recitation: R.ikhlas,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. The complete sūrah is obligatory in the first two rakahs — a partial recitation is not sufficient.`,
      tip: "The complete-sūrah requirement is distinctive to the Shia tradition.",
      transition: "After completing the sūrah, prepare to bow into rukūʿ.",
      source: "Qurʾan 112:1–4. Sistani, Tawḍīḥ al-Masāʾil §1005.",
      madhhabNote: null,
    },
    shiaRukuStep(prayer, 1),
    shiaIitidalStep(prayer, 1),
    shiaSujud1Step(prayer, 1, true),
    shiaJalsaStep(prayer, 1),
    shiaSujud2Step(prayer, 1),
  ];
}

function shiaRakah2(prayer, audible) {
  return [
    {
      id: `${prayer}-r2-qiyam`,
      title: "Standing for the Second Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: "Rise to a standing position saying 'Allāhu Akbar', with arms naturally at the sides.",
      recitation: null,
      recitationNote: null,
      tip: "While rising, it is recommended to say 'bi-ḥawli-llāhi wa quwwatihī aqūmu wa aqʿud' — 'By the power and strength of Allah I stand and sit'.",
      transition: "Begin Al-Fātiḥah directly.",
      source: "Mafātīḥ al-Jinān.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r2-fatiha`,
      title: "Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: `Recite Al-Fātiḥah ${audible ? "audibly" : "silently"}, beginning with the basmalah and proceeding through all seven verses.`,
      recitation: R.fatiha,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Obligatory.`,
      tip: "Maintain the same voice level as in the first rakah.",
      transition: "After Al-Fātiḥah, recite a second complete sūrah.",
      source: "Qurʾan 1:1–7.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r2-surah`,
      title: "Second Sūrah — Al-Ikhlāṣ",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: `Recite a complete second sūrah ${audible ? "audibly" : "silently"}. Many follow Al-Ikhlāṣ in the first rakah with Sūrat al-Qadr in the second — though Al-Ikhlāṣ in both is also valid.`,
      recitation: R.ikhlas,
      recitationNote: `Recited ${audible ? "audibly" : "silently"}. Complete sūrah is obligatory.`,
      tip: null,
      transition: "After the sūrah, prepare for qunūt before going into rukūʿ.",
      source: "Qurʾan 112:1–4.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r2-qunut`,
      title: "Du'a",
      posture: POSTURES.STANDING,
      assetName: "pose_qunut",
      instruction: "Before bowing into rukūʿ, raise both hands palms-up to the level of your face, fingers held together, and recite the du'a. The simplest valid form is Rabbanā ātinā (Qurʾan 2:201) followed by ṣalawāt on Muḥammad and his family. Longer du'as and personal supplications may be added.",
      recitation: R.qunutShia,
      recitationNote: "Strongly recommended (mustaḥabb muʾakkad) in every prayer's second rakah, before rukūʿ. Not obligatory — the prayer remains valid if omitted.",
      tip: "Du'a may be recited in any language with personal supplication, though Arabic forms are most rewarded.",
      transition: "After du'a, lower your hands and say 'Allāhu Akbar' as you bow.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §1116–1119. al-Kāfī vol. 3, ch. on qunūt.",
      madhhabNote: null,
    },
    shiaRukuStep(prayer, 2),
    shiaIitidalStep(prayer, 2),
    shiaSujud1Step(prayer, 2, false),
    shiaJalsaStep(prayer, 2),
    shiaSujud2Step(prayer, 2),
    {
      id: `${prayer}-r2-first-tashahhud`,
      title: "First Tashahhud",
      posture: POSTURES.KNEELING,
      assetName: "pose_tashahhud_shia",
      instruction: "Sit in the mutawarrik posture — on the left thigh, both feet to the right, right foot resting on the sole of the left. Place your hands palms-down on your thighs. Recite the Shia form of the tashahhud, which includes the testimony of faith and the ṣalawāt upon Muḥammad and his family. This first tashahhud has no salām — the prayer continues into the third rakah.",
      recitation: R.tashahhudShia,
      recitationNote: "Recited silently. Obligatory in the sitting after the second rakah.",
      tip: "Sending blessings on the Prophet and his family is part of the tashahhud itself in Shia practice.",
      transition: "Say 'Allāhu Akbar' and rise to standing for the third rakah.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §1126; al-Kāfī vol. 3, ch. on tashahhud.",
      madhhabNote: null,
    },
  ];
}

function shiaRakah3(prayer) {
  return [
    {
      id: `${prayer}-r3-qiyam`,
      title: "Standing for the Third Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: "Rise from the first tashahhud saying 'Allāhu Akbar'. Stand upright with arms at your sides. In the third and fourth rakahs, the recitation is Tasbīḥāt al-Arbaʿa — the Four Praises — recited silently.",
      recitation: null,
      recitationNote: null,
      tip: "From this rakah onward, recitation is silent regardless of the prayer type.",
      transition: "Recite the Tasbīḥāt al-Arbaʿa three times.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §1003.",
      madhhabNote: null,
    },
    {
      id: `${prayer}-r3-recitation`,
      title: "Tasbīḥāt al-Arbaʿa",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: "Recite Tasbīḥāt al-Arbaʿa — the Four Praises — three times silently. This is the standard recitation in the third and fourth rakahs of every obligatory four-rakah prayer in the Shia tradition.",
      recitation: R.tasbihatAlArbaa,
      recitationNote: "Recited three times silently. Obligatory.",
      tip: null,
      transition: "After completing the recitation, say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §1003. al-Kāfī vol. 3.",
      madhhabNote: null,
    },
    shiaRukuStep(prayer, 3),
    shiaIitidalStep(prayer, 3),
    shiaSujud1Step(prayer, 3, false),
    shiaJalsaStep(prayer, 3),
    shiaSujud2Step(prayer, 3),
  ];
}

function shiaRakah4(prayer) {
  return [
    {
      id: `${prayer}-r4-qiyam`,
      title: "Standing for the Fourth Rakah",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: "Rise saying 'Allāhu Akbar' and stand upright with arms at your sides. This is the final rakah.",
      recitation: null,
      recitationNote: null,
      tip: null,
      transition: "Recite the Tasbīḥāt al-Arbaʿa three times, as in the third rakah.",
      source: null,
      madhhabNote: null,
    },
    {
      id: `${prayer}-r4-recitation`,
      title: "Tasbīḥāt al-Arbaʿa",
      posture: POSTURES.STANDING,
      assetName: "pose_qiyam_shia",
      instruction: "Recite Tasbīḥāt al-Arbaʿa three times silently, as in the third rakah.",
      recitation: R.tasbihatAlArbaa,
      recitationNote: "Recited three times silently. Obligatory.",
      tip: null,
      transition: "Say 'Allāhu Akbar' and bow into rukūʿ.",
      source: "Sistani, Tawḍīḥ al-Masāʾil §1003.",
      madhhabNote: null,
    },
    shiaRukuStep(prayer, 4),
    shiaIitidalStep(prayer, 4),
    shiaSujud1Step(prayer, 4, true),
    shiaJalsaStep(prayer, 4),
    shiaSujud2Step(prayer, 4),
    {
      id: `${prayer}-r4-tashahhud`,
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
    },
    {
      id: `${prayer}-r4-closing-sequence`,
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
      id: `${prayer}-r4-salam`,
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

// ─── Shia shared movement steps ──────────────────────────────────────────────

function shiaRukuStep(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: "Say 'Allāhu Akbar' and bow forward, placing your hands on your knees with fingers spread. The back is flat, the head aligned with the back. Once settled, recite the tasbīḥ of rukūʿ — three times of the short form or once of the longer.",
    recitation: R.tasbihRuku,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory to recite at least once.",
    tip: "Calmness (ṭumaʾnīna) in rukūʿ is obligatory. Do not begin the tasbīḥ until your body has fully settled.",
    transition: "Rise to the standing position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  };
}

function shiaIitidalStep(prayer, rakah) {
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

function shiaSujud1Step(prayer, rakah, addDuaTip) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate. The forehead must rest on the turbah (a clay tablet ideally from the earth of Karbalāʾ). The other six points of contact — both palms, both knees, and the big toes of both feet — rest on the ground. Once settled, recite the tasbīḥ of sujūd: three times of the short form or once of the longer.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long. Obligatory to recite at least once.",
    tip: addDuaTip
      ? "If no turbah is available, prostrate on something earthen or plant-based that is not eaten or worn — paper, a leaf, unprocessed wood, or natural stone. Prostration on cloth or carpet is not valid in the Shia tradition."
      : null,
    transition: "Rise to the seated position between the two prostrations.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067 (places of sujūd), §1075–1080 (turbah).",
    madhhabNote: null,
  };
}

function shiaJalsaStep(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: "Rise from the first sujūd to a brief seated position. Sit in the mutawarrik posture — on your left thigh, with both feet passed to the right side, the right foot resting on the sole of the left. Place your hands palms-down on your thighs. Settle calmly before descending into the second prostration.",
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended. Calmness in the sitting is obligatory.",
    tip: "The mutawarrik sitting on the left thigh is the standard Shia posture in the sitting positions.",
    transition: "Say 'Allāhu Akbar' and descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  };
}

function shiaSujud2Step(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah, with all seven points of contact as before. Recite the tasbīḥ at least three more times.",
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: rakah === 4 ? "Rise to the seated position for the final tashahhud." : (rakah === 2 ? "Rise to the seated position for the first tashahhud." : "Rise to the standing position for the next rakah."),
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// PRAYER BUILDERS
// ═════════════════════════════════════════════════════════════════════════════

function buildPrayer(id, name, arabicName, subtitle, summary, audible) {
  return {
    id,
    name,
    arabicName,
    subtitle,
    rakahCount: 4,
    category: "obligatory",
    tradition: "both",
    summary,
    draftNotice: "DRAFT — Full instructional rewrite. Requires scholar review before merging into the live app. Sources cited per step.",
    rakahs: [
      { number: 1, stepsSunni: sunniRakah1(id, name, audible), stepsShia: shiaRakah1(id, name, audible) },
      { number: 2, stepsSunni: sunniRakah2(id, audible),       stepsShia: shiaRakah2(id, audible) },
      { number: 3, stepsSunni: sunniRakah3(id),                stepsShia: shiaRakah3(id) },
      { number: 4, stepsSunni: sunniRakah4(id),                stepsShia: shiaRakah4(id) },
    ],
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

export const dhuhrDraft = buildPrayer(
  "dhuhr",
  "Dhuhr",
  "الظهر",
  "Midday prayer",
  "Four rakahs prayed silently after the sun has passed its zenith.",
  false, // silent in all rakahs
);

export const asrDraft = buildPrayer(
  "asr",
  "Asr",
  "العصر",
  "Afternoon prayer",
  "Four rakahs prayed silently in the afternoon.",
  false, // silent in all rakahs
);

export const ishaDraft = buildPrayer(
  "isha",
  "Isha",
  "العشاء",
  "Night prayer",
  "Four rakahs prayed at night; the first two audible, the last two silent.",
  true, // audible in rakahs 1-2 (silent in 3-4 always)
);
