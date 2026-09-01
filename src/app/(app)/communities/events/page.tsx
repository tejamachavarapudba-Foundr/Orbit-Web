import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { apiFetch, ApiError } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Community, EventAttendee, EventItem } from "@/lib/types";

import { EventsList } from "../../events/EventsList";

export const dynamic = "force-dynamic";

/** Mirrors mobile's CommunityEventsScreen: private events across every
 * community the current user belongs to, aggregated and sorted together —
 * a distinct list from the general /events tab, not a filtered view of it. */
export default async function CommunityEventsPage() {
  const [me, communities] = await Promise.all([getMe(), apiFetch<Community[]>("/communities/mine")]);

  const perCommunity = await Promise.all(
    communities.map(async (community) => {
      try {
        return await apiFetch<EventItem[]>(`/events/community/${community.id}`);
      } catch (error) {
        if (error instanceof ApiError) return [];
        throw error;
      }
    })
  );
  const events = perCommunity.flat().sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

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

  return (
    <div className="max-w-160">
      <BackButton fallbackHref="/communities" />
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-on-primary">
          <Calendar className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Community events</h1>
          <p className="text-xs text-muted">Private events across your {communities.length} communit{communities.length === 1 ? "y" : "ies"}</p>
        </div>
        {communities.length > 0 ? (
          <Link
            href={`/events/new?communityId=${communities[0].id}`}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            New event
          </Link>
        ) : null}
      </div>

      <EventsList events={withStatus} />
    </div>
  );
}
