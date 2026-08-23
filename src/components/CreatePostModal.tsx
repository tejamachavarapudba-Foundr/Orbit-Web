"use client";

import { useActionState, useEffect, useRef } from "react";
import { X } from "lucide-react";

import { createPostAction, type CreatePostState } from "@/app/(app)/actions";

const initialState: CreatePostState = { error: null };

type CreatePostModalProps = {
  initial: string;
  open: boolean;
  onClose: () => void;
};

export const CreatePostModal = ({ initial, open, onClose }: CreatePostModalProps) => {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      formRef.current?.reset();
      onClose();
    }
    wasPending.current = isPending;
  }, [isPending, state.error, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 pt-20 pb-10 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-lg rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text">Share an update</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70 hover:text-text"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="mt-4 flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 font-display text-sm font-bold text-white">
            {initial}
          </div>
          <div className="flex-1">
            <textarea
              name="content"
              rows={5}
              autoFocus
              placeholder="Share an update, milestone or launch..."
              className="w-full resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            />
            {state.error ? <p className="mt-2 text-xs font-medium text-danger">{state.error}</p> : null}
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-1.5 text-xs font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
              >
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
