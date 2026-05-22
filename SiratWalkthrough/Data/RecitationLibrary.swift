//
//  RecitationLibrary.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Common recitations used across multiple prayers. Defined once here so
//  Al-Fatiha, the tashahhud, etc. don't need re-typing in every prayer's
//  data file.
//
//  ⚠️ All Arabic + transliteration + translation in this file is DRAFT
//  content and must be reviewed by qualified scholars from the relevant
//  madhhab before being shipped to users. Sources noted on each entry.
//

import Foundation

public enum RecitationLibrary {

    // MARK: - Universal openings

    /// Opening takbir — said while raising hands.
    public static let takbirOpening = Recitation(
        arabic:          "اللَّهُ أَكْبَرُ",
        transliteration: "Allāhu Akbar",
        translation:     "Allah is the Greatest",
        reference:       nil,
        audioId:         "takbir"
    )

    /// Du'a al-Istiftah (opening supplication after takbir).
    /// Sunni form: "Subhānaka Allāhumma..."
    public static let istiftahSunni = Recitation(
        arabic:          "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ",
        transliteration: "Subḥānaka Allāhumma wa biḥamdik, wa tabāraka-smuk, wa taʿālā jadduk, wa lā ilāha ghayruk",
        translation:     "Glory be to You, O Allah, and praise. Blessed is Your name, exalted is Your majesty, and there is no god besides You.",
        reference:       "Sunan Abi Dawud",
        audioId:         "istiftah_sunni"
    )

    /// Ta'awwudh — seeking refuge before Fatiha.
    public static let taawwudh = Recitation(
        arabic:          "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "Aʿūdhu billāhi min ash-shayṭāni r-rajīm",
        translation:     "I seek refuge in Allah from the accursed Shayṭān.",
        reference:       "Qur'an 16:98",
        audioId:         "taawwudh"
    )

    /// Al-Fatiha — recited in every rakah.
    public static let fatiha = Recitation(
        arabic: """
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ
                """,
        transliteration: """
                Bismillāhi r-Raḥmāni r-Raḥīm. Al-ḥamdu lillāhi rabbi l-ʿālamīn. Ar-Raḥmāni r-Raḥīm. Māliki yawmi d-dīn. Iyyāka naʿbudu wa iyyāka nastaʿīn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa lā ḍ-ḍāllīn.
                """,
        translation: """
                In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds — the Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favour, not of those who have earned [Your] anger, nor of those who are astray.
                """,
        reference: "Qur'an 1:1-7",
        audioId:   "fatiha"
    )

    /// Surah Al-Ikhlas — common short surah for the second portion of recitation.
    public static let ikhlas = Recitation(
        arabic: """
                قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ
                """,
        transliteration: """
                Qul huwa llāhu aḥad. Allāhu ṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahū kufuwan aḥad.
                """,
        translation: """
                Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.
                """,
        reference: "Qur'an 112:1-4",
        audioId:   "ikhlas"
    )

    // MARK: - Postures

    /// Tasbih of rukūʿ.
    public static let tasbihRuku = Recitation(
        arabic:          "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subḥāna rabbiya l-ʿaẓīm",
        translation:     "Glory be to my Lord, the Most Great.",
        reference:       "Recited 3 times",
        audioId:         "tasbih_ruku"
    )

    /// Said when rising from rukūʿ.
    public static let samiAllah = Recitation(
        arabic:          "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۞ رَبَّنَا وَلَكَ الْحَمْدُ",
        transliteration: "Samiʿa-llāhu liman ḥamidah. Rabbanā wa laka l-ḥamd.",
        translation:     "Allah hears whoever praises Him. Our Lord, all praise is due to You.",
        reference:       nil,
        audioId:         "sami_allah"
    )

    /// Tasbih of sujūd.
    public static let tasbihSujud = Recitation(
        arabic:          "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
        transliteration: "Subḥāna rabbiya l-aʿlā",
        translation:     "Glory be to my Lord, the Most High.",
        reference:       "Recited 3 times",
        audioId:         "tasbih_sujud"
    )

    /// Said while sitting between the two prostrations.
    public static let dhikrJalsa = Recitation(
        arabic:          "رَبِّ اغْفِرْ لِي",
        transliteration: "Rabbi-ghfir lī",
        translation:     "My Lord, forgive me.",
        reference:       nil,
        audioId:         "dhikr_jalsa"
    )

    // MARK: - Tashahhud

    /// Tashahhud — Sunni form (At-Tahiyyat).
    public static let tashahhudSunni = Recitation(
        arabic: """
                التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
                """,
        transliteration: """
                At-taḥiyyātu lillāhi, wa ṣ-ṣalawātu wa ṭ-ṭayyibāt. As-salāmu ʿalayka ayyuha n-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ʿalaynā wa ʿalā ʿibādillāhi ṣ-ṣāliḥīn. Ashhadu an lā ilāha illa-llāh, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh.
                """,
        translation: """
                All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.
                """,
        reference: "Sahih al-Bukhari",
        audioId:   "tashahhud_sunni"
    )

    /// Tashahhud — Shia (Ja'fari) form.
    public static let tashahhudShia = Recitation(
        arabic: """
                أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ
                """,
        transliteration: """
                Ashhadu an lā ilāha illa-llāh, waḥdahū lā sharīka lah. Wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh. Allāhumma ṣalli ʿalā Muḥammadin wa āli Muḥammad.
                """,
        translation: """
                I bear witness that there is no god but Allah, alone, with no partner. And I bear witness that Muhammad is His servant and messenger. O Allah, send blessings upon Muhammad and the family of Muhammad.
                """,
        reference: "Standard Ja'fari form",
        audioId:   "tashahhud_shia"
    )

    /// Salāt ʿalā n-Nabī — sent on the Prophet ﷺ during tashahhud (Sunni).
    public static let salawat = Recitation(
        arabic: """
                اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
                """,
        transliteration: """
                Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm. Innaka Ḥamīdun Majīd.
                """,
        translation: """
                O Allah, send blessings on Muhammad and the family of Muhammad, as You sent blessings on Ibrāhīm and the family of Ibrāhīm. Indeed You are praiseworthy and glorious.
                """,
        reference: "Sahih al-Bukhari",
        audioId:   "salawat"
    )

    // MARK: - Closing

    /// Final salām — ending the prayer.
    public static let salam = Recitation(
        arabic:          "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        transliteration: "As-salāmu ʿalaykum wa raḥmatullāh",
        translation:     "Peace be upon you, and the mercy of Allah.",
        reference:       "Said turning the head right, then left",
        audioId:         "salam"
    )
}
