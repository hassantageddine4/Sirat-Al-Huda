// src/pages/PrayerGuide.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Prayer Guide — two modes:
//
//   • If no `:prayerKey` in URL → show prayer picker (5 cards)
//   • If `:prayerKey` is present → show step-by-step for that prayer
//
// Routed at:
//   /practice/prayer-guide        → picker
//   /practice/prayer-guide/:key   → detail
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
    icon: "sunrise",
    accent: "#1A5C44",
  },
  dhuhr: {
    name: "Dhuhr",
    arabic: "الظهر",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The midday prayer, performed after the sun passes its zenith.",
    timing: "From shortly after solar noon until Asr.",
    icon: "clock",
    accent: "#0F3D2E",
  },
  asr: {
    name: "Asr",
    arabic: "العصر",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The afternoon prayer, performed in the late part of the day.",
    timing: "From mid-afternoon until just before sunset.",
    icon: "clock",
    accent: "#A88730",
  },
  maghrib: {
    name: "Maghrib",
    arabic: "المغرب",
    rakat: 3,
    rakatLabel: "3 rak'ah",
    description: "The sunset prayer, performed shortly after the sun has set.",
    timing: "From just after sunset until the disappearance of twilight.",
    icon: "sunset",
    accent: "#A88730",
  },
  isha: {
    name: "Isha",
    arabic: "العشاء",
    rakat: 4,
    rakatLabel: "4 rak'ah",
    description: "The night prayer, performed after twilight has disappeared.",
    timing: "From the end of twilight until the appearance of true dawn.",
    icon: "moon",
    accent: "#082819",
  },
};
const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

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

  // No prayer key → show picker
  if (!prayerKey) {
    return <PrayerPicker onSelect={(key) => navigate(`/practice/prayer-guide/${key}`)} onBack={() => navigate(-1)} />;
  }

  const prayer = PRAYERS[prayerKey];
  if (!prayer) {
    return (
      <div className="screen bg-ivory">
        <ScreenHeader title="Prayer Guide" onBack={() => navigate("/practice/prayer-guide")} />
        <div className="px-6 pt-8">
          <InfoCard variant="warning" title="Unknown prayer">
            That prayer guide isn't available. Pick a prayer from the list below.
          </InfoCard>
          <button
            onClick={() => navigate("/practice/prayer-guide")}
            className="press mt-4 w-full py-3 rounded-full bg-primary text-ivory font-semibold text-sm">
            Back to prayer list
          </button>
        </div>
      </div>
    );
  }

  return <PrayerDetail prayer={prayer} prayerKey={prayerKey} onBack={() => navigate("/practice/prayer-guide")} />;
}

// ─── Prayer Picker (5 cards) ────────────────────────────────────────────────
function PrayerPicker({ onSelect, onBack }) {
  return (
    <div className="screen bg-ivory">
      <ScreenHeader title="Prayer Guide" subtitle="الصلاة" onBack={onBack} />

      <div className="scroll-area pb-12">
        {/* Hero */}
        <section className="px-6 pt-5 pb-5 text-center border-b border-border/60">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted font-semibold">
            Step-by-step guidance
          </p>
          <h1 className="font-display text-3xl text-primary tracking-tight mt-1.5 leading-tight">
            How to perform<br />the five daily prayers
          </h1>
          <p className="text-[13px] text-body mt-3 max-w-md mx-auto leading-relaxed">
            Choose a prayer below to see the timing, number of rak'ah, and complete step-by-step instructions.
          </p>
          <div className="mx-auto mt-4 w-12 h-px bg-accent/40" />
        </section>

        {/* Picker grid */}
        <ul className="px-4 pt-5 space-y-2.5">
          {PRAYER_ORDER.map((key, idx) => {
            const p = PRAYERS[key];
            return (
              <li
                key={key}
                style={{ animation: `fadeIn 320ms ease-out ${idx * 60}ms both` }}>
                <button
                  onClick={() => onSelect(key)}
                  className="press w-full flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 transition-colors text-left">

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-ivory"
                    style={{ background: p.accent }}>
                    <Icon name={p.icon} size={20} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-display text-lg text-primary tracking-tight leading-none">
                        {p.name}
                      </h3>
                      <span
                        className="text-[16px] text-accent-dark/80 leading-none"
                        style={{ fontFamily: "Amiri, serif" }}>
                        {p.arabic}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted mt-1 leading-snug">
                      {p.rakatLabel} · {p.description.replace(/\.$/, "")}
                    </p>
                  </div>

                  <Icon name="forward" size={14} className="text-muted/60 flex-shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Closing tip */}
        <section className="px-4 pt-5">
          <InfoCard variant="tip" title="Before you begin">
            All five prayers begin with wudu (ritual ablution) and facing the qibla.
            Each rak'ah follows the same core sequence; only the number of rak'ah differs.
          </InfoCard>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}

// ─── Prayer Detail ──────────────────────────────────────────────────────────
function PrayerDetail({ prayer, prayerKey, onBack }) {
  return (
    <div className="screen bg-ivory">
      <ScreenHeader title={prayer.name} subtitle={prayer.arabic} onBack={onBack} />

      <div className="scroll-area pb-12">

        {/* Hero */}
        <section className="px-6 pt-5 pb-4 text-center border-b border-border/60">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-ivory"
            style={{ background: prayer.accent }}>
            <Icon name={prayer.icon} size={28} />
          </div>
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

        {/* Quick facts */}
        <section className="px-4 pt-4 grid grid-cols-2 gap-3">
          <FactCard icon="prayer" label="Rak'ah" value={prayer.rakatLabel} />
          <FactCard icon="clock"  label="Time"   value="See timing below" />
        </section>

        {/* Timing */}
        <section className="px-4 pt-4">
          <InfoCard title="When to pray">
            {prayer.timing}
          </InfoCard>
        </section>

        {/* Wudu reminder */}
        <section className="px-4 pt-3">
          <InfoCard variant="warning" icon="alert" title="Before you begin">
            Make sure you have wudu (ritual ablution) and that you are facing
            the qibla. Cover the awrah and pray on a clean surface.
          </InfoCard>
        </section>

        {/* Steps */}
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

        {/* Closing tip */}
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
