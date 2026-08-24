"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";

export type SaveAvailabilityState = { error: string | null };

export const saveAvailabilityAction = async (_prevState: SaveAvailabilityState, formData: FormData): Promise<SaveAvailabilityState> => {
  const timezone = String(formData.get("timezone") ?? "").trim() || "UTC";
  const enabledDays = formData.getAll("enabledDay").map((d) => Number(d));

  const slots = enabledDays
    .map((dayOfWeek) => ({
      dayOfWeek,
      startTime: String(formData.get(`start_${dayOfWeek}`) ?? "").trim(),
      endTime: String(formData.get(`end_${dayOfWeek}`) ?? "").trim()
    }))
    .filter((slot) => slot.startTime && slot.endTime);

  for (const slot of slots) {
    if (slot.startTime >= slot.endTime) {
      return { error: "Each day's end time must be after its start time." };
    }
  }

  try {
    await apiFetch("/meetings/availability", { method: "PUT", body: { timezone, slots } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't save your availability — try again." };
  }

  redirect("/meetings");
};
