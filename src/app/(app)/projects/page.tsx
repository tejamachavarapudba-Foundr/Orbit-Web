import Link from "next/link";
import { Plus, Rocket } from "lucide-react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch } from "@/lib/api";
import type { AuthMe, TrendingStartup } from "@/lib/types";

export const dynamic = "force-dynamic";

type ProjectRow = TrendingStartup & { ownerId: string };

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

const StartupCard = ({ startup }: { startup: ProjectRow }) => (
  <Link href={`/startups/${startup.id}`} className="glass flex flex-col gap-2.5 rounded-2xl p-4 transition hover:-translate-y-0.5">
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br font-display text-sm font-bold text-white ${gradientFor(startup.id)}`}>
      {startup.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex items-center gap-1.5">
      <h3 className="truncate text-sm font-bold text-text">{startup.name}</h3>
      {startup.founderVerified ? <VerifiedBadge size="sm" /> : null}
    </div>
    <p className="line-clamp-2 text-xs text-muted">{startup.tagline || "No tagline yet"}</p>
    <div className="mt-auto flex items-center gap-2 pt-1">
      <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{startup.stage}</span>
      <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold capitalize text-muted">{startup.projectType?.replace(/_/g, " ")}</span>
    </div>
  </Link>
);

export default async function ProjectsPage() {
  const [me, all] = await Promise.all([apiFetch<AuthMe>("/auth/me"), apiFetch<ProjectRow[]>("/projects")]);

  const mine = all.filter((p) => p.ownerId === me.id);
  const explore = all.filter((p) => p.ownerId !== me.id);

  return (
    <div className="mx-auto max-w-220 px-5 py-5">
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
            <StartupCard key={s.id} startup={s} />
          ))}
        </div>
      )}

      <h2 className="mb-3 px-1 font-display text-sm font-bold text-text">Explore</h2>
      {explore.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-muted">No other startups yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {explore.map((s) => (
            <StartupCard key={s.id} startup={s} />
          ))}
        </div>
      )}
    </div>
  );
}
