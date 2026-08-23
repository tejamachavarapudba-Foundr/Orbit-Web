"use client";

import { useRef, useTransition } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

import { deleteResumeAction, uploadResumeAction } from "./actions";

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type ResumeCardProps = {
  fileName: string | null | undefined;
  fileSize: number | null | undefined;
};

export const ResumeCard = ({ fileName, fileSize }: ResumeCardProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Remove your resume?")) return;
    startTransition(() => deleteResumeAction());
  };

  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Resume</h2>
      {fileName ? (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
            <FileText className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-text">{fileName}</div>
            {fileSize ? <div className="text-xs text-muted">{formatSize(fileSize)}</div> : null}
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Remove resume"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger-bg hover:text-danger disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <p className="mb-3 text-xs text-muted">Add a resume so founders can review your background when you apply to roles.</p>
      )}

      <form ref={formRef} action={(formData) => startTransition(() => uploadResumeAction(formData))} className="mt-3">
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border/70 px-4 py-2 text-xs font-bold text-text transition hover:bg-muted-bg/70">
          <Upload className="h-3.5 w-3.5" strokeWidth={2} />
          {fileName ? "Replace resume" : "Upload resume"}
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            hidden
            disabled={isPending}
            onChange={() => formRef.current?.requestSubmit()}
          />
        </label>
      </form>
    </div>
  );
};
