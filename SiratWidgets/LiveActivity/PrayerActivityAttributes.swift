//
//  PrayerActivityAttributes.swift
//  Sirat Al Huda — LiveActivity
//
//  ActivityKit attributes used by both the host app (to start/update the
//  Live Activity) and the widget extension (to render it).
//

import Foundation
import ActivityKit

public struct PrayerActivityAttributes: ActivityAttributes {

    public typealias ContentState = State

    /// Mutable state — pushed through `activity.update(...)` periodically.
    public struct State: Codable, Hashable, Sendable {
        public let nextPrayerName: String   // "Asr"
        public let nextPrayerSymbol: String // SF Symbol name
        public let nextPrayerTime: Date     // when it starts
        public let previousPrayerTime: Date // for progress calculation
        public let themeRawValue: String    // WidgetTheme.rawValue
        public let madhab: String           // "SUNNI" / "SHIA"

        public init(
            nextPrayerName: String,
            nextPrayerSymbol: String,
            nextPrayerTime: Date,
            previousPrayerTime: Date,
            themeRawValue: String,
            madhab: String
        ) {
            self.nextPrayerName = nextPrayerName
            self.nextPrayerSymbol = nextPrayerSymbol
            self.nextPrayerTime = nextPrayerTime
            self.previousPrayerTime = previousPrayerTime
            self.themeRawValue = themeRawValue
            self.madhab = madhab
        }

        public var theme: WidgetTheme {
            WidgetTheme(rawValue: themeRawValue) ?? .emerald
        }

        public var progress: Double {
            let now = Date()
            let total = nextPrayerTime.timeIntervalSince(previousPrayerTime)
            guard total > 0 else { return 1 }
            let elapsed = now.timeIntervalSince(previousPrayerTime)
            return min(max(elapsed / total, 0), 1)
        }
    }

    /// Static attributes — set once when the activity starts.
    public let hijriDate: String

    public init(hijriDate: String) {
        self.hijriDate = hijriDate
    }
}
