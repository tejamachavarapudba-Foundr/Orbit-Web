"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, MessageCircle, Send, ThumbsUp, X } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import {
  createProjectCommentAction,
  deleteProjectCommentAction,
  listProjectCommentsAction
} from "@/app/(app)/startups/[id]/actions";
import type { PitchReel, ProjectComment } from "@/lib/types";

import { loadReelsAction, saveReelAction, toggleReelLikeAction, unsaveReelAction } from "./actions";

const REEL_PAGE_SIZE = 10;

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

type ReelCardProps = {
  reel: PitchReel;
  currentUserId: string;
};

const ReelCard = ({ reel, currentUserId }: ReelCardProps) => {
  const [liked, setLiked] = useState(reel.isLikedByMe);
  const [likeCount, setLikeCount] = useState(reel.likeCount);
  const [saved, setSaved] = useState(reel.isSavedByMe);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ProjectComment[] | null>(null);
  const [commentCount, setCommentCount] = useState(reel.commentCount);
  const [commentDraft, setCommentDraft] = useState("");
  const [, startTransition] = useTransition();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Mirrors mobile's Reels-style autoplay: mute and play once ≥65% of the
    // card is visible, pause when scrolled away — same idea as the feed's
    // active-post tracking, just per-card here since this is a scrollable
    // list rather than one full-screen video at a time.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.65 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((count) => count + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await toggleReelLikeAction(reel.id);
      } catch {
        setLiked(!next);
        setLikeCount((count) => count + (next ? -1 : 1));
      }
    });
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        await (next ? saveReelAction : unsaveReelAction)(reel.id);
      } catch {
        setSaved(!next);
      }
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/startups/${reel.id}`;
    if (navigator.share) {
      navigator.share({ title: reel.name, text: reel.tagline, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(
        () => window.alert("Link copied to clipboard."),
        () => window.alert(url)
      );
    }
  };

  const toggleComments = () => {
    setShowComments((open) => !open);
    if (comments === null) {
      startTransition(async () => {
        try {
          setComments(await listProjectCommentsAction(reel.id));
        } catch {
          setComments([]);
        }
      });
    }
  };

  const submitComment = () => {
    const text = commentDraft.trim();
    if (!text) return;
    setCommentDraft("");
    startTransition(async () => {
      try {
        const created = await createProjectCommentAction(reel.id, text);
        setComments((prev) => [...(prev ?? []), created]);
        setCommentCount((count) => count + 1);
      } catch {
        window.alert("Couldn't post that comment — try again.");
      }
    });
  };

  const removeComment = (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    startTransition(async () => {
      try {
        await deleteProjectCommentAction(commentId);
        setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId));
        setCommentCount((count) => Math.max(0, count - 1));
      } catch {
        window.alert("Couldn't remove that comment — try again.");
      }
    });
  };

  return (
    <article className="glass overflow-hidden rounded-2xl">
      <Link href={`/startups/${reel.id}`} className="flex items-center gap-2.5 p-4 pb-3 hover:bg-muted-bg/40">
        <Avatar id={reel.id} name={reel.name} avatarUrl={reel.logoUrl} size="h-10.5 w-10.5" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-text">{reel.name}</div>
          <div className="truncate text-[11.5px] text-muted">{reel.tagline || "Founder pitch"}</div>
        </div>
      </Link>

      <video
        ref={videoRef}
        src={reel.pitchVideoUrl}
        controls
        loop
        playsInline
        className="max-h-125 w-full bg-black object-contain"
      />

      <div className="flex items-center gap-1 border-t border-border/60 px-2 py-1">
        <button
          type="button"
          onClick={handleLike}
          className={`flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition hover:bg-muted-bg/70 ${liked ? "text-primary" : "text-muted hover:text-text"}`}
        >
          <ThumbsUp className="h-4 w-4" strokeWidth={2} fill={liked ? "currentColor" : "none"} />
          {likeCount}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className={`flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition hover:bg-muted-bg/70 ${showComments ? "text-primary" : "text-muted hover:text-text"}`}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          {commentCount}
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share pitch"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-muted-bg/70 hover:text-text"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Unsave pitch" : "Save pitch"}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-muted-bg/70 ${saved ? "text-primary" : "text-muted hover:text-text"}`}
        >
          <Bookmark className="h-4 w-4" strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {showComments ? (
        <div className="border-t border-border/60 px-4 py-3">
          <div className="flex flex-col gap-3">
            {comments === null ? (
              <p className="text-xs text-muted">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-muted">No comments yet — be the first to say something.</p>
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

          <div className="mt-3 flex items-center gap-2.5">
            <input
              type="text"
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Write a comment..."
              className="h-9 flex-1 rounded-full border border-border/70 bg-muted-bg/60 px-3.5 text-xs text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="button"
              onClick={submitComment}
              disabled={!commentDraft.trim()}
              aria-label="Post comment"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-indigo-500 text-on-primary disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : null}
    </article>
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
  const [isPending, startTransition] = useTransition();

  const stateRef = useRef({ nextCursor, isPending });
  stateRef.current = { nextCursor, isPending };

  const loadMore = useCallback(() => {
    const { nextCursor: cursor, isPending: pending } = stateRef.current;
    if (!cursor || pending) return;
    startTransition(async () => {
      const page = await loadReelsAction(cursor, REEL_PAGE_SIZE);
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600;
      if (scrolledToBottom) loadMore();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore]);

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-text">No pitch videos yet</p>
        <p className="mt-1 text-sm text-muted">Founders who upload a pitch video will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((reel) => (
        <ReelCard key={reel.id} reel={reel} currentUserId={currentUserId} />
      ))}

      {nextCursor && isPending ? (
        <div className="flex justify-center py-3">
          <p className="text-sm font-semibold text-muted">Loading more...</p>
        </div>
      ) : null}
    </div>
  );
};
