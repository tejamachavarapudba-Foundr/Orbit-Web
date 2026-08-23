"use client";

import { useActionState, useState } from "react";
import { Video, X } from "lucide-react";

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
  const [showPitchTip, setShowPitchTip] = useState(true);

  return (
    <>
      {showPitchTip ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-on-primary">
              <Video className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="mt-3 font-display text-base font-bold text-text">Before you start</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Make sure your pitch video is within 30–45 seconds — that&apos;s the sweet spot for investors to quickly find your potential.
            </p>
            <button
              type="button"
              onClick={() => setShowPitchTip(false)}
              className="mt-4 w-full rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}

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

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Pitch video URL</span>
        <input name="pitchVideoUrl" placeholder="https://youtube.com/..." className={inputClass} />
        <span className="text-xs text-muted">Keep it to 30–45 seconds — that&apos;s the sweet spot for investors to quickly find your potential.</span>
      </label>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create startup"}
      </button>
      </form>
    </>
  );
};
