"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";

export type CreateProjectState = { error: string | null };

export const createProjectAction = async (_prevState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
  const name = String(formData.get("name") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "");
  const stage = String(formData.get("stage") ?? "");

  if (!name || !projectType || !stage) {
    return { error: "Name, category and stage are required." };
  }

  let project: { id: string };
  try {
    project = await apiFetch("/projects", {
      method: "POST",
      body: {
        name,
        projectType,
        stage,
        tagline: String(formData.get("tagline") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        websiteUrl: String(formData.get("websiteUrl") ?? "").trim(),
        isPublished: true
      }
    });
  } catch {
    return { error: "Couldn't create that startup — try again." };
  }

  redirect(`/startups/${project.id}`);
};
