// src/data/ghuslTypes.js
// ─────────────────────────────────────────────────────────────────────────────
// Ghusl Guide — 10 types of ghusl with their niyyah, method, status, and
// hadith sources.
//
// Branch handling:
//   • Sunni gets one method per type.
//   • Shia chooses between TARTĪBĪ (sequential) and IRTIMĀSĪ (immersion).
//
// Gender-specific content is tagged inline in step instructions
// (e.g., "For women: ..."). No profile filtering — all info shown,
// user picks what applies.
//
// ⚠️ DRAFT — Scholar review required before shipping.
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
// SHARED STEP FACTORIES — reused across ghusl types
// ═════════════════════════════════════════════════════════════════════════════

function niyyahStep(typeName, niyyahArabic, niyyahTranslit, niyyahTranslation, branch) {
  return {
    id: "niyyah",
    title: "Niyyah (Intention)",
    body: `Form the intention silently in your heart for ${typeName}. ${branch === "shia"
      ? "The Shia niyyah is qurbatan ilā-llāh — seeking nearness to Allah."
      : "The Sunni niyyah may be expressed silently to oneself before beginning."}`,
    recitation: {
      arabic: niyyahArabic,
      transliteration: niyyahTranslit,
      translation: niyyahTranslation,
    },
    source: branch === "shia"
      ? "Sistani, Tawḍīḥ al-Masāʾil §362; al-Kāfī vol. 3."
      : "Ṣaḥīḥ al-Bukhārī 1 (intentions are by what is intended).",
  };
}

const sunniWashHands = {
  id: "wash-hands",
  title: "Wash the Hands",
  body: "Wash both hands up to the wrists three times — as you would before wuḍūʾ.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 248 (hadith of ʿĀʾisha on the Prophet ﷺ's ghusl).",
};

const sunniWashPrivateParts = {
  id: "wash-private-parts",
  title: "Wash the Private Parts",
  body: "Wash the private parts with the left hand to remove any impurity. Pour water generously with the right hand while cleaning with the left.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 248; Ṣaḥīḥ Muslim 316.",
};

const sunniWudu = {
  id: "wudu",
  title: "Perform Wuḍūʾ",
  body: "Perform a full wuḍūʾ as you would before prayer — though some hadiths describe delaying the washing of the feet until the end of ghusl. Both are valid.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 248; Ṣaḥīḥ Muslim 316.",
};

const sunniPourHead = {
  id: "pour-head",
  title: "Pour Water Over the Head 3 Times",
  body: "Pour water over the head three times, ensuring the water reaches the roots of the hair. **For women:** if the hair is braided or tied, you are not required to undo it for Janābah ghusl, as long as water reaches the roots (Ṣaḥīḥ Muslim 330, hadith of Umm Salamah — the Prophet ﷺ told her not to undo her braid). For Ḥayḍ and Nifās ghusl, untying is recommended.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 248; Ṣaḥīḥ Muslim 330.",
};

const sunniPourRight = {
  id: "pour-right",
  title: "Pour Water Over the Right Side",
  body: "Pour water over the right side of the body, from shoulder to foot. Rub the body with the hand to ensure water reaches the skin everywhere.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 251 (hadith of ʿĀʾisha).",
};

const sunniPourLeft = {
  id: "pour-left",
  title: "Pour Water Over the Left Side",
  body: "Pour water over the left side of the body, from shoulder to foot. Rub to ensure water reaches all the skin.",
  recitation: null,
  source: "Ṣaḥīḥ al-Bukhārī 251.",
};

const sunniCompletion = {
  id: "completion",
  title: "Completion",
  body: "The ghusl is now complete. Any prayer offered afterward is valid (provided wuḍūʾ was included or is performed before prayer). It is recommended to recite the brief duʿāʾ said after wuḍūʾ.",
  recitation: null,
  source: "Ṣaḥīḥ Muslim 234 (du'a after wuḍūʾ).",
};

// ─── Shia tartibi (sequential) steps ────────────────────────────────────────

const shiaTartibiRecommendedPrep = {
  id: "recommended-prep",
  title: "Recommended Preparation",
  body: "It is recommended (mustaḥabb), though not obligatory, to wash the hands up to the elbows three times and to wash the private parts before beginning the ghusl proper.",
  recitation: null,
  source: "Mafātīḥ al-Jinān; Sistani, Tawḍīḥ al-Masāʾil §366.",
};

const shiaTartibiHeadNeck = {
  id: "head-neck",
  title: "Wash the Head and Neck",
  body: "Pour water over the head and the neck, ensuring it reaches the roots of the hair and all the skin of the head and neck. **For women:** if the hair is braided, it must be wetted to the roots — untying the braid is not required so long as water reaches the roots.",
  recitation: null,
  source: "Sistani, Tawḍīḥ al-Masāʾil §362–363; al-Kāfī vol. 3.",
};

const shiaTartibiRight = {
  id: "right-side",
  title: "Wash the Right Side",
  body: "Pour water over the entire right side of the body — from the top of the right shoulder down to the right foot. Include some overlap with the central line of the body (chest and back) to ensure no skin is missed.",
  recitation: null,
  source: "Sistani, Tawḍīḥ al-Masāʾil §364.",
};

const shiaTartibiLeft = {
  id: "left-side",
  title: "Wash the Left Side",
  body: "Pour water over the entire left side of the body — from the top of the left shoulder down to the left foot. As with the right side, include overlap with the centerline.",
  recitation: null,
  source: "Sistani, Tawḍīḥ al-Masāʾil §365.",
};

const shiaCompletion = {
  id: "completion-shia",
  title: "Completion",
  body: "The ghusl is complete. With this single ghusl, no separate wuḍūʾ is needed before prayer — it suffices for ṭahārah from major impurity AND as a substitute for wuḍūʾ.",
  recitation: null,
  source: "Sistani, Tawḍīḥ al-Masāʾil §391 (ghusl al-Janābah suffices for wuḍūʾ in Shia fiqh).",
};

// ─── Shia irtimasi (immersion) steps ────────────────────────────────────────

const shiaIrtimasiImmerse = {
  id: "immerse",
  title: "Complete Immersion",
  body: "Immerse the entire body in water in a single instant. Every part of the body — including the roots of the hair, the inside of the navel, between the fingers and toes — must be reached by the water at once. May be done in flowing water (river, sea, large pool) or in a bath/tub large enough to cover the body.",
  recitation: null,
  source: "Sistani, Tawḍīḥ al-Masāʾil §367; al-Kāfī vol. 3.",
};

// ═════════════════════════════════════════════════════════════════════════════
// METHOD BUILDERS
// ═════════════════════════════════════════════════════════════════════════════

function sunniMethod(typeName, niyyahData) {
  return [
    niyyahStep(typeName, niyyahData.arabic, niyyahData.transliteration, niyyahData.translation, "sunni"),
    sunniWashHands,
    sunniWashPrivateParts,
    sunniWudu,
    sunniPourHead,
    sunniPourRight,
    sunniPourLeft,
    sunniCompletion,
  ];
}

function shiaTartibi(typeName, niyyahData) {
  return [
    niyyahStep(typeName, niyyahData.arabic, niyyahData.transliteration, niyyahData.translation, "shia"),
    shiaTartibiRecommendedPrep,
    shiaTartibiHeadNeck,
    shiaTartibiRight,
    shiaTartibiLeft,
    shiaCompletion,
  ];
}

function shiaIrtimasi(typeName, niyyahData) {
  return [
    niyyahStep(typeName, niyyahData.arabic, niyyahData.transliteration, niyyahData.translation, "shia"),
    shiaIrtimasiImmerse,
    shiaCompletion,
  ];
}

// ═════════════════════════════════════════════════════════════════════════════
// NIYYAH TEXTS
// ═════════════════════════════════════════════════════════════════════════════

// Sunni: simple intention in English, with optional brief Arabic
const N = {
  janabahSunni: {
    arabic: "نَوَيْتُ غُسْلَ الْجَنَابَةِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla l-janābati li-llāhi taʿālā.",
    translation: "I intend the ghusl of janābah for the sake of Allah, the Exalted.",
  },
  janabahShia: {
    arabic: "أَغْتَسِلُ غُسْلَ الْجَنَابَةِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla l-janābati qurbatan ilā-llāh.",
    translation: "I perform the ghusl of janābah, seeking nearness to Allah.",
  },
  haydSunni: {
    arabic: "نَوَيْتُ غُسْلَ الْحَيْضِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla l-ḥayḍi li-llāhi taʿālā.",
    translation: "I intend the ghusl of menstruation for the sake of Allah, the Exalted.",
  },
  haydShia: {
    arabic: "أَغْتَسِلُ غُسْلَ الْحَيْضِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla l-ḥayḍi qurbatan ilā-llāh.",
    translation: "I perform the ghusl of menstruation, seeking nearness to Allah.",
  },
  nifasSunni: {
    arabic: "نَوَيْتُ غُسْلَ النِّفَاسِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla n-nifāsi li-llāhi taʿālā.",
    translation: "I intend the ghusl of nifās (postnatal bleeding) for the sake of Allah.",
  },
  nifasShia: {
    arabic: "أَغْتَسِلُ غُسْلَ النِّفَاسِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla n-nifāsi qurbatan ilā-llāh.",
    translation: "I perform the ghusl of nifās, seeking nearness to Allah.",
  },
  massAlMayyit: {
    arabic: "أَغْتَسِلُ غُسْلَ مَسِّ الْمَيِّتِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla massi l-mayyiti qurbatan ilā-llāh.",
    translation: "I perform the ghusl of touching a corpse, seeking nearness to Allah.",
  },
  jumuahSunni: {
    arabic: "نَوَيْتُ غُسْلَ الْجُمُعَةِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla l-jumuʿati li-llāhi taʿālā.",
    translation: "I intend the ghusl of Jumuʿah for the sake of Allah, the Exalted.",
  },
  jumuahShia: {
    arabic: "أَغْتَسِلُ غُسْلَ الْجُمُعَةِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla l-jumuʿati qurbatan ilā-llāh.",
    translation: "I perform the ghusl of Jumuʿah, seeking nearness to Allah.",
  },
  eidFitr: {
    arabic: "نَوَيْتُ غُسْلَ عِيدِ الْفِطْرِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla ʿīdi l-fiṭri li-llāhi taʿālā.",
    translation: "I intend the ghusl of Eid al-Fiṭr for the sake of Allah.",
  },
  eidFitrShia: {
    arabic: "أَغْتَسِلُ غُسْلَ عِيدِ الْفِطْرِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla ʿīdi l-fiṭri qurbatan ilā-llāh.",
    translation: "I perform the ghusl of Eid al-Fiṭr, seeking nearness to Allah.",
  },
  eidAdha: {
    arabic: "نَوَيْتُ غُسْلَ عِيدِ الْأَضْحَىٰ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla ʿīdi l-aḍḥā li-llāhi taʿālā.",
    translation: "I intend the ghusl of Eid al-Aḍḥā for the sake of Allah.",
  },
  eidAdhaShia: {
    arabic: "أَغْتَسِلُ غُسْلَ عِيدِ الْأَضْحَىٰ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla ʿīdi l-aḍḥā qurbatan ilā-llāh.",
    translation: "I perform the ghusl of Eid al-Aḍḥā, seeking nearness to Allah.",
  },
  ihramSunni: {
    arabic: "نَوَيْتُ غُسْلَ الْإِحْرَامِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla l-iḥrāmi li-llāhi taʿālā.",
    translation: "I intend the ghusl of iḥrām for the sake of Allah.",
  },
  ihramShia: {
    arabic: "أَغْتَسِلُ غُسْلَ الْإِحْرَامِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla l-iḥrāmi qurbatan ilā-llāh.",
    translation: "I perform the ghusl of iḥrām, seeking nearness to Allah.",
  },
  tawbahSunni: {
    arabic: "نَوَيْتُ غُسْلَ التَّوْبَةِ لِلَّهِ تَعَالَىٰ",
    transliteration: "Nawaytu ghusla t-tawbati li-llāhi taʿālā.",
    translation: "I intend the ghusl of repentance for the sake of Allah.",
  },
  tawbahShia: {
    arabic: "أَغْتَسِلُ غُسْلَ التَّوْبَةِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla t-tawbati qurbatan ilā-llāh.",
    translation: "I perform the ghusl of repentance, seeking nearness to Allah.",
  },
  ghadir: {
    arabic: "أَغْتَسِلُ غُسْلَ عِيدِ الْغَدِيرِ قُرْبَةً إِلَى اللَّهِ",
    transliteration: "Aghtasilu ghusla ʿīdi l-ghadīri qurbatan ilā-llāh.",
    translation: "I perform the ghusl of Eid al-Ghadīr, seeking nearness to Allah.",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// GHUSL TYPES
// ═════════════════════════════════════════════════════════════════════════════

export const GHUSL_TYPES = [
  // ─── WĀJIB (obligatory) ──
  {
    id: "janabah",
    name: "Ghusl al-Janābah",
    arabicName: "غسل الجنابة",
    status: "wajib",
    category: "wajib",
    branches: ["sunni", "shia"],
    description: "Ghusl required after sexual intercourse, ejaculation, or post-orgasm. Without it, prayer, fasting, and recitation of the Qur'an are not permitted.",
    triggers: "After ejaculation (waking or otherwise), sexual intercourse (with or without ejaculation), or end of menstruation/postnatal bleeding (covered under separate types).",
    methods: {
      sunni: sunniMethod("Ghusl al-Janābah", N.janabahSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Janābah", N.janabahShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Janābah", N.janabahShia),
    },
    sources: [
      "Qur'an 5:6 (the verse of wuḍūʾ and ghusl)",
      "Ṣaḥīḥ al-Bukhārī 248 (the Prophet ﷺ's method, narrated by ʿĀʾisha)",
      "Ṣaḥīḥ Muslim 316",
      "al-Kāfī vol. 3 (Shia narrations)",
      "Sistani, Tawḍīḥ al-Masāʾil §362–391",
    ],
  },
  {
    id: "hayd",
    name: "Ghusl al-Ḥayḍ",
    arabicName: "غسل الحيض",
    status: "wajib",
    category: "wajib",
    branches: ["sunni", "shia"],
    description: "Ghusl required after the end of menstruation. Without it, prayer and fasting cannot resume.",
    genderNote: "For women.",
    triggers: "Performed after menstrual bleeding has fully stopped — confirmed by the woman herself.",
    methods: {
      sunni: sunniMethod("Ghusl al-Ḥayḍ", N.haydSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Ḥayḍ", N.haydShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Ḥayḍ", N.haydShia),
    },
    sources: [
      "Qur'an 2:222 (concerning menstruation)",
      "Ṣaḥīḥ al-Bukhārī 314 (hadith of ʿĀʾisha — using perfumed cloth after Ḥayḍ ghusl is recommended)",
      "Ṣaḥīḥ Muslim 332",
      "al-Kāfī vol. 3",
      "Sistani, Tawḍīḥ al-Masāʾil §444–456",
    ],
  },
  {
    id: "nifas",
    name: "Ghusl al-Nifās",
    arabicName: "غسل النفاس",
    status: "wajib",
    category: "wajib",
    branches: ["sunni", "shia"],
    description: "Ghusl required after the end of postnatal bleeding (up to 40 days). Without it, prayer cannot resume.",
    genderNote: "For women.",
    triggers: "Performed after postnatal bleeding has fully stopped, or by day 40 after birth at the latest (any bleeding past 40 days is treated as istiḥāḍah).",
    methods: {
      sunni: sunniMethod("Ghusl al-Nifās", N.nifasSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Nifās", N.nifasShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Nifās", N.nifasShia),
    },
    sources: [
      "Sunan Abī Dāwūd 312 (hadith on the maximum nifās period of 40 days)",
      "al-Kāfī vol. 3",
      "Sistani, Tawḍīḥ al-Masāʾil §504–520",
    ],
  },
  {
    id: "mass-al-mayyit",
    name: "Ghusl Mass al-Mayyit",
    arabicName: "غسل مس الميت",
    status: "wajib",
    category: "wajib",
    branches: ["shia"],
    description: "Ghusl required (in Shia fiqh) after touching a corpse that has cooled but has not yet had its own ghusl performed on it. Without it, prayer cannot be performed.",
    triggers: "Triggered specifically by touching the body of a deceased Muslim AFTER it has cooled and BEFORE the ghusl of the deceased has been performed on it. Touching after the deceased's ghusl is performed does NOT require this.",
    methods: {
      shiaTartibi: shiaTartibi("Ghusl Mass al-Mayyit", N.massAlMayyit),
      shiaIrtimasi: shiaIrtimasi("Ghusl Mass al-Mayyit", N.massAlMayyit),
    },
    sources: [
      "al-Kāfī vol. 3 — Book of the Funeral",
      "Sistani, Tawḍīḥ al-Masāʾil §526–540",
    ],
  },

  // ─── MUSTAḤABB (highly recommended) ──
  {
    id: "jumuah",
    name: "Ghusl al-Jumuʿah",
    arabicName: "غسل الجمعة",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["sunni", "shia"],
    description: "Ghusl performed before the Friday prayer. Considered highly recommended (sunnah muʾakkadah) in Sunni tradition and one of the most emphasized recommended ghusls in Shia tradition.",
    triggers: "Performed any time on Friday before the Friday prayer (Jumuʿah). The closer to the prayer, the better.",
    methods: {
      sunni: sunniMethod("Ghusl al-Jumuʿah", N.jumuahSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Jumuʿah", N.jumuahShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Jumuʿah", N.jumuahShia),
    },
    sources: [
      "Ṣaḥīḥ al-Bukhārī 877 (the Prophet ﷺ: 'It is the duty of every Muslim to perform ghusl on this day')",
      "Ṣaḥīḥ Muslim 846",
      "al-Kāfī vol. 3",
      "Sistani, Tawḍīḥ al-Masāʾil §644",
    ],
  },
  {
    id: "eid-fitr",
    name: "Ghusl Eid al-Fiṭr",
    arabicName: "غسل عيد الفطر",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["sunni", "shia"],
    description: "Ghusl performed on the morning of Eid al-Fiṭr before the Eid prayer. Sunnah muʾakkadah in both traditions.",
    triggers: "Performed on the day of Eid al-Fiṭr, ideally before the Eid prayer.",
    methods: {
      sunni: sunniMethod("Ghusl Eid al-Fiṭr", N.eidFitr),
      shiaTartibi: shiaTartibi("Ghusl Eid al-Fiṭr", N.eidFitrShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl Eid al-Fiṭr", N.eidFitrShia),
    },
    sources: [
      "Sunan Ibn Mājah 1315",
      "Muwaṭṭaʾ Mālik (chapter on Eid)",
      "al-Kāfī vol. 3",
      "Mafātīḥ al-Jinān (aʿmāl of Eid)",
    ],
  },
  {
    id: "eid-adha",
    name: "Ghusl Eid al-Aḍḥā",
    arabicName: "غسل عيد الأضحى",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["sunni", "shia"],
    description: "Ghusl performed on the morning of Eid al-Aḍḥā before the Eid prayer. Sunnah muʾakkadah in both traditions.",
    triggers: "Performed on the day of Eid al-Aḍḥā, ideally before the Eid prayer.",
    methods: {
      sunni: sunniMethod("Ghusl Eid al-Aḍḥā", N.eidAdha),
      shiaTartibi: shiaTartibi("Ghusl Eid al-Aḍḥā", N.eidAdhaShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl Eid al-Aḍḥā", N.eidAdhaShia),
    },
    sources: [
      "Sunan Ibn Mājah 1315",
      "al-Kāfī vol. 3",
      "Mafātīḥ al-Jinān",
    ],
  },
  {
    id: "ihram",
    name: "Ghusl al-Iḥrām",
    arabicName: "غسل الإحرام",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["sunni", "shia"],
    description: "Ghusl performed before entering the state of iḥrām for Ḥajj or ʿUmrah. Highly recommended; some scholars consider it close to wājib for those able.",
    triggers: "Performed before donning the iḥrām garment at the mīqāt (or before, if reaching the mīqāt in a state of iḥrām).",
    methods: {
      sunni: sunniMethod("Ghusl al-Iḥrām", N.ihramSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Iḥrām", N.ihramShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Iḥrām", N.ihramShia),
    },
    sources: [
      "Sunan al-Tirmidhī 830 (the Prophet ﷺ stripped for iḥrām and bathed)",
      "al-Kāfī vol. 4 — Book of Ḥajj",
      "Sistani, Manāsik al-Ḥajj",
    ],
  },
  {
    id: "tawbah",
    name: "Ghusl al-Tawbah",
    arabicName: "غسل التوبة",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["sunni", "shia"],
    description: "Ghusl performed at the time of sincere repentance from a major sin. Symbolizes outward purification accompanying inward turning to Allah.",
    triggers: "Performed at the moment of repentance, especially after major sins or after converting to Islam.",
    methods: {
      sunni: sunniMethod("Ghusl al-Tawbah", N.tawbahSunni),
      shiaTartibi: shiaTartibi("Ghusl al-Tawbah", N.tawbahShia),
      shiaIrtimasi: shiaIrtimasi("Ghusl al-Tawbah", N.tawbahShia),
    },
    sources: [
      "Sunan Abī Dāwūd 355 (the Prophet ﷺ commanded a new convert to bathe with water and lotus leaves)",
      "Mafātīḥ al-Jinān",
      "Sistani, Tawḍīḥ al-Masāʾil §651",
    ],
  },
  {
    id: "ghadir",
    name: "Ghusl Eid al-Ghadīr",
    arabicName: "غسل عيد الغدير",
    status: "mustahabb",
    category: "mustahabb",
    branches: ["shia"],
    description: "Ghusl performed on the 18th of Dhū al-Ḥijjah — the Day of Ghadīr — commemorating the Prophet ﷺ's declaration at Ghadīr Khumm. One of the highly recommended ghusls of the year in Shia tradition.",
    triggers: "Performed on the 18th of Dhū al-Ḥijjah, before the noon prayer.",
    methods: {
      shiaTartibi: shiaTartibi("Ghusl Eid al-Ghadīr", N.ghadir),
      shiaIrtimasi: shiaIrtimasi("Ghusl Eid al-Ghadīr", N.ghadir),
    },
    sources: [
      "Mafātīḥ al-Jinān (aʿmāl of the Day of Ghadīr)",
      "Iqbāl al-Aʿmāl",
      "Sistani, Tawḍīḥ al-Masāʾil §648",
    ],
  },
];

export function ghuslById(id) {
  return GHUSL_TYPES.find(g => g.id === id) || null;
}

export function ghuslsByCategory(category) {
  return GHUSL_TYPES.filter(g => g.category === category);
}
