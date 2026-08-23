"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const sendMessageAction = async (conversationId: string, content: string) => {
  if (!content.trim()) return;
  await apiFetch("/messages", { method: "POST", body: { conversationId, content: content.trim() } });
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
};
