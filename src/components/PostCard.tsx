"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, Link as LinkIcon, MessageCircle, MoreHorizontal, Pencil, Send, Trash2, X } from "lucide-react";

import {
  createCommentAction,
  deleteCommentAction,
  deletePostAction,
  listCommentsAction,
  toggleLikeAction,
  toggleSaveAction,
  updatePostAction
} from "@/app/(app)/actions";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Post, PostComment } from "@/lib/types";

const gradients = [
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-red-500",
  "from-emerald-400 to-sky-500",
  "from-fuchsia-400 to-pink-500",
  "from-violet-400 to-purple-500"
];

const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

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

const gridCellClass = (index: number, total: number) => {
  if (total === 3 && index === 0) return "row-span-2";
  return "";
};

type PostCardProps = {
  post: Post;
  currentUserId: string;
  currentUserInitial?: string;
  initialSaved?: boolean;
};

export const PostCard = ({ post, currentUserId, currentUserInitial = "•", initialSaved = false }: PostCardProps) => {
  const router = useRouter();
  const isOwn = post.author.id === currentUserId;
  const initial = (post.author.fullName || "?").charAt(0).toUpperCase();

  const [content, setContent] = useState(post.content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(post.likes.some((like) => like.userId === currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [saved, setSaved] = useState(initialSaved);
  const [deleted, setDeleted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.content);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [commentDraft, setCommentDraft] = useState("");

  const [, startTransition] = useTransition();

  if (deleted) return null;

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((count) => count + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await toggleLikeAction(post.id);
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
        await toggleSaveAction(post.id);
        router.refresh();
      } catch {
        setSaved(!next);
      }
    });
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    startTransition(async () => {
      try {
        await deletePostAction(post.id);
        setDeleted(true);
        router.refresh();
      } catch {
        window.alert("Couldn't delete that post — try again.");
      }
    });
  };

  const startEdit = () => {
    setMenuOpen(false);
    setEditValue(content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const next = editValue.trim();
    if (!next) return;
    startTransition(async () => {
      try {
        const updated = await updatePostAction(post.id, next);
        setContent(updated.content);
        setIsEditing(false);
      } catch {
        window.alert("Couldn't save that edit — try again.");
      }
    });
  };

  const toggleComments = () => {
    setShowComments((open) => !open);
    if (comments === null) {
      startTransition(async () => {
        try {
          setComments(await listCommentsAction(post.id));
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
        const created = await createCommentAction(post.id, text);
        setComments((prev) => [...(prev ?? []), created]);
        setCommentCount((count) => count + 1);
      } catch {
        window.alert("Couldn't post that comment — try again.");
      }
    });
  };

  const removeComment = (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteCommentAction(commentId);
        setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId));
        setCommentCount((count) => Math.max(0, count - 1));
      } catch {
        window.alert("Couldn't remove that comment — try again.");
      }
    });
  };

  return (
    <article className="glass overflow-hidden rounded-2xl">
      <div className="p-4 pb-0">
        <div className="flex gap-2.5">
          <Link
            href={`/u/${post.author.id}`}
            className={`flex h-10.5 w-10.5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white ${gradientFor(post.author.id)}`}
          >
            {initial}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link href={`/u/${post.author.id}`} className="truncate text-sm font-bold text-text hover:underline">
                {post.author.fullName || "Unknown"}
              </Link>
              {post.author.identityVerified ? <VerifiedBadge /> : null}
            </div>
            <div className="text-[11.5px] text-muted">
              {post.author.headline ? `${post.author.headline} · ` : ""}
              {formatRelativeTime(post.createdAt)}
              {post.category ? ` · ${post.category}` : ""}
            </div>
          </div>

          <div className="relative flex-shrink-0" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setMenuOpen(false)}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Post options"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-muted-bg/70 hover:text-text"
            >
              <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
            {menuOpen ? (
              <div className="glass-strong absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleSave();
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-text hover:bg-muted-bg/70"
                >
                  <Bookmark className="h-3.5 w-3.5" strokeWidth={2} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Unsave" : "Save post"}
                </button>
                {isOwn ? (
                  <>
                    <button
                      type="button"
                      onClick={startEdit}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-text hover:bg-muted-bg/70"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                      Edit post
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-danger hover:bg-danger-bg/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Delete post
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-3">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={4}
              autoFocus
              className="w-full resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-3 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            />
            <div className="mt-2 flex justify-end gap-2 pb-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-1.5 text-xs font-bold text-on-primary shadow-md shadow-primary/25"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className={`whitespace-pre-wrap text-sm leading-relaxed text-text ${isExpanded ? "" : "line-clamp-2"}`}>{content}</p>
            {!isExpanded && content.length > 140 ? (
              <button type="button" onClick={() => setIsExpanded(true)} className="mt-0.5 text-xs font-bold text-muted hover:text-text">
                ...more
              </button>
            ) : null}
          </div>
        )}

        {post.linkUrl ? (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 mb-1 flex items-center gap-2 rounded-xl border border-border/70 bg-muted-bg/60 px-3 py-2.5 text-xs text-primary"
          >
            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
            <span className="truncate">{post.linkUrl}</span>
          </a>
        ) : null}

        <div className="h-3" />
      </div>

      {post.media.length === 1 ? (
        <div className="flex max-h-125 items-center justify-center overflow-hidden bg-muted-bg/70">
          {post.media[0].type === "VIDEO" ? (
            <video src={post.media[0].url} controls className="max-h-125 w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media[0].url} alt="" className="max-h-125 w-full object-contain" />
          )}
        </div>
      ) : post.media.length > 1 ? (
        <div className={`grid h-96 gap-0.5 bg-border/60 ${post.media.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}>
          {post.media.slice(0, 4).map((item, index) => (
            <div key={item.id} className={`relative overflow-hidden bg-muted-bg/70 ${gridCellClass(index, Math.min(post.media.length, 4))}`}>
              {item.type === "VIDEO" ? (
                <video src={item.url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
              {index === 3 && post.media.length > 4 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 font-display text-lg font-bold text-white">
                  +{post.media.length - 4}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex gap-1 border-t border-border/60 px-2 py-1">
        <button
          type="button"
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-muted-bg/70 ${liked ? "text-danger" : "text-muted hover:text-text"}`}
        >
          <Heart className="h-4 w-4" strokeWidth={2} fill={liked ? "currentColor" : "none"} />
          {likeCount > 0 ? likeCount : "Like"}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-muted-bg/70 ${showComments ? "text-primary" : "text-muted hover:text-text"}`}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          {commentCount > 0 ? commentCount : "Comment"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-muted-bg/70 ${saved ? "text-primary" : "text-muted hover:text-text"}`}
        >
          <Bookmark className="h-4 w-4" strokeWidth={2} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save"}
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
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-[11px] font-bold text-white ${gradientFor(comment.author.id)}`}
                  >
                    {(comment.author.fullName || "?").charAt(0).toUpperCase()}
                  </div>
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
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 font-display text-[11px] font-bold text-white">
              {currentUserInitial}
            </div>
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
