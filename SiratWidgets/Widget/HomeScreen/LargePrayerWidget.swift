//
//  LargePrayerWidget.swift
//  Sirat Al Huda — Widget
//
//  Large home-screen widget: full daily prayer overview + a rotating
//  Quran reminder beneath. Hierarchy is editorial — display serif for
//  the prayer name, refined Arabic typography, smaller English meaning.
//

import SwiftUI
import WidgetKit

struct LargePrayerWidgetView: View {
    @Environment(\.colorScheme) private var scheme
    let entry: SiratEntry

    var body: some View {
        let palette = entry.theme.resolved(for: scheme)
        let next = entry.data.nextPrayer(relativeTo: entry.date)
        let progress = entry.data.progressToNext(relativeTo: entry.date)
        let reminder = QuranMotivation.reminder(for: entry.date)

        ZStack {
            GlassBackground()

            VStack(spacing: 12) {

                // ── Header: dates + madhab ────────────────────────────────
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("BISMILLAH")
                            .font(SiratFont.label(8, weight: .semibold))
                            .tracking(2.5)
                            .foregroundStyle(palette.accent)
                        HStack(spacing: 4) {
                            Image(systemName: "shield.lefthalf.filled")
                                .font(.system(size: 9))
                                .foregroundStyle(palette.accent)
                            Text(entry.data.madhab.displayName)
                                .font(SiratFont.label(9, weight: .semibold))
                                .tracking(1.5)
                                .foregroundStyle(palette.primaryText)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(entry.data.hijriDate)
                            .font(SiratFont.label(10, weight: .semibold))
                            .foregroundStyle(palette.primaryText)
                        Text(entry.data.gregorianDate)
                            .font(SiratFont.label(9, weight: .regular))
                            .foregroundStyle(palette.secondaryText)
                    }
                }

                // ── Hero: next prayer + countdown ring ────────────────────
                HStack(alignment: .center, spacing: 14) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("NEXT PRAYER")
                            .font(SiratFont.label(9, weight: .semibold))
                            .tracking(2)
                            .foregroundStyle(palette.secondaryText)
                        Text(next.name.displayName)
                            .font(SiratFont.display(36, weight: .semibold))
                            .foregroundStyle(palette.primaryText)
                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.system(size: 11))
                            Text(next.time, style: .time)
                                .font(SiratFont.numeric(15, weight: .semibold))
                        }
                        .foregroundStyle(palette.primaryText)
                    }
                    Spacer()
                    CountdownRing(progress: progress,
                                  targetDate: next.time,
                                  size: 90)
                }

                // ── Prayer strip ──────────────────────────────────────────
                HStack(spacing: 5) {
                    ForEach(entry.data.prayers, id: \.name) { p in
                        PrayerTimeCell(
                            entry: p,
                            isHighlighted: p.name == next.name,
                            compact: false
                        )
                    }
                }
                .frame(height: 80)

                // ── Quran reminder ────────────────────────────────────────
                ZStack {
                    GlassCard()
                    VStack(spacing: 4) {
                        Text(reminder.arabic)
                            .font(.system(size: 16, weight: .regular, design: .serif))
                            .foregroundStyle(palette.primaryText)
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .minimumScaleFactor(0.7)
                            .padding(.horizontal, 8)
                            .environment(\.layoutDirection, .rightToLeft)

                        Text(reminder.english)
                            .font(.system(size: 10, weight: .regular, design: .serif))
                            .italic()
                            .foregroundStyle(palette.secondaryText)
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .padding(.horizontal, 8)

                        Text(reminder.reference)
                            .font(SiratFont.label(8, weight: .semibold))
                            .tracking(1.2)
                            .foregroundStyle(palette.accent)
                    }
                    .padding(8)
                }
                .frame(maxHeight: 78)
            }
            .padding(14)
        }
        .environment(\.themePalette, palette)
    }
}

struct LargePrayerWidget: Widget {
    let kind = "LargePrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            LargePrayerWidgetView(entry: entry)
                .containerBackground(for: .widget) { Color.clear }
        }
        .configurationDisplayName("Sirat Daily")
        .description("Full prayer overview with daily Qur'an reminder.")
        .supportedFamilies([.systemLarge])
    }
}

#Preview(as: .systemLarge) {
    LargePrayerWidget()
} timeline: {
    SiratEntry(date: Date(), data: .placeholder, theme: .emerald)
    SiratEntry(date: Date(), data: .placeholder, theme: .goldBlack)
}
