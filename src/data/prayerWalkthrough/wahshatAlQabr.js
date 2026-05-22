// src/data/prayerWalkthrough/wahshatAlQabr.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Waḥshat al-Qabr — Prayer for the loneliness of the grave
//
// Prayed on the first night after burial, on behalf of the deceased.
// Shia tradition only.
//
// 2 rakahs (Hassan's spec):
//   r1: al-Fātiḥah + Āyat al-Kursī (2:255–257) — embedded inline
//   r2: al-Fātiḥah + al-Qadr (Q97) recited 10 times
//
// After salām, recite: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad,
// wa-bʿath thawābahā ilā qabri [name of deceased]."
//
// ⚠️ DRAFT — Scholar review required.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "./recitations";
import {
  shiaTakbir, shiaFatiha, shiaRuku, shiaIitidal,
  shiaSujud1, shiaJalsa, shiaSujud2, shiaQiyamMid,
  shiaFinalTashahhud, shiaSalam, POSTURES,
} from "./instructions_drafts/_sharedShia";

const P = "wahshatAlQabr";

// ─── Inline recitations ─────────────────────────────────────────────────────

const ayatAlKursi = {
  arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ۝ لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ فَمَن يَكْفُرْ بِالطَّاغُوتِ وَيُؤْمِن بِاللَّهِ فَقَدِ اسْتَمْسَكَ بِالْعُرْوَةِ الْوُثْقَىٰ لَا انفِصَامَ لَهَا ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ ۝ اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ ۖ وَالَّذِينَ كَفَرُوا أَوْلِيَاؤُهُمُ الطَّاغُوتُ يُخْرِجُونَهُم مِّنَ النُّورِ إِلَى الظُّلُمَاتِ ۗ أُولَٰئِكَ أَصْحَابُ النَّارِ ۖ هُمْ فِيهَا خَالِدُونَ",
  transliteration: "Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūm, lā taʾkhudhuhū sinatun wa lā nawm, lahū mā fī s-samāwāti wa mā fī l-arḍ — man dhā lladhī yashfaʿu ʿindahū illā bi-idhnih, yaʿlamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bi-mā shāʾ, wasiʿa kursiyyuhū s-samāwāti wa l-arḍ, wa lā yaʾūduhū ḥifẓuhumā, wa huwa l-ʿaliyyu l-ʿaẓīm. Lā ikrāha fī d-dīn, qad tabayyana r-rushdu mina l-ghayy, fa-man yakfur bi-ṭ-ṭāghūti wa yuʾmin bi-llāhi fa-qadi stamsaka bi-l-ʿurwati l-wuthqā lā nfiṣāma lahā, wa-llāhu samīʿun ʿalīm. Allāhu waliyyu lladhīna āmanū yukhrijuhum mina ẓ-ẓulumāti ilā n-nūr, wa-lladhīna kafarū awliyāʾuhumu ṭ-ṭāghūt yukhrijūnahum mina n-nūri ilā ẓ-ẓulumāt, ulāʾika aṣḥābu n-nār, hum fīhā khālidūn.",
  translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass nothing of His knowledge except for what He wills. His Kursī extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great. (2:255) There shall be no compulsion in religion; the right way has indeed become distinct from error. So whoever rejects false gods and believes in Allah has grasped the most trustworthy handhold, which never breaks. And Allah is Hearing and Knowing. (2:256) Allah is the Protector of those who have faith; from the depths of darkness He leads them into the light. As to those who reject faith, their patrons are the false gods who lead them from light into the depths of darkness. They will be companions of the Fire, to dwell therein forever. (2:257)",
  reference: "Qur'an 2:255–257 (Āyat al-Kursī and the two verses following).",
  audioId: null,
};

// ─── Steps ──────────────────────────────────────────────────────────────────

const qiyamIntention = {
  id: `${P}-r1-qiyam`,
  title: "Standing & Intention",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_shia",
  instruction: "Stand upright facing the qiblah, arms at the sides. Form the intention silently in your heart: 'I am praying two rakahs of Ṣalāt Waḥshat al-Qabr on behalf of [name of the deceased], qurbatan ilā-llāh — seeking nearness to Allah.'",
  recitation: null,
  recitationNote: null,
  tip: "This prayer is offered on the first night after burial. Its reward is dedicated to the deceased to comfort them in the loneliness of the grave.",
  transition: "Raise both hands for takbīrat al-iḥrām.",
  source: "Mafātīḥ al-Jinān; al-Kāfī vol. 3.",
  madhhabNote: "Shia tradition only.",
};

const surahR1 = {
  id: `${P}-r1-surah`,
  title: "Āyat al-Kursī (2:255–257)",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_shia",
  instruction: "After al-Fātiḥah, recite Āyat al-Kursī together with the two verses that follow (2:255, 256, and 257). These verses affirm the lordship of Allah and the protection He grants the believers — a fitting consolation for the soul of the deceased.",
  recitation: ayatAlKursi,
  recitationNote: "Recited silently. The three verses 2:255–257 together.",
  tip: "Āyat al-Kursī alone is one verse (2:255); the prayer extends through verse 257.",
  transition: "After the verses, bow into rukūʿ.",
  source: "Mafātīḥ al-Jinān.",
  madhhabNote: null,
};

const surahR2 = {
  id: `${P}-r2-surah`,
  title: "Sūrat al-Qadr — Ten Times",
  posture: POSTURES.STANDING,
  assetName: "pose_qiyam_shia",
  instruction: "After al-Fātiḥah, recite the complete Sūrat al-Qadr (Q97) — ten times. The reward of this repeated recitation is dedicated to the deceased.",
  chapterId: 97,
  recitation: null,
  recitationNote: "Recited silently. Ten complete repetitions of the sūrah.",
  tip: "Maintain a steady pace; this is the heart of the prayer's reward for the deceased.",
  transition: "After the tenth recitation, bow into rukūʿ.",
  source: "Mafātīḥ al-Jinān; Miṣbāḥ al-Mutahajjid.",
  madhhabNote: null,
};

const closingDedication = {
  id: `${P}-dedication`,
  title: "Dedicate the Reward",
  posture: POSTURES.KNEELING,
  assetName: null,
  instruction: "After the salām, recite: 'Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad, wa-bʿath thawābahā ilā qabri [name of deceased]' — 'O Allah, send blessings on Muḥammad and the family of Muḥammad, and convey the reward of this prayer to the grave of [name].'",
  recitation: null,
  recitationNote: "Said silently with the name of the deceased.",
  tip: "This dedication is essential; it is what conveys the reward to the deceased.",
  transition: "The prayer is complete. May Allah ease the soul of the deceased.",
  source: "Mafātīḥ al-Jinān.",
  madhhabNote: null,
};

const rakah1 = [
  qiyamIntention,
  shiaTakbir(P),
  shiaFatiha(P, 1),
  surahR1,
  shiaRuku(P, 1),
  shiaIitidal(P, 1),
  shiaSujud1(P, 1),
  shiaJalsa(P, 1),
  shiaSujud2(P, 1, "Rise to standing for the second rakah."),
];

const rakah2 = [
  shiaQiyamMid(P, 2),
  shiaFatiha(P, 2),
  surahR2,
  shiaRuku(P, 2),
  shiaIitidal(P, 2),
  shiaSujud1(P, 2),
  shiaJalsa(P, 2),
  shiaSujud2(P, 2, "Rise to the seated position for the final tashahhud."),
  shiaFinalTashahhud(P, 2),
  shiaSalam(P, 2, "Now dedicate the reward of the prayer to the deceased."),
  closingDedication,
];

export const wahshatAlQabr = {
  id: "wahshatAlQabr",
  name: "Ṣalāt Waḥshat al-Qabr",
  arabicName: "صلاة وحشة القبر",
  subtitle: "Prayer for the loneliness of the grave",
  rakahCount: 2,
  category: "occasional",
  tradition: "shia",
  summary: "Two rakahs prayed on behalf of the recently deceased, traditionally on the first night after burial. Reward dedicated to the deceased to comfort their soul in the grave. Rakah 1: al-Fātiḥah + Āyat al-Kursī with the two following verses (2:255–257). Rakah 2: al-Fātiḥah + Sūrat al-Qadr recited ten times.",
  draftNotice: "DRAFT — Scholar review required.",
  rakahs: [
    { number: 1, stepsSunni: [], stepsShia: rakah1 },
    { number: 2, stepsSunni: [], stepsShia: rakah2 },
  ],
};
