"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";
import type { Certification, WorkExperience } from "@/lib/types";

export type SubmitFounderVerificationState = { error: string | null; success: string | null };

export const submitFounderVerificationAction = async (
  _prevState: SubmitFounderVerificationState,
  formData: FormData
): Promise<SubmitFounderVerificationState> => {
  const certificateName = String(formData.get("certificateName") ?? "").trim();
  const cinNumber = String(formData.get("cinNumber") ?? "").trim();
  const file = formData.get("document");

  if (!certificateName) {
    return { error: "Enter the name on your incorporation certificate.", success: null };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Attach your incorporation certificate.", success: null };
  }

  try {
    const uploadBody = new FormData();
    uploadBody.set("file", file);
    uploadBody.set("type", "document");
    const upload = await apiFetch<{ url: string; path: string }>("/storage/upload", { method: "POST", formData: uploadBody });

    await apiFetch("/verification/founder", {
      method: "POST",
      body: { certificateName, cinNumber, documentUrl: upload.url, documentKey: upload.path }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't submit verification — try again.", success: null };
  }

  revalidatePath("/settings/verify");
  return { error: null, success: "Verification submitted for review." };
};

export type RoleVerificationResult = { error: string | null };

export const uploadCertificationFileAction = async (formData: FormData): Promise<{ url: string; path: string } | { error: string }> => {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file first." };

  try {
    const body = new FormData();
    body.set("file", file);
    body.set("type", "document");
    return await apiFetch<{ url: string; path: string }>("/storage/upload", { method: "POST", formData: body });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Upload failed — try again." };
  }
};

export const submitInvestorVerificationAction = async (company: string, website: string): Promise<RoleVerificationResult> => {
  if (!company.trim() || !website.trim()) return { error: "Company name and website are required." };
  try {
    await apiFetch("/profiles/me", { method: "PATCH", body: { company: company.trim(), website: website.trim() } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't save — try again." };
  }
  revalidatePath("/settings/verify");
  return { error: null };
};

export const submitExperienceVerificationAction = async (
  role: "professional" | "advisor",
  // The rest of this role's existing fields (skills, portfolio, expertise,
  // etc.) — the backend's roleProfile upsert overwrites the whole row with
  // whatever's in `data`, it does not merge, so anything not included here
  // would otherwise get silently wiped back to empty.
  existingData: Record<string, unknown>,
  experiences: WorkExperience[],
  certifications: Certification[]
): Promise<RoleVerificationResult> => {
  const cleanedExperiences = experiences.filter((entry) => entry.company.trim() || entry.designation.trim());
  const cleanedCertifications = certifications.filter((entry) => entry.name.trim() && entry.fileUrl);

  if (!cleanedExperiences.some((entry) => entry.company.trim() && entry.designation.trim())) {
    return { error: "Add at least one experience with a company and designation." };
  }

  try {
    await apiFetch("/profiles/me", {
      method: "PATCH",
      body: {
        roleProfile: {
          role,
          data: { ...existingData, experiences: cleanedExperiences, certifications: cleanedCertifications }
        }
      }
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't save — try again." };
  }
  revalidatePath("/settings/verify");
  return { error: null };
};

export const submitServiceProviderVerificationAction = async (
  existingData: Record<string, unknown>,
  company: string,
  website: string,
  companyLinkedinUrl: string
): Promise<RoleVerificationResult> => {
  if (!company.trim() || !website.trim() || !companyLinkedinUrl.trim()) {
    return { error: "Company name, website and LinkedIn page are required." };
  }
  try {
    await apiFetch("/profiles/me", {
      method: "PATCH",
      body: {
        roleProfile: {
          role: "service_provider",
          data: {
            ...existingData,
            company: company.trim(),
            website: website.trim(),
            companyLinkedinUrl: companyLinkedinUrl.trim()
          }
        }
      }
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't save — try again." };
  }
  revalidatePath("/settings/verify");
  return { error: null };
};
