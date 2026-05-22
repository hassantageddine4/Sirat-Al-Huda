// src/pages/account/WidgetThemes.jsx
// Widget theme picker — taps push the selected theme to the iOS widget
// via SiratWidget.setTheme().

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../../components/common/ScreenHeader";
import Icon from "../../components/common/Icon";
import { pushWidgetTheme } from "../../lib/siratWidget";

const THEMES = [
  { key: "emerald",   name: "Emerald",      bgFrom: "#0F3D2E", bgTo: "#082319", accent: "#C8A951", textLight: true },
  { key: "forest",    name: "Forest",       bgFrom: "#266B40", bgTo: "#0F3821", accent: "#EEDB9E", textLight: true },
  { key: "beige",     name: "Beige",        bgFrom: "#F5E8CE", bgTo: "#D9C29A", accent: "#28663D", textLight: false },
  { key: "sandstone", name: "Sandstone",    bgFrom: "#E6D1AE", bgTo: "#B89A6B", accent: "#52301A", textLight: false },
  { key: "gold",      name: "Gold & Black", bgFrom: "#1A1407", bgTo: "#050505", accent: "#F2CC66", textLight: true },
  { key: "sapphire",  name: "Sapphire",     bgFrom: "#0D2E6B", bgTo: "#05143A", accent: "#BCD9FA", textLight: true },
  { key: "royal",     name: "Royal",        bgFrom: "#3D196B", bgTo: "#1F0A38", accent: "#F2D38C", textLight: true },
  { key: "crimson",   name: "Crimson",      bgFrom: "#6B141F", bgTo: "#33070D", accent: "#F2D9A0", textLight: true },
  { key: "midnight",  name: "Midnight",     bgFrom: "#14141F", bgTo: "#05050A", accent: "#B8C7F2", textLight: true },
  { key: "silver",    name: "Silver",       bgFrom: "#D9E0EB", bgTo: "#9EAEC2", accent: "#334D73", textLight: false },
  { key: "teal",      name: "Teal",         bgFrom: "#0A4D57", bgTo: "#05242B", accent: "#EBD98C", textLight: true },
];

export default function WidgetThemes() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem("widget_theme") || "emerald"; }
    catch { return "emerald"; }
  });

  const handleSelect = async (themeKey) => {
    setSelected(themeKey);
    try { localStorage.setItem("widget_theme", themeKey); } catch {}
    try { await pushWidgetTheme(themeKey); } catch (e) { console.warn(e); }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <ScreenHeader title="Widget Themes" onBack={() => navigate(-1)} />
      <div className="px-4 pt-4 pb-32">
        <p className="text-sm text-emerald-900/60 mb-4 leading-snug">
          Choose a color theme for your Home Screen and Lock Screen widgets.
          Changes apply within a few seconds.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => {
            const isSelected = selected === t.key;
            const textColor = t.textLight ? "#ffffff" : "#0e1e14";
            const subColor = t.textLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
            return (
              <button
                key={t.key}
                onClick={() => handleSelect(t.key)}
                className={`relative aspect-[5/3] rounded-2xl overflow-hidden text-left transition-transform ${
                  isSelected ? "ring-2 ring-emerald-700 scale-[1.02]" : "ring-1 ring-black/10"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${t.bgFrom}, ${t.bgTo})`,
                }}
              >
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                  <div
                    className="text-[9px] font-bold tracking-widest"
                    style={{ color: t.accent }}
                  >
                    NEXT PRAYER
                  </div>
                  <div>
                    <div
                      className="text-xl font-bold leading-tight"
                      style={{ color: textColor }}
                    >
                      Maghrib
                    </div>
                    <div
                      className="text-[11px] font-medium leading-tight"
                      style={{ color: subColor }}
                    >
                      9:08 PM
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2">
                  <div
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur"
                    style={{
                      background: t.textLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
                      color: t.textLight ? "#ffffff" : "#0e1e14",
                    }}
                  >
                    {t.name}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center shadow">
                    <Icon name="check" className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
