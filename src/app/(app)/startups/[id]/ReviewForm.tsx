"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";

import { submitReviewAction, type ReviewState } from "./actions";

const initialState: ReviewState = { error: null, success: null };

export const ReviewForm = ({ startupId }: { startupId: string }) => {
  const [state, formAction, isPending] = useActionState(submitReviewAction.bind(null, startupId), initialState);
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star className={`h-5 w-5 ${n <= rating ? "text-amber-400" : "text-muted"}`} strokeWidth={2} fill={n <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        placeholder="Share your take on this startup..."
        className="resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      />
      {state.error ? <p className="text-xs font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-xs font-medium text-success">{state.success}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary hover:bg-primary-muted disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
};
