"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateJobState = { error: string | null };

export const createJobAction = async (_prevState: CreateJobState, formData: FormData): Promise<CreateJobState> => {
  const startupName = String(formData.get("startupName") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!startupName || !heading || !role) {
    return { error: "Startup name, title and role are required." };
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
        description: String(formData.get("description") ?? "").trim(),
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
      body: { message: String(formData.get("message") ?? "").trim() }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't submit that application.", success: null };
  }

  revalidatePath(`/jobs/${jobId}`);
  return { error: null, success: "Application submitted." };
};
