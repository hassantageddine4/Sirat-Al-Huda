//
//  GlassBackground.swift
//  Sirat Al Huda — Widget
//
//  Premium glassmorphism surface used as the base of every widget.
//  Layered:  gradient → ambient glow → noise-free hairline stroke → top sheen.
//

import SwiftUI

struct GlassBackground: View {
    @Environment(\.themePalette) private var palette
    var cornerRadius: CGFloat = SiratLayout.cornerRadius

    var body: some View {
        ZStack {
            // Base gradient
            palette.backgroundGradient

            // Soft radial glow in the upper-left — the "lit from within" feel
            // visible in the reference image.
            RadialGradient(
                colors: [palette.glow.opacity(0.35), .clear],
                center: .topLeading,
                startRadius: 0,
                endRadius: 220
            )
            .blendMode(.plusLighter)
            .opacity(0.55)

            // Subtle bottom shadow gradient for depth
            LinearGradient(
                colors: [.clear, .black.opacity(0.18)],
                startPoint: .center,
                endPoint: .bottom
            )

            // Top sheen — hairline highlight along the top edge
            VStack(spacing: 0) {
                LinearGradient(
                    colors: [Color.white.opacity(0.18), .clear],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 36)
                Spacer(minLength: 0)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
        .overlay(
            // Hairline stroke
            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                .strokeBorder(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.30),
                            Color.white.opacity(0.05),
                            palette.accent.opacity(0.20)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: SiratLayout.strokeWidth
                )
        )
    }
}

/// Smaller glass card used inside widgets (e.g. each prayer cell).
struct GlassCard: View {
    @Environment(\.themePalette) private var palette
    var isHighlighted: Bool = false
    var cornerRadius: CGFloat = SiratLayout.innerCornerRadius

    var body: some View {
        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
            .fill(isHighlighted ? palette.glow.opacity(0.22) : palette.cardFill)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(
                        isHighlighted ? palette.glow.opacity(0.55) : palette.cardStroke,
                        lineWidth: SiratLayout.strokeWidth
                    )
            )
            .shadow(
                color: isHighlighted ? palette.glow.opacity(0.35) : .clear,
                radius: isHighlighted ? 10 : 0,
                x: 0, y: 0
            )
    }
}
