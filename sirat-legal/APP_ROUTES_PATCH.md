// ─── Legal route additions for App.jsx ──────────────────────────────────────
//
// Add these imports at the top of your App.jsx alongside the other page
// imports:
//
//   import TermsOfService from "./pages/legal/TermsOfService";
//   import PrivacyPolicy  from "./pages/legal/PrivacyPolicy";
//
// Then add these routes inside your <Routes> block. They sit OUTSIDE the
// AppLayout (no bottom nav, no hamburger) so the legal docs read like
// modal screens rather than tabs.
//
//   <Route path="/legal/terms"   element={<TermsOfService />} />
//   <Route path="/legal/privacy" element={<PrivacyPolicy />} />
//
// Full example (yours may differ slightly):
//
//   <Routes>
//     {/* Legal — outside AppLayout */}
//     <Route path="/legal/terms"   element={<TermsOfService />} />
//     <Route path="/legal/privacy" element={<PrivacyPolicy />} />
//
//     {/* Auth */}
//     <Route path="/signin" element={<SignIn />} />
//     <Route path="/signup" element={<SignUp />} />
//     <Route path="/auth/callback" element={<AuthCallback />} />
//
//     {/* Main app */}
//     <Route element={<AppLayout />}>
//       <Route path="/" element={<Home />} />
//       <Route path="/quran/:id" element={<SurahReader />} />
//       <Route path="/hadith/*" element={<Hadith />} />
//       <Route path="/journal" element={<Journal />} />
//       <Route path="/routine" element={<DailyRoutine />} />
//       <Route path="/prayer-guide/:prayerKey" element={<PrayerGuide />} />
//       <Route path="/profile" element={<Profile />} />
//       <Route path="/settings" element={<Settings />} />
//     </Route>
//   </Routes>
