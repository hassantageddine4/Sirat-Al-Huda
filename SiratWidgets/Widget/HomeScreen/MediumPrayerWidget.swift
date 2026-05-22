//
//  MediumPrayerWidget.swift
//  Sirat Al Huda — Widget
//
//  Medium home-screen widget. Layout mirrors the reference:
//  • Top-left: NEXT PRAYER label + name + time chip + madhab badge
//  • Top-center: countdown ring
//  • Top-right: Hijri + Gregorian date
//  • Bottom strip: 5 prayer cells, current/next highlighted in glow
//

import SwiftUI
import WidgetKit

struct MediumPrayerWidgetView: View {
    @Environment(\.colorScheme) private var scheme
    let entry: SiratEntry

    var body: some View {
        let palette = entry.theme.resolved(for: scheme)
        let next = entry.data.nextPrayer(relativeTo: entry.date)
        let progress = entry.data.progressToNext(relativeTo: entry.date)

        ZStack {
            GlassBackground()

            VStack(spacing: 8) {

                // ── Top section ───────────────────────────────────────────
                HStack(alignment: .top, spacing: 12) {

                    // Left: prayer info
                    VStack(alignment: .leading, spacing: 4) {
                        Label {
                            Text("NEXT PRAYER")
                        } icon: {
                            Text("•")
                        }
                        .font(SiratFont.label(8, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(palette.secondaryText)

                        Text(next.name.displayName)
                            .font(SiratFont.display(24, weight: .semibold))
                            .foregroundStyle(palette.primaryText)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)

                        timeChip(for: next.time, palette: palette)

                        HStack(spacing: 4) {
                            Image(systemName: "shield.lefthalf.filled")
                                .font(.system(size: 8))
                                .foregroundStyle(palette.accent)
                            Text(entry.data.madhab.displayName)
                                .font(SiratFont.label(8, weight: .semibold))
                                .tracking(1.5)
                                .foregroundStyle(palette.primaryText)
                        }
                    }

                    Spacer(minLength: 0)

                    // Center: countdown ring
                    CountdownRing(progress: progress,
                                  targetDate: next.time,
                                  size: 70)

                    Spacer(minLength: 0)

                    // Right: dates
                    VStack(alignment: .trailing, spacing: 2) {
                        Image(systemName: "moon.fill")
                            .font(.system(size: 9))
                            .foregroundStyle(palette.accent)
                            .padding(.bottom, 2)
                        Text(entry.data.hijriDate)
                            .font(SiratFont.label(9, weight: .semibold))
                            .foregroundStyle(palette.primaryText)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Text(entry.data.gregorianDate)
                            .font(SiratFont.label(8, weight: .regular))
                            .foregroundStyle(palette.secondaryText)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    }
                    .frame(maxWidth: 95, alignment: .trailing)
                }

                // ── Bottom strip: 5 prayers ───────────────────────────────
                HStack(spacing: 4) {
                    ForEach(entry.data.prayers, id: \.name) { p in
                        PrayerTimeCell(
                            entry: p,
                            isHighlighted: p.name == next.name,
                            compact: true
                        )
                    }
                }
                .frame(maxHeight: .infinity)
            }
            .padding(12)
        }
        .environment(\.themePalette, palette)
    }

    @ViewBuilder
    private func timeChip(for time: Date, palette: ThemePalette) -> some View {
        HStack(spacing: 4) {
            Image(systemName: "clock")
                .font(.system(size: 9))
            Text(time, style: .time)
                .font(SiratFont.numeric(11, weight: .semibold))
        }
        .foregroundStyle(palette.primaryText)
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .background(
            Capsule().fill(palette.cardFill)
                .overlay(Capsule().strokeBorder(palette.cardStroke,
                                                lineWidth: SiratLayout.strokeWidth))
        )
    }
}

struct MediumPrayerWidget: Widget {
    let kind = "MediumPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            MediumPrayerWidgetView(entry: entry)
                .containerBackground(for: .widget) { Color.clear }
        }
        .configurationDisplayName("Daily Prayers")
        .description("All five prayers with countdown to the next.")
        .supportedFamilies([.systemMedium])
    }
}

#Preview(as: .systemMedium) {
    MediumPrayerWidget()
} timeline: {
    SiratEntry(date: Date(), data: .placeholder, theme: .emerald)
    SiratEntry(date: Date(), data: .placeholder, theme: .royal)
}
