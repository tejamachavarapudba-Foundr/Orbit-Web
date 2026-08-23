"use client";

import { useActionState, useState } from "react";

import { PeoplePicker } from "@/components/PeoplePicker";
import { createCommunityAction, type CreateCommunityState } from "../actions";
import type { Profile } from "@/lib/types";

const initialState: CreateCommunityState = { error: null };

export const NewCommunityForm = ({ people }: { people: Profile[] }) => {
  const [state, formAction, isPending] = useActionState(createCommunityAction, initialState);
  const [selected, setSelected] = useState<Profile[]>([]);
  const selectedIds = new Set(selected.map((p) => p.id));

  const toggle = (person: Profile) => {
    setSelected((prev) => (prev.some((p) => p.id === person.id) ? prev.filter((p) => p.id !== person.id) : [...prev, person]));
  };

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Community name</span>
        <input
          name="name"
          required
          placeholder="e.g. Founders Community"
          className="w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description (optional)</span>
        <textarea
          name="description"
          rows={4}
          placeholder="What's this community about?"
          className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">{selected.length > 0 ? `${selected.length} people invited` : "Invite members (optional)"}</span>
        <PeoplePicker people={people} selectedIds={selectedIds} onToggle={toggle} fieldName="memberIds" />
      </div>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
};
