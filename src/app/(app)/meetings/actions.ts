"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import type { ProposedSlot } from "@/lib/types";

export type CreateMeetingState = { error: string | null };

export const createMeetingProposalAction = async (_prevState: CreateMeetingState, formData: FormData): Promise<CreateMeetingState> => {
  const purpose = String(formData.get("purpose") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const inviteMode = String(formData.get("inviteMode") ?? "people") as "startup" | "people";
  const schedulingMode = String(formData.get("schedulingMode") ?? "date_push") as "availability_pick" | "date_push";

  if (!purpose) return { error: "Choose a purpose for the meeting." };

  const body: Record<string, unknown> = {
    inviteMode,
    purpose,
    message,
    schedulingMode,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  if (inviteMode === "startup") {
    const targetStartupId = String(formData.get("targetStartupId") ?? "");
    if (!targetStartupId) return { error: "Pick a startup." };
    body.targetStartupId = targetStartupId;
  } else {
    const inviteeUserIds = formData.getAll("inviteeUserIds").map(String).filter(Boolean);
    if (inviteeUserIds.length === 0) return { error: "Pick at least one person to invite." };
    body.inviteeUserIds = inviteeUserIds;
  }

  if (schedulingMode === "availability_pick") {
    const date = String(formData.get("selectedSlotDate") ?? "");
    const time = String(formData.get("selectedSlotTime") ?? "");
    if (!date || !time) return { error: "Pick one of their open times." };
    body.selectedSlot = { date, time };
  } else {
    const proposedSlots = [1, 2, 3]
      .map((n) => ({
        date: String(formData.get(`slot${n}Date`) ?? "").trim(),
        time: String(formData.get(`slot${n}Time`) ?? "").trim()
      }))
      .filter((slot) => slot.date && slot.time);
    if (proposedSlots.length === 0) return { error: "Propose at least one date and time." };
    body.proposedSlots = proposedSlots;
  }

  try {
    await apiFetch("/meetings/proposals", { method: "POST", body });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't send that meeting request — try again." };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
};

export const getOpenSlotsAction = async (profileId: string): Promise<{ timezone: string | null; slots: ProposedSlot[] }> =>
  apiFetch(`/meetings/availability/${profileId}/open-slots`);

export const respondToProposalAction = async (proposalId: string, formData: FormData) => {
  const action = String(formData.get("action") ?? "");
  if (action === "accept") {
    const date = String(formData.get("date") ?? "");
    const time = String(formData.get("time") ?? "");
    if (!date || !time) return;
    await apiFetch(`/meetings/proposals/${proposalId}/respond`, { method: "POST", body: { action: "accept", selectedSlot: { date, time } } });
  } else {
    await apiFetch(`/meetings/proposals/${proposalId}/respond`, { method: "POST", body: { action: "reject" } });
  }
  revalidatePath("/meetings");
};

export const withdrawProposalAction = async (proposalId: string) => {
  await apiFetch(`/meetings/proposals/${proposalId}`, { method: "DELETE" });
  revalidatePath("/meetings");
};

export const cancelMeetingAction = async (meetingId: string) => {
  await apiFetch(`/meetings/${meetingId}/cancel`, { method: "POST", body: {} });
  revalidatePath("/meetings");
};

export const getGoogleConnectUrlAction = async (): Promise<string> => {
  const data = await apiFetch<{ url: string }>("/google/oauth/url?platform=web");
  return data.url;
};

export const disconnectGoogleAction = async () => {
  await apiFetch("/google/oauth/disconnect", { method: "DELETE" });
  revalidatePath("/meetings");
};
