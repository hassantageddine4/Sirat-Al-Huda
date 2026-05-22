// src/pages/PlaceholderScreen.jsx
// Reusable placeholder for practice modules that aren't fully built yet.
// Renders a clean screen with back navigation, title, and coming-soon state.

import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Icon from "../components/common/Icon";

const MODULE_META = {
  "wudu"    : { title: "Wudu Guide",          icon: "droplet", desc: "Step-by-step purification guide before prayer." },
  "duas"    : { title: "Daily Duas",           icon: "duaBook", desc: "Morning, evening, and situational supplications." },
  "names"   : { title: "99 Names of Allah",   icon: "sparkle", desc: "Learn and reflect on the beautiful names of Allah." },
  "routine" : { title: "Daily Routine",       icon: "sunrise", desc: "Build and track your daily acts of worship." },
  "hadith"  : { title: "Hadith Collection",   icon: "book", desc: "Read and reflect on authentic hadith." },
  "prophets": { title: "Prophets & Imams",    icon: "star", desc: "Stories and lessons from the lives of the prophets." },
  "surah"   : { title: "Surah Reader",        icon: "bookOpen", desc: "Read and listen to the full surah." },
  "juz"     : { title: "Juz Reader",          icon: "bookOpen", desc: "Read this Juz with translation." },
  "progress": { title: "My Progress",        icon: "checklist", desc: "Track your streaks and achievements over time." },
};

export default function PlaceholderScreen() {
  const navigate  = useNavigate();
  const { module } = useParams();
  const location  = useLocation();

  // Allow passing title/desc via location state OR derive from module param
  const meta = MODULE_META[module] ?? {
    title: location.state?.title ?? "Coming Soon",
    icon : location.state?.icon  ?? "star",
    desc : location.state?.desc  ?? "This feature is coming in a future update.",
  };

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div
        className="flex-shrink-0 pt-safe"
        style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #1A5C44 100%)" }}
      >
        <div className="flex items-center px-4 py-3 gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center press rounded-full bg-white/10"
          >
            <span className="text-white text-xl">‹</span>
          </button>
          <p className="text-white font-bold text-lg flex-1 text-center">{meta.title}</p>
          <div className="w-10" />
        </div>
      </div>

      {/* Body */}
      <div className="scroll-area flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, rgba(15,61,46,0.1), rgba(15,61,46,0.05))", border: "1px solid rgba(15,61,46,0.12)" }}
        >
          <Icon name={meta.icon} size={48} />
        </div>
        <h2 className="text-ink text-2xl font-black mb-3">{meta.title}</h2>
        <p className="text-muted text-base leading-relaxed mb-8">{meta.desc}</p>
        <div
          className="px-5 py-2.5 rounded-full border"
          style={{ borderColor: "rgba(15,61,46,0.2)", background: "rgba(15,61,46,0.05)" }}
        >
          <p className="text-primary text-sm font-semibold">Coming in next update</p>
        </div>
      </div>
    </div>
  );
}
