"use client";

import { useActionState, useState } from "react";

import { cancelEventAction, updateEventLocationAction, type CancelEventState, type UpdateLocationState } from "../actions";

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

const locationInitialState: UpdateLocationState = { error: null };
const cancelInitialState: CancelEventState = { error: null };

type EventHostToolsProps = {
  eventId: string;
  location: string;
  isCancelled: boolean;
};

export const EventHostTools = ({ eventId, location, isCancelled }: EventHostToolsProps) => {
  const [locationState, locationFormAction, isLocationPending] = useActionState(updateEventLocationAction.bind(null, eventId), locationInitialState);
  const [cancelState, cancelFormAction, isCancelPending] = useActionState(cancelEventAction.bind(null, eventId), cancelInitialState);
  const [reason, setReason] = useState("");

  return (
    <div className="glass mt-4 rounded-2xl p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Host tools</h2>

      <form action={locationFormAction} className="flex flex-col gap-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Location</span>
          <input name="location" defaultValue={location} className={inputClass} />
        </label>
        {locationState.error ? <p className="text-xs font-medium text-danger">{locationState.error}</p> : null}
        <button
          type="submit"
          disabled={isLocationPending}
          className="self-start rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
        >
          {isLocationPending ? "Updating..." : "Update location"}
        </button>
      </form>

      {!isCancelled ? (
        <form
          action={cancelFormAction}
          onSubmit={(e) => {
            if (!confirm(`Cancel this event? This can't be undone.`)) e.preventDefault();
          }}
          className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-text">Cancellation reason</span>
            <input name="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this event being cancelled?" className={inputClass} />
          </label>
          {cancelState.error ? <p className="text-xs font-medium text-danger">{cancelState.error}</p> : null}
          <button
            type="submit"
            disabled={isCancelPending || !reason.trim()}
            className="self-start rounded-full bg-danger px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
          >
            {isCancelPending ? "Cancelling..." : "Cancel event"}
          </button>
        </form>
      ) : null}
    </div>
  );
};
