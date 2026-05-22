#!/usr/bin/env python3
"""
Adds a pushWidgetConfig call inside usePrayerNotifications.js so the widget
gets location + method + madhab + branch every time prayer times are fetched.
"""
import re
import pathlib
import sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/src/hooks/usePrayerNotifications.js"

if not P.exists():
    print(f"ERROR: file not found: {P}", file=sys.stderr)
    sys.exit(1)

src = P.read_text()
original = src

# ─── 1. Ensure pushWidgetConfig is imported ─────────────────────────────────
if "pushWidgetConfig" not in src:
    # Replace existing siratWidget import to include pushWidgetConfig
    pattern = re.compile(
        r"import\s+\{\s*([^}]*?)\s*\}\s+from\s+['\"]([^'\"]*siratWidget[^'\"]*)['\"]\s*;"
    )
    m = pattern.search(src)
    if m:
        imports = m.group(1)
        path = m.group(2)
        names = [n.strip() for n in imports.split(",") if n.strip()]
        if "pushWidgetConfig" not in names:
            names.append("pushWidgetConfig")
        new_import = "import { " + ", ".join(names) + " } from '" + path + "';"
        src = src[: m.start()] + new_import + src[m.end():]
        print("✓ Added pushWidgetConfig to existing siratWidget import")
    else:
        # No existing import → add one at the top of the file (after first import line)
        first_import = re.search(r"^import\s+.*?;\s*$", src, re.MULTILINE)
        if first_import:
            insert_at = first_import.end()
            new_line = "\nimport { pushWidgetConfig } from '@/lib/siratWidget';"
            src = src[:insert_at] + new_line + src[insert_at:]
            print("✓ Inserted new siratWidget import")
        else:
            print("⚠ Could not find any import to anchor to. Skipping.", file=sys.stderr)
else:
    print("✓ pushWidgetConfig already imported")

# ─── 2. Add the pushWidgetConfig(…) call near the existing widget push ──────
if "pushWidgetConfig(" not in src:
    # Find the existing pushPrayerTimesToWidget call as our anchor
    anchor = re.search(
        r"([ \t]*)pushPrayerTimesToWidget\s*\([^)]*\)\s*;",
        src
    )
    if anchor:
        indent = anchor.group(1)
        block = (
            f"{indent}try {{\n"
            f"{indent}  pushWidgetConfig({{\n"
            f"{indent}    lat: typeof location?.lat === 'number' ? location.lat : undefined,\n"
            f"{indent}    lon: typeof location?.lon === 'number' ? location.lon : undefined,\n"
            f"{indent}    method: prefs?.calcMethod != null ? String(prefs.calcMethod) : undefined,\n"
            f"{indent}    methodCode: typeof prefs?.calcMethod === 'number' ? prefs.calcMethod : undefined,\n"
            f"{indent}    madhab: prefs?.madhab != null ? String(prefs.madhab) : 'Shafi',\n"
            f"{indent}    branch: (typeof localStorage !== 'undefined' ? localStorage.getItem('sirat_branch') : null) || 'sunni',\n"
            f"{indent}    locationName: location?.name || location?.city || '',\n"
            f"{indent}  }});\n"
            f"{indent}}} catch (_e) {{ /* widget push best-effort */ }}\n"
        )
        src = src[: anchor.start()] + block + src[anchor.start():]
        print("✓ Inserted pushWidgetConfig call before pushPrayerTimesToWidget")
    else:
        print("⚠ Could not find pushPrayerTimesToWidget anchor. Manually add a call.", file=sys.stderr)
else:
    print("✓ pushWidgetConfig call already present")

if src == original:
    print("No changes needed.")
else:
    P.write_text(src)
    print(f"Patched: {P}")
