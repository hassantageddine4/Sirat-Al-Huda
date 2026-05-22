#!/usr/bin/env python3
"""
Converts LockScreenPrayerWidget to AppIntentConfiguration to match the new
shared PrayerWidgetProvider (which became AppIntentTimelineProvider in v10).
"""
import pathlib, sys

LSW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
if not LSW.exists():
    print(f"ERROR: {LSW} not found", file=sys.stderr); sys.exit(1)

src = LSW.read_text()

# 1. Add AppIntents import if missing
if "import AppIntents" not in src:
    src = src.replace("import WidgetKit", "import WidgetKit\nimport AppIntents", 1)
    print("✓ Added AppIntents import")

# 2. Convert LockScreenPrayerWidget from StaticConfiguration to AppIntentConfiguration
OLD = '''struct LockScreenPrayerWidget: Widget {
    let kind = "LockScreenPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
            LockScreenView(entry: entry)
        }
        .configurationDisplayName("Sirat Lock Screen")
        .description("Next prayer on your Lock Screen.")
        .supportedFamilies([.accessoryInline, .accessoryCircular, .accessoryRectangular])
    }
}'''

NEW = '''struct LockScreenPrayerWidget: Widget {
    let kind = "LockScreenPrayerWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent.self, provider: PrayerWidgetProvider()) { entry in
            LockScreenView(entry: entry)
        }
        .configurationDisplayName("Sirat Lock Screen")
        .description("Next prayer on your Lock Screen.")
        .supportedFamilies([.accessoryInline, .accessoryCircular, .accessoryRectangular])
    }
}'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    print("✓ Converted LockScreenPrayerWidget to AppIntentConfiguration")
elif "AppIntentConfiguration(kind: kind, intent: WidgetThemeIntent" in src:
    print("○ Already converted")
else:
    print("⚠ LockScreenPrayerWidget pattern not found", file=sys.stderr)
    sys.exit(1)

LSW.write_text(src)
