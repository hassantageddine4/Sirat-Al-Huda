//
//  TravelGuidance.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Travel prayer (Qaṣr / Combining) isn't a separate prayer — it's a set of
//  rules that modify the daily prayers. This file provides a "guidance"
//  entry that, when tapped from the prayer list, shows informational
//  steps explaining the rules rather than walking through a prayer.
//
//  The walkthrough engine treats this as a single rakah of informational
//  steps (no actual rakah is performed). The PoseStage and RecitationCard
//  gracefully handle steps without poses or recitations, so this works
//  with no engine changes.
//
//  ⚠️ DRAFT — the rules vary subtly between schools (especially the
//  threshold distance and duration). Review with a scholar before shipping.
//

import Foundation

public extension PrayerCatalog {

    static let travelGuidance = Prayer(
        id: "travel",
        name: "Travel & Qaṣr",
        arabicName: "القصر",
        subtitle: "Shortening prayers while travelling",
        rakahCount: 1,
        category: .situational,
        summary:
            "When travelling beyond a defined distance, the four-rakah obligatory "
          + "prayers (Dhuhr, Asr, Isha) are shortened to two rakahs. This is a "
          + "guidance entry, not a walkthrough.",
        rakahs: [
            Rakah(
                number: 1,
                stepsSunni: travelSteps(madhhab: .sunni),
                stepsShia:  travelSteps(madhhab: .shia)
            )
        ]
    )

    private static func travelSteps(madhhab: Madhhab) -> [PrayerStep] {
        let distance = madhhab == .sunni
            ? "Approximately 48 miles (about 80 km), or roughly the distance traditionally walked in two days. Modern scholars often interpret this as the threshold for international or significantly long travel."
            : "Approximately 8 farsakh (about 44 km / 27 miles) by land, with a return planned in less than 10 days."
        let duration = madhhab == .sunni
            ? "If you intend to stay at your destination for more than 4 days (excluding the days of arrival and departure), you become resident and pray fully. The Hanafī school sets the threshold at 15 days."
            : "If you intend to stay 10 days or more, you pray fully. Less than 10 days, continue praying qaṣr."
        let combiningNote = madhhab == .sunni
            ? "Combining (jamʿ) of Dhuhr+Asr or Maghrib+Isha is permitted while travelling — pray them together at the time of either, joined but each shortened."
            : "Combining is permitted not only in travel but at home as well in the Ja'farī tradition: Dhuhr+Asr together (with their adhāns), Maghrib+Isha together. Many practising Shia Muslims combine these as their normal practice."

        return [
            PrayerStep(
                id: "travel-intro",
                title: "What is Qaṣr?",
                posture: .standing,
                assetName: nil,
                instruction:
                    "Qaṣr (literally 'shortening') is the concession given to travellers "
                  + "to pray the four-rakah obligatory prayers as two rakahs instead. "
                  + "Fajr (2 rakahs) and Maghrib (3 rakahs) remain unchanged. "
                  + "This concession is mentioned in Qur'an 4:101.",
                recitation: nil,
                tip: nil,
                madhhabNote: nil
            ),
            PrayerStep(
                id: "travel-distance",
                title: "Threshold Distance",
                posture: .standing,
                assetName: nil,
                instruction:
                    "Qaṣr applies when your journey exceeds the threshold distance from your "
                  + "city of residence.\n\n" + distance,
                recitation: nil,
                tip: nil,
                madhhabNote: "The exact threshold has classical and modern interpretations. Confirm with a scholar of your madhhab if in doubt."
            ),
            PrayerStep(
                id: "travel-duration",
                title: "How Long You're Travelling",
                posture: .standing,
                assetName: nil,
                instruction:
                    "Qaṣr is a concession for travel, not for residency at the destination.\n\n"
                  + duration,
                recitation: nil,
                tip: nil,
                madhhabNote: nil
            ),
            PrayerStep(
                id: "travel-which",
                title: "Which Prayers Are Shortened?",
                posture: .standing,
                assetName: nil,
                instruction:
                    "Shortened to 2 rakahs:  Dhuhr, Asr, Isha.\n\n"
                  + "Unchanged:  Fajr (2 rakahs), Maghrib (3 rakahs).\n\n"
                  + "When you pray a shortened prayer, simply walk through 2 rakahs of the "
                  + "prayer in this app — the guide for Fajr's structure is the closest "
                  + "match. Make the intention for the shortened version of the prayer.",
                recitation: nil,
                tip: nil,
                madhhabNote: nil
            ),
            PrayerStep(
                id: "travel-combining",
                title: "Combining Prayers (Jamʿ)",
                posture: .standing,
                assetName: nil,
                instruction:
                    "Travelling also permits combining certain prayers together at the time "
                  + "of one of them.\n\n" + combiningNote,
                recitation: nil,
                tip: "When combining, pray each prayer in full sequence — finish one prayer entirely, then begin the next.",
                madhhabNote: nil
            ),
            PrayerStep(
                id: "travel-prayer-behind-resident",
                title: "Praying Behind a Resident",
                posture: .standing,
                assetName: nil,
                instruction:
                    "If you (a traveller) pray behind a resident imam who is praying the full "
                  + "4 rakahs, you complete the full prayer with him — you do not shorten. "
                  + "If a resident prays behind a traveller who shortens, the resident "
                  + "completes the remaining rakahs after the traveller's salām.",
                recitation: nil,
                tip: nil,
                madhhabNote: nil
            ),
        ]
    }
}
