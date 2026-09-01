import { notFound } from "next/navigation";
import { Briefcase, MapPin, Users } from "lucide-react";
import { getMe } from "@/lib/auth";

import { gradientFor } from "@/components/Avatar";
import { BackButton } from "@/components/BackButton";
import { apiFetch, ApiError } from "@/lib/api";
import type { Job } from "@/lib/types";

import { ApplyJobForm } from "./ApplyJobForm";

export const dynamic = "force-dynamic";

const formatPostedAt = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Posted today";
  if (days < 30) return `Posted ${days}d ago`;
  return `Posted ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value))}`;
};

// Mirrors mobile's descriptionPoints(): split on newlines, strip any
// leading bullet/number markers, drop blanks — the description is authored
// as free text but always rendered as a bulleted list.
const descriptionPoints = (description: string) =>
  description
    .split("\n")
    .map((line) => line.replace(/^[•\-*◦‣·]+\s*|^\d+[.)]\s*/, "").trim())
    .filter(Boolean);

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
  const role = me.profile.role?.toLowerCase();
  const isOwner = job.posterId === me.id;
  const canManageJobs = role === "founder" || role === "investor";
  const myApplication = job.applications?.find((a) => a.applicantId === me.id);
  const canApply = !canManageJobs && !isOwner && !myApplication;

  return (
    <div className="max-w-160">
      <BackButton fallbackHref="/jobs" />

      <div className="glass rounded-2xl p-6">
        <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br font-display text-xl font-bold text-white ${gradientFor(job.startupName)}`}>
          {job.startupName.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-3 font-display text-xl font-bold leading-tight text-text">{job.heading}</h1>
        <p className="mt-1 text-sm text-muted">{job.startupName}</p>

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            {job.applications?.length ?? 0} applicant{(job.applications?.length ?? 0) === 1 ? "" : "s"}
          </span>
          <span>{formatPostedAt(job.createdAt)}</span>
        </div>

        <div className="glass mt-4 flex flex-col gap-2 rounded-xl p-4">
          <div className="flex items-center gap-2.5 py-1 text-sm text-text">
            <Briefcase className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            {job.experience || "Experience not specified"}
          </div>
          <div className="flex items-center gap-2.5 py-1 text-sm text-text">
            <Users className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            {job.openings ?? 1} vacanc{(job.openings ?? 1) === 1 ? "y" : "ies"}
          </div>
          <div className="flex items-center gap-2.5 py-1 text-sm text-text">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            {job.location || "Location not specified"}
          </div>
        </div>

        {job.skills && job.skills.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-muted">Must have skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-muted-bg px-2.5 py-1 text-xs text-muted">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {job.description ? (
          <div className="mt-5">
            <h2 className="mb-2 font-display text-lg font-bold text-text">Job description</h2>
            <div className="glass rounded-xl p-4">
              <p className="text-sm font-bold text-text">What you&apos;ll do</p>
              <p className="text-sm font-semibold text-muted">Role &amp; responsibilities</p>
              <p className="mt-3 text-sm font-semibold text-text">Responsibilities</p>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {descriptionPoints(job.description).map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-6 text-text">
                    <span className="flex-shrink-0">•</span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {myApplication ? (
          <div className="mt-5 rounded-xl border border-border/70 bg-muted-bg/60 p-4">
            <p className="mb-1 text-sm font-semibold text-text">You applied</p>
            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-800">
              {myApplication.status}
            </span>
          </div>
        ) : canApply ? (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-text">Apply</p>
            <ApplyJobForm jobId={id} hasResume={Boolean(me.profile.resumeFileName)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
