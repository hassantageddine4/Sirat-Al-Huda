# Sirat — Three Fixes Bundle

Three fixes you asked for, all doable without you at your Mac:

1. **Dhikr counter rebuilt** — full picker screen + counter screen with 6 dhikr types, separate counts per dhikr, persistent
2. **Scrolling smoothness** — global CSS that makes all `.scroll-area` containers scroll natively on iOS
3. **Redirect chevrons** — every dead chevron in Profile/Settings now navigates to a real page

## Files in this bundle

```
src/
├── pages/
│   ├── Profile.jsx                          ← Updated: chevrons go to real pages
│   ├── Dhikr.jsx                            ← NEW: picker + counter
│   ├── MyProgress.jsx                       ← NEW: dedicated stats screen
│   └── account/
│       ├── EditProfile.jsx                  ← NEW
│       ├── ChangePassword.jsx               ← NEW
│       ├── LanguagePicker.jsx               ← NEW
│       └── DeleteAccount.jsx                ← NEW
└── styles/
    └── scrolling.css                        ← NEW: global scroll smoothness

APP_ROUTES_PATCH.txt                         ← Routes to add to App.jsx
```

## Install — three steps

### Step 1: Copy all files into the project

```bash
cp -R ~/Downloads/three-fixes/src/ ~/Downloads/sirat-capacitor-3/
```

### Step 2: Add 7 new routes to App.jsx

Open `src/App.jsx` in your editor. Open the file `APP_ROUTES_PATCH.txt` from this bundle.

The patch tells you to add:
- 6 new imports near the top
- 7 new `<Route>` entries inside the `<Routes>` block

Paste them in. Save.

### Step 3: Import the scrolling CSS once

Open `src/main.jsx` (or `src/index.jsx`, or wherever your app's entry point is). Add this line near the top, after your existing CSS imports:

```js
import "./styles/scrolling.css";
```

Save.

### Step 4: Build

```bash
cd ~/Downloads/sirat-capacitor-3 && rm -rf dist ios/App/App/public node_modules/.vite && npm run build && npx cap sync ios
```

Xcode → Cmd+Q → reopen → Shift+Cmd+K → delete app from phone → Cmd+R.

## Smoke test (5 things to check)

1. **Scrolling** — every screen should scroll smoothly with native iOS momentum. No janky stops, no awkward bouncing at edges.

2. **Dhikr** — navigate to `/dhikr` (you may need to add a button somewhere that goes there, or just type the URL). You should see 6 dhikr cards, each with Arabic / transliteration / English / count. Tap one → counter screen with big tap target. Tap to count, watch number go up. Reset works. Go back, count is preserved.

3. **Profile → Overview → My Progress** — opens dedicated progress screen with streak hero, 6-stat grid, achievements grid.

4. **Profile → Settings → Account section:**
   - Edit Profile → opens dedicated edit page with name field
   - Email Address → no chevron, just displays the email (not tappable)
   - Change Password → opens dedicated password change page

5. **Profile → Settings → App section → Language** → opens language picker with English selected, others showing "Coming soon"

6. **Profile → Settings → bottom → Delete Account** → opens proper deletion confirmation page with warnings and "type DELETE" gate

## Notes & caveats

### Dhikr screen is not yet wired into navigation

I built `/dhikr` as a route, but I didn't add a button on Practice or Home that takes you there. You'll need to either:
- Tap the existing "Dhikr" Quick Access tile on Home (already routes to `/practice`, you may want to change it to `/dhikr`)
- Or add a button somewhere

To change the Quick Access tile's destination, find this in Home.jsx:
```jsx
<QuickTile iconName="beads" label="Dhikr" sub="Tasbih counter" onClick={() => navigate("/practice")} />
```
And change `/practice` to `/dhikr`.

### Email row is now non-tappable

Per your "every chevron must navigate" — the email row had a chevron pointing nowhere meaningful. Rather than build an "edit email" page (which is a sensitive auth flow), I removed the chevron entirely. Email is still displayed; it's just not tappable.

### Change Password and Delete Account assume AppContext exposes helpers

The new pages try to call `useApp().changePassword(...)` and `useApp().deleteAccount(...)`. If your AppContext doesn't expose those yet, the pages fall back to:
- ChangePassword: uses `supabase.auth.updateUser({password})` directly
- DeleteAccount: signs out and shows a "deletion being processed" message

If you want the deletion to actually delete the user record from Supabase, you'll need to add a `deleteAccount` helper to your AppContext that calls `supabase.auth.admin.deleteUser(...)` from a Supabase Edge Function (since admin operations can't be done from the client SDK). That's its own session.

### Calculation method/madhab + Prayer Guide bugs

These are still in reminders. I'll get them when you're back at your Mac.
