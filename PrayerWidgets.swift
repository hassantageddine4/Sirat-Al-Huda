//
//  PrayerWidgets.swift
//  Sirat Al huda widget
//
//  Home screen widgets:
//    • NextPrayerWidget (small + medium)  — countdown to next prayer
//    • DailyPrayersWidget (medium)        — all 5 prayers + ring
//    • DailyOverviewWidget (large)        — full day + Quran verse
//

import SwiftUI
import WidgetKit

// ─── Shared timeline entry ────────────────────────────────────────────────────

struct PrayerWidgetEntry: TimelineEntry {
    let date: Date
    let data: PrayerData
    let theme: WidgetTheme
}

struct PrayerWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerWidgetEntry {
        PrayerWidgetEntry(date: Date(), data: PrayerData.load(), theme: WidgetTheme.of(.emerald))
    }

    func getSnapshot(in context: Context, completion: @escaping (PrayerWidgetEntry) -> Void) {
        let data = PrayerData.load()
        let theme = WidgetTheme.of(WidgetThemeKey.current)
        completion(PrayerWidgetEntry(date: Date(), data: data, theme: theme))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerWidgetEntry>) -> Void) {
        let now = Date()
        let data = PrayerData.load()
        let theme = WidgetTheme.of(WidgetThemeKey.current)

        var entries: [PrayerWidgetEntry] = [
            PrayerWidgetEntry(date: now, data: data, theme: theme)
        ]

        // Add an entry at each upcoming prayer boundary so countdown text re-renders
        for prayer in data.prayers where prayer.date > now {
            let boundary = prayer.date.addingTimeInterval(1)
            entries.append(PrayerWidgetEntry(date: boundary, data: data, theme: theme))
        }

        // Refresh policy: 6 hours from now, or shortly after the last entry
        let refresh = data.prayers.last?.date.addingTimeInterval(60) ?? now.addingTimeInterval(6 * 3600)
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
}

// ─── Small / Medium: Next Prayer ──────────────────────────────────────────────

struct NextPrayerWidgetView: View {
    var entry: PrayerWidgetEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let t = entry.theme
        let next = entry.data.nextPrayer(after: entry.date)
        let prev = entry.data.previousPrayer(before: entry.date)

        // Progress between prev and next prayer (for ring)
        let progress: Double = {
            guard let next = next else { return 0 }
            let start = prev?.date ?? Calendar.current.startOfDay(for: entry.date)
            let total = next.date.timeIntervalSince(start)
            let done = entry.date.timeIntervalSince(start)
            return total > 0 ? max(0, min(1, done / total)) : 0
        }()

        Group {
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else if family == .systemSmall {
                smallLayout(t: t, next: next, progress: progress)
            } else {
                mediumLayout(t: t, next: next, progress: progress)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }

    @ViewBuilder
    private func smallLayout(t: WidgetTheme, next: PrayerEntry?, progress: Double) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                SectionLabel(text: "Next Prayer", theme: t)
                Spacer()
                BranchPill(text: entry.data.branchLabel, theme: t)
            }

            if let next = next {
                Text(next.name)
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                    .foregroundColor(t.primaryText)
                    .minimumScaleFactor(0.7)
                    .lineLimit(1)

                Text(next.date, style: .time)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(t.primaryText.opacity(0.85))

                Spacer(minLength: 2)

                HStack(spacing: 6) {
                    ProgressRing(progress: progress, theme: t, lineWidth: 3, size: 14)
                    Text(next.date, style: .relative)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(t.mutedText)
                        .lineLimit(1)
                }
            } else {
                Text("—")
                    .font(.system(size: 22, weight: .semibold, design: .serif))
                    .foregroundColor(t.primaryText)
                Spacer()
            }

            if !entry.data.hijriDateString.isEmpty {
                Text(entry.data.hijriDateString)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(t.accent)
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    @ViewBuilder
    private func mediumLayout(t: WidgetTheme, next: PrayerEntry?, progress: Double) -> some View {
        HStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    SectionLabel(text: "Next Prayer", theme: t)
                    Spacer()
                    BranchPill(text: entry.data.branchLabel, theme: t)
                }

                if let next = next {
                    Text(next.name)
                        .font(.system(size: 28, weight: .semibold, design: .serif))
                        .foregroundColor(t.primaryText)

                    Text(next.date, style: .time)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(t.primaryText.opacity(0.85))

                    Text(next.date, style: .relative)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(t.mutedText)
                }

                Spacer()

                if !entry.data.hijriDateString.isEmpty {
                    Text(entry.data.hijriDateString)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(t.accent)
                }
            }

            Spacer()

            ZStack {
                ProgressRing(progress: progress, theme: t, lineWidth: 5, size: 80)
                if let next = next {
                    VStack(spacing: 0) {
                        Text(next.date, style: .timer)
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(t.accent)
                            .multilineTextAlignment(.center)
                    }
                }
            }
            .frame(width: 80, height: 80)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

struct NextPrayerWidget: Widget {
    let kind = "NextPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
            NextPrayerWidgetView(entry: entry)
        }
        .configurationDisplayName("Next Prayer")
        .description("Your next upcoming prayer with a live countdown.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// ─── Medium: All Prayers ──────────────────────────────────────────────────────

struct DailyPrayersWidgetView: View {
    var entry: PrayerWidgetEntry

    var body: some View {
        let t = entry.theme
        let next = entry.data.nextPrayer(after: entry.date)

        Group {
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else {
                HStack(alignment: .top, spacing: 14) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            SectionLabel(text: "Today's Prayers", theme: t)
                            Spacer()
                            BranchPill(text: entry.data.branchLabel, theme: t)
                        }
                        if !entry.data.hijriDateString.isEmpty {
                            Text(entry.data.hijriDateString)
                                .font(.system(size: 9, weight: .medium))
                                .foregroundColor(t.accent)
                                .padding(.bottom, 2)
                        }
                        VStack(spacing: 4) {
                            ForEach(Array(entry.data.prayers.enumerated()), id: \.offset) { _, p in
                                PrayerRow(
                                    entry: p,
                                    isNext: next?.name == p.name,
                                    isPassed: p.date < entry.date,
                                    theme: t
                                )
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyPrayersWidget: Widget {
    let kind = "DailyPrayersWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
            DailyPrayersWidgetView(entry: entry)
        }
        .configurationDisplayName("Today's Prayers")
        .description("All five daily prayers with the next one highlighted.")
        .supportedFamilies([.systemMedium])
    }
}

// ─── Large: Daily Overview + Verse ────────────────────────────────────────────

struct DailyOverviewWidgetView: View {
    var entry: PrayerWidgetEntry

    var body: some View {
        let t = entry.theme
        let next = entry.data.nextPrayer(after: entry.date)
        let verse = VerseBank.today()

        Group {
            if !entry.data.hasData {
                EmptyWidget(theme: t)
            } else {
                VStack(alignment: .leading, spacing: 10) {
                    // Header
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 2) {
                            SectionLabel(text: "Sirat Al Huda", theme: t)
                            if let n = next {
                                Text("Next: \(n.name)")
                                    .font(.system(size: 16, weight: .semibold, design: .serif))
                                    .foregroundColor(t.primaryText)
                                Text(n.date, style: .time)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(t.accent)
                            }
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 4) {
                            BranchPill(text: entry.data.branchLabel, theme: t)
                            if !entry.data.hijriDateString.isEmpty {
                                Text(entry.data.hijriDateString)
                                    .font(.system(size: 9, weight: .medium))
                                    .foregroundColor(t.mutedText)
                            }
                        }
                    }

                    Divider().background(t.accent.opacity(0.18))

                    // Prayers list
                    VStack(spacing: 5) {
                        ForEach(Array(entry.data.prayers.enumerated()), id: \.offset) { _, p in
                            PrayerRow(
                                entry: p,
                                isNext: next?.name == p.name,
                                isPassed: p.date < entry.date,
                                theme: t
                            )
                        }
                    }

                    Divider().background(t.accent.opacity(0.18))

                    // Verse
                    VerseView(verse: verse, theme: t)

                    Spacer(minLength: 0)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyOverviewWidget: Widget {
    let kind = "DailyOverviewWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
            DailyOverviewWidgetView(entry: entry)
        }
        .configurationDisplayName("Daily Overview")
        .description("Full day of prayers with a daily Quran reflection.")
        .supportedFamilies([.systemLarge])
    }
}

// ─── Previews ────────────────────────────────────────────────────────────────

#Preview(as: .systemSmall) {
    NextPrayerWidget()
} timeline: {
    let mock = PrayerData(
        prayers: [
            PrayerEntry(name: "Fajr", date: Date().addingTimeInterval(-3600)),
            PrayerEntry(name: "Dhuhr", date: Date().addingTimeInterval(3000)),
            PrayerEntry(name: "Asr", date: Date().addingTimeInterval(8000)),
        ],
        location: "Detroit", branch: "sunni",
        hijriDay: 28, hijriMonthName: "Dhū al-Qa'dah", hijriYear: 1447,
        hasData: true
    )
    PrayerWidgetEntry(date: .now, data: mock, theme: WidgetTheme.of(.emerald))
}
