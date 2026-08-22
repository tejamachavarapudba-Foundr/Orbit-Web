"use client";

import { useActionState, useEffect, useRef } from "react";

import { createPostAction, type CreatePostState } from "@/app/(app)/actions";

const initialState: CreatePostState = { error: null };

type PostComposerProps = {
  initial: string;
};

export const PostComposer = ({ initial }: PostComposerProps) => {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) {
      formRef.current?.reset();
    }
  }, [isPending, state.error]);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <form ref={formRef} action={formAction} className="flex gap-3">
        <div className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 font-display text-xs font-bold text-white">
          {initial}
        </div>
        <div className="flex-1">
          <textarea
            name="content"
            rows={1}
            placeholder="Share an update, milestone or launch..."
            className="w-full resize-none rounded-lg border border-border bg-muted-bg px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            onFocus={(e) => {
              e.currentTarget.rows = 3;
            }}
          />
          {state.error ? <p className="mt-2 text-xs font-medium text-danger">{state.error}</p> : null}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
