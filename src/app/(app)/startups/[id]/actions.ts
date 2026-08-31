"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { ProjectComment } from "@/lib/types";

export const saveStartupAction = async (id: string) => {
  await apiFetch(`/projects/${id}/save`, { method: "POST" });
  revalidatePath(`/startups/${id}`);
};

export const unsaveStartupAction = async (id: string) => {
  await apiFetch(`/projects/${id}/save`, { method: "DELETE" });
  revalidatePath(`/startups/${id}`);
};

export type ApplyState = { error: string | null; success: string | null };

export const applyToStartupAction = async (id: string, _prevState: ApplyState, formData: FormData): Promise<ApplyState> => {
  const role = String(formData.get("role") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  try {
    await apiFetch(`/projects/${id}/applications`, { method: "POST", body: { role, message } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't submit that application.", success: null };
  }

  revalidatePath(`/startups/${id}`);
  return { error: null, success: "Application sent." };
};

export type ReviewState = { error: string | null; success: string | null };

export const submitReviewAction = async (id: string, _prevState: ReviewState, formData: FormData): Promise<ReviewState> => {
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  try {
    await apiFetch(`/startups/${id}/reviews`, { method: "POST", body: { rating, comment } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't submit that review.", success: null };
  }

  revalidatePath(`/startups/${id}`);
  return { error: null, success: "Review submitted." };
};

export const listProjectCommentsAction = async (projectId: string): Promise<ProjectComment[]> =>
  apiFetch(`/projects/${projectId}/comments`);

export const createProjectCommentAction = async (projectId: string, content: string): Promise<ProjectComment> =>
  apiFetch(`/projects/${projectId}/comments`, { method: "POST", body: { content } });

export const deleteProjectCommentAction = async (commentId: string): Promise<void> => {
  await apiFetch(`/project-comments/${commentId}`, { method: "DELETE" });
};
