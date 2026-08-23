"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const connectAction = async (targetId: string) => {
  await apiFetch("/connections/requests", { method: "POST", body: { recipientId: targetId } });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
  revalidatePath("/");
};

export const acceptRequestAction = async (requestId: string, targetId: string) => {
  await apiFetch(`/connections/requests/${requestId}/accept`, { method: "POST" });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
  revalidatePath("/");
};

export const declineRequestAction = async (requestId: string, targetId: string) => {
  await apiFetch(`/connections/requests/${requestId}/decline`, { method: "POST" });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
};

export const cancelRequestAction = async (requestId: string, targetId: string) => {
  await apiFetch(`/connections/requests/${requestId}`, { method: "DELETE" });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
};

export const messageAction = async (participantId: string) => {
  const chat = await apiFetch<{ id: string }>("/chats", { method: "POST", body: { participantId } });
  redirect(`/messages/${chat.id}`);
};

export const followAction = async (targetId: string) => {
  await apiFetch(`/follows/${targetId}`, { method: "POST" });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
};

export const unfollowAction = async (targetId: string) => {
  await apiFetch(`/follows/${targetId}`, { method: "DELETE" });
  revalidatePath(`/u/${targetId}`);
  revalidatePath("/network");
};
