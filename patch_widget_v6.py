#!/usr/bin/env python3
"""
- Adds two new widget themes (beige, forest) to WidgetCore.swift.
- Copies WidgetThemes.jsx into src/pages/account/.
- Patches App.jsx to import and route the new page.
- Patches Profile.jsx to add a "Widget Themes" tile.
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
WC = ROOT / "ios/App/Sirat Al huda widget/WidgetCore.swift"
APP = ROOT / "src/App.jsx"
PROFILE = ROOT / "src/pages/Profile.jsx"
DEST_JSX = ROOT / "src/pages/account/WidgetThemes.jsx"
SRC_JSX = pathlib.Path.home() / "Downloads/WidgetThemes.jsx"

for p in (WC, APP, PROFILE):
    if not p.exists():
        print(f"ERROR: {p} not found", file=sys.stderr); sys.exit(1)

# ─── 1. WidgetCore.swift: add beige + forest themes ────────────────────────
src = WC.read_text()

# (a) enum: append cases
OLD_ENUM = "    case emerald, sapphire, royal, crimson, gold, midnight, silver, teal, sandstone"
NEW_ENUM = "    case emerald, sapphire, royal, crimson, gold, midnight, silver, teal, sandstone, beige, forest"
if OLD_ENUM in src:
    src = src.replace(OLD_ENUM, NEW_ENUM, 1)
    print("✓ Added beige + forest to WidgetThemeKey enum")
elif "case beige" not in src:
    print("⚠ Enum pattern not found — please add cases manually", file=sys.stderr)

# (b) palettes
PALETTE_BLOCK = '''        case .beige:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.96, green: 0.91, blue: 0.81),
                bgBottom: Color(red: 0.85, green: 0.76, blue: 0.60),
                accent: Color(red: 0.16, green: 0.40, blue: 0.24),
                accentSoft: Color(red: 0.28, green: 0.55, blue: 0.36),
                primaryText: Color(red: 0.10, green: 0.18, blue: 0.13),
                mutedText: Color(red: 0.32, green: 0.38, blue: 0.30),
                glassFill: Color.white.opacity(0.45),
                glassStroke: Color.white.opacity(0.55)
            )
        case .forest:
            return WidgetTheme(
                key: key,
                bgTop: Color(red: 0.15, green: 0.42, blue: 0.25),
                bgBottom: Color(red: 0.06, green: 0.22, blue: 0.13),
                accent: Color(red: 0.93, green: 0.86, blue: 0.62),
                accentSoft: Color(red: 0.98, green: 0.92, blue: 0.75),
                primaryText: .white,
                mutedText: Color.white.opacity(0.55),
                glassFill: Color.white.opacity(0.08),
                glassStroke: Color.white.opacity(0.18)
            )
'''

ANCHOR = "    static func of(_ key: WidgetThemeKey) -> WidgetTheme {"
if ANCHOR in src and ".beige" not in src:
    start = src.find(ANCHOR)
    switch_kw = src.find("switch key {", start)
    if switch_kw != -1:
        i = switch_kw + len("switch key {")
        depth = 1
        while i < len(src) and depth > 0:
            if src[i] == "{": depth += 1
            elif src[i] == "}": depth -= 1
            i += 1
        switch_close = i - 1
        line_start = src.rfind("\n", 0, switch_close) + 1
        src = src[:line_start] + PALETTE_BLOCK + src[line_start:]
        print("✓ Added beige + forest palettes to WidgetTheme.of()")
elif ".beige" in src:
    print("○ Palettes already present")
else:
    print("⚠ Anchor not found for palettes", file=sys.stderr)

WC.write_text(src)

# ─── 2. Copy WidgetThemes.jsx ──────────────────────────────────────────────
if not SRC_JSX.exists():
    print(f"ERROR: download WidgetThemes.jsx to {SRC_JSX} first", file=sys.stderr); sys.exit(1)
DEST_JSX.parent.mkdir(parents=True, exist_ok=True)
shutil.copy(SRC_JSX, DEST_JSX)
print(f"✓ Copied WidgetThemes.jsx → {DEST_JSX}")

# ─── 3. Patch App.jsx ──────────────────────────────────────────────────────
app_src = APP.read_text()
if "WidgetThemes" not in app_src:
    lines = app_src.split("\n")
    out = []
    added_import = added_route = False
    for line in lines:
        out.append(line)
        if not added_import and ("from './pages/account/" in line or 'from "./pages/account/' in line):
            out.append("import WidgetThemes from './pages/account/WidgetThemes';")
            added_import = True
        if not added_route and 'path="/account/' in line and "Route" in line:
            indent = re.match(r"(\s*)", line).group(1)
            out.append(f'{indent}<Route path="/account/widget-themes" element={{<WidgetThemes />}} />')
            added_route = True
    if added_import and added_route:
        APP.write_text("\n".join(out))
        print("✓ Added import and route to App.jsx")
    else:
        print(f"⚠ App.jsx: import={added_import}, route={added_route}. Manual fix needed.", file=sys.stderr)
else:
    print("○ App.jsx already wired")

# ─── 4. Patch Profile.jsx (tile after madhab) ──────────────────────────────
prof_src = PROFILE.read_text()
if "/account/widget-themes" not in prof_src:
    pattern = re.compile(r'(navigate\("/account/madhab"\)\}[^/]*?/>)', re.DOTALL)
    m = pattern.search(prof_src)
    if m:
        end = m.end()
        new_tile = '\n                <RowItem iconName="settings" label="Widget Themes" sub="Customize home & lock screen colors" onPress={() => navigate("/account/widget-themes")} />'
        prof_src = prof_src[:end] + new_tile + prof_src[end:]
        PROFILE.write_text(prof_src)
        print("✓ Added Widget Themes tile to Profile.jsx")
    else:
        print("⚠ Profile.jsx: madhab anchor not found. Add tile manually.", file=sys.stderr)
else:
    print("○ Profile already has tile")
