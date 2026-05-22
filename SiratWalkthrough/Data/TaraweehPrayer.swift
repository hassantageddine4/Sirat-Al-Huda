//
//  TaraweehPrayer.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Ṣalāt at-Tarāwīḥ — voluntary prayers performed in congregation during the
//  nights of Ramadan, after Isha. Structurally simple — pairs of 2 audible
//  rakahs — but the COUNT differs:
//
//   • Hanafī, Shāfiʿī, Hanbali Sunni: 20 rakahs (10 pairs of 2)
//   • Mālikī Sunni: 36 rakahs is reported as the practice of Madinah; 20 is
//     also accepted.
//   • Some Sunni scholars and many practising Muslims: 8 rakahs, citing
//     ʿĀ'isha's report on the Prophet's ﷺ qiyām al-layl in Ramadan.
//   • Shia (Ja'farī): 1000 rakahs total spread across Ramadan, by a specific
//     distribution. Tarāwīḥ as a congregational prayer is generally not
//     practised in the Ja'farī tradition; the Shia toggle gives the same
//     2-rakah unit with a note.
//
//  This file models a single 2-rakah unit. The walkthrough teaches the unit;
//  the user repeats it the appropriate number of times for their tradition.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab.
//

import Foundation

public extension PrayerCatalog {

    static let taraweeh = Prayer(
        id: "taraweeh",
        name: "Tarāwīḥ",
        arabicName: "التراويح",
        subtitle: "Ramadan night prayer",
        rakahCount: 2,
        category: .recommended,
        summary:
            "Voluntary night prayers during Ramadan, performed in 2-rakah pairs after "
          + "Isha. The total count varies by tradition — see the prayer notes.",
        rakahs: [
            taraweehFirstRakah(),
            taraweehSecondRakah(),
        ]
    )

    private static func taraweehFirstRakah() -> Rakah {
        // Standard first rakah of an audible 2-rakah prayer.
        // We add a tradition note as the first step so the user sees it
        // before beginning.
        let intro = PrayerStep(
            id: "taraweeh-intro",
            title: "Before You Begin",
            posture: .standing,
            assetName: nil,
            instruction:
                "Tarāwīḥ is performed in 2-rakah pairs. After this complete unit, "
              + "you may rest briefly and then begin another pair. Continue until you "
              + "have completed the number of rakahs followed in your tradition. "
              + "After every 4 rakahs, a longer pause (called tarwīḥa, from which the "
              + "prayer takes its name) is traditional.",
            recitation: nil,
            tip: "20 rakahs is the practice of the major Sunni schools. 8 rakahs is also widely practised based on the report of ʿĀ'isha on the Prophet's ﷺ qiyām al-layl.",
            madhhabNote:
                "Tarāwīḥ as a congregational practice is specific to Sunni traditions. "
              + "Ja'farī users typically perform additional rakahs of nāfila during "
              + "Ramadan nights individually, with a different distribution."
        )

        let standard = RakahBuilder.first(prayer: "taraweeh", audible: true)
        return Rakah(
            number: 1,
            stepsSunni: [intro] + standard.stepsSunni,
            stepsShia:  [intro] + (standard.stepsShia ?? standard.stepsSunni)
        )
    }

    private static func taraweehSecondRakah() -> Rakah {
        RakahBuilder.second(prayer: "taraweeh", audible: true, isFinal: true)
    }
}
