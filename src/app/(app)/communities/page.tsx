import Link from "next/link";
import { Calendar, Globe2, UserPlus, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Community } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CommunitiesPage() {
  const communities = await apiFetch<Community[]>("/communities/mine");
  const hasCommunities = communities.length > 0;

  return (
    <div className="max-w-160">
      <div className="glass mb-4 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Globe2 className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-text">Community</h1>
          <p className="text-xs text-muted">Grow your network and bring people together.</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3.5">
        <Link href="/communities/new" className="glass flex flex-col gap-2.5 rounded-2xl p-4 transition hover:-translate-y-0.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white">
            <UserPlus className="h-5 w-5" strokeWidth={2} />
          </span>
          <h2 className="text-sm font-bold text-text">Create a community</h2>
          <p className="text-xs text-muted">Start a group and invite people to join.</p>
        </Link>

        <Link
          href={hasCommunities ? "/communities/events" : "/communities/new"}
          className="glass flex flex-col gap-2.5 rounded-2xl p-4 transition hover:-translate-y-0.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white">
            <Calendar className="h-5 w-5" strokeWidth={2} />
          </span>
          <h2 className="text-sm font-bold text-text">Community events</h2>
          <p className="text-xs text-muted">
            {hasCommunities
              ? "Host a private meetup for one of your communities, or join public events."
              : "Create a community group first, then host private events for its members."}
          </p>
        </Link>
      </div>

      <h2 className="mb-3 px-1 font-display text-sm font-bold text-text">My communities</h2>
      {communities.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted">You haven&apos;t joined or created any communities yet.</div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex flex-col divide-y divide-border/60">
            {communities.map((c) => (
              <Link key={c.id} href={`/communities/${c.id}`} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-muted-bg/60">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 font-display text-sm font-bold text-white">
                  {c.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-text">{c.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Users className="h-3 w-3" strokeWidth={2} />
                    {c._count?.members ?? 0} member{c._count?.members === 1 ? "" : "s"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
