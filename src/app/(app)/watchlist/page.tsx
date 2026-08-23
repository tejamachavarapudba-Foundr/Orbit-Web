import Link from "next/link";
import { Bookmark, Star } from "lucide-react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch } from "@/lib/api";
import type { SavedStartup } from "@/lib/types";

import { unsaveFromWatchlistAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const saved = await apiFetch<SavedStartup[]>("/projects/saved/list");

  return (
    <div className="max-w-220">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Star className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Investment Watchlist</h1>
          <p className="text-xs text-muted">Saved startups for review</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No saved startups</p>
          <p className="mt-1 text-sm text-muted">Startups you save will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {saved.map(({ id, project }) => (
            <div key={id} className="glass flex flex-col gap-2.5 rounded-2xl p-4">
              <Link href={`/startups/${project.id}`} className="flex flex-col gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 font-display text-sm font-bold text-white">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold text-text">{project.name}</h3>
                  {project.founderVerified ? <VerifiedBadge size="sm" /> : null}
                </div>
                <p className="line-clamp-2 text-xs text-muted">{project.tagline || "No tagline yet"}</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{project.stage}</span>
                  <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{project.projectType?.replace(/_/g, " ")}</span>
                </div>
              </Link>
              <form action={unsaveFromWatchlistAction.bind(null, project.id)} className="mt-auto pt-1">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 bg-primary-muted px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-muted/70"
                >
                  <Bookmark className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
                  Remove from watchlist
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
