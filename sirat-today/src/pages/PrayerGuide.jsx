// src/pages/PrayerGuide.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Step-by-step guide for the five daily prayers.
//
// This is the canonical "no emojis" screen — every callout, marker, and
// status indicator uses the Icon library or InfoCard. Information panels
// that were previously prefixed with ℹ️ or 💡 emojis now render through
// InfoCard so the visual hierarchy stays consistent across the app.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import InfoCard from "../components/common/InfoCard";

// ─── Prayer registry ────────────────────────────────────────────────────────
const PRAYERS = {
  fajr: {
    name: "Fajr",
    arabic: "الفجر",
    rakat: 2,
    rakatLabel: "2 rak'ah",
    description: "The dawn prayer, performed before sunrise.",
    timing: "From true dawn until just before sunrise.",
  },
  dhuhr: {
    name: "Dhuhr",
    arabic: "الظهر",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The midday prayer, performed after the sun passes its zenith.",
    timing: "From shortly after solar noon until Asr.",
  },
  asr: {
    name: "Asr",
    arabic: "العصر",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The afternoon prayer, performed in the late part of the day.",
    timing: "From mid-afternoon until just before sunset.",
  },
  maghrib: {
    name: "Maghrib",
    arabic: "المغرب",
    rakat: 3,
    rakatLabel: "3 rak'ah",
    description: "The sunset prayer, performed shortly after the sun has set.",
    timing: "From just after sunset until the disappearance of twilight.",
  },
  isha: {
    name: "Isha",
    arabic: "العشاء",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The night prayer, performed after twilight has disappeared.",
    timing: "From the end of twilight until the appearance of true dawn.",
  },
};

// ─── Steps ──────────────────────────────────────────────────────────────────
const STEPS = [
  {
    title: "Niyyah (Intention)",
    arabic: "النية",
    body: "Make the intention for prayer in your heart. The intention need not be spoken aloud — sincerity and presence of mind are what matter.",
  },
  {
    title: "Takbir al-Ihram",
    arabic: "تكبيرة الإحرام",
    body: "Raise your hands to your ears (or shoulders) and say \"Allahu Akbar\" — God is greater. This marks the entry into prayer.",
  },
  {
    title: "Qiyam (Standing)",
    arabic: "القيام",
    body: "Stand with your hands placed on your chest. Recite Surah al-Fatiha, followed by another surah or passage from the Qur'an.",
  },
  {
    title: "Ruku' (Bowing)",
    arabic: "الركوع",
    body: "Say \"Allahu Akbar\" and bow with your back straight, hands on your knees. Recite \"Subhana Rabbi al-Adheem\" three times.",
  },
  {
    title: "Standing again (I'tidal)",
    arabic: "الاعتدال",
    body: "Rise from ruku' saying \"Sami' Allahu liman hamidah,\" then \"Rabbana wa lakal hamd.\"",
  },
  {
    title: "Sujud (Prostration)",
    arabic: "السجود",
    body: "Say \"Allahu Akbar\" and prostrate with seven points of contact: forehead, nose, both hands, both knees, and toes. Recite \"Subhana Rabbi al-A'la\" three times.",
  },
  {
    title: "Sitting between prostrations",
    arabic: "الجلوس",
    body: "Rise briefly to a sitting position and ask Allah for forgiveness, then prostrate a second time.",
  },
  {
    title: "Tashahhud and Salam",
    arabic: "التشهد والسلام",
    body: "After completing all rak'ah, sit for the tashahhud, send blessings on the Prophet ﷺ, and conclude with salam to the right and to the left.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PrayerGuide() {
  const { prayerKey } = useParams();
  const navigate = useNavigate();
  const prayer = PRAYERS[prayerKey];

  if (!prayer) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Prayer guide" onBack={() => navigate(-1)} />
        <div className="px-6 pt-8">
          <InfoCard variant="warning" title="Unknown prayer">
            That prayer guide isn't available. Pick a prayer from the home screen.
          </InfoCard>
        </div>
      </div>
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={prayer.name}
        subtitle={prayer.arabic}
        onBack={() => navigate(-1)}
      />

      <div className="scroll-area pb-12">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="px-6 pt-5 pb-4 text-center border-b border-border/60">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted font-semibold">
            How to perform
          </p>
          <h1 className="font-display text-3xl text-primary tracking-tight mt-1.5">
            {prayer.name}
          </h1>
          <p
            className="text-[18px] text-accent-dark mt-1"
            style={{ fontFamily: "Amiri, serif" }}>
            {prayer.arabic}
          </p>
          <p className="text-[13px] text-body mt-3 max-w-md mx-auto leading-relaxed">
            {prayer.description}
          </p>
        </section>

        {/* ── Quick facts strip ────────────────────────────────── */}
        <section className="px-4 pt-4 grid grid-cols-2 gap-3">
          <FactCard icon="prayer" label="Rak'ah" value={prayer.rakatLabel} />
          <FactCard icon="clock"  label="Time"   value="See timing below" />
        </section>

        {/* ── Timing info — InfoCard, not blue emoji ───────────── */}
        <section className="px-4 pt-4">
          <InfoCard title="When to pray">
            {prayer.timing}
          </InfoCard>
        </section>

        {/* ── Wudu reminder ────────────────────────────────────── */}
        <section className="px-4 pt-3">
          <InfoCard variant="warning" icon="alert" title="Before you begin">
            Make sure you have wudu (ritual ablution) and that you are facing
            the qibla. Cover the awrah and pray on a clean surface.
          </InfoCard>
        </section>

        {/* ── Steps ────────────────────────────────────────────── */}
        <section className="px-4 pt-5">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Icon name="bookOpen" size={14} className="text-accent-dark" />
            <h2 className="text-[11px] tracking-[0.22em] uppercase text-muted font-semibold">
              Steps
            </h2>
          </div>

          <ol className="space-y-2.5">
            {STEPS.map((step, idx) => (
              <Step key={idx} step={step} index={idx + 1} />
            ))}
          </ol>
        </section>

        {/* ── Closing tip ──────────────────────────────────────── */}
        <section className="px-4 pt-5">
          <InfoCard variant="tip" title="A note on focus">
            Khushu' — humility and presence in prayer — comes with practice.
            Pray slowly, reflect on the meaning of what you recite, and try
            to feel that you are standing before Allah.
          </InfoCard>
        </section>
      </div>
    </div>
  );
}

// ─── Bits ───────────────────────────────────────────────────────────────────
function FactCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/70 border border-border/60">
      <div className="w-8 h-8 rounded-full bg-parchment flex items-center justify-center flex-shrink-0 text-primary">
        <Icon name={icon} size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] tracking-wider uppercase text-muted font-semibold">
          {label}
        </p>
        <p className="text-[13px] text-ink font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function Step({ step, index }) {
  const [open, setOpen] = useState(index <= 2);

  return (
    <li className="rounded-xl bg-white/70 border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="press w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-ivory font-display font-bold text-[13px] flex items-center justify-center">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[16px] text-primary tracking-tight leading-tight">
            {step.title}
          </p>
          <p
            className="text-[13px] text-accent-dark/80 leading-tight mt-0.5"
            style={{ fontFamily: "Amiri, serif" }}>
            {step.arabic}
          </p>
        </div>
        <Icon
          name="forward"
          size={14}
          className={`text-muted transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-out ${
        open ? "max-h-96" : "max-h-0"
      }`}>
        <div className="px-4 pb-4">
          <div className="border-t border-border/60 pt-3">
            <p className="text-[14px] text-body leading-relaxed">
              {step.body}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
