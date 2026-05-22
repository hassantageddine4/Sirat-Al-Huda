// src/data/prayerWalkthrough/wahshatAlQabr.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Waḥshat al-Qabr (Layla al-Dafn)
// "Prayer for the loneliness of the grave"
//
// A 2-rakah prayer recommended on the first night after a Muslim's burial,
// the merit of which is gifted to the deceased to ease them in the grave.
// Established practice in the Ja'farī (Shīʿa Imāmī) tradition.
//
// Structure:
//   Rakah 1: Hamd (al-Fātiḥah) + Āyat al-Kursī (Q 2:255) once
//   Rakah 2: Hamd (al-Fātiḥah) + Sūrat al-Qadr (Q 97) ten times
//   After salām: gift the reward to the deceased
//
// ⚠️ DRAFT — All content drawn from public Shia jurisprudence sources
// (al-islam.org, wikishia, Mafātīḥ al-Jinān). MUST be reviewed by a qualified
// Ja'farī scholar before being shipped to users.
// ─────────────────────────────────────────────────────────────────────────────

import { Step, POSTURES } from "./stepBuilders";
import * as R from "./recitations";

// ─── Inline recitations specific to this prayer ─────────────────────────────

// Āyat al-Kursī — Q 2:255
const ayatAlKursi = {
  arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  transliteration: "Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūm. Lā taʾkhudhuhū sinatun wa lā nawm. Lahū mā fī s-samāwāti wa mā fī l-arḍ. Man dhā lladhī yashfaʿu ʿindahū illā bi-idhnih. Yaʿlamu mā bayna aydīhim wa mā khalfahum. Wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bimā shāʾ. Wasiʿa kursiyyuhu s-samāwāti wa l-arḍ. Wa lā yaʾūduhū ḥifẓuhumā. Wa huwa l-ʿaliyyu l-ʿaẓīm.",
  translation: "Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  reference: "Qur'an 2:255",
  audioId: "ayat_al_kursi",
};

// Sūrat al-Qadr — Q 97
const suratAlQadr = {
  arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
  transliteration: "Innā anzalnāhu fī laylati l-qadr. Wa mā adrāka mā laylatu l-qadr. Laylatu l-qadri khayrun min alfi shahr. Tanazzalu l-malāʾikatu wa r-rūḥu fīhā bi-idhni rabbihim min kulli amr. Salāmun hiya ḥattā maṭlaʿi l-fajr.",
  translation: "Indeed, We sent the Qur'an down during the Night of Decree. And what can make you know what the Night of Decree is? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn.",
  reference: "Qur'an 97:1-5",
  audioId: "qadr",
};

// Post-prayer du'a — gifting the reward to the deceased
const giftingDua = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَابْعَثْ ثَوَابَهَا إِلَى قَبْرِ ‎[اسم المتوفى]",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad, wa-bʿath thawābahā ilā qabri [name of the deceased]",
  translation: "O Allah, send blessings upon Muḥammad and the family of Muḥammad, and send the reward of this [prayer] to the grave of [name of the deceased].",
  reference: "Mafātīḥ al-Jinān",
  audioId: null,
};

// ─── Custom steps that override the generic surah step ──────────────────────

const ayatKursiStep = {
  id: "wahshat-r1-ayatkursi",
  title: "Recite Āyat al-Kursī",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "After al-Fātiḥah, recite Āyat al-Kursī (verse 255 of Sūrat al-Baqarah) once.",
  recitation: ayatAlKursi,
  tip: "This is the most exalted verse in the Qur'an. Recite with care and presence of heart.",
  madhhabNote: null,
};

const qadrTenTimesStep = {
  id: "wahshat-r2-qadr",
  title: "Recite Sūrat al-Qadr (× 10)",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "After al-Fātiḥah, recite Sūrat al-Qadr ten times. Keep count on the fingers or use a tasbīḥ counter.",
  recitation: suratAlQadr,
  tip: "Ten repetitions is the prescribed count for this prayer. Take your time — clear recitation matters more than speed.",
  madhhabNote: null,
};

const giftingStep = {
  id: "wahshat-after",
  title: "Gift the reward",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_shia",
  instruction: "After completing the prayer, remain seated and recite the du'a gifting the reward of this prayer to the deceased. Speak their name aloud or in the heart.",
  recitation: giftingDua,
  tip: "This is the entire purpose of the prayer — to ease the deceased on their first night in the grave by sending them the merit of your worship.",
  madhhabNote: null,
};

// ─── Niyyah (intention) — silent ────────────────────────────────────────────

const niyyahNote = "Form the intention silently: 'I am praying two rakahs of Ṣalāt Waḥshat al-Qabr for [name of the deceased], qurbatan ilā-llāh (seeking nearness to Allah).'";

// ─── Rakah construction ─────────────────────────────────────────────────────

function buildRakah1() {
  const prayer = "wahshatAlQabr";
  const rakah = 1;

  const qiyam = Step.qiyamFirst(prayer, rakah);
  qiyam.shia.instruction = `Stand upright facing the qiblah. ${niyyahNote}`;
  qiyam.sunni.instruction = qiyam.shia.instruction;

  const takbir = Step.takbirOpening(prayer, rakah);

  const steps = [
    qiyam.shia,
    takbir.shia,
    Step.fatiha(prayer, rakah, false),
    ayatKursiStep,
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
  ];

  return { number: 1, stepsSunni: steps, stepsShia: steps };
}

function buildRakah2() {
  const prayer = "wahshatAlQabr";
  const rakah = 2;

  const qiyam = Step.qiyamMid?.(prayer, rakah) ?? Step.qiyamFirst(prayer, rakah);
  qiyam.shia.title = "Stand for the second rakah";
  qiyam.shia.instruction = "Rise from sujūd to stand for the second rakah, saying takbīr.";

  const steps = [
    qiyam.shia,
    Step.fatiha(prayer, rakah, false),
    qadrTenTimesStep,
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
    Step.tashahhud(prayer, rakah, true).shia,
    Step.salam(prayer, rakah),
    giftingStep,
  ];

  return { number: 2, stepsSunni: steps, stepsShia: steps };
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const wahshatAlQabr = {
  id: "wahshatAlQabr",
  tradition: "shia",
  name: "Ṣalāt Waḥshat al-Qabr",
  arabicName: "صلاة وحشة القبر",
  subtitle: "First night after burial",
  rakahCount: 2,
  category: "occasional",
  summary: "Two-rakah prayer offered on the first night after a Muslim's burial. The reward is gifted to the deceased to ease them in the grave. Best prayed shortly after ʿIshāʾ on the night of burial.",
  draftNotice: "This walkthrough is a draft compiled from public Shia sources. It has not yet been reviewed by a qualified Ja'farī scholar.",
  rakahs: [buildRakah1(), buildRakah2()],
};
