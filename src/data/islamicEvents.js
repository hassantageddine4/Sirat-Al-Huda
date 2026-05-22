// src/data/islamicEvents.js
// ─────────────────────────────────────────────────────────────────────────────
// Yearly events keyed by Hijri (month + day), and weekly events keyed by
// Gregorian day-of-week (Friday).
//
// sect: "both" | "sunni" | "shia"
// description: short historical context for the event
// recommendations: optional array of practices to do on this day, each with:
//   { id, tradition, title, description, source }
//   tradition: "both" | "sunni" | "shia"
//   source: hadith citation (Sunni and/or Shia book)
//
// Events with `recommendations` get an interactive checklist in the DaySheet.
// State persists in localStorage keyed by event.id + Gregorian date.
//
// ⚠️ DRAFT — Recommendations require scholar review. Sources are drawn from
// public hadith corpora; specific hadith numbers should be re-verified.
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
// RECOMMENDATIONS — defined as constants to avoid duplication where the same
// recommendations apply to multiple events (e.g. Mawlid on 3/12 and 3/17).
// ═════════════════════════════════════════════════════════════════════════════

const ARAFAH_RECOMMENDATIONS = [
  {
    id: "fast",
    tradition: "both",
    title: "Fast the day",
    description: "Fasting the Day of ʿArafah expiates the minor sins of the past year and the coming year.",
    source: "Ṣaḥīḥ Muslim 1162; al-Kāfī vol. 4 (Book of Fasting)",
  },
  {
    id: "dua-prophet",
    tradition: "sunni",
    title: "Duʿāʾ of the Prophet ﷺ",
    description: "Recite the duʿāʾ the Prophet ﷺ taught for ʿArafah: 'Lā ilāha illa-llāhu waḥdahu lā sharīka lah...' Continue with personal supplication.",
    source: "Sunan al-Tirmidhī 3585",
  },
  {
    id: "dua-husayn",
    tradition: "shia",
    title: "Duʿāʾ of Imam al-Ḥusayn (ʿa)",
    description: "Recite the duʿāʾ of Imam al-Ḥusayn on the afternoon of ʿArafah — one of the most celebrated supplications in the Shia tradition.",
    source: "Mafātīḥ al-Jinān; Iqbāl al-Aʿmāl",
  },
  {
    id: "tahlil",
    tradition: "both",
    title: "Recite the Tahlīl 100 times",
    description: "'Lā ilāha illa-llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamd...' — named by the Prophet ﷺ as the best dhikr of ʿArafah.",
    source: "Sunan al-Tirmidhī 3585; Muwaṭṭaʾ Mālik",
  },
  {
    id: "salawat",
    tradition: "both",
    title: "Increase ṣalawāt on the Prophet ﷺ and his family",
    description: "Every ṣalawāt is multiplied in reward on this day. Pray for the Prophet ﷺ and his Ahl al-Bayt frequently.",
    source: "Qurʾan 33:56; Mafātīḥ al-Jinān",
  },
  {
    id: "ikhlas",
    tradition: "shia",
    title: "Recite Sūrat al-Ikhlāṣ frequently",
    description: "Reciting al-Ikhlāṣ on ʿArafah is reported to carry immense reward in the Shia tradition.",
    source: "Wasāʾil al-Shīʿa, Book of Worship",
  },
  {
    id: "istighfar",
    tradition: "both",
    title: "Seek forgiveness — Istighfār",
    description: "Repent sincerely for past sins. The doors of mercy are open wider on this day than any other.",
    source: "Ṣaḥīḥ Muslim 1348",
  },
  {
    id: "sadaqah",
    tradition: "both",
    title: "Give sadaqah (charity)",
    description: "Even small gifts given for the sake of Allah multiply on this day. Feed the hungry or contribute to a masjid.",
    source: "Qurʾan 2:261; Ṣaḥīḥ al-Bukhārī 1410",
  },
];

const ASHURA_RECOMMENDATIONS = [
  {
    id: "fast",
    tradition: "sunni",
    title: "Fast the day (with 9th or 11th of Muḥarram)",
    description: "Fasting the 10th of Muḥarram expiates the sins of the past year. Pair with the 9th or 11th to distinguish from the Jewish fast.",
    source: "Ṣaḥīḥ Muslim 1134; Ṣaḥīḥ al-Bukhārī 2004",
  },
  {
    id: "ziyarat-ashura",
    tradition: "shia",
    title: "Recite Ziyārat ʿĀshūrāʾ",
    description: "The famous ziyārat narrated from Imam al-Bāqir (ʿa) addressing Imam al-Ḥusayn (ʿa) — recited on the morning of ʿĀshūrāʾ with salām and curses upon his killers.",
    source: "al-Kāfī vol. 4; Mafātīḥ al-Jinān",
  },
  {
    id: "dua-alqamah",
    tradition: "shia",
    title: "Recite Duʿāʾ ʿAlqamah",
    description: "Recited immediately after Ziyārat ʿĀshūrāʾ. Imam al-Bāqir (ʿa) said reciting it on this day brings great reward.",
    source: "Mafātīḥ al-Jinān; Miṣbāḥ al-Mutahajjid",
  },
  {
    id: "majlis",
    tradition: "shia",
    title: "Attend a majlis remembering the martyrs",
    description: "Gather to remember Imam al-Ḥusayn (ʿa) and the martyrs of Karbalāʾ. Tears shed for him have great reward in the Shia tradition.",
    source: "Tradition of Imam al-Ṣādiq (ʿa); Biḥār al-Anwār",
  },
  {
    id: "sadaqah",
    tradition: "both",
    title: "Give sadaqah to the poor",
    description: "Increase charity on this day. Provide for the hungry and the needy.",
    source: "Qurʾan 2:261",
  },
  {
    id: "reflect",
    tradition: "both",
    title: "Reflect on the events of Karbalāʾ",
    description: "Recall the stand of Imam al-Ḥusayn (ʿa) and his companions against injustice. Learn from their sacrifice for the deen.",
    source: "Tradition",
  },
];

const LAYLAT_AL_QADR_RECOMMENDATIONS = [
  {
    id: "qiyam",
    tradition: "both",
    title: "Pray Qiyām al-Layl / Ṣalāt al-Layl",
    description: "Stand in prayer through the night. Worship on this night is better than 1,000 months — every prayer carries the reward of a lifetime's worship.",
    source: "Ṣaḥīḥ al-Bukhārī 1901; Qurʾan 97:3",
  },
  {
    id: "dua-pardon",
    tradition: "both",
    title: "Recite 'Allāhumma innaka ʿafuwwun...'",
    description: "The Prophet ﷺ taught ʿĀʾisha (ra) to recite: 'O Allah, You are Pardoning, You love to pardon, so pardon me.' (Allāhumma innaka ʿafuwwun tuḥibbu l-ʿafwa fa-ʿfu ʿannī.)",
    source: "Sunan al-Tirmidhī 3513; Sunan Ibn Mājah 3850",
  },
  {
    id: "jawshan",
    tradition: "shia",
    title: "Recite Duʿāʾ al-Jawshan al-Kabīr",
    description: "The Greater Jawshan — a long supplication invoking 1,000 names of Allah. Recited on the eve of Laylat al-Qadr.",
    source: "Mafātīḥ al-Jinān; Balad al-Amīn",
  },
  {
    id: "amal-quran",
    tradition: "shia",
    title: "Aʿmāl of Laylat al-Qadr (place Qurʾan on head)",
    description: "Open the Qurʾan, place it on your head, and recite: 'O Allah, by this Qurʾan, by what is in it, by the one You sent it to...' (full duʿāʾ in Mafātīḥ).",
    source: "Mafātīḥ al-Jinān; Iqbāl al-Aʿmāl",
  },
  {
    id: "qadr",
    tradition: "both",
    title: "Recite Sūrat al-Qadr",
    description: "Recite the sūrah about this very night — Qurʾan 97. Repeat throughout the night.",
    source: "Qurʾan 97",
  },
  {
    id: "itikaf",
    tradition: "both",
    title: "Spend the night in iʿtikāf at the masjid",
    description: "The Prophet ﷺ devoted himself to worship in the last ten nights of Ramadan, especially the odd nights. If unable to stay in the masjid, dedicate the night at home to worship.",
    source: "Ṣaḥīḥ Muslim 1167; Ṣaḥīḥ al-Bukhārī 2024",
  },
  {
    id: "istighfar",
    tradition: "both",
    title: "Istighfār — seek forgiveness",
    description: "This is the night when sins are forgiven. Ask Allah for forgiveness repeatedly with sincerity.",
    source: "Qurʾan 47:19; Ṣaḥīḥ al-Bukhārī 1901",
  },
];

const MAWLID_RECOMMENDATIONS = [
  {
    id: "salawat",
    tradition: "both",
    title: "Increase ṣalawāt on the Prophet ﷺ and his family",
    description: "Send blessings frequently upon the one for whose sake all of creation was made.",
    source: "Qurʾan 33:56; Ṣaḥīḥ al-Bukhārī 3370",
  },
  {
    id: "seerah",
    tradition: "both",
    title: "Read the seerah of the Prophet ﷺ",
    description: "Reflect on his life, character, and example. Learning his story is itself an act of love.",
    source: "Qurʾan 33:21; Ibn Hishām, al-Sīrah al-Nabawiyya",
  },
  {
    id: "feed",
    tradition: "both",
    title: "Feed the poor or host a gathering of remembrance",
    description: "Mark the day with generosity — feed those in need and gather family for dhikr and remembrance of the Prophet ﷺ.",
    source: "Ṣaḥīḥ al-Bukhārī 12 (best Islam is feeding food)",
  },
  {
    id: "burdah",
    tradition: "sunni",
    title: "Recite Qaṣīdah al-Burdah (or similar)",
    description: "Recite poems of praise composed in honour of the Prophet ﷺ — al-Būṣīrī's Burdah is the most famous.",
    source: "Tradition (popular in Sunni Mawlid observance)",
  },
  {
    id: "sadiq-dua",
    tradition: "shia",
    title: "Welcoming duʿāʾ for Imam al-Ṣādiq (ʿa)",
    description: "The 17th of Rabīʿ al-Awwal also marks the birth of the 6th Imam. Recite duʿāʾ of welcome and salām upon him.",
    source: "Mafātīḥ al-Jinān",
  },
  {
    id: "sadaqah",
    tradition: "both",
    title: "Give sadaqah in gratitude",
    description: "Express thanks to Allah for sending His Beloved ﷺ as a mercy to the worlds, by giving in His name.",
    source: "Qurʾan 21:107; Ṣaḥīḥ Muslim 2599",
  },
];

const GHADIR_RECOMMENDATIONS = [
  {
    id: "fast",
    tradition: "shia",
    title: "Fast the day",
    description: "Fasting on the 18th of Dhū al-Ḥijjah carries the reward of 60 months of fasting, according to narrations from Imam al-Ṣādiq (ʿa).",
    source: "al-Kāfī vol. 4; Wasāʾil al-Shīʿa",
  },
  {
    id: "ghusl",
    tradition: "shia",
    title: "Perform the ghusl (bathing) of Ghadīr",
    description: "Bathe before the ʿaṣr prayer to purify yourself for the day's worship.",
    source: "Mafātīḥ al-Jinān; al-Tahdhīb",
  },
  {
    id: "ziyarat-ghadir",
    tradition: "shia",
    title: "Recite Ziyārat al-Ghadīriyyah",
    description: "Address Imam ʿAlī (ʿa) with the ziyārat composed for this day — affirming the declaration made at Ghadīr Khumm.",
    source: "Mafātīḥ al-Jinān",
  },
  {
    id: "nudbah",
    tradition: "shia",
    title: "Recite Duʿāʾ al-Nudbah",
    description: "The duʿāʾ of lamentation for the awaited Imam al-Mahdī (ʿa) — recited on Eid days including Ghadīr.",
    source: "Mafātīḥ al-Jinān",
  },
  {
    id: "salawat",
    tradition: "shia",
    title: "Increase ṣalawāt on Muḥammad and his family",
    description: "Send abundant blessings on the Prophet ﷺ and the twelve Imams.",
    source: "Qurʾan 33:56; Mafātīḥ al-Jinān",
  },
  {
    id: "sadaqah",
    tradition: "shia",
    title: "Give sadaqah generously",
    description: "Mark the day with charity to the needy — a sunnah of the Ahl al-Bayt on every Eid.",
    source: "al-Kāfī vol. 4; Qurʾan 2:267",
  },
];

const EID_FITR_RECOMMENDATIONS = [
  {
    id: "zakat-fitr",
    tradition: "both",
    title: "Pay Zakāt al-Fiṭr before the Eid prayer",
    description: "An obligatory charity given on behalf of every member of the household, paid before the Eid prayer for it to count as zakāt al-fiṭr.",
    source: "Ṣaḥīḥ al-Bukhārī 1503; al-Kāfī vol. 4",
  },
  {
    id: "ghusl",
    tradition: "both",
    title: "Perform ghusl (bathing)",
    description: "Bathe before going to the Eid prayer. A sunnah of preparation for the day.",
    source: "Sunan Ibn Mājah 1315; Mafātīḥ al-Jinān",
  },
  {
    id: "best-clothes",
    tradition: "both",
    title: "Wear your best clothes and apply perfume",
    description: "Dress in your finest for the Eid day. The Prophet ﷺ had a special garment kept for Eid and Jumuʿah.",
    source: "Ṣaḥīḥ al-Bukhārī 887 (Hadith of ʿUmar)",
  },
  {
    id: "eat-dates",
    tradition: "sunni",
    title: "Eat an odd number of dates before Eid prayer",
    description: "The Prophet ﷺ would not go to the Eid al-Fiṭr prayer until he ate an odd number of dates — three, five, or seven.",
    source: "Ṣaḥīḥ al-Bukhārī 953",
  },
  {
    id: "takbir",
    tradition: "both",
    title: "Recite Takbīr on the way to the prayer",
    description: "Say 'Allāhu Akbar, Allāhu Akbar, lā ilāha illa-llāh, wa-llāhu akbar, Allāhu akbar wa li-llāhi l-ḥamd' on the way to the muṣallā.",
    source: "Qurʾan 2:185; Sunan al-Bayhaqī",
  },
  {
    id: "salat-eid",
    tradition: "both",
    title: "Pray Ṣalāt al-ʿĪd in congregation",
    description: "Two rakahs of Eid prayer, traditionally prayed in an open space (muṣallā) or in the masjid.",
    source: "Ṣaḥīḥ al-Bukhārī 956",
  },
  {
    id: "visit-family",
    tradition: "both",
    title: "Visit family, friends, and neighbours",
    description: "Mend ties, share food, and bring joy. Especially visit those who are alone or in difficulty.",
    source: "Ṣaḥīḥ al-Bukhārī 5985 (importance of kinship ties)",
  },
];

const EID_ADHA_RECOMMENDATIONS = [
  {
    id: "ghusl",
    tradition: "both",
    title: "Perform ghusl (bathing)",
    description: "Bathe before going to the Eid prayer.",
    source: "Sunan Ibn Mājah 1315",
  },
  {
    id: "best-clothes",
    tradition: "both",
    title: "Wear your best clothes",
    description: "Dress in your finest. The Prophet ﷺ kept a special garment for Eid.",
    source: "Ṣaḥīḥ al-Bukhārī 887",
  },
  {
    id: "takbir",
    tradition: "both",
    title: "Recite Takbīr from Fajr 9th through ʿAṣr 13th",
    description: "The Takbīrāt of Tashrīq — say after every obligatory prayer from Fajr of the 9th of Dhū al-Ḥijjah through ʿAṣr of the 13th.",
    source: "Sunan al-Dāraquṭnī; tradition of the Companions",
  },
  {
    id: "delay-eating",
    tradition: "sunni",
    title: "Don't eat before Eid prayer (eat after sacrifice)",
    description: "Unlike Eid al-Fiṭr, the Prophet ﷺ would not eat on the morning of Eid al-Aḍḥā until after the prayer — then eat from the sacrifice.",
    source: "Sunan al-Tirmidhī 542; Sunan Ibn Mājah 1756",
  },
  {
    id: "salat-eid",
    tradition: "both",
    title: "Pray Ṣalāt al-ʿĪd in congregation",
    description: "Two rakahs of Eid prayer, then listen to the khuṭbah.",
    source: "Ṣaḥīḥ al-Bukhārī 956",
  },
  {
    id: "qurbani",
    tradition: "both",
    title: "Offer the sacrifice (Qurbānī / Uḍḥiyah)",
    description: "Sacrifice an animal as commanded in remembrance of Prophet Ibrāhīm (ʿa). The meat is divided: one third for family, one third for friends, one third for the poor.",
    source: "Qurʾan 22:36; Ṣaḥīḥ al-Bukhārī 5546",
  },
  {
    id: "distribute-meat",
    tradition: "both",
    title: "Distribute the meat to the poor",
    description: "Ensure those in need receive their share. The sacrifice fulfils its purpose when shared.",
    source: "Qurʾan 22:28; Ṣaḥīḥ Muslim 1971",
  },
  {
    id: "visit-family",
    tradition: "both",
    title: "Visit family and the bereaved",
    description: "Mend ties and bring the joy of Eid to others, especially those who are alone.",
    source: "Tradition",
  },
];

const FRIDAY_RECOMMENDATIONS = [
  {
    id: "ghusl",
    tradition: "both",
    title: "Perform ghusl al-Jumuʿah (bathing for Friday)",
    description: "Bathe before the Friday prayer. The Prophet ﷺ said: 'It is the duty of every Muslim to perform ghusl on this day.'",
    source: "Ṣaḥīḥ al-Bukhārī 877; al-Kāfī vol. 3",
  },
  {
    id: "best-clothes",
    tradition: "both",
    title: "Wear your best clothes and apply perfume",
    description: "Dress well for Jumuʿah. Apply perfume (men). The Prophet ﷺ said: 'No man uses oil or perfume on Friday... except his sins are forgiven between this Friday and the next.'",
    source: "Ṣaḥīḥ al-Bukhārī 883",
  },
  {
    id: "surah-kahf",
    tradition: "both",
    title: "Recite Sūrat al-Kahf",
    description: "The Prophet ﷺ said: 'Whoever recites Sūrat al-Kahf on Friday, light will shine for him between the two Fridays.' May be recited Thursday night, Friday morning, or anytime during the day.",
    source: "al-Mustadrak ʿalā al-Ṣaḥīḥayn; Sunan al-Bayhaqī",
  },
  {
    id: "salawat",
    tradition: "both",
    title: "Increase ṣalawāt on the Prophet ﷺ",
    description: "The Prophet ﷺ said: 'Increase your ṣalawāt on me on Friday. Verily your ṣalawāt are presented to me.'",
    source: "Sunan Abī Dāwūd 1047; al-Kāfī vol. 3",
  },
  {
    id: "jumuah-prayer",
    tradition: "both",
    title: "Attend Jumuʿah prayer in congregation",
    description: "The Friday prayer is obligatory on Sunni men (Qurʾan 62:9), and highly recommended in the Shia tradition when conditions are met.",
    source: "Qurʾan 62:9; Ṣaḥīḥ al-Bukhārī 877",
  },
  {
    id: "special-hour",
    tradition: "both",
    title: "Make duʿāʾ in the special hour before Maghrib",
    description: "There is an hour on Friday when no Muslim asks Allah for good except He grants it. Most reported to be the last hour before Maghrib.",
    source: "Ṣaḥīḥ al-Bukhārī 935; Sunan Abī Dāwūd 1048",
  },
  {
    id: "dua-nudbah",
    tradition: "shia",
    title: "Recite Duʿāʾ al-Nudbah (morning)",
    description: "Recited on Friday mornings (and on the four Eid days). A duʿāʾ of longing for the awaited Imam al-Mahdī (ʿa).",
    source: "Mafātīḥ al-Jinān",
  },
  {
    id: "dua-simat",
    tradition: "shia",
    title: "Recite Duʿāʾ al-Simāt (after ʿAṣr)",
    description: "Recited in the last hour of Friday, before sunset. One of the most distinguished duʿāʾs for Friday in the Shia tradition.",
    source: "Mafātīḥ al-Jinān; Miṣbāḥ al-Mutahajjid",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// YEARLY EVENTS (Hijri month + day)
// ═════════════════════════════════════════════════════════════════════════════

export const EVENTS = [
  // ── Muharram (1) ──
  { month: 1, day: 1, name: "Islamic New Year", sect: "both",
    description: "Marks the beginning of the Hijri calendar, commemorating the Prophet Muhammad's ﷺ migration (Hijra) from Mecca to Medina in 622 CE — the foundational event of the Muslim community." },
  { month: 1, day: 9, name: "Day of Tasu'a", sect: "shia",
    description: "The 9th of Muharram — eve of Ashura. Imam Husayn (a) and his companions camped at Karbala on this day before the battle on the morrow." },
  { id: "ashura", month: 1, day: 10, name: "Day of Ashura", sect: "both",
    description: "The 10th of Muharram. Sunnis: the day Allah saved Musa (a) from Pharaoh — fasting recommended. Shia: the martyrdom of Imam Husayn (a), his family, and 72 companions at Karbala in 61 AH (680 CE).",
    recommendations: ASHURA_RECOMMENDATIONS },
  { month: 1, day: 13, name: "Battle of Karbala continues", sect: "shia",
    description: "Aftermath of the massacre — the captives, including Imam Zayn al-Abidin (a) and Lady Zaynab (a), were taken to Kufa and then Damascus." },
  { month: 1, day: 25, name: "Martyrdom of Imam Zayn al-Abidin (a)", sect: "shia",
    description: "Ali ibn al-Husayn al-Sajjad — the fourth Imam — was poisoned in Medina in 95 AH. Known for Sahifa al-Sajjadiyya, his celebrated book of supplications." },

  // ── Safar (2) ──
  { month: 2, day: 1, name: "Imam Husayn's family arrives Damascus", sect: "shia",
    description: "The captives of Karbala arrived at the court of Yazid in Damascus on this day in 61 AH, beginning the famous sermons of Imam Zayn al-Abidin (a) and Lady Zaynab (a)." },
  { month: 2, day: 7, name: "Martyrdom of Imam Hasan al-Mujtaba (a)", sect: "shia",
    description: "Hasan ibn Ali — the second Imam — poisoned by Mu'awiya through his wife Ja'da in 50 AH. Known for surrendering political authority to prevent bloodshed." },
  { month: 2, day: 20, name: "Arba'een — 40 days after Ashura", sect: "both",
    description: "Marks 40 days since the martyrdom of Imam Husayn (a). Millions of pilgrims walk to Karbala — one of the largest annual gatherings of humanity." },
  { month: 2, day: 28, name: "Demise of the Prophet Muhammad ﷺ", sect: "both",
    description: "The Prophet ﷺ passed away in Medina in 11 AH (632 CE) at age 63, in the lap of his wife Aisha (ra). His last words: 'O Allah, the Highest Companion.'" },
  { month: 2, day: 28, name: "Martyrdom of Imam Hasan al-Mujtaba (a)", sect: "shia",
    description: "Alternative Shia tradition placing his martyrdom on this date. See also 7 Safar." },
  { month: 2, day: 30, name: "Martyrdom of Imam Ali al-Rida (a)", sect: "shia",
    description: "Ali ibn Musa — the eighth Imam — poisoned by Caliph al-Ma'mun with grapes in Tus (Mashhad), Iran in 203 AH. His shrine is one of the holiest sites in Shia Islam." },

  // ── Rabi al-Awwal (3) ──
  { month: 3, day: 1, name: "Beginning of the Hijra", sect: "both",
    description: "The Prophet Muhammad ﷺ left his house in Mecca on this night with Abu Bakr (ra), beginning the migration to Medina that would establish the first Muslim state." },
  { month: 3, day: 8, name: "Beginning of Imamate of Imam al-Mahdi (a)", sect: "shia",
    description: "After the martyrdom of his father Imam Hasan al-Askari (a) in 260 AH, the 12th Imam Muhammad al-Mahdi (a) began his Imamate — initiating the Minor Occultation." },
  { id: "mawlid-sunni", month: 3, day: 12, name: "Mawlid an-Nabi ﷺ", sect: "sunni",
    description: "Sunni date for the birth of the Prophet Muhammad ﷺ in 570 CE, the Year of the Elephant. Celebrated worldwide with gatherings, poetry, and remembrance.",
    recommendations: MAWLID_RECOMMENDATIONS },
  { id: "mawlid-shia", month: 3, day: 17, name: "Mawlid an-Nabi ﷺ & Imam al-Sadiq (a)", sect: "shia",
    description: "Shia date for the Prophet's ﷺ birth. Also the birthday of Imam Ja'far al-Sadiq (a) in 83 AH — the 6th Imam and founder of the Ja'fari school of jurisprudence.",
    recommendations: MAWLID_RECOMMENDATIONS },

  // ── Rabi al-Thani (4) ──
  { month: 4, day: 8, name: "Birth of Imam Hasan al-Askari (a)", sect: "shia",
    description: "Hasan ibn Ali al-Askari — the 11th Imam — born in Medina in 232 AH. Father of Imam al-Mahdi (a), the awaited Mahdi." },
  { month: 4, day: 10, name: "Demise of Lady Fatima al-Ma'suma (a)", sect: "shia",
    description: "Sister of Imam al-Rida (a) — passed away in Qom in 201 AH while traveling to visit her brother. Her shrine made Qom the spiritual capital of Shia Islam." },

  // ── Jumada al-Awwal (5) ──
  { month: 5, day: 13, name: "Martyrdom of Lady Fatima al-Zahra (a)", sect: "shia",
    description: "Daughter of the Prophet ﷺ and wife of Imam Ali (a). Some traditions place her martyrdom 75 days after her father's passing, in 11 AH. The first martyrdom of the Ahlul Bayt." },
  { month: 5, day: 15, name: "Birth of Imam Zayn al-Abidin (a)", sect: "shia",
    description: "Ali ibn al-Husayn — the 4th Imam, son of Imam Husayn (a) — born in 38 AH. Witnessed and survived the tragedy of Karbala as a young man." },

  // ── Jumada al-Thani (6) ──
  { month: 6, day: 3, name: "Martyrdom of Lady Fatima al-Zahra (a)", sect: "shia",
    description: "Alternative tradition placing her martyrdom 95 days after the Prophet's ﷺ passing. The most widely observed date among Twelver Shia." },
  { month: 6, day: 20, name: "Birth of Lady Fatima al-Zahra (a)", sect: "shia",
    description: "Born in Mecca to the Prophet ﷺ and Lady Khadija (a) in 5 BH (615 CE). Mother of Hasan and Husayn (a), wife of Ali (a). Celebrated also as Women's Day in some Shia communities." },

  // ── Rajab (7) ──
  { month: 7, day: 1, name: "Birth of Imam Muhammad al-Baqir (a)", sect: "shia",
    description: "Muhammad ibn Ali — the 5th Imam — born in Medina in 57 AH. Father of Imam al-Sadiq (a). Famous for opening the gates of religious knowledge to his community." },
  { month: 7, day: 10, name: "Birth of Imam Muhammad al-Jawad (a)", sect: "shia",
    description: "Muhammad ibn Ali al-Taqi — the 9th Imam — born in Medina in 195 AH. Became Imam at age 7, recognized for extraordinary knowledge despite his youth." },
  { month: 7, day: 13, name: "Birth of Imam Ali (a)", sect: "shia",
    description: "Ali ibn Abi Talib — the 1st Imam and 4th Sunni Caliph — born inside the Ka'ba in Mecca in 600 CE. The only person ever born inside Allah's Sacred House. Cousin and son-in-law of the Prophet ﷺ." },
  { month: 7, day: 15, name: "Death of Lady Zaynab bint Ali (a)", sect: "shia",
    description: "Daughter of Imam Ali (a) and Lady Fatima (a) — passed away in 62 AH. Heroine of Karbala whose sermons in Kufa and Damascus exposed the crimes of Yazid." },
  { month: 7, day: 25, name: "Martyrdom of Imam Musa al-Kazim (a)", sect: "shia",
    description: "Musa ibn Ja'far — the 7th Imam — poisoned in the prison of Harun al-Rashid in Baghdad in 183 AH. His shrine in Kazimiyya is a major pilgrimage site." },
  { month: 7, day: 27, name: "Laylat al-Mi'raj — Night Journey", sect: "both",
    description: "The Isra and Mi'raj — the Prophet ﷺ's miraculous journey from Mecca to Jerusalem and then ascension through the heavens, where the five daily prayers were prescribed. 10 BH (621 CE)." },

  // ── Sha'ban (8) ──
  { month: 8, day: 3, name: "Birth of Imam Husayn (a)", sect: "shia",
    description: "Husayn ibn Ali — the 3rd Imam, grandson of the Prophet ﷺ — born in Medina in 4 AH. Beloved of the Prophet ﷺ, martyred at Karbala in 61 AH." },
  { month: 8, day: 4, name: "Birth of Abbas ibn Ali (a)", sect: "shia",
    description: "Half-brother of Imam Husayn (a) — the loyal standard-bearer of Karbala. Famous for refusing to drink water while the family of the Prophet ﷺ thirsted." },
  { month: 8, day: 5, name: "Birth of Imam Zayn al-Abidin (a)", sect: "shia",
    description: "Alternative tradition for the birth of the 4th Imam." },
  { month: 8, day: 15, name: "Mid-Sha'ban — Laylat al-Bara'ah", sect: "both",
    description: "The 'Night of Records' — Sunnis recognize as a night when destinies are recorded. Shia: birth of Imam al-Mahdi (a) in 255 AH — the awaited 12th Imam." },

  // ── Ramadan (9) ──
  { month: 9, day: 1, name: "Beginning of Ramadan", sect: "both",
    description: "The blessed month of fasting begins. Quran 2:185: 'The month of Ramadan in which was revealed the Quran, a guidance for mankind.'" },
  { month: 9, day: 15, name: "Birth of Imam Hasan (a)", sect: "shia",
    description: "Hasan ibn Ali — the 2nd Imam — born in Medina in 3 AH. Beloved grandson of the Prophet ﷺ who said: 'Hasan and Husayn are the chiefs of the youth of Paradise.'" },
  { month: 9, day: 17, name: "Battle of Badr", sect: "both",
    description: "The first major battle of Islam in 2 AH (624 CE). The Muslims, 313 strong, defeated 1,000 Meccan pagans through divine intervention. Established the Muslim community's military capability." },
  { month: 9, day: 19, name: "Imam Ali (a) struck in the mosque", sect: "shia",
    description: "While praying Fajr in the mosque of Kufa in 40 AH, Imam Ali (a) was struck on the head by Ibn Muljam's poisoned sword. He lived three more days." },
  { month: 9, day: 21, name: "Martyrdom of Imam Ali (a)", sect: "shia",
    description: "Ali ibn Abi Talib — the 1st Imam and 4th Sunni Caliph — passed away from his wound in Kufa in 40 AH (661 CE). His shrine in Najaf became the holiest city of Shia Islam." },
  { month: 9, day: 21, name: "Conquest of Mecca", sect: "both",
    description: "The Prophet ﷺ entered Mecca peacefully with 10,000 Muslims in 8 AH (630 CE), cleansing the Ka'ba of idols. He forgave the Quraysh who had persecuted him for years." },
  { id: "qadr-both", month: 9, day: 23, name: "Laylat al-Qadr (commonly observed)", sect: "both",
    description: "The 'Night of Decree' — when the first verses of the Quran were revealed to the Prophet ﷺ in the Cave of Hira in 610 CE. Worship on this night is better than 1,000 months.",
    recommendations: LAYLAT_AL_QADR_RECOMMENDATIONS },
  { id: "qadr-sunni", month: 9, day: 27, name: "Laylat al-Qadr (Sunni tradition)", sect: "sunni",
    description: "Most widely observed night for Laylat al-Qadr in Sunni tradition, often called the 'Night of Power.'",
    recommendations: LAYLAT_AL_QADR_RECOMMENDATIONS },

  // ── Shawwal (10) ──
  { id: "eid-fitr", month: 10, day: 1, name: "Eid al-Fitr", sect: "both",
    description: "The Festival of Breaking the Fast — celebrates the completion of Ramadan. One of the two great festivals of Islam. Zakat al-Fitr must be paid before the Eid prayer.",
    recommendations: EID_FITR_RECOMMENDATIONS },
  { month: 10, day: 17, name: "Battle of Uhud", sect: "both",
    description: "The Muslims faced Quraysh forces near Mount Uhud in 3 AH (625 CE). A near-victory turned costly when archers left their position. The Prophet's ﷺ uncle Hamza (ra) was martyred." },
  { month: 10, day: 25, name: "Martyrdom of Imam Ja'far al-Sadiq (a)", sect: "shia",
    description: "Ja'far ibn Muhammad — the 6th Imam — poisoned by Caliph al-Mansur in Medina in 148 AH. Founded the Ja'fari madhhab; taught over 4,000 students including Abu Hanifa and Malik." },

  // ── Dhul Qi'dah (11) ──
  { month: 11, day: 1, name: "Birth of Lady Fatima al-Ma'suma (a)", sect: "shia",
    description: "Sister of Imam al-Rida (a) — born in 173 AH. Her shrine in Qom is the spiritual heart of Iranian Shi'ism." },
  { month: 11, day: 11, name: "Birth of Imam Ali al-Rida (a)", sect: "shia",
    description: "Ali ibn Musa — the 8th Imam — born in Medina in 148 AH. Designated heir-apparent by Caliph al-Ma'mun, then poisoned. Buried in Mashhad, the second holiest Shia city." },
  { month: 11, day: 29, name: "Martyrdom of Imam Muhammad al-Jawad (a)", sect: "shia",
    description: "Muhammad ibn Ali al-Taqi — the 9th Imam — poisoned by Caliph al-Mu'tasim in Baghdad in 220 AH at age 25. Despite his youth, recognized as the greatest scholar of his era." },

  // ── Dhul Hijjah (12) ──
  { month: 12, day: 1, name: "Marriage of Imam Ali (a) & Lady Fatima (a)", sect: "shia",
    description: "The blessed marriage of the Prophet's ﷺ cousin Ali (a) and his daughter Fatima (a) in 2 AH. Their lineage produced the 12 Imams and the Sayyid descendants." },
  { month: 12, day: 7, name: "Martyrdom of Imam Muhammad al-Baqir (a)", sect: "shia",
    description: "Muhammad ibn Ali — the 5th Imam — poisoned in Medina in 114 AH by command of Caliph Hisham. Father of Imam al-Sadiq (a)." },
  { month: 12, day: 8, name: "Day of Tarwiyah", sect: "both",
    description: "Pilgrims journey from Mecca to Mina to begin the Hajj rituals. The name means 'day of drinking,' referring to ancient pilgrims watering their camels." },
  { id: "arafah", month: 12, day: 9, name: "Day of Arafah", sect: "both",
    description: "The greatest day of Hajj — pilgrims gather at Mount Arafah in supplication from noon to sunset. The Prophet ﷺ delivered his Farewell Sermon here in 10 AH. Fasting recommended for non-pilgrims.",
    recommendations: ARAFAH_RECOMMENDATIONS },
  { id: "eid-adha", month: 12, day: 10, name: "Eid al-Adha", sect: "both",
    description: "The Festival of Sacrifice — commemorates Prophet Ibrahim's (a) willingness to sacrifice his son. Muslims sacrifice animals and distribute the meat to the poor. Hajj pilgrims complete their rites.",
    recommendations: EID_ADHA_RECOMMENDATIONS },
  { month: 12, day: 15, name: "Birth of Imam Ali al-Hadi (a)", sect: "shia",
    description: "Ali ibn Muhammad al-Naqi — the 10th Imam — born in Medina in 212 AH. Father of Imam al-Askari (a). Held under house arrest in Samarra most of his life." },
  { id: "ghadir", month: 12, day: 18, name: "Eid al-Ghadir", sect: "shia",
    description: "At Ghadir Khumm in 10 AH, the Prophet ﷺ declared: 'Whoever I am his master (mawla), Ali is his master.' Shia commemorate this as the Prophet's ﷺ designation of Imam Ali (a) as his successor.",
    recommendations: GHADIR_RECOMMENDATIONS },
  { month: 12, day: 24, name: "Day of Mubahala", sect: "shia",
    description: "In 10 AH, the Prophet ﷺ invited the Christians of Najran to a mutual cursing (mubahala) over their theological dispute, bringing only Ali, Fatima, Hasan, and Husayn (a). Quran 3:61 was revealed about this event." },
];

// ═════════════════════════════════════════════════════════════════════════════
// WEEKLY EVENTS (Gregorian day of week)
//   dayOfWeek: 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
// ═════════════════════════════════════════════════════════════════════════════

export const WEEKLY_EVENTS = [
  {
    id: "friday",
    dayOfWeek: 5,
    name: "Yawm al-Jumuʿah — Friday",
    sect: "both",
    description: "The most blessed day of the week. The Prophet ﷺ said: 'The best day on which the sun rises is Friday — on it Adam (ʿa) was created, on it he was admitted to Paradise, and on it the Hour will not be established except on a Friday.'",
    recommendations: FRIDAY_RECOMMENDATIONS,
  },
];

export function eventsFor(month, day) {
  return EVENTS.filter(e => e.month === month && e.day === day);
}
