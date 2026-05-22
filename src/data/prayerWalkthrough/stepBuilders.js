// src/data/prayerWalkthrough/stepBuilders.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised step factory functions. Direct port of the `Step` and
// `RakahBuilder` enums from PrayerData.swift.
//
// Every prayer composes its rakahs from these builders so step IDs, titles,
// and structure stay consistent across all prayers.
// ─────────────────────────────────────────────────────────────────────────────

import * as R from "./recitations";

// Postures match the Swift PoseSilhouette enum
export const POSTURES = {
  STANDING:    "standing",
  BOWING:      "bowing",
  PROSTRATING: "prostrating",
  KNEELING:    "kneeling",
};

// ─── Step factory functions ─────────────────────────────────────────────────
export const Step = {

  qiyamFirst(prayer, rakah) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-qiyam`,
        title: "Standing — Qiyām",
        posture: POSTURES.STANDING,
        assetName: "pose_qiyam_sunni",
        instruction: `Stand upright facing the qiblah. Form the intention (niyyah) silently in your heart for ${capitalize(prayer)}.`,
        recitation: null,
        tip: "Niyyah is in the heart. There is no requirement to verbalise it.",
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-qiyam`,
        title: "Standing — Qiyām",
        posture: POSTURES.STANDING,
        assetName: "pose_qiyam_shia",
        instruction: `Stand upright facing the qiblah with arms at your sides. Form the intention (niyyah) silently in your heart for ${capitalize(prayer)}.`,
        recitation: null,
        tip: "In the Shia tradition, the hands rest at the sides during qiyām, not folded.",
        madhhabNote: null,
      },
    };
  },

  takbirOpening(prayer, rakah) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-takbir`,
        title: "Opening Takbīr",
        posture: POSTURES.STANDING,
        assetName: null,
        instruction: "Raise both hands to the level of your ears (or shoulders) and say the opening takbīr. This enters you into the prayer; until this point you may still turn back.",
        recitation: R.takbirOpening,
        tip: "Open palms face the qiblah. Fingers neither tightly closed nor splayed.",
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-takbir`,
        title: "Takbīrat al-Iḥrām",
        posture: POSTURES.STANDING,
        assetName: null,
        instruction: "Raise both hands to the level of your ears with palms facing the qiblah and say the opening takbīr. This is the takbīr of consecration.",
        recitation: R.takbirOpening,
        tip: "After the takbīr, lower the hands to the sides — the Shia position throughout qiyām.",
        madhhabNote: "Shia practice: hands rest at the sides after the takbīr, not folded.",
      },
    };
  },

  istiftah(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-istiftah`,
      title: "Du'a al-Istiftāḥ",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "After folding the hands, recite the opening supplication silently before Al-Fātiḥah.",
      recitation: R.istiftahSunni,
      tip: "Recited only in the first rakah.",
      madhhabNote: null,
    };
  },

  taawwudh(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-taawwudh`,
      title: "Ta'awwudh",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "Seek refuge in Allah from Shayṭān before beginning the recitation of the Qur'an.",
      recitation: R.taawwudh,
      tip: "Recited silently only in the first rakah.",
      madhhabNote: null,
    };
  },

  fatiha(prayer, rakah, audible) {
    return {
      id: `${prayer}-r${rakah}-fatiha`,
      title: "Recite Al-Fātiḥah",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: audible
        ? "Recite Al-Fātiḥah audibly. The Imam recites; the followers listen attentively."
        : "Recite Al-Fātiḥah silently in your heart, moving the lips quietly.",
      recitation: R.fatiha,
      tip: "Pause briefly after each verse where indicated by the sign ۝.",
      madhhabNote: null,
    };
  },

  surah(prayer, rakah, audible) {
    return {
      id: `${prayer}-r${rakah}-surah`,
      title: "Recite a Sūrah",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: audible
        ? "Recite a sūrah or portion of the Qur'an audibly after Al-Fātiḥah. Al-Ikhlāṣ is shown as an example."
        : "Recite a sūrah or portion of the Qur'an silently after Al-Fātiḥah. Al-Ikhlāṣ is shown as an example.",
      recitation: R.ikhlas,
      tip: "Only required in the first two rakahs of any obligatory prayer.",
      madhhabNote: null,
    };
  },

  ruku(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-ruku`,
      title: "Bowing — Rukūʿ",
      posture: POSTURES.BOWING,
      assetName: "pose_ruku_sunni",
      instruction: "Say 'Allāhu Akbar' as you bow forward. Place your hands firmly on your knees with your back straight and parallel to the ground. Recite the tasbīḥ at least three times.",
      recitation: R.tasbihRuku,
      tip: "The back, neck, and head form one straight line. Keep the eyes on the spot of prostration.",
      madhhabNote: null,
    };
  },

  itidal(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-iitidal`,
      title: "Rising — Iʿtidāl",
      posture: POSTURES.STANDING,
      assetName: null,
      instruction: "Rise from rukūʿ to a fully upright standing position, saying 'Sami'a-llāhu liman ḥamidah'. Once standing, complete the response.",
      recitation: R.samiAllah,
      tip: "Stand calmly upright before going into sujūd — rushing past this position is a common error.",
      madhhabNote: null,
    };
  },

  sujudFirst(prayer, rakah) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-sujud-1`,
        title: "First Prostration — Sujūd",
        posture: POSTURES.PROSTRATING,
        assetName: "pose_sujood_sunni",
        instruction: "Say 'Allāhu Akbar' and prostrate so that seven body parts touch the ground: forehead (with the nose), both palms, both knees, and the toes of both feet. Recite the tasbīḥ at least three times.",
        recitation: R.tasbihSujud,
        tip: "Keep elbows lifted off the ground and away from the sides.",
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-sujud-1`,
        title: "First Prostration — Sujūd",
        posture: POSTURES.PROSTRATING,
        assetName: "pose_sujood_shia",
        instruction: "Say 'Allāhu Akbar' and prostrate. The forehead must rest on something it is permissible to prostrate upon — most commonly a turbah (clay tablet from the earth of Karbala). Both palms, both knees, and the big toes of both feet should also touch the ground.",
        recitation: R.tasbihSujud,
        tip: "If a turbah is not available, prostrate on something earthen or plant-based that is not eaten or worn (e.g. paper, a leaf, unprocessed wood).",
        madhhabNote: "The turbah ensures the forehead rests on something permissible for sujūd in the Shia tradition.",
      },
    };
  },

  jalsa(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-jalsa`,
      title: "Sitting Between Prostrations",
      posture: POSTURES.KNEELING,
      assetName: null,
      instruction: "Rise from sujūd into a brief seated position with calmness. Recite the short du'a of forgiveness before going into the second prostration.",
      recitation: R.dhikrJalsa,
      tip: "Sit upright with the left foot folded beneath you and the right foot upright (Sunni) or sit on the left thigh (Shia, mutawarrik).",
      madhhabNote: null,
    };
  },

  sujudSecond(prayer, rakah) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-sujud-2`,
        title: "Second Prostration — Sujūd",
        posture: POSTURES.PROSTRATING,
        assetName: "pose_sujood_sunni",
        instruction: "Say 'Allāhu Akbar' and prostrate again. Recite the tasbīḥ of sujūd at least three more times. This completes the second prostration of this rakah.",
        recitation: R.tasbihSujud,
        tip: "Two prostrations make one rakah. Counting them keeps you on track.",
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-sujud-2`,
        title: "Second Prostration — Sujūd",
        posture: POSTURES.PROSTRATING,
        assetName: "pose_sujood_shia",
        instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah, with all seven points of contact. Recite the tasbīḥ at least three more times.",
        recitation: R.tasbihSujud,
        tip: null,
        madhhabNote: null,
      },
    };
  },

  tashahhud(prayer, rakah, isFinal) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-tashahhud`,
        title: isFinal ? "Final Tashahhud" : "Tashahhud",
        posture: POSTURES.KNEELING,
        assetName: "pose_tashahhud_sunni",
        instruction: `Sit calmly with hands resting on the thighs. Recite the tashahhud, raising the right index finger at 'lā ilāha illa-llāh'.${isFinal ? " Then send blessings on the Prophet ﷺ before the final salām." : ""}`,
        recitation: R.tashahhudSunni,
        tip: "The left hand rests on the left thigh; the right hand on the right thigh, with the index finger pointing forward.",
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-tashahhud`,
        title: isFinal ? "Final Tashahhud" : "Tashahhud",
        posture: POSTURES.KNEELING,
        assetName: "pose_tashahhud_shia",
        instruction: "Sit on the left thigh (mutawarrik posture) with the right foot resting on the left. Recite the Shia form of the tashahhud, including the ṣalawāt on the Prophet ﷺ and his family.",
        recitation: R.tashahhudShia,
        tip: "Sending blessings on Muḥammad and his family is part of the tashahhud itself in Shia practice.",
        madhhabNote: null,
      },
    };
  },

  salawat(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-salawat`,
      title: "Ṣalawāt — Blessings on the Prophet ﷺ",
      posture: POSTURES.KNEELING,
      assetName: null,
      instruction: "After the tashahhud, recite the ṣalawāt sending blessings upon the Prophet ﷺ and his family.",
      recitation: R.salawat,
      tip: null,
      madhhabNote: null,
    };
  },

  salam(prayer, rakah) {
    return {
      id: `${prayer}-r${rakah}-salam`,
      title: "Closing Salām",
      posture: POSTURES.KNEELING,
      assetName: "pose_salam_sunni",
      instruction: "Turn your head to the right and say the salām. Then turn it to the left and repeat. The prayer is now complete.",
      recitation: R.salam,
      tip: "The intention of the salām is greeting the angels recording the prayer and the believers around you.",
      madhhabNote: null,
    };
  },
};

// ─── RakahBuilder ───────────────────────────────────────────────────────────
export const RakahBuilder = {

  /// First rakah of an obligatory prayer — includes istiftāḥ and ta'awwudh.
  first(prayer, audible) {
    const qiyam   = Step.qiyamFirst(prayer, 1);
    const takbir  = Step.takbirOpening(prayer, 1);
    const sujud1  = Step.sujudFirst(prayer, 1);
    const sujud2  = Step.sujudSecond(prayer, 1);

    const shared = [
      Step.istiftah(prayer, 1),
      Step.taawwudh(prayer, 1),
      Step.fatiha(prayer, 1, audible),
      Step.surah(prayer, 1, audible),
      Step.ruku(prayer, 1),
      Step.itidal(prayer, 1),
    ];
    const trailing = [Step.jalsa(prayer, 1)];

    return {
      number: 1,
      stepsSunni: [qiyam.sunni, takbir.sunni, ...shared, sujud1.sunni, ...trailing, sujud2.sunni],
      stepsShia:  [qiyam.shia, takbir.shia, ...shared, sujud1.shia, ...trailing, sujud2.shia],
    };
  },

  /// Second rakah — Fatiha + Surah, ends with tashahhud.
  /// `isFinal` controls whether this rakah ends in salām.
  second(prayer, audible, isFinal) {
    const qiyam  = RakahBuilder.qiyamMid(prayer, 2);
    const sujud1 = Step.sujudFirst(prayer, 2);
    const sujud2 = Step.sujudSecond(prayer, 2);
    const tash   = Step.tashahhud(prayer, 2, isFinal);

    const shared = [
      Step.fatiha(prayer, 2, audible),
      Step.surah(prayer, 2, audible),
      Step.ruku(prayer, 2),
      Step.itidal(prayer, 2),
    ];

    let sunniSteps = [
      qiyam.sunni, ...shared,
      sujud1.sunni, Step.jalsa(prayer, 2), sujud2.sunni,
      tash.sunni,
    ];
    let shiaSteps = [
      qiyam.shia, ...shared,
      sujud1.shia, Step.jalsa(prayer, 2), sujud2.shia,
      tash.shia,
    ];

    if (isFinal) {
      sunniSteps = sunniSteps.concat([Step.salawat(prayer, 2), Step.salam(prayer, 2)]);
      shiaSteps  = shiaSteps.concat([Step.salam(prayer, 2)]);
    }

    return { number: 2, stepsSunni: sunniSteps, stepsShia: shiaSteps };
  },

  /// Rakah 3 (or 4) of a multi-rakah obligatory prayer — Fatiha only, silent.
  laterRakah(prayer, number, isFinal) {
    const qiyam  = RakahBuilder.qiyamMid(prayer, number);
    const sujud1 = Step.sujudFirst(prayer, number);
    const sujud2 = Step.sujudSecond(prayer, number);

    const shared = [
      Step.fatiha(prayer, number, false),
      Step.ruku(prayer, number),
      Step.itidal(prayer, number),
    ];

    let sunniSteps = [
      qiyam.sunni, ...shared,
      sujud1.sunni, Step.jalsa(prayer, number), sujud2.sunni,
    ];
    let shiaSteps = [
      qiyam.shia, ...shared,
      sujud1.shia, Step.jalsa(prayer, number), sujud2.shia,
    ];

    if (isFinal) {
      const tash = Step.tashahhud(prayer, number, true);
      sunniSteps = sunniSteps.concat([tash.sunni, Step.salawat(prayer, number), Step.salam(prayer, number)]);
      shiaSteps  = shiaSteps.concat([tash.shia, Step.salam(prayer, number)]);
    }

    return { number, stepsSunni: sunniSteps, stepsShia: shiaSteps };
  },

  /// Standing position for non-first rakahs (no istiftāḥ).
  qiyamMid(prayer, rakah) {
    return {
      sunni: {
        id: `${prayer}-r${rakah}-qiyam`,
        title: `Standing for Rakah ${rakah}`,
        posture: POSTURES.STANDING,
        assetName: "pose_qiyam_sunni",
        instruction: "Rise to a standing position saying 'Allāhu Akbar', and fold the hands.",
        recitation: null,
        tip: null,
        madhhabNote: null,
      },
      shia: {
        id: `${prayer}-r${rakah}-qiyam`,
        title: `Standing for Rakah ${rakah}`,
        posture: POSTURES.STANDING,
        assetName: "pose_qiyam_shia",
        instruction: "Rise to a standing position saying 'Allāhu Akbar', with the arms at the sides.",
        recitation: null,
        tip: null,
        madhhabNote: null,
      },
    };
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Helper to read steps for a given madhhab from a Rakah object
export function stepsForRakah(rakah, madhhab) {
  if (madhhab === "shia") return rakah.stepsShia ?? rakah.stepsSunni;
  return rakah.stepsSunni;
}

// Helper to flatten all steps of a prayer for a given madhhab
export function flatSteps(prayer, madhhab) {
  const result = [];
  for (const rakah of prayer.rakahs) {
    for (const step of stepsForRakah(rakah, madhhab)) {
      result.push({ rakah: rakah.number, step });
    }
  }
  return result;
}
