"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

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
