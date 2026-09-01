"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Search, Users } from "lucide-react";

import { formatEventRange, getCountdownLabel, getDisplayStatus } from "@/lib/eventStatus";
import type { EventItem } from "@/lib/types";

import { rsvpAction } from "./actions";

const filters = [
  { label: "All", value: "all" },
  { label: "Joined", value: "joined" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" }
] as const;

const statusStyle: Record<string, string> = {
  Active: "bg-primary-muted text-primary",
  Completed: "bg-muted-bg text-muted",
  Cancelled: "bg-danger-bg text-danger"
};

type EventWithStatus = EventItem & { isGoing: boolean };

type EventsListProps = {
  events: EventWithStatus[];
};

export const EventsList = ({ events }: EventsListProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const status = getDisplayStatus(event);
      if (filter === "upcoming" && !(status === "Active" && new Date(event.startsAt).getTime() >= Date.now())) return false;
      if (filter === "joined" && !event.isGoing) return false;
      if (filter === "completed" && status !== "Completed") return false;
      if (filter === "cancelled" && status !== "Cancelled") return false;
      if (!query) return true;
      return [event.title, event.description, event.location, event.status].filter(Boolean).some((field) => field!.toLowerCase().includes(query));
    });
  }, [events, search, filter]);

  const handleRsvp = (eventId: string) => {
    setPendingId(eventId);
    startTransition(async () => {
      await rsvpAction(eventId);
      router.refresh();
      setPendingId(null);
    });
  };

  return (
    <div>
      <div className="glass mb-3.5 flex items-center gap-2.5 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, hosts, locations..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              filter === f.value ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "glass text-muted hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-sm font-semibold text-text">No events found</p>
          <p className="mt-1 text-sm text-muted">Try another filter or check upcoming Startuphouze events soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((event) => {
            const status = getDisplayStatus(event);
            const countdown = getCountdownLabel(event);
            const canJoin = status !== "Cancelled" && status !== "Completed";
            return (
              <div key={event.id} className="glass flex flex-col gap-3 rounded-2xl p-4">
                <Link href={`/events/${event.id}`} className="flex min-w-0 items-start gap-4">
                  <div className="flex h-13 w-13 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
                    <span className="text-[10px] font-bold uppercase leading-none">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(event.startsAt))}</span>
                    <span className="font-display text-base font-bold leading-none">{new Date(event.startsAt).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="truncate text-sm font-bold text-text">{event.title}</h3>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle[status]}`}>{status}</span>
                      {countdown ? <span className="flex-shrink-0 rounded-full bg-muted-bg px-2 py-0.5 text-[10px] font-bold text-muted">{countdown}</span> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">Hosted by {event.host?.fullName || "Startuphouze member"}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" strokeWidth={2} />
                        {formatEventRange(event.startsAt, event.endsAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" strokeWidth={2} />
                        {event._count?.attendees ?? 0} joined
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-shrink-0 items-center gap-2 self-end">
                  {event.isGoing ? <span className="rounded-full bg-primary-muted px-2.5 py-1 text-[10.5px] font-bold text-primary">You are going</span> : null}
                  <button
                    type="button"
                    disabled={!canJoin || pendingId === event.id}
                    onClick={() => handleRsvp(event.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      event.isGoing
                        ? "border border-border/70 text-text hover:bg-muted-bg/70"
                        : "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm"
                    }`}
                  >
                    {event.isGoing ? "Leave" : "Join"}
                  </button>
                  <Link href={`/events/${event.id}`} className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70">
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
