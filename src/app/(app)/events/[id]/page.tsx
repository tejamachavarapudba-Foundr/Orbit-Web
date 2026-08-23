import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { getMe } from "@/lib/auth";

import { apiFetch, ApiError } from "@/lib/api";
import type { AuthMe, EventAttendee, EventItem } from "@/lib/types";

import { rsvpAction } from "../actions";

export const dynamic = "force-dynamic";

const gradients = ["from-sky-400 to-indigo-500", "from-amber-400 to-red-500", "from-emerald-400 to-sky-500", "from-fuchsia-400 to-pink-500"];
const gradientFor = (seed: string) => gradients[seed.charCodeAt(0) % gradients.length];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

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

  return (
    <div className="max-w-160">
      <div className="glass rounded-2xl p-6">
        {isCancelled ? (
          <span className="mb-3 inline-block rounded-full bg-danger-bg px-3 py-1 text-xs font-bold text-danger">Cancelled</span>
        ) : null}
        <h1 className="font-display text-xl font-bold text-text">{event.title}</h1>

        <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {formatDateTime(event.startsAt)}
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
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-xs font-bold text-white ${gradientFor(a.id)}`}>
                  {(a.fullName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-text">{a.fullName}</div>
                  <div className="truncate text-xs text-muted">{a.headline || a.company}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
