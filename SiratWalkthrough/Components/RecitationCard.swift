//
//  RecitationCard.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  The most content-dense component in the walkthrough. Stacks:
//    - "RECITATION" caption + reference
//    - Arabic (large, RTL, serif)
//    - Transliteration (italic, mid-size, with diacritics)
//    - Translation (smaller, prose)
//    - Audio control row (play / repeat / slow) — UI only for now
//
//  Audio buttons are present but disabled, with a small "audio coming soon"
//  label so users understand the affordance is intentional.
//

import SwiftUI

struct RecitationCard: View {
    let recitation: Recitation
    @State private var slowMode = false

    private let gold      = Color(red: 0.95, green: 0.80, blue: 0.45)
    private let goldFaint = Color(red: 0.95, green: 0.80, blue: 0.45).opacity(0.25)

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {

            // Header row
            HStack {
                Text("RECITATION")
                    .font(.system(size: 10, weight: .semibold))
                    .tracking(2.5)
                    .foregroundStyle(gold.opacity(0.9))
                Spacer()
                if let ref = recitation.reference {
                    Text(ref)
                        .font(.system(size: 10, weight: .regular))
                        .tracking(0.5)
                        .foregroundStyle(.white.opacity(0.5))
                }
            }

            // Arabic — RTL, serif, large for legibility
            Text(recitation.arabic)
                .font(.system(size: 22, weight: .regular, design: .serif))
                .foregroundStyle(.white)
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .environment(\.layoutDirection, .rightToLeft)
                .lineSpacing(8)
                .padding(.vertical, 4)
                .accessibilityLabel("Arabic recitation")

            divider

            // Transliteration
            VStack(alignment: .leading, spacing: 4) {
                Text("TRANSLITERATION")
                    .font(.system(size: 9, weight: .semibold))
                    .tracking(1.8)
                    .foregroundStyle(.white.opacity(0.45))
                Text(recitation.transliteration)
                    .font(.system(size: 14, weight: .regular, design: .serif))
                    .italic()
                    .foregroundStyle(.white.opacity(0.92))
                    .lineSpacing(4)
            }

            divider

            // Translation
            VStack(alignment: .leading, spacing: 4) {
                Text("TRANSLATION")
                    .font(.system(size: 9, weight: .semibold))
                    .tracking(1.8)
                    .foregroundStyle(.white.opacity(0.45))
                Text(recitation.translation)
                    .font(.system(size: 13, weight: .regular))
                    .foregroundStyle(.white.opacity(0.85))
                    .lineSpacing(3)
            }

            // Audio controls
            audioControlRow
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.04))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .strokeBorder(goldFaint, lineWidth: 0.7)
                )
        )
    }

    private var divider: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.10), .clear],
                    startPoint: .leading, endPoint: .trailing
                )
            )
            .frame(height: 0.6)
    }

    // MARK: - Audio controls (UI only — no audio backend yet)

    private var audioControlRow: some View {
        VStack(spacing: 8) {
            HStack(spacing: 10) {
                audioButton(symbol: "play.fill", label: "Play", primary: true)
                audioButton(symbol: "arrow.clockwise", label: "Repeat")
                Button {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                        slowMode.toggle()
                    }
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "tortoise.fill")
                            .font(.system(size: 11))
                        Text("Slow")
                            .font(.system(size: 11, weight: .medium))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 7)
                    .frame(maxWidth: .infinity)
                    .background(
                        Capsule()
                            .fill(slowMode ? gold.opacity(0.18) : Color.white.opacity(0.06))
                            .overlay(
                                Capsule().strokeBorder(
                                    slowMode ? gold.opacity(0.6) : Color.white.opacity(0.12),
                                    lineWidth: 0.6
                                )
                            )
                    )
                    .foregroundStyle(slowMode ? gold : Color.white.opacity(0.5))
                }
                .buttonStyle(.plain)
                .disabled(true)
                .opacity(0.6)
            }

            HStack {
                Spacer()
                Text("Audio coming soon")
                    .font(.system(size: 9, weight: .regular))
                    .foregroundStyle(.white.opacity(0.35))
                    .italic()
            }
        }
        .padding(.top, 4)
    }

    private func audioButton(symbol: String, label: String, primary: Bool = false) -> some View {
        // Disabled placeholder — wire to actual audio playback later.
        HStack(spacing: 4) {
            Image(systemName: symbol).font(.system(size: 11))
            Text(label).font(.system(size: 11, weight: .medium))
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 7)
        .frame(maxWidth: .infinity)
        .background(
            Capsule()
                .fill(primary ? gold.opacity(0.18) : Color.white.opacity(0.06))
                .overlay(
                    Capsule().strokeBorder(
                        primary ? gold.opacity(0.6) : Color.white.opacity(0.12),
                        lineWidth: 0.6
                    )
                )
        )
        .foregroundStyle(primary ? gold : Color.white.opacity(0.5))
        .opacity(0.6)
    }
}
