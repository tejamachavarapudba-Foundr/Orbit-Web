"use client";

import { useActionState } from "react";

import { createMeetingProposalAction, type CreateMeetingState } from "../actions";
import type { ConnectedProfile } from "@/lib/types";

const initialState: CreateMeetingState = { error: null };

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

export const NewMeetingForm = ({ connections }: { connections: ConnectedProfile[] }) => {
  const [state, formAction, isPending] = useActionState(createMeetingProposalAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Who with?</span>
        {connections.length === 0 ? (
          <p className="text-xs text-muted">You need at least one connection before you can request a meeting.</p>
        ) : (
          <select name="inviteeId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose a connection...
            </option>
            {connections.map((c) => (
              <option key={c.profile.id} value={c.profile.id}>
                {c.profile.fullName}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Purpose</span>
        <input name="purpose" required placeholder="e.g. Intro call about your startup" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Message (optional)</span>
        <textarea name="message" rows={3} className={`${inputClass} resize-none`} />
      </label>

      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-text">Propose up to 3 time slots</span>
        {[1, 2, 3].map((n) => (
          <div key={n} className="grid grid-cols-2 gap-3">
            <input type="date" name={`slot${n}Date`} className={inputClass} />
            <input type="time" name={`slot${n}Time`} className={inputClass} />
          </div>
        ))}
      </div>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending || connections.length === 0}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send request"}
      </button>
    </form>
  );
};
