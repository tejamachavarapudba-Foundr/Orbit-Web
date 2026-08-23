"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

import { cancelMeetingAction } from "./actions";

export const CancelMeetingButton = ({ meetingId }: { meetingId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Cancel this meeting?")) return;
        startTransition(async () => {
          await cancelMeetingAction(meetingId);
          router.refresh();
        });
      }}
      className="flex items-center gap-1.5 rounded-full border border-danger/30 px-3.5 py-1.5 text-xs font-bold text-danger hover:bg-danger-bg disabled:opacity-60"
    >
      <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
};
