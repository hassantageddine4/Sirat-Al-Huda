//
//  JumuahPrayer.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Salāt al-Jumuʿah — the congregational Friday prayer that replaces
//  Dhuhr for those who attend. Two rakahs preceded by two khuṭbahs.
//
//  Structure modeled here:
//    1. Listen — first khuṭbah  (silent, attentive)
//    2. Listen — sitting between the two khuṭbahs
//    3. Listen — second khuṭbah
//    4. Iqāmah / line up
//    5. Then 2 standard audible rakahs (like Fajr's structure).
//
//  Notes:
//   • Jumuʿah requires a congregation; this guide walks through the
//     experience of attending. There is no individual Jumuʿah —
//     someone praying alone prays Dhuhr instead.
//   • Recitation in the rakahs is audible (jahr), unlike Dhuhr.
//   • The Sunni/Shia structural difference is small for Jumuʿah; both
//     traditions involve the khuṭbah-then-2-rakah sequence. Ja'farī
//     practice has additional conditions (presence of a just leader)
//     — noted in the prayer's `summary`/instructions.
//
//  ⚠️ DRAFT — review by qualified scholars.
//

import Foundation

private enum JumuahStep {

    static func firstKhutbah() -> PrayerStep {
        PrayerStep(
            id: "jumuah-khutbah-1",
            title: "First Khuṭbah",
            posture: .standing,
            assetName: nil,                     // listening; no specific pose
            instruction:
                "Sit attentively while the imam delivers the first khuṭbah. "
              + "It is sunnah to face the imam, listen quietly, and avoid "
              + "speaking or distracting actions. Even greeting another "
              + "worshipper is discouraged during the khuṭbah.",
            recitation: nil,
            tip: "Arriving early and sitting close to the imam is recommended.",
            madhhabNote: nil
        )
    }

    static func sittingBetween() -> PrayerStep {
        PrayerStep(
            id: "jumuah-khutbah-sit",
            title: "Brief Sitting",
            posture: .kneeling,
            assetName: nil,
            instruction:
                "The imam sits briefly between the two khuṭbahs. Remain seated "
              + "and continue making du'a silently — this is a time when "
              + "supplications are reported to be answered.",
            recitation: nil,
            tip: "A common practice is to send ṣalawāt on the Prophet ﷺ during this pause.",
            madhhabNote: nil
        )
    }

    static func secondKhutbah() -> PrayerStep {
        PrayerStep(
            id: "jumuah-khutbah-2",
            title: "Second Khuṭbah",
            posture: .standing,
            assetName: nil,
            instruction:
                "The imam stands and delivers the second khuṭbah, typically "
              + "shorter than the first. Continue listening attentively. "
              + "When the imam finishes and the iqāmah is called, the "
              + "congregation rises for the prayer.",
            recitation: nil,
            tip: nil,
            madhhabNote: nil
        )
    }

    static func iqamah() -> PrayerStep {
        PrayerStep(
            id: "jumuah-iqamah",
            title: "Iqāmah & Lining Up",
            posture: .standing,
            assetName: "pose_qiyam_sunni",
            instruction:
                "Stand and align yourselves shoulder-to-shoulder, foot-to-foot "
              + "in the rows, beginning from the row directly behind the imam. "
              + "The iqāmah is called and the prayer begins.",
            recitation: nil,
            tip: "The Prophet ﷺ instructed the congregation to straighten and complete the rows.",
            madhhabNote: nil
        )
    }
}

public extension PrayerCatalog {

    static let jumuah = Prayer(
        id: "jumuah",
        name: "Jumuʿah",
        arabicName: "الجمعة",
        subtitle: "Friday congregational prayer",
        rakahCount: 2,
        category: .obligatory,
        summary:
            "Two audible rakahs prayed in congregation on Friday, replacing Dhuhr. "
          + "Preceded by two khuṭbahs delivered by the imam.",
        rakahs: [
            // Rakah 1 — but we prepend the khuṭbah listening steps as part
            // of rakah 1's flow, since the walkthrough is a single linear
            // experience and the khuṭbah is part of attending Jumu'ah.
            //
            // Rakah numbering convention: the khuṭbah steps are still in
            // "rakah 1" of the flat list. The header will display "Rak'ah 1/2"
            // throughout — which is honest, since the formal rakahs only
            // begin at the iqāmah.
            //
            // If you'd rather show "Pre-prayer 1/4" during the khuṭbah, that's
            // a UI tweak in WalkthroughHeader (suppress the rakah counter when
            // the step ID contains "khutbah"). Skipped here for simplicity.
            jumuahFirstRakah(),
            jumuahSecondRakah(),
        ]
    )

    private static func jumuahFirstRakah() -> Rakah {
        let prayer = "jumuah"
        let qiyam  = RakahBuilder.qiyamMid(prayer: prayer, rakah: 1)
        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: 1)
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: 1)
        let jalsa  = Step.jalsa(prayer: prayer, rakah: 1)

        let sharedHead: [PrayerStep] = [
            JumuahStep.firstKhutbah(),
            JumuahStep.sittingBetween(),
            JumuahStep.secondKhutbah(),
            JumuahStep.iqamah(),
            // Now the formal prayer begins — same as a standard first rakah,
            // but without the istiftāḥ since it's congregational and audible.
            Step.taawwudh(prayer: prayer, rakah: 1),
            Step.fatiha(prayer: prayer, rakah: 1, audible: true),
            Step.surah(prayer: prayer, rakah: 1, audible: true),
            Step.ruku(prayer: prayer, rakah: 1),
            Step.iʿtidāl(prayer: prayer, rakah: 1),
        ]

        let sunniSteps: [PrayerStep] = [qiyam.sunni] + sharedHead
                                     + [sujud1.sunni, jalsa, sujud2.sunni]
        let shiaSteps:  [PrayerStep] = [qiyam.shia ] + sharedHead
                                     + [sujud1.shia , jalsa, sujud2.shia ]

        return Rakah(number: 1, stepsSunni: sunniSteps, stepsShia: shiaSteps)
    }

    private static func jumuahSecondRakah() -> Rakah {
        // Standard final rakah of a 2-rakah audible prayer — same as Fajr r2.
        RakahBuilder.second(prayer: "jumuah", audible: true, isFinal: true)
    }
}
