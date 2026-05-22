import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import { getRecommendation } from "../../services/recommendations";
import { usePrayerNotifications } from "../../hooks/usePrayerNotifications";

export default function RecommendedCard() {
  const navigate = useNavigate();
  const { prayerTimes } = usePrayerNotifications();
  const [rec, setRec] = useState(null);

  useEffect(() => {
    const compute = () => setRec(getRecommendation({ prayerTimings: prayerTimes }));
    compute();
    const interval = setInterval(compute, 5 * 60 * 1000);
    const onFocus = () => compute();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [prayerTimes]);

  if (!rec) return null;

  return (
    <button
      onClick={() => navigate(rec.route)}
      className="press w-full text-left rounded-2xl mb-4 overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #0F3D2E 0%, #1A5C44 100%)",
        boxShadow: "0 4px 20px rgba(15, 61, 46, 0.15)",
        height: 185,
      }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: "linear-gradient(180deg, #C8A951, #A88730)",
        }}
      />
      <div className="p-4 pl-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(200, 169, 81, 0.18)",
              color: "#D9BF7A",
            }}>
            <Icon name="sparkle" size={10} />
            Recommended
          </span>
          <Icon name="forward" size={16} className="text-white/50" />
        </div>
        <div className="flex items-start gap-3.5">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(200, 169, 81, 0.15)",
              color: "#D9BF7A",
              boxShadow: "inset 0 0 0 1px rgba(200, 169, 81, 0.25)",
            }}>
            <Icon name={rec.icon || "sparkle"} size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-semibold text-white leading-tight tracking-tight mb-0.5">
              {rec.title}
            </p>
            <p className="text-[12px] text-white/60 leading-snug mb-2">
              {rec.subtitle}
            </p>
            {rec.reason && (
              <p
                className="text-[12px] text-white/75 leading-relaxed line-clamp-2"
                style={{ fontStyle: "italic" }}>
                {rec.reason}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
