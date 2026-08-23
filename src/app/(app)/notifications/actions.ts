"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { AppNotification } from "@/lib/types";

export const markAllReadAction = async () => {
  await apiFetch("/notifications/read-all", { method: "PATCH" });
  revalidatePath("/notifications");
};

export const markOneReadAction = async (id: string) => {
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
  revalidatePath("/notifications");
};

/** Clears the badge for one category (Projects/Jobs/Events/Messages/
 * connection requests) by marking its unread notifications read — called
 * when the user visits that section, since those types no longer appear
 * in the bell for them to mark read one by one. */
export const markCategoryReadAction = async (types: string[]) => {
  const notifications = await apiFetch<AppNotification[]>("/notifications");
  const targets = notifications.filter((n) => !n.isRead && types.includes(n.type));
  if (targets.length === 0) return;
  await Promise.all(targets.map((n) => apiFetch(`/notifications/${n.id}/read`, { method: "PATCH" })));
};
