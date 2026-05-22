# Sirat Al Huda — Auth Fix + App Icon Setup

Production-ready fixes for:
1. iOS simulator white-screen on auth callback
2. Missing/broken app icon
3. Deep link routing for `sirat://`

---

## 1 · The auth white-screen problem (root cause)

When a user signs up or signs in via OAuth/magic link, Supabase opens an
authentication URL in Safari, the user authenticates, then Supabase redirects to
the `redirectTo` URL with auth tokens in the query string or URL hash.

If `redirectTo` doesn't match a URL scheme your app has registered with iOS:
- Safari opens — the user sees Supabase's "redirecting…" page forever
- Or iOS shows a blank tab that fails to navigate
- Or your app launches but never sees the tokens → **white screen**

**The fix has four parts**, all of which must line up perfectly:

| Layer | What | File |
| ----- | ---- | ---- |
| iOS | Register `sirat://` as a URL scheme the app handles | `ios/App/App/Info.plist` |
| Capacitor | Tell the runtime to expect deep links | `capacitor.config.json` |
| Client code | Listen for `appUrlOpen`, parse tokens, set session | `src/services/deepLinkHandler.js` |
| Supabase | Tell the dashboard which redirect URLs are allowed | dashboard config |

---

## 2 · Files to install

All files live in the zip and the project folder. Place them at these paths:

```
sirat-capacitor/
├── capacitor.config.json                              ← REPLACE
├── ios/App/App/Info.plist                             ← REPLACE
├── src/main.jsx                                       ← REPLACE
├── src/services/authService.js                        ← REPLACE
├── src/services/deepLinkHandler.js                    ← NEW
├── src/pages/AuthCallback.jsx                         ← NEW
└── ios/App/App/Assets.xcassets/AppIcon.appiconset/    ← NEW (icons)
```

Then add the route to `App.jsx`:

```jsx
import AuthCallback from "./pages/AuthCallback";
// inside <Routes>:
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 3 · Install the Capacitor plugins

```bash
npm install @capacitor/app @capacitor/browser
npx cap sync ios
```

`@capacitor/app` provides the `appUrlOpen` listener; `@capacitor/browser` opens
the in-app Safari sheet for OAuth flows so the deep link can come back to us.

---

## 4 · Configure Supabase Auth

In your Supabase dashboard → **Authentication** → **URL Configuration**:

**Site URL** (single value):
```
sirat://auth/callback
```

**Redirect URLs** (allowlist — add ALL of these):
```
sirat://auth/callback
sirat://auth/callback/*
http://localhost:5173/auth/callback
http://localhost:5173/**
https://your-production-domain.com/auth/callback
```

The wildcard form `sirat://auth/callback/*` is required so OAuth providers can
append `?code=...` to the URL.

**Email templates** — for the verification, magic link, and recovery templates,
make sure the link uses `{{ .ConfirmationURL }}` (Supabase substitutes the
correct redirect URL automatically based on the redirectTo you pass in code).

---

## 5 · Install the app icon

The icon set is at `resources/ios-appicon-set/` (or download
`ios-appicon-set.zip` and unzip it).

### Option A — Drag and drop (fastest)

1. Open Xcode: `npx cap open ios`
2. In the left sidebar, expand **App → App → Assets.xcassets**
3. Right-click on the existing `AppIcon` entry and choose **Delete** → **Move to Trash**
4. Drag the entire `ios-appicon-set/` folder from Finder into the Assets.xcassets pane
5. Rename the dragged folder from `ios-appicon-set` to `AppIcon`

### Option B — Copy via terminal

```bash
# From your project root
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
cp resources/ios-appicon-set/* \
   ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

Then in Xcode, click each AppIcon slot once to refresh the asset catalogue.

---

## 6 · Build and verify

```bash
npm run build
npx cap sync ios
npx cap open ios
```

In Xcode:
1. Select your team in **Signing & Capabilities**
2. Pick an iPhone 16 Pro simulator
3. Hit **▶ Cmd+R**

When the simulator boots, swipe up to see the home screen — the Sirat Al Huda
icon should appear with the prayer mat artwork.

---

## 7 · Verifying the deep link works

In the simulator's safari, paste:
```
sirat://auth/callback?code=test
```

If the URL scheme is registered correctly, iOS will offer to open the URL in
Sirat Al Huda. Tap **Open**. The app should launch (or come to foreground) and
you'll see in the Xcode console:

```
[auth-deep-link] Registering Capacitor App.appUrlOpen listener
[auth-deep-link] appUrlOpen received sirat://auth/callback?code=test
[auth-deep-link] Exchanging code for session
[auth-deep-link] exchangeCodeForSession failed: ...   ← expected for a fake code
```

That sequence confirms:
- The scheme is registered
- The listener is wired
- URL parsing works
- Supabase code exchange fires

For a **real** OAuth or magic link sign-in, the same flow happens but
`exchangeCodeForSession` succeeds and you get a `Session established` log line.

---

## 8 · Debugging the auth flow live

The deep link handler exposes its in-memory log for debugging:

```js
import { getDeepLinkLog } from './services/deepLinkHandler';
console.log(getDeepLinkLog());
```

You can wire this to a hidden Settings → Debug screen so you can see exactly
what happened during a failed sign-in, including which URL was received,
which tokens were parsed, and any Supabase errors.

---

## 9 · Common pitfalls

**White screen but no log lines fire** → URL scheme is not registered. Check
Info.plist `CFBundleURLSchemes` includes `sirat`. After editing Info.plist,
run `npx cap sync ios` and **delete the simulator app first** before reinstalling
— iOS caches URL scheme registrations.

**Log shows callback received but no session** → The redirect URL in your
Supabase dashboard doesn't match. Add `sirat://auth/callback` to the
Redirect URLs allowlist.

**Magic link from email opens Safari, not the app** → The email template is
hard-coded to a web URL. In Supabase dashboard → Email Templates → check that
the template uses `{{ .ConfirmationURL }}` and not a hardcoded `https://...`.

**OAuth flow opens external Safari app instead of in-app browser** → You're
calling `signInWithOAuth` without `skipBrowserRedirect: true`. The auth
service in this fix does this correctly.

**Icon doesn't appear after install** → Xcode caches asset catalogues. In
Xcode menu → **Product → Clean Build Folder (Shift+Cmd+K)**, then rebuild.
Also delete the app from the simulator's home screen first.

---

## 10 · Production checklist

- [ ] `Info.plist` has `CFBundleURLSchemes: [sirat]`
- [ ] `capacitor.config.json` has `iosScheme: "sirat"` under `server`
- [ ] All 15 icon sizes present in `AppIcon.appiconset`
- [ ] Supabase dashboard has `sirat://auth/callback` in Redirect URLs allowlist
- [ ] Email templates use `{{ .ConfirmationURL }}` not hard-coded URLs
- [ ] `npx cap sync ios` run after every config change
- [ ] Tested on real iPhone (not just simulator) — push notification
      certificates and some URL scheme behaviours differ
- [ ] DMARC/SPF/DKIM configured on email sender domain (separate fix)
