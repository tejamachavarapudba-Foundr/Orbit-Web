"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const unsaveFromWatchlistAction = async (projectId: string) => {
  await apiFetch(`/projects/${projectId}/save`, { method: "DELETE" });
  revalidatePath("/watchlist");
};
