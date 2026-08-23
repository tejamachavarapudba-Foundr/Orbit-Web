import Link from "next/link";
import { Globe2, Plus, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Community } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CommunitiesPage() {
  const communities = await apiFetch<Community[]>("/communities/mine");

  return (
    <div className="mx-auto max-w-160 px-5 py-5">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Globe2 className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Communities</h1>
          <p className="text-xs text-muted">{communities.length} you belong to</p>
        </div>
        <Link href="/communities/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New community
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No communities yet</p>
          <p className="mt-1 text-sm text-muted">Start one to bring founders and collaborators together.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {communities.map((c) => (
            <Link key={c.id} href={`/communities/${c.id}`} className="glass flex flex-col gap-2 rounded-2xl p-4 transition hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 font-display text-sm font-bold text-white">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="truncate text-sm font-bold text-text">{c.name}</h3>
              <p className="line-clamp-2 text-xs text-muted">{c.description || "No description"}</p>
              <span className="mt-auto flex items-center gap-1 pt-1 text-[11px] font-semibold text-muted">
                <Users className="h-3 w-3" strokeWidth={2} />
                {c._count?.members ?? 0} members
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
