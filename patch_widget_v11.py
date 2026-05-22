#!/usr/bin/env python3
"""
1. Flips Daily Verse lock-screen layout: reference on top, verse below.
2. Removes the in-app Widget Themes tile + route (now configured natively
   via long-press → Edit Widget).
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
APP = ROOT / "src/App.jsx"
PROFILE = ROOT / "src/pages/Profile.jsx"

# ─── 1. Swap verse layout order ────────────────────────────────────────────
src = LSW.read_text()
OLD = '''            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 1) {
                    Text(entry.verse.english)
                        .font(.system(size: 17, weight: .bold))
                        .lineLimit(3)
                        .minimumScaleFactor(0.55)
                        .multilineTextAlignment(.leading)
                    Text(entry.verse.reference)
                        .font(.system(size: 13, weight: .bold))
                        .widgetAccentable()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)'''

NEW = '''            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 1) {
                    Text(entry.verse.reference)
                        .font(.system(size: 12, weight: .bold))
                        .widgetAccentable()
                    Text(entry.verse.english)
                        .font(.system(size: 16, weight: .semibold))
                        .lineLimit(3)
                        .minimumScaleFactor(0.6)
                        .multilineTextAlignment(.leading)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Flipped Daily Verse layout (reference on top)")
else:
    print("⚠ verse pattern not matched — may already be flipped", file=sys.stderr)

# ─── 2. Remove Widget Themes tile from Profile.jsx ─────────────────────────
prof = PROFILE.read_text()
TILE_RE = re.compile(
    r'\n\s*<RowItem[^>]*?navigate\("/account/widget-themes"\)[^>]*?/>',
    re.DOTALL
)
m = TILE_RE.search(prof)
if m:
    prof = prof[:m.start()] + prof[m.end():]
    PROFILE.write_text(prof)
    print("✓ Removed Widget Themes tile from Profile.jsx")
else:
    print("○ Widget Themes tile not found in Profile.jsx (already removed?)")

# ─── 3. Remove route + import from App.jsx ─────────────────────────────────
app = APP.read_text()
new_app = app
# Remove the route line
new_app = re.sub(
    r'\n\s*<Route path="/account/widget-themes"[^/]*/>',
    '',
    new_app
)
# Remove the import line
new_app = re.sub(
    r"\nimport WidgetThemes from ['\"]\./pages/account/WidgetThemes['\"];",
    '',
    new_app
)
if new_app != app:
    APP.write_text(new_app)
    print("✓ Removed Widget Themes route + import from App.jsx")
else:
    print("○ App.jsx already cleaned")
