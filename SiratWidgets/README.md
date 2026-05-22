# Sirat Al Huda — Widget System

A complete, modular widget package for Sirat Al Huda. Drops into the existing
Xcode project as two layers:

- **App side** files compile into the main app target.
- **Widget extension side** files compile into a new Widget Extension target.
- **Shared layer** is added to **both** targets (set in *Target Membership*).

---

## File layout

```
SiratWidgets/
├── Shared/                       ← add to BOTH targets
│   ├── SharedDataModel.swift
│   ├── PrayerWidgetData.swift
│   ├── ThemeManager.swift
│   ├── QuranMotivation.swift
│   └── DesignSystem.swift
│
├── App/                          ← add to MAIN APP target only
│   ├── WidgetDataWriter.swift
│   └── ThemeSelectorView.swift
│
├── Widget/                       ← add to WIDGET EXTENSION only
│   ├── SiratWidgetBundle.swift   (the @main entry point)
│   ├── Provider/
│   │   └── PrayerTimelineProvider.swift
│   ├── HomeScreen/
│   │   ├── SmallPrayerWidget.swift
│   │   ├── MediumPrayerWidget.swift
│   │   └── LargePrayerWidget.swift
│   ├── LockScreen/
│   │   └── LockScreenWidgets.swift
│   └── Components/
│       ├── GlassBackground.swift
│       ├── CountdownRing.swift
│       └── PrayerTimeRow.swift
│
└── LiveActivity/
    ├── PrayerActivityAttributes.swift   ← BOTH targets
    ├── PrayerLiveActivity.swift         ← WIDGET EXTENSION only
    └── LiveActivityController.swift     ← MAIN APP only
```

---

## One-time Xcode setup

### 1. Create a Widget Extension target
File → New → Target → **Widget Extension**. Call it `SiratWidgetsExtension`.
Tick *Include Live Activity*. Delete the placeholder swift files Xcode generates
for it — `SiratWidgetBundle.swift` from this package replaces them.

### 2. Create an App Group
In the **Signing & Capabilities** tab of *both* targets:

- Add the **App Groups** capability.
- Create a group, e.g. `group.com.sirat.alhuda`.
- Tick the same group on both targets.

Then update the constant in `Shared/SharedDataModel.swift`:

```swift
public static let appGroupID = "group.com.sirat.alhuda"
```

### 3. Enable Live Activities
In the **main app's Info.plist**:

```xml
<key>NSSupportsLiveActivities</key>
<true/>
```

### 4. Target membership
For each file in `Shared/`, in the right-hand File Inspector, tick **both** the
main app and the widget extension. App-side files only need the app target;
widget-side files only need the widget target.

---

## Wiring it into the existing app

### When you compute prayer times

```swift
// In your existing prayer-time refresh function:
WidgetDataWriter.write(
    fajr:    todaysFajr,
    dhuhr:   todaysDhuhr,
    asr:     todaysAsr,
    maghrib: todaysMaghrib,
    isha:    todaysIsha,
    madhab:  userIsSunni ? .sunni : .shia
)
```

That single call:
- Writes the data to the App Group.
- Calls `WidgetCenter.shared.reloadAllTimelines()`.

### When the user changes the madhab

`WidgetDataWriter.write(...)` already handles this. Or call
`SiratSharedStorage.saveMadhab(.shia)` directly.

### Showing the theme picker

```swift
NavigationLink("Widget Theme") {
    ThemeSelectorView()
}
```

`ThemeSelectorView` persists the choice and triggers a widget reload — no
glue code required.

### Starting / updating the Live Activity

```swift
// After computing prayer times for the day:
if let data = SiratSharedStorage.loadPrayerData() {
    LiveActivityController.shared.start(with: data)
}

// Whenever the next prayer rolls over:
if let data = SiratSharedStorage.loadPrayerData() {
    LiveActivityController.shared.update(with: data)
}

// To dismiss explicitly:
LiveActivityController.shared.end()
```

A reasonable trigger point: schedule a timer in your app's prayer-time
service that fires at each prayer's time, and call `update(...)` from there.

---

## Themes

All nine themes are defined in `Shared/ThemeManager.swift`. Each has explicit
light/dark variants where contrast warrants it (Emerald, Silver, Sandstone);
the deep-saturation themes (Sapphire, Royal, Crimson, Teal, Midnight, Gold &
Black) use one palette across both schemes because their dark style works in
either context.

To add a custom theme: extend the `WidgetTheme` enum and add a case to the
`resolved(for:)` switch. Everything else picks it up automatically.

---

## Architecture notes

- **Single source of truth**: prayer state lives in the App Group. The host app
  is the only writer; widgets and Live Activities read.
- **Timeline strategy**: the provider emits one entry per prayer time today, so
  the "next prayer" rolls over at the right moments without needing additional
  reloads. The timeline policy refreshes at the start of each new day.
- **Countdowns**: rendered with `Text(timerInterval:countsDown:)`, which means
  the OS animates the number locally — no per-second timeline reloads.
- **Glass effect**: a single composed view (`GlassBackground`) — gradient +
  radial glow + sheen + hairline stroke — used by every widget for visual
  consistency.
- **Quran reminder rotation**: deterministic by day-of-year, so it stays stable
  for the day and rotates each morning without random flicker.

---

## Things to verify before shipping

1. The App Group identifier matches in both targets and in code.
2. Hijri formatting matches what the rest of the app uses (the included
   formatter uses `islamicUmmAlQura`; swap if your app uses a different
   variant).
3. `NSSupportsLiveActivities` is set in the host app's Info.plist.
4. The widget extension's deployment target is iOS 16.2+ for Live Activities.
5. The English renderings in `QuranMotivation.swift` are paraphrased meanings,
   not canonical translations — review them against the translation source
   you want to credit and update the strings (and consider crediting Saheeh
   International, Pickthall, etc., depending on your editorial choice).
