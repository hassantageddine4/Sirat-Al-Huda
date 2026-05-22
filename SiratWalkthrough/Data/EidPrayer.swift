//
//  EidPrayer.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Ṣalāt al-ʿĪd — the Eid prayer, performed once a year on Eid al-Fitr
//  (after Ramadan) and Eid al-Adha (during Hajj). Two rakahs prayed in
//  congregation, with EXTRA takbīrs in qiyām that distinguish it from
//  the daily prayers. Followed by a khuṭbah (delivered AFTER the prayer,
//  unlike Jumuʿah).
//
//  Number of extra takbīrs per tradition (in addition to the opening
//  takbīrat al-iḥrām and the takbīrs of transitioning into rukūʿ):
//   • Hanafī Sunni:    3 in r1, 3 in r2 (total 6 extra)
//   • Shāfiʿī Sunni:   7 in r1, 5 in r2 (total 12 extra) — most common reference
//   • Mālikī Sunni:    6 in r1 (incl. opening), 5 in r2
//   • Ja'farī Shia:    5 in r1, 4 in r2 (with qunūt between each)
//
//  This file models the **Shāfiʿī form (7+5)** for Sunni mode and the
//  **Ja'farī form (5+4)** for Shia mode, since those are the two most
//  commonly referenced standards in their respective traditions. Hanafīs
//  and Mālikīs adjust accordingly.
//
//  ⚠️ DRAFT — review by qualified scholars from each madhhab.
//

import Foundation

private enum EidStep {

    /// One extra takbir step. Position is which-of-many: 1 of 7, 2 of 7, etc.
    static func extraTakbir(rakah: Int, position: Int, total: Int) -> PrayerStep {
        PrayerStep(
            id: "eid-r\(rakah)-takbir-\(position)",
            title: "Extra Takbīr (\(position) of \(total))",
            posture: .standing,
            assetName: position == 1 ? "pose_takbir_sunni" : nil,
            instruction:
                "Raise both hands to the level of the ears, say 'Allāhu Akbar', then "
              + "lower the hands. Between each takbīr, recite the brief tasbīḥ silently.",
            recitation: ExtendedRecitations.eidBetweenTakbirs,
            tip: position == total
                ? "After this final extra takbīr, fold the hands and continue with Al-Fātiḥah."
                : nil,
            madhhabNote: nil
        )
    }
}

public extension PrayerCatalog {

    static let eid = Prayer(
        id: "eid",
        name: "Eid",
        arabicName: "العيد",
        subtitle: "Eid prayer",
        rakahCount: 2,
        category: .occasional,
        summary:
            "Two audible rakahs prayed in congregation on Eid al-Fitr and Eid al-Adha, "
          + "distinguished by extra takbīrs in qiyām. Followed by a khuṭbah.",
        rakahs: [
            Rakah(
                number: 1,
                stepsSunni: eidFirstRakahSunni(),
                stepsShia:  eidFirstRakahShia()
            ),
            Rakah(
                number: 2,
                stepsSunni: eidSecondRakahSunni(),
                stepsShia:  eidSecondRakahShia()
            ),
        ]
    )

    // MARK: - Sunni (Shāfiʿī form: 7 extra in r1, 5 extra in r2)

    private static func eidFirstRakahSunni() -> [PrayerStep] {
        let prayer = "eid"
        let rakah  = 1
        let qiyamFirst = Step.qiyamFirst(prayer: prayer, rakah: rakah)
        let takbir     = Step.takbirOpening(prayer: prayer, rakah: rakah)

        // 7 extra takbīrs after the opening takbīr.
        let extras: [PrayerStep] = (1...7).map {
            EidStep.extraTakbir(rakah: rakah, position: $0, total: 7)
        }

        let body: [PrayerStep] = [
            Step.istiftah(prayer: prayer, rakah: rakah),
            // ta'awwudh comes after the istiftah and the extra takbīrs in
            // most descriptions, before Fātiḥah.
            Step.taawwudh(prayer: prayer, rakah: rakah),
            Step.fatiha(prayer: prayer, rakah: rakah, audible: true),
            Step.surah(prayer: prayer, rakah: rakah, audible: true),
            Step.ruku(prayer: prayer, rakah: rakah),
            Step.iʿtidāl(prayer: prayer, rakah: rakah),
        ]

        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: rakah).sunni
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: rakah).sunni
        let jalsa  = Step.jalsa(prayer: prayer, rakah: rakah)

        return [qiyamFirst.sunni, takbir.sunni] + extras + body
             + [sujud1, jalsa, sujud2]
    }

    private static func eidSecondRakahSunni() -> [PrayerStep] {
        let prayer = "eid"
        let rakah  = 2
        let qiyam  = RakahBuilder.qiyamMid(prayer: prayer, rakah: rakah)

        // 5 extra takbīrs at the start of the second rakah.
        let extras: [PrayerStep] = (1...5).map {
            EidStep.extraTakbir(rakah: rakah, position: $0, total: 5)
        }

        let body: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: rakah, audible: true),
            Step.surah(prayer: prayer, rakah: rakah, audible: true),
            Step.ruku(prayer: prayer, rakah: rakah),
            Step.iʿtidāl(prayer: prayer, rakah: rakah),
        ]

        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: rakah).sunni
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: rakah).sunni
        let jalsa  = Step.jalsa(prayer: prayer, rakah: rakah)
        let tash   = Step.tashahhud(prayer: prayer, rakah: rakah, isFinal: true).sunni

        return [qiyam.sunni] + extras + body
             + [sujud1, jalsa, sujud2, tash,
                Step.salawat(prayer: prayer, rakah: rakah),
                Step.salam(prayer: prayer, rakah: rakah)]
    }

    // MARK: - Shia (Ja'farī form: 5 extra in r1, 4 extra in r2)

    private static func eidFirstRakahShia() -> [PrayerStep] {
        let prayer = "eid"
        let rakah  = 1
        let qiyamFirst = Step.qiyamFirst(prayer: prayer, rakah: rakah)
        let takbir     = Step.takbirOpening(prayer: prayer, rakah: rakah)

        let extras: [PrayerStep] = (1...5).map {
            EidStep.extraTakbir(rakah: rakah, position: $0, total: 5)
        }

        let body: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: rakah, audible: true),
            Step.surah(prayer: prayer, rakah: rakah, audible: true),
            Step.ruku(prayer: prayer, rakah: rakah),
            Step.iʿtidāl(prayer: prayer, rakah: rakah),
        ]

        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: rakah).shia
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: rakah).shia
        let jalsa  = Step.jalsa(prayer: prayer, rakah: rakah)

        return [qiyamFirst.shia, takbir.shia] + extras + body
             + [sujud1, jalsa, sujud2]
    }

    private static func eidSecondRakahShia() -> [PrayerStep] {
        let prayer = "eid"
        let rakah  = 2
        let qiyam  = RakahBuilder.qiyamMid(prayer: prayer, rakah: rakah)

        let extras: [PrayerStep] = (1...4).map {
            EidStep.extraTakbir(rakah: rakah, position: $0, total: 4)
        }

        let body: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: rakah, audible: true),
            Step.surah(prayer: prayer, rakah: rakah, audible: true),
            Step.ruku(prayer: prayer, rakah: rakah),
            Step.iʿtidāl(prayer: prayer, rakah: rakah),
        ]

        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: rakah).shia
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: rakah).shia
        let jalsa  = Step.jalsa(prayer: prayer, rakah: rakah)
        let tash   = Step.tashahhud(prayer: prayer, rakah: rakah, isFinal: true).shia

        return [qiyam.shia] + extras + body
             + [sujud1, jalsa, sujud2, tash,
                Step.salam(prayer: prayer, rakah: rakah)]
    }
}
