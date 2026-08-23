import Link from "next/link";
import { Rocket, Search, Users } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch } from "@/lib/api";
import type { SearchResults } from "@/lib/types";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const results = query
    ? await apiFetch<SearchResults>(`/search?search=${encodeURIComponent(query)}&type=all&limit=30`)
    : { users: [], projects: [], jobs: [], events: [], posts: [], messages: [] };

  return (
    <div className="max-w-160">
      <form method="get" className="glass mb-5 flex items-center gap-2.5 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search founders, startups, roles..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />
      </form>

      {!query ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted">Search for people and startups on Orbit.</div>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 px-1 font-display text-sm font-bold text-text">
              <Users className="h-4 w-4" strokeWidth={2} />
              People
            </h2>
            {results.users.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-sm text-muted">No people found.</div>
            ) : (
              <div className="glass overflow-hidden rounded-2xl">
                <div className="flex flex-col divide-y divide-border/60">
                  {results.users.map((user) => (
                    <Link key={user.id} href={`/u/${user.profile.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted-bg/60">
                      <Avatar id={user.profile.id} name={user.profile.fullName} avatarUrl={user.profile.avatarUrl} size="h-10 w-10" textSize="text-xs" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-bold text-text">{user.profile.fullName || "Unnamed"}</span>
                          {user.profile.identityVerified ? <VerifiedBadge size="sm" /> : null}
                        </div>
                        <div className="truncate text-xs text-muted">{user.profile.headline}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-1.5 px-1 font-display text-sm font-bold text-text">
              <Rocket className="h-4 w-4" strokeWidth={2} />
              Startups
            </h2>
            {results.projects.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-sm text-muted">No startups found.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {results.projects.map((startup) => (
                  <Link key={startup.id} href={`/startups/${startup.id}`} className="glass flex flex-col gap-1.5 rounded-2xl p-4 transition hover:-translate-y-0.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br font-display text-xs font-bold text-white ${gradientFor(startup.id)}`}>
                      {startup.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="truncate text-sm font-bold text-text">{startup.name}</h3>
                    <p className="line-clamp-2 text-xs text-muted">{startup.tagline}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
