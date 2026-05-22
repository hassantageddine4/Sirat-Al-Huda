// src/data/prayerWalkthrough/jafarAtTayyar.js
// ─────────────────────────────────────────────────────────────────────────────
// Ṣalāt Jaʿfar aṭ-Ṭayyār
// "The Prayer of Jaʿfar the Flier"
//
// A 4-rakah voluntary prayer taught by the Prophet ﷺ to his cousin Jaʿfar
// b. Abī Ṭālib (who is given the epithet aṭ-Ṭayyār, "the Flier", as he is
// reported to have been given two wings in Paradise after his martyrdom at
// Mūʾtah). The prayer carries enormous reward and is recommended at any time,
// though Friday morning is particularly emphasised in Shīʿī sources.
//
// Structure (each rakah):
//   • Hamd (al-Fātiḥah)
//   • A specific sūrah (different per rakah)
//   • 75 tasbīḥāt distributed across the postures of the rakah
//   • Total tasbīḥāt across all 4 rakahs = 300
//
// The tasbīḥ formula recited at every position:
//   "Subḥāna llāhi wa l-ḥamdu lillāhi wa lā ilāha illā llāhu wa llāhu akbar"
//
// Distribution of 75 tasbīḥāt per rakah:
//   • 15 after the sūrah (still standing)
//   • 10 in rukūʿ
//   • 10 after rising from rukūʿ (standing)
//   • 10 in first sujūd
//   • 10 between the two sujūds (sitting)
//   • 10 in second sujūd
//   • 10 after rising from the second sujūd (sitting, before standing for the next rakah / before tashahhud)
//
// Sūrah recited after al-Fātiḥah:
//   Rakah 1: Sūrat al-Zilzāl (99)
//   Rakah 2: Sūrat al-ʿĀdiyāt (100)
//   Rakah 3: Sūrat an-Naṣr (110)
//   Rakah 4: Sūrat al-Ikhlāṣ (112)
//
// ⚠️ DRAFT — All content drawn from public Shia jurisprudence sources
// (al-islam.org "Salat Ja'far at-Tayyar", wikishia, Mafātīḥ al-Jinān). The
// tasbīḥ distribution and surah selection are well-attested but MUST be
// reviewed by a qualified Ja'farī scholar before being shipped to users.
// ─────────────────────────────────────────────────────────────────────────────

import { Step, POSTURES } from "./stepBuilders";
import { fatiha, ikhlas } from "./recitations";

// ─── The tasbīḥ formula ─────────────────────────────────────────────────────

const tasbihJafar = {
  arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna llāhi wa l-ḥamdu lillāhi wa lā ilāha illā llāhu wa llāhu akbar",
  translation: "Glory be to Allah, and praise be to Allah, and there is no god but Allah, and Allah is the Greatest.",
  reference: "Mafātīḥ al-Jinān",
  audioId: "tasbihat_arba",
};

// ─── Specific surahs recited after al-Fātiḥah ───────────────────────────────

const zilzal = {
  arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ۝ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ۝ وَقَالَ الْإِنسَانُ مَا لَهَا ۝ يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا ۝ بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا ۝ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ ۝ فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
  transliteration: "Idhā zulzilati l-arḍu zilzālahā. Wa akhrajati l-arḍu athqālahā. Wa qāla l-insānu mā lahā. Yawmaʾidhin tuḥaddithu akhbārahā. Bi-anna rabbaka awḥā lahā. Yawmaʾidhin yaṣduru n-nāsu ashtātan li-yuraw aʿmālahum. Fa-man yaʿmal mithqāla dharratin khayran yarah. Wa-man yaʿmal mithqāla dharratin sharran yarah.",
  translation: "When the earth is shaken with its [final] earthquake, and the earth discharges its burdens, and man says, 'What is [wrong] with it?' — that Day, it will report its news, because your Lord has commanded it. That Day, the people will depart separated [into categories] to be shown [the result of] their deeds. So whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
  reference: "Qur'an 99:1-8",
  audioId: "zilzal",
};

const adiyat = {
  arabic: "وَالْعَادِيَاتِ ضَبْحًا ۝ فَالْمُورِيَاتِ قَدْحًا ۝ فَالْمُغِيرَاتِ صُبْحًا ۝ فَأَثَرْنَ بِهِ نَقْعًا ۝ فَوَسَطْنَ بِهِ جَمْعًا ۝ إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ ۝ وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ ۝ وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ ۝ أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ ۝ وَحُصِّلَ مَا فِي الصُّدُورِ ۝ إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ",
  transliteration: "Wa l-ʿādiyāti ḍabḥā. Fa-l-mūriyāti qadḥā. Fa-l-mughīrāti ṣubḥā. Fa-atharna bihī naqʿā. Fa-wasaṭna bihī jamʿā. Inna l-insāna li-rabbihī la-kanūd. Wa innahū ʿalā dhālika la-shahīd. Wa innahū li-ḥubbi l-khayri la-shadīd. Afa-lā yaʿlamu idhā buʿthira mā fī l-qubūr. Wa ḥuṣṣila mā fī ṣ-ṣudūr. Inna rabbahum bihim yawmaʾidhin la-khabīr.",
  translation: "By the racers, panting; and the producers of sparks; and the chargers at dawn, stirring up thereby dust, arriving thereby in the centre [of the foe]. Indeed, mankind, to his Lord, is ungrateful. And indeed, he is to that a witness. And indeed, in love of wealth, he is intense. But does he not know that when the contents of the graves are scattered and that within the breasts is obtained — indeed, their Lord, that Day, of them is acquainted.",
  reference: "Qur'an 100:1-11",
  audioId: "adiyat",
};

const nasr = {
  arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
  transliteration: "Idhā jāʾa naṣru llāhi wa l-fatḥ. Wa raʾayta n-nāsa yadkhulūna fī dīni llāhi afwājā. Fa-sabbiḥ bi-ḥamdi rabbika wa staghfirhū innahū kāna tawwābā.",
  translation: "When the victory of Allah has come and the conquest, and you see the people entering into the religion of Allah in multitudes, then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.",
  reference: "Qur'an 110:1-3",
  audioId: "nasr",
};

// ─── Tasbīḥ step factory ────────────────────────────────────────────────────
// Creates a step that instructs the user to recite the tasbīḥ formula N times
// in the given posture. The recitation card shows the formula; the count is
// stated in the title and instruction. (No interactive counter — engine has
// no counting UI yet; the user uses their fingers or an external tasbīḥ.)

function tasbihStep(rakah, position, posture, assetName, count, contextNote) {
  return {
    id: `jafar-r${rakah}-tasbih-${position}`,
    title: `Tasbīḥ × ${count} — ${position}`,
    posture,
    assetName,
    instruction: `${contextNote} Recite the tasbīḥ formula ${count} times. Keep count on your fingers or with a counter.`,
    recitation: tasbihJafar,
    tip: count === 15
      ? "This is the largest single block — 15 tasbīḥāt before going into rukūʿ. Take a steady pace."
      : null,
    madhhabNote: null,
  };
}

// ─── Single-rakah builder ───────────────────────────────────────────────────

function buildRakah(rakahNumber, surah, isFinal) {
  const prayer = "jafarAtTayyar";

  const qiyam = rakahNumber === 1
    ? Step.qiyamFirst(prayer, rakahNumber)
    : (Step.qiyamMid?.(prayer, rakahNumber) ?? Step.qiyamFirst(prayer, rakahNumber));

  if (rakahNumber === 1) {
    qiyam.shia.instruction = "Stand upright facing the qiblah. Form the intention silently: 'I am praying four rakahs of Ṣalāt Jaʿfar aṭ-Ṭayyār, qurbatan ilā-llāh.'";
    qiyam.sunni.instruction = qiyam.shia.instruction;
  } else {
    qiyam.shia.title = `Stand for rakah ${rakahNumber}`;
    qiyam.shia.instruction = `Rise to stand for the ${ordinal(rakahNumber)} rakah, saying takbīr.`;
  }

  const takbir = rakahNumber === 1 ? Step.takbirOpening(prayer, rakahNumber).shia : null;

  // Override the surah step to use this rakah's specific surah
  const surahStep = {
    id: `jafar-r${rakahNumber}-surah`,
    title: `Recite Sūrat ${surah.shortName}`,
    posture: POSTURES.STANDING,
    assetName: null,
    instruction: `After al-Fātiḥah, recite Sūrat ${surah.shortName} (${surah.reference}).`,
    recitation: surah.recitation,
    tip: null,
    madhhabNote: null,
  };

  const steps = [
    qiyam.shia,
    ...(takbir ? [takbir] : []),
    Step.fatiha(prayer, rakahNumber, false),
    surahStep,

    // 15 tasbīḥāt — still standing, before rukūʿ
    tasbihStep(rakahNumber, "after-surah", POSTURES.STANDING, null, 15,
      "After completing the sūrah, while still standing,"),

    Step.ruku(prayer, rakahNumber),

    // 10 tasbīḥāt in rukūʿ
    tasbihStep(rakahNumber, "ruku", POSTURES.BOWING, "pose_ruku", 10,
      "While in rukūʿ (after the standard rukūʿ tasbīḥ),"),

    Step.itidal(prayer, rakahNumber),

    // 10 tasbīḥāt after rukūʿ — standing
    tasbihStep(rakahNumber, "after-ruku", POSTURES.STANDING, null, 10,
      "After rising from rukūʿ, while standing,"),

    Step.sujudFirst(prayer, rakahNumber).shia,

    // 10 tasbīḥāt in first sujūd
    tasbihStep(rakahNumber, "sujud-1", POSTURES.PROSTRATING, "pose_sujud_shia", 10,
      "While in the first sujūd (after the standard sujūd tasbīḥ),"),

    Step.jalsa(prayer, rakahNumber),

    // 10 tasbīḥāt sitting between sujūds
    tasbihStep(rakahNumber, "jalsa", POSTURES.KNEELING, "pose_jalsa", 10,
      "While sitting between the two sujūds,"),

    Step.sujudSecond(prayer, rakahNumber).shia,

    // 10 tasbīḥāt in second sujūd
    tasbihStep(rakahNumber, "sujud-2", POSTURES.PROSTRATING, "pose_sujud_shia", 10,
      "While in the second sujūd (after the standard sujūd tasbīḥ),"),

    // 10 tasbīḥāt sitting after second sujūd (before standing for next rakah or before tashahhud)
    tasbihStep(rakahNumber, "after-sujud-2", POSTURES.KNEELING, "pose_jalsa", 10,
      `While sitting after the second sujūd${isFinal ? " (before tashahhud)" : " (before standing for the next rakah)"},`),
  ];

  if (isFinal) {
    steps.push(Step.tashahhud(prayer, rakahNumber, true).shia);
    steps.push(Step.salam(prayer, rakahNumber));
  }

  return { number: rakahNumber, stepsSunni: steps, stepsShia: steps };
}

function ordinal(n) {
  return n === 1 ? "first" : n === 2 ? "second" : n === 3 ? "third" : "fourth";
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const jafarAtTayyar = {
  id: "jafarAtTayyar",
  tradition: "shia",
  name: "Ṣalāt Jaʿfar aṭ-Ṭayyār",
  arabicName: "صلاة جعفر الطيار",
  subtitle: "Prayer of Jaʿfar the Flier",
  rakahCount: 4,
  category: "recommended",
  summary: "Four-rakah voluntary prayer taught by the Prophet ﷺ to Jaʿfar b. Abī Ṭālib. Each rakah includes 75 tasbīḥāt distributed across the postures (300 total), with a specific sūrah recited after al-Fātiḥah. Best prayed on Friday morning, though valid at any time.",
  draftNotice: "This walkthrough is a draft compiled from public Shia sources. The tasbīḥ distribution and surah selection are well-attested but MUST be reviewed by a qualified Ja'farī scholar before being shipped.",
  rakahs: [
    buildRakah(1, { shortName: "az-Zilzāl",   reference: "Q 99", recitation: zilzal }, false),
    buildRakah(2, { shortName: "al-ʿĀdiyāt",  reference: "Q 100", recitation: adiyat }, false),
    buildRakah(3, { shortName: "an-Naṣr",     reference: "Q 110", recitation: nasr },   false),
    buildRakah(4, { shortName: "al-Ikhlāṣ",   reference: "Q 112", recitation: ikhlas }, true),
  ],
};
