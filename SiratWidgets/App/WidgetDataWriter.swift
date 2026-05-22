//
//  WidgetDataWriter.swift
//  Sirat Al Huda — App side
//
//  Drop-in helper that converts your existing prayer-time model into the
//  shared `PrayerWidgetData` format and persists it for widgets to read.
//
//  Call `WidgetDataWriter.write(...)` whenever your app:
//   • finishes computing today's prayer times (e.g. after a location update,
//     a calculation method change, or the daily refresh),
//   • the user toggles madhab,
//   • the user picks a new theme.
//

import Foundation
import WidgetKit

public enum WidgetDataWriter {

    /// Build a `PrayerWidgetData` from raw prayer times and persist it to
    /// the App Group, then ask the system to refresh all widgets.
    ///
    /// Pass any subset of arguments your existing model already has; this
    /// function does the formatting work.
    public static func write(
        fajr: Date,
        dhuhr: Date,
        asr: Date,
        maghrib: Date,
        isha: Date,
        madhab: MadhabType,
        date: Date = Date()
    ) {
        let prayers: [PrayerEntry] = [
            .init(name: .fajr,    time: fajr),
            .init(name: .dhuhr,   time: dhuhr),
            .init(name: .asr,     time: asr),
            .init(name: .maghrib, time: maghrib),
            .init(name: .isha,    time: isha)
        ]

        let data = PrayerWidgetData(
            prayers: prayers,
            madhab: madhab,
            hijriDate: hijriString(for: date),
            gregorianDate: gregorianString(for: date)
        )

        SiratSharedStorage.savePrayerData(data)
        SiratSharedStorage.saveMadhab(madhab)
    }

    // MARK: - Date formatting

    /// Hijri date formatted like "20 Dhul Qa'dah 1445".
    /// If your app already has a custom Hijri formatter, replace this.
    public static func hijriString(for date: Date) -> String {
        var cal = Calendar(identifier: .islamicUmmAlQura)
        cal.locale = Locale(identifier: "en_US")
        let formatter = DateFormatter()
        formatter.calendar = cal
        formatter.locale = Locale(identifier: "en_US")
        formatter.dateFormat = "d MMMM y"
        return formatter.string(from: date)
    }

    /// Gregorian date like "Saturday, May 24, 2025".
    public static func gregorianString(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .full
        formatter.timeStyle = .none
        return formatter.string(from: date)
    }
}
