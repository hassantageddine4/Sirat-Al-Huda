#!/usr/bin/env python3
"""
configure_push_capabilities.py
------------------------------
Adds the Push Notifications + Background Modes (remote-notification)
capabilities to the iOS Capacitor project — the same thing Xcode does
when you click "+ Capability" twice.

What this changes:
  1. ios/App/App/App.entitlements   <- aps-environment = development
  2. ios/App/App/Info.plist         <- UIBackgroundModes += remote-notification
  3. ios/App/App.xcodeproj/project.pbxproj:
       - CODE_SIGN_ENTITLEMENTS in App target's Debug + Release configs
       - PBXFileReference for App.entitlements
       - App.entitlements added to the "App" group's children

Idempotent. Every touched file is copied to .push-setup-backups/ first.
"""

import hashlib
import plistlib
import re
import shutil
import sys
from pathlib import Path

ROOT         = Path.home() / "Downloads" / "sirat-capacitor-3"
APP_DIR      = ROOT / "ios" / "App" / "App"
PBXPROJ      = ROOT / "ios" / "App" / "App.xcodeproj" / "project.pbxproj"
ENTITLEMENTS = APP_DIR / "App.entitlements"
INFOPLIST    = APP_DIR / "Info.plist"
BACKUP_DIR   = ROOT / ".push-setup-backups"

BUNDLE_ID = "com.tageddine.siratalhuda"


def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Preconditions + backups
# ---------------------------------------------------------------------------
def check_preconditions():
    if not ROOT.exists():        fail(f"Project not found: {ROOT}")
    if not PBXPROJ.exists():     fail(f"pbxproj not found: {PBXPROJ}")
    if not INFOPLIST.exists():   fail(f"Info.plist not found: {INFOPLIST}")


def backup_files():
    BACKUP_DIR.mkdir(exist_ok=True)
    for p in (PBXPROJ, INFOPLIST, ENTITLEMENTS):
        if p.exists():
            shutil.copy2(p, BACKUP_DIR / p.name)


# ---------------------------------------------------------------------------
# 1) Entitlements
# ---------------------------------------------------------------------------
def update_entitlements():
    data = {}
    if ENTITLEMENTS.exists():
        try:
            with open(ENTITLEMENTS, "rb") as f:
                data = plistlib.load(f)
        except Exception:
            data = {}
    if data.get("aps-environment") == "development":
        return "already configured"
    data["aps-environment"] = "development"
    with open(ENTITLEMENTS, "wb") as f:
        plistlib.dump(data, f)
    return "wrote aps-environment=development"


# ---------------------------------------------------------------------------
# 2) Info.plist
# ---------------------------------------------------------------------------
def update_info_plist():
    with open(INFOPLIST, "rb") as f:
        plist = plistlib.load(f)
    bg = plist.get("UIBackgroundModes", [])
    if "remote-notification" in bg:
        return "already configured"
    bg.append("remote-notification")
    plist["UIBackgroundModes"] = bg
    with open(INFOPLIST, "wb") as f:
        plistlib.dump(plist, f)
    return "added remote-notification background mode"


# ---------------------------------------------------------------------------
# 3) project.pbxproj
# ---------------------------------------------------------------------------
def gen_uuid(seed):
    return hashlib.md5(seed.encode()).hexdigest()[:24].upper()


def update_pbxproj():
    text = PBXPROJ.read_text()
    original = text
    actions = []

    # ---- 3A. CODE_SIGN_ENTITLEMENTS in App target's XCBuildConfiguration blocks
    # Match each XCBuildConfiguration block; only modify ones whose
    # PRODUCT_BUNDLE_IDENTIFIER equals the App bundle (skip widget configs).
    config_re = re.compile(
        r"(\w{24}) /\* (\w+) \*/ = \{\s*\n\s*isa = XCBuildConfiguration;.*?\n\s*\};",
        re.DOTALL,
    )

    def maybe_add_entitlements(match):
        block = match.group(0)
        if f"PRODUCT_BUNDLE_IDENTIFIER = {BUNDLE_ID};" not in block:
            return block  # not the App target's config
        if "CODE_SIGN_ENTITLEMENTS" in block:
            return block
        return re.sub(
            r"(buildSettings = \{\s*\n)",
            r"\1\t\t\t\tCODE_SIGN_ENTITLEMENTS = App/App.entitlements;\n",
            block,
            count=1,
        )

    text = config_re.sub(maybe_add_entitlements, text)
    if text != original and "CODE_SIGN_ENTITLEMENTS = App/App.entitlements" in text:
        actions.append("added CODE_SIGN_ENTITLEMENTS to App target build configs")

    # ---- 3B. PBXFileReference for App.entitlements
    file_ref_uuid = None
    if "App.entitlements */ = {isa = PBXFileReference" not in text:
        # Generate a stable UUID; collision-check just in case
        candidate = gen_uuid("sirat-app-entitlements-fileref-v1")
        i = 0
        while candidate in text:
            i += 1
            candidate = gen_uuid(f"sirat-app-entitlements-fileref-v1-{i}")
        file_ref_uuid = candidate

        ref_line = (
            f"\t\t{file_ref_uuid} /* App.entitlements */ = "
            f"{{isa = PBXFileReference; lastKnownFileType = text.plist.entitlements; "
            f'path = App.entitlements; sourceTree = "<group>"; }};'
        )
        before = text
        text = re.sub(
            r"(/\* Begin PBXFileReference section \*/\n)",
            r"\1" + ref_line + "\n",
            text,
            count=1,
        )
        if text != before:
            actions.append(f"added PBXFileReference for App.entitlements ({file_ref_uuid})")

    # ---- 3C. Add file ref to the "App" group's children
    if file_ref_uuid:
        # Match the App group (the one with `path = App;`)
        group_re = re.compile(
            r"(\w{24} /\* App \*/ = \{\s*\n\s*isa = PBXGroup;\s*\n\s*children = \(\n)"
            r"((?:[^)]*?))"
            r"(\s*\);\s*\n\s*path = App;)",
            re.DOTALL,
        )

        def add_to_group(m):
            start, children, end = m.group(1), m.group(2), m.group(3)
            if "App.entitlements" in children:
                return m.group(0)
            return start + children + f"\t\t\t\t{file_ref_uuid} /* App.entitlements */,\n" + end

        before = text
        text = group_re.sub(add_to_group, text)
        if text != before:
            actions.append("added App.entitlements to App group children")
        else:
            actions.append("WARNING: couldn't find App group — file ref added but not grouped")

    if text != original:
        PBXPROJ.write_text(text)

    return actions or ["already configured"]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    check_preconditions()
    backup_files()
    print(f"Backups → {BACKUP_DIR.relative_to(ROOT)}/")
    print()

    print(f"✓ App.entitlements: {update_entitlements()}")
    print(f"✓ Info.plist:       {update_info_plist()}")

    print(f"✓ project.pbxproj:")
    for a in update_pbxproj():
        print(f"    {a}")

    print()
    print("Now run your build sequence:")
    print()
    print("  cd ~/Downloads/sirat-capacitor-3 && npm run build && sed -i '' "
          "'s/objectVersion = 70;/objectVersion = 60;/g' "
          "ios/App/App.xcodeproj/project.pbxproj && npx cap sync ios")
    print()
    print("Verify it worked:")
    print("  plutil -p ios/App/App/App.entitlements")
    print("  grep -c CODE_SIGN_ENTITLEMENTS ios/App/App.xcodeproj/project.pbxproj")
    print("  # ^ should print 2 (Debug + Release)")
    print()
    print("If anything looks broken, restore:")
    print(f"  cp .push-setup-backups/project.pbxproj ios/App/App.xcodeproj/project.pbxproj")
    print(f"  cp .push-setup-backups/Info.plist      ios/App/App/Info.plist")


if __name__ == "__main__":
    main()
