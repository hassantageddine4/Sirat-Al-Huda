//
//  PrayerListView.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Entry screen — list of available prayers grouped by category. Tap a row
//  to open the step-by-step walkthrough.
//
//  Categories with no available prayers (the recommended/occasional ones,
//  pending content) show a "Coming soon" disabled row so users know the
//  scope of the app.
//

import SwiftUI

public struct PrayerListView: View {

    @State private var madhhab: Madhhab = .sunni
    @State private var selectedPrayer: Prayer? = nil

    private let bgTop    = Color(red: 0.04, green: 0.16, blue: 0.11)
    private let bgBottom = Color(red: 0.01, green: 0.06, blue: 0.04)
    private let gold     = Color(red: 0.95, green: 0.80, blue: 0.45)

    public init() {}

    public var body: some View {
        ZStack {
            background

            ScrollView(showsIndicators: false) {
                VStack(spacing: 22) {
                    headerArea
                    section(title: "Daily Prayers",   prayers: PrayerCatalog.dailyFive)
                    section(title: "Friday Prayer",   prayers: PrayerCatalog.congregational)
                    section(title: "Recommended",     prayers: PrayerCatalog.recommended)
                    section(title: "Occasional",      prayers: PrayerCatalog.occasional)
                    section(title: "Guidance",        prayers: PrayerCatalog.situational)
                    comingSoonSection
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
        }
        .preferredColorScheme(.dark)
        .fullScreenCover(item: $selectedPrayer) { prayer in
            PrayerWalkthroughView(prayer: prayer, madhhab: madhhab)
        }
    }

    // MARK: - Pieces

    private var background: some View {
        ZStack {
            LinearGradient(colors: [bgTop, bgBottom], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
            RadialGradient(
                colors: [Color(red: 0.18, green: 0.55, blue: 0.38).opacity(0.30), .clear],
                center: .topLeading,
                startRadius: 0,
                endRadius: 360
            )
            .blendMode(.plusLighter)
            .ignoresSafeArea()
            IslamicGeometricBackground(tileSize: 70, lineOpacity: 0.04)
                .ignoresSafeArea()
        }
    }

    private var headerArea: some View {
        VStack(spacing: 14) {
            Text("PRAYER GUIDE")
                .font(.system(size: 11, weight: .semibold))
                .tracking(4)
                .foregroundStyle(gold.opacity(0.85))
            MadhhabToggle(selection: $madhhab)
        }
        .padding(.top, 4)
    }

    private func section(title: String, prayers: [Prayer]) -> some View {
        VStack(spacing: 12) {
            DecorativeSectionHeader(title: title)
                .padding(.top, 4)
            VStack(spacing: 10) {
                ForEach(prayers) { prayer in
                    PrayerListCard(prayer: prayer) {
                        selectedPrayer = prayer
                    }
                }
            }
        }
    }

    private var comingSoonSection: some View {
        VStack(spacing: 14) {
            HStack {
                Spacer()
                Text("Specialised prayers — coming soon")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundStyle(.white.opacity(0.4))
                    .italic()
                Spacer()
            }
            .padding(.top, 12)
            VStack(spacing: 8) {
                ForEach([
                    ("Tasbīḥ Prayer",      "300 tasbeehāt with counter UI"),
                    ("Ṣalāt al-Āyāt",      "Eclipse / earthquake — 5 rukūʿ per rakah"),
                    ("Laylat al-Qadr",     "Recommended du'as for the Night of Power"),
                ], id: \.0) { name, hint in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(name)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.white.opacity(0.5))
                            Text(hint)
                                .font(.system(size: 10, weight: .regular))
                                .foregroundStyle(.white.opacity(0.35))
                        }
                        Spacer()
                        Text("Soon")
                            .font(.system(size: 10, weight: .semibold))
                            .tracking(1.2)
                            .foregroundStyle(gold.opacity(0.5))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .fill(Color.white.opacity(0.02))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .strokeBorder(Color.white.opacity(0.06), lineWidth: 0.5)
                            )
                    )
                }
            }
        }
    }
}

// MARK: - List card

struct PrayerListCard: View {
    let prayer: Prayer
    var onTap: () -> Void = {}

    private let gold = Color(red: 0.95, green: 0.80, blue: 0.45)
    @State private var isPressed = false

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 14) {
                // Icon plate
                ZStack {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.10, green: 0.36, blue: 0.25),
                                    Color(red: 0.04, green: 0.22, blue: 0.16)
                                ],
                                startPoint: .top, endPoint: .bottom
                            )
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .strokeBorder(gold.opacity(0.4), lineWidth: 0.6)
                        )
                    Image(systemName: iconForPrayer)
                        .font(.system(size: 18))
                        .foregroundStyle(gold)
                }
                .frame(width: 48, height: 48)

                VStack(alignment: .leading, spacing: 3) {
                    HStack(alignment: .firstTextBaseline) {
                        Text(prayer.name)
                            .font(.system(size: 17, weight: .semibold, design: .serif))
                            .foregroundStyle(.white)
                        Text(prayer.arabicName)
                            .font(.system(size: 14, weight: .regular, design: .serif))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                    Text(prayer.summary)
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(.white.opacity(0.6))
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                }
                Spacer(minLength: 0)
                HStack(spacing: 6) {
                    Text("\(prayer.rakahCount)")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundStyle(gold)
                    Text("rak'ahs")
                        .font(.system(size: 10, weight: .regular))
                        .foregroundStyle(.white.opacity(0.5))
                    Image(systemName: "chevron.right")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.3))
                }
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 0.06, green: 0.24, blue: 0.17),
                                Color(red: 0.02, green: 0.13, blue: 0.09)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .strokeBorder(gold.opacity(0.25), lineWidth: 0.6)
                    )
            )
            .scaleEffect(isPressed ? 0.98 : 1.0)
            .shadow(color: .black.opacity(0.3), radius: 10, y: 4)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in withAnimation(.spring(response: 0.25)) { isPressed = true } }
                .onEnded { _ in withAnimation(.spring(response: 0.35)) { isPressed = false } }
        )
    }

    private var iconForPrayer: String {
        switch prayer.id {
        case "fajr":     return "sunrise.fill"
        case "dhuhr":    return "sun.max.fill"
        case "asr":      return "cloud.sun.fill"
        case "maghrib":  return "sunset.fill"
        case "isha":     return "moon.stars.fill"
        case "witr":     return "moon.fill"
        case "jumuah":   return "person.3.fill"
        case "janazah":  return "leaf.fill"
        case "eid":      return "star.fill"
        case "tahajjud": return "moon.zzz.fill"
        case "duha":     return "sunrise"
        case "taraweeh": return "moon.circle.fill"
        case "tawbah":   return "heart.fill"
        case "istikhara":return "questionmark.circle.fill"
        case "travel":   return "airplane"
        case "rawatib":  return "list.bullet.indent"
        default:         return "moon.fill"
        }
    }
}
