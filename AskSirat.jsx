// src/pages/AskSirat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { useBranch } from "../hooks/useBranch";
import { useApp } from "../context/AppContext";
import { askSirat } from "../services/askSirat";

const C = {
  primary: "#0F3D2E", primaryLight: "#1A5C44",
  gold: "#C8A951", goldLight: "#D9BF7A",
  ivory: "#FAF7F2", ink: "#1A1614", body: "#3A342C",
  muted: "#7A7268", hairline: "#E8E2D8",
};

const SUGGESTED = [
  "How do I pray Salat al-Layl?",
  "What should I recite before sleeping?",
  "What are the best times to make dua?",
  "What is Tasbih al-Zahra?",
  "What are the benefits of Ayat al-Kursi?",
  "How do Sunni and Shia prayer differ?",
];

export default function AskSirat() {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const { isOnline } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text) {
    if (!isOnline) return;
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setErr(null);
    setInput("");
    setMessages(m => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const { answer, sourcesUsed } = await askSirat({ question: q, branch, scholar: null });
      setMessages(m => [...m, { role: "assistant", content: answer, sources: sourcesUsed }]);
    } catch (e) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScreenHeader title="Ask Sirat" subtitle="إسأل صراط" onBack={() => navigate(-1)} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
        {messages.length === 0 && <EmptyState onPick={send} isOnline={isOnline} />}
        {messages.map((m, i) => <Bubble key={i} m={m} />)}
        {loading && <LoadingBubble />}
        {err && (
          <div style={{ background: "#FEE", border: "0.5px solid #E5A8A8", color: "#A23",
            padding: "12px 14px", borderRadius: 12, marginTop: 12, fontSize: 13 }}>
            {err}
          </div>
        )}
      </div>

      <div style={{
        position: "sticky", bottom: 0, background: C.ivory,
        borderTop: `0.5px solid ${C.hairline}`, padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
      }}>
        {isOnline ? (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about prayer, hadith, duas..."
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 18,
                border: `0.5px solid ${C.hairline}`, background: "white",
                fontSize: 16, color: C.ink, resize: "none", maxHeight: 100, outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} className="press" style={{
              width: 40, height: 40, borderRadius: 999, border: "none",
              background: input.trim() && !loading ? C.primary : C.hairline,
              color: "white", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="arrowUp" size={18} />
            </button>
          </div>
        ) : (
          <OfflineCompose />
        )}
      </div>
    </div>
  );
}

function OfflineCompose() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 14,
      background: "white", border: `0.5px solid ${C.hairline}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 999, flexShrink: 0,
        background: `${C.gold}18`, color: C.gold,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <WifiOffGlyph />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>
          Ask Sirat needs internet
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
          Reconnect to ask new questions. Bookmarks, hadith, and Qur'an still work offline.
        </div>
      </div>
    </div>
  );
}

function WifiOffGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1l22 22" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function EmptyState({ onPick, isOnline }) {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`,
        borderRadius: 16, padding: "20px 22px", color: "white",
        marginBottom: 18, boxShadow: "0 6px 20px rgba(15,61,46,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Icon name="sparkle" size={18} />
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500 }}>Ask Sirat</div>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>
          Source-backed answers about prayer, Qur'an, hadith, duas, and Islamic practice. For binding rulings, consult a qualified scholar.
        </div>
      </div>

      {!isOnline ? (
        <div style={{
          background: "white", border: `0.5px solid ${C.hairline}`,
          borderRadius: 14, padding: "16px 16px", textAlign: "center",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999, margin: "4px auto 12px",
            background: `${C.gold}18`, color: C.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <WifiOffGlyph />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
            You're offline
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
            Ask Sirat needs an internet connection to answer questions. Hadith, Qur'an, prayer times, and your bookmarks all work offline.
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>
            Try asking
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTED.map((q, i) => (
              <button key={i} onClick={() => onPick(q)} className="press" style={{
                background: "white", border: `0.5px solid ${C.hairline}`,
                borderRadius: 12, padding: "12px 14px", textAlign: "left",
                fontSize: 13, color: C.body, cursor: "pointer",
              }}>{q}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Bubble({ m }) {
  const isUser = m.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 10 }}>
      <div style={{
        maxWidth: "85%", padding: "10px 14px", borderRadius: 16,
        background: isUser ? C.primary : "white",
        color: isUser ? "white" : C.body,
        border: isUser ? "none" : `0.5px solid ${C.hairline}`,
        fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap",
      }}>
        {m.content}
        {!isUser && m.sources && m.sources.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.sources.map((s, i) => (
              <div key={i} style={{
                background: `${C.gold}15`, border: `0.5px solid ${C.gold}40`,
                borderRadius: 999, padding: "3px 10px",
                fontSize: 10, color: C.gold, fontWeight: 600,
              }}>{s.type}: {s.ref}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
      <div style={{
        padding: "12px 16px", borderRadius: 16,
        background: "white", border: `0.5px solid ${C.hairline}`,
        color: C.muted, fontSize: 13, fontStyle: "italic",
      }}>
        Searching sources...
      </div>
    </div>
  );
}
