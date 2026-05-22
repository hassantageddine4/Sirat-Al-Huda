//
//  WitrPrayer.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Witr — recommended odd-numbered prayer typically performed after Isha.
//  This file models the most common 3-rakah Sunni form with qunūt in the
//  third rakah.
//
//  Madhhab notes encoded:
//   • Hanafi: qunūt is BEFORE rukūʿ in the third rakah, after a takbir
//     with hands raised.
//   • Shāfiʿī / Hanbali: qunūt is AFTER rising from rukūʿ in the final
//     rakah. Many Shāfiʿīs only do this in the second half of Ramadan.
//   • Mālikī: 1-rakah Witr is the more common form; this file does not
//     model that variant.
//   • Ja'farī: ṣalāt al-witr exists within ṣalāt al-layl as a single
//     rakah with its own qunūt and prayers for the believers. The
//     structure differs enough that the Shia toggle in this file gives
//     the same 3-rakah form with a clear note explaining the divergence.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab.
//

import Foundation

private enum WitrStep {

    /// The qunūt step itself — placed BEFORE rukūʿ (Hanafi position).
    static func qunut() -> PrayerStep {
        PrayerStep(
            id: "witr-r3-qunut",
            title: "Du'a al-Qunūt",
            posture: .standing,
            assetName: "pose_qunut",
            instruction:
                "Before going into rukūʿ, say 'Allāhu Akbar' while raising the hands "
              + "to the level of the ears, then bring them back together over the chest. "
              + "Recite the du'a of qunūt. The hands may also be raised palms-up during "
              + "the du'a — both forms are reported.",
            recitation: ExtendedRecitations.qunutWitr,
            tip: "If your school places qunūt AFTER rukūʿ (Shāfiʿī, Hanbali), recite this "
               + "du'a in the standing position after iʿtidāl instead — the wording is the "
               + "same.",
            madhhabNote:
                "Hanafi practice: qunūt is BEFORE rukūʿ in the third rakah, as shown here. "
              + "Shāfiʿī / Hanbali practice places it AFTER rising from rukūʿ. "
              + "Ja'farī ṣalāt al-witr is structurally a single rakah within ṣalāt al-layl "
              + "— consult a Shia source for that form."
        )
    }
}

// MARK: - Witr prayer

public extension PrayerCatalog {

    static let witr = Prayer(
        id: "witr",
        name: "Witr",
        arabicName: "الوتر",
        subtitle: "Odd-numbered night prayer",
        rakahCount: 3,
        category: .recommended,
        summary: "Three rakahs prayed after Isha, ending with the du'a of qunūt.",
        rakahs: [
            // Rakah 1 — standard first rakah, audible.
            RakahBuilder.first(prayer: "witr", audible: true),

            // Rakah 2 — like Maghrib's middle rakah: ends in tashahhud
            // but does NOT salām. Witr is 3 rakahs continuous.
            RakahBuilder.second(prayer: "witr", audible: true, isFinal: false),

            // Rakah 3 — custom: includes the qunūt step.
            witrThirdRakah(),
        ]
    )

    // MARK: - Custom 3rd rakah

    private static func witrThirdRakah() -> Rakah {
        let prayer = "witr"
        let rakah  = 3
        let qiyam  = RakahBuilder.qiyamMid(prayer: prayer, rakah: rakah)
        let qunut  = WitrStep.qunut()

        let sharedHead: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: rakah, audible: true),
            Step.surah(prayer: prayer, rakah: rakah, audible: true),
            qunut,                                            // the qunūt step
            Step.ruku(prayer: prayer, rakah: rakah),
            Step.iʿtidāl(prayer: prayer, rakah: rakah),
        ]

        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: rakah)
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: rakah)
        let jalsa  = Step.jalsa(prayer: prayer, rakah: rakah)
        let tash   = Step.tashahhud(prayer: prayer, rakah: rakah, isFinal: true)

        let sunniSteps: [PrayerStep] =
            [qiyam.sunni] + sharedHead
          + [sujud1.sunni, jalsa, sujud2.sunni, tash.sunni,
             Step.salawat(prayer: prayer, rakah: rakah),
             Step.salam(prayer: prayer, rakah: rakah)]

        let shiaSteps: [PrayerStep] =
            [qiyam.shia] + sharedHead
          + [sujud1.shia, jalsa, sujud2.shia, tash.shia,
             Step.salam(prayer: prayer, rakah: rakah)]

        return Rakah(number: 3, stepsSunni: sunniSteps, stepsShia: shiaSteps)
    }
}
