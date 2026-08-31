"use client";

import { useEffect, useState, useTransition } from "react";
import { Send, X } from "lucide-react";

import { createProjectCommentAction, deleteProjectCommentAction, listProjectCommentsAction } from "./actions";
import { Avatar } from "@/components/Avatar";
import type { ProjectComment } from "@/lib/types";

// Same relative-time formatting as PostCard.tsx's comment list — no shared
// util in this codebase for it, matching how it's kept local there too.
const formatRelativeTime = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
};

type StartupCommentsProps = {
  startupId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatarUrl: string;
};

export const StartupComments = ({ startupId, currentUserId, currentUserName, currentUserAvatarUrl }: StartupCommentsProps) => {
  const [comments, setComments] = useState<ProjectComment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    listProjectCommentsAction(startupId)
      .then((result) => {
        if (!cancelled) setComments(result);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [startupId]);

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    startTransition(async () => {
      try {
        const created = await createProjectCommentAction(startupId, text);
        setComments((prev) => [...(prev ?? []), created]);
      } catch {
        window.alert("Couldn't post that comment — try again.");
      }
    });
  };

  const removeComment = (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteProjectCommentAction(commentId);
        setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId));
      } catch {
        window.alert("Couldn't remove that comment — try again.");
      }
    });
  };

  return (
    <div className="glass mt-4 rounded-2xl p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Comments</h2>

      <div className="flex flex-col gap-3">
        {comments === null ? (
          <p className="text-xs text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet — be the first to say something.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              <Avatar id={comment.author.id} name={comment.author.fullName} avatarUrl={comment.author.avatarUrl} size="h-8 w-8" textSize="text-[11px]" />
              <div className="min-w-0 flex-1">
                <div className="rounded-2xl bg-muted-bg/70 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-text">{comment.author.fullName || "Unknown"}</span>
                    {comment.author.id === currentUserId ? (
                      <button
                        type="button"
                        onClick={() => removeComment(comment.id)}
                        aria-label="Delete comment"
                        className="ml-auto text-muted hover:text-danger"
                      >
                        <X className="h-3 w-3" strokeWidth={2} />
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-[13px] text-text">{comment.content}</p>
                </div>
                <div className="mt-0.5 pl-3 text-[10.5px] text-muted">{formatRelativeTime(comment.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center gap-2.5 border-t border-border/60 pt-3">
        <Avatar id={currentUserId} name={currentUserName} avatarUrl={currentUserAvatarUrl} size="h-8 w-8" textSize="text-[11px]" />
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          placeholder="Write a comment..."
          className="h-9 flex-1 rounded-full border border-border/70 bg-muted-bg/60 px-3.5 text-xs text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={submitComment}
          disabled={isPending || !draft.trim()}
          aria-label="Post comment"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-indigo-500 text-on-primary disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
