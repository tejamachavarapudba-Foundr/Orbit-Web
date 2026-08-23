"use client";

import { useActionState } from "react";

import { createCommunityAction, type CreateCommunityState } from "../actions";

const initialState: CreateCommunityState = { error: null };

export const NewCommunityForm = () => {
  const [state, formAction, isPending] = useActionState(createCommunityAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Name</span>
        <input
          name="name"
          required
          placeholder="e.g. SaaS Founders Circle"
          className="w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description</span>
        <textarea
          name="description"
          rows={4}
          placeholder="What is this community about?"
          className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>
      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create community"}
      </button>
    </form>
  );
};
