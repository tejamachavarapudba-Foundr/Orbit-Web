import Link from "next/link";
import { Plus, Rocket } from "lucide-react";
import { getMe } from "@/lib/auth";

import { apiFetch, ApiError } from "@/lib/api";
import type { TrendingStartup } from "@/lib/types";

import { markCategoryReadAction } from "../notifications/actions";
import { PROJECT_NOTIFICATION_TYPES } from "@/lib/notificationCategories";
import { StartupCard } from "./StartupCard";

export const dynamic = "force-dynamic";

type ProjectRow = TrendingStartup & { ownerId: string };

const loadSavedIds = async (): Promise<Set<string>> => {
  try {
    const saved = await apiFetch<{ project: { id: string } }[]>("/projects/saved/list");
    return new Set(saved.map((s) => s.project?.id).filter(Boolean));
  } catch (error) {
    if (error instanceof ApiError) return new Set();
    throw error;
  }
};

export default async function ProjectsPage() {
  const [me, all, savedIds] = await Promise.all([
    getMe(),
    apiFetch<ProjectRow[]>("/projects"),
    loadSavedIds(),
    markCategoryReadAction(PROJECT_NOTIFICATION_TYPES)
  ]);

  const isInvestor = me.profile.role?.toLowerCase() === "investor";
  const mine = all.filter((p) => p.ownerId === me.id);
  const explore = all.filter((p) => p.ownerId !== me.id);

  return (
    <div className="max-w-220">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Rocket className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Startups</h1>
          <p className="text-xs text-muted">{mine.length} of yours · {all.length} on Orbit</p>
        </div>
        <Link href="/projects/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New startup
        </Link>
      </div>

      <h2 className="mb-3 px-1 font-display text-sm font-bold text-text">My startups</h2>
      {mine.length === 0 ? (
        <div className="glass mb-6 rounded-2xl p-8 text-center text-sm text-muted">You haven&apos;t listed a startup yet.</div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {mine.map((s) => (
            <StartupCard key={s.id} startup={s} isInvestor={isInvestor} initialSaved={savedIds.has(s.id)} />
          ))}
        </div>
      )}

      <h2 className="mb-3 px-1 font-display text-sm font-bold text-text">Explore</h2>
      {explore.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-muted">No other startups yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {explore.map((s) => (
            <StartupCard key={s.id} startup={s} isInvestor={isInvestor} initialSaved={savedIds.has(s.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
