"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Copy, EyeOff, Flag, Link as LinkIcon, MessageCircle, MoreHorizontal, Pencil, Send, ThumbsUp, Trash2, UserPlus, X } from "lucide-react";

import {
  createCommentAction,
  deleteCommentAction,
  deletePostAction,
  getFollowStatusAction,
  listCommentsAction,
  notInterestedAction,
  reportPostAction,
  toggleLikeAction,
  toggleSaveAction,
  updatePostAction
} from "@/app/(app)/actions";
import { followAction, unfollowAction } from "@/app/(app)/u/[id]/actions";
import { Avatar } from "@/components/Avatar";
import { PostMediaCarousel } from "@/components/PostMediaCarousel";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Post, PostComment } from "@/lib/types";

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

type PostCardProps = {
  post: Post;
  currentUserId: string;
  currentUserName?: string;
  currentUserAvatarUrl?: string | null;
  initialSaved?: boolean;
};

export const PostCard = ({ post, currentUserId, currentUserName = "", currentUserAvatarUrl, initialSaved = false }: PostCardProps) => {
  const router = useRouter();
  const isOwn = post.author.id === currentUserId;

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
  const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [notInterested, setNotInterested] = useState(false);
  const [reported, setReported] = useState(false);
  const [interested, setInterested] = useState(false);

  const [, startTransition] = useTransition();

  useEffect(() => {
    if (isOwn) return;
    let cancelled = false;
    getFollowStatusAction(post.author.id)
      .then((following) => !cancelled && setIsFollowing(following))
      .catch(() => !cancelled && setIsFollowing(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.author.id, isOwn]);

  if (deleted || notInterested) return null;

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

  const handleShare = () => {
    setMenuOpen(false);
    const url = `${window.location.origin}/p/${post.id}`;
    if (navigator.share) {
      navigator.share({ url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(
        () => window.alert("Link copied to clipboard."),
        () => window.alert(url)
      );
    }
  };

  const handleCopyLink = () => {
    setMenuOpen(false);
    const url = `${window.location.origin}/p/${post.id}`;
    navigator.clipboard.writeText(url).then(
      () => window.alert("Link copied."),
      () => window.alert(url)
    );
  };

  const handleInterested = () => {
    setMenuOpen(false);
    setInterested(true);
    window.alert("Thanks — we'll show more like this.");
  };

  const handleToggleFollow = () => {
    const next = !isFollowing;
    if (!next && !window.confirm(`Unfollow ${post.author.fullName || "this person"}?`)) return;
    setIsFollowing(next);
    startTransition(async () => {
      try {
        await (next ? followAction : unfollowAction)(post.author.id);
      } catch {
        setIsFollowing(!next);
        window.alert(`Couldn't ${next ? "follow" : "unfollow"} — try again.`);
      }
    });
  };

  const handleNotInterested = () => {
    setMenuOpen(false);
    setNotInterested(true);
    startTransition(async () => {
      try {
        await notInterestedAction(post.id);
      } catch {
        setNotInterested(false);
        window.alert("Couldn't hide that post — try again.");
      }
    });
  };

  const handleReport = () => {
    setMenuOpen(false);
    if (reported) return;
    const reason = window.prompt("What's wrong with this post? (optional)") ?? "";
    startTransition(async () => {
      try {
        await reportPostAction(post.id, reason.trim());
        setReported(true);
        window.alert("Thanks — we'll take a look.");
      } catch {
        window.alert("Couldn't report that post — try again.");
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

  const startReply = (comment: PostComment) => {
    setReplyingTo(comment);
    setCommentDraft("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentDraft("");
  };

  const submitComment = () => {
    const text = commentDraft.trim();
    if (!text) return;
    const parentId = replyingTo?.id;
    setCommentDraft("");
    setReplyingTo(null);
    startTransition(async () => {
      try {
        const created = await createCommentAction(post.id, text, parentId);
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
        await deleteCommentAction(commentId);
        setComments((prev) => (prev ?? []).filter((c) => c.id !== commentId && c.parentId !== commentId));
        setCommentCount((count) => Math.max(0, count - 1));
      } catch {
        window.alert("Couldn't remove that comment — try again.");
      }
    });
  };

  const topLevelComments = (comments ?? []).filter((c) => !c.parentId);
  const repliesFor = (commentId: string) => (comments ?? []).filter((c) => c.parentId === commentId);

  const renderCommentRow = (comment: PostComment, isReply: boolean) => (
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
        <div className="mt-0.5 flex items-center gap-3 pl-3 text-[10.5px] text-muted">
          <span>{formatRelativeTime(comment.createdAt)}</span>
          {!isReply ? (
            <button type="button" onClick={() => startReply(comment)} className="font-bold hover:text-text">
              Reply
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <article className="glass overflow-hidden rounded-2xl">
      <div className="p-4 pb-0">
        <div className="flex gap-2.5">
          <Link href={`/u/${post.author.id}`} className="flex-shrink-0">
            <Avatar id={post.author.id} name={post.author.fullName} avatarUrl={post.author.avatarUrl} size="h-10.5 w-10.5" />
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
            </div>
          </div>

          {!isOwn ? (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={isFollowing === null}
              className={`flex-shrink-0 self-start rounded-full border px-3 py-1 text-[11px] font-bold transition disabled:opacity-50 ${
                isFollowing
                  ? "border-border/70 text-muted hover:bg-muted-bg/70 hover:text-text"
                  : "border-primary/40 text-primary hover:bg-primary-muted"
              }`}
            >
              {isFollowing === null ? "..." : isFollowing ? "Following" : (
                <span className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3" strokeWidth={2.5} />
                  Follow
                </span>
              )}
            </button>
          ) : null}

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
              <div className="glass-strong absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl py-1.5">
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
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleInterested}
                      disabled={interested}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-text hover:bg-muted-bg/70 disabled:opacity-50"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
                      {interested ? "Marked interested" : "Interested"}
                    </button>
                    <button
                      type="button"
                      onClick={handleNotInterested}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-text hover:bg-muted-bg/70"
                    >
                      <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                      Not interested
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-text hover:bg-muted-bg/70"
                    >
                      <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                      Copy link
                    </button>
                    <button
                      type="button"
                      onClick={handleReport}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-semibold text-danger hover:bg-danger-bg/60"
                    >
                      <Flag className="h-3.5 w-3.5" strokeWidth={2} />
                      {reported ? "Reported" : "Report post"}
                    </button>
                  </>
                )}
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
              maxLength={5000}
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
            {content.length > 140 ? (
              <button
                type="button"
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className="mt-0.5 text-xs font-bold text-muted hover:text-text"
              >
                {isExpanded ? "...less" : "...more"}
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

      <PostMediaCarousel media={post.media} />

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
          aria-label="Share post"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-muted-bg/70 hover:text-text"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Unsave post" : "Save post"}
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
            ) : topLevelComments.length === 0 ? (
              <p className="text-xs text-muted">No comments yet — be the first to say something.</p>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-2.5">
                  {renderCommentRow(comment, false)}
                  {repliesFor(comment.id).length > 0 ? (
                    <div className="ml-10 flex flex-col gap-2.5">
                      {repliesFor(comment.id).map((reply) => renderCommentRow(reply, true))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          {replyingTo ? (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-muted-bg/60 px-3 py-1.5 text-xs text-muted">
              <span>
                Replying to <span className="font-bold text-text">{replyingTo.author.fullName || "Unknown"}</span>
              </span>
              <button type="button" onClick={cancelReply} aria-label="Cancel reply" className="hover:text-text">
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2.5">
            <Avatar id={currentUserId} name={currentUserName} avatarUrl={currentUserAvatarUrl} size="h-8 w-8" textSize="text-[11px]" />
            <input
              type="text"
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              maxLength={1000}
              placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
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
