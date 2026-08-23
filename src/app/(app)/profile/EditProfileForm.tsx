"use client";

import { useActionState } from "react";

import { updateProfileAction, type UpdateProfileState } from "./actions";
import type { Profile } from "@/lib/types";

const initialState: UpdateProfileState = { error: null, success: null };

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15";

export const EditProfileForm = ({ profile }: { profile: Profile }) => {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Full name</span>
          <input name="fullName" defaultValue={profile.fullName} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Headline</span>
          <input name="headline" defaultValue={profile.headline} placeholder="e.g. Founder at Orbit" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text">Bio</span>
        <textarea name="bio" defaultValue={profile.bio} rows={3} className={`${inputClass} resize-none`} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Location</span>
          <input name="location" defaultValue={profile.location} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Company</span>
          <input name="company" defaultValue={profile.company} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">Website</span>
          <input name="website" defaultValue={profile.website} placeholder="https://" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text">LinkedIn</span>
          <input name="linkedinUrl" defaultValue={profile.linkedinUrl} placeholder="https://linkedin.com/in/..." className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text">Skills (comma separated)</span>
        <input name="skills" defaultValue={(profile.skills ?? []).join(", ")} placeholder="React, Fundraising, Product" className={inputClass} />
      </label>

      <label className="flex items-center gap-2.5 rounded-xl bg-muted-bg/60 px-3.5 py-3">
        <input type="checkbox" name="openToConnect" defaultChecked={profile.openToConnect ?? true} className="h-4 w-4 accent-primary" />
        <span className="text-sm font-semibold text-text">Open to connect</span>
      </label>

      {state.error ? <p className="text-sm font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm font-medium text-success">{state.success}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};
