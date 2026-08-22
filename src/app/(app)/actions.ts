"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { clearSessionTokens } from "@/lib/session";

export const logoutAction = async () => {
  await clearSessionTokens();
  redirect("/login");
};

export type CreatePostState = { error: string | null };

export const createPostAction = async (_prevState: CreatePostState, formData: FormData): Promise<CreatePostState> => {
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { error: "Write something before posting." };
  }

  const body = new FormData();
  body.set("content", content);
  body.set("category", "Update");

  try {
    await apiFetch("/posts", { method: "POST", formData: body });
  } catch {
    return { error: "Couldn't publish that post — try again." };
  }

  revalidatePath("/");
  return { error: null };
};
