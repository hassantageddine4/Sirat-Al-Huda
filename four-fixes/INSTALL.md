# Sirat — Four Fixes Bundle

Four small fixes in one bundle:

1. **Weekly Progress overlap fixed** — chart container expanded from 80px to 100px height with reserved space for top number row, so numbers no longer overlap with the bars.
2. **Prayer Notifications row moved** from "App" section to "Permissions" section in Profile → Settings tab.
3. **Quick Access added back to Home** at the bottom — 2x2 grid of tiles for Quran, Dhikr, Duas, Journal.
4. **Privacy Policy + Terms of Service updates**:
   - Removed "Service Providers" section (section 4) from Privacy Policy
   - Renumbered remaining sections (5→4, 6→5, etc.)
   - Replaced custom Terms of Service entirely with Apple EULA reference

## Files in this bundle

```
src/
├── pages/
│   ├── Home.jsx                          ← Quick Access added at bottom
│   ├── Profile.jsx                       ← Weekly chart fixed, Prayer Notifications moved
│   └── legal/
│       ├── PrivacyPolicy.jsx             ← Service providers removed
│       └── TermsOfService.jsx            ← Replaced with Apple EULA only
```

## Install

```bash
cp -R ~/Downloads/four-fixes/src/ ~/Downloads/sirat-capacitor-3/
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode → Cmd+Q → reopen → Shift+Cmd+K → delete app from phone → Cmd+R.

## Smoke test

After install:

1. **Home → scroll to bottom** — should see "Quick Access" section with 4 tiles (Quran, Dhikr, Duas, Journal). Tap each → navigates to its respective screen.

2. **Profile → Overview tab → Weekly Progress** — numbers above the bars should have clear vertical space, no overlap with the bar tops.

3. **Profile → Settings tab** — App section should only contain "Language" now. Permissions section should have 4 rows: Prayer Notifications (toggle), Location (status badge), Notifications (status badge), Microphone (status badge).

4. **Profile → Settings → scroll to Legal section → Privacy Policy** — Section 4 should now be "Data retention", not "Service providers". Total numbered sections: 1-10.

5. **Profile → Settings → Legal → Terms of Service** — should be a brief one-section page that just points to Apple's EULA URL. No more "Acceptable use", "Community guidelines", "Limitation of liability", etc.

If anything breaks (build error or visual regression), paste the error and I'll patch.
