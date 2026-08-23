"use client";

import { useTransition } from "react";
import { Video } from "lucide-react";

import { getGoogleConnectUrlAction } from "./actions";

export const GoogleConnectCard = () => {
  const [isPending, startTransition] = useTransition();

  const connect = () => {
    startTransition(async () => {
      const url = await getGoogleConnectUrlAction();
      window.location.href = url;
    });
  };

  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white">
        <Video className="h-6 w-6" strokeWidth={2} />
      </span>
      <h2 className="font-display text-base font-bold text-text">Connect Google Meet</h2>
      <p className="max-w-sm text-sm text-muted">
        Meetings run on your own Google Meet — connect your account once so Orbit can generate the link and add it to your calendar
        automatically.
      </p>
      <button
        type="button"
        onClick={connect}
        disabled={isPending}
        className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-5 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
      >
        {isPending ? "Redirecting..." : "Connect Google Meet"}
      </button>
    </div>
  );
};
