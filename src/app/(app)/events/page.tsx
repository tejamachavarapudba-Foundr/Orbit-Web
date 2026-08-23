import Link from "next/link";
import { Calendar, MapPin, Plus, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { EventItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

export default async function EventsPage() {
  const events = await apiFetch<EventItem[]>("/events");
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() >= now);
  const past = events.filter((e) => new Date(e.startsAt).getTime() < now);

  const EventRow = ({ event }: { event: EventItem }) => (
    <Link href={`/events/${event.id}`} className="glass flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5">
      <div className="flex h-13 w-13 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
        <span className="text-[10px] font-bold uppercase leading-none">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(event.startsAt))}</span>
        <span className="font-display text-base font-bold leading-none">{new Date(event.startsAt).getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-text">{event.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" strokeWidth={2} />
            {formatDateTime(event.startsAt)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" strokeWidth={2} />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" strokeWidth={2} />
            {event._count?.attendees ?? 0} going
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="mx-auto max-w-160 px-5 py-5">
      <div className="glass mb-5 flex items-center gap-3.5 rounded-2xl px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
          <Calendar className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-bold text-text">Events</h1>
          <p className="text-xs text-muted">{upcoming.length} upcoming</p>
        </div>
        <Link href="/events/new" className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New event
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {upcoming.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted">No upcoming events.</div>
        ) : (
          upcoming.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </div>

      {past.length > 0 ? (
        <>
          <h2 className="mb-3 mt-6 px-1 font-display text-sm font-bold text-text">Past</h2>
          <div className="flex flex-col gap-3 opacity-70">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
