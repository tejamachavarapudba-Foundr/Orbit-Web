"use client";

import { useActionState } from "react";

import { createProjectAction, type CreateProjectState } from "../actions";

const initialState: CreateProjectState = { error: null };

const projectTypes = [
  "saas",
  "marketplace",
  "consumer_app",
  "mobile_app",
  "hardware",
  "ai_ml",
  "fintech",
  "healthtech",
  "edtech",
  "climate",
  "deeptech",
  "web3",
  "ecommerce",
  "social",
  "developer_tools",
  "enterprise",
  "creator_economy",
  "agency",
  "nonprofit",
  "other"
];

const stages = ["idea", "prototype", "mvp", "beta", "launched", "growth", "scaling", "profitable", "acquired"];

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

export const NewStartupForm = () => {
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Startup name</span>
        <input name="name" required placeholder="e.g. Orbit" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Tagline</span>
        <input name="tagline" placeholder="One line that explains what you do" className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Category</span>
          <select name="projectType" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select category
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Stage</span>
          <select name="stage" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select stage
            </option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Description</span>
        <textarea name="description" rows={4} placeholder="What are you building, and why does it matter?" className={`${inputClass} resize-none`} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Location</span>
          <input name="location" placeholder="City, Country" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Website</span>
          <input name="websiteUrl" placeholder="https://" className={inputClass} />
        </label>
      </div>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create startup"}
      </button>
    </form>
  );
};
