// src/data/prayerWalkthrough/instructions_drafts/_sharedShia.js
// ─────────────────────────────────────────────────────────────────────────────
// Shared Shia step factories used by batch 7 prayer drafts:
//   salatAlTasbih, jafarAtTayyar, salatAlAyat, laylatAlQadr, wahshatAlQabr.
//
// Each factory returns a single step object. Steps follow the established
// pattern: { id, title, posture, assetName, instruction, recitation,
//            recitationNote, tip, transition, source, madhhabNote, ... }.
//
// chapterId is supported on sūrah steps to render the sūrah from the in-app
// Qur'an (handled by QuranInlineSurah).
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";

export const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

export function shiaQiyamIntention(prayer, prayerName, rakahPhrase, extraTip) {
  return {
    id: `${prayer}-r1-qiyam`,
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Stand upright facing the qiblah with arms naturally at the sides. Form the intention silently in your heart: 'I am praying ${rakahPhrase} of ${prayerName}, qurbatan ilā-llāh — seeking nearness to Allah.'`,
    recitation: null,
    recitationNote: null,
    tip: extraTip || null,
    transition: "Raise both hands to begin the prayer.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §942–943.",
    madhhabNote: "Hands rest at the sides throughout qiyām.",
  };
}

export function shiaTakbir(prayer) {
  return {
    id: `${prayer}-r1-takbir`,
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_shia",
    instruction: "Raise both hands to the level of your ears, palms facing the qiblah. Say 'Allāhu Akbar' to yourself. Then lower your hands back to your sides.",
    recitation: R.takbirOpening,
    recitationNote: "Recited once. Obligatory.",
    tip: null,
    transition: "Begin al-Fātiḥah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §989–991.",
    madhhabNote: null,
  };
}

export function shiaFatiha(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Recite al-Fātiḥah silently, beginning with the basmalah (the first verse).",
    recitation: R.fatiha,
    recitationNote: "Recited silently. Obligatory.",
    tip: null,
    transition: "After al-Fātiḥah, recite the recommended sūrah.",
    source: "Qur'an 1; Sistani, Tawḍīḥ al-Masāʾil §993.",
    madhhabNote: null,
  };
}

export function shiaSurahFromQuran(prayer, rakah, chapterId, surahName, extraTip) {
  return {
    id: `${prayer}-r${rakah}-surah`,
    title: `Sūrat ${surahName}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Recite the complete Sūrat ${surahName} silently.`,
    chapterId,
    recitation: null,
    recitationNote: "Recited silently. The complete sūrah.",
    tip: extraTip || null,
    transition: "After the sūrah, prepare to bow into rukūʿ.",
    source: `Qur'an ${chapterId}.`,
    madhhabNote: null,
  };
}

export function shiaRuku(prayer, rakah, extraInstruction, extraRecitationNote) {
  return {
    id: `${prayer}-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_shia",
    instruction: `Say 'Allāhu Akbar' and bow forward, placing your hands on your knees with fingers spread. The back is flat. Recite the tasbīḥ of rukūʿ.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihRuku,
    recitationNote: extraRecitationNote || "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the standing position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1042–1058.",
    madhhabNote: null,
  };
}

export function shiaIitidal(prayer, rakah, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: `Rise to a fully upright standing position. It is recommended to say 'Samiʿa-llāhu liman ḥamidah' as you rise.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.samiAllah,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to sujūd.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

export function shiaSujud1(prayer, rakah, extraInstruction, extraRecitationNote) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: `Prostrate with the forehead on the turbah and the other six points (palms, knees, big toes) on the ground. Recite the tasbīḥ of sujūd.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihSujud,
    recitationNote: extraRecitationNote || "Three repetitions of the short tasbīḥ, or one of the long.",
    tip: null,
    transition: "Rise to the seated position.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1067.",
    madhhabNote: null,
  };
}

export function shiaJalsa(prayer, rakah, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_shia",
    instruction: `Sit briefly in the mutawarrik posture — on the left thigh with both feet to the right. Hands palms-down on the thighs.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to the second prostration.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1100.",
    madhhabNote: null,
  };
}

export function shiaSujud2(prayer, rakah, transition, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration on the Turbah",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_shia",
    instruction: `Prostrate again on the turbah. Recite the tasbīḥ of sujūd.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions of the short tasbīḥ.",
    tip: null,
    transition: transition || "Rise to standing for the next rakah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1065.",
    madhhabNote: null,
  };
}

export function shiaQiyamMid(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-qiyam`,
    title: `Standing for Rakah ${rakah}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_shia",
    instruction: "Rise to standing, saying 'Allāhu Akbar'. Arms remain at the sides.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "Begin al-Fātiḥah.",
    source: "Sistani, Tawḍīḥ al-Masāʾil §1059.",
    madhhabNote: null,
  };
}

export function shiaFinalTashahhud(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-tashahhud`,
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

export function shiaSalam(prayer, rakah, transition) {
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

// ─── Sunni equivalents (used by the two "both" prayers in batch 7) ──────────

export function sunniQiyamIntention(prayer, prayerName, rakahPhrase, extraTip) {
  return {
    id: `${prayer}-r1-qiyam`,
    title: "Standing — Qiyām",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `Stand upright facing the qiblah. Form the intention silently: 'I intend to pray ${rakahPhrase} of ${prayerName}, for the sake of Allah.'`,
    recitation: null,
    recitationNote: null,
    tip: extraTip || null,
    transition: "Raise both hands for takbīrat al-iḥrām.",
    source: "Ṣaḥīḥ al-Bukhārī 1.",
    madhhabNote: null,
  };
}

export function sunniTakbir(prayer) {
  return {
    id: `${prayer}-r1-takbir`,
    title: "Takbīrat al-Iḥrām",
    posture: POSTURES.STANDING,
    assetName: "pose_takbir_sunni",
    instruction: "Raise both hands to the level of your ears, say 'Allāhu Akbar', then fold the right hand over the left on or just above the navel.",
    recitation: R.takbirOpening,
    recitationNote: "Said once.",
    tip: null,
    transition: "Begin al-Fātiḥah.",
    source: "Ṣaḥīḥ al-Bukhārī 735.",
    madhhabNote: null,
  };
}

export function sunniFatiha(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-fatiha`,
    title: "Al-Fātiḥah",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Recite al-Fātiḥah silently. Say 'āmīn' at the end.",
    recitation: R.fatiha,
    recitationNote: "Recited silently in voluntary night prayers.",
    tip: null,
    transition: "Recite the sūrah after al-Fātiḥah.",
    source: "Ṣaḥīḥ al-Bukhārī 756.",
    madhhabNote: null,
  };
}

export function sunniSurahFromQuran(prayer, rakah, chapterId, surahName, extraTip) {
  return {
    id: `${prayer}-r${rakah}-surah`,
    title: `Sūrat ${surahName}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `Recite the complete Sūrat ${surahName} silently.`,
    chapterId,
    recitation: null,
    recitationNote: "Recited silently.",
    tip: extraTip || null,
    transition: "Bow into rukūʿ.",
    source: `Qur'an ${chapterId}.`,
    madhhabNote: null,
  };
}

export function sunniRuku(prayer, rakah, extraInstruction, extraRecitationNote) {
  return {
    id: `${prayer}-r${rakah}-ruku`,
    title: "Bowing — Rukūʿ",
    posture: POSTURES.BOWING,
    assetName: "pose_ruku_sunni",
    instruction: `Say 'Allāhu Akbar' and bow. Hands on knees, back flat. Recite the tasbīḥ of rukūʿ.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihRuku,
    recitationNote: extraRecitationNote || "Three repetitions silently.",
    tip: null,
    transition: "Rise to standing.",
    source: "Ṣaḥīḥ al-Bukhārī 794.",
    madhhabNote: null,
  };
}

export function sunniIitidal(prayer, rakah, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-iitidal`,
    title: "Rising from Rukūʿ",
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: `Rise to a fully upright standing position. Say 'samiʿa-llāhu liman ḥamidah; rabbanā laka l-ḥamd' silently.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.samiAllah,
    recitationNote: "Said silently.",
    tip: null,
    transition: "Descend to sujūd.",
    source: "Ṣaḥīḥ al-Bukhārī 795.",
    madhhabNote: null,
  };
}

export function sunniSujud1(prayer, rakah, extraInstruction, extraRecitationNote) {
  return {
    id: `${prayer}-r${rakah}-sujud-1`,
    title: "First Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: `Prostrate with seven points touching the ground: forehead and nose, both palms, both knees, toes of both feet. Recite the tasbīḥ of sujūd.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihSujud,
    recitationNote: extraRecitationNote || "Three repetitions silently.",
    tip: null,
    transition: "Rise to the seated position.",
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

export function sunniJalsa(prayer, rakah, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-jalsa`,
    title: "Sitting Between Prostrations",
    posture: POSTURES.KNEELING,
    assetName: "pose_julus_sunni",
    instruction: `Sit briefly on the left foot with the right foot upright. Hands palms-down on the thighs.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.dhikrJalsa,
    recitationNote: "Recommended.",
    tip: null,
    transition: "Descend to the second prostration.",
    source: "Ṣaḥīḥ al-Bukhārī 824.",
    madhhabNote: null,
  };
}

export function sunniSujud2(prayer, rakah, transition, extraInstruction) {
  return {
    id: `${prayer}-r${rakah}-sujud-2`,
    title: "Second Prostration",
    posture: POSTURES.PROSTRATING,
    assetName: "pose_sujood_sunni",
    instruction: `Prostrate again. Recite the tasbīḥ silently.${extraInstruction ? " " + extraInstruction : ""}`,
    recitation: R.tasbihSujud,
    recitationNote: "Three repetitions silently.",
    tip: null,
    transition: transition || "Rise to standing for the next rakah.",
    source: "Ṣaḥīḥ Muslim 482.",
    madhhabNote: null,
  };
}

export function sunniQiyamMid(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-qiyam`,
    title: `Standing for Rakah ${rakah}`,
    posture: POSTURES.STANDING,
    assetName: "pose_qiyam_sunni",
    instruction: "Rise to standing, saying 'Allāhu Akbar' silently. Fold the right hand over the left.",
    recitation: null,
    recitationNote: null,
    tip: null,
    transition: "Begin al-Fātiḥah.",
    source: "Ṣaḥīḥ al-Bukhārī 803.",
    madhhabNote: null,
  };
}

export function sunniFinalTashahhud(prayer, rakah) {
  return {
    id: `${prayer}-r${rakah}-tashahhud`,
    title: "Final Tashahhud",
    posture: POSTURES.KNEELING,
    assetName: "pose_tashahhud_sunni",
    instruction: "Sit in the tawarruk posture. Recite the tashahhud silently, raise the right index finger at the shahādah, then send ṣalawāt on the Prophet ﷺ.",
    recitation: R.tashahhudSunni,
    recitationNote: "Recited silently.",
    tip: null,
    transition: "Give the salām.",
    source: "Ṣaḥīḥ al-Bukhārī 831.",
    madhhabNote: null,
  };
}

export function sunniSalam(prayer, rakah, transition) {
  return {
    id: `${prayer}-r${rakah}-salam`,
    title: "Closing Salām",
    posture: POSTURES.KNEELING,
    assetName: "pose_salam_sunni",
    instruction: "Turn the head to the right and say 'As-salāmu ʿalaykum wa raḥmatu-llāh'. Then turn left and repeat.",
    recitation: R.salam,
    recitationNote: "Said audibly to the right, then to the left.",
    tip: null,
    transition: transition || "The prayer is complete.",
    source: "Ṣaḥīḥ Muslim 582.",
    madhhabNote: null,
  };
}
