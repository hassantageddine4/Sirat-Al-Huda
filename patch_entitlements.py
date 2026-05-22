#!/usr/bin/env python3
"""
Adds CODE_SIGN_ENTITLEMENTS to every buildSettings block in project.pbxproj
that references the widget's Info.plist. This wires the entitlements file
we just created into the widget target without needing the Xcode UI.
"""
import pathlib, sys

P = pathlib.Path.home() / "Downloads/sirat-capacitor-3/ios/App/App.xcodeproj/project.pbxproj"
if not P.exists():
    print(f"ERROR: {P} not found", file=sys.stderr)
    sys.exit(1)

src = P.read_text()
INFOPLIST_MARKER = 'INFOPLIST_FILE = "Sirat Al huda widget/Info.plist"'
ENTITLEMENT_LINE = '\t\t\t\tCODE_SIGN_ENTITLEMENTS = "Sirat Al huda widget/Sirat Al huda widget.entitlements";\n'

count = 0
out = []
i = 0
while True:
    idx = src.find('buildSettings = {', i)
    if idx == -1:
        out.append(src[i:])
        break
    # find end of this buildSettings block — first '\t\t\t};' after idx
    end_idx = src.find('\t\t\t};', idx)
    if end_idx == -1:
        out.append(src[i:])
        break
    block_end = end_idx + len('\t\t\t};')
    block = src[idx:block_end]
    out.append(src[i:idx])
    if INFOPLIST_MARKER in block and 'CODE_SIGN_ENTITLEMENTS' not in block:
        # Inject entitlement line right after the opening "{ "
        opener = 'buildSettings = {\n'
        if opener in block:
            block = block.replace(opener, opener + ENTITLEMENT_LINE, 1)
            count += 1
    out.append(block)
    i = block_end

new = ''.join(out)
if count:
    P.write_text(new)
    print(f"Patched {count} build configuration(s) with CODE_SIGN_ENTITLEMENTS")
else:
    print("No changes made — either already set, or marker not found.")
    # Show context for debugging
    if INFOPLIST_MARKER not in src:
        print(f"Marker not found: {INFOPLIST_MARKER}", file=sys.stderr)
        print("Try grepping for the actual widget Info.plist reference:", file=sys.stderr)
        print("  grep -n 'huda widget/Info.plist' project.pbxproj", file=sys.stderr)
