// src/components/prayer/PrayerWalkthrough.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Main step-by-step prayer screen.
//
// Layout:
//   1. Top bar: close × only (branch is read from the app-wide Profile setting)
//   2. Header: prayer title, rak'ah/step counters, progress bar
//   3. Pose stage (centered figure on cream plate)
//   4. Instruction block (title + body + tip + madhhab note)
//   5. Recitation card (if the step has one)
//   6. Navigation buttons: Previous / Next (or Complete on last step)
//
// Madhhab:
//   The user's branch (sunni / shia) is sourced from localStorage on mount —
//   the same key the app-wide Profile branch picker writes to. There is no
//   per-walkthrough toggle; users change their branch from Profile and the
//   walkthrough silently follows.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import { flatSteps } from "../../data/prayerWalkthrough/stepBuilders";
import { useBranch } from "../../hooks/useBranch";
import IslamicGeometricBackground from "./IslamicGeometricBackground";
import PoseStage from "./PoseStage";
import InstructionBlock from "./InstructionBlock";
import RecitationCard from "./RecitationCard";
import QuranInlineSurah from "./QuranInlineSurah";
import WalkthroughHeader from "./WalkthroughHeader";
import WalkthroughNavBar from "./WalkthroughNavBar";
import Icon from "../common/Icon";

const BG_TOP = "#0a2a1c";
const BG_BOTTOM = "#03100b";

function haptic(kind = "soft") {
  try {
    if (kind === "success") {
      Haptics.notification({ type: NotificationType.Success });
    } else if (kind === "light") {
      Haptics.impact({ style: ImpactStyle.Light });
    } else {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {}
}

export default function PrayerWalkthrough({ prayer, initialMadhhab, onClose }) {
  const navigate = useNavigate();

  // Branch is locked to the app-wide setting at mount time.
  // The caller can override via `initialMadhhab` for testing / special flows;
  // otherwise we read from localStorage (the Profile picker's source of truth).
  const { branch } = useBranch();
  const madhhab = useMemo(
    () => (initialMadhhab === "sunni" || initialMadhhab === "shia"
      ? initialMadhhab
      : (branch || "sunni")),
    [initialMadhhab, branch]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const flat = useMemo(() => flatSteps(prayer, madhhab), [prayer, madhhab]);
  const totalSteps = flat.length;
  const current = flat[Math.min(stepIndex, totalSteps - 1)];

  function goNext() {
    if (stepIndex >= totalSteps - 1) return;
    haptic("soft");
    setStepIndex(i => i + 1);
  }
  function goPrevious() {
    if (stepIndex <= 0) return;
    haptic("soft");
    setStepIndex(i => i - 1);
  }
  function complete() {
    haptic("success");
    setShowCompletion(true);
  }

  // Swipe gesture
  const touchStart = useRef(null);
  function onTouchStart(e) {
    const t = e.touches?.[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e) {
    if (!touchStart.current) return;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
      if (dx < 0) goNext(); else goPrevious();
    }
  }

  // Auto-scroll to top on step change
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  function handleClose() {
    haptic("light");
    if (onClose) onClose();
    else navigate(-1);
  }

  if (!current) return null;

  return (
    <div
      className="screen relative"
      style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}>

      {/* Background ornaments */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(46,140,98,0.28), transparent 60%)",
        }}
      />
      <IslamicGeometricBackground tileSize={70} lineOpacity={0.04} />

      {/* Top bar — close button only */}
      <div className="relative flex-shrink-0 pt-safe">
        <div className="flex items-center px-3.5 py-2.5">
          <button
            onClick={handleClose}
            aria-label="Close"
            className="press w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.6px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
            }}>
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      {/* Scroll content */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 pb-4" style={{ scrollBehavior: "smooth" }}>
        <div className="pt-2">
          <WalkthroughHeader
            prayer={prayer}
            currentRakahNumber={current.rakah}
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
          />
        </div>

        <div
          key={`${current.step.id}_${madhhab}`}
          className="flex flex-col gap-4 mt-5"
          style={{ animation: "stepSlide 360ms ease-out" }}>
          <PoseStage step={current.step} madhhab={madhhab} />
          <InstructionBlock step={current.step} />
          {current.step.recitation && <RecitationCard recitation={current.step.recitation} />}
          {current.step.chapterId && <QuranInlineSurah chapterId={current.step.chapterId} surahName={current.step.surahName} />}
        </div>

        {/* Footnote */}
        <div className="mt-6 text-center">
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }} className="italic">
            Sources & verification — content is being reviewed by qualified scholars before final shipping.
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="relative flex-shrink-0 px-4 pt-3 pb-3"
        style={{
          background: `linear-gradient(to top, ${BG_BOTTOM}, transparent)`,
        }}>
        <WalkthroughNavBar
          isFirstStep={stepIndex === 0}
          isLastStep={stepIndex === totalSteps - 1}
          onPrevious={goPrevious}
          onNext={goNext}
          onDone={complete}
        />
      </div>

      {/* Completion sheet */}
      {showCompletion && (
        <CompletionSheet
          prayer={prayer}
          onDismiss={() => {
            setShowCompletion(false);
            handleClose();
          }}
        />
      )}

      <style>{`
        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </div>
  );
}

// ─── Completion sheet ───────────────────────────────────────────────────────

function CompletionSheet({ onDismiss }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onDismiss}>
      <div
        className="w-full max-w-md rounded-t-3xl p-6 pt-5"
        style={{
          background: "rgba(245, 244, 240, 0.98)",
          backdropFilter: "blur(20px)",
        }}
        onClick={e => e.stopPropagation()}>

        {/* drag indicator */}
        <div
          className="mx-auto mb-4 rounded-full"
          style={{ width: 36, height: 4, background: "rgba(0,0,0,0.18)" }}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FCDF8C, #D9A84D)",
              color: "white",
              boxShadow: "0 8px 20px rgba(217,168,77,0.3)",
            }}>
            <Icon name="check" size={26} />
          </div>

          <div className="text-center">
            <h2
              className="font-semibold mb-1"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 22,
                color: "#1C1814",
              }}>
              Prayer Complete
            </h2>
            <p
              className="italic"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 13,
                color: "#666",
              }}>
              Taqabbal-Allāhu minnā wa minkum
            </p>
            <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              May Allah accept it from us and from you
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="press w-full py-3.5 rounded-2xl font-semibold mt-3"
            style={{
              fontSize: 15,
              color: "#0a2e22",
              background: "linear-gradient(to bottom, #FCDF8C, #D9A84D)",
              boxShadow: "0 8px 18px rgba(217,168,77,0.32)",
            }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
