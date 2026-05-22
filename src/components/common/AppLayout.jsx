// src/components/common/AppLayout.jsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        fill={active ? "#0F3D2E" : "none"}
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
function QuranIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z"
        fill={active ? "#0F3D2E" : "none"}
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M15 3V7H20M8 12H16M8 16H13"
        stroke={active ? "#FAF7F2" : "#C4BDB0"}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PracticeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75"
        fill={active ? "#0F3D2E" : "none"} />
      <path d="M9 12L11 14L15 10"
        stroke={active ? "#FAF7F2" : "#C4BDB0"}
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CommunityIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75"
        fill={active ? "#0F3D2E" : "none"} />
      <circle cx="17" cy="8" r="2.5"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.5"
        fill={active ? "#0F3D2E" : "none"} />
      <path d="M3 19C3 16.2386 5.68629 14 9 14C12.3137 14 15 16.2386 15 19"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75" strokeLinecap="round" />
      <path d="M17 14C18.6569 14 21 15.3431 21 17.5"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        fill={active ? "#0F3D2E" : "none"}
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75" />
      <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20"
        stroke={active ? "#0F3D2E" : "#C4BDB0"}
        strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const TABS = [
  { path: "/",          label: "Home",      Icon: HomeIcon      },
  { path: "/quran",     label: "Qur'an",    Icon: QuranIcon     },
  { path: "/practice",  label: "Practice",  Icon: PracticeIcon  },
  { path: "/community", label: "Community", Icon: CommunityIcon },
  { path: "/profile",   label: "Profile",   Icon: ProfileIcon   },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const current  = location.pathname;

  // Notification badge — hook lives here so it persists across all tabs
  const { unreadCount } = useNotifications();

  return (
    <div className="screen">
      <div className="scroll-area">
        <Outlet />
      </div>

      {!current.startsWith("/practice/recitation") && <nav
        className="flex-shrink-0 bg-white border-t border-[#E8E2D8]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex">
          {TABS.map(({ path, label, Icon }) => {
            const active = current === path;
            const isCommunity = path === "/community";

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex-1 flex flex-col items-center pt-1 pb-0.5 press gap-0"
              >
                {/* Icon + optional notification badge */}
                <div className="relative">
                  <Icon active={active} />
                  {isCommunity && unreadCount > 0 && (
                    <div
                      className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full
                                 flex items-center justify-center px-1"
                      style={{ background: "#EF4444", border: "1.5px solid white" }}>
                      <span className="text-white font-black"
                        style={{ fontSize: 9, lineHeight: 1 }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                <span className={`text-[10px] font-medium tracking-wide ${
                  active ? "text-primary font-bold" : "text-[#C4BDB0]"
                }`}>
                  {label}
                </span>
                {active && <div className="w-1 h-1 rounded-full bg-accent" />}
              </button>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
