import os, sys
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/pages/Home.jsx')
t = open(p).read()

# Undo the throwaway sed
t = t.replace('getDailyVerse(/* daily */)', 'getDailyVerse()')

old = '''  // Load daily verse from service
  useEffect(() => {
    let cancelled = false;
    getDailyVerse()
      .then(r => {
        if (cancelled || !r?.verse) return;
        setVerse({
          arabic:      r.verse.arabic,
          translation: r.verse.translation,
          ref:         r.verse.reference ?? r.verse.ref ?? "",
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);'''

new = '''  // Load daily verse from service — re-runs whenever the calendar date changes
  const _verseDayKey = new Date().toDateString();
  useEffect(() => {
    let cancelled = false;
    getDailyVerse()
      .then(r => {
        if (cancelled || !r?.verse) return;
        setVerse({
          arabic:      r.verse.arabic,
          translation: r.verse.translation,
          ref:         r.verse.reference ?? r.verse.ref ?? "",
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [_verseDayKey]);'''

if old in t:
    t = t.replace(old, new)
    print("✓ useEffect now re-runs on date change")
else:
    print("✗ Couldn't find the useEffect block")
    sys.exit(1)

open(p, 'w').write(t)
print("Done.")
