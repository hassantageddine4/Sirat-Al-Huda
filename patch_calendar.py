#!/usr/bin/env python3
"""
Patches src/pages/IslamicCalendar.jsx to add the interactive checklist
to the DaySheet:

  1. Updates the EVENTS import to also bring in WEEKLY_EVENTS
  2. Adds an import for eventCompletions helpers
  3. Replaces the entire DaySheet function with a new version that renders
     RecommendationsChecklist below each event with recommendations
  4. Appends 3 new helper components: EventCardWithChecklist,
     RecommendationsChecklist, PracticeRow, TraditionTag
"""

import os
import sys

PATH = os.path.expanduser(
    "~/Downloads/sirat-capacitor-3/src/pages/IslamicCalendar.jsx"
)

NEW_DAYSHEET = '''function DaySheet({ day, onClose }) {
  const g = day.gregorian, h = day.hijri;

  // Yearly events keyed by Hijri month + day
  const yearlyEvs = EVENTS.filter(e => e.month === Number(h.month.number) && e.day === Number(h.day));

  // Weekly events keyed by Gregorian day-of-week (e.g. Friday)
  const dayOfWeek = new Date(g.year, g.month - 1, g.day).getDay();
  const weeklyEvs = WEEKLY_EVENTS.filter(e => e.dayOfWeek === dayOfWeek);

  const evs = [...yearlyEvs, ...weeklyEvs];

  useEffect(() => {
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
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.hairline }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: C.ink }}>
            {monthName(g.month)} {g.day}, {g.year}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, color: C.goldDark, marginTop: 4 }}>
            {h.day} {h.month.en} {h.year} AH
          </div>
        </div>
        {evs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: C.muted, fontSize: 13 }}>
            No notable Islamic events recorded for this day.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {evs.map((e, i) => (
              <EventCardWithChecklist key={e.id || i} event={e} dateKey={dateKey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCardWithChecklist({ event, dateKey }) {
  const hasChecklist = !!(event.id && event.recommendations && event.recommendations.length > 0);
  const [state, setState] = useState(() => hasChecklist ? getEventCompletions(event.id, dateKey) : {});

  function toggle(practiceId) {
    const next = toggleCompletion(event.id, dateKey, practiceId);
    setState(next);
  }

  const completed = hasChecklist ? event.recommendations.filter(r => state[r.id]).length : 0;
  const total = hasChecklist ? event.recommendations.length : 0;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "16px 18px",
      border: `1.5px solid ${SECT_COLOR[event.sect]}`,
    }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: event.sect === "both" ? 0 : 4 }}>
        {event.name}
      </div>
      {event.sect !== "both" && (
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: SECT_COLOR[event.sect], textTransform: "uppercase" }}>
          {SECT_LABEL[event.sect]}
        </div>
      )}
      {event.description && (
        <div style={{ fontSize: 13, color: C.body, lineHeight: 1.55, marginTop: 6 }}>{event.description}</div>
      )}
      {hasChecklist && (
        <RecommendationsChecklist
          recommendations={event.recommendations}
          state={state}
          onToggle={toggle}
          completed={completed}
          total={total}
          pct={pct}
        />
      )}
    </div>
  );
}

function RecommendationsChecklist({ recommendations, state, onToggle, completed, total, pct }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ borderTop: `0.5px solid ${C.hairline}`, margin: "14px 0 12px" }} />
      <div style={{
        fontFamily: "Fraunces, serif", fontSize: 10, color: C.muted,
        textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 10,
      }}>
        Recommended Practices
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, color: C.body, fontWeight: 500 }}>
          Today's deeds
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 12, color: C.goldDark, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {completed} of {total} completed
        </div>
      </div>
      <div style={{ height: 5, background: C.hairline, borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
          transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)", borderRadius: 999,
        }} />
      </div>
      <div>
        {recommendations.map(r => (
          <PracticeRow
            key={r.id}
            recommendation={r}
            checked={!!state[r.id]}
            onToggle={() => onToggle(r.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PracticeRow({ recommendation: r, checked, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: "flex", gap: 12, padding: "12px 8px", borderRadius: 10,
      cursor: "pointer", userSelect: "none", WebkitTapHighlightColor: "transparent",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
        border: `1.5px solid ${checked ? C.goldDark : C.subtle}`,
        background: checked ? C.goldDark : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s, border-color 0.2s",
      }}>
        {checked && (
          <div style={{
            width: 10, height: 5, borderLeft: "2px solid white", borderBottom: "2px solid white",
            transform: "rotate(-45deg) translateY(-1px)",
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            fontFamily: "Fraunces, serif", fontSize: 14.5, fontWeight: 500, lineHeight: 1.35,
            color: checked ? C.muted : C.ink,
            textDecoration: checked ? "line-through" : "none",
            textDecorationColor: C.subtle, textDecorationThickness: "1px",
          }}>
            {r.title}
          </div>
          <TraditionTag tradition={r.tradition} />
        </div>
        <div style={{
          fontSize: 12.5, lineHeight: 1.5, marginTop: 4,
          color: checked ? C.subtle : C.body,
        }}>
          {r.description}
        </div>
        <div style={{
          fontFamily: "Fraunces, serif", fontSize: 11, fontStyle: "italic", marginTop: 6,
          color: checked ? C.subtle : C.goldDark,
        }}>
          {r.source}
        </div>
      </div>
    </div>
  );
}

function TraditionTag({ tradition }) {
  const colors = {
    both:  { color: C.goldDark, border: C.gold,     bg: "rgba(200, 169, 81, 0.10)" },
    sunni: { color: C.primary,  border: C.primary,  bg: "rgba(15, 61, 46, 0.06)"   },
    shia:  { color: C.goldDark, border: C.goldDark, bg: "rgba(168, 135, 48, 0.10)" },
  };
  const labels = { both: "Both", sunni: "Sunni", shia: "Shia" };
  const c = colors[tradition] || colors.both;
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 999, border: `1px solid ${c.border}`,
      color: c.color, background: c.bg, flexShrink: 0,
    }}>
      {labels[tradition]}
    </div>
  );
}'''

OLD_DAYSHEET_START = "function DaySheet({ day, onClose }) {"

def main():
    with open(PATH) as f:
        text = f.read()

    # 1. Update EVENTS import → add WEEKLY_EVENTS
    old_imp = 'import { EVENTS } from "../data/islamicEvents";'
    new_imp = 'import { EVENTS, WEEKLY_EVENTS } from "../data/islamicEvents";'
    if old_imp in text:
        text = text.replace(old_imp, new_imp)
        print("  ✓ EVENTS import updated")
    elif new_imp in text:
        print("  • EVENTS import already updated")
    else:
        print("  ✗ EVENTS import line not found — aborting")
        sys.exit(1)

    # 2. Add eventCompletions import (if not present)
    completions_imp = 'import { gregorianDateKey, getEventCompletions, toggleCompletion } from "../services/eventCompletions";'
    if completions_imp not in text:
        # Insert after the islamicEvents import line
        text = text.replace(new_imp, new_imp + "\n" + completions_imp)
        print("  ✓ eventCompletions import added")
    else:
        print("  • eventCompletions import already present")

    # 3. Find the start of the existing DaySheet function
    start_idx = text.find(OLD_DAYSHEET_START)
    if start_idx == -1:
        print("  ✗ DaySheet function not found — aborting")
        sys.exit(1)

    # Find the matching closing brace by tracking brace depth
    depth = 0
    i = start_idx
    end_idx = -1
    in_string = False
    in_template = False
    string_char = None
    while i < len(text):
        ch = text[i]
        prev = text[i-1] if i > 0 else ""
        # Track string/template state to avoid counting braces inside them
        if not in_string and not in_template:
            if ch == '"' or ch == "'":
                in_string = True
                string_char = ch
            elif ch == "`":
                in_template = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end_idx = i + 1
                    break
        elif in_string:
            if ch == string_char and prev != "\\":
                in_string = False
                string_char = None
        elif in_template:
            if ch == "`" and prev != "\\":
                in_template = False
        i += 1

    if end_idx == -1:
        print("  ✗ Could not locate end of DaySheet function — aborting")
        sys.exit(1)

    print(f"  • Existing DaySheet: chars {start_idx}–{end_idx} ({end_idx - start_idx} chars)")

    # 4. Replace the old DaySheet with the new content (DaySheet + 4 helpers)
    text = text[:start_idx] + NEW_DAYSHEET + text[end_idx:]
    print(f"  ✓ DaySheet + helpers (EventCardWithChecklist, RecommendationsChecklist, PracticeRow, TraditionTag) installed")

    with open(PATH, "w") as f:
        f.write(text)

    print("\nDone. Rebuild to see the checklist live.")

if __name__ == "__main__":
    main()
