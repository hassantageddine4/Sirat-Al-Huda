// src/data/islamicEvents.js
// Sunni + Shia events keyed by Hijri month + day.
// sect: "both" | "sunni" | "shia"
// description: short historical context for the event
export const EVENTS = [
  // ── Muharram (1) ──
  { month: 1, day: 1, name: "Islamic New Year", sect: "both",
    description: "Marks the beginning of the Hijri calendar, commemorating the Prophet Muhammad's ﷺ migration (Hijra) from Mecca to Medina in 622 CE — the foundational event of the Muslim community." },
  { month: 1, day: 9, name: "Day of Tasu'a", sect: "shia",
    description: "The 9th of Muharram — eve of Ashura. Imam Husayn (a) and his companions camped at Karbala on this day before the battle on the morrow." },
  { month: 1, day: 10, name: "Day of Ashura", sect: "both",
    description: "The 10th of Muharram. Sunnis: the day Allah saved Musa (a) from Pharaoh — fasting recommended. Shia: the martyrdom of Imam Husayn (a), his family, and 72 companions at Karbala in 61 AH (680 CE)." },
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
  { month: 3, day: 12, name: "Mawlid an-Nabi ﷺ", sect: "sunni",
    description: "Sunni date for the birth of the Prophet Muhammad ﷺ in 570 CE, the Year of the Elephant. Celebrated worldwide with gatherings, poetry, and remembrance." },
  { month: 3, day: 17, name: "Mawlid an-Nabi ﷺ & Imam al-Sadiq (a)", sect: "shia",
    description: "Shia date for the Prophet's ﷺ birth. Also the birthday of Imam Ja'far al-Sadiq (a) in 83 AH — the 6th Imam and founder of the Ja'fari school of jurisprudence." },

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
  { month: 9, day: 23, name: "Laylat al-Qadr (commonly observed)", sect: "both",
    description: "The 'Night of Decree' — when the first verses of the Quran were revealed to the Prophet ﷺ in the Cave of Hira in 610 CE. Worship on this night is better than 1,000 months." },
  { month: 9, day: 27, name: "Laylat al-Qadr (Sunni tradition)", sect: "sunni",
    description: "Most widely observed night for Laylat al-Qadr in Sunni tradition, often called the 'Night of Power.'" },

  // ── Shawwal (10) ──
  { month: 10, day: 1, name: "Eid al-Fitr", sect: "both",
    description: "The Festival of Breaking the Fast — celebrates the completion of Ramadan. One of the two great festivals of Islam. Zakat al-Fitr must be paid before the Eid prayer." },
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
  { month: 12, day: 9, name: "Day of Arafah", sect: "both",
    description: "The greatest day of Hajj — pilgrims gather at Mount Arafah in supplication from noon to sunset. The Prophet ﷺ delivered his Farewell Sermon here in 10 AH. Fasting recommended for non-pilgrims." },
  { month: 12, day: 10, name: "Eid al-Adha", sect: "both",
    description: "The Festival of Sacrifice — commemorates Prophet Ibrahim's (a) willingness to sacrifice his son. Muslims sacrifice animals and distribute the meat to the poor. Hajj pilgrims complete their rites." },
  { month: 12, day: 15, name: "Birth of Imam Ali al-Hadi (a)", sect: "shia",
    description: "Ali ibn Muhammad al-Naqi — the 10th Imam — born in Medina in 212 AH. Father of Imam al-Askari (a). Held under house arrest in Samarra most of his life." },
  { month: 12, day: 18, name: "Eid al-Ghadir", sect: "shia",
    description: "At Ghadir Khumm in 10 AH, the Prophet ﷺ declared: 'Whoever I am his master (mawla), Ali is his master.' Shia commemorate this as the Prophet's ﷺ designation of Imam Ali (a) as his successor." },
  { month: 12, day: 24, name: "Day of Mubahala", sect: "shia",
    description: "In 10 AH, the Prophet ﷺ invited the Christians of Najran to a mutual cursing (mubahala) over their theological dispute, bringing only Ali, Fatima, Hasan, and Husayn (a). Quran 3:61 was revealed about this event." },
];

export function eventsFor(month, day) {
  return EVENTS.filter(e => e.month === month && e.day === day);
}
