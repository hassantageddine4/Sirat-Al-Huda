// src/pages/Notifications.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

const TYPE_ICON  = { like:"♥", comment:"💬" };
const TYPE_COLOR = { like:"#EF4444", comment:"#C8A951" };

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications, unreadCount, loading, loadingMore,
    error, hasMore, refresh, loadMore, markRead, markAllRead,
  } = useNotifications();

  async function handleTap(notif) {
    if (!notif.read) await markRead(notif.id);
    if (notif.post_id) navigate("/community");
  }

  return (
    <div className="screen bg-ivory">

      {/* ── Header ── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background:"linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs font-semibold mt-0.5" style={{ color:"#22C55E" }}>
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="press text-sm font-semibold"
              style={{ color:"#C8A951" }}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center justify-between"
          style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <button onClick={refresh} className="text-accent text-sm font-bold ml-3">Retry</button>
        </div>
      )}

      {/* ── List ── */}
      <div className="scroll-area">
        {loading && !notifications.length ? (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center pt-20 px-8">
            <p className="text-5xl mb-4">🔔</p>
            <p className="text-white font-bold text-lg mb-2">No notifications yet</p>
            <p className="text-white/40 text-sm leading-relaxed">
              When someone likes or comments on your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <>
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleTap(notif)}
                className="w-full text-left press flex items-center gap-3 px-4 py-3.5 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: notif.read ? "transparent" : "rgba(26,43,31,0.8)",
                }}>
                {/* Unread dot */}
                <div className="w-2 flex-shrink-0 flex items-center justify-center">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full" style={{ background:"#22C55E" }} />
                  )}
                </div>

                {/* Type icon */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background:`${TYPE_COLOR[notif.type]}1A` }}>
                  <span style={{ color: TYPE_COLOR[notif.type], fontSize:18 }}>
                    {TYPE_ICON[notif.type]}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-snug truncate">
                    {notif.displayText}
                  </p>
                  {notif.post_title && (
                    <p className="text-xs mt-0.5 truncate" style={{ color:"#C8A951" }}>
                      "{notif.post_title}"
                    </p>
                  )}
                  <p className="text-white/35 text-xs mt-1">{notif.timeAgo}</p>
                </div>

                <span className="text-white/20 text-lg flex-shrink-0">›</span>
              </button>
            ))}

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-4 text-sm font-semibold text-accent/60 press">
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}
