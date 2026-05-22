// src/data/prayerWalkthrough/instructions_drafts/janazah.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt al-Janāzah — Funeral prayer
//
// A communal obligation (farḍ kifāyah) prayed standing for the deceased.
// No rukūʿ, no sujūd, no tashahhud sitting — all takbīrs given standing.
//
//   Sunni (4 takbīrs):
//     1. Takbīrat al-iḥrām → al-Fātiḥah ONLY (no sūrah after)
//     2. Ṣalawāt on the Prophet ﷺ (the Ibrāhīmī ṣalawāt)
//     3. Du'a for the deceased
//     4. Brief closing du'a for the deceased and believers, then salām
//
//   Shia (5 takbīrs):
//     1. Takbīrat al-iḥrām → shahādatān (testimony of faith)
//     2. Ṣalawāt on Muḥammad and his family
//     3. Du'a for the believing men and women
//     4. Du'a for the deceased
//     5. Final takbīr → salām
//
// Per Hassan's spec: NO sūrah after al-Fātiḥah in Janāzah (Sunni only — Shia
// doesn't recite al-Fātiḥah in Janāzah; the rakah is built on the takbīrs and
// du'as alone).
//
// ⚠️ DRAFT — Scholar review required before shipping.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "../recitations";

const POSTURES = {
  STANDING:    "standing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ═════════════════════════════════════════════════════════════════════════════
// SHIA JANĀZAH RECITATIONS
// ═════════════════════════════════════════════════════════════════════════════

const shiaShahadatan = {
  arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ، أَرْسَلَهُ بِالْحَقِّ بَشِيراً وَنَذِيراً بَيْنَ يَدَيِ السَّاعَةِ",
  transliteration: "Ash-hadu an lā ilāha illa-llāhu waḥdahū lā sharīka lah, wa ash-hadu anna Muḥammadan ʿabduhū wa rasūluh — arsalahū bi-l-ḥaqqi bashīran wa nadhīran bayna yaday s-sāʿah.",
  translation: "I bear witness that there is no god but Allah, alone with no partner, and I bear witness that Muḥammad is His servant and messenger — He sent him with the truth as a bearer of glad tidings and a warner before the Hour.",
  reference: "al-Kāfī vol. 3 — Book of the Funeral.",
  audioId: null,
};

const shiaSalawatJanazah = {
  arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَارْحَمْ مُحَمَّداً وَآلَ مُحَمَّدٍ، كَأَفْضَلِ مَا صَلَّيْتَ وَبَارَكْتَ وَرَحِمْتَ عَلَىٰ إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad, wa bārik ʿalā Muḥammadin wa āli Muḥammad, wa rḥam Muḥammadan wa āla Muḥammad, ka-afḍali mā ṣallayta wa bārakta wa raḥimta ʿalā Ibrāhīma wa āli Ibrāhīm, innaka ḥamīdun majīd.",
  translation: "O Allah, send blessings upon Muḥammad and the family of Muḥammad, bless Muḥammad and the family of Muḥammad, and have mercy upon Muḥammad and the family of Muḥammad — as the most excellent of blessings, prosperity, and mercy You have bestowed upon Ibrāhīm and the family of Ibrāhīm. Indeed You are the Praiseworthy, the Glorious.",
  reference: "Mafātīḥ al-Jinān; al-Kāfī vol. 3.",
  audioId: null,
};

const shiaDuaForBelievers = {
  arabic: "اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ، تَابِعْ بَيْنَنَا وَبَيْنَهُمْ بِالْخَيْرَاتِ، إِنَّكَ مُجِيبُ الدَّعَوَاتِ، إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "Allāhumma ghfir li-l-muʾminīna wa l-muʾmināt, wa l-muslimīna wa l-muslimāt, al-aḥyāʾi minhum wa l-amwāt, tābiʿ baynanā wa baynahum bi-l-khayrāt — innaka mujību d-daʿawāt, innaka ʿalā kulli shayʾin qadīr.",
  translation: "O Allah, forgive the believing men and women, and the Muslim men and women — the living among them and the dead. Continue between us and them with goodness. Indeed You are the Answerer of supplications, indeed You are over all things capable.",
  reference: "Mafātīḥ al-Jinān; al-Kāfī vol. 3.",
  audioId: null,
};

const shiaDuaForDeceased = {
  arabic: "اللَّهُمَّ إِنَّ هَٰذَا عَبْدُكَ وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَزَلَ بِكَ وَأَنْتَ خَيْرُ مَنْزُولٍ بِهِ، اللَّهُمَّ إِنَّا لَا نَعْلَمُ مِنْهُ إِلَّا خَيْراً، وَأَنْتَ أَعْلَمُ بِهِ مِنَّا، اللَّهُمَّ إِنْ كَانَ مُحْسِناً فَزِدْ فِي إِحْسَانِهِ، وَإِنْ كَانَ مُسِيئاً فَتَجَاوَزْ عَنْهُ وَاغْفِرْ لَهُ",
  transliteration: "Allāhumma inna hādhā ʿabduka wa-bnu ʿabdika wa-bnu amatika — nazala bika wa anta khayru manzūlin bih. Allāhumma innā lā naʿlamu minhu illā khayrā, wa anta aʿlamu bihī minnā. Allāhumma in kāna muḥsinan fa-zid fī iḥsānih, wa in kāna musīʾan fa-tajāwaz ʿanhu wa-ghfir lah.",
  translation: "O Allah, this is Your servant, the son of Your servant and the son of Your maidservant. He has come to You, and You are the best to be approached. O Allah, we know nothing of him but good, and You know him better than we do. O Allah, if he was a doer of good, then increase his good; if he was a wrongdoer, then overlook his sins and forgive him.",
  reference: "Mafātīḥ al-Jinān (with masculine pronouns; substitute feminine for a woman).",
  audioId: null,
};

// ═════════════════════════════════════════════════════════════════════════════
// SUNNI STEPS
// ═════════════════════════════════════════════════════════════════════════════

const sunniQiyamIntention = {
  id: "janazah-r1-qiyam",
  title: "Standing & Intention",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_sunni",
  instruction: "Stand facing the qiblah with the deceased before you — the imām positioned level with the deceased's head (for a man) or middle (for a woman). Form the silent intention to pray ṣalāt al-janāzah for this person.",
  recitation: null,
  recitationNote: null,
  tip: "The deceased is placed between the imām and the qiblah. The prayer is performed entirely while standing.",
  transition: "Raise both hands for the first takbīr.",
  source: "Ṣaḥīḥ al-Bukhārī 1332; Sunan Abī Dāwūd 3194.",
  madhhabNote: null,
};

const sunniTakbir1 = {
  id: "janazah-takbir-1-sunni",
  title: "Takbīr 1 — Al-Fātiḥah",
  posture: POSTURES.STANDING,
  assetName: "pose_takbir_sunni",
  instruction: "Raise both hands to the level of the ears and say 'Allāhu Akbar'. Then fold the right hand over the left on or just above the navel. Recite al-Fātiḥah silently. There is no sūrah after al-Fātiḥah in Janāzah.",
  recitation: R.fatiha,
  recitationNote: "Recited silently. Only al-Fātiḥah — no additional sūrah.",
  tip: "Al-Fātiḥah is the only Qur'anic recitation in Janāzah.",
  transition: "After al-Fātiḥah, say the second takbīr.",
  source: "Ṣaḥīḥ al-Bukhārī 1335 (Ibn ʿAbbās: 'It is the sunnah to recite al-Fātiḥah in the Janāzah prayer').",
  madhhabNote: null,
};

const sunniTakbir2 = {
  id: "janazah-takbir-2-sunni",
  title: "Takbīr 2 — Ṣalawāt on the Prophet ﷺ",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' (some schools raise the hands at each takbīr; others only at the first — both positions are valid). Recite the Ibrāhīmī ṣalawāt silently — the same ṣalawāt recited in the regular tashahhud.",
  recitation: R.salawat || R.janazahSalawat,
  recitationNote: "Recited silently.",
  tip: null,
  transition: "After the ṣalawāt, say the third takbīr.",
  source: "Sunan Abī Dāwūd 3199.",
  madhhabNote: "Some Sunni schools raise the hands at every takbīr in Janāzah; others only at the first.",
};

const sunniTakbir3 = {
  id: "janazah-takbir-3-sunni",
  title: "Takbīr 3 — Du'a for the Deceased",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' and make du'a for the deceased silently. Use the masculine ('lahū'), feminine ('lahā'), or plural ('lahum') form appropriate to the deceased.",
  recitation: R.janazahDuaForDeceased,
  recitationNote: "Recited silently. Adjust pronouns for gender or number.",
  tip: "If the deceased is female, change 'lahū' to 'lahā'. For multiple deceased, use 'lahum'.",
  transition: "After the du'a, say the fourth and final takbīr.",
  source: "Sunan Abī Dāwūd 3201.",
  madhhabNote: null,
};

const sunniTakbir4 = {
  id: "janazah-takbir-4-sunni",
  title: "Takbīr 4 — Brief Closing Du'a",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' a fourth time and make a brief closing du'a for the deceased and for all the believers, silently. Then prepare for the closing salām.",
  recitation: R.janazahDuaClosing,
  recitationNote: "Recited silently. Brief and heartfelt.",
  tip: null,
  transition: "Give the salām to complete the prayer.",
  source: "Sunan Abī Dāwūd 3202.",
  madhhabNote: null,
};

const sunniSalam = {
  id: "janazah-salam-sunni",
  title: "Closing Salām",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Turn your head to the right and say 'As-salāmu ʿalaykum wa raḥmatu-llāh' audibly. Some schools turn left as well; others give a single salām while facing the qiblah. The prayer is complete.",
  recitation: R.salam,
  recitationNote: "Audibly to the right (and left in some schools).",
  tip: null,
  transition: "The funeral prayer is complete. Accompany the deceased to the burial.",
  source: "Ṣaḥīḥ Muslim 582 (general salām rules).",
  madhhabNote: "Janāzah has no rukūʿ, sujūd, or tashahhud sitting — it is entirely standing.",
};

// ═════════════════════════════════════════════════════════════════════════════
// SHIA STEPS
// ═════════════════════════════════════════════════════════════════════════════

const shiaQiyamIntention = {
  id: "janazah-r1-qiyam",
  title: "Standing & Intention",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_shia",
  instruction: "Stand facing the qiblah with the deceased before you. Form the silent intention: 'I am praying ṣalāt al-janāzah for this deceased Muslim, qurbatan ilā-llāh — seeking nearness to Allah.'",
  recitation: null,
  recitationNote: null,
  tip: "Shia Janāzah has FIVE takbīrs — one more than Sunni Janāzah. The prayer is built on takbīrs and du'as alone; there is no al-Fātiḥah, no rukūʿ, and no sujūd.",
  transition: "Raise both hands for the first takbīr.",
  source: "Sistani, Tawḍīḥ al-Masāʾil §615–625.",
  madhhabNote: "Shia Janāzah: 5 takbīrs. Each is followed by a specific recitation. There is no al-Fātiḥah.",
};

const shiaTakbir1 = {
  id: "janazah-takbir-1-shia",
  title: "Takbīr 1 — Shahādatān",
  posture: POSTURES.STANDING,
  assetName: "pose_takbir_shia",
  instruction: "Raise both hands to the level of the ears and say 'Allāhu Akbar'. Lower the hands. Then recite the shahādatān — the twin testimony that there is no god but Allah and that Muḥammad is His messenger.",
  recitation: shiaShahadatan,
  recitationNote: "Recited silently after the first takbīr.",
  tip: null,
  transition: "After the shahādatān, say the second takbīr.",
  source: "al-Kāfī vol. 3; Sistani, Tawḍīḥ al-Masāʾil §620.",
  madhhabNote: null,
};

const shiaTakbir2 = {
  id: "janazah-takbir-2-shia",
  title: "Takbīr 2 — Ṣalawāt on Muḥammad and his Family",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' a second time. Recite the ṣalawāt on the Prophet ﷺ and his family.",
  recitation: shiaSalawatJanazah,
  recitationNote: "Recited silently.",
  tip: "Sending blessings on the Prophet ﷺ and his family is central to Shia Janāzah, as in all Shia tashahhud.",
  transition: "After the ṣalawāt, say the third takbīr.",
  source: "Mafātīḥ al-Jinān; Sistani, Tawḍīḥ al-Masāʾil §620.",
  madhhabNote: null,
};

const shiaTakbir3 = {
  id: "janazah-takbir-3-shia",
  title: "Takbīr 3 — Du'a for the Believers",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' a third time. Recite the du'a for all the believing men and women, living and dead.",
  recitation: shiaDuaForBelievers,
  recitationNote: "Recited silently.",
  tip: null,
  transition: "After this du'a, say the fourth takbīr.",
  source: "al-Kāfī vol. 3; Sistani, Tawḍīḥ al-Masāʾil §620.",
  madhhabNote: null,
};

const shiaTakbir4 = {
  id: "janazah-takbir-4-shia",
  title: "Takbīr 4 — Du'a for the Deceased",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' a fourth time. Recite the du'a specifically for the deceased, using the masculine or feminine pronouns as appropriate.",
  recitation: shiaDuaForDeceased,
  recitationNote: "Recited silently. Adjust pronouns for the gender of the deceased.",
  tip: "Substitute 'amatuka' (Your maidservant) and feminine pronouns if the deceased is female.",
  transition: "After this du'a, say the fifth and final takbīr.",
  source: "Mafātīḥ al-Jinān; Sistani, Tawḍīḥ al-Masāʾil §620.",
  madhhabNote: null,
};

const shiaTakbir5 = {
  id: "janazah-takbir-5-shia",
  title: "Takbīr 5 — Final Takbīr",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "Say 'Allāhu Akbar' a fifth time. In the Shia tradition, the fifth takbīr completes the prayer — there is no further recitation after it. The prayer ends without a verbal salām, simply by stepping away after the final takbīr (some traditions still include a brief salām for completeness).",
  recitation: null,
  recitationNote: "No recitation follows the fifth takbīr in Shia Janāzah.",
  tip: "Unlike other prayers, Shia Janāzah does not end with the standard salām. The fifth takbīr concludes the rakah.",
  transition: "The funeral prayer is complete. Accompany the deceased to the burial.",
  source: "Sistani, Tawḍīḥ al-Masāʾil §620.",
  madhhabNote: "Shia Janāzah ends with the fifth takbīr — no closing salām in the standard form.",
};

// ═════════════════════════════════════════════════════════════════════════════
// ASSEMBLY
// ═════════════════════════════════════════════════════════════════════════════

const rakah1Sunni = [
  sunniQiyamIntention,
  sunniTakbir1,
  sunniTakbir2,
  sunniTakbir3,
  sunniTakbir4,
  sunniSalam,
];

const rakah1Shia = [
  shiaQiyamIntention,
  shiaTakbir1,
  shiaTakbir2,
  shiaTakbir3,
  shiaTakbir4,
  shiaTakbir5,
];

export const janazahDraft = {
  id: "janazah",
  name: "Ṣalāt al-Janāzah",
  arabicName: "صلاة الجنازة",
  subtitle: "Funeral prayer",
  rakahCount: 1,
  category: "occasional",
  tradition: "both",
  summary: "A communal obligation (farḍ kifāyah) prayed standing for the deceased. No rukūʿ, no sujūd. Sunni: 4 takbīrs (Fātiḥah → ṣalawāt → du'a for deceased → brief closing → salām). Shia: 5 takbīrs (shahādatān → ṣalawāt on Muḥammad and his family → du'a for believers → du'a for deceased → final takbīr).",
  draftNotice: "DRAFT — Scholar review required before shipping.",
  rakahs: [
    { number: 1, stepsSunni: rakah1Sunni, stepsShia: rakah1Shia },
  ],
};
