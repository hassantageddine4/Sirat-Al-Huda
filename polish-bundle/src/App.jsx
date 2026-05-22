// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { setupNotificationListeners, schedulePrayerNotifications } from "./services/notificationService";
import { App as CapacitorApp } from "@capacitor/app";

import Onboarding       from "./pages/Onboarding";
import Auth             from "./pages/Auth";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Home             from "./pages/Home";
import Quran            from "./pages/Quran";
import SurahReader      from "./pages/SurahReader";
import RecitationPractice from "./pages/RecitationPractice";
import Practice         from "./pages/Practice";
import Community        from "./pages/Community";
import Profile          from "./pages/Profile";
import Journal          from "./pages/Journal";
import Settings         from "./pages/Settings";
import QiblaCompass     from "./pages/QiblaCompass";
import SurahDetail      from "./pages/SurahDetail";
import JuzDetail        from "./pages/JuzDetail";
import Progress         from "./pages/Progress";
import PlaceholderScreen from "./pages/PlaceholderScreen";

// New full screens
import PrayerGuide      from "./pages/PrayerGuide";
import WuduGuide        from "./pages/WuduGuide";
import DuasScreen       from "./pages/DuasScreen";
import IslamBasics      from "./pages/IslamBasics";
import Notifications    from "./pages/Notifications";

// Hadith
import Hadith            from "./pages/Hadith";
import HadithCollection  from "./pages/HadithCollection";
import HadithChapter     from "./pages/HadithChapter";
import HadithReader      from "./pages/HadithReader";

// Daily Routine
import DailyRoutine     from "./pages/DailyRoutine";

// 99 Names of Allah
import AsmaUlHusna      from "./pages/AsmaUlHusna";

// Prophets & Imams
import ProphetsAndImams from "./pages/ProphetsAndImams";

// Legal
import PrivacyPolicy    from "./pages/legal/PrivacyPolicy";
import TermsOfService   from "./pages/legal/TermsOfService";

import AppLayout from "./components/common/AppLayout";

function AppRoutes() {
  const { isFirstLaunch, isAuthenticated, isRestoring } = useApp();

  if (isRestoring) {
    return (
      <div className="screen items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" fill="#0F3D2E" opacity="0.6"/>
          </svg>
        </div>
        <div className="text-primary font-bold text-xl tracking-widest">SIRAT</div>
      </div>
    );
  }

  if (isFirstLaunch) {
    return <Routes><Route path="*" element={<Onboarding />} /></Routes>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth"     element={<Auth />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms"   element={<TermsOfService />} />
        <Route path="*"         element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"          element={<Home />} />
        <Route path="/quran"      element={<Quran />} />
        <Route path="/quran/:id"  element={<SurahReader />} />
        <Route path="/practice/recitation" element={<RecitationPractice />} />
        <Route path="/practice"  element={<Practice />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile"   element={<Profile />} />
      </Route>

      {/* Full-screen utility pages */}
      <Route path="/journal"         element={<Journal />} />
      <Route path="/notifications"   element={<Notifications />} />
      <Route path="/settings"        element={<Settings />} />
      <Route path="/qibla"           element={<QiblaCompass />} />
      <Route path="/progress"        element={<Progress />} />
      <Route path="/routine"         element={<DailyRoutine />} />

      {/* Quran destinations */}
      <Route path="/surah/:number" element={<SurahDetail />} />
      <Route path="/juz/:number"   element={<JuzDetail />} />

      {/* Hadith */}
      <Route path="/hadith"                                       element={<Hadith />} />
      <Route path="/hadith/:collectionId"                         element={<HadithCollection />} />
      <Route path="/hadith/:collectionId/chapter/:sectionNumber"  element={<HadithChapter />} />
      <Route path="/hadith/:collectionId/hadith/:hadithNumber"    element={<HadithReader />} />

      {/* Practice — real screens */}
      <Route path="/practice/prayer-guide"            element={<PrayerGuide />} />
      <Route path="/practice/prayer-guide/:prayerKey" element={<PrayerGuide />} />
      <Route path="/practice/wudu-guide"   element={<WuduGuide />} />
      <Route path="/practice/duas"         element={<DuasScreen />} />
      <Route path="/practice/basics"       element={<IslamBasics />} />
      <Route path="/practice/names"        element={<AsmaUlHusna />} />
      <Route path="/practice/prophets"     element={<ProphetsAndImams />} />

      {/* Legal */}
      <Route path="/legal/privacy" element={<PrivacyPolicy />} />
      <Route path="/legal/terms"   element={<TermsOfService />} />

      {/* Practice — placeholder for any module not yet built */}
      <Route path="/practice/:module"      element={<PlaceholderScreen />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function NotificationBootstrap() {
  useEffect(() => {
    setupNotificationListeners();
    schedulePrayerNotifications().catch(() => {});

    let removeListener;
    try {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (isActive) {
          const lastRaw = localStorage.getItem("sirat_notif_last_scheduled");
          if (lastRaw) {
            try {
              const { scheduledAt } = JSON.parse(lastRaw);
              const age = Date.now() - new Date(scheduledAt).getTime();
              if (age < 10 * 60 * 1000) return;
            } catch {}
          }
          schedulePrayerNotifications().catch(() => {});
        }
      }).then(handle => { removeListener = handle; });
    } catch {}

    return () => { removeListener?.remove?.(); };
  }, []);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <NotificationBootstrap />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
