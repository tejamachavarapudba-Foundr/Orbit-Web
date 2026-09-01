"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, FileText } from "lucide-react";

import { Avatar } from "@/components/Avatar";
import type { JobAnalytics, JobApplication, Profile } from "@/lib/types";

import { deleteJobAction, getApplicationResumeAction, respondToApplicationAction, type JobPostWithApplicants } from "./actions";

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

const ApplicationRow = ({ jobId, application }: { jobId: string; application: JobApplication & { applicant: Profile } }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const respond = (status: "accepted" | "rejected") => {
    startTransition(async () => {
      await respondToApplicationAction(jobId, application.id, status);
      router.refresh();
    });
  };

  const downloadResume = () => {
    startTransition(async () => {
      try {
        const { url } = await getApplicationResumeAction(jobId, application.id);
        window.open(url, "_blank");
      } catch {
        window.alert("No resume on file for this applicant.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 border-t border-border/60 py-3 first:border-t-0">
      <div className="flex items-center gap-2.5">
        <Link href={`/u/${application.applicant.id}`}>
          <Avatar id={application.applicant.id} name={application.applicant.fullName} avatarUrl={application.applicant.avatarUrl} size="h-9 w-9" textSize="text-xs" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${application.applicant.id}`} className="truncate text-sm font-bold text-text hover:underline">
            {application.applicant.fullName || "Unnamed"}
          </Link>
          <p className="text-[11px] text-muted">Applied {formatDateTime(application.createdAt)}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
      {application.message ? <p className="pl-11.5 text-xs leading-5 text-muted">{application.message}</p> : null}
      <div className="flex items-center gap-2 pl-11.5">
        <button
          type="button"
          onClick={downloadResume}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-[11px] font-bold text-text hover:bg-muted-bg/70 disabled:opacity-50"
        >
          <FileText className="h-3 w-3" strokeWidth={2} />
          Resume
          <Download className="h-3 w-3" strokeWidth={2} />
        </button>
        {application.status === "pending" ? (
          <>
            <button
              type="button"
              onClick={() => respond("accepted")}
              disabled={isPending}
              className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3 py-1 text-[11px] font-bold text-on-primary disabled:opacity-50"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => respond("rejected")}
              disabled={isPending}
              className="rounded-full border border-border/70 px-3 py-1 text-[11px] font-bold text-text hover:bg-muted-bg/70 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

const PostRow = ({ post }: { post: JobPostWithApplicants }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (post.applications.length > 0) return;
    if (!window.confirm("Delete this job posting?")) return;
    startTransition(async () => {
      await deleteJobAction(post.id);
      router.refresh();
    });
  };

  return (
    <div className="glass rounded-2xl p-4">
      <button type="button" onClick={() => setExpanded((e) => !e)} className="flex w-full items-center justify-between gap-3 text-left">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-text">{post.heading}</h3>
          <p className="text-xs text-muted">{post.applications.length} applicant{post.applications.length === 1 ? "" : "s"}</p>
        </div>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted transition ${expanded ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {expanded ? (
        <div className="mt-2">
          {post.applications.length === 0 ? (
            <p className="border-t border-border/60 py-3 text-xs text-muted">No applications yet.</p>
          ) : (
            post.applications.map((app) => <ApplicationRow key={app.id} jobId={post.id} application={app} />)
          )}
          {post.applications.length === 0 ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="mt-1 text-[11px] font-bold text-danger hover:underline disabled:opacity-50"
            >
              Delete posting
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

type MyPostsPanelProps = {
  posts: JobPostWithApplicants[];
  analytics: JobAnalytics;
};

export const MyPostsPanel = ({ posts, analytics }: MyPostsPanelProps) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-4 gap-2.5">
      {[
        { label: "Applicants", value: analytics.totalApplications },
        { label: "Accepted", value: analytics.accepted },
        { label: "Rejected", value: analytics.rejected },
        { label: "Onboarded", value: analytics.onboardCount }
      ].map((stat) => (
        <div key={stat.label} className="glass rounded-2xl p-3 text-center">
          <p className="font-display text-lg font-bold text-text">{stat.value}</p>
          <p className="text-[10.5px] text-muted">{stat.label}</p>
        </div>
      ))}
    </div>

    {posts.length === 0 ? (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-text">No jobs posted yet</p>
        <p className="mt-1 text-sm text-muted">Post a role to start receiving applications.</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
    )}
  </div>
);
