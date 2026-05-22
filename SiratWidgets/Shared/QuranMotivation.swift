//
//  QuranMotivation.swift
//  Sirat Al Huda — Shared
//
//  Rotating Quran verses and reminders shown in the Medium and Large widgets.
//  Themes: salah, patience (sabr), remembrance (dhikr), discipline, consistency.
//
//  The reminder for any given day is deterministic — picked by day-of-year so
//  it stays stable across timeline refreshes within the same day, then rotates
//  the next day.
//

import Foundation

public struct QuranReminder: Sendable, Hashable {
    public let arabic: String
    public let english: String
    public let reference: String      // e.g. "Qur'an 2:153"

    public init(arabic: String, english: String, reference: String) {
        self.arabic = arabic
        self.english = english
        self.reference = reference
    }
}

public enum QuranMotivation {

    /// Curated rotation. English renderings are paraphrased meanings, not
    /// claims of canonical translation — keep that in mind if you swap them.
    public static let reminders: [QuranReminder] = [
        .init(
            arabic:    "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
            english:   "Indeed, prayer restrains from immorality and wrongdoing.",
            reference: "Qur'an 29:45"),
        .init(
            arabic:    "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
            english:   "Seek help through patience and prayer.",
            reference: "Qur'an 2:45"),
        .init(
            arabic:    "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            english:   "Verily, in the remembrance of Allah do hearts find rest.",
            reference: "Qur'an 13:28"),
        .init(
            arabic:    "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
            english:   "Indeed, with hardship comes ease.",
            reference: "Qur'an 94:6"),
        .init(
            arabic:    "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
            english:   "Indeed, Allah is with those who are patient.",
            reference: "Qur'an 2:153"),
        .init(
            arabic:    "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
            english:   "Establish prayer for My remembrance.",
            reference: "Qur'an 20:14"),
        .init(
            arabic:    "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
            english:   "Prayer is enjoined on the believers at fixed times.",
            reference: "Qur'an 4:103"),
        .init(
            arabic:    "وَاذْكُر رَّبَّكَ كَثِيرًا",
            english:   "Remember your Lord often.",
            reference: "Qur'an 3:41"),
        .init(
            arabic:    "فَاذْكُرُونِي أَذْكُرْكُمْ",
            english:   "Remember Me, and I will remember you.",
            reference: "Qur'an 2:152"),
        .init(
            arabic:    "وَبَشِّرِ الصَّابِرِينَ",
            english:   "And give glad tidings to those who are patient.",
            reference: "Qur'an 2:155"),
        .init(
            arabic:    "حَافِظُوا عَلَى الصَّلَوَاتِ",
            english:   "Guard strictly your prayers.",
            reference: "Qur'an 2:238"),
        .init(
            arabic:    "إِنَّ اللَّهَ يُحِبُّ الْمُتَّوَكِّلِينَ",
            english:   "Allah loves those who place their trust in Him.",
            reference: "Qur'an 3:159")
    ]

    /// Reminder for a given date — same all day, rotates daily.
    public static func reminder(for date: Date = Date()) -> QuranReminder {
        let day = Calendar.current.ordinality(of: .day, in: .year, for: date) ?? 1
        return reminders[day % reminders.count]
    }
}
