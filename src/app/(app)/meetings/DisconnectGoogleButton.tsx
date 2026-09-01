"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { disconnectGoogleAction } from "./actions";

export const DisconnectGoogleButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Disconnect Google Meet? You'll need to reconnect and re-approve access before booking another meeting.")) return;
        startTransition(async () => {
          await disconnectGoogleAction();
          router.refresh();
        });
      }}
      className="text-xs font-bold text-muted hover:text-danger disabled:opacity-60"
    >
      {isPending ? "Disconnecting..." : "Disconnect Google Meet"}
    </button>
  );
};
