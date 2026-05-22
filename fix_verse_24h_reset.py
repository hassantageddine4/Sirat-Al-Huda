#!/usr/bin/env python3
"""Add guaranteed 24h reset for Verse of the Day:
 - Dedicated dayKey state, ticked every 60s + on app resume.
 - When the calendar date flips, the verse useEffect re-fires automatically.
 - Falls back gracefully if @capacitor/app isn't installed.
Run AFTER fix_verse_card.py.
"""
import pathlib

HOME   = pathlib.Path.home()
HOMEJS = HOME / "Downloads/sirat-capacitor-3/src/pages/Home.jsx"

def read(p):     return p.read_text(encoding="utf-8")
def write(p, s): p.write_text(s, encoding="utf-8")

def backup(p):
    bak = p.with_suffix(p.suffix + ".verse24.bak")
    if not bak.exists():
        bak.write_text(read(p), encoding="utf-8")
        print(f"  backup → {bak.name}")

print("→ Patching Home.jsx — adding 24h reset machinery")
backup(HOMEJS)
home = read(HOMEJS)

# Already patched?
if "const [verseDayKey, setVerseDayKey]" in home:
    print("  ✓ 24h reset machinery already present")
    raise SystemExit(0)

# ── 1. Replace the inline _verseDayKey computation with a stateful version
OLD_BLOCK = """  // Load daily verse from service — re-runs whenever the calendar date changes
  const _verseDayKey = new Date().toDateString();
  useEffect(() => {"""

NEW_BLOCK = """  // Day key — flips at local midnight, on app resume, and every 60s. Drives
  // the verse useEffect below so a new verse appears every 24h reliably,
  // even if the app stays open across midnight.
  const [verseDayKey, setVerseDayKey] = useState(() => new Date().toDateString());
  useEffect(() => {
    const tick = () => {
      const k = new Date().toDateString();
      setVerseDayKey(prev => (prev === k ? prev : k));
    };
    const id = setInterval(tick, 60_000);
    let appHandle;
    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        appHandle = await App.addListener("appStateChange", ({ isActive }) => {
          if (isActive) tick();
        });
      } catch {}
    })();
    return () => {
      clearInterval(id);
      appHandle?.remove?.();
    };
  }, []);

  // Load daily verse from service — re-runs whenever the day flips
  useEffect(() => {"""

if OLD_BLOCK in home:
    home = home.replace(OLD_BLOCK, NEW_BLOCK, 1)
    print("  ✓ dayKey state + tick interval + app resume listener added")
else:
    print("  ⚠ Existing _verseDayKey block not found — run fix_verse_card.py first")
    raise SystemExit(1)

# ── 2. Update the verse useEffect's dep array from _verseDayKey → verseDayKey
if "  }, [_verseDayKey]);" in home:
    home = home.replace("  }, [_verseDayKey]);", "  }, [verseDayKey]);", 1)
    print("  ✓ verse useEffect now depends on stateful verseDayKey")
else:
    print("  ⚠ dep array `}, [_verseDayKey]);` not found")

write(HOMEJS, home)
print("\n✓ Done.")
print("  Build: cd ~/Downloads/sirat-capacitor-3 && npm run build && npx cap sync ios 2>&1 | tail -3")
