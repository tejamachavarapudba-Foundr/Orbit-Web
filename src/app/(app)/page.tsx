import { ProfileCard } from "@/components/ProfileCard";
import { ShortcutsCard } from "@/components/ShortcutsCard";
import { PostCard } from "@/components/PostCard";
import { TrendingStartups } from "@/components/TrendingStartups";
import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, Post, TrendingStartup } from "@/lib/types";

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

export default async function HomePage() {
  const [me, posts, trending] = await Promise.all([apiFetch<AuthMe>("/auth/me"), apiFetch<Post[]>("/posts"), loadTrending()]);

  const initial = (me.profile.fullName || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto grid max-w-295 grid-cols-[240px_minmax(0,1fr)_300px] items-start gap-5 px-5 py-5">
      <aside className="sticky top-20 flex flex-col gap-4">
        <ProfileCard profile={me.profile} />
        <ShortcutsCard initial={initial} />
      </aside>

      <main className="flex min-w-0 flex-col gap-4">
        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">No posts yet</p>
            <p className="mt-1 text-sm text-muted">Be the first to share an update.</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>

      <aside className="sticky top-20 flex flex-col gap-4">
        <TrendingStartups startups={trending} />
      </aside>
    </div>
  );
}
