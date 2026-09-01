import Link from "next/link";

import type { Job, JobApplication } from "@/lib/types";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const statusStyle: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-100 text-amber-800",
  accepted: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
  rejected: "border-red-500/25 bg-red-500/10 text-red-700"
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle[status] ?? statusStyle.pending}`}>{status}</span>
);

export const MyApplicationsPanel = ({ applications }: { applications: (JobApplication & { job: Job })[] }) => {
  if (applications.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-text">No applications yet</p>
        <p className="mt-1 text-sm text-muted">Roles you apply to will show up here with their status.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((app) => (
        <Link key={app.id} href={`/jobs/${app.job.id}`} className="glass flex flex-col gap-1.5 rounded-2xl p-4 transition hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-text">{app.job.heading}</h3>
              <p className="truncate text-xs text-muted">{app.job.startupName}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-[11px] text-muted">Applied {formatDateTime(app.createdAt)}</p>
        </Link>
      ))}
    </div>
  );
};
