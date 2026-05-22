//
//  PrayerData.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Daily-five prayer content. Each prayer is composed by combining standard
//  rakah templates from `RakahBuilder`, which keeps this file readable and
//  ensures every rakah of every prayer has consistent step structure.
//
//  ⚠️ DRAFT — review by qualified scholars before shipping. Sources:
//      Sunni  : Sahih al-Bukhari, Sunan Abi Dawud, SeekersGuidance materials
//      Shia   : Tawdih al-Masa'il (Sistani), Al-Islam.org practical guide
//

import Foundation

// MARK: - Step Builder
// Centralises step construction so prayers share consistent IDs/titles.
// Internal access (not private) so other prayer data files (Witr, Jumu'ah,
// Janazah, Eid, etc.) can compose rakahs from the same building blocks.

internal enum Step {

    static func qiyamFirst(prayer: String, rakah: Int) -> (sunni: PrayerStep, shia: PrayerStep) {
        let sunni = PrayerStep(
            id: "\(prayer)-r\(rakah)-qiyam",
            title: "Standing — Qiyām",
            posture: .standing,
            assetName: "pose_qiyam_sunni",
            instruction: "Stand upright facing the qiblah. Form the intention (niyyah) silently in your heart for \(prayer.capitalized).",
            recitation: nil,
            tip: "Niyyah is in the heart. There is no requirement to verbalise it.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-qiyam",
            title: "Standing — Qiyām",
            posture: .standing,
            assetName: "pose_qiyam_shia",
            instruction: "Stand upright facing the qiblah with arms at your sides. Form the intention (niyyah) silently in your heart for \(prayer.capitalized).",
            recitation: nil,
            tip: "In the Ja'fari tradition, the hands rest at the sides during qiyām, not folded.",
            madhhabNote: nil
        )
        return (sunni, shia)
    }

    static func takbirOpening(prayer: String, rakah: Int) -> (sunni: PrayerStep, shia: PrayerStep) {
        let common = PrayerStep(
            id: "\(prayer)-r\(rakah)-takbir",
            title: "Opening Takbīr",
            posture: .standing,
            assetName: nil,
            instruction: "Raise both hands to the level of your ears (or shoulders) and say the opening takbīr. This enters you into the prayer; until this point you may still turn back.",
            recitation: RecitationLibrary.takbirOpening,
            tip: "Open palms face the qiblah. Fingers neither tightly closed nor splayed.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-takbir",
            title: "Takbīrat al-Iḥrām",
            posture: .standing,
            assetName: nil,
            instruction: "Raise both hands to the level of your ears with palms facing the qiblah and say the opening takbīr. This is the takbīr of consecration.",
            recitation: RecitationLibrary.takbirOpening,
            tip: "After the takbīr, lower the hands to the sides — the Ja'fari position throughout qiyām.",
            madhhabNote: "Ja'fari practice: hands rest at the sides after the takbīr, not folded."
        )
        return (common, shia)
    }

    static func istiftah(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-istiftah",
            title: "Du'a al-Istiftāḥ",
            posture: .standing,
            assetName: nil,
            instruction: "After folding the hands, recite the opening supplication silently before Al-Fātiḥah.",
            recitation: RecitationLibrary.istiftahSunni,
            tip: "Recited only in the first rakah.",
            madhhabNote: nil
        )
    }

    static func taawwudh(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-taawwudh",
            title: "Ta'awwudh",
            posture: .standing,
            assetName: nil,
            instruction: "Seek refuge in Allah from Shayṭān before beginning the recitation of the Qur'an.",
            recitation: RecitationLibrary.taawwudh,
            tip: "Recited silently only in the first rakah.",
            madhhabNote: nil
        )
    }

    static func fatiha(prayer: String, rakah: Int, audible: Bool) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-fatiha",
            title: "Recite Al-Fātiḥah",
            posture: .standing,
            assetName: nil,
            instruction: audible
                ? "Recite Al-Fātiḥah audibly. The Imam recites; the followers listen attentively."
                : "Recite Al-Fātiḥah silently in your heart, moving the lips quietly.",
            recitation: RecitationLibrary.fatiha,
            tip: "Pause briefly after each verse where indicated by the sign ۝.",
            madhhabNote: nil
        )
    }

    static func surah(prayer: String, rakah: Int, audible: Bool) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-surah",
            title: "Recite a Sūrah",
            posture: .standing,
            assetName: nil,
            instruction: audible
                ? "Recite a sūrah or portion of the Qur'an audibly after Al-Fātiḥah. Al-Ikhlāṣ is shown as an example."
                : "Recite a sūrah or portion of the Qur'an silently after Al-Fātiḥah. Al-Ikhlāṣ is shown as an example.",
            recitation: RecitationLibrary.ikhlas,
            tip: "Only required in the first two rakahs of any obligatory prayer.",
            madhhabNote: nil
        )
    }

    static func ruku(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-ruku",
            title: "Bowing — Rukūʿ",
            posture: .bowing,
            assetName: "pose_ruku_sunni",
            instruction: "Say 'Allāhu Akbar' as you bow forward. Place your hands firmly on your knees with your back straight and parallel to the ground. Recite the tasbīḥ at least three times.",
            recitation: RecitationLibrary.tasbihRuku,
            tip: "The back, neck, and head form one straight line. Keep the eyes on the spot of prostration.",
            madhhabNote: nil
        )
    }

    static func iʿtidāl(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-iitidal",
            title: "Rising — Iʿtidāl",
            posture: .standing,
            assetName: nil,
            instruction: "Rise from rukūʿ to a fully upright standing position, saying 'Sami'a-llāhu liman ḥamidah'. Once standing, complete the response.",
            recitation: RecitationLibrary.samiAllah,
            tip: "Stand calmly upright before going into sujūd — rushing past this position is a common error.",
            madhhabNote: nil
        )
    }

    static func sujudFirst(prayer: String, rakah: Int) -> (sunni: PrayerStep, shia: PrayerStep) {
        let sunni = PrayerStep(
            id: "\(prayer)-r\(rakah)-sujud-1",
            title: "First Prostration — Sujūd",
            posture: .prostrating,
            assetName: "pose_sujood_sunni",
            instruction: "Say 'Allāhu Akbar' and prostrate so that seven body parts touch the ground: forehead (with the nose), both palms, both knees, and the toes of both feet. Recite the tasbīḥ at least three times.",
            recitation: RecitationLibrary.tasbihSujud,
            tip: "Keep elbows lifted off the ground and away from the sides.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-sujud-1",
            title: "First Prostration — Sujūd",
            posture: .prostrating,
            assetName: "pose_sujood_shia",
            instruction: "Say 'Allāhu Akbar' and prostrate. The forehead must rest on something it is permissible to prostrate upon — most commonly a turbah (clay tablet from the earth of Karbala). Both palms, both knees, and the big toes of both feet should also touch the ground.",
            recitation: RecitationLibrary.tasbihSujud,
            tip: "If a turbah is not available, prostrate on something earthen or plant-based that is not eaten or worn (e.g. paper, a leaf, unprocessed wood).",
            madhhabNote: "The turbah ensures the forehead rests on something permissible for sujūd in the Ja'fari tradition."
        )
        return (sunni, shia)
    }

    static func jalsa(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-jalsa",
            title: "Sitting Between Prostrations",
            posture: .kneeling,
            assetName: nil,
            instruction: "Rise from sujūd into a brief seated position with calmness. Recite the short du'a of forgiveness before going into the second prostration.",
            recitation: RecitationLibrary.dhikrJalsa,
            tip: "Sit upright with the left foot folded beneath you and the right foot upright (Sunni) or sit on the left thigh (Shia, mutawarrik).",
            madhhabNote: nil
        )
    }

    static func sujudSecond(prayer: String, rakah: Int) -> (sunni: PrayerStep, shia: PrayerStep) {
        let sunni = PrayerStep(
            id: "\(prayer)-r\(rakah)-sujud-2",
            title: "Second Prostration — Sujūd",
            posture: .prostrating,
            assetName: "pose_sujood_sunni",
            instruction: "Say 'Allāhu Akbar' and prostrate again. Recite the tasbīḥ of sujūd at least three more times. This completes the second prostration of this rakah.",
            recitation: RecitationLibrary.tasbihSujud,
            tip: "Two prostrations make one rakah. Counting them keeps you on track.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-sujud-2",
            title: "Second Prostration — Sujūd",
            posture: .prostrating,
            assetName: "pose_sujood_shia",
            instruction: "Say 'Allāhu Akbar' and prostrate again on the turbah, with all seven points of contact. Recite the tasbīḥ at least three more times.",
            recitation: RecitationLibrary.tasbihSujud,
            tip: nil,
            madhhabNote: nil
        )
        return (sunni, shia)
    }

    static func tashahhud(prayer: String, rakah: Int, isFinal: Bool) -> (sunni: PrayerStep, shia: PrayerStep) {
        let sunni = PrayerStep(
            id: "\(prayer)-r\(rakah)-tashahhud",
            title: isFinal ? "Final Tashahhud" : "Tashahhud",
            posture: .kneeling,
            assetName: "pose_tashahhud_sunni",
            instruction: "Sit calmly with hands resting on the thighs. Recite the tashahhud, raising the right index finger at 'lā ilāha illa-llāh'. \(isFinal ? "Then send blessings on the Prophet ﷺ before the final salām." : "")",
            recitation: RecitationLibrary.tashahhudSunni,
            tip: "The left hand rests on the left thigh; the right hand on the right thigh, with the index finger pointing forward.",
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-tashahhud",
            title: isFinal ? "Final Tashahhud" : "Tashahhud",
            posture: .kneeling,
            assetName: "pose_tashahhud_shia",
            instruction: "Sit on the left thigh (mutawarrik posture) with the right foot resting on the left. Recite the Ja'fari form of the tashahhud, including the ṣalawāt on the Prophet ﷺ and his family.",
            recitation: RecitationLibrary.tashahhudShia,
            tip: "Sending blessings on Muḥammad and his family is part of the tashahhud itself in Ja'fari practice.",
            madhhabNote: nil
        )
        return (sunni, shia)
    }

    static func salawat(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-salawat",
            title: "Ṣalawāt — Blessings on the Prophet ﷺ",
            posture: .kneeling,
            assetName: nil,
            instruction: "After the tashahhud, recite the ṣalawāt sending blessings upon the Prophet ﷺ and his family.",
            recitation: RecitationLibrary.salawat,
            tip: nil,
            madhhabNote: nil
        )
    }

    static func salam(prayer: String, rakah: Int) -> PrayerStep {
        PrayerStep(
            id: "\(prayer)-r\(rakah)-salam",
            title: "Closing Salām",
            posture: .kneeling,
            assetName: "pose_salam_sunni",
            instruction: "Turn your head to the right and say the salām. Then turn it to the left and repeat. The prayer is now complete.",
            recitation: RecitationLibrary.salam,
            tip: "The intention of the salām is greeting the angels recording the prayer and the believers around you.",
            madhhabNote: nil
        )
    }
}

// MARK: - Rakah Builder

internal enum RakahBuilder {

    /// First rakah of an obligatory prayer — includes istiftāḥ and ta'awwudh.
    static func first(prayer: String, audible: Bool) -> Rakah {
        let qiyam   = Step.qiyamFirst(prayer: prayer, rakah: 1)
        let takbir  = Step.takbirOpening(prayer: prayer, rakah: 1)
        let sujud1  = Step.sujudFirst(prayer: prayer, rakah: 1)
        let sujud2  = Step.sujudSecond(prayer: prayer, rakah: 1)

        let shared: [PrayerStep] = [
            Step.istiftah(prayer: prayer, rakah: 1),
            Step.taawwudh(prayer: prayer, rakah: 1),
            Step.fatiha(prayer: prayer, rakah: 1, audible: audible),
            Step.surah(prayer: prayer, rakah: 1, audible: audible),
            Step.ruku(prayer: prayer, rakah: 1),
            Step.iʿtidāl(prayer: prayer, rakah: 1),
        ]
        let trailing: [PrayerStep] = [
            Step.jalsa(prayer: prayer, rakah: 1),
        ]

        return Rakah(
            number: 1,
            stepsSunni: [qiyam.sunni, takbir.sunni] + shared
                        + [sujud1.sunni] + trailing + [sujud2.sunni],
            stepsShia:  [qiyam.shia, takbir.shia] + shared
                        + [sujud1.shia] + trailing + [sujud2.shia]
        )
    }

    /// Second rakah — includes Fatiha + Surah, ends with tashahhud.
    /// `isFinal` controls whether this rakah ends in salām (2-rakah prayers).
    static func second(prayer: String, audible: Bool, isFinal: Bool) -> Rakah {
        let qiyam   = qiyamMid(prayer: prayer, rakah: 2)
        let sujud1  = Step.sujudFirst(prayer: prayer, rakah: 2)
        let sujud2  = Step.sujudSecond(prayer: prayer, rakah: 2)
        let tash    = Step.tashahhud(prayer: prayer, rakah: 2, isFinal: isFinal)

        let shared: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: 2, audible: audible),
            Step.surah(prayer: prayer, rakah: 2, audible: audible),
            Step.ruku(prayer: prayer, rakah: 2),
            Step.iʿtidāl(prayer: prayer, rakah: 2),
        ]

        var sunniSteps = [qiyam.sunni] + shared
                       + [sujud1.sunni, Step.jalsa(prayer: prayer, rakah: 2), sujud2.sunni]
                       + [tash.sunni]
        var shiaSteps  = [qiyam.shia] + shared
                       + [sujud1.shia, Step.jalsa(prayer: prayer, rakah: 2), sujud2.shia]
                       + [tash.shia]

        if isFinal {
            sunniSteps += [Step.salawat(prayer: prayer, rakah: 2), Step.salam(prayer: prayer, rakah: 2)]
            shiaSteps  += [Step.salam(prayer: prayer, rakah: 2)]
        }

        return Rakah(number: 2, stepsSunni: sunniSteps, stepsShia: shiaSteps)
    }

    /// Rakah 3 (or 4) of a multi-rakah obligatory prayer.
    /// In rakahs 3 & 4 only Al-Fātiḥah is recited (no second sūrah), and
    /// Dhuhr / Asr / 'Isha rakahs 3-4 are silent regardless of the prayer's
    /// general audibility.
    static func laterRakah(prayer: String, number: Int, isFinal: Bool) -> Rakah {
        let qiyam = qiyamMid(prayer: prayer, rakah: number)
        let sujud1 = Step.sujudFirst(prayer: prayer, rakah: number)
        let sujud2 = Step.sujudSecond(prayer: prayer, rakah: number)

        let shared: [PrayerStep] = [
            Step.fatiha(prayer: prayer, rakah: number, audible: false),
            Step.ruku(prayer: prayer, rakah: number),
            Step.iʿtidāl(prayer: prayer, rakah: number),
        ]

        var sunniSteps = [qiyam.sunni] + shared
                       + [sujud1.sunni, Step.jalsa(prayer: prayer, rakah: number), sujud2.sunni]
        var shiaSteps  = [qiyam.shia] + shared
                       + [sujud1.shia, Step.jalsa(prayer: prayer, rakah: number), sujud2.shia]

        if isFinal {
            let tash = Step.tashahhud(prayer: prayer, rakah: number, isFinal: true)
            sunniSteps += [tash.sunni, Step.salawat(prayer: prayer, rakah: number),
                           Step.salam(prayer: prayer, rakah: number)]
            shiaSteps  += [tash.shia, Step.salam(prayer: prayer, rakah: number)]
        }
        return Rakah(number: number, stepsSunni: sunniSteps, stepsShia: shiaSteps)
    }

    /// Standing position for non-first rakahs (no istiftāḥ).
    /// Internal so other prayer data files can use it directly.
    static func qiyamMid(prayer: String, rakah: Int)
        -> (sunni: PrayerStep, shia: PrayerStep) {

        let sunni = PrayerStep(
            id: "\(prayer)-r\(rakah)-qiyam",
            title: "Standing for Rakah \(rakah)",
            posture: .standing,
            assetName: "pose_qiyam_sunni",
            instruction: "Rise to a standing position saying 'Allāhu Akbar', and fold the hands.",
            recitation: nil,
            tip: nil,
            madhhabNote: nil
        )
        let shia = PrayerStep(
            id: "\(prayer)-r\(rakah)-qiyam",
            title: "Standing for Rakah \(rakah)",
            posture: .standing,
            assetName: "pose_qiyam_shia",
            instruction: "Rise to a standing position saying 'Allāhu Akbar', with the arms at the sides.",
            recitation: nil,
            tip: nil,
            madhhabNote: nil
        )
        return (sunni, shia)
    }
}

// MARK: - The Daily Five

public enum PrayerCatalog {

    public static let fajr = Prayer(
        id: "fajr",
        name: "Fajr",
        arabicName: "الفجر",
        subtitle: "Dawn prayer",
        rakahCount: 2,
        category: .obligatory,
        summary: "Two rakahs prayed between dawn and sunrise.",
        rakahs: [
            RakahBuilder.first(prayer: "fajr", audible: true),
            RakahBuilder.second(prayer: "fajr", audible: true, isFinal: true),
        ]
    )

    public static let dhuhr = Prayer(
        id: "dhuhr",
        name: "Dhuhr",
        arabicName: "الظهر",
        subtitle: "Midday prayer",
        rakahCount: 4,
        category: .obligatory,
        summary: "Four rakahs prayed silently after the sun has passed its zenith.",
        rakahs: [
            RakahBuilder.first(prayer: "dhuhr", audible: false),
            RakahBuilder.second(prayer: "dhuhr", audible: false, isFinal: false),
            RakahBuilder.laterRakah(prayer: "dhuhr", number: 3, isFinal: false),
            RakahBuilder.laterRakah(prayer: "dhuhr", number: 4, isFinal: true),
        ]
    )

    public static let asr = Prayer(
        id: "asr",
        name: "Asr",
        arabicName: "العصر",
        subtitle: "Afternoon prayer",
        rakahCount: 4,
        category: .obligatory,
        summary: "Four rakahs prayed silently in the afternoon.",
        rakahs: [
            RakahBuilder.first(prayer: "asr", audible: false),
            RakahBuilder.second(prayer: "asr", audible: false, isFinal: false),
            RakahBuilder.laterRakah(prayer: "asr", number: 3, isFinal: false),
            RakahBuilder.laterRakah(prayer: "asr", number: 4, isFinal: true),
        ]
    )

    public static let maghrib = Prayer(
        id: "maghrib",
        name: "Maghrib",
        arabicName: "المغرب",
        subtitle: "Sunset prayer",
        rakahCount: 3,
        category: .obligatory,
        summary: "Three rakahs prayed shortly after sunset; the first two audible.",
        rakahs: [
            RakahBuilder.first(prayer: "maghrib", audible: true),
            RakahBuilder.second(prayer: "maghrib", audible: true, isFinal: false),
            RakahBuilder.laterRakah(prayer: "maghrib", number: 3, isFinal: true),
        ]
    )

    public static let isha = Prayer(
        id: "isha",
        name: "Isha",
        arabicName: "العشاء",
        subtitle: "Night prayer",
        rakahCount: 4,
        category: .obligatory,
        summary: "Four rakahs prayed at night; the first two audible, the last two silent.",
        rakahs: [
            RakahBuilder.first(prayer: "isha", audible: true),
            RakahBuilder.second(prayer: "isha", audible: true, isFinal: false),
            RakahBuilder.laterRakah(prayer: "isha", number: 3, isFinal: false),
            RakahBuilder.laterRakah(prayer: "isha", number: 4, isFinal: true),
        ]
    )

    public static let dailyFive: [Prayer] = [fajr, dhuhr, asr, maghrib, isha]

    /// Recommended prayers — voluntary regulars.
    public static var recommended: [Prayer] {
        [witr, tahajjud, duha, taraweeh, tawbah, istikhara]
    }

    /// Friday congregation — replaces Dhuhr.
    public static var congregational: [Prayer] { [jumuah] }

    /// Occasional prayers — Janazah, Eid.
    public static var occasional: [Prayer] { [janazah, eid] }

    /// Situational guidance — explains rules rather than walking through prayer.
    public static var situational: [Prayer] { [travelGuidance, rawatibGuidance] }

    public static var all: [Prayer] {
        dailyFive + congregational + recommended + occasional + situational
    }
}
