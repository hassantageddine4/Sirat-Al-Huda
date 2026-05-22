# Sirat — Calculation Method + Madhab Pickers

Two new picker pages so the Calculation Method and Madhab rows in Profile → Settings → Islamic Preferences open dedicated pages instead of just showing inline pill buttons.

## What's in the bundle

```
src/
├── pages/
│   ├── Profile.jsx                                  ← Inline pills replaced with chevron rows
│   └── account/
│       ├── CalculationMethodPicker.jsx              ← NEW (14 calculation methods)
│       └── MadhabPicker.jsx                         ← NEW (4 madhabs)
```

## Install

### Step 1: Copy the files

```bash
cp -R ~/Downloads/calc-madhab-pages/src/ ~/Downloads/sirat-capacitor-3/
```

### Step 2: Add 2 new routes to App.jsx

Add these imports near the top of `src/App.jsx`:

```js
import CalculationMethodPicker from "./pages/account/CalculationMethodPicker";
import MadhabPicker            from "./pages/account/MadhabPicker";
```

Add these `<Route>` entries inside the `<Routes>` block:

```jsx
<Route path="/account/calculation-method" element={<CalculationMethodPicker />} />
<Route path="/account/madhab"             element={<MadhabPicker />} />
```

### Step 3: Build

```bash
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode → Cmd+Q → reopen → Shift+Cmd+K → delete app from phone → Cmd+R.

## Smoke test

1. **Profile → Settings tab → Islamic Preferences section.** The Calculation Method and Madhab rows should now look like every other row — icon, label, current value as subtitle, chevron on the right.

2. **Tap "Calculation Method"** → opens a dedicated page with:
   - Brief explanation banner at top
   - All 14 methods listed with their full names + a one-line description of where each is used
   - Current selection has a green checkmark
   - Tap any → goes back, value updates

3. **Tap "Madhab (Asr calculation)"** → opens a dedicated page with:
   - Brief explanation banner ("affects Asr only")
   - 4 madhabs (Hanafi, Shafi'i, Maliki, Hanbali) with explanation of each
   - Hanafi notes shadow length difference
   - Tap any → goes back, value updates

## What this depends on

The picker pages call `usePrayerNotifications()` to get `prefs`, `setCalcMethod`, `setMadhab`, `CALC_METHODS`, and `MADHABS`. These are the same hook bindings the old inline pills used, so if those worked before, the new pickers will work too.

## Notes

- Old pill UI is fully replaced — no fallback to switch back. If you preferred the inline pills, you'd revert by checking out an earlier Profile.jsx.
- Madhab picker shows 4 options even though only 2 actually differ for Asr (Hanafi vs. everyone else). All 4 still work because each maps to the correct Aladhan API parameter — Shafi'i/Maliki/Hanbali all send `school=0`, Hanafi sends `school=1`.
