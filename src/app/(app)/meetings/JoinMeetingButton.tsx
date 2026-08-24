"use client";

import { useState, useTransition } from "react";
import { Video } from "lucide-react";

import { joinMeetingAction } from "./actions";

export const JoinMeetingButton = ({ meetingId }: { meetingId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await joinMeetingAction(meetingId);
            } catch (err) {
              // A redirect() throws internally by design — only report real failures.
              if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
              setError(err instanceof Error ? err.message : "Couldn't join that meeting — try again.");
            }
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
      >
        <Video className="h-3.5 w-3.5" strokeWidth={2} />
        {isPending ? "Joining..." : "Join call"}
      </button>
      {error ? <p className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
};
