//
//  Sirat_Al_huda_widget.swift
//  Sirat Al huda widget
//
//  Home Screen widget showing the next upcoming prayer.
//  Reads prayer times from the shared App Group written by SiratWidgetPlugin.
//

import WidgetKit
import SwiftUI

private let appGroupID = "group.com.tageddine.siratalhuda"

// ─── Data ────────────────────────────────────────────────────────────────────

struct PrayerTime {
    let name: String
    let date: Date
}

struct NextPrayerEntry: TimelineEntry {
    let date: Date              // when this entry becomes active
    let prayerName: String      // "Fajr" / "Dhuhr" / etc, or "—"
    let prayerTime: Date        // when the next prayer is
    let location: String
    let hasData: Bool
}

// ─── Provider ────────────────────────────────────────────────────────────────

struct NextPrayerProvider: TimelineProvider {

    private func readPrayers() -> [PrayerTime] {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return [] }
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let isoNoFrac = ISO8601DateFormatter()
        isoNoFrac.formatOptions = [.withInternetDateTime]

        let names = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
        let display: [String: String] = [
            "fajr": "Fajr", "sunrise": "Sunrise", "dhuhr": "Dhuhr",
            "asr": "Asr", "maghrib": "Maghrib", "isha": "Isha"
        ]
        return names.compactMap { n -> PrayerTime? in
            guard let s = defaults.string(forKey: "prayer_\(n)") else { return nil }
            let d = iso.date(from: s) ?? isoNoFrac.date(from: s)
            guard let date = d else { return nil }
            return PrayerTime(name: display[n] ?? n.capitalized, date: date)
        }
    }

    private func readLocation() -> String {
        UserDefaults(suiteName: appGroupID)?.string(forKey: "prayer_location") ?? ""
    }

    private func nextPrayer(from times: [PrayerTime], after: Date) -> PrayerTime? {
        // Skip "Sunrise" since it's not a prayer; include it only as a divider.
        let prayable = times.filter { $0.name != "Sunrise" }
        return prayable.first(where: { $0.date > after })
    }

    func placeholder(in context: Context) -> NextPrayerEntry {
        NextPrayerEntry(
            date: Date(),
            prayerName: "Fajr",
            prayerTime: Date().addingTimeInterval(3600),
            location: "",
            hasData: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (NextPrayerEntry) -> Void) {
        let now = Date()
        let times = readPrayers()
        let location = readLocation()
        if let next = nextPrayer(from: times, after: now) {
            completion(NextPrayerEntry(date: now, prayerName: next.name, prayerTime: next.date, location: location, hasData: true))
        } else {
            completion(NextPrayerEntry(date: now, prayerName: "—", prayerTime: now, location: location, hasData: !times.isEmpty))
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NextPrayerEntry>) -> Void) {
        let now = Date()
        let times = readPrayers()
        let location = readLocation()

        var entries: [NextPrayerEntry] = []

        // First entry: right now
        if let next = nextPrayer(from: times, after: now) {
            entries.append(NextPrayerEntry(date: now, prayerName: next.name, prayerTime: next.date, location: location, hasData: true))
        } else {
            entries.append(NextPrayerEntry(date: now, prayerName: "—", prayerTime: now, location: location, hasData: !times.isEmpty))
        }

        // Add an entry at each prayer boundary so the widget recalculates "next"
        for prayer in times where prayer.date > now {
            // Schedule an entry 1 second after this prayer's time
            let boundary = prayer.date.addingTimeInterval(1)
            if let next = nextPrayer(from: times, after: boundary) {
                entries.append(NextPrayerEntry(date: boundary, prayerName: next.name, prayerTime: next.date, location: location, hasData: true))
            } else {
                // No more prayers today; will be refreshed when the app updates tomorrow's data
                entries.append(NextPrayerEntry(date: boundary, prayerName: "—", prayerTime: boundary, location: location, hasData: true))
            }
        }

        // Tell iOS to refresh after the last entry or in 6 hours, whichever is sooner
        let refresh = times.last?.date.addingTimeInterval(60) ?? now.addingTimeInterval(6 * 3600)
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
}

// ─── View ────────────────────────────────────────────────────────────────────

struct NextPrayerWidgetView: View {
    var entry: NextPrayerEntry

    private let primary  = Color(red: 0.059, green: 0.239, blue: 0.180) // #0F3D2E
    private let emerald  = Color(red: 0.031, green: 0.137, blue: 0.098) // #082319
    private let gold     = Color(red: 0.784, green: 0.663, blue: 0.318) // #C8A951
    private let goldLite = Color(red: 0.851, green: 0.749, blue: 0.478) // #D9BF7A

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Text("NEXT PRAYER")
                    .font(.system(size: 9, weight: .bold))
                    .tracking(1.6)
                    .foregroundColor(goldLite)
                Spacer()
            }

            if entry.hasData {
                Text(entry.prayerName)
                    .font(.system(size: 26, weight: .semibold, design: .serif))
                    .foregroundColor(.white)
                    .minimumScaleFactor(0.7)
                    .lineLimit(1)

                Text(entry.prayerTime, style: .time)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white.opacity(0.9))

                Spacer(minLength: 4)

                Text(entry.prayerTime, style: .relative)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.white.opacity(0.55))
                    .lineLimit(1)
            } else {
                Spacer()
                Text("Open Sirat\nto load times")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.leading)
                Spacer()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .containerBackground(for: .widget) {
            LinearGradient(
                gradient: Gradient(colors: [primary, emerald]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}

// ─── Widget ──────────────────────────────────────────────────────────────────

struct Sirat_Al_huda_widget: Widget {
    let kind: String = "Sirat_Al_huda_widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NextPrayerProvider()) { entry in
            NextPrayerWidgetView(entry: entry)
        }
        .configurationDisplayName("Next Prayer")
        .description("Shows your next upcoming prayer time.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// ─── Preview ─────────────────────────────────────────────────────────────────

#Preview(as: .systemSmall) {
    Sirat_Al_huda_widget()
} timeline: {
    NextPrayerEntry(date: .now, prayerName: "Asr", prayerTime: .now.addingTimeInterval(3120), location: "Detroit", hasData: true)
    NextPrayerEntry(date: .now, prayerName: "—", prayerTime: .now, location: "", hasData: false)
}
