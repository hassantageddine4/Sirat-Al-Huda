#!/usr/bin/env python3
"""
- Removes the branch (Sunni/Shia) pill from all home-screen widgets.
- Adds a new Daily Verse lock-screen widget (rectangular + inline).
"""
import pathlib, sys

BASE = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget"
PW = BASE / "PrayerWidgets.swift"
LSW = BASE / "LockScreenWidgets.swift"
BUNDLE = BASE / "Sirat_Al_huda_widgetBundle.swift"

for p in (PW, LSW, BUNDLE):
    if not p.exists():
        print(f"ERROR: {p} not found", file=sys.stderr)
        sys.exit(1)

# ─── 1. Remove BranchPill from PrayerWidgets.swift ─────────────────────────
src = PW.read_text()

# (a) Small layout header
A_OLD = '''            HStack {
                SectionLabel(text: "Next Prayer", theme: t)
                Spacer()
                BranchPill(text: entry.data.branchLabel, theme: t)
            }'''
A_NEW = '''            SectionLabel(text: "Next Prayer", theme: t)'''

# (b) Medium NextPrayer header
B_OLD = '''                HStack {
                    SectionLabel(text: "Next Prayer", theme: t)
                    Spacer()
                    BranchPill(text: entry.data.branchLabel, theme: t)
                }'''
B_NEW = '''                SectionLabel(text: "Next Prayer", theme: t)'''

# (c) DailyPrayers header
C_OLD = '''                        HStack {
                            SectionLabel(text: "Today's Prayers", theme: t)
                            Spacer()
                            BranchPill(text: entry.data.branchLabel, theme: t)
                        }'''
C_NEW = '''                        SectionLabel(text: "Today's Prayers", theme: t)'''

# (d) DailyOverview right column
D_OLD = '''                        VStack(alignment: .trailing, spacing: 4) {
                            BranchPill(text: entry.data.branchLabel, theme: t)
                            if !entry.data.hijriDateString.isEmpty {
                                Text(entry.data.hijriDateString)
                                    .font(.system(size: 9, weight: .medium))
                                    .foregroundColor(t.mutedText)
                            }
                        }'''
D_NEW = '''                        if !entry.data.hijriDateString.isEmpty {
                            Text(entry.data.hijriDateString)
                                .font(.system(size: 9, weight: .medium))
                                .foregroundColor(t.mutedText)
                        }'''

removed = 0
for old, new, label in [(A_OLD, A_NEW, "small"), (B_OLD, B_NEW, "medium NextPrayer"),
                          (C_OLD, C_NEW, "DailyPrayers"), (D_OLD, D_NEW, "DailyOverview")]:
    if old in src:
        src = src.replace(old, new, 1)
        removed += 1
        print(f"✓ Removed BranchPill from {label}")
    else:
        print(f"○ {label}: pattern not found (already removed?)")
PW.write_text(src)

# ─── 2. Append Daily Verse lock-screen widget to LockScreenWidgets.swift ───
lsw_src = LSW.read_text()
VERSE_BLOCK = '''

// ─── Daily Verse Lock Screen Widget ────────────────────────────────────────

struct DailyVerseLockEntry: TimelineEntry {
    let date: Date
    let verse: Verse
}

struct DailyVerseLockProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyVerseLockEntry {
        DailyVerseLockEntry(date: Date(), verse: VerseBank.today())
    }
    func getSnapshot(in context: Context, completion: @escaping (DailyVerseLockEntry) -> Void) {
        completion(DailyVerseLockEntry(date: Date(), verse: VerseBank.today()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyVerseLockEntry>) -> Void) {
        let now = Date()
        let entry = DailyVerseLockEntry(date: now, verse: VerseBank.today())
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.startOfDay(for: now)) ?? now.addingTimeInterval(86400)
        completion(Timeline(entries: [entry], policy: .after(tomorrow)))
    }
}

struct DailyVerseLockView: View {
    var entry: DailyVerseLockEntry
    @Environment(\\.widgetFamily) var family

    var body: some View {
        Group {
            switch family {
            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 1) {
                    Text(entry.verse.english)
                        .font(.system(size: 12, weight: .medium))
                        .lineLimit(3)
                        .minimumScaleFactor(0.85)
                        .multilineTextAlignment(.leading)
                    Text(entry.verse.reference)
                        .font(.system(size: 9, weight: .bold))
                        .widgetAccentable()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            case .accessoryInline:
                Text("\\(entry.verse.english) — \\(entry.verse.reference)")
            default:
                EmptyView()
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

struct DailyVerseLockWidget: Widget {
    let kind = "DailyVerseLockWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyVerseLockProvider()) { entry in
            DailyVerseLockView(entry: entry)
        }
        .configurationDisplayName("Daily Verse")
        .description("A Qur\\u{2019}an reflection on your Lock Screen.")
        .supportedFamilies([.accessoryRectangular, .accessoryInline])
    }
}
'''

if "DailyVerseLockWidget" not in lsw_src:
    LSW.write_text(lsw_src + VERSE_BLOCK)
    print("✓ Appended DailyVerseLockWidget to LockScreenWidgets.swift")
else:
    print("○ DailyVerseLockWidget already present")

# ─── 3. Register in bundle ──────────────────────────────────────────────────
b = BUNDLE.read_text()
if "DailyVerseLockWidget()" not in b:
    b = b.replace(
        "LockScreenPrayerWidget()",
        "LockScreenPrayerWidget()\n        DailyVerseLockWidget()",
        1
    )
    BUNDLE.write_text(b)
    print("✓ Registered DailyVerseLockWidget in bundle")
else:
    print("○ DailyVerseLockWidget already in bundle")
