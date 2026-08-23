import { notFound } from "next/navigation";
import { Briefcase, Building2, Layers } from "lucide-react";
import { getMe } from "@/lib/auth";

import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, Job } from "@/lib/types";

import { ApplyJobForm } from "./ApplyJobForm";

export const dynamic = "force-dynamic";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  let job: Job;
  try {
    job = await apiFetch<Job>(`/jobs/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const me = await getMe();
  const isOwner = job.posterId === me.id;
  const hasApplied = job.applications?.some((a) => a.applicantId === me.id);

  return (
    <div className="max-w-160">
      <div className="glass rounded-2xl p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Briefcase className="h-6 w-6" strokeWidth={2} />
        </span>
        <h1 className="mt-3 font-display text-xl font-bold text-text">{job.heading}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
            {job.startupName}
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <Layers className="h-3.5 w-3.5" strokeWidth={2} />
            {job.role?.replace(/_/g, " ")}
          </span>
          {job.experience ? <span>· {job.experience}</span> : null}
        </div>

        {job.skills && job.skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-primary-muted px-2.5 py-1 text-[11px] font-bold text-primary">
                {skill}
              </span>
            ))}
          </div>
        ) : null}

        {job.description ? <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text">{job.description}</p> : null}
      </div>

      {!isOwner ? (
        <div className="glass mt-4 rounded-2xl p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Apply</h2>
          {hasApplied ? <p className="text-sm text-muted">You&apos;ve already applied to this role.</p> : <ApplyJobForm jobId={id} />}
        </div>
      ) : (
        <div className="glass mt-4 rounded-2xl p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{job.applications?.length ?? 0} applicants</h2>
          {job.applications && job.applications.length > 0 ? (
            <p className="text-sm text-muted">Review applicants from the Orbit mobile app for now.</p>
          ) : (
            <p className="text-sm text-muted">No applications yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
