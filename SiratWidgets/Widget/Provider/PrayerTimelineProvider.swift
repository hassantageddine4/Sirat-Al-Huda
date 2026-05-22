//
//  PrayerTimelineProvider.swift
//  Sirat Al Huda — Widget
//
//  Builds the timeline of widget snapshots. Strategy:
//
//  1. Read the latest PrayerWidgetData from the App Group.
//  2. Emit one entry now, then one entry per prayer time today (so the
//     "next prayer" always re-evaluates correctly without a refresh).
//  3. Schedule the timeline to end at the start of the next day, at which
//     point the system will call back here and we'll re-read fresh data.
//

import WidgetKit
import SwiftUI

struct SiratEntry: TimelineEntry {
    let date: Date
    let data: PrayerWidgetData
    let theme: WidgetTheme
}

struct PrayerTimelineProvider: TimelineProvider {

    // MARK: - Placeholder (skeleton shown while loading)

    func placeholder(in context: Context) -> SiratEntry {
        SiratEntry(
            date: Date(),
            data: .placeholder,
            theme: .emerald
        )
    }

    // MARK: - Snapshot (gallery preview)

    func getSnapshot(in context: Context, completion: @escaping (SiratEntry) -> Void) {
        let entry = SiratEntry(
            date: Date(),
            data: SiratSharedStorage.loadPrayerData() ?? .placeholder,
            theme: SiratSharedStorage.loadTheme()
        )
        completion(entry)
    }

    // MARK: - Timeline

    func getTimeline(in context: Context, completion: @escaping (Timeline<SiratEntry>) -> Void) {

        let data = SiratSharedStorage.loadPrayerData() ?? .placeholder
        let theme = SiratSharedStorage.loadTheme()
        let now = Date()

        // Build entries: now + each future prayer time today.
        var entries: [SiratEntry] = [SiratEntry(date: now, data: data, theme: theme)]

        for prayer in data.prayers where prayer.time > now {
            entries.append(SiratEntry(date: prayer.time, data: data, theme: theme))
        }

        // Reload tomorrow at the earliest, so the host app's daily refresh
        // gets a chance to write fresh data first.
        let nextDay = Calendar.current.date(byAdding: .day, value: 1,
                                            to: Calendar.current.startOfDay(for: now))
                      ?? now.addingTimeInterval(60 * 60 * 6)

        completion(Timeline(entries: entries, policy: .after(nextDay)))
    }
}
