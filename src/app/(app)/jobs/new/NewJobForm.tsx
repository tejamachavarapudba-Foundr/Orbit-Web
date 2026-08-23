"use client";

import { useActionState } from "react";

import { createJobAction, type CreateJobState } from "../actions";

const initialState: CreateJobState = { error: null };

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

export const NewJobForm = () => {
  const [state, formAction, isPending] = useActionState(createJobAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Startup name</span>
          <input name="startupName" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Job title</span>
          <input name="heading" required placeholder="e.g. Founding Engineer" className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Role</span>
          <input name="role" required placeholder="e.g. software_engineer" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Experience</span>
          <input name="experience" placeholder="e.g. 2-4 years" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Skills (comma separated)</span>
        <input name="skills" placeholder="React, Node.js, Postgres" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description</span>
        <textarea name="description" rows={5} placeholder="Responsibilities, requirements, perks..." className={`${inputClass} resize-none`} />
      </label>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Posting..." : "Post job"}
      </button>
    </form>
  );
};
