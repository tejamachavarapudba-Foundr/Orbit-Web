import Link from "next/link";

import { FeedPostList } from "./FeedPostList";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { StartupsHiring } from "@/components/StartupsHiring";
import { TrendingStartups } from "@/components/TrendingStartups";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, ConnectedProfile, IncomingRequest, Job, OutgoingRequest, Post, Profile, TrendingStartup } from "@/lib/types";
import { getMe } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Trending startups are a nice-to-have on this page — if that one call fails
 * for a reason that isn't an auth problem (apiFetch already redirects to
 * /login on unrecoverable auth failures), degrade to an empty list instead
 * of breaking the whole feed. */
const loadTrending = async (): Promise<TrendingStartup[]> => {
  try {
    return await apiFetch<TrendingStartup[]>("/startups/trending?limit=5");
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
};

const loadSavedIds = async (): Promise<Set<string>> => {
  try {
    const saved = await apiFetch<Post[]>("/posts/saved");
    return new Set(saved.map((post) => post.id));
  } catch (error) {
    if (error instanceof ApiError) return new Set();
    throw error;
  }
};

const loadHiringJobs = async (): Promise<Job[]> => {
  try {
    return await apiFetch<Job[]>("/jobs");
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
};

const loadPeopleYouMayKnow = async (myId: string): Promise<Profile[]> => {
  try {
    const [profiles, incoming, outgoing, connections] = await Promise.all([
      apiFetch<Profile[]>("/profiles"),
      apiFetch<IncomingRequest[]>("/connections/requests/incoming"),
      apiFetch<OutgoingRequest[]>("/connections/requests/outgoing"),
      apiFetch<ConnectedProfile[]>(`/connections/${myId}`)
    ]);
    const excluded = new Set([
      myId,
      ...connections.map((c) => c.profile.id),
      ...incoming.map((r) => r.requester.id),
      ...outgoing.map((r) => r.recipient.id)
    ]);
    return profiles.filter((p) => !excluded.has(p.id));
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
};

const FEED_PAGE_SIZE = 10;

const loadFeed = async (): Promise<{ posts: Post[]; failed: boolean }> => {
  try {
    return { posts: await apiFetch<Post[]>(`/posts?page=1&limit=${FEED_PAGE_SIZE}`), failed: false };
  } catch (error) {
    if (error instanceof ApiError) return { posts: [], failed: true };
    throw error;
  }
};

export default async function HomePage() {
  const me = await getMe();
  const [{ posts, failed }, trending, savedIds, hiringJobs, suggestedPeople] = await Promise.all([
    loadFeed(),
    loadTrending(),
    loadSavedIds(),
    loadHiringJobs(),
    loadPeopleYouMayKnow(me.id)
  ]);

  return (
    <div className="grid max-w-220 grid-cols-[minmax(0,1fr)_300px] items-start gap-5">
      <div className="min-w-0">
        {failed ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">Couldn&apos;t load your feed</p>
            <p className="mt-1 text-sm text-muted">Something went wrong on our end.</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary">
              Retry
            </Link>
          </div>
        ) : (
          <FeedPostList
            initialPosts={posts}
            initialHasMore={posts.length === FEED_PAGE_SIZE}
            currentUserId={me.id}
            currentUserName={me.profile.fullName}
            currentUserAvatarUrl={me.profile.avatarUrl}
            initialSavedIds={Array.from(savedIds)}
          />
        )}
      </div>

      <aside className="sticky top-20 flex flex-col gap-4">
        <TrendingStartups startups={trending} />
        <StartupsHiring jobs={hiringJobs} />
        <PeopleYouMayKnow people={suggestedPeople} />
      </aside>
    </div>
  );
}
