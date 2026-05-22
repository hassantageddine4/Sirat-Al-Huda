//
//  SharedDataModel.swift
//  Sirat Al Huda — Shared
//
//  App Group bridge between the main app and widget extensions.
//  The app writes prayer data here; widgets and Live Activities read from it.
//
//  IMPORTANT: Replace `appGroupID` with your real App Group identifier
//  (configured in both targets under Signing & Capabilities → App Groups).
//

import Foundation
import WidgetKit

public enum SiratSharedStorage {

    // MARK: - Configuration

    /// The App Group identifier shared between the host app and widget targets.
    /// Add the same group to BOTH targets in Xcode.
    public static let appGroupID = "group.com.sirat.alhuda"

    /// Keys used for shared UserDefaults values.
    public enum Key {
        public static let prayerData      = "sirat.prayerData"
        public static let selectedTheme   = "sirat.selectedTheme"
        public static let madhabType      = "sirat.madhabType"
        public static let lastWriteDate   = "sirat.lastWriteDate"
    }

    /// Shared defaults handle. Falls back to .standard in the unlikely case the
    /// App Group isn't reachable, so previews and tests don't crash.
    public static var defaults: UserDefaults {
        UserDefaults(suiteName: appGroupID) ?? .standard
    }

    // MARK: - Read / Write Prayer Data

    public static func savePrayerData(_ data: PrayerWidgetData) {
        guard let encoded = try? JSONEncoder().encode(data) else { return }
        defaults.set(encoded, forKey: Key.prayerData)
        defaults.set(Date(), forKey: Key.lastWriteDate)
        // Tell every widget to refresh its timeline.
        WidgetCenter.shared.reloadAllTimelines()
    }

    public static func loadPrayerData() -> PrayerWidgetData? {
        guard let data = defaults.data(forKey: Key.prayerData) else { return nil }
        return try? JSONDecoder().decode(PrayerWidgetData.self, from: data)
    }

    // MARK: - Theme

    public static func saveTheme(_ theme: WidgetTheme) {
        defaults.set(theme.rawValue, forKey: Key.selectedTheme)
        WidgetCenter.shared.reloadAllTimelines()
    }

    public static func loadTheme() -> WidgetTheme {
        let raw = defaults.string(forKey: Key.selectedTheme) ?? WidgetTheme.emerald.rawValue
        return WidgetTheme(rawValue: raw) ?? .emerald
    }

    // MARK: - Madhab

    public static func saveMadhab(_ madhab: MadhabType) {
        defaults.set(madhab.rawValue, forKey: Key.madhabType)
        WidgetCenter.shared.reloadAllTimelines()
    }

    public static func loadMadhab() -> MadhabType {
        let raw = defaults.string(forKey: Key.madhabType) ?? MadhabType.sunni.rawValue
        return MadhabType(rawValue: raw) ?? .sunni
    }
}
