#!/usr/bin/env python3
"""
1. Adds VerseBank.todayLong() that filters to verses long enough to fill
   3 lines on the lock screen. Updates DailyVerseLockProvider to use it.
2. Force-removes any remaining Widget Themes references from Profile.jsx
   and App.jsx (with verbose verification).
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
WC = ROOT / "ios/App/Sirat Al huda widget/WidgetCore.swift"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
APP = ROOT / "src/App.jsx"
PROFILE = ROOT / "src/pages/Profile.jsx"

# ─── 1. Add VerseBank.todayLong() to WidgetCore.swift ──────────────────────
wc = WC.read_text()
if "todayLong()" not in wc:
    OLD = '''    static func today() -> Verse {
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
        return verses[(dayOfYear - 1) % verses.count]
    }
}'''
    NEW = '''    static func today() -> Verse {
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
        return verses[(dayOfYear - 1) % verses.count]
    }

    /// Returns today's verse from the subset of verses long enough to fill
    /// 3 lines on the lock screen (>= 50 chars). Different rotation than today().
    static func todayLong() -> Verse {
        let longVerses = verses.filter { $0.english.count >= 50 }
        let pool = longVerses.isEmpty ? verses : longVerses
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: Date()) ?? 1
        return pool[(dayOfYear - 1) % pool.count]
    }
}'''
    if OLD in wc:
        wc = wc.replace(OLD, NEW, 1)
        WC.write_text(wc)
        print("✓ Added VerseBank.todayLong()")
    else:
        print("⚠ VerseBank.today() pattern not found", file=sys.stderr)
else:
    print("○ todayLong() already exists")

# ─── 2. Switch DailyVerseLockProvider to use todayLong() ───────────────────
lsw = LSW.read_text()
old_count = lsw.count("VerseBank.today()")
lsw_new = lsw.replace(
    "DailyVerseLockEntry(date: Date(), verse: VerseBank.today())",
    "DailyVerseLockEntry(date: Date(), verse: VerseBank.todayLong())"
).replace(
    "DailyVerseLockEntry(date: now, verse: VerseBank.today())",
    "DailyVerseLockEntry(date: now, verse: VerseBank.todayLong())"
)
if lsw_new != lsw:
    LSW.write_text(lsw_new)
    print("✓ Lock widget now uses long verses only")
else:
    print("○ Lock widget already uses todayLong (or pattern differs)")

# ─── 3. Force-remove Widget Themes from Profile.jsx ────────────────────────
prof = PROFILE.read_text()
before = prof
# Remove the tile (multiline or single-line)
prof = re.sub(
    r'\n[ \t]*<RowItem[^>]*?navigate\("/account/widget-themes"\)[^/]*?/>',
    '',
    prof,
    flags=re.DOTALL
)
# Also catch any tile referencing widget-themes with `last` prop
prof = re.sub(
    r'\n[ \t]*<RowItem[^>]*?widget-themes[^>]*?/>',
    '',
    prof,
    flags=re.DOTALL
)
if prof != before:
    PROFILE.write_text(prof)
    print("✓ Removed Widget Themes tile from Profile.jsx")
else:
    print("○ No Widget Themes tile found in Profile.jsx")

# Verify it's actually gone
remaining = PROFILE.read_text()
if "widget-themes" in remaining:
    print("⚠⚠ STILL FOUND 'widget-themes' in Profile.jsx — manual fix needed", file=sys.stderr)
else:
    print("  ✓ Verified: no 'widget-themes' references in Profile.jsx")

# ─── 4. Force-remove route + import from App.jsx ───────────────────────────
app = APP.read_text()
before = app
app = re.sub(r'\n\s*<Route path="/account/widget-themes"[^/]*/>', '', app)
app = re.sub(r"\nimport WidgetThemes from ['\"]\./pages/account/WidgetThemes['\"];", '', app)
if app != before:
    APP.write_text(app)
    print("✓ Removed Widget Themes route + import from App.jsx")
else:
    print("○ App.jsx already clean")

if "WidgetThemes" in APP.read_text():
    print("⚠⚠ STILL FOUND 'WidgetThemes' in App.jsx", file=sys.stderr)
else:
    print("  ✓ Verified: App.jsx clean")
