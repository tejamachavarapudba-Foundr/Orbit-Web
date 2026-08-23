import Link from "next/link";
import { Briefcase, MapPin, Plus } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { JOB_NOTIFICATION_TYPES } from "@/lib/notificationCategories";
import type { Job } from "@/lib/types";

import { markCategoryReadAction } from "../notifications/actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));

export default async function JobsPage() {
  const [jobs] = await Promise.all([apiFetch<Job[]>("/jobs"), markCategoryReadAction(JOB_NOTIFICATION_TYPES)]);

  return (
    <div className="max-w-160">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Briefcase className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Jobs</h1>
          <p className="text-xs text-muted">{jobs.length} open roles</p>
        </div>
        <Link href="/jobs/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Post a job
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">No open roles yet</p>
            <p className="mt-1 text-sm text-muted">Founders and HR can post vacancies here.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="glass flex flex-col gap-1.5 rounded-2xl p-4 transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-text">{job.heading}</h3>
                  <p className="truncate text-xs text-muted">{job.startupName}</p>
                </div>
                <span className="flex-shrink-0 text-[10.5px] text-muted">{formatDate(job.createdAt)}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="rounded-full bg-muted-bg px-2 py-0.5 font-bold capitalize">{job.role?.replace(/_/g, " ")}</span>
                {job.experience ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" strokeWidth={2} />
                    {job.experience}
                  </span>
                ) : null}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
