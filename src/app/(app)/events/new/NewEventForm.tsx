"use client";

import { useActionState } from "react";

import { createEventAction, type CreateEventState } from "../actions";

const initialState: CreateEventState = { error: null };

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

export const NewEventForm = () => {
  const [state, formAction, isPending] = useActionState(createEventAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Title</span>
        <input name="title" required placeholder="e.g. Founder mixer" className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Location</span>
          <input name="location" required placeholder="Venue or link" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Starts at</span>
          <input name="startsAt" type="datetime-local" required className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description</span>
        <textarea name="description" rows={4} placeholder="What should people expect?" className={`${inputClass} resize-none`} />
      </label>

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
