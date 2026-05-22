// src/data/prayerWalkthrough/recitations.js
// ─────────────────────────────────────────────────────────────────────────────
// Common recitations used across multiple prayers, plus prayer-specific
// recitations for Witr, Janazah, Eid, Istikhara, and post-prayer dhikr.
//
// ⚠️ DRAFT — All Arabic + transliteration + translation in this file is DRAFT
// content and must be reviewed by qualified scholars from the relevant
// madhhab before being shipped to users. Sources noted on each entry.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Universal openings ─────────────────────────────────────────────────────

export const takbirOpening = {
  arabic: "اللَّهُ أَكْبَرُ",
  transliteration: "Allāhu Akbar",
  translation: "Allah is the Greatest",
  reference: null,
};

export const basmalah = {
  arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  transliteration: "Bismillāhi r-Raḥmāni r-Raḥīm",
  translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  reference: "Recited before every sūrah except al-Tawbah (Q 9)",
};

export const istiftahSunni = {
  arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ",
  transliteration: "Subḥānaka Allāhumma wa biḥamdik, wa tabāraka-smuk, wa taʿālā jadduk, wa lā ilāha ghayruk",
  translation: "Glory be to You, O Allah, and praise. Blessed is Your name, exalted is Your majesty, and there is no god besides You.",
  reference: "Sunan Abī Dāwūd 776",
};

export const taawwudh = {
  arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
  transliteration: "Aʿūdhu billāhi min ash-shayṭāni r-rajīm",
  translation: "I seek refuge in Allah from the accursed Shayṭān.",
  reference: "Qur'an 16:98",
};

export const fatiha = {
  arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
  transliteration: "Bismillāhi r-Raḥmāni r-Raḥīm. Al-ḥamdu lillāhi rabbi l-ʿālamīn. Ar-Raḥmāni r-Raḥīm. Māliki yawmi d-dīn. Iyyāka naʿbudu wa iyyāka nastaʿīn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa lā ḍ-ḍāllīn.",
  translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds — the Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favour, not of those who have earned [Your] anger, nor of those who are astray.",
  reference: "Qur'an 1:1-7",
};

export const ikhlas = {
  arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  transliteration: "Qul huwa llāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahū kufuwan aḥad.",
  translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
  reference: "Qur'an 112:1-4",
};

// Tasbīḥāt al-Arbaʿa — "The Four Praises". Recited three times in the 3rd
// and 4th rakahs of a 4-rakah prayer in the Shia tradition, as an alternative
// to Al-Fātiḥah. Recitation of the tasbīḥāt is generally considered more
// virtuous than reciting Al-Fātiḥah in these rakahs.
export const tasbihatAlArbaa = {
  arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna-llāhi wa-l-ḥamdu lillāhi wa lā ilāha illa-llāhu wa-llāhu akbar",
  translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the greatest.",
  reference: "Sistani, Tawḍīḥ al-Masāʾil §1003 — recited three times in the 3rd and 4th rakahs of a 4-rakah prayer (Shia)",
};

// ─── Postures ───────────────────────────────────────────────────────────────

export const tasbihRuku = {
  arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ",
  transliteration: "Subḥāna rabbiya l-ʿaẓīmi wa bi-ḥamdih",
  translation: "Glory be to my Lord, the Most Great, and praise be to Him.",
  reference: "Recited 3, 5, or 7 times. The shorter form 'Subḥāna rabbiya l-ʿaẓīm' (without 'wa bi-ḥamdih') is also valid.",
};

export const samiAllah = {
  arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۞ رَبَّنَا وَلَكَ الْحَمْدُ",
  transliteration: "Samiʿa-llāhu liman ḥamidah. Rabbanā wa laka l-ḥamd.",
  translation: "Allah hears whoever praises Him. Our Lord, all praise is due to You.",
  reference: "Sahih al-Bukhari 795",
};

export const tasbihSujud = {
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ",
  transliteration: "Subḥāna rabbiya l-aʿlā wa bi-ḥamdih",
  translation: "Glory be to my Lord, the Most High, and praise be to Him.",
  reference: "Recited 3, 5, or 7 times. The shorter form 'Subḥāna rabbiya l-aʿlā' (without 'wa bi-ḥamdih') is also valid.",
};

export const dhikrJalsa = {
  arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
  transliteration: "Rabbi-ghfir lī, rabbi-ghfir lī",
  translation: "My Lord, forgive me. My Lord, forgive me.",
  reference: "Sunan Abī Dāwūd 874 — recited between the two prostrations.",
};

// ─── Tashahhud ──────────────────────────────────────────────────────────────

export const tashahhudSunni = {
  arabic: "التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
  transliteration: "At-taḥiyyātu lillāhi, wa ṣ-ṣalawātu wa ṭ-ṭayyibāt. As-salāmu ʿalayka ayyuha n-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ʿalaynā wa ʿalā ʿibādillāhi ṣ-ṣāliḥīn. Ashhadu an lā ilāha illa-llāh, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh.",
  translation: "All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
  reference: "Ṣaḥīḥ al-Bukhārī 831 — hadith of Ibn Masʿūd ؓ",
};

export const tashahhudShia = {
  arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَتَقَبَّلْ شَفَاعَتَهُ، وَارْفَعْ دَرَجَتَهُ",
  transliteration: "Ashhadu an lā ilāha illa-llāh, waḥdahū lā sharīka lah. Wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh. Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad, wa taqabbal shafāʿatahū, wa-rfaʿ darajatah.",
  translation: "I bear witness that there is no god but Allah, alone, with no partner. And I bear witness that Muhammad is His servant and messenger. O Allah, send blessings upon Muhammad and the family of Muhammad, and accept his intercession, and elevate his rank.",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126 — standard Shia tashahhud form",
};

export const salawat = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm. Innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm. Innaka Ḥamīdun Majīd.",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrāhīm and the family of Ibrāhīm. Indeed You are praiseworthy and glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrāhīm and the family of Ibrāhīm. Indeed You are praiseworthy and glorious.",
  reference: "Ṣaḥīḥ al-Bukhārī 3370 — the complete Ibrāhīmiyya form",
};

export const rabbanaAtina = {
  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  transliteration: "Rabbanā ātinā fī d-dunyā ḥasanatan wa fī l-ākhirati ḥasanatan wa qinā ʿadhāba n-nār",
  translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.",
  reference: "Qur'an 2:201",
};

export const salam = {
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
  transliteration: "As-salāmu ʿalaykum wa raḥmatullāh",
  translation: "Peace be upon you, and the mercy of Allah.",
  reference: "Said turning the head right, then left.",
};

// ─── Qunūt variants ─────────────────────────────────────────────────────────

export const qunutWitr = {
  arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
  transliteration: "Allāhumma-hdinī fī-man hadayt, wa ʿāfinī fī-man ʿāfayt, wa tawallanī fī-man tawallayt, wa bārik lī fī-mā aʿṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ʿalayk. Innahū lā yadhillu man wālayt. Tabārakta rabbanā wa taʿālayt.",
  translation: "O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care. Bless me in what You have given, and protect me from the evil You have decreed. Indeed, You decree and none can decree against You. Truly, the one whom You support is never humiliated. Blessed and exalted are You, our Lord.",
  reference: "Sunan al-Tirmidhī 464 — hadith of al-Ḥasan ibn ʿAlī ؓ",
};

export const qunutShia = {
  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
  transliteration: "Rabbanā ātinā fī d-dunyā ḥasanatan wa fī l-ākhirati ḥasanatan wa qinā ʿadhāba n-nār. Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad.",
  translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire. O Allah, send blessings upon Muhammad and the family of Muhammad.",
  reference: "Q 2:201 + salawāt; recommended (mustaḥabb) in the 2nd rakah of every Shia prayer, hands raised palms-up to face level",
};

export const qunutFajrShafii = {
  arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
  transliteration: "Allāhumma-hdinī fī-man hadayt, wa ʿāfinī fī-man ʿāfayt, wa tawallanī fī-man tawallayt, wa bārik lī fī-mā aʿṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ʿalayk. Wa innahū lā yadhillu man wālayt, wa lā yaʿizzu man ʿādayt. Tabārakta rabbanā wa taʿālayt, fa-laka l-ḥamdu ʿalā mā qaḍayt. Astaghfiruka wa atūbu ilayk. Wa ṣalla-llāhu ʿalā sayyidinā Muḥammadin n-nabiyyi l-ummiyyi wa ʿalā ālihī wa ṣaḥbihī wa sallam.",
  translation: "O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care. Bless me in what You have given, and protect me from the evil You have decreed. For You decree and none can decree against You. Truly, the one whom You support is never humiliated, nor is the one whom You oppose ever honoured. Blessed and exalted are You, our Lord — to You is praise for what You have decreed. I seek Your forgiveness and turn to You in repentance. And may Allah send blessings and peace upon our master Muḥammad, the unlettered Prophet, and upon his family and companions.",
  reference: "Al-Nawawī's al-Adhkār — Shāfiʿī Fajr qunūt (recited after iʿtidāl in the 2nd rakah of Fajr)",
};

// ─── Extended (Janazah / Eid / Istikhara) ───────────────────────────────────

export const janazahFatiha = fatiha;
export const janazahSalawat = salawat;

export const janazahDuaForDeceased = {
  arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مَدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ النَّارِ",
  transliteration: "Allāhumma-ghfir lahū wa-rḥamh, wa ʿāfihī wa ʿfu ʿanh, wa akrim nuzulah, wa wassiʿ madkhalah, wa-ghsilhu bi-l-māʾi wa-th-thalji wa-l-barad, wa naqqihī mina l-khaṭāyā kamā yunaqqā th-thawbu l-abyaḍu mina d-danas. Wa abdilhu dāran khayran min dārih, wa ahlan khayran min ahlih, wa zawjan khayran min zawjih. Wa adkhilhu l-jannah, wa aʿidhhu min ʿadhābi l-qabri wa min ʿadhābi n-nār.",
  translation: "O Allah, forgive him and have mercy on him, grant him well-being and pardon him, honour his place of rest and widen his place of entry. Wash him with water, snow, and hail, and cleanse him of his sins as a white garment is cleansed of dirt. Give him a home better than his home, a family better than his family, a spouse better than his spouse. Admit him to Paradise and protect him from the torment of the grave and the torment of the Fire.",
  reference: "Ṣaḥīḥ Muslim 963 — hadith of ʿAwf ibn Mālik ؓ. Use 'lahā' / 'lahum' for female / plural.",
};

export const janazahDuaClosing = {
  arabic: "اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ، وَلَا تَفْتِنَّا بَعْدَهُ، وَاغْفِرْ لَنَا وَلَهُ",
  transliteration: "Allāhumma lā taḥrimnā ajrah, wa lā taftinnā baʿdah, wa-ghfir lanā wa lah.",
  translation: "O Allah, do not deprive us of his reward, do not put us to trial after him, and forgive us and forgive him.",
  reference: "Reported in early Sunni manuals; common form across schools",
};

export const eidBetweenTakbirs = {
  arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
  transliteration: "Subḥāna-llāh, wa-l-ḥamdu lillāh, wa lā ilāha illa-llāh, wa-llāhu akbar.",
  translation: "Glory be to Allah; all praise is for Allah; there is no god but Allah; and Allah is the greatest.",
  reference: "Recited softly between each extra takbir.",
};

export const istikharaDua = {
  arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ. وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ",
  transliteration: "Allāhumma innī astakhīruka bi-ʿilmik, wa astaqdiruka bi-qudratik, wa as'aluka min faḍlika l-ʿaẓīm. Fa-innaka taqdiru wa lā aqdir, wa taʿlamu wa lā aʿlam, wa anta ʿallāmu l-ghuyūb. Allāhumma in kunta taʿlamu anna hādhā l-amra khayrun lī fī dīnī wa maʿāshī wa ʿāqibati amrī fa-qdurhu lī wa yassirhu lī, thumma bārik lī fīh. Wa in kunta taʿlamu anna hādhā l-amra sharrun lī fī dīnī wa maʿāshī wa ʿāqibati amrī fa-ṣrifhu ʿannī wa-ṣrifnī ʿanh, wa-qdur liya l-khayra ḥaythu kān, thumma arḍinī bih.",
  translation: "O Allah, I seek Your guidance through Your knowledge, and Your strength through Your power, and I ask You from Your great bounty. For You have power and I have none, You know and I do not, and You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, my livelihood, and the outcome of my affairs, then decree it for me, make it easy for me, and bless it for me. And if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affairs, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be, and make me content with it.",
  reference: "Ṣaḥīḥ al-Bukhārī 1162 — hadith of Jābir ibn ʿAbdillāh ؓ. Substitute the matter at hand at 'hādhā l-amra'.",
};

// ─── Post-prayer dhikr ──────────────────────────────────────────────────────

export const postPrayerSubhanAllah = {
  arabic: "سُبْحَانَ اللَّهِ",
  transliteration: "Subḥāna-llāh",
  translation: "Glory be to Allah.",
  reference: "Recited 33 times after each obligatory prayer (Ṣaḥīḥ Muslim 596)",
};

export const postPrayerAlhamdulillah = {
  arabic: "الْحَمْدُ لِلَّهِ",
  transliteration: "Al-ḥamdu lillāh",
  translation: "All praise is for Allah.",
  reference: "Recited 33 times after each obligatory prayer (Ṣaḥīḥ Muslim 596)",
};

export const postPrayerAllahuAkbar = {
  arabic: "اللَّهُ أَكْبَرُ",
  transliteration: "Allāhu Akbar",
  translation: "Allah is the Greatest.",
  reference: "Recited 34 times after each obligatory prayer (Ṣaḥīḥ Muslim 596)",
};

export const postPrayerTahlil = {
  arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "Lā ilāha illa-llāhu waḥdahū lā sharīka lah, lahu l-mulku wa lahu l-ḥamd, wa huwa ʿalā kulli shayʾin qadīr",
  translation: "There is no god but Allah, alone, with no partner. To Him belongs the dominion and to Him belongs all praise, and He is able to do all things.",
  reference: "Recited once after the 33+33+34 cycle, completing 100 acts of dhikr (Ṣaḥīḥ Muslim 597)",
};

export const ayatAlKursi = {
  arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  transliteration: "Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūm. Lā taʾkhudhuhū sinatun wa lā nawm. Lahū mā fī s-samāwāti wa mā fī l-arḍ. Man dhā lladhī yashfaʿu ʿindahū illā bi-idhnih. Yaʿlamu mā bayna aydīhim wa mā khalfahum. Wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bimā shāʾ. Wasiʿa kursiyyuhu s-samāwāti wa l-arḍ. Wa lā yaʾūduhū ḥifẓuhumā. Wa huwa l-ʿaliyyu l-ʿaẓīm.",
  translation: "Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  reference: "Qur'an 2:255",
};

// ─── Shia closing salam sequence (with 3 takbirs before final salam) ──────
export const salamShiaSequence = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ\n\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\n\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\n\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ\n\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad\n\nAs-salāmu ʿalayka ayyuhā n-nabiyyu wa raḥmatu-llāhi wa barakātuh\n\nAs-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi ṣ-ṣāliḥīn\n\nAllāhu Akbar • Allāhu Akbar • Allāhu Akbar\n\nAs-salāmu ʿalaykum wa raḥmatu-llāhi wa barakātuh",
  translation: "O Allah, send blessings upon Muhammad and the family of Muhammad.\n\nPeace be upon you, O Prophet, and the mercy of Allah and His blessings.\n\nPeace be upon us and upon the righteous servants of Allah.\n\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise hands to the ears with each takbir).\n\nPeace be upon you all, and the mercy of Allah and His blessings (turn the head right, then left, greeting the angels on each shoulder).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1136. The three takbīrs after the tashahhud are mustaḥabb (recommended), recited raising the hands to the ears, then the final salām is the obligatory exit of the prayer.",
};

// ─── Shia closing — preparations (recited BEFORE the final salam) ──────────
export const salamShiaPreparations = {
  arabic: "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\n\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\n\nالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\n\nاللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ • اللَّهُ أَكْبَرُ",
  transliteration: "Assalaamu 'alayka ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh\n\nAssalamu 'alaynaa wa 'alaa 'ibaadillaahis saaliheen\n\nAssalamu alaykum wa rahmatullaahi wa barakaatuh\n\nAllaahu Akbar • Allaahu Akbar • Allaahu Akbar",
  translation: "Peace be upon you, O Prophet, and the mercy of Allah and His blessings.\n\nPeace be upon us and upon the righteous servants of Allah.\n\nPeace be upon you all, and the mercy of Allah and His blessings.\n\nAllah is the Greatest • Allah is the Greatest • Allah is the Greatest (raise the hands to the ears with each takbīr).",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1126–1133. These two salām phrases are mustaḥabb (recommended) and the three takbīrs after the tashahhud are mustaḥabb, recited raising the hands to the ears each time.",
};

// ─── Shia closing — the obligatory final salam (salām to the angels) ──────
export const salamShiaFinal = {
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
  transliteration: "As-salāmu ʿalaykum wa raḥmatu-llāhi wa barakātuh",
  translation: "Peace be upon you all, and the mercy of Allah and His blessings — said while turning the head to the right, then to the left, greeting the angels on each shoulder.",
  reference: "Sayyid Sistani, Tawḍīḥ al-Masāʾil §1133–1136. This is the obligatory salām that exits the prayer.",
};
