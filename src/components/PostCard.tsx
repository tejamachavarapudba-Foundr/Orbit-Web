import Link from "next/link";
import { Heart, Link as LinkIcon, MessageCircle } from "lucide-react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Post } from "@/lib/types";

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

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const initial = (post.author.fullName || "?").charAt(0).toUpperCase();

  return (
    <article className="glass rounded-2xl p-4">
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
          </div>
        </div>
        <span className="flex-shrink-0 self-start rounded-full bg-primary-muted px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary">
          {post.category || "Update"}
        </span>
      </div>

      <p className="mt-3 max-w-140 whitespace-pre-wrap text-sm leading-relaxed text-text">{post.content}</p>

      {post.media?.[0] ? (
        <div className="mt-3 flex max-h-125 items-center justify-center overflow-hidden rounded-xl bg-muted-bg/70">
          {post.media[0].type === "VIDEO" ? (
            <video src={post.media[0].url} controls className="max-h-125 w-full" />
          ) : (
            // Full image, never cropped — letterboxed on a neutral background
            // instead of object-cover, which was cutting content off.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media[0].url} alt="" className="max-h-125 w-full object-contain" />
          )}
        </div>
      ) : null}

      {post.linkUrl ? (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-muted-bg/60 px-3 py-2.5 text-xs text-primary"
        >
          <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          <span className="truncate">{post.linkUrl}</span>
        </a>
      ) : null}

      <div className="mt-3.5 flex gap-1 border-t border-border/60 pt-2.5">
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-muted-bg/70 hover:text-text">
          <Heart className="h-3.5 w-3.5" strokeWidth={2} />
          {post.likes?.length ?? 0}
        </button>
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-muted-bg/70 hover:text-text">
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
          {post.comments?.length ?? 0}
        </button>
      </div>
    </article>
  );
};
