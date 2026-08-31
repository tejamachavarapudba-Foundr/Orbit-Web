"use server";

import { apiFetch } from "@/lib/api";
import type { PitchReelsPage } from "@/lib/types";

export const loadReelsAction = async (cursor?: string): Promise<PitchReelsPage> =>
  apiFetch<PitchReelsPage>(`/projects/reels${cursor ? `?cursor=${cursor}` : ""}`);

export const toggleReelLikeAction = async (projectId: string): Promise<{ liked: boolean }> =>
  apiFetch(`/projects/${projectId}/like`, { method: "POST" });

export const saveReelAction = async (projectId: string): Promise<void> => {
  await apiFetch(`/projects/${projectId}/save`, { method: "POST" });
};

export const unsaveReelAction = async (projectId: string): Promise<void> => {
  await apiFetch(`/projects/${projectId}/save`, { method: "DELETE" });
};
