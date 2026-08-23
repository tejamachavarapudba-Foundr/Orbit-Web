"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const markAllReadAction = async () => {
  await apiFetch("/notifications/read-all", { method: "PATCH" });
  revalidatePath("/notifications");
};

export const markOneReadAction = async (id: string) => {
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
  revalidatePath("/notifications");
};
