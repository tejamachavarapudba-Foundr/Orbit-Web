import { Star } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { SavedStartup } from "@/lib/types";

import { StartupCard } from "../projects/StartupCard";

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
            <StartupCard key={id} startup={project} isInvestor initialSaved />
          ))}
        </div>
      )}
    </div>
  );
}
