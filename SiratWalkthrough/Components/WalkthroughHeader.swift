//
//  WalkthroughHeader.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Top-of-screen status: prayer name, rakah counter, step counter,
//  progress bar. The progress bar animates smoothly between steps.
//

import SwiftUI

struct WalkthroughHeader: View {
    let prayer: Prayer
    let currentRakahNumber: Int
    let currentStepIndex: Int       // 0-based across the WHOLE walkthrough
    let totalSteps: Int

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)

    private var progress: Double {
        guard totalSteps > 0 else { return 0 }
        return Double(currentStepIndex + 1) / Double(totalSteps)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {

            // Prayer title row
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(prayer.name.uppercased())
                        .font(.system(size: 11, weight: .semibold))
                        .tracking(3)
                        .foregroundStyle(gold.opacity(0.85))
                    Text(prayer.subtitle)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundStyle(.white.opacity(0.6))
                }
                Spacer()
                Text(prayer.arabicName)
                    .font(.system(size: 18, weight: .regular, design: .serif))
                    .foregroundStyle(.white.opacity(0.95))
            }

            // Counters row
            HStack(spacing: 14) {
                counterPill(
                    label: "RAK'AH",
                    value: "\(currentRakahNumber)/\(prayer.rakahCount)"
                )
                counterPill(
                    label: "STEP",
                    value: "\(currentStepIndex + 1)/\(totalSteps)"
                )
                Spacer()
            }

            // Progress bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.white.opacity(0.08))
                        .frame(height: 4)
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.30, green: 0.85, blue: 0.55),
                                    gold
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: max(8, geo.size.width * progress), height: 4)
                        .shadow(color: gold.opacity(0.4), radius: 4, y: 0)
                }
            }
            .frame(height: 4)
            .animation(.spring(response: 0.55, dampingFraction: 0.85), value: progress)
        }
    }

    private func counterPill(label: String, value: String) -> some View {
        HStack(spacing: 6) {
            Text(label)
                .font(.system(size: 9, weight: .semibold))
                .tracking(1.5)
                .foregroundStyle(.white.opacity(0.5))
            Text(value)
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .monospacedDigit()
                .foregroundStyle(.white)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(
            Capsule()
                .fill(Color.white.opacity(0.06))
                .overlay(
                    Capsule().strokeBorder(Color.white.opacity(0.10), lineWidth: 0.5)
                )
        )
    }
}
