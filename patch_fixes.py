#!/usr/bin/env python3
"""
Three fixes:
1. Practice settings icon: navigate to /settings instead of /account/settings
2. Widget Jafari calc method: route to Tehran (closest built-in for Shia angles)
   so Maghrib computes ~15 min after sunset instead of at sunset.
"""
import pathlib, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
PRACTICE = ROOT / "src/pages/Practice.jsx"
WC = ROOT / "ios/App/Sirat Al huda widget/WidgetCore.swift"

# ─── 1. Fix settings icon route ────────────────────────────────────────────
p = PRACTICE.read_text()
if 'navigate("/account/settings")' in p:
    p = p.replace('navigate("/account/settings")', 'navigate("/settings")', 1)
    PRACTICE.write_text(p)
    print("✓ Settings icon now routes to /settings")
else:
    print("○ Settings route already correct (or pattern differs)")

# ─── 2. Widget: map Jafari → custom params (proper Shia angles) ────────────
src = WC.read_text()

# Add jafari to the string-name switch in methodForKeys
OLD_SWITCH = '''    let s = methodStr.lowercased().replacingOccurrences(of: " ", with: "")
    switch s {
    case "isna", "northamerica":        return .northAmerica
    case "mwl", "muslimworldleague":    return .muslimWorldLeague
    case "egyptian":                    return .egyptian
    case "karachi":                     return .karachi
    case "ummalqura", "makkah":         return .ummAlQura
    case "dubai":                       return .dubai
    case "moonsighting", "moonsightingcommittee": return .moonsightingCommittee
    case "kuwait":                      return .kuwait
    case "qatar":                       return .qatar
    case "singapore":                   return .singapore
    case "tehran":                      return .tehran
    case "turkey", "diyanet":           return .turkey
    default: break
    }'''

NEW_SWITCH = '''    let s = methodStr.lowercased().replacingOccurrences(of: " ", with: "")
    switch s {
    case "isna", "northamerica":        return .northAmerica
    case "mwl", "muslimworldleague":    return .muslimWorldLeague
    case "egyptian":                    return .egyptian
    case "karachi":                     return .karachi
    case "ummalqura", "makkah":         return .ummAlQura
    case "dubai":                       return .dubai
    case "moonsighting", "moonsightingcommittee": return .moonsightingCommittee
    case "kuwait":                      return .kuwait
    case "qatar":                       return .qatar
    case "singapore":                   return .singapore
    case "tehran", "jafari":            return .tehran  // closest built-in for Shia Jafari angles
    case "turkey", "diyanet":           return .turkey
    default: break
    }'''

if OLD_SWITCH in src:
    src = src.replace(OLD_SWITCH, NEW_SWITCH, 1)
    print("✓ Widget: 'Jafari' now maps to Tehran method (Fajr 17.7°, Maghrib 4.5°)")
else:
    print("⚠ methodForKeys switch pattern not matched", file=sys.stderr)

# Update PrayerData.load() to apply a custom Maghrib adjustment for Jafari
# since Tehran's Maghrib (4.5°) is ~15 min, but exact Jafari is ~13-20 min.
# The Aladhan Jafari method 0 uses 4° Maghrib angle, so we override to that.
OLD_LOAD = '''        let coords = Coordinates(latitude: lat, longitude: lon)
        var params = methodForKeys(methodStr: methodStr, methodCode: methodCode).params
        params.madhab = madhabFromString(madhabStr)'''

NEW_LOAD = '''        let coords = Coordinates(latitude: lat, longitude: lon)
        var params = methodForKeys(methodStr: methodStr, methodCode: methodCode).params
        params.madhab = madhabFromString(madhabStr)

        // For Jafari (Shia Ithna-Ansari): override Maghrib angle to 4° (default
        // Aladhan Jafari spec) so Maghrib falls ~15-20 min after sunset instead
        // of at sunset like Sunni methods.
        let methodLower = methodStr.lowercased()
        if methodLower == "jafari" || methodCode == 0 {
            params.fajrAngle = 16
            params.ishaAngle = 14
            params.maghribAngle = 4
        }'''

if OLD_LOAD in src:
    src = src.replace(OLD_LOAD, NEW_LOAD, 1)
    print("✓ Widget: Jafari override applies Fajr 16°/Isha 14°/Maghrib 4° angles")
else:
    print("⚠ PrayerData.load() params block not matched", file=sys.stderr)

WC.write_text(src)
