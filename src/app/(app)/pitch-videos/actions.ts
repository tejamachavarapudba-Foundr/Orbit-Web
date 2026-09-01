"use server";

import { apiFetch } from "@/lib/api";
import type { PitchReelsPage } from "@/lib/types";

export const loadReelsAction = async (cursor?: string, limit?: number): Promise<PitchReelsPage> => {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  return apiFetch<PitchReelsPage>(`/projects/reels${qs ? `?${qs}` : ""}`);
};

export const toggleReelLikeAction = async (projectId: string): Promise<{ liked: boolean }> =>
  apiFetch(`/projects/${projectId}/like`, { method: "POST" });

export const saveReelAction = async (projectId: string): Promise<void> => {
  await apiFetch(`/projects/${projectId}/save`, { method: "POST" });
};

export const unsaveReelAction = async (projectId: string): Promise<void> => {
  await apiFetch(`/projects/${projectId}/save`, { method: "DELETE" });
};
