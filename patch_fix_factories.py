#!/usr/bin/env python3
"""
Fixes JS parse errors from prior split: factory functions like shiaSalam()
that originally returned ONE step object now have TWO bare object literals
in their body. Wrap them in `return [...];` and spread at call sites.
"""
import pathlib, re, sys

ROOT = pathlib.Path.home() / "Downloads/sirat-capacitor-3"
DRAFTS = ROOT / "src/data/prayerWalkthrough/instructions_drafts"

FILES = ["jumuah.js", "eid.js", "voluntary_batch4.js", "_sharedShia.js"]

wrapped_funcs = set()

# ─── Wrap broken factory bodies ────────────────────────────────────────────
for fname in FILES:
    path = DRAFTS / fname
    if not path.exists():
        print(f"  skip: {fname} (not found)")
        continue
    src = path.read_text()
    lines = src.split("\n")
    out = []
    i = 0
    changed = False
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^(\s*)((?:export\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{)\s*$", line)
        if m and i + 1 < len(lines):
            indent = m.group(1)
            func_name = m.group(3)
            # Skip blanks then check next line is bare `{` (broken state)
            next_idx = i + 1
            while next_idx < len(lines) and lines[next_idx].strip() == "":
                next_idx += 1
            if next_idx < len(lines) and re.match(r"^\s+\{\s*$", lines[next_idx]):
                # Find matching `}` of function body via depth tracking
                body_depth = 1
                close_idx = None
                j = i + 1
                while j < len(lines):
                    body_depth += lines[j].count("{")
                    body_depth -= lines[j].count("}")
                    if body_depth == 0:
                        close_idx = j
                        break
                    j += 1
                if close_idx is not None:
                    out.append(line)
                    out.append(f"{indent}  return [")
                    for k in range(i + 1, close_idx):
                        out.append(lines[k])
                    out.append(f"{indent}  ];")
                    out.append(lines[close_idx])
                    wrapped_funcs.add(func_name)
                    changed = True
                    i = close_idx + 1
                    continue
        out.append(line)
        i += 1
    if changed:
        path.write_text("\n".join(out))
        print(f"✓ Wrapped factory in {fname}")

if not wrapped_funcs:
    print("○ No broken factories detected — maybe already fixed")
else:
    print(f"  Wrapped functions: {', '.join(sorted(wrapped_funcs))}")

# ─── Spread call sites: foo() → ...foo() (skip the definition line) ────────
for f in sorted(DRAFTS.iterdir()):
    if f.suffix != ".js":
        continue
    src = f.read_text()
    new = src
    for func in wrapped_funcs:
        # Process line by line: skip lines that DEFINE the function
        out = []
        for line in new.split("\n"):
            if re.search(r"function\s+" + func + r"\s*\(", line):
                out.append(line)
                continue
            # Replace funcName( with ...funcName( but not if already prefixed
            line = re.sub(
                r"(?<!\.\.\.)\b" + func + r"\(",
                "..." + func + "(",
                line
            )
            out.append(line)
        new = "\n".join(out)
    if new != src:
        f.write_text(new)
        print(f"  spread call sites in {f.name}")

print("✓ Done")
