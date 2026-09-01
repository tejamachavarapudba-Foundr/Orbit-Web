"use client";

import { useActionState, useState } from "react";

import { createJobAction, type CreateJobState } from "../actions";

const initialState: CreateJobState = { error: null };

const roleOptions = ["engineer", "designer", "marketing", "sales", "operations", "product", "advisor", "mentor"];
const experienceOptions = ["Fresher", "1 yr", "2 yrs", "3 yrs", "4 yrs", "5 yrs", "6 yrs", "7 yrs", "8 yrs", "10 yrs", "12+ yrs", "15+ yrs", "20+ yrs", "30+ yrs"];

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

const sectionLabelClass = "text-xs font-bold uppercase tracking-wide text-muted";

export const NewJobForm = () => {
  const [state, formAction, isPending] = useActionState(createJobAction, initialState);
  const [skills, setSkills] = useState("");

  const skillChips = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <p className={sectionLabelClass}>Basics</p>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Startup name</span>
        <input name="startupName" required placeholder="Your startup" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">Job title</span>
        <input name="heading" required placeholder="Backend Engineer" className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Role</span>
          <select name="role" required defaultValue={roleOptions[0]} className={inputClass}>
            {roleOptions.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">Experience</span>
          <select name="experience" defaultValue="3 yrs" className={inputClass}>
            {experienceOptions.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="border-t border-border/60 pt-4">
        <p className={`${sectionLabelClass} mb-3`}>Details</p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-semibold text-text">Location</span>
              <input name="location" placeholder="Remote, Bengaluru..." className={inputClass} />
            </label>
            <label className="flex w-28 flex-col gap-1.5">
              <span className="text-sm font-semibold text-text">Openings</span>
              <input name="openings" type="number" min={1} defaultValue={1} className={inputClass} />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-text">Must have skills</span>
            <input name="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="node, postgres, expo" className={inputClass} />
            {skillChips.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skillChips.map((skill) => (
                  <span key={skill} className="rounded-md bg-muted-bg px-2.5 py-1 text-xs text-muted">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">Comma-separated — shown as chips on the job card.</p>
            )}
          </label>
        </div>
      </div>

      <div className="border-t border-border/60 pt-4">
        <p className={`${sectionLabelClass} mb-3`}>Job description</p>
        <textarea
          name="description"
          required
          rows={6}
          placeholder="One responsibility per line..."
          className={`${inputClass} resize-none`}
        />
        <p className="mt-1.5 text-xs text-muted">One point per line — shown as a bulleted list on the job details screen.</p>
      </div>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
};
