import { PostCard } from "@/components/PostCard";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { StartupsHiring } from "@/components/StartupsHiring";
import { TrendingStartups } from "@/components/TrendingStartups";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, ConnectedProfile, IncomingRequest, Job, OutgoingRequest, Post, Profile, TrendingStartup } from "@/lib/types";

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

export default async function HomePage() {
  const me = await apiFetch<AuthMe>("/auth/me");
  const [posts, trending, savedIds, hiringJobs, suggestedPeople] = await Promise.all([
    apiFetch<Post[]>("/posts"),
    loadTrending(),
    loadSavedIds(),
    loadHiringJobs(),
    loadPeopleYouMayKnow(me.id)
  ]);

  const initial = (me.profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto grid max-w-220 grid-cols-[minmax(0,1fr)_300px] items-start gap-5 px-5 py-5">
      <main className="flex min-w-0 flex-col gap-4">
        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">No posts yet</p>
            <p className="mt-1 text-sm text-muted">Be the first to share an update.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={me.id} currentUserInitial={initial} initialSaved={savedIds.has(post.id)} />
          ))
        )}
      </main>

      <aside className="sticky top-20 flex flex-col gap-4">
        <TrendingStartups startups={trending} />
        <StartupsHiring jobs={hiringJobs} />
        <PeopleYouMayKnow people={suggestedPeople} />
      </aside>
    </div>
  );
}
