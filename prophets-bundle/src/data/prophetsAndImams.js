// src/data/prophetsAndImams.js
// ─────────────────────────────────────────────────────────────────────────────
// Biographical data for the prophets mentioned in the Qur'an, the Prophet
// Muhammad ﷺ, and the 12 Imams (recognized in Shia tradition).
//
// Sunni and Shia readers will both find familiar figures here. The Imams
// section is included because Sirat is intended as an inclusive companion;
// the section header makes the tradition clear so readers can choose what
// to read.
// ─────────────────────────────────────────────────────────────────────────────

export const PROPHETS = [
  {
    id: "adam",
    name: "Adam",
    arabic: "آدَم",
    title: "Father of humankind",
    period: "The first human",
    bio: "The first human and the first prophet, created by Allah from clay. Allah taught him the names of all things, gave him a station above the angels, and placed him and his wife Hawwa (Eve) in Paradise. After they ate from the forbidden tree, they descended to Earth, where Adam became the father of humanity.",
    lessons: [
      "Sincere repentance is always accepted by Allah.",
      "Knowledge is among Allah's greatest gifts to humanity.",
      "Shaytan is humanity's persistent enemy — vigilance is required.",
    ],
    quranRef: "Surah al-Baqarah 2:30–37",
  },
  {
    id: "nuh",
    name: "Nuh (Noah)",
    arabic: "نُوح",
    title: "The patient warner",
    period: "Pre-history",
    bio: "Allah sent Nuh to a people who had drifted into idol-worship. He called them to tawhid for 950 years, met with mockery and rejection by all but a few. Allah commanded him to build an ark, and a great flood came as a punishment for those who refused to believe. Nuh, his believing family, and pairs of every kind of animal were saved.",
    lessons: [
      "Patience and persistence in calling to truth, even with little visible result.",
      "True family is bonded by faith, not blood alone.",
      "Allah's mercy and His justice are inseparable.",
    ],
    quranRef: "Surah Hud 11:25–49, Surah Nuh",
  },
  {
    id: "ibrahim",
    name: "Ibrahim (Abraham)",
    arabic: "إِبْرَاهِيم",
    title: "Khalil Allah — friend of Allah",
    period: "c. 2000 BCE",
    bio: "The patriarch from whose line came many prophets including Isma'il, Ishaq, Ya'qub, Yusuf, Musa, 'Isa, and Muhammad ﷺ. Ibrahim broke the idols of his people, was thrown into a fire which Allah made cool, and journeyed across the lands calling to monotheism. He and his son Isma'il built the Ka'bah in Makkah. He is known as the friend of Allah.",
    lessons: [
      "Pure tawhid — worship of Allah alone — is the foundation of faith.",
      "Trust in Allah's wisdom even when His commands defy reason (the sacrifice of Isma'il).",
      "True faith requires standing firm even when alone against an entire society.",
    ],
    quranRef: "Surah Ibrahim, Surah al-An'am 6:74–83, Surah as-Saffat 37:83–113",
  },
  {
    id: "musa",
    name: "Musa (Moses)",
    arabic: "مُوسَىٰ",
    title: "Kalim Allah — the one Allah spoke to",
    period: "c. 1300 BCE",
    bio: "Born in Egypt during the persecution of the Israelites, Musa was raised in Pharaoh's palace by divine decree. After fleeing to Madyan and marrying the daughter of Shu'ayb, Allah spoke to him directly at Mount Tur and commissioned him to confront Pharaoh. He led the Israelites out of slavery, parted the sea by Allah's command, and received the Torah on Mount Sinai.",
    lessons: [
      "No tyrant is too powerful when Allah is on your side.",
      "Eloquence and courage are gifts to be sought from Allah.",
      "Even prophets had moments of struggle and grew through them.",
    ],
    quranRef: "Surah al-Qasas, Surah Ta-Ha, Surah ash-Shu'ara",
  },
  {
    id: "isa",
    name: "'Isa (Jesus)",
    arabic: "عِيسَىٰ",
    title: "Ruh Allah — Spirit of Allah",
    period: "c. 1 BCE",
    bio: "Born miraculously to the Virgin Maryam without a father — a sign for all peoples. He spoke from the cradle, healed the blind and lepers by Allah's permission, gave life to the dead by Allah's leave, and called the Children of Israel to the worship of one God. He was not crucified but raised to Allah, and will return before the Day of Judgment.",
    lessons: [
      "Mercy and compassion are core to a prophet's mission.",
      "Allah's signs in nature and in His messengers are clear for those who reflect.",
      "Faith is not inherited — each soul stands before Allah on its own.",
    ],
    quranRef: "Surah Maryam, Surah Ali 'Imran 3:42–59, Surah al-Ma'idah 5:110–117",
  },
  {
    id: "muhammad",
    name: "Muhammad ﷺ",
    arabic: "مُحَمَّد ﷺ",
    title: "Khatam an-Nabiyyin — Seal of the Prophets",
    period: "570–632 CE",
    bio: "The final Messenger of Allah, born in Makkah and orphaned young. Known even before prophethood as al-Amin (the trustworthy). At forty, he received the first revelation in the cave of Hira through the angel Jibril. Over twenty-three years he received the Qur'an, transformed Arabia from idolatry to tawhid, and established a community whose teachings would reach every corner of the earth. His character, mercy, and steadfastness are the model for every Muslim.",
    lessons: [
      "The Qur'an and the Sunnah are the two weights left for guidance.",
      "His character — gentle, just, generous — is the standard for our own.",
      "Mercy to all of creation is the heart of his message.",
    ],
    quranRef: "Surah al-Ahzab 33:40, Surah al-Anbiya 21:107",
  },
];

export const IMAMS = [
  {
    id: "ali",
    name: "Imam Ali ibn Abi Talib",
    arabic: "عَلِي بْن أَبِي طَالِب",
    title: "Amir al-Mu'minin — Commander of the Faithful",
    period: "c. 600–661 CE",
    bio: "Cousin and son-in-law of the Prophet Muhammad ﷺ, raised in his household, the first young person to accept Islam. Renowned for his courage at Badr, Uhud, and Khaybar, his deep knowledge of the Qur'an, and his eloquence — preserved in Nahj al-Balagha. He was the fourth caliph in the Sunni tradition and the first Imam in Shia tradition.",
    lessons: [
      "Justice without compromise, even toward one's own household.",
      "Knowledge is wealth that grows when shared.",
      "Speak truth even when it costs you.",
    ],
  },
  {
    id: "hasan",
    name: "Imam Hasan ibn Ali",
    arabic: "الْحَسَن بْن عَلِي",
    title: "The grandson of the Prophet ﷺ",
    period: "624–670 CE",
    bio: "Eldest son of Imam Ali and Fatima az-Zahra, beloved grandson of the Prophet ﷺ, known for his generosity and quiet wisdom. He chose peace over war when conflict threatened the Muslim community, abdicating the caliphate to preserve unity.",
    lessons: [
      "Peace over personal claim — the welfare of the community comes first.",
      "Generosity is a habit of the heart, not the wallet.",
    ],
  },
  {
    id: "husayn",
    name: "Imam Husayn ibn Ali",
    arabic: "الْحُسَيْن بْن عَلِي",
    title: "Sayyid ash-Shuhada — Master of the Martyrs",
    period: "626–680 CE",
    bio: "Younger son of Imam Ali and Fatima az-Zahra. He stood against the tyranny of Yazid at Karbala, where he and his small band were martyred on the 10th of Muharram (Ashura). His sacrifice has remained, across centuries, the most powerful symbol of standing for justice in the face of overwhelming oppression.",
    lessons: [
      "Truth is worth every cost — even one's life.",
      "Tyranny must be opposed, no matter the odds.",
      "A small band on the right side outweighs a large army on the wrong side.",
    ],
  },
  {
    id: "zayn-al-abidin",
    name: "Imam Ali Zayn al-Abidin",
    arabic: "عَلِي زَيْن الْعَابِدِين",
    title: "The ornament of the worshippers",
    period: "658–713 CE",
    bio: "Son of Imam Husayn, survived Karbala due to illness. Spent his life in worship and teaching, leaving behind the Sahifa Sajjadiyya — a collection of supplications that remains one of the most beloved du'a texts in Islamic literature.",
    lessons: [
      "Du'a is the marrow of worship.",
      "After tragedy, devotion to Allah is the path back to peace.",
    ],
  },
  {
    id: "al-baqir",
    name: "Imam Muhammad al-Baqir",
    arabic: "مُحَمَّد الْبَاقِر",
    title: "The one who splits open knowledge",
    period: "676–733 CE",
    bio: "Son of Imam Zayn al-Abidin, named al-Baqir (the one who splits open knowledge) by the Prophet ﷺ in a hadith narrated by Jabir ibn Abdullah. He gathered students from all over the Muslim world and laid the foundation for the school later associated with his son Ja'far as-Sadiq.",
    lessons: [
      "Pursuit of knowledge is a lifelong worship.",
      "Teach openly — the door of Allah's knowledge is wide.",
    ],
  },
  {
    id: "al-sadiq",
    name: "Imam Ja'far al-Sadiq",
    arabic: "جَعْفَر الصَّادِق",
    title: "The truthful",
    period: "702–765 CE",
    bio: "One of the most influential teachers in Islamic intellectual history. Both Imam Abu Hanifah and Imam Malik counted themselves among his students. His school produced scholars in fiqh, hadith, theology, and natural sciences. Trusted by all schools of thought for the authenticity of his transmissions.",
    lessons: [
      "Sincerity in speech and action — that is sadiq.",
      "Knowledge benefits everyone when offered without sectarian wall.",
    ],
  },
  {
    id: "al-kazim",
    name: "Imam Musa al-Kazim",
    arabic: "مُوسَى الْكَاظِم",
    title: "The one who restrains anger",
    period: "745–799 CE",
    bio: "Known for his immense forbearance under persecution by the Abbasid caliphs Mahdi, Hadi, and Harun ar-Rashid. He spent years in prison, where he continued to teach and worship. His patience under oppression earned him the title al-Kazim.",
    lessons: [
      "Restraint in anger is a strength greater than physical force.",
      "Faith does not require freedom — only sincerity.",
    ],
  },
  {
    id: "al-rida",
    name: "Imam Ali al-Rida",
    arabic: "عَلِي الرِّضَا",
    title: "The accepted one",
    period: "765–818 CE",
    bio: "Made heir-apparent by the caliph al-Ma'mun, though he never sought political power. Famous for the public debates with scholars of every tradition — Christians, Jews, Zoroastrians, materialists — in which he answered with deep knowledge and gentle conviction.",
    lessons: [
      "Engage other traditions with knowledge, not hostility.",
      "Power is a test more than a privilege.",
    ],
  },
  {
    id: "al-jawad",
    name: "Imam Muhammad al-Jawad",
    arabic: "مُحَمَّد الْجَوَاد",
    title: "The generous",
    period: "811–835 CE",
    bio: "Became Imam at the age of seven after the death of his father al-Rida. Despite his youth, scholars from across the Muslim world came to test his knowledge and were astonished by his answers. He was known for his generosity to the poor.",
    lessons: [
      "Wisdom is a gift — age is not its measure.",
      "Generosity to the needy is among the highest acts.",
    ],
  },
  {
    id: "al-hadi",
    name: "Imam Ali al-Hadi",
    arabic: "عَلِي الْهَادِي",
    title: "The guide",
    period: "828–868 CE",
    bio: "Lived under the close watch of the Abbasid caliphs in the garrison city of Samarra. Despite restrictions, he taught and corresponded with students across the Muslim world, guiding them through letters preserved in later collections.",
    lessons: [
      "Guidance can travel through any medium — even letters under surveillance.",
      "Constancy in worship matters most when conditions are hardest.",
    ],
  },
  {
    id: "al-askari",
    name: "Imam Hasan al-Askari",
    arabic: "الْحَسَن الْعَسْكَرِي",
    title: "The one of the garrison",
    period: "846–874 CE",
    bio: "Eleventh Imam, named al-Askari for the garrison city of Samarra where his family was confined by the Abbasids. He continued his father's tradition of teaching through writings and trusted intermediaries, despite intense surveillance.",
    lessons: [
      "Faith perseveres under pressure.",
      "Quiet steadfastness is its own form of teaching.",
    ],
  },
  {
    id: "al-mahdi",
    name: "Imam al-Mahdi",
    arabic: "الْمَهْدِي",
    title: "The awaited guide",
    period: "Born 869 CE",
    bio: "The twelfth Imam in Shia tradition, believed to be in occultation (ghaybah). He is awaited as the one who, by Allah's will, will return at the end of times to fill the earth with justice as it had been filled with oppression. Belief in the coming of the Mahdi is shared, in different forms, across both Sunni and Shia traditions.",
    lessons: [
      "Hope in Allah's promise sustains belief through long waiting.",
      "Justice in the world is part of the divine plan.",
    ],
  },
];
