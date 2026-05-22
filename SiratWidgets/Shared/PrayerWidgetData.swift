//
//  PrayerWidgetData.swift
//  Sirat Al Huda — Shared
//
//  Codable snapshot of prayer state that the main app writes for widgets.
//  Keep this struct stable — widget extensions decode it from App Group storage.
//

import Foundation

public enum MadhabType: String, Codable, CaseIterable, Sendable {
    case sunni
    case shia

    public var displayName: String {
        switch self {
        case .sunni: return "SUNNI"
        case .shia:  return "SHIA"
        }
    }
}

public enum PrayerName: String, Codable, CaseIterable, Sendable {
    case fajr, dhuhr, asr, maghrib, isha

    public var displayName: String {
        switch self {
        case .fajr:    return "Fajr"
        case .dhuhr:   return "Dhuhr"
        case .asr:     return "Asr"
        case .maghrib: return "Maghrib"
        case .isha:    return "Isha"
        }
    }

    /// SF Symbol used in widget rows. Picked to read well at lock-screen sizes.
    public var symbol: String {
        switch self {
        case .fajr:    return "sunrise.fill"
        case .dhuhr:   return "sun.max.fill"
        case .asr:     return "cloud.sun.fill"
        case .maghrib: return "sunset.fill"
        case .isha:    return "moon.stars.fill"
        }
    }
}

public struct PrayerEntry: Codable, Hashable, Sendable {
    public let name: PrayerName
    public let time: Date

    public init(name: PrayerName, time: Date) {
        self.name = name
        self.time = time
    }
}

public struct PrayerWidgetData: Codable, Sendable {

    public let prayers: [PrayerEntry]
    public let madhab: MadhabType
    public let hijriDate: String          // e.g. "20 Dhul Qa'dah 1445"
    public let gregorianDate: String      // e.g. "Saturday, May 24, 2025"
    public let generatedAt: Date

    public init(
        prayers: [PrayerEntry],
        madhab: MadhabType,
        hijriDate: String,
        gregorianDate: String,
        generatedAt: Date = Date()
    ) {
        self.prayers = prayers
        self.madhab = madhab
        self.hijriDate = hijriDate
        self.gregorianDate = gregorianDate
        self.generatedAt = generatedAt
    }

    // MARK: - Derived

    /// First prayer whose time is still in the future relative to `now`.
    /// If all of today's prayers have passed, returns the last one (Isha)
    /// so the widget still shows something meaningful late at night.
    public func nextPrayer(relativeTo now: Date = Date()) -> PrayerEntry {
        prayers.first(where: { $0.time > now }) ?? prayers.last ?? Self.placeholder.prayers[0]
    }

    /// The prayer "in progress" — the most recent one whose time has passed.
    public func currentPrayer(relativeTo now: Date = Date()) -> PrayerEntry? {
        prayers.last(where: { $0.time <= now })
    }

    /// Progress (0…1) from the previous prayer to the next. Used by the ring.
    public func progressToNext(relativeTo now: Date = Date()) -> Double {
        let next = nextPrayer(relativeTo: now)
        let previous = currentPrayer(relativeTo: now)?.time
            ?? Calendar.current.startOfDay(for: now)
        let total = next.time.timeIntervalSince(previous)
        guard total > 0 else { return 1 }
        let elapsed = now.timeIntervalSince(previous)
        return min(max(elapsed / total, 0), 1)
    }

    // MARK: - Placeholder (previews + first launch)

    public static let placeholder: PrayerWidgetData = {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        func t(_ h: Int, _ m: Int) -> Date {
            cal.date(bySettingHour: h, minute: m, second: 0, of: today) ?? today
        }
        return PrayerWidgetData(
            prayers: [
                .init(name: .fajr,    time: t(4, 38)),
                .init(name: .dhuhr,   time: t(12, 15)),
                .init(name: .asr,     time: t(16, 52)),
                .init(name: .maghrib, time: t(19, 2)),
                .init(name: .isha,    time: t(20, 31))
            ],
            madhab: .sunni,
            hijriDate: "20 Dhul Qa'dah 1445",
            gregorianDate: "Saturday, May 24, 2025"
        )
    }()
}
