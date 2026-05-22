import os, sys
p = os.path.expanduser('~/Downloads/sirat-capacitor-3/src/pages/IslamicCalendar.jsx')
t = open(p).read()

# 1. Add Sheet import (after the first import block)
if 'from "../components/common/Sheet"' not in t:
    lines = t.split('\n')
    last_import = -1
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
    lines.insert(last_import + 1, 'import Sheet from "../components/common/Sheet";')
    t = '\n'.join(lines)
    print("✓ Sheet import added")

# 2. Replace the DaySheet body — drop body-overflow useEffect, drop wrapper divs,
# use <Sheet open onClose>.

old = '''  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const dateKey = gregorianDateKey(g);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.ivory, width: "100%", maxWidth: 520,
        borderRadius: "24px 24px 0 0", padding: "20px 20px 32px",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)",
        maxHeight: "85vh", overflowY: "auto", overscrollBehavior: "contain", touchAction: "pan-y",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.hairline }} />
        </div>'''

new = '''  const dateKey = gregorianDateKey(g);

  return (
    <Sheet open={true} onClose={onClose} background={C.ivory}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.hairline }} />
        </div>'''

if old in t:
    t = t.replace(old, new)
    print("✓ DaySheet body rewired through <Sheet>")
else:
    print("✗ Couldn't match DaySheet body — abort")
    sys.exit(1)

# Now the closing — there were 2 nested closing </div>s before the function's closing brace
# Old structure ended:
#     ...event cards...
#     </div>  <-- inner scroll wrapper
#   </div>    <-- backdrop
# }
#
# New structure ends:
#     ...event cards...
#   </Sheet>
# }

old_close = '''        )}
      </div>
    </div>
  );
}

function EventCardWithChecklist'''

new_close = '''        )}
    </Sheet>
  );
}

function EventCardWithChecklist'''

if old_close in t:
    t = t.replace(old_close, new_close)
    print("✓ DaySheet closing tags rewired")
else:
    print("✗ Couldn't match DaySheet closing — review needed")
    sys.exit(1)

open(p, 'w').write(t)
print("\nDone.")
