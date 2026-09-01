import type { EventItem } from "@/lib/types";

/** Mirrors mobile's utils.ts getDisplayStatus/getCountdownLabel. */
export const getDisplayStatus = (event: EventItem): "Active" | "Completed" | "Cancelled" => {
  if (event.status === "CANCELLED") return "Cancelled";
  const end = new Date(event.endsAt ?? event.startsAt).getTime();
  if (end < Date.now()) return "Completed";
  return "Active";
};

export const getCountdownLabel = (event: EventItem): string | null => {
  if (event.status === "CANCELLED") return null;
  const now = Date.now();
  const start = new Date(event.startsAt).getTime();
  const end = new Date(event.endsAt ?? event.startsAt).getTime();
  if (start <= now && now <= end) return "Happening now";
  if (end < now) return null;
  const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  return days <= 1 ? "1 day to go" : `${days} days to go`;
};

export const formatEventRange = (startsAt: string, endsAt: string | null) => {
  const start = new Date(startsAt);
  const datePart = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(start);
  const startTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(start);
  if (!endsAt) return `${datePart}, ${startTime}`;
  const endTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(endsAt));
  return `${datePart}, ${startTime} - ${endTime}`;
};
