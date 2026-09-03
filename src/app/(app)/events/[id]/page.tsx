import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { getMe } from "@/lib/auth";

import { Avatar } from "@/components/Avatar";
import { BackButton } from "@/components/BackButton";
import { ShareEventButton } from "./ShareEventButton";
import { apiFetch, ApiError } from "@/lib/api";
import { formatEventRange, getCountdownLabel, getDisplayStatus } from "@/lib/eventStatus";
import type { AuthMe, EventAttendee, EventItem } from "@/lib/types";

import { rsvpAction } from "../actions";
import { EventHostTools } from "./EventHostTools";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  Active: "text-primary",
  Completed: "text-muted",
  Cancelled: "text-danger"
};

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  let event: EventItem;
  try {
    event = await apiFetch<EventItem>(`/events/${id}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const [me, attendees] = await Promise.all([getMe(), apiFetch<EventAttendee[]>(`/events/${id}/attendees`)]);

  const isGoing = attendees.some((a) => a.id === me.id);
  const isHost = event.hostId === me.id;
  const isCancelled = event.status === "CANCELLED";
  const status = getDisplayStatus(event);
  const countdown = getCountdownLabel(event);

  return (
    <div className="max-w-160">
      <BackButton fallbackHref="/events" />
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold text-text">{event.title}</h1>
              <span className={`text-xs font-bold ${statusStyle[status]}`}>{status}</span>
              {countdown ? <span className="rounded-full bg-muted-bg px-2 py-0.5 text-[10.5px] font-bold text-muted">{countdown}</span> : null}
            </div>
            <p className="mt-1 text-sm text-muted">Hosted by {event.host?.fullName || "Orbit member"}</p>
          </div>
          <ShareEventButton title={event.title} />
        </div>

        <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {formatEventRange(event.startsAt, event.endsAt)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {attendees.length} going
          </span>
        </div>

        {event.description ? <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text">{event.description}</p> : null}

        {isCancelled && event.cancellationReason ? (
          <p className="mt-3 text-sm font-semibold text-danger">Cancelled: {event.cancellationReason}</p>
        ) : null}

        {!isHost && !isCancelled ? (
          <form action={rsvpAction.bind(null, id)} className="mt-5">
            <button
              type="submit"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                isGoing
                  ? "border border-border/70 text-text hover:bg-muted-bg/70"
                  : "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/25"
              }`}
            >
              {isGoing ? "Cancel RSVP" : "RSVP"}
            </button>
          </form>
        ) : isHost ? (
          <span className="mt-5 inline-block rounded-full bg-primary-muted px-4 py-2 text-xs font-bold text-primary">You&apos;re hosting</span>
        ) : null}
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Attendees</h2>
        {attendees.length === 0 ? (
          <p className="text-sm text-muted">No one has RSVP&apos;d yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border/60">
            {attendees.map((a) => (
              <Link key={a.id} href={`/u/${a.id}`} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80">
                <Avatar id={a.id} name={a.fullName} avatarUrl={a.avatarUrl} size="h-9 w-9" textSize="text-xs" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-text">{a.fullName}</div>
                  <div className="truncate text-xs text-muted">{a.headline || a.company}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isHost ? <EventHostTools eventId={id} location={event.location} isCancelled={isCancelled} /> : null}
    </div>
  );
}
