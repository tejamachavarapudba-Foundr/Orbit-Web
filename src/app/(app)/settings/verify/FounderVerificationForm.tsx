"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";

import { submitFounderVerificationAction, type SubmitFounderVerificationState } from "./actions";

const initialState: SubmitFounderVerificationState = { error: null, success: null };

export const FounderVerificationForm = () => {
  const [state, formAction, isPending] = useActionState(submitFounderVerificationAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text">Name on certificate</span>
        <input
          name="certificateName"
          required
          placeholder="As it appears on your incorporation certificate"
          className="h-10 rounded-xl border border-border/70 bg-muted-bg/60 px-3 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text">CIN number (optional)</span>
        <input
          name="cinNumber"
          placeholder="Corporate Identification Number"
          className="h-10 rounded-xl border border-border/70 bg-muted-bg/60 px-3 text-sm text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text">Incorporation certificate</span>
        <input
          type="file"
          name="document"
          accept="application/pdf,image/*"
          required
          className="rounded-xl border border-dashed border-border/70 bg-muted-bg/60 px-3 py-2.5 text-xs text-text file:mr-3 file:rounded-full file:border-0 file:bg-primary-muted file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary"
        />
      </label>

      {state.error ? <p className="text-xs font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-success">{state.success}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 flex items-center justify-center gap-1.5 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        <Upload className="h-4 w-4" strokeWidth={2} />
        {isPending ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
};
