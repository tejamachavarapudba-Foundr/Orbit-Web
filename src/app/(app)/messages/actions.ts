"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { Message } from "@/lib/types";

export const sendMessageAction = async (conversationId: string, content: string): Promise<Message | null> => {
  if (!content.trim()) return null;
  const message = await apiFetch<Message>("/messages", { method: "POST", body: { conversationId, content: content.trim() } });
  revalidatePath("/messages");
  return message;
};

/** Lightweight poll target for an open thread — fetches just the message
 * list, not the whole route tree, so it doesn't fight in-flight navigation
 * or re-run the app shell's sidebar/counter queries every few seconds. */
export const getMessagesAction = async (conversationId: string): Promise<Message[]> => {
  return apiFetch<Message[]>(`/messages?conversationId=${conversationId}&limit=50`);
};

/** Marks incoming unread messages in a thread as read so the Messages
 * nav badge (unread chats) clears once the thread has actually been seen. */
export const markMessagesReadAction = async (messages: Message[], currentUserId: string) => {
  const unread = messages.filter((m) => m.senderId !== currentUserId && !m.readAt);
  if (unread.length === 0) return;
  await Promise.all(unread.map((m) => apiFetch(`/messages/${m.id}/read`, { method: "PATCH" })));
};
