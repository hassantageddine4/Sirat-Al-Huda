// src/pages/AsmaUlHusna.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 99 Names of Allah (Asma ul Husna).
// Searchable card list with expandable descriptions.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { ASMA_UL_HUSNA, searchNames } from "../data/asmaUlHusna";

export default function AsmaUlHusna() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => searchNames(query), [query]);

  return (
    <div className="screen bg-ivory">
      <ScreenHeader
        title="99 Names of Allah"
        subtitle="أَسْمَاءُ اللَّهِ الْحُسْنَىٰ"
      />

      {/* Hero */}
      <section className="px-6 pt-4 pb-5 text-center border-b border-border/60">
        <p className="text-[11px] tracking-[0.22em] uppercase text-muted font-semibold">
          Asma ul Husna
        </p>
        <p
          className="text-[26px] text-accent-dark mt-1.5 leading-tight"
          style={{ fontFamily: "Amiri, serif" }}>
          ٱللَّهُ
        </p>
        <p className="text-[12px] text-body mt-2 max-w-sm mx-auto leading-relaxed">
          The most beautiful names by which Allah has revealed Himself to His creation.
        </p>
        <div className="mx-auto mt-3 w-12 h-px bg-accent/40" />
      </section>

      {/* Search */}
      <div className="px-4 pt-3 pb-2 sticky top-0 bg-ivory z-10 border-b border-border/60">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names…"
            className="w-full pl-10 pr-10 py-3 rounded-full bg-parchment border border-transparent focus:border-accent/50 focus:outline-none text-sm text-ink placeholder:text-muted"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" size={16} />
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="press absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-ivory">
              <Icon name="close" size={14} className="text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="scroll-area pb-12">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-parchment flex items-center justify-center text-muted mb-1">
              <Icon name="search" size={20} />
            </div>
            <p className="font-display text-base text-primary">No matches</p>
            <p className="text-[12px] text-muted">Try a different name or number.</p>
          </div>
        ) : (
          <p className="px-5 pt-4 text-[12px] text-muted">
            {results.length} {results.length === 1 ? "name" : "names"}
          </p>
        )}

        <ul className="px-4 pt-3 space-y-2.5">
          {results.map((name, idx) => {
            const isOpen = expanded === name.number;
            return (
              <li
                key={name.number}
                style={{ animation: `fadeIn 320ms ease-out ${Math.min(idx, 12) * 14}ms both` }}>

                <button
                  onClick={() => setExpanded(isOpen ? null : name.number)}
                  className="press w-full text-left rounded-2xl bg-white/70 border border-border/60 hover:border-accent/40 transition-colors p-4">

                  <div className="flex items-start gap-3">
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent-dark font-display font-bold text-[14px]">
                      {name.number}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[22px] text-ink leading-tight block"
                        style={{ fontFamily: "Amiri, serif" }}
                        dir="rtl">
                        {name.arabic}
                      </span>
                      <p className="font-display text-[16px] text-primary tracking-tight mt-1">
                        {name.transliteration}
                      </p>
                      <p className="text-[13px] text-muted leading-snug">
                        {name.meaning}
                      </p>
                    </div>

                    <Icon
                      name="forward"
                      size={14}
                      className={`text-muted/60 mt-2 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </div>

                  {/* Expanded description */}
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-96 mt-3" : "max-h-0"
                  }`}>
                    <div className="border-t border-border/60 pt-3">
                      <p className="text-[13px] text-body leading-relaxed">
                        {name.description}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-center text-[11px] text-muted/70 mt-6 px-8 leading-relaxed">
          From the hadith: "Allah has ninety-nine names — whoever memorizes them will enter Paradise."
          <br />
          <span className="text-[10px]">— Sahih al-Bukhari & Muslim</span>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
