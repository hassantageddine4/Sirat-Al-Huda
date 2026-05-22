#!/usr/bin/env python3
"""
1. Bumps the lock-screen Daily Verse fonts further (matches prayer prominence).
2. Adds a fallback path for theme push: tries setTheme, falls back to setConfig
   in case the dedicated method isn't reaching the native plugin.
"""
import pathlib, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
LSW = ROOT / "ios/App/Sirat Al huda widget/LockScreenWidgets.swift"
SW = ROOT / "src/lib/siratWidget.js"

for p in (LSW, SW):
    if not p.exists():
        print(f"ERROR: {p} not found", file=sys.stderr); sys.exit(1)

# ─── 1. Bump verse fonts ───────────────────────────────────────────────────
src = LSW.read_text()
OLD = '''            case .accessoryRectangular:
                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.verse.english)
                        .font(.system(size: 15, weight: .semibold))
                        .lineLimit(3)
                        .minimumScaleFactor(0.6)
                        .multilineTextAlignment(.leading)
                    Text(entry.verse.reference)
                        .font(.system(size: 12, weight: .bold))
                        .widgetAccentable()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)'''

NEW = '''            case .accessoryRectangular:
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

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    LSW.write_text(src)
    print("✓ Bumped Daily Verse to 17pt bold + ref 13pt bold")
else:
    print("⚠ verse pattern not found (already bumped or different state)")

# ─── 2. Make pushWidgetTheme fall back to setConfig ────────────────────────
js = SW.read_text()
OLD_FN = '''export async function pushWidgetTheme(theme) {
  if (!isIOS()) return;
  try {
    await SiratWidget.setTheme({ theme: String(theme) });
  } catch (e) {
    console.warn('[siratWidget] setTheme failed', e);
  }
}'''

NEW_FN = '''export async function pushWidgetTheme(theme) {
  if (!isIOS()) return;
  const t = String(theme);
  // Try dedicated setTheme first; fall back to setConfig (which also writes theme).
  // Both write to the same App Group key, so either succeeding is enough.
  let ok = false;
  try {
    await SiratWidget.setTheme({ theme: t });
    ok = true;
  } catch (e) {
    console.warn('[siratWidget] setTheme failed, will try setConfig', e);
  }
  if (!ok) {
    try {
      await SiratWidget.setConfig({ theme: t });
      ok = true;
    } catch (e) {
      console.warn('[siratWidget] setConfig fallback failed', e);
    }
  }
  return ok;
}'''

if OLD_FN in js:
    js = js.replace(OLD_FN, NEW_FN, 1)
    SW.write_text(js)
    print("✓ Added setConfig fallback to pushWidgetTheme")
else:
    print("⚠ pushWidgetTheme pattern not found (already updated?)")
