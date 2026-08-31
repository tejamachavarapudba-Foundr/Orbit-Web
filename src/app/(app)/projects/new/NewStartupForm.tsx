"use client";

import { useActionState, useState } from "react";
import { Video, X } from "lucide-react";

import { createProjectAction, type CreateProjectState } from "../actions";

const initialState: CreateProjectState = { error: null };

// Kept in sync with Orbit-FE's PROJECT_PLATFORM_OPTIONS (mobile's "Platform"
// field doubles as this same category) — same values on both platforms so a
// project's category displays and edits correctly on either client. Labels
// differ from the raw value for a couple of entries (e.g. "Consumer & D2C"
// for "consumer_app") — the value itself never changes so existing projects
// aren't orphaned by a rename.
const projectTypes: { label: string; value: string }[] = [
  { label: "SaaS", value: "saas" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Consumer & D2C", value: "consumer_app" },
  { label: "AI / ML", value: "ai_ml" },
  { label: "FinTech", value: "fintech" },
  { label: "HealthTech", value: "healthtech" },
  { label: "EdTech", value: "edtech" },
  { label: "Climate Tech", value: "climate" },
  { label: "DeepTech", value: "deeptech" },
  { label: "Web3", value: "web3" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "Mobility", value: "mobility" },
  { label: "Other", value: "other" }
];

// Kept in sync with Orbit-FE's projectStageOptions — same values on both platforms.
const stages = ["idea", "prototype", "mvp", "beta", "launched", "growth", "scaling", "profitable", "acquired"];

// Kept in sync with Orbit-FE's FUNDING_STAGE_OPTIONS — same values on both platforms.
const fundingStages: { label: string; value: string }[] = [
  { label: "Idea Stage", value: "idea_stage" },
  { label: "Bootstrapping", value: "bootstrapping" },
  { label: "Pre-Seed Stage", value: "pre_seed_stage" },
  { label: "Seed Stage", value: "seed_stage" },
  { label: "Series A", value: "series_a" },
  { label: "Series B", value: "series_b" },
  { label: "Series C", value: "series_c" },
  { label: "Series D", value: "series_d" }
];

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
              <option key={t.value} value={t.value}>
                {t.label}
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

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Funding stage</span>
        <select name="fundingStage" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select funding stage
          </option>
          {fundingStages.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Founded year</span>
          <input name="foundedYear" type="number" placeholder="2024" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Location</span>
          <input name="location" placeholder="City, Country" className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">CIN number</span>
          <input name="cinNumber" placeholder="U72900KA2020PTC..." className={`${inputClass} uppercase`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">DPIIT number</span>
          <input name="dpiitNumber" placeholder="DIPP..." className={`${inputClass} uppercase`} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Website</span>
        <input name="websiteUrl" placeholder="https://" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">
          Founder pitch video <span className="text-danger">*</span>
        </span>
        <input
          type="file"
          name="pitchVideoFile"
          required
          accept="video/mp4,video/quicktime,video/webm"
          className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-primary-muted file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-primary`}
        />
        <span className="text-xs text-muted">
          Upload a video file (mp4/mov/webm) — a link to another site can&apos;t be played in-app, so a direct upload is
          required. Keep it to 30–45 seconds, the sweet spot for investors to quickly find your potential.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Founder&apos;s offer — ask</span>
          <input name="askAmount" placeholder="e.g. ₹50 Lakh" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Equity %</span>
          <input name="equityPercent" placeholder="e.g. 5" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Tech stack</span>
        <input name="techStack" placeholder="react, node, postgres" className={inputClass} />
        <span className="text-xs text-muted">Comma-separated.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Looking for</span>
        <input name="lookingFor" placeholder="engineer, designer" className={inputClass} />
        <span className="text-xs text-muted">Comma-separated.</span>
      </label>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Creating & uploading video..." : "Create startup"}
      </button>
      </form>
    </>
  );
};
