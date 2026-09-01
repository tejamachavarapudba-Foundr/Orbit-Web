"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

import { uploadResumeAction } from "@/app/(app)/profile/actions";
import { applyToJobAction, type ApplyJobState } from "../actions";

const initialState: ApplyJobState = { error: null, success: null };

export const ApplyJobForm = ({ jobId, hasResume }: { jobId: string; hasResume: boolean }) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(applyToJobAction.bind(null, jobId), initialState);
  const [isUploading, startUpload] = useTransition();

  // A <form> can't contain a nested <form> (invalid HTML — this used to be
  // a second <form> inside the apply form, which broke hydration and the
  // upload silently no-op'd). Build the FormData by hand instead so the
  // file input can live inside the single outer <form>.
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("resume", file);
    startUpload(async () => {
      await uploadResumeAction(formData);
      router.refresh();
    });
  };

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {!hasResume ? (
        <p className="text-xs text-muted">
          Upload a resume to apply — it&apos;s saved to your profile and attached automatically, no need to re-upload per job.
        </p>
      ) : null}

      <textarea
        name="message"
        rows={3}
        placeholder="Resume + cover letter..."
        className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      />
      {state.error ? <p className="text-xs font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-success">{state.success}</p> : null}

      <div className="flex items-center gap-2">
        {!hasResume ? (
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border/70 px-4 py-2.5 text-sm font-bold text-text hover:bg-muted-bg/70">
            <Upload className="h-3.5 w-3.5" strokeWidth={2} />
            {isUploading ? "Uploading..." : "Upload resume"}
            <input type="file" accept=".pdf,.doc,.docx" hidden disabled={isUploading} onChange={handleResumeChange} />
          </label>
        ) : null}
        <button
          type="submit"
          disabled={isPending || !hasResume}
          className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
        >
          {isPending ? "Applying..." : "Apply for job"}
        </button>
      </div>
    </form>
  );
};
