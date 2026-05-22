//
//  WalkthroughModels.swift
//  Sirat Al Huda — Prayer Walkthrough
//
//  Data model for the step-by-step prayer guide. Designed to be JSON-driven
//  so that adding a new prayer (Witr, Jumu'ah, Tahajjud, etc.) is a content
//  task — no code changes required.
//
//  Hierarchy:
//    Prayer
//      └── [Rakah]              ← e.g. Fajr has 2, Dhuhr has 4
//            └── [PrayerStep]   ← Qiyam, Takbir, Fatiha, Surah, Ruku, ...
//                  ├── recitation (Arabic / translit / English)
//                  └── tips (optional)
//
//  Each `PrayerStep` has Sunni and Shia variants where they differ. If a
//  variant is nil, the shared content applies to both.
//

import Foundation

// MARK: - Prayer (the top-level container)

public struct Prayer: Identifiable, Codable, Hashable, Sendable {
    public let id: String                  // "fajr", "dhuhr", ...
    public let name: String                // "Fajr"
    public let arabicName: String          // "الفجر"
    public let subtitle: String            // "Dawn prayer"
    public let rakahCount: Int             // total rakahs (sum of obligatory)
    public let category: PrayerCategory
    public let summary: String             // 1-2 line description shown on list
    public let rakahs: [Rakah]             // ordered list

    /// Total step count across all rakahs. Used for the progress bar.
    public func totalSteps(for madhhab: Madhhab) -> Int {
        rakahs.reduce(0) { $0 + $1.steps(for: madhhab).count }
    }
}

public enum PrayerCategory: String, Codable, CaseIterable, Sendable {
    case obligatory  = "obligatory"        // the daily 5 + Jumu'ah
    case recommended = "recommended"       // Witr, Tahajjud, Duha...
    case occasional  = "occasional"        // Eid, Janazah, Ayat...
    case situational = "situational"       // Travel, Qasr, Istikhara...

    public var displayName: String {
        switch self {
        case .obligatory:  return "Obligatory"
        case .recommended: return "Recommended"
        case .occasional:  return "Occasional"
        case .situational: return "Situational"
        }
    }
}

// MARK: - Rakah (a single unit of prayer)

public struct Rakah: Codable, Hashable, Sendable {
    public let number: Int                 // 1, 2, 3, 4
    public let stepsSunni: [PrayerStep]
    public let stepsShia: [PrayerStep]?    // optional override; falls back to Sunni if nil

    public func steps(for madhhab: Madhhab) -> [PrayerStep] {
        switch madhhab {
        case .sunni: return stepsSunni
        case .shia:  return stepsShia ?? stepsSunni
        }
    }
}

// MARK: - Step

public struct PrayerStep: Identifiable, Codable, Hashable, Sendable {
    public let id: String                  // "fajr-r1-fatiha"
    public let title: String               // "Recite Al-Fatiha"
    public let posture: PoseSilhouette     // for the figure rendering
    public let assetName: String?          // optional named image asset
    public let instruction: String         // detailed guidance
    public let recitation: Recitation?     // nil for non-recited steps
    public let tip: String?                // optional pronunciation/posture tip
    public let madhhabNote: String?        // optional madhhab-specific note
}

// MARK: - Recitation

public struct Recitation: Codable, Hashable, Sendable {
    public let arabic: String
    public let transliteration: String
    public let translation: String
    public let reference: String?          // e.g. "Qur'an 1:1-7"
    public let audioId: String?            // for future audio wiring
}
