//
//  WidgetCore.swift
//  Sirat Al huda widget
//
//  Core data layer + theme system. Prayer times are computed LOCALLY
//  via AdhanSwift from lat/lon/method/madhab stored in the App Group.
//  No daily push from the app needed.
//

import SwiftUI
import WidgetKit
import Adhan

let AppGroupID = "group.com.tageddine.siratalhuda"

// ─── Theme ────────────────────────────────────────────────────────────────────

enum WidgetThemeKey: String, CaseIterable {
    case emerald, sapphire, royal, crimson, gold, midnight, silver, teal, sandstone, beige, forest

    static var current: WidgetThemeKey {
        let raw = UserDefaults(suiteName: AppGroupID)?.string(forKey: "widget_theme") ?? "emerald"
        return WidgetThemeKey(rawValue: raw) ?? .emerald
    }
}

struct WidgetTheme {
    let key: WidgetThemeKey
    let bgTop: Color
    let bgBottom: Color
    let accent: Color
    let accentSoft: Color
    let primaryText: Color
    let mutedText: Color
    let glassFill: Color
    let glassStroke: Color

    static func of(_ key: WidgetThemeKey) -> WidgetTheme {
        switch key {
        case .emerald:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.059, green: 0.239, blue: 0.180),
                bgBottom: Color(red: 0.031, green: 0.137, blue: 0.098),
                accent: Color(red: 0.784, green: 0.663, blue: 0.318),
                accentSoft: Color(red: 0.851, green: 0.749, blue: 0.478),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.15)
            )
        case .sapphire:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.05, green: 0.18, blue: 0.42),
                bgBottom: Color(red: 0.02, green: 0.08, blue: 0.22),
                accent: Color(red: 0.74, green: 0.85, blue: 0.98),
                accentSoft: Color(red: 0.85, green: 0.92, blue: 1.0),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.15)
            )
        case .royal:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.24, green: 0.10, blue: 0.42),
                bgBottom: Color(red: 0.12, green: 0.04, blue: 0.22),
                accent: Color(red: 0.95, green: 0.83, blue: 0.55),
                accentSoft: Color(red: 0.98, green: 0.90, blue: 0.70),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.15)
            )
        case .crimson:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.42, green: 0.08, blue: 0.12),
                bgBottom: Color(red: 0.20, green: 0.03, blue: 0.05),
                accent: Color(red: 0.95, green: 0.85, blue: 0.62),
                accentSoft: Color(red: 1.0, green: 0.90, blue: 0.72),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.18)
            )
        case .gold:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.10, green: 0.08, blue: 0.04),
                bgBottom: Color(red: 0.02, green: 0.02, blue: 0.02),
                accent: Color(red: 0.95, green: 0.80, blue: 0.40),
                accentSoft: Color(red: 1.0, green: 0.88, blue: 0.55),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.06),
                glassStroke: Color(red: 0.95, green: 0.80, blue: 0.40).opacity(0.30)
            )
        case .midnight:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.08, green: 0.08, blue: 0.12),
                bgBottom: Color(red: 0.02, green: 0.02, blue: 0.04),
                accent: Color(red: 0.72, green: 0.78, blue: 0.95),
                accentSoft: Color(red: 0.85, green: 0.90, blue: 1.0),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.06),
                glassStroke: Color.white.opacity(0.12)
            )
        case .silver:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.85, green: 0.88, blue: 0.92),
                bgBottom: Color(red: 0.62, green: 0.68, blue: 0.76),
                accent: Color(red: 0.20, green: 0.30, blue: 0.45),
                accentSoft: Color(red: 0.35, green: 0.45, blue: 0.60),
                primaryText: Color(red: 0.08, green: 0.10, blue: 0.16),
                mutedText: Color(red: 0.30, green: 0.32, blue: 0.40),
                glassFill: Color.white.opacity(0.45),
                glassStroke: Color.white.opacity(0.55)
            )
        case .teal:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.04, green: 0.30, blue: 0.34),
                bgBottom: Color(red: 0.02, green: 0.14, blue: 0.17),
                accent: Color(red: 0.92, green: 0.85, blue: 0.55),
                accentSoft: Color(red: 0.98, green: 0.92, blue: 0.70),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.15)
            )
        case .sandstone:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.90, green: 0.82, blue: 0.68),
                bgBottom: Color(red: 0.72, green: 0.60, blue: 0.42),
                accent: Color(red: 0.32, green: 0.18, blue: 0.08),
                accentSoft: Color(red: 0.48, green: 0.30, blue: 0.16),
                primaryText: Color(red: 0.18, green: 0.10, blue: 0.04),
                mutedText: Color(red: 0.38, green: 0.28, blue: 0.18),
                glassFill: Color.white.opacity(0.35),
                glassStroke: Color.white.opacity(0.55)
            )
        case .beige:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.96, green: 0.91, blue: 0.81),
                bgBottom: Color(red: 0.85, green: 0.76, blue: 0.60),
                accent: Color(red: 0.16, green: 0.40, blue: 0.24),
                accentSoft: Color(red: 0.28, green: 0.55, blue: 0.36),
                primaryText: Color(red: 0.10, green: 0.18, blue: 0.13),
                mutedText: Color(red: 0.32, green: 0.38, blue: 0.30),
                glassFill: Color.white.opacity(0.45),
                glassStroke: Color.white.opacity(0.55)
            )
        case .forest:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.15, green: 0.42, blue: 0.25),
                bgBottom: Color(red: 0.06, green: 0.22, blue: 0.13),
                accent: Color(red: 0.93, green: 0.86, blue: 0.62),
                accentSoft: Color(red: 0.98, green: 0.92, blue: 0.75),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.18)
            )
        }
    }
}

// ─── Prayer Data ──────────────────────────────────────────────────────────────

struct PrayerEntry {
    let name: String
    let date: Date
}

struct PrayerData {
    let prayers: [PrayerEntry]   // today's 5 + sunrise
    let location: String
    let branch: String
    let hijriDay: Int
    let hijriMonthName: String
    let hijriYear: Int
    let hasData: Bool

    static func load() -> PrayerData {
        load(referenceDate: Date())
    }

    static func load(referenceDate: Date) -> PrayerData {
        let d = UserDefaults(suiteName: AppGroupID)

        // Always fall back to Detroit, MI if no config is available — guarantees
        // the widget shows prayer times even before app/plugin push anything.
        var lat = d?.double(forKey: "prayer_lat") ?? 0
        var lon = d?.double(forKey: "prayer_lon") ?? 0
        if lat == 0 && lon == 0 {
            lat = 42.3314
            lon = -83.0458
        }
        let methodStr = d?.string(forKey: "prayer_method") ?? "NorthAmerica"
        let methodCode = d?.integer(forKey: "prayer_method_code") ?? -1
        let madhabStr = d?.string(forKey: "prayer_madhab") ?? "Shafi"
        let location = d?.string(forKey: "prayer_location") ?? ""
        let branch = d?.string(forKey: "prayer_branch") ?? "sunni"

        // ─── Hijri date (always available — needs no config) ─────────────
        var islamic = Calendar(identifier: .islamicUmmAlQura)
        islamic.timeZone = TimeZone.current
        let hComps = islamic.dateComponents([.day, .month, .year], from: referenceDate)
        let monthNames = islamic.monthSymbols
        var hMonthName = ""
        if let m = hComps.month, m >= 1, m <= 12 {
            hMonthName = monthNames[m - 1]
        }

        // (lat/lon are always non-zero now thanks to Detroit fallback above)
        let coords = Coordinates(latitude: lat, longitude: lon)
        var params = methodForKeys(methodStr: methodStr, methodCode: methodCode).params
        params.madhab = madhabFromString(madhabStr)

        // For Jafari (Shia Ithna-Ansari): override Maghrib angle to 4° (default
        // Aladhan Jafari spec) so Maghrib falls ~15-20 min after sunset instead
        // of at sunset like Sunni methods.
        let methodLower = methodStr.lowercased()
        if methodLower == "jafari" || methodCode == 0 {
            params.fajrAngle = 16
            params.ishaAngle = 14
            params.maghribAngle = 4
        }

        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day], from: referenceDate)

        guard let times = PrayerTimes(coordinates: coords, date: comps, calculationParameters: params) else {
            return PrayerData(
                prayers: [], location: location, branch: branch,
                hijriDay: hComps.day ?? 0, hijriMonthName: hMonthName,
                hijriYear: hComps.year ?? 0, hasData: false
            )
        }

        let prayers: [PrayerEntry] = [
            PrayerEntry(name: "Fajr",    date: times.fajr),
            PrayerEntry(name: "Sunrise", date: times.sunrise),
            PrayerEntry(name: "Dhuhr",   date: times.dhuhr),
            PrayerEntry(name: "Asr",     date: times.asr),
            PrayerEntry(name: "Maghrib", date: times.maghrib),
            PrayerEntry(name: "Isha",    date: times.isha),
        ]

        return PrayerData(
            prayers: prayers,
            location: location,
            branch: branch,
            hijriDay: hComps.day ?? 0,
            hijriMonthName: hMonthName,
            hijriYear: hComps.year ?? 0,
            hasData: true
        )
    }

    /// Next prayer to actually pray (skips Sunrise). If all today's are past,
    /// returns tomorrow's Fajr.
    func nextPrayer(after t: Date = Date()) -> PrayerEntry? {
        if let n = prayers.first(where: { $0.date > t }) {
            return n
        }
        // Fall through to tomorrow's Fajr
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: t) ?? t
        let tdata = PrayerData.load(referenceDate: tomorrow)
        return tdata.prayers.first(where: { $0.name == "Fajr" })
    }

    func previousPrayer(before t: Date = Date()) -> PrayerEntry? {
        prayers.filter { $0.date <= t }.last
    }

    var branchLabel: String {
        branch.lowercased() == "shia" ? "Shia" : "Sunni"
    }

    var hijriDateString: String {
        guard hijriDay > 0 else { return "" }
        return "\(hijriDay) \(hijriMonthName) \(hijriYear)"
    }
}

// ─── Method / Madhab Mapping ──────────────────────────────────────────────────
// Supports BOTH:
//   - "prayer_method"      (string name, e.g. "ISNA", "MWL", "NorthAmerica")
//   - "prayer_method_code" (Aladhan numeric code 0-14)
// Falls back to .northAmerica.

private func methodForKeys(methodStr: String, methodCode: Int) -> CalculationMethod {
    // Try string name first
    let s = methodStr.lowercased().replacingOccurrences(of: " ", with: "")
    switch s {
    case "isna", "northamerica":        return .northAmerica
    case "mwl", "muslimworldleague":    return .muslimWorldLeague
    case "egyptian":                    return .egyptian
    case "karachi":                     return .karachi
    case "ummalqura", "makkah":         return .ummAlQura
    case "dubai":                       return .dubai
    case "moonsighting", "moonsightingcommittee": return .moonsightingCommittee
    case "kuwait":                      return .kuwait
    case "qatar":                       return .qatar
    case "singapore":                   return .singapore
    case "tehran", "jafari":            return .tehran  // closest built-in for Shia Jafari angles
    case "turkey", "diyanet":           return .turkey
    default: break
    }

    // Aladhan numeric codes
    switch methodCode {
    case 0:  return .tehran                  // Shia Ithna-Ashari uses Tehran-ish angles
    case 1:  return .karachi
    case 2:  return .northAmerica            // ISNA
    case 3:  return .muslimWorldLeague
    case 4:  return .ummAlQura
    case 5:  return .egyptian
    case 7:  return .tehran
    case 8:  return .dubai                   // Gulf region
    case 9:  return .kuwait
    case 10: return .qatar
    case 11: return .singapore
    case 13: return .turkey
    case 15: return .moonsightingCommittee
    default: return .northAmerica
    }
}

private func madhabFromString(_ s: String) -> Madhab {
    s.lowercased() == "hanafi" ? .hanafi : .shafi
}

// ─── Verse Bank ───────────────────────────────────────────────────────────────

struct Verse {
    let arabic: String
    let english: String
    let reference: String
}

enum VerseBank {
    static let verses: [Verse] = [
        Verse(arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", reference: "Qur'an 94:6"),
        Verse(arabic: "وَاللَّهُ خَيْرُ الرَّازِقِينَ", english: "And Allah is the best of providers.", reference: "Qur'an 62:11"),
        Verse(arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "Remember Me — I will remember you.", reference: "Qur'an 2:152"),
        Verse(arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ", english: "And He is with you wherever you are.", reference: "Qur'an 57:4"),
        Verse(arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", reference: "Qur'an 2:153"),
        Verse(arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "Whoever places their trust in Allah — He is sufficient for them.", reference: "Qur'an 65:3"),
        Verse(arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Verily in the remembrance of Allah do hearts find rest.", reference: "Qur'an 13:28"),
        Verse(arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", english: "Do not despair of the mercy of Allah.", reference: "Qur'an 12:87"),
        Verse(arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", english: "Indeed, prayer has been decreed upon the believers at specified times.", reference: "Qur'an 4:103"),
        Verse(arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي", english: "And establish prayer for My remembrance.", reference: "Qur'an 20:14"),
        Verse(arabic: "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "Seek help through patience and prayer.", reference: "Qur'an 2:45"),
        Verse(arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ", english: "Indeed, prayer prohibits immorality and wrongdoing.", reference: "Qur'an 29:45"),
        Verse(arabic: "وَلَذِكْرُ اللَّهِ أَكْبَرُ", english: "And the remembrance of Allah is greater.", reference: "Qur'an 29:45"),
        Verse(arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ", english: "Maintain with care the prayers.", reference: "Qur'an 2:238"),
        Verse(arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "You alone we worship, and You alone we ask for help.", reference: "Qur'an 1:5"),
        Verse(arabic: "وَاسْجُدْ وَاقْتَرِب", english: "Prostrate and draw near.", reference: "Qur'an 96:19"),
        Verse(arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", english: "Our Lord, give us good in this world.", reference: "Qur'an 2:201"),
        Verse(arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَّقِينَ", english: "Indeed, Allah loves the righteous.", reference: "Qur'an 9:4"),
        Verse(arabic: "وَبَشِّرِ الصَّابِرِينَ", english: "And give good tidings to the patient.", reference: "Qur'an 2:155"),
        Verse(arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", english: "Indeed, my Lord is near and responsive.", reference: "Qur'an 11:61"),
        Verse(arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "Call upon Me; I will respond to you.", reference: "Qur'an 40:60"),
        Verse(arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", english: "Sufficient for us is Allah, and He is the best disposer of affairs.", reference: "Qur'an 3:173"),
        Verse(arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ", english: "We will surely test you with something of fear and hunger.", reference: "Qur'an 2:155"),
        Verse(arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", reference: "Qur'an 2:286"),
        Verse(arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", english: "And say: My Lord, increase me in knowledge.", reference: "Qur'an 20:114"),
        Verse(arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", english: "Indeed, Allah is Forgiving and Merciful.", reference: "Qur'an 2:173"),
        Verse(arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", english: "Those who strive for Us — We will surely guide them to Our ways.", reference: "Qur'an 29:69"),
        Verse(arabic: "فَإِنَّكَ بِأَعْيُنِنَا", english: "For indeed, you are within Our sight.", reference: "Qur'an 52:48"),
        Verse(arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", english: "Indeed, Allah loves those who do good.", reference: "Qur'an 2:195"),
        Verse(arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", english: "And my success is not but through Allah.", reference: "Qur'an 11:88"),
    ]

    static func today() -> Verse {
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
        return verses[(dayOfYear - 1) % verses.count]
    }

    /// Returns today's verse from the subset of verses long enough to fill
    /// 3 lines on the lock screen (>= 50 chars). Different rotation than today().
    static func todayLong() -> Verse {
        let longVerses = verses.filter { $0.english.count >= 50 }
        let pool = longVerses.isEmpty ? verses : longVerses
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
        return pool[(dayOfYear - 1) % pool.count]
    }
}
