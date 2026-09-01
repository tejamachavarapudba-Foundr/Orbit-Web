import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { JOB_NOTIFICATION_TYPES } from "@/lib/notificationCategories";
import type { Job } from "@/lib/types";

import { markCategoryReadAction } from "../notifications/actions";
import { getMyAnalyticsAction, getMyApplicationsAction, getMyPostsAction } from "./actions";
import { JobsBrowseList } from "./JobsBrowseList";
import { MyApplicationsPanel } from "./MyApplicationsPanel";
import { MyPostsPanel } from "./MyPostsPanel";

export const dynamic = "force-dynamic";

const TAB_KEYS = ["browse", "mine"] as const;

type JobsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const [{ tab: tabParam }, me, jobs] = await Promise.all([
    searchParams,
    getMe(),
    apiFetch<Job[]>("/jobs"),
    markCategoryReadAction(JOB_NOTIFICATION_TYPES)
  ]);

  const tab = tabParam === "mine" ? "mine" : "browse";
  const role = me.profile.role?.toLowerCase();
  const canPostJobs = role === "founder" || role === "investor";

  return (
    <div className="max-w-160">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Briefcase className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Jobs</h1>
          <p className="text-xs text-muted">{jobs.length} openings</p>
        </div>
        {canPostJobs ? (
          <Link href="/jobs/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Post a job
          </Link>
        ) : null}
      </div>

      <div className="glass mb-4 flex gap-1 rounded-2xl p-1.5">
        {TAB_KEYS.map((key) => (
          <Link
            key={key}
            href={`/jobs?tab=${key}`}
            className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-bold transition ${
              tab === key ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm" : "text-muted hover:bg-muted-bg/70 hover:text-text"
            }`}
          >
            {key === "mine" ? (canPostJobs ? "My posts | Analytics" : "Applied | Status") : "New jobs"}
          </Link>
        ))}
      </div>

      {tab === "browse" ? <JobsBrowseList jobs={jobs} /> : canPostJobs ? <MinePostsTab /> : <MineApplicationsTab />}
    </div>
  );
}

async function MineApplicationsTab() {
  const applications = await getMyApplicationsAction();
  return <MyApplicationsPanel applications={applications} />;
}

async function MinePostsTab() {
  const [posts, analytics] = await Promise.all([getMyPostsAction(), getMyAnalyticsAction()]);
  return <MyPostsPanel posts={posts} analytics={analytics} />;
}
