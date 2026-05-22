//
//  JanazahPrayer.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Ṣalāt al-Janāzah — the funeral prayer. A communal obligation (farḍ kifāyah)
//  that differs structurally from every other prayer:
//   • No rukūʿ.
//   • No sujūd.
//   • Stood throughout.
//   • Four takbīrs, each followed by a specific recitation/du'a.
//   • Concludes with a single salām (some scholars: two).
//   • Usually one rakah (formally), but we model the four takbir blocks
//     as four "steps" within a single rakah.
//
//  Madhhab notes:
//   • The ḥanafī tradition has slightly different positions of hands and
//     wording of the closing du'a.
//   • Ja'farī Janāzah has FIVE takbīrs, not four. The Shia toggle gives
//     the 5-takbir form below.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab.
//

import Foundation

private enum JanazahStep {

    /// Standing position, intention.
    static func standing() -> (sunni: PrayerStep, shia: PrayerStep) {
        let sunni = PrayerStep(
            id: "janazah-r1-qiyam",
            title: "Standing & Intention",
            posture: .standing,
            assetName: "pose_qiyam_sunni",
            instruction:
                "Stand facing the qiblah with the deceased before you, the imam "
              + "level with the deceased's head (for a man) or middle (for a woman). "
              + "Form the silent intention to pray ṣalāt al-janāzah for this person.",
            recitation: nil,
            tip: "The deceased should be placed between the imam and the qiblah.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "janazah-r1-qiyam",
            title: "Standing & Intention",
            posture: .standing,
            assetName: "pose_qiyam_shia",
            instruction:
                "Stand facing the qiblah with the deceased before you. Form the silent "
              + "intention to pray ṣalāt al-janāzah for this person.",
            recitation: nil,
            tip: nil,
            madhhabNote: nil
        )
        return (sunni, shia)
    }

    /// First takbir — opening, recite Fatiha after.
    static func firstTakbir() -> PrayerStep {
        PrayerStep(
            id: "janazah-takbir-1",
            title: "First Takbīr",
            posture: .standing,
            assetName: nil,
            instruction:
                "Raise both hands and say 'Allāhu Akbar', then fold them over the chest "
              + "(or let them rest at the sides per Ja'farī practice). "
              + "Recite Al-Fātiḥah silently.",
            recitation: ExtendedRecitations.janazahFatiha,
            tip: "There is no surah after Fātiḥah in Janāzah; only Fātiḥah.",
            madhhabNote: nil
        )
    }

    /// Second takbir — Salawāt on the Prophet ﷺ.
    static func secondTakbir() -> PrayerStep {
        PrayerStep(
            id: "janazah-takbir-2",
            title: "Second Takbīr",
            posture: .standing,
            assetName: nil,
            instruction:
                "Say 'Allāhu Akbar' (without raising hands in some traditions; "
              + "with hands raised in others). Recite the ṣalawāt on the Prophet ﷺ silently.",
            recitation: ExtendedRecitations.janazahSalawat,
            tip: "This is the same Ibrāhīmī ṣalawāt recited in the regular tashahhud.",
            madhhabNote: "Some Sunni schools raise the hands at every takbīr in Janāzah; others only at the first. Both positions are valid."
        )
    }

    /// Third takbir — du'a for the deceased.
    static func thirdTakbir() -> PrayerStep {
        PrayerStep(
            id: "janazah-takbir-3",
            title: "Third Takbīr",
            posture: .standing,
            assetName: nil,
            instruction:
                "Say 'Allāhu Akbar', then make du'a for the deceased silently. "
              + "Use the masculine, feminine, or plural form appropriate to the deceased.",
            recitation: ExtendedRecitations.janazahDuaForDeceased,
            tip: "If the deceased is female, change 'lahū' to 'lahā'. For multiple deceased, use 'lahum'.",
            madhhabNote: nil
        )
    }

    /// Fourth takbir — closing du'a.
    static func fourthTakbir() -> PrayerStep {
        PrayerStep(
            id: "janazah-takbir-4",
            title: "Fourth Takbīr",
            posture: .standing,
            assetName: nil,
            instruction:
                "Say 'Allāhu Akbar', then make a brief closing du'a for the deceased "
              + "and for the believers, silently.",
            recitation: ExtendedRecitations.janazahDuaClosing,
            tip: nil,
            madhhabNote: nil
        )
    }

    /// Fifth takbir — Ja'farī addition (Shia practice).
    static func fifthTakbirShia() -> PrayerStep {
        PrayerStep(
            id: "janazah-takbir-5",
            title: "Fifth Takbīr",
            posture: .standing,
            assetName: nil,
            instruction:
                "Say 'Allāhu Akbar' a fifth time. In the Ja'farī tradition, Janāzah "
              + "has five takbīrs, with specific du'as and ṣalawāt distributed across "
              + "them. Consult your marja for the exact wording.",
            recitation: nil,
            tip: nil,
            madhhabNote: "Sunni Janāzah ends after the fourth takbīr. Ja'farī Janāzah includes a fifth."
        )
    }

    /// Final salām — Janazah ends here; no sujūd, no tashahhud.
    static func closingSalam() -> PrayerStep {
        PrayerStep(
            id: "janazah-salam",
            title: "Closing Salām",
            posture: .standing,
            assetName: nil,
            instruction:
                "Turn the head to the right and say 'As-salāmu ʿalaykum wa raḥmatullāh'. "
              + "Some schools turn left as well; others give a single salām while standing. "
              + "The prayer is complete.",
            recitation: RecitationLibrary.salam,
            tip: nil,
            madhhabNote: "Janāzah is performed standing throughout — no rukūʿ, no sujūd, no tashahhud sitting."
        )
    }
}

public extension PrayerCatalog {

    static let janazah = Prayer(
        id: "janazah",
        name: "Janāzah",
        arabicName: "الجنازة",
        subtitle: "Funeral prayer",
        rakahCount: 1,
        category: .occasional,
        summary:
            "A communal obligation prayed standing for the deceased. Four takbīrs "
          + "(five in the Ja'farī tradition), no rukūʿ or sujūd, ending with salām.",
        rakahs: [
            Rakah(
                number: 1,
                stepsSunni: [
                    JanazahStep.standing().sunni,
                    JanazahStep.firstTakbir(),
                    JanazahStep.secondTakbir(),
                    JanazahStep.thirdTakbir(),
                    JanazahStep.fourthTakbir(),
                    JanazahStep.closingSalam(),
                ],
                stepsShia: [
                    JanazahStep.standing().shia,
                    JanazahStep.firstTakbir(),
                    JanazahStep.secondTakbir(),
                    JanazahStep.thirdTakbir(),
                    JanazahStep.fourthTakbir(),
                    JanazahStep.fifthTakbirShia(),
                    JanazahStep.closingSalam(),
                ]
            )
        ]
    )
}
