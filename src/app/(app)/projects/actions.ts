"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";

export type CreateProjectState = { error: string | null };

export const createProjectAction = async (_prevState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
  const name = String(formData.get("name") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "");
  const stage = String(formData.get("stage") ?? "");
  // A brand-new project has no id yet, so the video can't be uploaded until
  // right after creation — same two-step shape mobile's ProjectComposer
  // uses, just without needing to hold it in client state since this whole
  // form (including the file) submits in one Server Action call.
  const pitchVideoFile = formData.get("pitchVideoFile");

  if (!name || !projectType || !stage) {
    return { error: "Name, category and stage are required." };
  }
  if (!(pitchVideoFile instanceof File) || pitchVideoFile.size === 0) {
    return { error: "Upload a founder pitch video file." };
  }

  let project: { id: string };
  try {
    project = await apiFetch("/projects", {
      method: "POST",
      body: {
        name,
        projectType,
        // Mobile treats "category" as the same concept as projectType and
        // keeps them in sync when creating a project (see ProjectComposer's
        // "Category was folded into Platform" comment) — matching that here
        // so a project's category isn't silently blank when made on web.
        category: projectType,
        stage,
        tagline: String(formData.get("tagline") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        websiteUrl: String(formData.get("websiteUrl") ?? "").trim(),
        askAmount: String(formData.get("askAmount") ?? "").trim(),
        equityPercent: String(formData.get("equityPercent") ?? "").trim(),
        isPublished: true
      }
    });
  } catch {
    return { error: "Couldn't create that startup — try again." };
  }

  try {
    const videoBody = new FormData();
    videoBody.set("file", pitchVideoFile);
    await apiFetch(`/projects/${project.id}/pitch-video`, { method: "PATCH", formData: videoBody });
  } catch {
    // The startup itself was already created — redirect regardless rather
    // than returning an error here, which would leave the user sitting on
    // this form with the project already made; resubmitting would create a
    // duplicate. The startup page just shows no video yet if this failed.
  }

  redirect(`/startups/${project.id}`);
};
