"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

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

  const loadMore = useCallback(() => {
    startTransition(async () => {
      const nextPage = page + 1;
      const nextPosts = await loadMorePostsAction(nextPage);
      setPosts((current) => [...current, ...nextPosts]);
      setPage(nextPage);
      setHasMore(nextPosts.length === FEED_PAGE_SIZE);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!hasMore || isPending) return;
    // Mirrors mobile's onEndReachedThreshold={0.2} — start loading the next
    // page a bit before the user actually scrolls to the very bottom.
    // A plain scroll listener (rather than IntersectionObserver) is used
    // here since it's driven by real scroll position, not the compositor's
    // async intersection timing.
    const onScroll = () => {
      const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600;
      if (scrolledToBottom) loadMore();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, isPending, loadMore]);

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

      {hasMore && isPending ? (
        <div className="flex justify-center py-3">
          <p className="text-sm font-semibold text-muted">Loading more...</p>
        </div>
      ) : null}
    </div>
  );
};
