"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateMeetingState = { error: string | null };

export const createMeetingProposalAction = async (_prevState: CreateMeetingState, formData: FormData): Promise<CreateMeetingState> => {
  const inviteeId = String(formData.get("inviteeId") ?? "");
  const purpose = String(formData.get("purpose") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!inviteeId) return { error: "Pick who you want to meet with." };
  if (!purpose) return { error: "Add a purpose for the meeting." };

  const proposedSlots = [1, 2, 3]
    .map((n) => ({
      date: String(formData.get(`slot${n}Date`) ?? "").trim(),
      time: String(formData.get(`slot${n}Time`) ?? "").trim()
    }))
    .filter((slot) => slot.date && slot.time);

  if (proposedSlots.length === 0) {
    return { error: "Propose at least one date and time." };
  }

  try {
    await apiFetch("/meetings/proposals", {
      method: "POST",
      body: {
        inviteMode: "people",
        inviteeUserIds: [inviteeId],
        purpose,
        message,
        schedulingMode: "date_push",
        proposedSlots,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't send that meeting request — try again." };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
};

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
