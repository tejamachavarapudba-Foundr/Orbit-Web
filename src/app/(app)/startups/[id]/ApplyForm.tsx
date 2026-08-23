"use client";

import { useActionState } from "react";

import { applyToStartupAction, type ApplyState } from "./actions";

const initialState: ApplyState = { error: null, success: null };

export const ApplyForm = ({ startupId }: { startupId: string }) => {
  const [state, formAction, isPending] = useActionState(applyToStartupAction.bind(null, startupId), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <select
        name="role"
        required
        defaultValue=""
        className="h-10 rounded-xl border border-border/70 bg-muted-bg/60 px-3 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      >
        <option value="" disabled>
          Apply as...
        </option>
        <option value="co_founder">Co-founder</option>
        <option value="investor">Investor</option>
      </select>
      <textarea
        name="message"
        rows={3}
        placeholder="Why do you want to join?"
        className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      />
      {state.error ? <p className="text-xs font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-success">{state.success}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send application"}
      </button>
    </form>
  );
};
