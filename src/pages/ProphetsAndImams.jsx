// src/pages/ProphetsAndImams.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Prophets & Imams — biographies and lessons.
//
// Layout:
//   • Tabs at top: Prophets / Imams
//   • Tap any card → detail screen with full bio, lessons, Qur'an reference
//   • Back button on detail returns to the list
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { PROPHETS, IMAMS } from "../data/prophetsAndImams";
import { useBranch } from "../hooks/useBranch";

export default function ProphetsAndImams() {
  const [tab, setTab] = useState("prophets");
  const { branch } = useBranch();
  const showImams = branch !== "sunni";
  if (tab === "imams" && !showImams) setTab("prophets");
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <DetailView
        figure={selected}
        kind={tab}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={showImams ? "Prophets & Imams" : "Prophets"}
        subtitle={showImams ? "الأَنْبِيَاء وَالأَئِمَّة" : "الأَنْبِيَاء"}
      />

      {/* Tabs */}
      {showImams && <div className="px-4 pt-3 pb-3 flex gap-2 border-b border-border/60 bg-ivory">
        <TabPill active={tab === "prophets"} onClick={() => setTab("prophets")}>
          Prophets
        </TabPill>
        {showImams && <TabPill active={tab === "imams"}     onClick={() => setTab("imams")}>
          Imams
        </TabPill>}
      </div>}

      <div className="scroll-area pb-nav">
        {tab === "prophets" ? (
          <List items={PROPHETS} kindLabel="prophet" onSelect={setSelected} />
        ) : (
          <>
            <ImamsIntro />
            <List items={IMAMS} kindLabel="imam" onSelect={setSelected} />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tab pill ───────────────────────────────────────────────────────────────
function TabPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`press px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
        active ? "bg-primary text-ivory" : "bg-parchment text-body"
      }`}>
      {children}
    </button>
  );
}

// ─── List ───────────────────────────────────────────────────────────────────
function List({ items, kindLabel, onSelect }) {
  return (
    <ul className="px-4 pt-4 space-y-2.5">
      {items.map((item, idx) => (
        <li
          key={item.id}
          style={{ animation: `fadeIn 320ms ease-out ${Math.min(idx, 12) * 14}ms both` }}>
          <button
            onClick={() => onSelect(item)}
            className="press w-full text-left rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 transition-colors p-4">

            <div className="flex items-start gap-3">
              {/* Number / index badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent-dark font-display font-bold text-[13px]">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className="text-[20px] text-ink leading-tight block"
                  style={{ fontFamily: "Amiri, serif" }}
                  dir="rtl">
                  {item.arabic}
                </span>
                <p className="font-display text-[16px] text-primary tracking-tight mt-1">
                  {item.name}
                </p>
                <p className="text-[12px] text-accent-dark/80 italic leading-snug">
                  {item.title}
                </p>
                {item.period && (
                  <p className="text-[11px] text-muted/80 mt-0.5">
                    {item.period}
                  </p>
                )}
              </div>

              <Icon
                name="forward"
                size={14}
                className="text-muted/60 mt-2 flex-shrink-0"
              />
            </div>
          </button>
        </li>
      ))}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </ul>
  );
}

// ─── Imams intro card — flags this as Shia tradition ───────────────────────
function ImamsIntro() {
  return (
    <div className="mx-4 mt-4 rounded-xl bg-parchment/60 border border-border/60 p-3.5">
      <div className="flex items-start gap-2.5">
        <Icon name="info" size={14} className="text-accent-dark mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-body leading-relaxed">
          The 12 Imams are recognized in Shia tradition as the spiritual successors
          of the Prophet Muhammad ﷺ through the line of Imam Ali and Fatima az-Zahra.
          Imam Ali is also the fourth caliph in Sunni tradition.
        </p>
      </div>
    </div>
  );
}

// ─── Detail view ────────────────────────────────────────────────────────────
function DetailView({ figure, kind, onBack }) {
  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title={figure.name}
        subtitle={figure.arabic}
        onBack={onBack}
      />

      <div className="scroll-area pb-nav">
        {/* Hero */}
        <section className="px-6 pt-5 pb-5 text-center border-b border-border/60">
          <p
            className="text-[36px] text-accent-dark leading-tight mb-2"
            style={{ fontFamily: "Amiri, serif" }}
            dir="rtl">
            {figure.arabic}
          </p>
          <h1 className="font-display text-2xl text-primary tracking-tight">
            {figure.name}
          </h1>
          <p className="text-[13px] text-accent-dark/80 italic mt-1">
            {figure.title}
          </p>
          {figure.period && (
            <p className="text-[11px] text-muted mt-2 tracking-wide">
              {figure.period}
            </p>
          )}
          <div className="mx-auto mt-4 w-12 h-px bg-accent/40" />
        </section>

        {/* Bio */}
        <section className="mx-4 mt-4 rounded-2xl bg-white/70 border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="bookOpen" size={14} className="text-accent-dark" />
            <h2 className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold">
              Life
            </h2>
          </div>
          <p className="text-[14px] text-body leading-relaxed">
            {figure.bio}
          </p>
        </section>

        {/* Lessons */}
        {figure.lessons && figure.lessons.length > 0 && (
          <section className="mx-4 mt-3 rounded-2xl bg-white/70 border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="star" size={14} className="text-accent-dark" />
              <h2 className="text-[11px] tracking-[0.18em] uppercase text-muted font-semibold">
                Lessons
              </h2>
            </div>
            <ul className="space-y-2.5">
              {figure.lessons.map((lesson, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-accent" />
                  <span className="text-[14px] text-body leading-relaxed">
                    {lesson}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Qur'an reference (only for prophets) */}
        {figure.quranRef && (
          <section className="mx-4 mt-3 rounded-2xl bg-parchment/60 border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon name="bookOpen" size={12} className="text-accent-dark" />
              <h3 className="text-[10px] tracking-[0.18em] uppercase text-muted font-semibold">
                Mentioned in
              </h3>
            </div>
            <p className="text-[13px] text-primary font-medium">
              {figure.quranRef}
            </p>
          </section>
        )}

        <p className="text-center text-[11px] text-muted/70 mt-6 px-8 leading-relaxed">
          {kind === "prophets"
            ? "May peace be upon all of Allah's messengers."
            : "May Allah be pleased with them all."}
        </p>
      </div>
    </div>
  );
}
