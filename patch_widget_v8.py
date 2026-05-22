#!/usr/bin/env python3
"""
Adds a medium-sized home screen Daily Verse widget. Arabic verse displayed
prominently with English translation and reference below. Theme-aware.
"""
import pathlib, sys

PW = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/PrayerWidgets.swift"
BUNDLE = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/Sirat_Al_huda_widgetBundle.swift"

for p in (PW, BUNDLE):
    if not p.exists():
        print(f"ERROR: {p} not found", file=sys.stderr); sys.exit(1)

# ─── Append Daily Verse home widget to PrayerWidgets.swift ─────────────────
BLOCK = '''

// ─── Daily Verse Home Widget (Medium) ──────────────────────────────────────

struct DailyVerseHomeEntry: TimelineEntry {
    let date: Date
    let verse: Verse
    let theme: WidgetTheme
}

struct DailyVerseHomeProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyVerseHomeEntry {
        DailyVerseHomeEntry(date: Date(), verse: VerseBank.today(), theme: WidgetTheme.of(.emerald))
    }
    func getSnapshot(in context: Context, completion: @escaping (DailyVerseHomeEntry) -> Void) {
        completion(DailyVerseHomeEntry(date: Date(), verse: VerseBank.today(),
                                        theme: WidgetTheme.of(WidgetThemeKey.current)))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyVerseHomeEntry>) -> Void) {
        let now = Date()
        let entry = DailyVerseHomeEntry(date: now, verse: VerseBank.today(),
                                         theme: WidgetTheme.of(WidgetThemeKey.current))
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1,
                                              to: Calendar.current.startOfDay(for: now))
            ?? now.addingTimeInterval(86400)
        completion(Timeline(entries: [entry], policy: .after(tomorrow)))
    }
}

struct DailyVerseHomeView: View {
    var entry: DailyVerseHomeEntry

    var body: some View {
        let t = entry.theme
        let v = entry.verse

        VStack(alignment: .leading, spacing: 8) {
            HStack {
                SectionLabel(text: "Daily Verse", theme: t)
                Spacer()
            }

            Text(v.arabic)
                .font(.system(size: 22, weight: .medium))
                .foregroundColor(t.primaryText)
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .lineLimit(2)
                .minimumScaleFactor(0.7)

            Spacer(minLength: 0)

            Text(v.english)
                .font(.system(size: 13, weight: .regular))
                .italic()
                .foregroundColor(t.primaryText.opacity(0.85))
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .lineLimit(2)
                .minimumScaleFactor(0.85)

            Text(v.reference)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(t.accent)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .containerBackground(for: .widget) {
            WidgetBackground(theme: t)
        }
    }
}

struct DailyVerseHomeWidget: Widget {
    let kind = "DailyVerseHomeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyVerseHomeProvider()) { entry in
            DailyVerseHomeView(entry: entry)
        }
        .configurationDisplayName("Daily Verse")
        .description("A daily Qur\\u{2019}an reflection on your Home Screen.")
        .supportedFamilies([.systemMedium])
    }
}
'''

src = PW.read_text()
if "DailyVerseHomeWidget" not in src:
    PW.write_text(src + BLOCK)
    print("✓ Appended Daily Verse home widget to PrayerWidgets.swift")
else:
    print("○ Already present")

# ─── Register in bundle ────────────────────────────────────────────────────
b = BUNDLE.read_text()
if "DailyVerseHomeWidget()" not in b:
    b = b.replace(
        "DailyOverviewWidget()",
        "DailyOverviewWidget()\n        DailyVerseHomeWidget()",
        1
    )
    BUNDLE.write_text(b)
    print("✓ Registered DailyVerseHomeWidget in bundle")
else:
    print("○ Already registered")
