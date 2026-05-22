// src/data/prayerWalkthrough/laylatAlQadr.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Laylat al-Qadr — Acts for the Night of Power
//
// Not a single distinct prayer but a cluster of recommended acts observed on
// the Night of Power (Laylat al-Qadr) in the last ten nights of Ramaḍān,
// especially the odd-numbered nights (19th, 21st, 23rd, 25th, 27th, 29th).
//
// The Qur'an describes Laylat al-Qadr as better than a thousand months
// (Q 97:3). The Prophet ﷺ encouraged staying awake in worship, especially
// the recitation of supplications, Qur'an, and voluntary prayer.
//
// This walkthrough offers a representative 2-rakah voluntary prayer plus
// the most widely recommended post-prayer supplications.
//
// Structure:
//   Rakah 1: Hamd (al-Fātiḥah) + Sūrat al-Qadr (Q 97) once
//   Rakah 2: Hamd (al-Fātiḥah) + Sūrat al-Ikhlāṣ (Q 112) once
//   After salām:
//     • Sūrat al-Qadr recited 7 times
//     • Du'a of Laylat al-Qadr
//     • Sustained du'a, dhikr, and personal supplication
//
// ⚠️ DRAFT — Content compiled from public sources (Qur'an Q 97, hadith
// collections, Mafātīḥ al-Jinān for Shīʿī a'māl). MUST be reviewed by
// qualified scholars from both traditions before being shipped to users.
// ─────────────────────────────────────────────────────────────────────────────

import { Step, POSTURES } from "./stepBuilders";
import { fatiha, ikhlas } from "./recitations";

// ─── Inline recitations ─────────────────────────────────────────────────────

const suratAlQadr = {
  arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
  transliteration: "Innā anzalnāhu fī laylati l-qadr. Wa mā adrāka mā laylatu l-qadr. Laylatu l-qadri khayrun min alfi shahr. Tanazzalu l-malāʾikatu wa r-rūḥu fīhā bi-idhni rabbihim min kulli amr. Salāmun hiya ḥattā maṭlaʿi l-fajr.",
  translation: "Indeed, We sent the Qur'an down during the Night of Decree. And what can make you know what the Night of Decree is? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn.",
  reference: "Qur'an 97:1-5",
  audioId: "qadr",
};

// Du'a of the Prophet ﷺ for Laylat al-Qadr (narrated by ʿĀʾisha, in Tirmidhī)
const duaLaylatAlQadr = {
  arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
  transliteration: "Allāhumma innaka ʿafuwwun karīmun tuḥibbu l-ʿafwa fa-ʿfu ʿannī",
  translation: "O Allah, You are Most Forgiving, Most Generous, You love to forgive — so forgive me.",
  reference: "Jāmiʿ al-Tirmidhī #3513",
  audioId: "dua_laylat_qadr",
};

// Salawāt ʿalā Muḥammad wa āli Muḥammad
const salawatAhlulBayt = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad",
  translation: "O Allah, send blessings upon Muḥammad and the family of Muḥammad.",
  reference: null,
  audioId: "salawat",
};

// ─── Custom surah steps (overriding the generic surah step) ─────────────────

const qadrStep = {
  id: "qadr-r1-qadr",
  title: "Recite Sūrat al-Qadr",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "After al-Fātiḥah, recite Sūrat al-Qadr once.",
  recitation: suratAlQadr,
  tip: "This surah describes the very night you are honouring. Recite with focus.",
  madhhabNote: null,
};

const ikhlasStep = {
  id: "qadr-r2-ikhlas",
  title: "Recite Sūrat al-Ikhlāṣ",
  posture: POSTURES.STANDING,
  assetName: null,
  instruction: "After al-Fātiḥah, recite Sūrat al-Ikhlāṣ once.",
  recitation: ikhlas,
  tip: null,
  madhhabNote: null,
};

// ─── Post-prayer steps ──────────────────────────────────────────────────────

const qadr7TimesStep = {
  id: "qadr-after-qadr7",
  title: "Sūrat al-Qadr × 7",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_sunni",
  instruction: "After salām, remain seated and recite Sūrat al-Qadr seven more times.",
  recitation: suratAlQadr,
  tip: "Take your time. This is the prescribed count for the post-prayer a'māl of Laylat al-Qadr.",
  madhhabNote: null,
};

const duaStep = {
  id: "qadr-after-dua",
  title: "Du'a of Laylat al-Qadr",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_sunni",
  instruction: "Recite the du'a the Prophet ﷺ taught ʿĀʾisha (RA) to recite on this night. Repeat sincerely as many times as you wish.",
  recitation: duaLaylatAlQadr,
  tip: "Personalise: between repetitions, ask Allah for forgiveness for yourself, your family, the believers living and deceased.",
  madhhabNote: null,
};

const salawatStep = {
  id: "qadr-after-salawat",
  title: "Salawāt",
  posture: POSTURES.KNEELING,
  assetName: "pose_tashahhud_sunni",
  instruction: "Send salawāt upon the Prophet ﷺ and his family abundantly. There is no fixed count — many recommend at least 100, but the heart's sincerity is what matters most.",
  recitation: salawatAhlulBayt,
  tip: null,
  madhhabNote: null,
};

const continueStep = {
  id: "qadr-after-continue",
  title: "Continue the night",
  posture: POSTURES.KNEELING,
  assetName: null,
  instruction: "The walkthrough ends here, but the night is just beginning. Recommended for the remainder of the night: recitation of the Qur'an, personal du'a, dhikr, reflection, and listing your needs before Allah. Some traditions recommend opening the Qur'an over the head while supplicating; others recommend reciting Du'a al-Jawshan al-Kabīr.",
  recitation: null,
  tip: "The Prophet ﷺ said: 'Whoever stands [in prayer] on Laylat al-Qadr out of faith and seeking reward, his previous sins are forgiven.' [Bukhārī, Muslim]",
  madhhabNote: "Shia tradition: it is highly recommended to also perform A'māl Laylat al-Qadr (placing the Qur'an on the head, reciting Du'a Jawshan al-Kabīr, and other supplications detailed in Mafātīḥ al-Jinān).",
};

// ─── Niyyah ─────────────────────────────────────────────────────────────────

const niyyah = "Form the intention silently: 'I am praying two rakahs for the Night of Power, qurbatan ilā-llāh (seeking nearness to Allah).'";

// ─── Rakah construction ─────────────────────────────────────────────────────

function buildRakah1() {
  const prayer = "laylatAlQadr";
  const rakah = 1;

  const qiyam = Step.qiyamFirst(prayer, rakah);
  qiyam.sunni.instruction = `Stand upright facing the qiblah. ${niyyah}`;
  qiyam.shia.instruction = qiyam.sunni.instruction;

  const takbir = Step.takbirOpening(prayer, rakah);

  const steps = [
    qiyam.sunni,
    takbir.sunni,
    Step.fatiha(prayer, rakah, false),
    qadrStep,
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).sunni,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).sunni,
  ];

  const stepsShia = [
    qiyam.shia,
    Step.takbirOpening(prayer, rakah).shia,
    Step.fatiha(prayer, rakah, false),
    qadrStep,
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
  ];

  return { number: 1, stepsSunni: steps, stepsShia };
}

function buildRakah2() {
  const prayer = "laylatAlQadr";
  const rakah = 2;

  const qiyam = Step.qiyamMid?.(prayer, rakah) ?? Step.qiyamFirst(prayer, rakah);
  qiyam.sunni.title = "Stand for the second rakah";
  qiyam.sunni.instruction = "Rise to stand for the second rakah, saying takbīr.";
  qiyam.shia.title = qiyam.sunni.title;
  qiyam.shia.instruction = qiyam.sunni.instruction;

  const tash = Step.tashahhud(prayer, rakah, true);

  const sharedBody = [
    Step.fatiha(prayer, rakah, false),
    ikhlasStep,
    Step.ruku(prayer, rakah),
    Step.itidal(prayer, rakah),
  ];

  const stepsSunni = [
    qiyam.sunni,
    ...sharedBody,
    Step.sujudFirst(prayer, rakah).sunni,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).sunni,
    tash.sunni,
    Step.salawat(prayer, rakah),
    Step.salam(prayer, rakah),
    qadr7TimesStep,
    duaStep,
    salawatStep,
    continueStep,
  ];

  const stepsShia = [
    qiyam.shia,
    ...sharedBody,
    Step.sujudFirst(prayer, rakah).shia,
    Step.jalsa(prayer, rakah),
    Step.sujudSecond(prayer, rakah).shia,
    tash.shia,
    Step.salam(prayer, rakah),
    qadr7TimesStep,
    duaStep,
    salawatStep,
    continueStep,
  ];

  return { number: 2, stepsSunni, stepsShia };
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const laylatAlQadr = {
  id: "laylatAlQadr",
  tradition: "both",
  name: "Laylat al-Qadr",
  arabicName: "ليلة القدر",
  subtitle: "The Night of Power",
  rakahCount: 2,
  category: "occasional",
  summary: "Two-rakah voluntary prayer for the Night of Power (one of the last ten nights of Ramaḍān, most commonly the 21st, 23rd, 25th, 27th, or 29th). Followed by recitation of Sūrat al-Qadr seven times, the du'a of forgiveness taught to ʿĀʾisha (RA), and sustained personal supplication.",
  draftNotice: "This walkthrough is a draft compiled from public sources (Qur'an Q 97, Tirmidhī #3513, Mafātīḥ al-Jinān). Content from both traditions; review by Sunni and Shia scholars before shipping.",
  rakahs: [buildRakah1(), buildRakah2()],
};
