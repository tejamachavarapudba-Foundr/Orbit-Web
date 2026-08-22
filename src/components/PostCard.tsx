import Link from "next/link";

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
    <article className="rounded-xl border border-border bg-surface p-4 shadow-sm">
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
            {post.author.identityVerified ? (
              <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-primary" title="Identity verified">
                <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            ) : null}
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
        <div className="mt-3 overflow-hidden rounded-lg bg-muted-bg">
          {post.media[0].type === "VIDEO" ? (
            <video src={post.media[0].url} controls className="max-h-125 w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media[0].url} alt="" className="max-h-125 w-full object-cover" />
          )}
        </div>
      ) : null}

      {post.linkUrl ? (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted-bg px-3 py-2.5 text-xs text-primary"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
          </svg>
          <span className="truncate">{post.linkUrl}</span>
        </a>
      ) : null}

      <div className="mt-3.5 flex gap-1 border-t border-border pt-2.5">
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:bg-muted-bg hover:text-text">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {post.likes?.length ?? 0}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:bg-muted-bg hover:text-text">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.comments?.length ?? 0}
        </button>
      </div>
    </article>
  );
};
