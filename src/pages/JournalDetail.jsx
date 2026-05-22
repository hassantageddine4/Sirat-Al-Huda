import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../components/common/ScreenHeader";
import Icon from "../components/common/Icon";
import { LoadingState, ErrorRetry } from "../components/common/DataStates";
import { getEntry } from "../services/journalService";
import { useJournal } from "../hooks/useJournal";

const C = {
  ivory: "#FAF7F2",
  ink: "#1C1814",
  muted: "rgba(28,24,20,0.55)",
  primary: "#0F3D2E",
  accentDark: "#A88730",
  border: "rgba(28,24,20,0.10)",
};

const MOODS = [
  { id: "grateful",   label: "Grateful",   icon: "sparkle" },
  { id: "reflective", label: "Reflective", icon: "moon" },
  { id: "hopeful",    label: "Hopeful",    icon: "sunrise" },
  { id: "struggling", label: "Struggling", icon: "heart" },
  { id: "peaceful",   label: "Peaceful",   icon: "duaBook" },
];

export default function JournalDetail() {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const { update } = useJournal();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [titleDraft, setTitleDraft] = useState("");
  const [contentDraft, setContentDraft] = useState("");
  const [moodDraft, setMoodDraft] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getEntry(entryId);
    if (err) {
      setError(err);
    } else {
      setEntry(data);
      setTitleDraft(data?.title ?? "");
      setContentDraft(data?.content ?? "");
      setMoodDraft(data?.mood ?? null);
    }
    setLoading(false);
  }, [entryId]);

  useEffect(() => { load(); }, [load]);

  const dateStr = useMemo(() => {
    if (!entry?.created_at) return "";
    const d = new Date(entry.created_at);
    return d.toLocaleDateString(undefined, {
      month: "long", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }, [entry]);

  const handleSave = async () => {
    if (!titleDraft.trim() || !contentDraft.trim()) {
      alert("Title and content are required.");
      return;
    }
    setSaving(true);
    const result = await update(entry.id, {
      title: titleDraft.trim(),
      content: contentDraft.trim(),
      mood: moodDraft,
    });
    setSaving(false);
    if (result?.error) {
      alert(result.error);
      return;
    }
    setEntry(result.data);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitleDraft(entry?.title ?? "");
    setContentDraft(entry?.content ?? "");
    setMoodDraft(entry?.mood ?? null);
    setEditing(false);
  };

  return (
    <div className="screen" style={{ background: C.ivory, minHeight: "100vh" }}>
      <ScreenHeader
        title="Entry"
        onBack={() => navigate(-1)}
        rightAction={!loading && !error && entry && !editing ? { label: "Edit", icon: "edit", onClick: () => setEditing(true) } : null}
      />

      <div className="scroll-area" style={{ padding: "8px 16px 32px" }}>
        {loading && <LoadingState />}
        {error && <ErrorRetry message={error} onRetry={load} />}

        {!loading && !error && entry && !editing && (
          <article className="rounded-2xl bg-white/70 border border-border/60 p-5">
            <p className="text-[12px] text-muted mb-2">{dateStr}</p>

            {entry.title && (
              <h1 className="text-[22px] font-semibold text-ink mb-3 leading-tight">
                {entry.title}
              </h1>
            )}

            {entry.mood && (() => {
              const m = MOODS.find(x => x.id === entry.mood);
              return m ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-parchment text-primary/90 mb-4">
                  <Icon name={m.icon} size={12} />
                  {m.label}
                </span>
              ) : null;
            })()}

            <p className="text-[15px] text-body leading-relaxed whitespace-pre-wrap mt-1">
              {entry.content}
            </p>
          </article>
        )}

        {!loading && !error && entry && editing && (
          <section className="rounded-2xl bg-white/70 border border-border/60 p-4">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value.slice(0, 100))}
              placeholder="Title"
              maxLength={100}
              className="w-full bg-transparent text-[18px] font-semibold text-ink placeholder:text-muted/70 focus:outline-none mb-3"
            />

            <textarea
              value={contentDraft}
              onChange={(e) => setContentDraft(e.target.value.slice(0, 2000))}
              placeholder="What's on your heart today?"
              rows={10}
              className="w-full resize-none bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none leading-relaxed"
            />

            <div className="mt-3 flex gap-1.5 flex-wrap">
              {MOODS.map(m => {
                const active = moodDraft === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMoodDraft(active ? null : m.id)}
                    className={`press flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                      active ? "bg-primary text-ivory" : "bg-parchment text-body hover:bg-parchment/70"
                    }`}>
                    <Icon name={m.icon} size={12} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="press text-[14px] font-semibold text-muted px-4 py-1.5">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !titleDraft.trim() || !contentDraft.trim()}
                className={`press text-[14px] font-semibold px-4 py-1.5 rounded-full ${
                  saving || !titleDraft.trim() || !contentDraft.trim()
                    ? "bg-muted/20 text-muted cursor-not-allowed"
                    : "bg-primary text-ivory"
                }`}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
