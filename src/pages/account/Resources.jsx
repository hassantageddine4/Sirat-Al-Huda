// src/pages/account/Resources.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Browser } from "@capacitor/browser";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

const APIS = [
  { name: "Quran.com API", desc: "Surah metadata, recitations, reciters", url: "https://api.quran.com" },
  { name: "Al-Quran Cloud", desc: "Arabic text + English translations (5 editions)", url: "https://alquran.cloud" },
  { name: "Sunnah.com Hadith API", desc: "Six canonical Sunni hadith collections", url: "https://sunnah.com" },
  { name: "Thaqalayn.net", desc: "Twelver Shia hadith — 14 books", url: "https://thaqalayn.net" },
  { name: "Aladhan API", desc: "Prayer times + Islamic (Hijri) calendar", url: "https://aladhan.com/prayer-times-api" },
  { name: "Al-Islam.org", desc: "Major reference for Shia content, scholars, and hadith", url: "https://al-islam.org" },
  { name: "jsDelivr CDN", desc: "Sunni hadith collection data", url: "https://www.jsdelivr.com" },
];

const TRANSLATORS = [
  { name: "Saheeh International", desc: "Modern, widely-used English translation" },
  { name: "Mohammed Marmaduke Pickthall", desc: "Classical English translation, 1930" },
  { name: "Abdullah Yusuf Ali", desc: "Poetic English translation with commentary, 1934" },
  { name: "Muhammad Asad", desc: "Rationalist English translation, 1980" },
  { name: "Hilali & Khan", desc: "Saudi-endorsed English translation" },
];

const RECITERS = [
  { name: "Mishary Rashid Alafasy", desc: "Kuwaiti qari, beloved worldwide for warm tone" },
  { name: "Abdul Basit Abdus Samad", desc: "Egyptian master, the gold standard of qira'ah" },
  { name: "Mahmoud Khalil Al-Husary", desc: "Authority on tajweed, teaching style recitation" },
  { name: "Saad Al-Ghamdi", desc: "Saudi imam known for clear, measured recitation" },
];

export default function Resources() {
  const navigate = useNavigate();
  const open = (url) => Browser.open({ url });

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader title="Resources" subtitle="المصادر" onBack={() => navigate(-1)} />
      <div className="scroll-area" style={{ padding: "16px 16px 40px" }}>
        <IntroCard />
        <Section title="Data Sources & APIs" items={APIS} onOpen={open} />
        <Section title="Qur'an Translators" items={TRANSLATORS} />
        <Section title="Reciters" items={RECITERS} />
        <Acknowledgments />
      </div>
    </div>
  );
}

function IntroCard() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`,
      borderRadius: 16, padding: "18px 20px", color: "white",
      marginBottom: 20, boxShadow: "0 6px 20px rgba(15,61,46,0.18)",
    }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500, marginBottom: 8 }}>
        Sources & Acknowledgments
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>
        Sirat Al Huda is built on the work of generations of scholars, translators, reciters, and open-source contributors. This page credits the sources that make the app possible.
      </div>
    </div>
  );
}

function Section({ title, items, onOpen }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} onClick={() => it.url && onOpen && onOpen(it.url)}
            className={it.url ? "press" : ""}
            style={{
              background: "white", borderRadius: 12,
              border: `0.5px solid ${C.hairline}`,
              padding: "12px 14px", display: "flex",
              alignItems: "center", gap: 10,
              cursor: it.url ? "pointer" : "default",
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{it.desc}</div>
            </div>
            {it.url && <Icon name="arrowRight" size={14} className="text-muted" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Acknowledgments() {
  return (
    <div style={{ marginTop: 8, padding: "16px 18px", background: "white", borderRadius: 12, border: `0.5px solid ${C.hairline}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>
        With Gratitude
      </div>
      <div style={{ fontSize: 12, color: C.body, lineHeight: 1.6 }}>
        To all the scholars, hafiz, translators, and reciters whose lifelong work in preserving and transmitting the Qur'an, hadith, and Islamic knowledge made this app possible. May Allah ﷻ reward them, their families, and accept their efforts.
      </div>
    </div>
  );
}
