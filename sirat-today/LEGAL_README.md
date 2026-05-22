# Sirat — Legal, Permissions, and App Store Readiness

Production-ready legal screens, native iOS permission handling, and the configuration needed for App Store submission.

---

## What's in this bundle

```
src/services/permissionsService.js              ← unified API over native plugins
src/hooks/usePermissionFlow.js                  ← orchestrates explainer → native → denied
src/components/legal/
  PermissionExplainer.jsx                       ← pre-prompt sheet (HIG-compliant)
  PermissionDenied.jsx                          ← "Open Settings" sheet
  SettingsLegalSection.jsx                      ← drop into Settings.jsx
  AuthLegalFooter.jsx                           ← drop into SignIn / SignUp
  LegalDocLayout.jsx                            ← shared chrome for legal docs
src/pages/legal/
  TermsOfService.jsx
  PrivacyPolicy.jsx
INFO_PLIST_USAGE.md                             ← REQUIRED Info.plist strings
APP_ROUTES_PATCH.md                             ← routes to add to App.jsx
```

---

## Install order

1. **Install Capacitor permission plugins:**
   ```bash
   npm install @capacitor/geolocation @capacitor/local-notifications @capacitor/browser @capacitor/app
   npm install @capacitor-community/speech-recognition
   ```

2. **Add Info.plist usage strings** — see `INFO_PLIST_USAGE.md`. **App Store will reject without these.**

3. **Drop in the JSX files** following the directory structure above.

4. **Add routes** — see `APP_ROUTES_PATCH.md`.

5. **Hook up Settings**:
   ```jsx
   import SettingsLegalSection from "../components/legal/SettingsLegalSection";
   // inside your Settings.jsx render:
   <SettingsLegalSection />
   ```

6. **Hook up Auth screens**:
   ```jsx
   import AuthLegalFooter from "../components/legal/AuthLegalFooter";
   // inside SignIn.jsx:
   <AuthLegalFooter context="signin" />
   // inside SignUp.jsx:
   <AuthLegalFooter context="signup" />
   ```

7. **Wire up permissions where used:**
   ```jsx
   import { usePermissionFlow } from "../hooks/usePermissionFlow";

   function QiblaCompass() {
     const flow = usePermissionFlow();

     return (
       <>
         <button onClick={() =>
           flow.request("location", {
             onGranted: () => startCompass(),
           })
         }>
           Find qibla
         </button>

         {flow.element}
       </>
     );
   }
   ```

8. **Build & sync:**
   ```bash
   rm -rf dist ios/App/App/public node_modules/.vite
   npm run build && npx cap sync ios
   ```

---

## How the permission flow works

```
User taps feature
      ↓
flow.request("location", { onGranted })
      ↓
Already granted?  ──Yes──→  call onGranted, done
      ↓ No
Already denied?   ──Yes──→  show "Open Settings" sheet
      ↓ No
Show explainer sheet
      ↓ User taps Continue
Native iOS popup appears
      ↓
Granted?  ──→  call onGranted
Denied?   ──→  show "Open Settings" sheet
```

This matches Apple's HIG:
- ✅ Explainer is a screen, not a popup imitating the system one
- ✅ Native popup is triggered after explicit user consent
- ✅ Denied state offers Settings deep link (since iOS won't re-prompt)

Where to use each permission:
- **Location** → QiblaCompass, prayer-time setup
- **Notifications** → when user enables prayer reminders in Settings
- **Microphone + Speech** → recitation practice feature
- **Camera** → profile photo upload (if/when you add it)

---

## What still needs your action before App Store submission

1. **Update SUPPORT_EMAIL** in:
   - `src/components/legal/SettingsLegalSection.jsx`
   - `src/pages/legal/TermsOfService.jsx`
   - `src/pages/legal/PrivacyPolicy.jsx`

2. **Host the legal docs publicly** — Apple requires a privacy policy URL at submission time. Options:
   - Host the markdown content at `https://sirat.app/privacy` and `https://sirat.app/terms`
   - Or use a service like Termly which gives you a hosted URL plus an in-app embed

3. **Have a lawyer review the templates.** The text covers Apple's requirements and common patterns (data collection, retention, GDPR-style rights), but it is not a substitute for legal review for your specific jurisdiction.

4. **Update `LAST_UPDATED`** dates in TermsOfService.jsx and PrivacyPolicy.jsx whenever you make material changes.

5. **Apple Sign In** — if you support any third-party sign-in (Google, Facebook), Apple requires you to also offer Sign in with Apple. The legal docs reference this — make sure your auth screens reflect it.

6. **Privacy nutrition label** — fill out the App Privacy questionnaire in App Store Connect using the table in `INFO_PLIST_USAGE.md` as a starting point.

---

## Apple HIG compliance checklist

- [x] No custom popup imitates the iOS system permission alert
- [x] Permissions requested contextually (when feature is used), not on launch
- [x] Each permission has an Info.plist usage description string
- [x] Apple Standard EULA linked from Settings
- [x] Privacy Policy + Terms accessible from Settings AND auth screens
- [x] External links open in system browser (Safari) via Capacitor Browser
- [x] Account deletion path documented (mentioned in Privacy Policy section 5)
- [x] Settings deep link for denied permissions (`app-settings:`)

---

## Notes on Sign in with Apple

If your SignIn / SignUp screens currently offer Google or any third-party
provider as the **only** social sign-in option, App Store Review Guideline
4.8 requires you to also offer Sign in with Apple. The Supabase auth client
supports it directly:

```js
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: { redirectTo: REDIRECT_URL },
});
```

You'll also need to enable Sign in with Apple in your Apple Developer
account and configure the Service ID in Supabase Auth.
