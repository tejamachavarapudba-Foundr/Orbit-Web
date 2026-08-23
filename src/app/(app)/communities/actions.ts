"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateCommunityState = { error: string | null };

export const createCommunityAction = async (_prevState: CreateCommunityState, formData: FormData): Promise<CreateCommunityState> => {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Give your community a name." };

  const memberIds = formData.getAll("memberIds").map(String).filter(Boolean);

  let community: { id: string };
  try {
    community = await apiFetch("/communities", {
      method: "POST",
      body: { name, description: String(formData.get("description") ?? "").trim(), memberIds }
    });
  } catch {
    return { error: "Couldn't create that community — try again." };
  }

  revalidatePath("/communities");
  redirect(`/communities/${community.id}`);
};

export const addMembersAction = async (communityId: string, userIds: string[]) => {
  await apiFetch(`/communities/${communityId}/members`, { method: "POST", body: { userIds } });
  revalidatePath(`/communities/${communityId}`);
};
