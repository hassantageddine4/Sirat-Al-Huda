// src/services/askSirat.js
// Frontend client for the Ask Sirat Edge Function.
// Performs simple keyword retrieval over app content, then asks the backend.

import { supabase } from "../lib/supabase";
import { DUAS } from "../data/duas";
import { DAILY_SUNNAHS, SUNNAH_PRAYERS_SUNNI, SUNNAH_PRAYERS_SHIA } from "../data/sunnahs";
import { SINS_MAJOR_SUNNI, SINS_MAJOR_SHIA, SINS_MINOR_SUNNI, SINS_MINOR_SHIA } from "../data/sins";
import {
  SCHOOLS_SUNNI, SCHOOLS_SHIA,
  BELIEFS_SUNNI, BELIEFS_SUNNI_AQEEDAH,
  BELIEFS_SHIA, BELIEFS_SHIA_FURU,
  SCHOLARS_SUNNI_CLASSICAL, SCHOLARS_SUNNI_LIVING,
  SCHOLARS_SHIA_CLASSICAL, SCHOLARS_SHIA_LIVING,
} from "../data/scholarsBeliefs";

const STOPWORDS = new Set([
  "the","a","an","of","to","in","is","it","and","or","for","on","at","by","with","as","that","this","these","those","be","am","are","was","were","been","being","do","does","did","have","has","had","i","you","he","she","we","they","me","my","your","his","her","our","their","what","when","where","why","how","who","which","can","could","should","would","may","might","will","shall","not","no","but","if","so","than","then","there","here","about","into","over","under","just","also","like","very","much","more","most","some","any","all","each","every","one","two","three"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function score(item, qTokens, fields) {
  const hay = fields.map(f => String(item[f] || "")).join(" ").toLowerCase();
  let s = 0;
  for (const t of qTokens) {
    if (hay.includes(t)) s += 1;
  }
  return s;
}

function retrieveSources(question, branch) {
  const q = tokenize(question);
  if (q.length === 0) return [];
  const results = [];

  function add(items, type, refFn, textFn, fields) {
    for (const it of items) {
      const s = score(it, q, fields);
      if (s >= 2) results.push({ s, type, ref: refFn(it), text: textFn(it) });
    }
  }

  add(DUAS.filter(d => !branch || !d.tradition || d.tradition === "both" || d.tradition === branch),
    "Dua", d => d.title,
    d => `${d.transliteration}. Meaning: ${d.translation}. Source: ${d.source}. ${d.note || ""}`,
    ["title","translation","transliteration","note","source"]);

  const sunnahPrayers = branch === "shia" ? SUNNAH_PRAYERS_SHIA : SUNNAH_PRAYERS_SUNNI;
  add(sunnahPrayers, "Sunnah Prayer", p => `${p.prayer} ${p.when}`,
    p => `${p.prayer} sunnah prayer ${p.when} — ${p.rakahs} rakahs (${p.emphasis}). ${p.note}`,
    ["prayer","when","note","emphasis"]);

  const sinsMajor = branch === "shia" ? SINS_MAJOR_SHIA : SINS_MAJOR_SUNNI;
  const sinsMinor = branch === "shia" ? SINS_MINOR_SHIA : SINS_MINOR_SUNNI;
  add([...sinsMajor, ...sinsMinor], "Sin", s => s.title,
    s => `${s.desc} Qur'an ${s.quran.ref}: "${s.quran.text}". Hadith (${s.hadith.source}): "${s.hadith.text}"`,
    ["title","desc"]);

  const schools = branch === "shia" ? SCHOOLS_SHIA : SCHOOLS_SUNNI;
  add(schools, "School", x => x.name,
    x => `${x.name} (${x.arabicName}). Founder: ${x.founder}. Region: ${x.region}. Methodology: ${x.methodology}. Distinctive: ${x.distinctive}`,
    ["name","founder","methodology","distinctive","region","population"]);

  const beliefs = branch === "shia"
    ? [...BELIEFS_SHIA, ...BELIEFS_SHIA_FURU]
    : [...BELIEFS_SUNNI, ...BELIEFS_SUNNI_AQEEDAH];
  add(beliefs, "Belief", x => x.title,
    x => `${x.desc} ${x.detail} Source: ${x.source}`,
    ["title","desc","detail","source"]);

  const scholars = branch === "shia"
    ? [...SCHOLARS_SHIA_CLASSICAL, ...SCHOLARS_SHIA_LIVING]
    : [...SCHOLARS_SUNNI_CLASSICAL, ...SCHOLARS_SUNNI_LIVING];
  add(scholars, "Scholar", x => x.name,
    x => `${x.name} (${x.lifespan}, ${x.region}). School: ${x.school}. Bio: ${x.bio} Key positions: ${x.positions}. Rulings: ${x.rulings || ""}`,
    ["name","school","bio","positions","rulings","works"]);

  results.sort((a, b) => b.s - a.s);
  return results.slice(0, 8).map(({ type, ref, text }) => ({ type, ref, text }));
}

export async function askSirat({ question, branch, scholar }) {
  const sources = retrieveSources(question, branch);
  const { data, error } = await supabase.functions.invoke("ask-sirat", {
    body: { question, branch, scholar, sources },
  });
  if (error) throw new Error(error.message || "Ask Sirat failed");
  return { answer: data?.answer || "", citations: data?.citations || [], sourcesUsed: sources };
}
