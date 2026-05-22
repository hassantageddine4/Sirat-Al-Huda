//
//  ExtendedRecitations.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Recitations specific to Witr, Jumu'ah, Janazah, and Eid that aren't
//  in the core daily-five RecitationLibrary. Kept here so the daily file
//  stays small and unrelated changes don't touch it.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab before
//  shipping. See README. Sources noted on each entry.
//

import Foundation

public enum ExtendedRecitations {

    // MARK: - Witr: Du'a al-Qunut (Sunni)

    /// Du'a al-Qunut said in Witr. The wording below is the well-known form
    /// reported in the Sunan collections; many scholars accept alternative
    /// wordings. Hanafi practice places this BEFORE rukūʿ in the third
    /// rakah; Shafi'i/Hanbali practice places it AFTER rukūʿ.
    public static let qunutWitr = Recitation(
        arabic: """
                اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ
                """,
        transliteration: """
                Allāhumma-hdinī fī-man hadayt, wa ʿāfinī fī-man ʿāfayt, wa tawallanī fī-man tawallayt, wa bārik lī fī-mā aʿṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ʿalayk. Innahū lā yadhillu man wālayt. Tabārakta rabbanā wa taʿālayt.
                """,
        translation: """
                O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care. Bless me in what You have given, and protect me from the evil You have decreed. Indeed, You decree and none can decree against You. Truly, the one whom You support is never humiliated. Blessed and exalted are You, our Lord.
                """,
        reference: "Sunan al-Tirmidhi, hadith of al-Ḥasan ibn ʿAlī ؓ",
        audioId:   "qunut_witr"
    )

    // MARK: - Janazah: the four takbir blocks

    /// Recited silently after the FIRST takbir in Janazah — Al-Fātiḥah.
    /// (Same Fatiha as RecitationLibrary; aliased here for clarity.)
    public static let janazahFatiha = RecitationLibrary.fatiha

    /// Recited after the SECOND takbir — Ṣalawāt on the Prophet ﷺ.
    /// Same Ibrāhīmī ṣalawāt as in regular tashahhud (Sunni).
    public static let janazahSalawat = RecitationLibrary.salawat

    /// Recited after the THIRD takbir — du'a for the deceased.
    /// This is the well-known form from the hadith of ʿAwf ibn Mālik.
    public static let janazahDuaForDeceased = Recitation(
        arabic: """
                اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مَدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ
                """,
        transliteration: """
                Allāhumma-ghfir lahū wa-rḥamh, wa ʿāfihī wa ʿfu ʿanh, wa akrim nuzulah, wa wassiʿ madkhalah, wa-ghsilhu bi-l-māʾi wa-th-thalji wa-l-barad, wa naqqihī mina l-khaṭāyā kamā yunaqqā th-thawbu l-abyaḍu mina d-danas.
                """,
        translation: """
                O Allah, forgive him and have mercy on him, grant him well-being and pardon him, honour his place of rest and widen his place of entry. Wash him with water, snow, and hail, and cleanse him of his sins as a white garment is cleansed of dirt.
                """,
        reference: "Ṣaḥīḥ Muslim — hadith of ʿAwf ibn Mālik ؓ. Use 'lahā' / 'lahum' for female / plural.",
        audioId:   "janazah_dua_3"
    )

    /// Recited after the FOURTH takbir — short concluding du'a.
    public static let janazahDuaClosing = Recitation(
        arabic: """
                اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ، وَلَا تَفْتِنَّا بَعْدَهُ، وَاغْفِرْ لَنَا وَلَهُ
                """,
        transliteration: """
                Allāhumma lā taḥrimnā ajrah, wa lā taftinnā baʿdah, wa-ghfir lanā wa lah.
                """,
        translation: """
                O Allah, do not deprive us of his reward, do not put us to trial after him, and forgive us and forgive him.
                """,
        reference: "Reported in early Sunni manuals; common form across schools",
        audioId:   "janazah_dua_4"
    )

    // MARK: - Eid: extra takbirs

    /// Said quietly between each extra takbir of Eid prayer.
    /// Multiple wordings are reported; this is the most common.
    public static let eidBetweenTakbirs = Recitation(
        arabic: """
                سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ
                """,
        transliteration: """
                Subḥāna-llāh, wa-l-ḥamdu lillāh, wa lā ilāha illa-llāh, wa-llāhu akbar.
                """,
        translation: """
                Glory be to Allah; all praise is for Allah; there is no god but Allah; and Allah is the greatest.
                """,
        reference: "Recited softly between each extra takbir",
        audioId:   "eid_between_takbirs"
    )
}
