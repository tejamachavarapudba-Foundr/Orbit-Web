"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import { clearSessionTokens } from "@/lib/session";

export type UpdateProfileState = { error: string | null; success: string | null };

export const updateProfileAction = async (_prevState: UpdateProfileState, formData: FormData): Promise<UpdateProfileState> => {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return { error: "Full name is required.", success: null };

  try {
    await apiFetch("/profiles/me", {
      method: "PATCH",
      body: {
        fullName,
        headline: String(formData.get("headline") ?? "").trim(),
        bio: String(formData.get("bio") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        company: String(formData.get("company") ?? "").trim(),
        website: String(formData.get("website") ?? "").trim(),
        linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim(),
        openToConnect: formData.get("openToConnect") === "on",
        skills: String(formData.get("skills") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't save your profile — try again.", success: null };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { error: null, success: "Profile updated." };
};

export const uploadAvatarAction = async (formData: FormData) => {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return;

  const body = new FormData();
  body.set("file", file);
  await apiFetch("/profiles/me/avatar", { method: "PATCH", formData: body });
  revalidatePath("/profile");
  revalidatePath("/", "layout");
};

export const uploadResumeAction = async (formData: FormData) => {
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) return;

  const body = new FormData();
  body.set("file", file);
  await apiFetch("/profiles/me/resume", { method: "PATCH", formData: body });
  revalidatePath("/profile");
};

export const deleteResumeAction = async () => {
  await apiFetch("/profiles/me/resume", { method: "DELETE" });
  revalidatePath("/profile");
};

export const deleteAccountAction = async () => {
  await apiFetch("/users/me", { method: "DELETE" });
  await clearSessionTokens();
  redirect("/login");
};
