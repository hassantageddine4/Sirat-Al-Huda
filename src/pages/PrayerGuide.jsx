// src/pages/PrayerGuide.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Prayer Guide — two modes:
//
//   /practice/prayer-guide        → category list (Daily, Friday, Recommended,
//                                   Occasional, Guidance) with Sunni/Shia toggle
//   /practice/prayer-guide/:id    → step-by-step walkthrough for that prayer
//
// Built around the data layer in src/data/prayerWalkthrough/.
// Direct port of PrayerListView.swift + PrayerWalkthroughView.swift.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PRAYER_CATALOG, prayerById, iconForPrayer } from "../data/prayerWalkthrough/catalog";
import IslamicGeometricBackground from "../components/prayer/IslamicGeometricBackground";
import PrayerWalkthrough from "../components/prayer/PrayerWalkthrough";
import PrayerIcon from "../components/prayer/PrayerIcon";
import Icon from "../components/common/Icon";
import { useBranch } from "../hooks/useBranch";

const BG_TOP    = "#0a2a1c";
const BG_BOTTOM = "#03100b";
const GOLD      = "rgba(242, 204, 115, 1)";

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PrayerGuide() {
  const { prayerKey } = useParams();
  const navigate = useNavigate();

  // No prayer key → list view
  if (!prayerKey) {
    return <PrayerList onPick={(id) => navigate(`/practice/prayer-guide/${id}`)} onBack={() => navigate("/practice")} />;
  }

  const prayer = prayerById(prayerKey);
  if (!prayer) {
    return (
      <div
        className="screen items-center justify-center text-center px-6"
        style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})`, color: "white" }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>That prayer guide isn't available.</p>
        <button
          onClick={() => navigate("/practice/prayer-guide")}
          className="press mt-4 px-5 py-2.5 rounded-full font-semibold"
          style={{
            background: "linear-gradient(to bottom, #FCDF8C, #D9A84D)",
            color: "#0a2e22",
            fontSize: 13,
          }}>
          Back to prayer list
        </button>
      </div>
    );
  }

  return (
    <PrayerWalkthrough
      prayer={prayer}
      initialMadhhab={null}
      onClose={() => navigate("/practice/prayer-guide")}
    />
  );
}

// ─── Prayer list ────────────────────────────────────────────────────────────

function PrayerList({ onPick, onBack }) {
  const { branch } = useBranch();
  const filter = (arr) => (arr || []).filter(p => !branch || !p.tradition || p.tradition === "both" || p.tradition === branch);

  return (
    <div className="screen relative" style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}>

      {/* Background ornaments */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(46,140,98,0.30), transparent 60%)",
        }}
      />
      <IslamicGeometricBackground tileSize={70} lineOpacity={0.04} />

      {/* Top bar */}
      <div className="relative flex-shrink-0 pt-safe">
        <div className="flex items-center px-3 py-3 gap-1">
          <button
            onClick={onBack}
            aria-label="Back"
            className="press w-10 h-10 flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.85)",
            }}>
            <Icon name="back" size={18} />
          </button>
          <h1 className="flex-1 text-center pr-10 text-white font-semibold" style={{ fontSize: 17 }}>
            Prayer Guide
          </h1>
        </div>
      </div>

      {/* Scroll */}
      <div className="relative flex-1 overflow-y-auto pb-10">

        {/* Hero */}
        <div className="flex flex-col items-center gap-3 pt-3 pb-5 px-6">
          <p
            className="font-semibold"
            style={{
              fontSize: 11, letterSpacing: "0.4em",
              color: "rgba(242, 204, 115, 0.85)",
            }}>
            PRAYER GUIDE
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 320 }}>
            Step-by-step guidance through every prayer, with both Sunni and Shia forms.
          </p>
        </div>

        {/* Sections */}
        <div className="px-4 flex flex-col gap-6">
          <Section title="Daily Prayers" prayers={filter(PRAYER_CATALOG.dailyFive)} onPick={onPick} branch={branch} />
          <Section title="Friday Prayer" prayers={filter(PRAYER_CATALOG.congregational)} onPick={onPick} branch={branch} />
          <Section title="Recommended"   prayers={filter(PRAYER_CATALOG.recommended)}    onPick={onPick} branch={branch} />
          <Section title="Occasional"    prayers={filter(PRAYER_CATALOG.occasional)}     onPick={onPick} branch={branch} />
          <Section title="Guidance"      prayers={filter(PRAYER_CATALOG.situational)}    onPick={onPick} branch={branch} />
          <ComingSoonSection />
        </div>

        {/* Disclaimer footnote */}
        <div className="mt-8 mx-6 text-center">
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }} className="italic leading-relaxed">
            Content is being reviewed by qualified scholars before final shipping.
            Variations exist between schools — this guide presents the most commonly referenced forms.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

function Section({ title, prayers, onPick, branch }) {
  return (
    <section>
      <DecorativeHeader title={title} />
      <ul className="flex flex-col gap-2.5 mt-3">
        {prayers.map((p) => (
          <li key={p.id}>
            <PrayerCard prayer={p} branch={branch} onClick={() => onPick(p.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DecorativeHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <span
        className="flex-shrink-0"
        style={{ width: 22, height: 1, background: "rgba(242, 204, 115, 0.3)" }}
      />
      <h2
        className="font-semibold"
        style={{
          fontSize: 11, letterSpacing: "0.28em",
          color: "rgba(242, 204, 115, 0.9)",
        }}>
        {title.toUpperCase()}
      </h2>
      <span
        className="flex-1"
        style={{ height: 1, background: "rgba(242, 204, 115, 0.18)" }}
      />
    </div>
  );
}

// ─── Prayer card ────────────────────────────────────────────────────────────

function PrayerCard({ prayer, onClick, branch }) {
  return (
    <button
      onClick={onClick}
      className="press w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left"
      style={{
        background: "linear-gradient(135deg, rgba(15,61,46,0.55), rgba(8,40,25,0.85))",
        border: "0.6px solid rgba(242, 204, 115, 0.25)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      }}>

      {/* Icon plate */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(26,92,68,1), rgba(8,40,25,1))",
          border: "0.6px solid rgba(242, 204, 115, 0.4)",
          color: GOLD,
        }}>
        <PrayerIcon name={iconForPrayer(prayer.id)} size={20} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p
            className="font-semibold text-white truncate"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 600 }}>
            {prayer.id === "tahajjud" && branch === "shia" ? "Salat al-Layl" : prayer.name}
          </p>
          <p
            className="truncate"
            style={{
              fontFamily: "Amiri, serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
            }}>
            {prayer.id === "tahajjud" && branch === "shia" ? "صلاة الليل" : prayer.arabicName}
          </p>
        </div>
        <p
          className="line-clamp-2"
          style={{
            fontSize: 12, lineHeight: 1.4,
            color: "rgba(255,255,255,0.6)",
          }}>
          {prayer.summary}
        </p>
      </div>

      {/* Rakah count */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
        <span style={{ fontSize: 14, fontWeight: 600, color: GOLD }}>
          {prayer.rakahCount}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
          rak'ah
        </span>
        <span className="ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Icon name="forward" size={12} />
        </span>
      </div>
    </button>
  );
}

// ─── Coming Soon ────────────────────────────────────────────────────────────

const COMING_SOON = [];

function ComingSoonSection() {
  if (COMING_SOON.length === 0) return null;
  return (
    <section className="mt-2">
      <div className="text-center my-3">
        <p
          className="italic"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          Specialised prayers — coming soon
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {COMING_SOON.map((c) => (
          <li
            key={c.name}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
            }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                {c.name}
              </p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                {c.hint}
              </p>
            </div>
            <span
              className="font-semibold"
              style={{
                fontSize: 10, letterSpacing: "0.18em",
                color: "rgba(242, 204, 115, 0.5)",
              }}>
              SOON
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
