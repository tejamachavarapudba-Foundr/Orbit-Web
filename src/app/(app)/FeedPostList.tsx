"use client";

import { useState, useTransition } from "react";

import { PostCard } from "@/components/PostCard";
import type { Post } from "@/lib/types";

import { loadMorePostsAction } from "./actions";

const FEED_PAGE_SIZE = 10;

type FeedPostListProps = {
  initialPosts: Post[];
  initialHasMore: boolean;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatarUrl: string;
  initialSavedIds: string[];
};

export const FeedPostList = ({
  initialPosts,
  initialHasMore,
  currentUserId,
  currentUserName,
  currentUserAvatarUrl,
  initialSavedIds
}: FeedPostListProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const savedIds = new Set(initialSavedIds);

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const nextPosts = await loadMorePostsAction(nextPage);
      setPosts((current) => [...current, ...nextPosts]);
      setPage(nextPage);
      setHasMore(nextPosts.length === FEED_PAGE_SIZE);
    });
  };

  if (posts.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-text">No posts yet</p>
        <p className="mt-1 text-sm text-muted">Be the first to share an update.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserAvatarUrl={currentUserAvatarUrl}
          initialSaved={savedIds.has(post.id)}
        />
      ))}

      {hasMore ? (
        <button
          type="button"
          onClick={loadMore}
          disabled={isPending}
          className="glass w-full rounded-2xl py-2.5 text-center text-sm font-bold text-primary hover:bg-primary-muted/40 disabled:opacity-60"
        >
          {isPending ? "Loading..." : "Load more"}
        </button>
      ) : null}
    </div>
  );
};
