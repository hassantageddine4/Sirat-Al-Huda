//
//  VoluntaryPrayers.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Voluntary (nafl) 2-rakah prayers that share the standard 2-rakah
//  audible structure with prayer-specific intentions and post-prayer
//  recitations:
//
//    • Tahajjud  — late-night voluntary prayer (sunnah mu'akkadah)
//    • Duha      — mid-morning voluntary prayer
//    • Tawbah    — prayer of repentance (any time)
//    • Istikhara — prayer for guidance (followed by a specific du'a)
//
//  Each is structurally the same 2-rakah audible prayer (like Fajr).
//  The differences are: when to pray, the intention, and any post-prayer
//  practice. We model these as plain `Prayer` values that share a
//  RakahBuilder spine, with prayer-specific summary text and an
//  optional "after-prayer" step at the end.
//
//  ⚠️ DRAFT — review by qualified scholars.
//

import Foundation

// MARK: - Istikhara du'a (the post-prayer recitation that defines the prayer)

private let istikharaDua = Recitation(
    arabic: """
            اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ. وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ
            """,
    transliteration: """
            Allāhumma innī astakhīruka bi-ʿilmik, wa astaqdiruka bi-qudratik, wa as'aluka min faḍlika l-ʿaẓīm. Fa-innaka taqdiru wa lā aqdir, wa taʿlamu wa lā aʿlam, wa anta ʿallāmu l-ghuyūb. Allāhumma in kunta taʿlamu anna hādhā l-amra khayrun lī fī dīnī wa maʿāshī wa ʿāqibati amrī fa-qdurhu lī wa yassirhu lī, thumma bārik lī fīh. Wa in kunta taʿlamu anna hādhā l-amra sharrun lī fī dīnī wa maʿāshī wa ʿāqibati amrī fa-ṣrifhu ʿannī wa-ṣrifnī ʿanh, wa-qdur liya l-khayra ḥaythu kān, thumma arḍinī bih.
            """,
    translation: """
            O Allah, I seek Your guidance through Your knowledge, and Your strength through Your power, and I ask You from Your great bounty. For You have power and I have none, You know and I do not, and You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, my livelihood, and the outcome of my affairs, then decree it for me, make it easy for me, and bless it for me. And if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affairs, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be, and make me content with it.
            """,
    reference: "Sahih al-Bukhari — hadith of Jābir ibn ʿAbdillāh ؓ. Substitute the matter at hand at 'hādhā l-amra' (literally 'this matter').",
    audioId:   "istikhara_dua"
)

// MARK: - Helper: build a standard 2-rakah audible voluntary prayer

private enum VoluntaryStep {
    static func afterPrayerStep(
        prayerId: String,
        title: String,
        instruction: String,
        recitation: Recitation?
    ) -> PrayerStep {
        PrayerStep(
            id: "\(prayerId)-after",
            title: title,
            posture: .kneeling,
            assetName: "pose_tashahhud_sunni",
            instruction: instruction,
            recitation: recitation,
            tip: nil,
            madhhabNote: nil
        )
    }
}

private func twoRakahVoluntary(
    id: String,
    audible: Bool = true,
    afterPrayerStep: PrayerStep? = nil
) -> [Rakah] {
    let r1 = RakahBuilder.first(prayer: id, audible: audible)
    let r2 = RakahBuilder.second(prayer: id, audible: audible, isFinal: true)

    // Append the after-prayer step (e.g. istikhara du'a) to rakah 2's
    // step list so it appears after the salām.
    if let extra = afterPrayerStep {
        let stepsSunni = r2.stepsSunni + [extra]
        let stepsShia  = (r2.stepsShia ?? r2.stepsSunni) + [extra]
        return [r1, Rakah(number: 2, stepsSunni: stepsSunni, stepsShia: stepsShia)]
    }
    return [r1, r2]
}

// MARK: - Tahajjud

public extension PrayerCatalog {

    static let tahajjud = Prayer(
        id: "tahajjud",
        name: "Tahajjud",
        arabicName: "التهجد",
        subtitle: "Late-night voluntary prayer",
        rakahCount: 2,
        category: .recommended,
        summary:
            "Prayed in the last third of the night after waking from sleep. "
          + "Performed in pairs of 2 rakahs; you may pray as many pairs as you wish.",
        rakahs: twoRakahVoluntary(id: "tahajjud", audible: true)
    )

    // MARK: - Duha

    static let duha = Prayer(
        id: "duha",
        name: "Ḍuḥā",
        arabicName: "الضحى",
        subtitle: "Mid-morning voluntary prayer",
        rakahCount: 2,
        category: .recommended,
        summary:
            "Prayed after sunrise (about 15-20 minutes after) until shortly before "
          + "Dhuhr. Minimum 2 rakahs, recommended 4, with up to 8 reported.",
        rakahs: twoRakahVoluntary(id: "duha", audible: false)
    )

    // MARK: - Tawbah

    static let tawbah = Prayer(
        id: "tawbah",
        name: "Tawbah",
        arabicName: "التوبة",
        subtitle: "Prayer of repentance",
        rakahCount: 2,
        category: .recommended,
        summary:
            "Two rakahs prayed when seeking forgiveness for a sin. After the prayer, "
          + "make du'a sincerely asking Allah for forgiveness.",
        rakahs: twoRakahVoluntary(
            id: "tawbah",
            audible: true,
            afterPrayerStep: VoluntaryStep.afterPrayerStep(
                prayerId: "tawbah",
                title: "Du'a of Forgiveness",
                instruction:
                    "After the salām, sit calmly facing the qiblah. Praise Allah, send "
                  + "ṣalawāt on the Prophet ﷺ, then ask Allah for forgiveness sincerely. "
                  + "There is no fixed wording — express your repentance in your own words "
                  + "or use a known du'a such as Sayyidu l-istighfār.",
                recitation: nil
            )
        )
    )

    // MARK: - Istikhara

    static let istikhara = Prayer(
        id: "istikhara",
        name: "Istikhāra",
        arabicName: "الاستخارة",
        subtitle: "Prayer for guidance",
        rakahCount: 2,
        category: .recommended,
        summary:
            "Two rakahs prayed when seeking Allah's guidance on a specific matter, "
          + "followed by a specific du'a.",
        rakahs: twoRakahVoluntary(
            id: "istikhara",
            audible: true,
            afterPrayerStep: VoluntaryStep.afterPrayerStep(
                prayerId: "istikhara",
                title: "Du'a al-Istikhāra",
                instruction:
                    "After the salām, while still seated, recite the du'a of istikhāra, "
                  + "naming the specific matter you are seeking guidance about at the "
                  + "phrase 'hādhā l-amra' (this matter). After the du'a, proceed "
                  + "with the matter as your judgment leads you, trusting in Allah's "
                  + "decree.",
                recitation: istikharaDua
            )
        )
    )
}
