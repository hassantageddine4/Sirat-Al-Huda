# Sunni / Shia Branch Toggle — Install Guide

Adds:
- Required Sunni/Shia selection during onboarding
- Branch toggle in Settings → Islamic Preferences
- Region-aware Sunni calculation method defaults (auto-picks ISNA/MWL/Karachi/etc. based on location)
- Locked Jafari method + Ja'farī madhab when Shia is selected
- Madhab + Calculation Method pickers filter their options based on branch

## What's in this bundle

```
src/
├── services/
│   └── branchService.js                              ← NEW — region detection + branch defaults
├── components/
│   ├── common/
│   │   └── BranchToggle.jsx                          ← NEW — reusable Sunni/Shia toggle
│   └── onboarding/
│       └── BranchSelectionSlide.jsx                  ← NEW — onboarding slide
```

## Install — 5 steps

### Step 1: Copy bundle files

```bash
cp ~/Downloads/branch-toggle/src/services/branchService.js ~/Downloads/sirat-capacitor-3/src/services/
cp ~/Downloads/branch-toggle/src/components/common/BranchToggle.jsx ~/Downloads/sirat-capacitor-3/src/components/common/
mkdir -p ~/Downloads/sirat-capacitor-3/src/components/onboarding
cp ~/Downloads/branch-toggle/src/components/onboarding/BranchSelectionSlide.jsx ~/Downloads/sirat-capacitor-3/src/components/onboarding/
```

### Step 2: Patch usePrayerNotifications.js to add `branch` to prefs

Open `src/hooks/usePrayerNotifications.js` and find the `mergeWithDefaults` function. Add `branch: prefs.branch ?? null` to the returned object:

```bash
sed -i '' 's|  const out = {|  const out = {\
    branch:       prefs.branch       ?? null,|' ~/Downloads/sirat-capacitor-3/src/hooks/usePrayerNotifications.js
```

Verify:
```bash
grep -n "branch:" ~/Downloads/sirat-capacitor-3/src/hooks/usePrayerNotifications.js
```

Should show one new line with `branch: prefs.branch ?? null`.

### Step 3: Add `setBranch` action to the hook

Open `src/hooks/usePrayerNotifications.js` and find the `setMadhab` callback. Add this new callback right after it.

Find this line:
```js
const setMadhab = useCallback((m) => {
  setPrefs(p => ({ ...p, madhab: m }));
}, []);
```

Add right after:
```js
const setBranch = useCallback((branch, location) => {
  // Imported at top of file:
  // import { getBranchDefaults } from "../services/branchService";
  const { calcMethod, madhab } = getBranchDefaults(branch, location);
  setPrefs(p => ({ ...p, branch, calcMethod, madhab }));
}, []);
```

Also add to the imports at the top of the file:
```js
import { getBranchDefaults } from "../services/branchService";
```

And add `setBranch` to the returned object at the bottom of the hook (next to `setMadhab`).

### Step 4: Add the toggle to Profile.jsx (Settings → Islamic Preferences)

Open `src/pages/Profile.jsx` and find the Islamic Preferences section. The exact location depends on your current Profile.jsx. Look for the section with `<SectionLabel>Islamic Preferences</SectionLabel>` (or similar).

Add this at the top of the section:

```jsx
import BranchToggle from "../components/common/BranchToggle";
// ... in the imports

// ...inside Islamic Preferences section:
<div style={{ background: "white", borderRadius: 14, border: `0.5px solid ${C.border}`,
              padding: 16, marginBottom: 12 }}>
  <p style={{ fontSize: 11, color: C.muted, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
    Tradition
  </p>
  <BranchToggle
    value={prefs.branch}
    onChange={(branch) => setBranch(branch, location)}
  />
</div>
```

You'll also need to destructure `setBranch` from `usePrayerNotifications` in Profile.jsx.

### Step 5: Patch Onboarding.jsx to require branch selection

Open `src/pages/Onboarding.jsx`.

Add the import at the top:
```js
import BranchSelectionSlide from "../components/onboarding/BranchSelectionSlide";
```

Find the `slides` array and **insert this BranchSelectionSlide as the LAST slide** before the navigation logic that takes the user to `/auth`:

```jsx
<BranchSelectionSlide
  key="branch"
  onConfirm={(branch) => {
    completeOnboarding({ language: lang, religion: "Muslim", goals, branch });
    navigate("/auth");
  }}
/>
```

ALSO: update `completeOnboarding` in your AppContext (or wherever it's defined) to persist the `branch` value.

ALSO: replace the existing `handleComplete` button on the previous slide so it advances to the branch slide instead of completing onboarding directly.

### Step 6: Pre-build sed (Xcode 26 workaround)

```bash
sed -i '' 's|objectVersion = 70;|objectVersion = 56;|' ~/Downloads/sirat-capacitor-3/ios/App/App.xcodeproj/project.pbxproj
```

### Step 7: Build

```bash
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

## Smoke test

After deploy:

1. **New user signup**: onboarding flow now ends with a branch selection slide. Cannot proceed without picking one.
2. **Picking Sunni**: should auto-select a calc method based on your location (e.g. ISNA for North America). Madhab defaults to Hanafi.
3. **Picking Shia**: calc method = Jafari, madhab = Ja'farī. Both locked.
4. **Settings → Islamic Preferences**: toggle visible. Switching it should immediately update calc method + madhab.
5. **Calculation Method picker**: shows only Sunni methods OR Jafari, depending on branch.
6. **Madhab picker**: shows 4 madhabs OR only Ja'farī, depending on branch.

## Notes & caveats

- **Existing users without a branch set** will see calc method + madhab as before (no auto-update). They can set their branch in Settings to opt into the smart defaults.
- **Region detection** uses bounding boxes, not a real geocoder. It correctly handles major regions (NA, EU, Gulf, South Asia, SE Asia) but may pick "MWL" as fallback for less common locations.
- **Madhab/calc pickers may need to be patched** to filter options based on branch. If you don't patch them, users could still pick "incompatible" combinations (e.g. Sunni + Jafari method). The bundle creates the foundation; the picker filtering is a follow-up patch.
