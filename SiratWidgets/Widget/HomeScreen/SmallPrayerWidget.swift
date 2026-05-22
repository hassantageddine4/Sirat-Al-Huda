//
//  SmallPrayerWidget.swift
//  Sirat Al Huda — Widget
//
//  Small home-screen widget. Shows next prayer name, time, countdown,
//  madhab badge, and Hijri date — all in roughly 155×155 pt.
//

import SwiftUI
import WidgetKit

struct SmallPrayerWidgetView: View {
    @Environment(\.colorScheme) private var scheme
    let entry: SiratEntry

    var body: some View {
        let palette = entry.theme.resolved(for: scheme)
        let next = entry.data.nextPrayer(relativeTo: entry.date)

        ZStack {
            GlassBackground()

            VStack(alignment: .leading, spacing: 6) {
                // Header row
                HStack {
                    Text("NEXT PRAYER")
                        .font(SiratFont.label(8, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(palette.secondaryText)
                    Spacer(minLength: 0)
                    Image(systemName: "moon.fill")
                        .font(.system(size: 9, weight: .regular))
                        .foregroundStyle(palette.accent)
                }

                // Prayer name
                Text(next.name.displayName)
                    .font(SiratFont.display(28, weight: .semibold))
                    .foregroundStyle(palette.primaryText)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)

                // Countdown
                Text(timerInterval: entry.date...max(next.time, entry.date.addingTimeInterval(1)),
                     countsDown: true)
                    .font(SiratFont.numeric(15, weight: .semibold))
                    .foregroundStyle(palette.primaryText)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)

                // Time
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.system(size: 9))
                    Text(next.time, style: .time)
                        .font(SiratFont.numeric(11, weight: .medium))
                }
                .foregroundStyle(palette.secondaryText)

                Spacer(minLength: 0)

                // Footer row — madhab + Hijri
                HStack(spacing: 6) {
                    Image(systemName: "shield.lefthalf.filled")
                        .font(.system(size: 8))
                        .foregroundStyle(palette.accent)
                    Text(entry.data.madhab.displayName)
                        .font(SiratFont.label(8, weight: .semibold))
                        .tracking(1)
                        .foregroundStyle(palette.primaryText)
                    Spacer(minLength: 0)
                }

                Text(entry.data.hijriDate)
                    .font(SiratFont.label(8, weight: .regular))
                    .foregroundStyle(palette.secondaryText)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }
            .padding(12)
        }
        .environment(\.themePalette, palette)
    }
}

struct SmallPrayerWidget: Widget {
    let kind = "SmallPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            SmallPrayerWidgetView(entry: entry)
                .containerBackground(for: .widget) { Color.clear }
        }
        .configurationDisplayName("Next Prayer")
        .description("The next prayer at a glance.")
        .supportedFamilies([.systemSmall])
    }
}

// MARK: - Preview

#Preview(as: .systemSmall) {
    SmallPrayerWidget()
} timeline: {
    SiratEntry(date: Date(), data: .placeholder, theme: .emerald)
    SiratEntry(date: Date(), data: .placeholder, theme: .sapphire)
}
