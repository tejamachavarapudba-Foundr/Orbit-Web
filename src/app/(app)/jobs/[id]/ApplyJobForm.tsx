"use client";

import { useActionState } from "react";

import { applyToJobAction, type ApplyJobState } from "../actions";

const initialState: ApplyJobState = { error: null, success: null };

export const ApplyJobForm = ({ jobId }: { jobId: string }) => {
  const [state, formAction, isPending] = useActionState(applyToJobAction.bind(null, jobId), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <textarea
        name="message"
        rows={3}
        placeholder="A short note to go with your application..."
        className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      />
      {state.error ? <p className="text-xs font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-success">{state.success}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Applying..." : "Apply now"}
      </button>
    </form>
  );
};
