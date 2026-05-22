// src/pages/Community.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { usePosts, useComments } from "../hooks/usePosts";
import { useBranch } from "../hooks/useBranch";
import Icon from "../components/common/Icon";

const TAGS      = ["All","Quran","Hadith","Fiqh","Spirituality","General"];
const POST_TAGS = ["general","spirituality","quran","hadith","fiqh"];

const MOOD_ICON = { spirituality:"sparkle", quran:"bookOpen", hadith:"scroll", fiqh:"scales", general:"message" };

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60)    return "Just now";
  if (d < 3600)  return `${Math.floor(d/60)}m ago`;
  if (d < 86400) return `${Math.floor(d/3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
}

function tagToKey(label) {
  if (!label || label === "All") return null;
  return label.toLowerCase();
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Community() {
  const navigate = useNavigate();
  const { branch } = useBranch();
  const [activeTag,  setActiveTag]  = useState("All");
  const [composing,  setComposing]  = useState(false);
  const [postBody,   setPostBody]   = useState("");
  const [postTag,    setPostTag]    = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [openPost,   setOpenPost]   = useState(null);

  const {
    posts, likedIds, loading, loadingMore, error,
    hasMore, refresh, loadMore, create, remove, like,
  } = usePosts({ tag: tagToKey(activeTag) });

  async function handleCreate(e) {
    e.preventDefault();
    if (!postBody.trim()) return;
    setSubmitting(true);
    const { error: err } = await create({
      content: postBody,
      tag:     postTag,
      branch:  branch || "sunni",
    });
    setSubmitting(false);
    if (err) { alert(err); return; }
    setComposing(false); setPostBody(""); setPostTag("general");
  }

  return (
    <div className="screen bg-ivory">

      {/* ── Header ── */}
      <div className="flex-shrink-0 pt-safe"
        style={{ background:"linear-gradient(150deg,#082819 0%,#0F3D2E 55%,#1A5C44 100%)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <p className="text-xs text-white/50 mb-0.5">Community</p>
            <h1 className="text-2xl font-black text-white">Feed</h1>
          </div>
          <button
            onClick={() => setComposing(true)}
            className="press px-4 py-2 rounded-full font-bold text-sm"
            style={{ background:"#C8A951", color:"#082819" }}>
            + Post
          </button>
        </div>

        {/* Tag filter */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className="flex-shrink-0 press px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: activeTag === t ? "#C8A951" : "rgba(255,255,255,0.1)",
                color:      activeTag === t ? "#082819"  : "rgba(255,255,255,0.65)",
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 flex items-center justify-between">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="text-accent text-sm font-bold ml-3">Retry</button>
        </div>
      )}

      {/* Feed */}
      <div className="scroll-area px-4 py-4 space-y-3">
        {loading && !posts.length ? (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center pt-16">
            <div className="mb-3" style={{ color: "#C8A951" }}><Icon name="moon" size={36} /></div>
            <p className="text-muted text-sm">No posts yet. Start the conversation!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedIds.has(post.id)}
              onLike={() => like(post.id)}
              onComment={() => setOpenPost(post)}
              onDelete={() => { if (window.confirm("Delete this post?")) remove(post.id); }}
            />
          ))
        )}

        {hasMore && !loading && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3 text-sm font-semibold text-accent/70 press">
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        )}

        <div className="h-4" />
      </div>

      {/* Compose */}
      {composing && ReactDOM.createPortal(
        <div className="fixed inset-0 flex flex-col animate-fade-in"
          style={{ background:"#0F1B14", zIndex: 9999 }}>
          <div className="pt-safe flex-shrink-0" style={{ background:"#0F1B14" }} />
          <div className="flex flex-1 flex-col overflow-hidden">

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
              <button onClick={() => setComposing(false)} className="text-white/50 text-sm press">Cancel</button>
              <h2 className="text-white font-bold text-base">New Post</h2>
              <button
                onClick={handleCreate}
                disabled={submitting || !postBody.trim()}
                className="press px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-40"
                style={{ background:"#C8A951", color:"#082819" }}>
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              <textarea
                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-base placeholder-white/30 outline-none border border-white/10 resize-none"
                placeholder="Share your thoughts…"
                value={postBody}
                onChange={e => setPostBody(e.target.value)}
                maxLength={500}
                rows={8}
                autoFocus
              />
              <div className="flex justify-end">
                <span className="text-white/30 text-xs">{postBody.length}/500</span>
              </div>
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Tag</p>
                <div className="flex gap-2 flex-wrap">
                  {POST_TAGS.map(t => (
                    <button
                      key={t}
                      onClick={() => setPostTag(t)}
                      className="press px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: postTag === t ? "#C8A951" : "rgba(255,255,255,0.08)",
                        color:      postTag === t ? "#082819"  : "rgba(255,255,255,0.55)",
                      }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Icon name={MOOD_ICON[t]} size={14} />
                        {t.charAt(0).toUpperCase()+t.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {openPost && ReactDOM.createPortal(
        <PostDetailDrawer
          post={openPost}
          liked={likedIds.has(openPost.id)}
          onLike={() => like(openPost.id)}
          onClose={() => setOpenPost(null)}
        />
      )}
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, liked, onLike, onComment, onDelete }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in"
      style={{ background:"#1A2B1F", border:"1px solid #2A3F2E" }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background:"#0F3D2E" }}>
            <span className="text-accent font-black text-sm">{initials(post.users?.name)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{post.users?.name ?? "Anonymous"}</p>
            <p className="text-xs text-white/40">{timeAgo(post.created_at)}</p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ background:"#0F3D2E", color:"#C8A951" }}>
            {post.tag}
          </span>
        </div>

        {/* Content is the body */}
        <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      <div className="flex gap-1 px-3 pb-3 border-t border-white/5 pt-3">
        <button onClick={onLike}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl press transition-colors"
          style={{ background: liked ? "rgba(200,169,81,0.15)" : "rgba(255,255,255,0.05)" }}>
          <span style={{ color: liked ? "#C8A951" : "rgba(255,255,255,0.45)" }}>
            <Icon name="heart" size={20} />
          </span>
          <span className="text-xs font-semibold"
            style={{ color: liked ? "#C8A951" : "rgba(255,255,255,0.45)" }}>
            {post.likes ?? 0}
          </span>
        </button>

        <button onClick={onComment}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl press"
          style={{ background:"rgba(255,255,255,0.05)" }}>
          <span style={{ color:"rgba(255,255,255,0.45)", display:"inline-flex", alignItems:"center" }}>
            <Icon name="message" size={15} />
          </span>
          <span className="text-xs font-semibold text-white/45">
            {post.commentCount ?? 0}
          </span>
        </button>

        <div className="flex-1" />

        <button onClick={onDelete}
          className="px-3 py-2 rounded-xl press"
          style={{ background:"rgba(255,255,255,0.04)" }}>
          <span className="text-white/25 text-sm">🗑</span>
        </button>
      </div>
    </div>
  );
}

// ── PostDetailDrawer ──────────────────────────────────────────────────────────
function PostDetailDrawer({ post, liked, onLike, onClose }) {
  const { comments, loading, submitting, submit, remove } = useComments(post.id);
  const [draft, setDraft] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    const { error } = await submit(text);
    if (error) { setDraft(text); alert(error); }
  }

  return (
    <div className="fixed inset-0 flex items-end" style={{ background:"rgba(0,0,0,0.65)", zIndex: 9999 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full rounded-t-3xl overflow-hidden flex flex-col"
        style={{ background:"#0F1B14", maxHeight:"88vh" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background:"#0F3D2E" }}>
              <span className="text-accent font-black text-xs">{initials(post.users?.name)}</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">{post.users?.name ?? "Anonymous"}</p>
              <p className="text-white/40 text-xs">{timeAgo(post.created_at)}</p>
            </div>
            <div className="flex-1" />
            <button onClick={onLike}
              className="flex items-center gap-1.5 press px-3 py-1.5 rounded-full"
              style={{ background: liked ? "rgba(200,169,81,0.15)" : "rgba(255,255,255,0.07)" }}>
              <span style={{ color: liked ? "#C8A951" : "rgba(255,255,255,0.5)" }}>
                <Icon name="heart" size={20} />
              </span>
              <span className="text-xs font-semibold"
                style={{ color: liked ? "#C8A951" : "rgba(255,255,255,0.45)" }}>
                {post.likes ?? 0}
              </span>
            </button>
          </div>
          <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {loading && (
            <div className="flex justify-center pt-4">
              <div className="w-6 h-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
            </div>
          )}
          {!loading && comments.length === 0 && (
            <p className="text-white/30 text-sm text-center pt-4">No comments yet.</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background:"#1A2B1F", border:"1px solid #2A3F2E" }}>
                <span className="text-accent/80 font-bold text-xs">{initials(c.users?.name)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white text-xs font-bold">{c.users?.name ?? "Anonymous"}</p>
                  <p className="text-white/35 text-xs">{timeAgo(c.created_at)}</p>
                </div>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
              <button onClick={() => { if (window.confirm("Delete comment?")) remove(c.id); }}
                className="press text-white/20 text-xs self-start pt-0.5">✕</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}
          className="flex gap-3 px-4 py-3 flex-shrink-0 border-t border-white/10">
          <input
            className="flex-1 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none"
            style={{ background:"#1A2B1F", border:"1px solid #2A3F2E" }}
            placeholder="Write a comment…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            maxLength={300}
          />
          <button
            type="submit"
            disabled={!draft.trim() || submitting}
            className="w-10 h-10 rounded-full flex items-center justify-center press flex-shrink-0 disabled:opacity-40"
            style={{ background:"#C8A951" }}>
            <span className="text-primary font-black text-base">↑</span>
          </button>
        </form>
      </div>
    </div>
  );
}
