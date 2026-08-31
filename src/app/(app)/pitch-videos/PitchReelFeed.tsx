"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, ChevronUp, MessageCircle, Send, ThumbsUp, Volume2, VolumeX, X } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import {
  createProjectCommentAction,
  deleteProjectCommentAction,
  listProjectCommentsAction
} from "@/app/(app)/startups/[id]/actions";
import type { PitchReel, ProjectComment } from "@/lib/types";

import { loadReelsAction, saveReelAction, toggleReelLikeAction, unsaveReelAction } from "./actions";

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

type CommentsPanelProps = {
  projectId: string;
  currentUserId: string;
  onClose: () => void;
  onCommentPosted: () => void;
};

const CommentsPanel = ({ projectId, currentUserId, onClose, onCommentPosted }: CommentsPanelProps) => {
  const [comments, setComments] = useState<ProjectComment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProjectCommentsAction(projectId)
      .then((result) => !cancelled && setComments(result))
      .catch(() => !cancelled && setComments([]));
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    setIsPosting(true);
    try {
      const created = await createProjectCommentAction(projectId, text);
      setComments((prev) => [...(prev ?? []), created]);
      setDraft("");
      onCommentPosted();
    } catch {
      window.alert("Couldn't post that comment — try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const remove = async (commentId: string) => {
    try {
      await deleteProjectCommentAction(commentId);
      setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId));
    } catch {
      window.alert("Couldn't remove that comment — try again.");
    }
  };

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-80 flex-col bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-border/60 p-4">
        <h2 className="text-sm font-bold text-text">Comments</h2>
        <button type="button" onClick={onClose} aria-label="Close comments" className="text-muted hover:text-text">
          <X className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {comments === null ? (
          <p className="text-xs text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet — be the first to say something.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar id={comment.author.id} name={comment.author.fullName} avatarUrl={comment.author.avatarUrl} size="h-8 w-8" textSize="text-[11px]" />
                <div className="min-w-0 flex-1">
                  <div className="rounded-2xl bg-muted-bg/70 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text">{comment.author.fullName || "Unknown"}</span>
                      {comment.author.id === currentUserId ? (
                        <button type="button" onClick={() => remove(comment.id)} aria-label="Delete comment" className="ml-auto text-muted hover:text-danger">
                          <X className="h-3 w-3" strokeWidth={2} />
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-0.5 whitespace-pre-wrap text-[13px] text-text">{comment.content}</p>
                  </div>
                  <div className="mt-0.5 pl-3 text-[10.5px] text-muted">{formatRelativeTime(comment.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 border-t border-border/60 p-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Write a comment..."
          className="h-9 flex-1 rounded-full border border-border/70 bg-muted-bg/60 px-3.5 text-xs text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={submit}
          disabled={isPosting || !draft.trim()}
          aria-label="Post comment"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-indigo-500 text-on-primary disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

type PitchReelFeedProps = {
  initialItems: PitchReel[];
  initialNextCursor: string | null;
  currentUserId: string;
};

export const PitchReelFeed = ({ initialItems, initialNextCursor, currentUserId }: PitchReelFeedProps) => {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = items[index];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }, [index]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);
    try {
      const page = await loadReelsAction(nextCursor);
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= items.length) return;
      setIndex(nextIndex);
      if (nextIndex >= items.length - 2 && nextCursor) void loadMore();
    },
    [items.length, nextCursor, loadMore]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, goTo]);

  const patchCurrent = (patch: Partial<PitchReel>) => {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleLike = async () => {
    if (!current) return;
    const wasLiked = current.isLikedByMe;
    patchCurrent({ isLikedByMe: !wasLiked, likeCount: current.likeCount + (wasLiked ? -1 : 1) });
    try {
      await toggleReelLikeAction(current.id);
    } catch {
      patchCurrent({ isLikedByMe: wasLiked, likeCount: current.likeCount });
    }
  };

  const handleSave = async () => {
    if (!current) return;
    const wasSaved = current.isSavedByMe;
    patchCurrent({ isSavedByMe: !wasSaved });
    try {
      await (wasSaved ? unsaveReelAction(current.id) : saveReelAction(current.id));
    } catch {
      patchCurrent({ isSavedByMe: wasSaved });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/startups/${current.id}`;
    if (navigator.share) {
      void navigator.share({ title: current.name, text: current.tagline, url });
    } else {
      void navigator.clipboard.writeText(url);
      window.alert("Link copied.");
    }
  };

  if (!current) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center rounded-2xl bg-black">
        <p className="text-sm text-white/70">No pitch videos yet.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-140px)] overflow-hidden rounded-2xl bg-black">
      <video
        key={current.id}
        ref={videoRef}
        src={current.pitchVideoUrl}
        className="h-full w-full object-contain"
        loop
        muted={isMuted}
        playsInline
        onClick={(e) => (e.currentTarget.paused ? void e.currentTarget.play() : e.currentTarget.pause())}
      />

      <button
        type="button"
        onClick={() => setIsMuted((m) => !m)}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        {isMuted ? <VolumeX className="h-4 w-4" strokeWidth={2} /> : <Volume2 className="h-4 w-4" strokeWidth={2} />}
      </button>

      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
        >
          <ChevronUp className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index >= items.length - 1 && !nextCursor}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
        >
          <ChevronDown className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-5 pt-14">
        <Link href={`/startups/${current.id}`} className="flex items-center gap-2 text-white hover:opacity-90">
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white/20">
            {current.logoUrl ? <img src={current.logoUrl} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <span className="text-sm font-bold">{current.name}</span>
        </Link>
        {current.tagline ? <p className="mt-1.5 max-w-lg text-xs text-white/85">{current.tagline}</p> : null}

        <div className="mt-3 flex items-center gap-6">
          <button type="button" onClick={handleLike} className="flex items-center gap-1.5 text-white">
            <ThumbsUp className="h-4.5 w-4.5" strokeWidth={2} fill={current.isLikedByMe ? "currentColor" : "none"} />
            <span className="text-xs font-semibold">{current.likeCount}</span>
          </button>
          <button type="button" onClick={() => setCommentsOpenFor(current.id)} className="flex items-center gap-1.5 text-white">
            <MessageCircle className="h-4.5 w-4.5" strokeWidth={2} />
            <span className="text-xs font-semibold">{current.commentCount}</span>
          </button>
          <button type="button" onClick={handleSave} className="text-white">
            <Bookmark className="h-4.5 w-4.5" strokeWidth={2} fill={current.isSavedByMe ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={handleShare} aria-label="Share" className="text-xs font-semibold text-white">
            Share
          </button>
        </div>
      </div>

      {commentsOpenFor === current.id ? (
        <CommentsPanel
          projectId={current.id}
          currentUserId={currentUserId}
          onClose={() => setCommentsOpenFor(null)}
          onCommentPosted={() => patchCurrent({ commentCount: current.commentCount + 1 })}
        />
      ) : null}
    </div>
  );
};
