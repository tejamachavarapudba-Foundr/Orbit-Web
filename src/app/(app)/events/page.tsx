import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import { apiFetch, ApiError } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { EVENT_NOTIFICATION_TYPES } from "@/lib/notificationCategories";
import type { EventAttendee, EventItem } from "@/lib/types";

import { markCategoryReadAction } from "../notifications/actions";
import { EventsList } from "./EventsList";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [me, events] = await Promise.all([
    getMe(),
    apiFetch<EventItem[]>("/events"),
    markCategoryReadAction(EVENT_NOTIFICATION_TYPES)
  ]);

  const withStatus = await Promise.all(
    events.map(async (event) => {
      try {
        const attendees = await apiFetch<EventAttendee[]>(`/events/${event.id}/attendees`);
        return { ...event, isGoing: attendees.some((a) => a.id === me.id) };
      } catch (error) {
        if (error instanceof ApiError) return { ...event, isGoing: false };
        throw error;
      }
    })
  );

  const upcomingCount = events.filter((e) => e.status === "ACTIVE" && new Date(e.startsAt).getTime() >= Date.now()).length;

  return (
    <div className="max-w-160">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Calendar className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Events</h1>
          <p className="text-xs text-muted">{upcomingCount} upcoming</p>
        </div>
        <Link href="/events/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New event
        </Link>
      </div>

      <EventsList events={withStatus} />
    </div>
  );
}
