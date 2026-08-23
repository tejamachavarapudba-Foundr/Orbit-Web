"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateEventState = { error: string | null };

export const createEventAction = async (_prevState: CreateEventState, formData: FormData): Promise<CreateEventState> => {
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");

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
        description: String(formData.get("description") ?? "").trim()
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
