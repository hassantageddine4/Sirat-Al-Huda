//
//  PrayerLiveActivity.swift
//  Sirat Al Huda — LiveActivity
//
//  Live Activity widget. Renders three contexts:
//  1. Lock-screen banner       (when device is locked)
//  2. Dynamic Island — expanded (long-press / leading view)
//  3. Dynamic Island — compact / minimal (collapsed states)
//

import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct PrayerLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PrayerActivityAttributes.self) { context in

            // ═══ Lock Screen Banner ═══════════════════════════════════════
            LockScreenBanner(state: context.state, attributes: context.attributes)
                .activityBackgroundTint(.clear)
                .activitySystemActionForegroundColor(.white)

        } dynamicIsland: { context in
            let palette = context.state.theme.resolved(for: .dark)

            return DynamicIsland {

                // ── EXPANDED ───────────────────────────────────────────
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 8) {
                        Image(systemName: context.state.nextPrayerSymbol)
                            .font(.system(size: 22))
                            .foregroundStyle(palette.accent)
                        VStack(alignment: .leading, spacing: 0) {
                            Text("NEXT")
                                .font(SiratFont.label(8, weight: .semibold))
                                .tracking(1.5)
                                .foregroundStyle(palette.secondaryText)
                            Text(context.state.nextPrayerName)
                                .font(SiratFont.display(18, weight: .semibold))
                                .foregroundStyle(palette.primaryText)
                        }
                    }
                    .padding(.leading, 4)
                }

                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing, spacing: 0) {
                        Text(context.state.nextPrayerTime, style: .time)
                            .font(SiratFont.numeric(16, weight: .semibold))
                            .foregroundStyle(palette.primaryText)
                        Text(timerInterval:
                                Date()...max(context.state.nextPrayerTime,
                                             Date().addingTimeInterval(1)),
                             countsDown: true)
                            .font(SiratFont.numeric(11, weight: .medium))
                            .foregroundStyle(palette.glow)
                            .multilineTextAlignment(.trailing)
                    }
                    .padding(.trailing, 4)
                }

                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 6) {
                        ProgressView(value: context.state.progress)
                            .tint(palette.glow)
                        HStack {
                            Text(context.state.madhab)
                                .font(SiratFont.label(8, weight: .semibold))
                                .tracking(1.5)
                                .foregroundStyle(palette.accent)
                            Spacer()
                            Text("Time until prayer")
                                .font(SiratFont.label(9))
                                .foregroundStyle(palette.secondaryText)
                        }
                    }
                    .padding(.horizontal, 4)
                }

            } compactLeading: {
                Image(systemName: context.state.nextPrayerSymbol)
                    .foregroundStyle(palette.accent)
            } compactTrailing: {
                Text(timerInterval:
                        Date()...max(context.state.nextPrayerTime,
                                     Date().addingTimeInterval(1)),
                     countsDown: true)
                    .font(SiratFont.numeric(12, weight: .semibold))
                    .frame(width: 48)
                    .foregroundStyle(palette.glow)
            } minimal: {
                Image(systemName: context.state.nextPrayerSymbol)
                    .foregroundStyle(palette.accent)
            }
            .keylineTint(palette.glow)
        }
    }
}

// MARK: - Lock Screen Banner

@available(iOS 16.2, *)
private struct LockScreenBanner: View {
    @Environment(\.colorScheme) private var scheme
    let state: PrayerActivityAttributes.ContentState
    let attributes: PrayerActivityAttributes

    var body: some View {
        let palette = state.theme.resolved(for: scheme)

        ZStack {
            GlassBackground(cornerRadius: 22)

            HStack(spacing: 14) {
                // Symbol badge
                ZStack {
                    Circle()
                        .fill(palette.cardFill)
                        .overlay(Circle().strokeBorder(palette.cardStroke,
                                                       lineWidth: SiratLayout.strokeWidth))
                    Image(systemName: state.nextPrayerSymbol)
                        .font(.system(size: 22))
                        .foregroundStyle(palette.accent)
                }
                .frame(width: 50, height: 50)

                VStack(alignment: .leading, spacing: 2) {
                    Text("NEXT PRAYER")
                        .font(SiratFont.label(8, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(palette.secondaryText)
                    Text(state.nextPrayerName)
                        .font(SiratFont.display(22, weight: .semibold))
                        .foregroundStyle(palette.primaryText)
                    Text(attributes.hijriDate)
                        .font(SiratFont.label(9))
                        .foregroundStyle(palette.secondaryText)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(state.nextPrayerTime, style: .time)
                        .font(SiratFont.numeric(16, weight: .semibold))
                        .foregroundStyle(palette.primaryText)

                    Text(timerInterval:
                            Date()...max(state.nextPrayerTime,
                                         Date().addingTimeInterval(1)),
                         countsDown: true)
                        .font(SiratFont.numeric(13, weight: .medium))
                        .foregroundStyle(palette.glow)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 80)

                    // Progress bar
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(palette.cardStroke)
                            Capsule()
                                .fill(LinearGradient(
                                    colors: [palette.glow, palette.accent],
                                    startPoint: .leading,
                                    endPoint: .trailing))
                                .frame(width: geo.size.width * state.progress)
                        }
                    }
                    .frame(width: 80, height: 3)
                }
            }
            .padding(14)
        }
        .environment(\.themePalette, palette)
        .padding(.horizontal, 8)
    }
}
