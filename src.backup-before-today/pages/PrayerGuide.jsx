// src/pages/PrayerGuide.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PRAYERS, SUNNAH_PRAYERS, RECITATIONS, getAllSteps, getRecitation } from "../data/prayers";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44", primaryDark: "#082819",
  accent: "#C8A951", accentLight: "#D9BF7A", accentDark: "#A88730",
  ivory: "#FAF7F2", parchment: "#EDE7D9",
  ink: "#1C1814", body: "#3A3530", muted: "#7A7268", subtle: "#A09890",
  border: "#E8E2D8",
};

// ── Phase colours ─────────────────────────────────────────────────────────────
const PHASE_COLOR = {
  preparation: "#7A7268", takbir: "#C8A951",
  qiyam: "#0F3D2E", ruku: "#2E5C8A", itidal: "#1A5C44",
  sujood1: "#5C3D0F", jilsah: "#7A5C30", sujood2: "#5C3D0F",
  qiyam2: "#0F3D2E", tashahhud: "#2E3D8F", tashahhud_final: "#2E3D8F",
  tasleem: "#2E7D5A",
};

// ── SVG Pose Illustrations ─────────────────────────────────────────────────────
function PoseIllustration({ pose }) {
  const G = C.primaryDark;   // cloak dark green
  const GL = C.primaryLight; // cloak light
  const T = "#E8E0D0";       // thobe ivory
  const S = "#C8855A";       // skin
  const K = "#F5F0E8";       // kufi

  const W = 200, H = 220;

  const poses = {
    standing: (
      <svg width={W} height={H} viewBox="0 0 200 220">
        {/* mat */}
        <ellipse cx="100" cy="210" rx="68" ry="10" fill={G} opacity=".2"/>
        {/* thobe */}
        <path d="M76,82 Q74,74 100,70 Q126,74 124,82 L130,204 Q116,210 100,210 Q84,210 70,204Z" fill={T}/>
        <path d="M87,95 L84,204" stroke="#C8B896" strokeWidth="1.2" opacity=".5"/>
        <path d="M113,95 L116,204" stroke="#C8B896" strokeWidth="1.2" opacity=".5"/>
        {/* cloak */}
        <path d="M76,78 Q60,88 56,112 Q50,144 52,204 Q64,210 76,206L73,204 Q68,162 75,134 Q83,108 100,102 Q117,108 125,134 Q132,162 127,204L124,206 Q136,210 148,204 Q150,144 144,112 Q140,88 124,78Z" fill={G} opacity=".92"/>
        {/* collar */}
        <path d="M88,80 Q100,76 112,80 L110,90 Q100,86 90,90Z" fill="#C8A878" opacity=".6"/>
        {/* belt */}
        <rect x="77" y="118" width="46" height="5" rx="2.5" fill="#7A5C30" opacity=".6"/>
        {/* arms */}
        <path d="M76,84 Q63,96 60,122 Q58,142 61,162" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M76,84 Q63,96 60,122 Q58,142 61,162" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".82"/>
        <path d="M76,84 Q63,96 60,122 Q58,142 61,162" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M124,84 Q137,96 140,122 Q142,142 139,162" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M124,84 Q137,96 140,122 Q142,142 139,162" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".82"/>
        <path d="M124,84 Q137,96 140,122 Q142,142 139,162" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <ellipse cx="60" cy="165" rx="9" ry="6" fill={S}/>
        <ellipse cx="140" cy="165" rx="9" ry="6" fill={S}/>
        {/* feet */}
        <ellipse cx="90" cy="208" rx="12" ry="5" fill="#8A6030"/>
        <ellipse cx="110" cy="208" rx="12" ry="5" fill="#8A6030"/>
        {/* neck + head */}
        <rect x="93" y="60" width="14" height="14" rx="5" fill={S}/>
        <ellipse cx="100" cy="46" rx="20" ry="22" fill={S}/>
        <path d="M80,42 Q82,26 100,24 Q118,26 120,42Z" fill={K}/>
        <ellipse cx="80" cy="47" rx="5" ry="8" fill="#B87848"/>
        <ellipse cx="120" cy="47" rx="5" ry="8" fill="#B87848"/>
        <ellipse cx="92" cy="44" rx="5" ry="6" fill="#F0E8D8"/>
        <ellipse cx="108" cy="44" rx="5" ry="6" fill="#F0E8D8"/>
        <ellipse cx="92" cy="44" rx="3.2" ry="4" fill="#2E1A0A"/>
        <ellipse cx="108" cy="44" rx="3.2" ry="4" fill="#2E1A0A"/>
        <ellipse cx="91" cy="42" rx="1.4" ry="1.8" fill="#100800"/>
        <ellipse cx="107" cy="42" rx="1.4" ry="1.8" fill="#100800"/>
        <path d="M85,36 Q92,33 99,36" stroke="#2E1A0A" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
        <path d="M101,36 Q108,33 115,36" stroke="#2E1A0A" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
        <path d="M99,48 Q96,54 99,57 Q100,58 101,57 Q104,54 101,48" stroke="#A06838" strokeWidth="1.2" fill="none"/>
        <path d="M91,60 Q100,63 109,60" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M82,62 Q83,73 89,77 Q100,81 111,77 Q117,73 118,62 Q112,70 100,72 Q88,70 82,62Z" fill="#2A1A0A"/>
      </svg>
    ),

    takbir: (
      <svg width={W} height={H} viewBox="0 0 200 220">
        <ellipse cx="100" cy="210" rx="68" ry="10" fill={G} opacity=".2"/>
        <path d="M76,82 Q74,74 100,70 Q126,74 124,82 L130,204 Q116,210 100,210 Q84,210 70,204Z" fill={T}/>
        <path d="M76,78 Q60,88 56,112 Q50,144 52,204 Q64,210 76,206L73,204 Q68,162 75,134 Q83,108 100,102 Q117,108 125,134 Q132,162 127,204L124,206 Q136,210 148,204 Q150,144 144,112 Q140,88 124,78Z" fill={G} opacity=".92"/>
        <path d="M88,80 Q100,76 112,80 L110,90 Q100,86 90,90Z" fill="#C8A878" opacity=".6"/>
        <ellipse cx="90" cy="208" rx="12" ry="5" fill="#8A6030"/>
        <ellipse cx="110" cy="208" rx="12" ry="5" fill="#8A6030"/>
        {/* Arms raised — Takbir */}
        <path d="M76,84 Q54,76 40,58 Q32,44 32,32" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M76,84 Q54,76 40,58 Q32,44 32,32" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".82"/>
        <path d="M76,84 Q54,76 40,58 Q32,44 32,32" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M124,84 Q146,76 160,58 Q168,44 168,32" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M124,84 Q146,76 160,58 Q168,44 168,32" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".82"/>
        <path d="M124,84 Q146,76 160,58 Q168,44 168,32" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        {/* Open palms */}
        <rect x="19" y="6" width="19" height="27" rx="8" fill={S}/>
        <rect x="12" y="-8" width="7" height="18" rx="3.5" fill={S}/>
        <rect x="19" y="-12" width="7" height="22" rx="3.5" fill={S}/>
        <rect x="26" y="-13" width="7" height="23" rx="3.5" fill={S}/>
        <rect x="33" y="-11" width="7" height="21" rx="3.5" fill={S}/>
        <rect x="39" y="-7" width="6" height="17" rx="3" fill={S}/>
        <rect x="162" y="6" width="19" height="27" rx="8" fill={S}/>
        <rect x="181" y="-8" width="7" height="18" rx="3.5" fill={S}/>
        <rect x="174" y="-12" width="7" height="22" rx="3.5" fill={S}/>
        <rect x="167" y="-13" width="7" height="23" rx="3.5" fill={S}/>
        <rect x="160" y="-11" width="7" height="21" rx="3.5" fill={S}/>
        <rect x="155" y="-7" width="6" height="17" rx="3" fill={S}/>
        {/* Head + face */}
        <rect x="93" y="60" width="14" height="14" rx="5" fill={S}/>
        <ellipse cx="100" cy="46" rx="20" ry="22" fill={S}/>
        <path d="M80,42 Q82,26 100,24 Q118,26 120,42Z" fill={K}/>
        <ellipse cx="80" cy="47" rx="5" ry="8" fill="#B87848"/>
        <ellipse cx="120" cy="47" rx="5" ry="8" fill="#B87848"/>
        <ellipse cx="92" cy="44" rx="5" ry="6" fill="#F0E8D8"/><ellipse cx="108" cy="44" rx="5" ry="6" fill="#F0E8D8"/>
        <ellipse cx="92" cy="44" rx="3.2" ry="4" fill="#2E1A0A"/><ellipse cx="108" cy="44" rx="3.2" ry="4" fill="#2E1A0A"/>
        <ellipse cx="91" cy="42" rx="1.4" ry="1.8" fill="#100800"/><ellipse cx="107" cy="42" rx="1.4" ry="1.8" fill="#100800"/>
        <path d="M85,36 Q92,33 99,36" stroke="#2E1A0A" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
        <path d="M101,36 Q108,33 115,36" stroke="#2E1A0A" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
        <path d="M99,48 Q96,54 99,57 Q100,58 101,57 Q104,54 101,48" stroke="#A06838" strokeWidth="1.2" fill="none"/>
        <path d="M91,60 Q100,63 109,60" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M82,62 Q83,73 89,77 Q100,81 111,77 Q117,73 118,62 Q112,70 100,72 Q88,70 82,62Z" fill="#2A1A0A"/>
      </svg>
    ),

    ruku: (
      <svg width="220" height={H} viewBox="0 0 220 220">
        <ellipse cx="110" cy="212" rx="68" ry="9" fill={G} opacity=".2"/>
        {/* Ruku body — rounded mound, front view */}
        <path d="M52,128 Q54,92 110,80 Q166,92 168,128 Q170,168 164,202 Q140,210 110,210 Q80,210 56,202 Q50,168 52,128Z" fill={G} opacity=".95"/>
        {/* thobe visible bottom sides */}
        <path d="M59,175 L57,202 Q72,208 86,206L83,202 Q77,184 74,170Z" fill={T} opacity=".65"/>
        <path d="M161,175 L163,202 Q148,208 134,206L137,202 Q143,184 146,170Z" fill={T} opacity=".65"/>
        {/* Head + face (front, tilted) */}
        <ellipse cx="110" cy="84" rx="22" ry="20" fill={S}/>
        <path d="M88,80 Q90,64 110,62 Q130,64 132,80Z" fill={K}/>
        <ellipse cx="88" cy="85" rx="5" ry="7" fill="#B87848"/>
        <ellipse cx="132" cy="85" rx="5" ry="7" fill="#B87848"/>
        <ellipse cx="101" cy="83" rx="5" ry="5.5" fill="#F0E8D8"/><ellipse cx="119" cy="83" rx="5" ry="5.5" fill="#F0E8D8"/>
        <ellipse cx="101" cy="83" rx="3.2" ry="3.8" fill="#2E1A0A"/><ellipse cx="119" cy="83" rx="3.2" ry="3.8" fill="#2E1A0A"/>
        <ellipse cx="100" cy="81" rx="1.4" ry="1.8" fill="#100800"/><ellipse cx="118" cy="81" rx="1.4" ry="1.8" fill="#100800"/>
        <path d="M95,75 Q101,72 107,75" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M113,75 Q119,72 125,75" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M97,92 Q103,96 110,96 Q117,96 123,92 Q117,100 110,101 Q103,100 97,92Z" fill="#2A1A0A"/>
        {/* arms down to knees */}
        <path d="M56,136 Q47,162 45,194" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M56,136 Q47,162 45,194" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".8"/>
        <path d="M56,136 Q47,162 45,194" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M164,136 Q173,162 175,194" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M164,136 Q173,162 175,194" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".8"/>
        <path d="M164,136 Q173,162 175,194" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        {/* hands on knees */}
        <ellipse cx="43" cy="197" rx="16" ry="10" fill={S}/>
        <path d="M28,193 L24,183 M34,191 L31,181 M40,189 L39,179 M46,189 L47,179 M52,190 L54,180" stroke={S} strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="177" cy="197" rx="16" ry="10" fill={S}/>
        <path d="M192,193 L196,183 M186,191 L189,181 M180,189 L181,179 M174,189 L173,179 M168,190 L166,180" stroke={S} strokeWidth="5" strokeLinecap="round"/>
        {/* feet */}
        <ellipse cx="97" cy="210" rx="14" ry="5" fill="#8A6030"/>
        <ellipse cx="123" cy="210" rx="14" ry="5" fill="#8A6030"/>
      </svg>
    ),

    sujood: (
      <svg width="220" height={H} viewBox="0 0 220 220">
        <ellipse cx="110" cy="215" rx="90" ry="10" fill={G} opacity=".2"/>
        {/* mat line */}
        <rect x="10" y="208" width="200" height="4" rx="2" fill={C.accent} opacity=".2"/>
        {/* large mound */}
        <path d="M42,138 Q46,94 110,78 Q174,94 178,138 Q180,178 174,208 Q144,216 110,216 Q76,216 46,208 Q40,178 42,138Z" fill={G} opacity=".96"/>
        {/* mound highlight */}
        <path d="M50,128 Q56,96 110,84" stroke="rgba(255,255,255,0.055)" strokeWidth="2" fill="none"/>
        {/* kufi/forehead circle at bottom centre */}
        <circle cx="110" cy="208" r="19" fill={S}/>
        <circle cx="110" cy="205" r="15" fill={K}/>
        <circle cx="110" cy="208" r="9" fill={S}/>
        <ellipse cx="110" cy="216" rx="12" ry="4" fill="#0A1E14" opacity=".45"/>
        {/* hands spread */}
        <ellipse cx="56" cy="212" rx="20" ry="9" fill={S}/>
        <path d="M37,207 L32,196 M43,205 L40,194 M50,203 L49,192 M57,203 L57,192 M64,204 L66,193" stroke={S} strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="164" cy="212" rx="20" ry="9" fill={S}/>
        <path d="M183,207 L188,196 M177,205 L180,194 M170,203 L171,192 M163,203 L163,192 M156,204 L154,193" stroke={S} strokeWidth="5" strokeLinecap="round"/>
        {/* toes upright at top */}
        <ellipse cx="96" cy="92" rx="12" ry="7" fill={G} transform="rotate(-22 96 92)"/>
        <ellipse cx="124" cy="92" rx="12" ry="7" fill={G} transform="rotate(22 124 92)"/>
        <ellipse cx="97" cy="88" rx="8" ry="4" fill="#8A6030" opacity=".8" transform="rotate(-22 97 88)"/>
        <ellipse cx="123" cy="88" rx="8" ry="4" fill="#8A6030" opacity=".8" transform="rotate(22 123 88)"/>
      </svg>
    ),

    sitting: (
      <svg width={W} height={H} viewBox="0 0 200 220">
        <ellipse cx="100" cy="215" rx="72" ry="9" fill={G} opacity=".2"/>
        {/* dark cloth under sitting figure */}
        <path d="M48,172 Q50,186 54,208 Q100,218 146,208 Q150,186 152,172 Q126,182 100,184 Q74,182 48,172Z" fill={G} opacity=".88"/>
        {/* legs cross-legged */}
        <path d="M48,172 Q38,188 34,208 Q56,216 80,214 L76,204 Q62,196 58,181Z" fill={G} opacity=".9"/>
        <path d="M152,172 Q162,188 166,208 Q144,216 120,214 L124,204 Q138,196 142,181Z" fill={G} opacity=".9"/>
        {/* thobe torso */}
        <path d="M72,100 Q70,92 100,88 Q130,92 128,100 L132,174 Q116,180 100,180 Q84,180 68,174Z" fill={T}/>
        <path d="M81,112 L79,174" stroke="#C8B896" strokeWidth="1.2" opacity=".45"/>
        <path d="M119,112 L121,174" stroke="#C8B896" strokeWidth="1.2" opacity=".45"/>
        {/* cloak shoulders */}
        <path d="M72,96 Q52,108 46,132 Q40,158 42,174 L62,174 Q58,156 65,138 Q74,116 100,110 Q126,116 135,138 Q142,156 138,174 L158,174 Q160,158 154,132 Q148,108 128,96Z" fill={G} opacity=".92"/>
        {/* arms on thighs */}
        <path d="M72,104 Q52,124 46,154" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M72,104 Q52,124 46,154" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".8"/>
        <path d="M72,104 Q52,124 46,154" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M128,104 Q148,124 154,154" stroke={T} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M128,104 Q148,124 154,154" stroke={G} strokeWidth="17" strokeLinecap="round" fill="none" opacity=".8"/>
        <path d="M128,104 Q148,124 154,154" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        {/* hands on thighs */}
        <ellipse cx="44" cy="158" rx="16" ry="9" fill={S}/>
        <path d="M29,154 L26,144 M35,152 L34,142 M41,151 L41,141 M47,151 L48,141" stroke={S} strokeWidth="4.5" strokeLinecap="round"/>
        <ellipse cx="156" cy="158" rx="16" ry="9" fill={S}/>
        <path d="M171,154 L174,144 M165,152 L166,142 M159,151 L159,141 M153,151 L152,141" stroke={S} strokeWidth="4.5" strokeLinecap="round"/>
        {/* feet */}
        <ellipse cx="62" cy="212" rx="17" ry="7" fill="#8A6030"/>
        <ellipse cx="138" cy="212" rx="17" ry="7" fill="#8A6030"/>
        {/* head + face */}
        <rect x="93" y="78" width="14" height="13" rx="5" fill={S}/>
        <ellipse cx="100" cy="64" rx="20" ry="22" fill={S}/>
        <path d="M80,60 Q82,44 100,42 Q118,44 120,60Z" fill={K}/>
        <ellipse cx="80" cy="65" rx="5" ry="7" fill="#B87848"/>
        <ellipse cx="120" cy="65" rx="5" ry="7" fill="#B87848"/>
        <ellipse cx="92" cy="62" rx="5" ry="6" fill="#F0E8D8"/><ellipse cx="108" cy="62" rx="5" ry="6" fill="#F0E8D8"/>
        <ellipse cx="92" cy="62" rx="3.2" ry="4" fill="#2E1A0A"/><ellipse cx="108" cy="62" rx="3.2" ry="4" fill="#2E1A0A"/>
        <ellipse cx="91" cy="60" rx="1.4" ry="1.8" fill="#100800"/><ellipse cx="107" cy="60" rx="1.4" ry="1.8" fill="#100800"/>
        <path d="M85,54 Q92,51 99,54" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M101,54 Q108,51 115,54" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M99,66 Q96,72 99,75 Q100,76 101,75 Q104,72 101,66" stroke="#A06838" strokeWidth="1.2" fill="none"/>
        <path d="M91,78 Q100,81 109,78" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M82,80 Q83,91 89,95 Q100,99 111,95 Q117,91 118,80 Q112,88 100,90 Q88,88 82,80Z" fill="#2A1A0A"/>
      </svg>
    ),

    tasleem: (
      <svg width={W} height={H} viewBox="0 0 200 220">
        <ellipse cx="100" cy="210" rx="68" ry="10" fill={G} opacity=".2"/>
        <path d="M76,82 Q74,74 100,70 Q126,74 124,82 L130,204 Q116,210 100,210 Q84,210 70,204Z" fill={T}/>
        <path d="M76,78 Q60,88 56,112 Q50,144 52,204 Q64,210 76,206L73,204 Q68,162 75,134 Q83,108 100,102 Q117,108 125,134 Q132,162 127,204L124,206 Q136,210 148,204 Q150,144 144,112 Q140,88 124,78Z" fill={G} opacity=".92"/>
        <ellipse cx="90" cy="208" rx="12" ry="5" fill="#8A6030"/><ellipse cx="110" cy="208" rx="12" ry="5" fill="#8A6030"/>
        <path d="M76,84 Q63,96 60,122 Q58,142 61,162" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M124,84 Q137,96 140,122 Q142,142 139,162" stroke={T} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <ellipse cx="60" cy="165" rx="9" ry="6" fill={S}/><ellipse cx="140" cy="165" rx="9" ry="6" fill={S}/>
        {/* head turned right */}
        <rect x="95" y="60" width="16" height="14" rx="5" fill={S}/>
        <ellipse cx="108" cy="46" rx="20" ry="22" fill={S}/>
        <path d="M88,42 Q90,26 108,24 Q126,26 128,42Z" fill={K}/>
        <ellipse cx="128" cy="47" rx="5" ry="7" fill="#B87848"/>
        <ellipse cx="98" cy="44" rx="4.5" ry="5.5" fill="#F0E8D8" opacity=".7"/>
        <ellipse cx="115" cy="44" rx="5" ry="6" fill="#F0E8D8"/>
        <ellipse cx="115" cy="44" rx="3.2" ry="4" fill="#2E1A0A"/>
        <ellipse cx="114" cy="42" rx="1.4" ry="1.8" fill="#100800"/>
        <path d="M104,38 Q110,35 117,38" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M119,38 Q125,35 131,38" stroke="#2E1A0A" strokeWidth="1.7" fill="none"/>
        <path d="M107,76 Q116,79 126,76" stroke="#2A1A0A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M98,78 Q99,89 105,93 Q113,97 122,93 Q129,89 130,78 Q124,86 112,88 Q100,86 98,78Z" fill="#2A1A0A"/>
        {/* direction arrow */}
        <path d="M132,34 Q142,32 148,36" stroke={C.accent} strokeWidth="1.4" strokeDasharray="3 2.5" fill="none" opacity=".5"/>
        <polygon points="148,31 155,36 147,41" fill={C.accent} opacity=".5"/>
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  minHeight: 140, padding: "8px 0" }}>
      {poses[pose] ?? poses.standing}
    </div>
  );
}

// ── RecitationBlock ────────────────────────────────────────────────────────────
function RecitationBlock({ rec, isBeginnerMode }) {
  const [expanded, setExpanded] = useState(true);
  if (!rec) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Header tap to collapse */}
      <button onClick={() => setExpanded(e => !e)}
        style={{ width: "100%", textAlign: "left", background: "transparent",
                  border: "none", padding: 0, cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: expanded ? 8 : 0 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.accent,
                        letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {rec.title}
            </p>
            {rec.subtitle && (
              <p style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{rec.subtitle}</p>
            )}
          </div>
          <span style={{ color: C.subtle, fontSize: 16, transform: expanded ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s" }}>›</span>
        </div>
      </button>

      {expanded && (
        <div style={{ background: `${C.primary}0A`, borderRadius: 14, padding: "14px 16px",
                      borderLeft: `3px solid ${C.accent}40` }}>
          {/* Arabic */}
          <p style={{ fontSize: isBeginnerMode ? 22 : 19, color: C.primary, fontFamily: "serif",
                      fontWeight: 600, lineHeight: 2, direction: "rtl", textAlign: "right",
                      marginBottom: 10 }}>
            {rec.arabic}
          </p>

          {/* Transliteration */}
          <div style={{ background: "rgba(15,61,46,0.06)", borderRadius: 10,
                        padding: "10px 12px", marginBottom: 8 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: "0.12em",
                        textTransform: "uppercase", marginBottom: 4 }}>
              Transliteration
            </p>
            <p style={{ fontSize: isBeginnerMode ? 14 : 12, color: C.body,
                        fontStyle: "italic", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {rec.transliteration}
            </p>
          </div>

          {/* Translation */}
          <div style={{ background: `${C.accent}12`, borderRadius: 10, padding: "10px 12px",
                        marginBottom: rec.note ? 8 : 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.accentDark, letterSpacing: "0.12em",
                        textTransform: "uppercase", marginBottom: 4 }}>
              Meaning
            </p>
            <p style={{ fontSize: isBeginnerMode ? 14 : 12, color: C.body,
                        lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-line" }}>
              {rec.translation}
            </p>
          </div>

          {/* Repetitions */}
          {rec.repetitions && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              {Array.from({ length: rec.repetitions }).map((_, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%",
                                       background: `${C.primary}15`,
                                       display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>{i + 1}</span>
                </div>
              ))}
              <span style={{ fontSize: 11, color: C.muted }}>× minimum</span>
            </div>
          )}

          {/* Note */}
          {rec.note && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 8,
                          background: "rgba(59,130,246,0.06)", borderRadius: 10, padding: "8px 10px" }}>
              <span style={{ fontSize: 13, color: "#3B82F6", flexShrink: 0 }}>ℹ</span>
              <p style={{ fontSize: 11, color: "#1e40af", lineHeight: 1.5 }}>{rec.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── StepCard ───────────────────────────────────────────────────────────────────
function StepCard({ step, isBeginnerMode }) {
  const phaseColor = PHASE_COLOR[step.phase] ?? C.primary;

  // Resolve recitations
  const recitations = (step.recitations ?? []).map(r => {
    if (r.inline) return r;
    return RECITATIONS[r.key] ?? null;
  }).filter(Boolean);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Phase label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: phaseColor }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: phaseColor,
                        letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {step.phase?.replace(/_/g, " ") ?? ""}
        </span>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`,
                    boxShadow: "0 4px 16px rgba(10,8,6,0.08)", overflow: "hidden" }}>

        {/* Illustration */}
        <div style={{ background: `linear-gradient(160deg,${C.primaryDark},${C.primary} 60%,${C.primaryLight})`,
                      padding: "12px 0 8px", position: "relative" }}>
          {/* Subtle tile pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.06,
                        backgroundImage: "repeating-linear-gradient(45deg,rgba(255,255,255,.3) 0,rgba(255,255,255,.3) 1px,transparent 0,transparent 50%)",
                        backgroundSize: "20px 20px" }} />
          <PoseIllustration pose={step.pose ?? "standing"} />
        </div>

        {/* Step title */}
        <div style={{ padding: "14px 16px 0 16px" }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 6 }}>
            {step.title}
          </h3>

          {/* Action instruction */}
          <p style={{ fontSize: isBeginnerMode ? 14 : 13, color: C.body,
                      lineHeight: 1.65, marginBottom: 14 }}>
            {step.action}
          </p>

          {/* Step note */}
          {step.note && (
            <div style={{ background: `${C.primary}08`, borderRadius: 10,
                          padding: "8px 12px", marginBottom: 14,
                          borderLeft: `3px solid ${C.primary}30` }}>
              <p style={{ fontSize: 11, color: C.primary, lineHeight: 1.5 }}>{step.note}</p>
            </div>
          )}
        </div>

        {/* Recitations */}
        {recitations.length > 0 && (
          <div style={{ padding: "0 16px 16px 16px" }}>
            <div style={{ height: 1, background: C.border, marginBottom: 14 }} />
            <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.14em",
                        textTransform: "uppercase", marginBottom: 12 }}>
              Recitations
            </p>
            {recitations.map((rec, i) => (
              <RecitationBlock key={i} rec={rec} isBeginnerMode={isBeginnerMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── RakahBadge ─────────────────────────────────────────────────────────────────
function RakahBadge({ rak, isActive, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
               cursor: "pointer", border: `1.5px solid ${isActive ? C.primary : C.border}`,
               background: isActive ? C.primary : "white",
               color: isActive ? "white" : C.muted,
               transition: "all 0.18s", flexShrink: 0 }}>
      {rak.label}
    </button>
  );
}

// ── Prayer Detail (Scroll mode) ────────────────────────────────────────────────
function PrayerScrollView({ prayer, mode, onBack }) {
  const [activeRakah, setActiveRakah] = useState(0);
  const steps = prayer.rakaat[activeRakah]?.steps ?? [];

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: `linear-gradient(150deg,${C.primaryDark},${C.primary} 55%,${C.primaryLight})` }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center press"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "white", fontSize: 22 }}>‹</span>
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ color: "white", fontWeight: 800, fontSize: 17 }}>{prayer.name} Prayer</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              {prayer.totalRakaat} rak'ahs · {mode === "beginner" ? "Beginner Mode" : "Standard Mode"}
            </p>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Rak'ah tabs */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
          {prayer.rakaat.map((rak, i) => (
            <RakahBadge key={i} rak={rak} isActive={activeRakah === i}
              onClick={() => setActiveRakah(i)} />
          ))}
        </div>
      </div>

      {/* Rak'ah description */}
      <div style={{ padding: "12px 16px 0 16px",
                    background: "white", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.accent,
                    letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
          {prayer.rakaat[activeRakah]?.label}
        </p>
        <p style={{ fontSize: 12, color: C.muted, paddingBottom: 12 }}>
          {prayer.rakaat[activeRakah]?.desc}
        </p>
      </div>

      {/* Steps */}
      <div className="scroll-area px-4 pt-4 pb-4">
        {steps.map((step, i) => (
          <StepCard key={`${step.id}-${i}`} step={step} isBeginnerMode={mode === "beginner"} />
        ))}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ── Prayer Step-by-Step mode ───────────────────────────────────────────────────
function PrayerStepMode({ prayer, mode, onBack }) {
  const allSteps = getAllSteps(prayer);
  const [stepIdx, setStepIdx] = useState(0);
  const current   = allSteps[stepIdx];
  const total     = allSteps.length;
  const pct       = ((stepIdx + 1) / total) * 100;

  function next() { if (stepIdx < total - 1) setStepIdx(s => s + 1); else onBack(); }
  function prev() { if (stepIdx > 0) setStepIdx(s => s - 1); }

  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe bg-primary">
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center press"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "white", fontSize: 22 }}>‹</span>
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{prayer.name} Prayer</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              {current?.rakahLabel ?? ""} · Step {stepIdx + 1}/{total}
            </p>
          </div>
          <div style={{ width: 40 }} />
        </div>
        {/* Progress */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.15)",
                        overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99,
                          width: `${pct}%`, transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
                          background: `linear-gradient(90deg,${C.accentLight},${C.accent})` }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10,
                      textAlign: "right", marginTop: 3 }}>
            {stepIdx + 1} of {total}
          </p>
        </div>
      </div>

      {/* Current step */}
      <div className="scroll-area px-4 pt-4">
        {current && (
          <StepCard step={current} isBeginnerMode={mode === "beginner"} />
        )}
        <div style={{ height: 12 }} />
      </div>

      {/* Navigation */}
      <div style={{ flexShrink: 0, display: "flex", gap: 10, padding: "12px 16px",
                    paddingBottom: "max(16px, env(safe-area-inset-bottom))",
                    background: "white", borderTop: `1px solid ${C.border}` }}>
        {stepIdx > 0 ? (
          <button onClick={prev}
            style={{ flex: 1, height: 48, borderRadius: 14, border: `1.5px solid ${C.primary}`,
                     background: "transparent", color: C.primary, fontSize: 15, fontWeight: 700,
                     cursor: "pointer" }}>
            ← Previous
          </button>
        ) : (
          <button onClick={onBack}
            style={{ flex: 1, height: 48, borderRadius: 14, border: `1.5px solid ${C.border}`,
                     background: "transparent", color: C.muted, fontSize: 15, fontWeight: 600,
                     cursor: "pointer" }}>
            ← Back
          </button>
        )}
        {stepIdx < total - 1 ? (
          <button onClick={next}
            style={{ flex: 1, height: 48, borderRadius: 14, border: "none",
                     background: C.primary, color: "white", fontSize: 15, fontWeight: 700,
                     cursor: "pointer", boxShadow: "0 6px 18px rgba(15,61,46,0.25)" }}>
            Next →
          </button>
        ) : (
          <button onClick={onBack}
            style={{ flex: 1, height: 48, borderRadius: 14, border: "none",
                     background: C.accent, color: C.primaryDark, fontSize: 15, fontWeight: 700,
                     cursor: "pointer", boxShadow: "0 6px 18px rgba(200,169,81,0.3)" }}>
            Complete ✓
          </button>
        )}
      </div>
    </div>
  );
}

// ── Prayer Selection Card ──────────────────────────────────────────────────────
function PrayerCard({ prayer, onSelect }) {
  const isFard = prayer.type === "fard";
  return (
    <button onClick={() => onSelect(prayer)}
      className="w-full press text-left"
      style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`,
               boxShadow: "0 4px 16px rgba(10,8,6,0.07)", marginBottom: 10,
               display: "flex", overflow: "hidden" }}>
      {/* Colour bar */}
      <div style={{ width: 5, flexShrink: 0,
                    background: isFard ? C.primary : C.accentDark }} />
      <div style={{ flex: 1, padding: "14px 14px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                      marginBottom: 6 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: isFard ? C.primary : C.accentDark }}>
                {prayer.name}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                              background: isFard ? `${C.primary}12` : `${C.accent}20`,
                              color: isFard ? C.primary : C.accentDark }}>
                {isFard ? "FARD" : prayer.type?.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: 12, color: C.muted }}>{prayer.meaning} · {prayer.time}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 22, fontFamily: "serif", color: C.muted, direction: "rtl" }}>
              {prayer.arabic}
            </p>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>
              {prayer.totalRakaat} rak'ahs
            </p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: C.subtle, lineHeight: 1.5, marginBottom: 10 }}>
          {prayer.importance}
        </p>
        {/* Rak'ah breakdown pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {prayer.rakaat.map((r, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px",
                                    borderRadius: 99, background: C.parchment, color: C.body }}>
              {r.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingRight: 14 }}>
        <span style={{ color: C.subtle, fontSize: 20 }}>›</span>
      </div>
    </button>
  );
}

// ── Mode Selection Modal ───────────────────────────────────────────────────────
function ModeModal({ prayer, onSelect, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                  display: "flex", alignItems: "flex-end", zIndex: 100 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: "100%", background: C.ivory, borderRadius: "20px 20px 0 0",
                  padding: "24px 20px", paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: C.border,
                      margin: "0 auto 20px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 4 }}>
          {prayer.name} Prayer
        </h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Choose how you want to follow the prayer
        </p>

        {/* Step-by-step beginner */}
        <button onClick={() => onSelect("beginner", "steps")}
          style={{ width: "100%", background: C.primary, borderRadius: 14, border: "none",
                   padding: "16px 18px", marginBottom: 10, cursor: "pointer",
                   textAlign: "left", boxShadow: "0 6px 18px rgba(15,61,46,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🌱</span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 2 }}>
                Beginner Mode — Step by Step
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                Larger text · Guided one step at a time · Full explanations
              </p>
            </div>
          </div>
        </button>

        {/* Step-by-step standard */}
        <button onClick={() => onSelect("standard", "steps")}
          style={{ width: "100%", background: "white", borderRadius: 14,
                   border: `1.5px solid ${C.border}`, padding: "16px 18px", marginBottom: 10,
                   cursor: "pointer", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>📿</span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 }}>
                Standard Mode — Step by Step
              </p>
              <p style={{ fontSize: 12, color: C.muted }}>
                Full recitations · Follow along one step at a time
              </p>
            </div>
          </div>
        </button>

        {/* Scroll (reference) mode */}
        <button onClick={() => onSelect("standard", "scroll")}
          style={{ width: "100%", background: "white", borderRadius: 14,
                   border: `1.5px solid ${C.border}`, padding: "16px 18px", cursor: "pointer",
                   textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>📜</span>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 }}>
                Reference Mode — Full Scroll
              </p>
              <p style={{ fontSize: 12, color: C.muted }}>
                All rak'ahs visible · Browse at your own pace
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PrayerGuide() {
  const navigate = useNavigate();
  const [view,        setView]       = useState("list");   // list | detail
  const [selected,    setSelected]   = useState(null);
  const [mode,        setMode]       = useState("standard"); // standard | beginner
  const [viewMode,    setViewMode]   = useState("steps");   // steps | scroll
  const [showModal,   setShowModal]  = useState(false);
  const [tab,         setTab]        = useState("fard");    // fard | sunnah

  function handleSelectPrayer(prayer) {
    setSelected(prayer);
    setShowModal(true);
  }

  function handleModeSelect(m, vm) {
    setMode(m);
    setViewMode(vm);
    setShowModal(false);
    setView("detail");
  }

  function handleBack() {
    setView("list");
    setSelected(null);
    setShowModal(false);
  }

  // Render detail view
  if (view === "detail" && selected) {
    return viewMode === "scroll"
      ? <PrayerScrollView prayer={selected} mode={mode} onBack={handleBack} />
      : <PrayerStepMode   prayer={selected} mode={mode} onBack={handleBack} />;
  }

  // List view
  return (
    <div className="screen bg-ivory">
      {/* Header */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background: `linear-gradient(150deg,${C.primaryDark},${C.primary} 55%,${C.primaryLight})` }}>
        <div className="flex items-center px-4 py-3 gap-2">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center press"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "white", fontSize: 22 }}>‹</span>
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ color: "white", fontWeight: 800, fontSize: 17 }}>Prayer Guide</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              Full step-by-step with recitations
            </p>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", padding: "0 16px 0" }}>
          {[["fard","Obligatory (Fard)"],["sunnah","Sunnah & Nafl"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
                       background: "transparent", border: "none", cursor: "pointer",
                       color: tab === id ? "white" : "rgba(255,255,255,0.45)",
                       borderBottom: tab === id ? `2px solid ${C.accent}` : "2px solid transparent",
                       transition: "all 0.18s" }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Intro banner */}
      <div style={{ background: `${C.primary}0A`, padding: "12px 16px",
                    borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, color: C.body, lineHeight: 1.6 }}>
          {tab === "fard"
            ? "The Prophet ﷺ said: 'The first matter that the servant will be brought to account for is the prayer.' Select a prayer to begin the full guided lesson."
            : "Additional prayers (Sunnah and Nafl) bring you closer to Allah and fill the gaps in your obligatory prayers."}
        </p>
      </div>

      {/* Prayer list */}
      <div className="scroll-area px-4 pt-4">
        {(tab === "fard" ? PRAYERS : SUNNAH_PRAYERS).map(p => (
          <PrayerCard key={p.id} prayer={p} onSelect={handleSelectPrayer} />
        ))}
        <div style={{ height: 24 }} />
      </div>

      {/* Mode selection modal */}
      {showModal && selected && (
        <ModeModal prayer={selected} onSelect={handleModeSelect} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
