import Link from "next/link";

import type { TrendingStartup } from "@/lib/types";

const gradients = [
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-red-500",
  "from-emerald-400 to-sky-500",
  "from-fuchsia-400 to-pink-500"
];

const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

type TrendingStartupsProps = {
  startups: TrendingStartup[];
};

export const TrendingStartups = ({ startups }: TrendingStartupsProps) => {
  if (startups.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-sm font-bold text-text">Trending startups</h3>
        <Link href="/startups" className="text-[11.5px] font-bold text-primary">
          See all
        </Link>
      </div>
      <div className="flex flex-col">
        {startups.slice(0, 5).map((startup, index) => (
          <Link
            key={startup.id}
            href={`/startups/${startup.id}`}
            className={`flex gap-2.5 py-2.5 ${index > 0 ? "border-t border-border" : ""}`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-display text-xs font-bold text-white ${gradientFor(startup.id)}`}
            >
              {startup.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-xs font-bold text-text">
                <span className="truncate">{startup.name}</span>
                {startup.founderVerified ? (
                  <span className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    <svg viewBox="0 0 24 24" width="7" height="7" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                ) : null}
              </div>
              <div className="truncate text-[11px] text-muted">
                {startup.projectType} · {startup.stage}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
