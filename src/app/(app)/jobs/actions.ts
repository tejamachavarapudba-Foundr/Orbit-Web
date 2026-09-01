"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { Job, JobAnalytics, JobApplication, Profile } from "@/lib/types";

export type JobPostWithApplicants = Omit<Job, "applications"> & { applications: (JobApplication & { applicant: Profile })[] };

export type CreateJobState = { error: string | null };

export const createJobAction = async (_prevState: CreateJobState, formData: FormData): Promise<CreateJobState> => {
  const startupName = String(formData.get("startupName") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!startupName || !heading || !role || !description) {
    return { error: "Startup name, title, role and description are required." };
  }

  let job: { id: string };
  try {
    job = await apiFetch("/jobs", {
      method: "POST",
      body: {
        startupName,
        heading,
        role,
        experience: String(formData.get("experience") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        openings: Math.max(1, parseInt(String(formData.get("openings") ?? "1"), 10) || 1),
        description,
        skills: String(formData.get("skills") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't post that job — try again." };
  }

  redirect(`/jobs/${job.id}`);
};

export type ApplyJobState = { error: string | null; success: string | null };

export const applyToJobAction = async (jobId: string, _prevState: ApplyJobState, formData: FormData): Promise<ApplyJobState> => {
  try {
    await apiFetch(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: { message: String(formData.get("message") ?? "").trim() || "Resume + cover letter..." }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't submit that application.", success: null };
  }

  revalidatePath(`/jobs/${jobId}`);
  return { error: null, success: "Application submitted." };
};

export const getMyApplicationsAction = async (): Promise<(JobApplication & { job: Job })[]> =>
  apiFetch("/jobs/mine/applications");

export const getMyPostsAction = async (): Promise<JobPostWithApplicants[]> => apiFetch("/jobs/mine/posts");

export const getMyAnalyticsAction = async (): Promise<JobAnalytics> => apiFetch("/jobs/mine/analytics");

export const respondToApplicationAction = async (
  jobId: string,
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<void> => {
  await apiFetch(`/jobs/${jobId}/applications/${applicationId}`, { method: "PATCH", body: { status } });
  revalidatePath("/jobs");
};

export const deleteJobAction = async (jobId: string): Promise<void> => {
  await apiFetch(`/jobs/${jobId}`, { method: "DELETE" });
  revalidatePath("/jobs");
};

export const getApplicationResumeAction = async (jobId: string, applicationId: string): Promise<{ url: string; fileName: string | null }> =>
  apiFetch(`/jobs/${jobId}/applications/${applicationId}/resume`);
