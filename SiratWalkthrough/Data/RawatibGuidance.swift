//
//  RawatibGuidance.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Rawātib (regular sunnah prayers paired with the daily 5) are voluntary
//  2-rakah units. The "what to pray" is identical to a standard 2-rakah
//  voluntary prayer; the "when" is what defines them.
//
//  This file provides a guidance entry that explains the sunnah schedule.
//  When the user wants to actually pray a rawātib unit, they tap one of
//  the standard 2-rakah voluntary prayers (Tahajjud's structure is the
//  closest match).
//
//  Counts vary by tradition — what's shown is the most-cited Hadith-based
//  schedule. The Ja'farī (Shia) sunnah schedule is structured around
//  ṣalāt al-layl and the nāfila of each obligatory prayer, with different
//  totals.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab.
//

import Foundation

public extension PrayerCatalog {

    static let rawatibGuidance = Prayer(
        id: "rawatib",
        name: "Rawātib",
        arabicName: "الرواتب",
        subtitle: "Regular sunnah prayers",
        rakahCount: 1,
        category: .situational,
        summary:
            "Voluntary 2-rakah prayers that accompany the daily 5. This guide explains "
          + "the schedule; pray each unit using the standard 2-rakah structure.",
        rakahs: [
            Rakah(
                number: 1,
                stepsSunni: rawatibSteps(madhhab: .sunni),
                stepsShia:  rawatibSteps(madhhab: .shia)
            )
        ]
    )

    private static func rawatibSteps(madhhab: Madhhab) -> [PrayerStep] {
        let intro = PrayerStep(
            id: "rawatib-intro",
            title: "What are Rawātib?",
            posture: .standing,
            assetName: nil,
            instruction:
                "Rawātib are voluntary prayers performed before or after the obligatory "
              + "daily prayers. The Prophet ﷺ regularly observed twelve rakahs of these "
              + "daily, with the promise that whoever maintains them will have a house "
              + "built for them in Paradise (Sunan al-Tirmidhī).",
            recitation: nil,
            tip: "Each rawātib unit is 2 rakahs — pray them like any standard voluntary 2-rakah prayer.",
            madhhabNote: nil
        )

        if madhhab == .sunni {
            return [
                intro,
                rawatibStep(id: "rawatib-fajr",
                            title: "Before Fajr — 2 rakahs",
                            instruction:
                                "Two rakahs prayed BEFORE Fajr's obligatory prayer. "
                              + "These are the most strongly emphasized rawātib — "
                              + "the Prophet ﷺ rarely missed them, even while travelling. "
                              + "Recite Al-Fātiḥah and a short sūrah; keep them brief."),
                rawatibStep(id: "rawatib-dhuhr-before",
                            title: "Before Dhuhr — 4 rakahs",
                            instruction:
                                "Four rakahs prayed BEFORE Dhuhr (in two pairs of 2). "
                              + "Some scholars recommend 2 instead of 4."),
                rawatibStep(id: "rawatib-dhuhr-after",
                            title: "After Dhuhr — 2 rakahs",
                            instruction:
                                "Two rakahs prayed AFTER Dhuhr's obligatory prayer."),
                rawatibStep(id: "rawatib-maghrib",
                            title: "After Maghrib — 2 rakahs",
                            instruction:
                                "Two rakahs prayed AFTER Maghrib's obligatory prayer."),
                rawatibStep(id: "rawatib-isha",
                            title: "After Isha — 2 rakahs",
                            instruction:
                                "Two rakahs prayed AFTER Isha's obligatory prayer.\n\n"
                              + "Total daily: 12 rakahs of regularly-observed sunnah."),
                rawatibStep(id: "rawatib-asr",
                            title: "Before Asr — 4 rakahs (additional)",
                            instruction:
                                "Four rakahs before Asr are additionally recommended (sunnah ghayr mu'akkadah). "
                              + "The Prophet ﷺ said: 'May Allah have mercy on the one who prays four before Asr.'"),
            ]
        } else {
            // Ja'farī schedule
            return [
                intro,
                rawatibStep(id: "rawatib-fajr-shia",
                            title: "Before Fajr — 2 rakahs (nāfilat al-fajr)",
                            instruction:
                                "Two rakahs prayed BEFORE Fajr's obligatory prayer."),
                rawatibStep(id: "rawatib-dhuhr-shia",
                            title: "Before Dhuhr — 8 rakahs (nāfilat aẓ-ẓuhr)",
                            instruction:
                                "Eight rakahs prayed BEFORE Dhuhr (in 2-rakah pairs)."),
                rawatibStep(id: "rawatib-asr-shia",
                            title: "Before Asr — 8 rakahs (nāfilat al-ʿaṣr)",
                            instruction:
                                "Eight rakahs prayed BEFORE Asr (in 2-rakah pairs)."),
                rawatibStep(id: "rawatib-maghrib-shia",
                            title: "After Maghrib — 4 rakahs (nāfilat al-maghrib)",
                            instruction:
                                "Four rakahs prayed AFTER Maghrib (in 2-rakah pairs)."),
                rawatibStep(id: "rawatib-isha-shia",
                            title: "After Isha — 2 rakahs (al-witīra, sitting)",
                            instruction:
                                "Two rakahs prayed AFTER Isha — performed while seated, "
                              + "counted as one in the Ja'farī tradition."),
                rawatibStep(id: "rawatib-layl-shia",
                            title: "Ṣalāt al-Layl — 11 rakahs (night)",
                            instruction:
                                "Eleven rakahs at night before Fajr: 8 rakahs of nāfilat "
                              + "al-layl, 2 rakahs of shafʿ, and 1 rakah of witr.\n\n"
                              + "Total daily nawāfil: 34 rakahs in the standard Ja'farī "
                              + "schedule, twice the obligatory count."),
            ]
        }
    }

    private static func rawatibStep(id: String, title: String, instruction: String) -> PrayerStep {
        PrayerStep(
            id: id,
            title: title,
            posture: .standing,
            assetName: nil,
            instruction: instruction,
            recitation: nil,
            tip: nil,
            madhhabNote: nil
        )
    }
}
