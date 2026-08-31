"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { InvestorSnapshot } from "@/lib/types";

export const getInvestorSnapshotAction = async (projectId: string): Promise<InvestorSnapshot | null> => {
  try {
    return await apiFetch<InvestorSnapshot>(`/investor-snapshot/project/${projectId}`);
  } catch {
    // 404 (no snapshot yet) or 403 (not eligible to view) both just mean
    // "nothing to show" from the caller's perspective — the page decides
    // what to render based on ownership, not on parsing the error.
    return null;
  }
};

export type SnapshotSaveState = { error: string | null };

export const saveInvestorSnapshotAction = async (
  projectId: string,
  payload: Partial<InvestorSnapshot>
): Promise<SnapshotSaveState> => {
  try {
    await apiFetch(`/investor-snapshot/project/${projectId}`, { method: "PATCH", body: payload });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't save — try again." };
  }

  revalidatePath(`/startups/${projectId}/investor-snapshot`);
  revalidatePath(`/startups/${projectId}`);
  return { error: null };
};

export type ExtractState = { error: string | null; extracted: Partial<InvestorSnapshot> | null };

export const extractPitchDeckAction = async (projectId: string, formData: FormData): Promise<ExtractState> => {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF file first.", extracted: null };
  }

  const body = new FormData();
  body.set("file", file);

  try {
    const result = await apiFetch<{ extracted: Partial<InvestorSnapshot> }>(
      `/investor-snapshot/project/${projectId}/extract-pdf`,
      { method: "POST", formData: body }
    );
    return { error: null, extracted: result.extracted };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't read that PDF — try again.", extracted: null };
  }
};
