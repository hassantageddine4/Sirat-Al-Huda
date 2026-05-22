#!/usr/bin/env python3
"""
1. Daily Verse lock widget: show ONLY the verse text, no reference (Shia+ style).
2. Make sure Widget Themes tile + route are removed from the app.
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
APP = ROOT / "src/App.jsx"
PROFILE = ROOT / "src/pages/Profile.jsx"

# ─── 1. Replace verse layout: verse only, no reference ─────────────────────
src = LSW.read_text()

# Match either v11 (reference on top) or v9 (verse on top) layouts
PATTERNS = [
    # v11 layout (reference on top, verse below)
    '''            case .accessoryRectangular:
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
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)''',
    # v9 layout (verse on top, reference below)
    '''            case .accessoryRectangular:
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
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)''',
]

NEW = '''            case .accessoryRectangular:
                Text(entry.verse.english)
                    .font(.system(size: 16, weight: .semibold))
                    .lineLimit(3)
                    .minimumScaleFactor(0.6)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)'''

replaced = False
for OLD in PATTERNS:
    if OLD in src:
        src = src.replace(OLD, NEW, 1)
        replaced = True
        break

if replaced:
    LSW.write_text(src)
    print("✓ Daily Verse lock widget: verse text only, no reference")
else:
    print("⚠ verse pattern not matched — may already be in target state", file=sys.stderr)

# ─── 2. Remove Widget Themes tile from Profile.jsx (idempotent) ────────────
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
    print("○ Tile not present (good)")

# ─── 3. Remove route + import from App.jsx (idempotent) ────────────────────
app = APP.read_text()
new_app = app
new_app = re.sub(r'\n\s*<Route path="/account/widget-themes"[^/]*/>', '', new_app)
new_app = re.sub(r"\nimport WidgetThemes from ['\"]\./pages/account/WidgetThemes['\"];", '', new_app)
if new_app != app:
    APP.write_text(new_app)
    print("✓ Removed Widget Themes route + import from App.jsx")
else:
    print("○ App.jsx already clean")
