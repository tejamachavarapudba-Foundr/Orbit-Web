import Link from "next/link";

import type { Job } from "@/lib/types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

export const JobCard = ({ job }: { job: Job & { applicationsCount?: number } }) => (
  <Link href={`/jobs/${job.id}`} className="glass mb-3 flex flex-col gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-base font-bold leading-snug text-text">{job.heading}</h3>
        <p className="mt-0.5 truncate text-xs font-semibold uppercase tracking-wide text-primary">{job.startupName}</p>
      </div>
      <span className="flex-shrink-0 whitespace-nowrap rounded-md border border-border/70 bg-muted-bg px-2.5 py-1 text-xs font-medium text-muted">
        {job.role}
      </span>
    </div>

    <p className="line-clamp-2 text-sm leading-5 text-muted">{job.description || "..."}</p>

    <div className="flex flex-wrap gap-2">
      {job.experience ? (
        <span className="rounded-md border border-border/70 bg-surface px-2.5 py-1 text-xs text-muted">{job.experience}</span>
      ) : null}
      {job.skills.slice(0, 4).map((skill) => (
        <span key={skill} className="rounded-md bg-muted-bg px-2.5 py-1 text-xs text-muted">
          {skill}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between">
      <span className="text-xs text-muted">{job.applicationsCount ?? job.applications?.length ?? 0} applications</span>
      <span className="text-xs text-muted">{formatDate(job.createdAt)}</span>
    </div>
  </Link>
);
