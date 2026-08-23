import Link from "next/link";
import { Briefcase } from "lucide-react";

import type { Job } from "@/lib/types";

type StartupsHiringProps = {
  jobs: Job[];
};

export const StartupsHiring = ({ jobs }: StartupsHiringProps) => {
  if (jobs.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-text">
          <Briefcase className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
          Startups hiring now
        </h3>
        <Link href="/jobs" className="text-[11.5px] font-bold text-primary">
          See all
        </Link>
      </div>
      <div className="flex flex-col">
        {jobs.slice(0, 4).map((job, index) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className={`flex gap-2.5 py-2.5 transition hover:opacity-80 ${index > 0 ? "border-t border-border/60" : ""}`}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 font-display text-xs font-bold text-white">
              {job.startupName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-text">{job.heading}</div>
              <div className="truncate text-[11px] text-muted">
                {job.startupName} · {job.role?.replace(/_/g, " ")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
