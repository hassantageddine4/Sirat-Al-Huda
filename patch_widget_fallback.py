#!/usr/bin/env python3
"""
Hardcodes Detroit defaults INTO the widget's PrayerData.load() so the widget
always shows prayer times, regardless of whether the App Group has data.
JS pushes still work — they just override the defaults.
"""
import pathlib, sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/Sirat Al huda widget/WidgetCore.swift"
if not P.exists():
    print(f"ERROR: {P} not found", file=sys.stderr)
    sys.exit(1)

src = P.read_text()

# Patch 1: replace lat/lon defaults with Detroit fallback
OLD1 = '''        let lat = d?.double(forKey: "prayer_lat") ?? 0
        let lon = d?.double(forKey: "prayer_lon") ?? 0
        let methodStr = d?.string(forKey: "prayer_method") ?? ""'''

NEW1 = '''        // Always fall back to Detroit, MI if no config is available — guarantees
        // the widget shows prayer times even before app/plugin push anything.
        var lat = d?.double(forKey: "prayer_lat") ?? 0
        var lon = d?.double(forKey: "prayer_lon") ?? 0
        if lat == 0 && lon == 0 {
            lat = 42.3314
            lon = -83.0458
        }
        let methodStr = d?.string(forKey: "prayer_method") ?? "NorthAmerica"'''

# Patch 2: remove the early return when lat/lon are 0 (no longer possible)
OLD2 = '''        // ─── Prayer times (require lat/lon) ──────────────────────────────
        guard lat != 0 || lon != 0 else {
            return PrayerData(
                prayers: [], location: location, branch: branch,
                hijriDay: hComps.day ?? 0, hijriMonthName: hMonthName,
                hijriYear: hComps.year ?? 0, hasData: false
            )
        }

        let coords = Coordinates(latitude: lat, longitude: lon)'''

NEW2 = '''        // (lat/lon are always non-zero now thanks to Detroit fallback above)
        let coords = Coordinates(latitude: lat, longitude: lon)'''

count = 0
if OLD1 in src:
    src = src.replace(OLD1, NEW1, 1)
    count += 1
    print("✓ Patched lat/lon defaults")
else:
    print("⚠ Pattern 1 not found (already patched or different)", file=sys.stderr)

if OLD2 in src:
    src = src.replace(OLD2, NEW2, 1)
    count += 1
    print("✓ Removed early-return guard")
else:
    print("⚠ Pattern 2 not found (already patched or different)", file=sys.stderr)

if count:
    P.write_text(src)
    print(f"Wrote {P}")
else:
    print("No changes")
