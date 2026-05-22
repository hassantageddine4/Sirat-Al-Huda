# Sirat Al Huda — Prayer Walkthrough

Step-by-step prayer teaching screens for the daily five prayers (Fajr, Dhuhr,
Asr, Maghrib, Isha), with a Sunni / Shia toggle at the top, swipe + button
navigation, and full recitations (Arabic / transliteration / translation) at
each step.

This is the walkthrough engine. Adding more prayers (Witr, Jumu'ah, Tahajjud,
Janazah, Eid, etc.) is a content task — extend `PrayerCatalog` with new
`Prayer` values, no UI changes needed.

---

## File layout

```
SiratWalkthrough/
├── Models/
│   └── WalkthroughModels.swift         ← Prayer, Rakah, PrayerStep, Recitation
├── Data/
│   ├── RecitationLibrary.swift         ← reusable Fatiha, Tashahhud, etc.
│   ├── ExtendedRecitations.swift       ← Qunut, Janazah du'as, Eid takbirs, Istikhara
│   ├── PrayerData.swift                ← daily 5 + Step / RakahBuilder helpers
│   ├── WitrPrayer.swift                ← Witr (recommended, with qunūt)
│   ├── JumuahPrayer.swift              ← Jumuʿah (with khuṭbah listening steps)
│   ├── JanazahPrayer.swift             ← Janāzah (4-takbir Sunni / 5-takbir Shia)
│   ├── EidPrayer.swift                 ← Eid (extra takbīrs in qiyām)
│   ├── VoluntaryPrayers.swift          ← Tahajjud, Duha, Tawbah, Istikhara
│   ├── TaraweehPrayer.swift            ← Tarāwīḥ (Ramadan night unit)
│   ├── TravelGuidance.swift            ← Qaṣr / combining rules (guidance, not walkthrough)
│   └── RawatibGuidance.swift           ← Sunnah schedule (guidance, not walkthrough)
├── Components/
│   ├── RecitationCard.swift            ← Arabic / translit / translation block
│   ├── WalkthroughHeader.swift         ← title + counters + progress bar
│   └── WalkthroughComponents.swift     ← PoseStage, InstructionBlock, NavBar
└── Views/
    ├── PrayerListView.swift            ← entry screen, sectioned by category
    └── PrayerWalkthroughView.swift     ← the step screen
```

This package depends on the previous **SiratPrayerGuide** package for:

- `Madhhab` enum (in `Models/PrayerPose.swift`)
- `MadhhabToggle` component
- `DecorativeSectionHeader`
- `PoseSilhouetteView` and the `PoseSilhouette` enum
- `IslamicGeometricBackground`

If those aren't already in the project, add them first. Same Xcode group is
fine.

---

## Wiring it in

```swift
NavigationLink("Prayer Guide") {
    PrayerListView()
}
```

That's the whole integration. The list screen handles its own modal flow into
the walkthrough.

---

## ⚠️ Content review required before shipping

The Arabic, transliteration, and translations in `RecitationLibrary.swift`
and `PrayerData.swift` are **draft content**. Before this ships to real users
you need to have it reviewed by qualified scholars from each madhhab. Sources
I drew on (review against your preferred references):

- **Sunni**: Sahih al-Bukhari, Sunan Abi Dawud, SeekersGuidance practical
  fiqh manuals.
- **Shia**: Tawdih al-Masa'il (Sistani), Al-Islam.org practical guides.

Specifically worth a careful read:

- **Tashahhud Shia form** — the Ja'fari version varies slightly between
  marjas; check against your target audience's source of taqlid.
- **Salawāt** — Sunni version uses the Ibrahimi formula; Shia practice
  includes "wa āli Muḥammad" as part of the obligatory tashahhud, not
  optional.
- **Madhhab notes** on each step (sujūd → turbah, qiyām hand position) —
  accurate at a high level but a scholar should verify the language.
- **Audible vs silent** in each prayer is correct for Sunni standard
  practice; Shia practice has differences (e.g. some recitations are
  silent for women in congregation). Mark and adjust.

I've written the data so corrections are easy:

- Single-source recitations live in `RecitationLibrary.swift` — fix once,
  every prayer that uses it picks up the correction.
- Step instructions and tips live in `PrayerData.swift` via the `Step`
  builder enum — a scholar can review the file by reading the builder
  methods top-to-bottom.

---

## How the walkthrough composes

`PrayerCatalog` exposes `Prayer` values. Each `Prayer` is a list of `Rakah`,
each rakah has a `stepsSunni` and an optional `stepsShia` array.

The walkthrough view flattens this into one ordered list of `(rakah, step)`
pairs and walks through them. Crossing from rakah 1 to rakah 2 is just
"the next step." The header shows which rakah you're in.

Switching the madhhab toggle mid-walkthrough rebuilds the flat list and tries
to keep the user on the equivalent step (matches by step ID). If the new
madhhab has a different step structure, the user is clamped to the nearest
valid index.

---

## Audio

Audio buttons (Play / Repeat / Slow) are present in the recitation card but
**disabled**, with a small "Audio coming soon" caption. The UI is finished;
the backend isn't wired. When you have qari recordings:

1. Add files to the asset catalog or bundle, named after the
   `Recitation.audioId` values (e.g. `fatiha.m4a`, `tashahhud_sunni.m4a`).
2. Replace the `audioButton` body in `RecitationCard.swift` with an
   `AVAudioPlayer`-backed view model. The disabled-state styling becomes
   the active-state styling — same shapes, same colors.

Don't ship TTS as a substitute. The whole point of recitation guidance is
correct pronunciation; synthetic voices will undermine the app.

---

## Pose imagery

Same approach as the Prayer Guide screen:

- Each step declares an `assetName` (e.g. `pose_qiyam_sunni`).
- If the named asset exists in `Assets.xcassets`, the `PoseStage` uses it.
- If not, `PoseSilhouetteView` renders the appropriate silhouette so the
  layout stays correct.

The same six poses cover all daily prayer steps, so the asset list from the
previous package (`pose_qiyam_*`, `pose_takbir_*`, `pose_ruku_*`,
`pose_sujood_*`, `pose_tashahhud_*`, `pose_salam_*`) is enough.

---

## Adding a new prayer

To add e.g. Witr:

```swift
extension PrayerCatalog {
    public static let witr = Prayer(
        id: "witr",
        name: "Witr",
        arabicName: "الوتر",
        subtitle: "Odd-numbered night prayer",
        rakahCount: 3,
        category: .recommended,
        summary: "An odd number of rakahs (typically 3) prayed after Isha.",
        rakahs: [
            RakahBuilder.first(prayer: "witr", audible: true),
            RakahBuilder.second(prayer: "witr", audible: true, isFinal: false),
            // Custom 3rd rakah with qunūt — write a new builder if the
            // standard `laterRakah` doesn't capture the qunūt step.
            ...
        ]
    )
}
```

For prayers with structurally different sequences (Janazah's 4 takbirs, Eid's
extra takbirs, Tasbih's repetitions), write a dedicated rakah/step builder
rather than forcing the standard template.

---

## Current prayer scope

**Daily (5):** Fajr, Dhuhr, Asr, Maghrib, Isha — both madhhabs.

**Friday (1):** Jumuʿah — includes khuṭbah listening steps + 2 audible rakahs.

**Recommended (6):** Witr (with qunūt), Tahajjud, Ḍuḥā, Tarāwīḥ, Tawbah, Istikhāra (with post-prayer du'a).

**Occasional (2):** Janāzah (4-takbīr Sunni / 5-takbīr Shia, no rukūʿ or sujūd), Eid (extra takbīrs in qiyām).

**Guidance (2):** Travel & Qaṣr rules, Rawātib sunnah schedule. These are explanation entries, not walkthroughs — they show informational steps explaining the rules instead of leading the user through a prayer.

**Total: 16 entries.**

### Deferred (in "Coming soon" section)

I've intentionally not built these because the content is genuinely shaky from secondary sources:

- **Tasbīḥ Prayer** — needs counter UI for the 300 distributed tasbeehāt; the engine doesn't have a counter component yet.
- **Ṣalāt al-Āyāt** — 5 rukūʿ per rakah with a specific sūrah-division pattern; the exact division is something I'd be guessing at.
- **Laylat al-Qadr** — not really a separate prayer; it's recommended du'as for the Night of Power. Modeling as a "prayer" would mislead.

## How to add the next prayer

The codebase now has a proven pattern for non-standard prayers:

1. Create a new file in `Data/` (e.g. `TaraweehPrayer.swift`).
2. Define any prayer-specific recitations in `ExtendedRecitations.swift`.
3. Define prayer-specific steps in a private enum (e.g. `TaraweehStep`).
4. Compose rakahs by calling into `Step` and `RakahBuilder` for the
   standard parts. Drop in your custom steps where they belong.
5. Add to `PrayerCatalog` via a `public extension`.
6. Add to `PrayerListView` if it should appear in a new section, or
   slot it into an existing category property.

The `Step` and `RakahBuilder` enums in `PrayerData.swift` are `internal`
so they're available to every prayer file in the target.

## What's NOT in this package yet

Listed for honesty:

- **Real audio playback.** Buttons are present, behaviour is not.
- **Tahajjud / Duha / Taraweeh.** Structurally similar to the daily 5 in
  shape, but the times/intentions/recommendations differ. Quick to add
  when you're ready.
- **Tasbih Prayer.** Needs a counter UI (300 tasbeeh distributed across
  positions). The walkthrough engine doesn't have tasbeeh-counting yet.
- **Salat al-Ayat.** Has 5 rukūʿ per rakah — RakahBuilder doesn't model
  that yet. Would need a custom rakah builder.
- **Qasr / Travel prayer logic.** Travel prayer is shorter (4-rakah
  prayers become 2). Best modeled as a runtime modifier on the
  walkthrough rather than separate prayers.
- **Combining prayers** (Shia practice for Dhuhr+Asr, Maghrib+Isha).
  Should be a flow that runs two prayer walkthroughs back to back.
- **Persistence.** No "resume where you left off" — by design, since
  prayer itself is meant to be uninterrupted.
- **Localization.** UI strings are English-only.
