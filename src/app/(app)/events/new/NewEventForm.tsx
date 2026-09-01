"use client";

import { useActionState, useState } from "react";

import { PeoplePicker } from "@/components/PeoplePicker";
import { createEventAction, type CreateEventState } from "../actions";
import type { Community, Profile } from "@/lib/types";

const initialState: CreateEventState = { error: null };

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

type NewEventFormProps = {
  communities: Community[];
  people: Profile[];
  initialCommunityId?: string;
};

export const NewEventForm = ({ communities, people, initialCommunityId }: NewEventFormProps) => {
  const [state, formAction, isPending] = useActionState(createEventAction, initialState);

  const [isPrivate, setIsPrivate] = useState(Boolean(initialCommunityId));
  const [communityId, setCommunityId] = useState(initialCommunityId ?? "");
  const [selectedPeople, setSelectedPeople] = useState<Profile[]>([]);
  const selectedIds = new Set(selectedPeople.map((p) => p.id));

  const togglePerson = (person: Profile) => {
    setSelectedPeople((prev) => (prev.some((p) => p.id === person.id) ? prev.filter((p) => p.id !== person.id) : [...prev, person]));
  };

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <input type="hidden" name="isPrivate" value={isPrivate ? "true" : "false"} />

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Title</span>
        <input name="title" required placeholder="e.g. Founder mixer" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description</span>
        <textarea name="description" rows={4} placeholder="What should people expect?" className={`${inputClass} resize-none`} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Location</span>
        <input name="location" required placeholder="Venue or link" className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Starts at</span>
          <input name="startsAt" type="datetime-local" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Ends at</span>
          <input name="endsAt" type="datetime-local" className={inputClass} />
        </label>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3.5 py-3">
        <span>
          <span className="block text-sm font-semibold text-text">Private event</span>
          <span className="block text-xs text-muted">Only invited people or a community&apos;s members can see and join, like a founders celebration.</span>
        </span>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-5 w-9 flex-shrink-0 appearance-none rounded-full bg-muted-bg/80 outline-none transition before:block before:h-4 before:w-4 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-white before:shadow before:transition checked:bg-primary checked:before:translate-x-4"
        />
      </label>

      {isPrivate ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text">Invite a community (optional)</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setCommunityId("")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                communityId === "" ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "glass text-muted hover:text-text"
              }`}
            >
              None
            </button>
            {communities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCommunityId(c.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  communityId === c.id ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "glass text-muted hover:text-text"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <input type="hidden" name="communityId" value={communityId} />
        </div>
      ) : null}

      {isPrivate ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text">Invite specific people (optional)</span>
          <PeoplePicker people={people} selectedIds={selectedIds} onToggle={togglePerson} fieldName="inviteeIds" />
        </div>
      ) : null}

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create event"}
      </button>
    </form>
  );
};
