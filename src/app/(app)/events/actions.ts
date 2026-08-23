"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateEventState = { error: string | null };

export const createEventAction = async (_prevState: CreateEventState, formData: FormData): Promise<CreateEventState> => {
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsAt = String(formData.get("endsAt") ?? "");
  const isPrivate = formData.get("isPrivate") === "true";
  const communityId = String(formData.get("communityId") ?? "").trim();
  const inviteeIds = formData.getAll("inviteeIds").map(String).filter(Boolean);

  if (!title || !location || !startsAt) {
    return { error: "Title, location and start time are required." };
  }

  let event: { id: string };
  try {
    event = await apiFetch("/events", {
      method: "POST",
      body: {
        title,
        location,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        description: String(formData.get("description") ?? "").trim(),
        isPrivate,
        communityId: isPrivate && communityId ? communityId : undefined,
        inviteeIds: isPrivate && inviteeIds.length > 0 ? inviteeIds : undefined
      }
    });
  } catch {
    return { error: "Couldn't create that event — try again." };
  }

  redirect(`/events/${event.id}`);
};

export const rsvpAction = async (eventId: string) => {
  await apiFetch(`/events/${eventId}/rsvp`, { method: "POST" });
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
};

export type UpdateLocationState = { error: string | null };

export const updateEventLocationAction = async (
  eventId: string,
  _prevState: UpdateLocationState,
  formData: FormData
): Promise<UpdateLocationState> => {
  const location = String(formData.get("location") ?? "").trim();
  if (!location) return { error: "Location is required." };

  try {
    await apiFetch(`/events/${eventId}`, {
      method: "PATCH",
      body: { location }
    });
  } catch {
    return { error: "Couldn't update the location — try again." };
  }

  revalidatePath(`/events/${eventId}`);
  return { error: null };
};

export type CancelEventState = { error: string | null };

export const cancelEventAction = async (
  eventId: string,
  _prevState: CancelEventState,
  formData: FormData
): Promise<CancelEventState> => {
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { error: "Add a reason for cancelling." };

  try {
    await apiFetch(`/events/${eventId}`, {
      method: "DELETE",
      body: { Reason: reason }
    });
  } catch {
    return { error: "Couldn't cancel that event — try again." };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  return { error: null };
};
