//
//  CountdownRing.swift
//  Sirat Al Huda — Widget
//
//  Circular countdown ring with the "IN  Xh Ym  LEFT" stack from the reference.
//  Uses Text(date, style: .timer) so it counts down without timeline reloads.
//

import SwiftUI

struct CountdownRing: View {
    @Environment(\.themePalette) private var palette

    let progress: Double          // 0…1 — passed in from provider
    let targetDate: Date          // next prayer time

    var lineWidth: CGFloat = 4
    var size: CGFloat = 92

    var body: some View {
        ZStack {
            // Track
            Circle()
                .stroke(palette.cardStroke, lineWidth: lineWidth)

            // Progress arc
            Circle()
                .trim(from: 0, to: max(min(progress, 1), 0.001))
                .stroke(
                    AngularGradient(
                        colors: [palette.glow.opacity(0.4), palette.glow, palette.accent],
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .shadow(color: palette.glow.opacity(0.6), radius: 6)

            // Inner content
            VStack(spacing: 2) {
                Text("IN")
                    .font(SiratFont.label(8, weight: .semibold))
                    .tracking(2)
                    .foregroundStyle(palette.secondaryText)

                Text(timerInterval: Date()...max(targetDate, Date().addingTimeInterval(1)),
                     countsDown: true)
                    .font(SiratFont.numeric(15, weight: .semibold))
                    .foregroundStyle(palette.primaryText)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)

                Text("LEFT")
                    .font(SiratFont.label(8, weight: .semibold))
                    .tracking(2)
                    .foregroundStyle(palette.secondaryText)
            }
            .padding(.horizontal, 6)
        }
        .frame(width: size, height: size)
    }
}
