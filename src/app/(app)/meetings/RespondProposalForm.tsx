"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import { respondToProposalAction } from "./actions";
import type { ProposedSlot } from "@/lib/types";

const formatSlot = (slot: ProposedSlot) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${slot.date}T${slot.time}`)) +
  ` at ${slot.time}`;

export const RespondProposalForm = ({ proposalId, slots }: { proposalId: string; slots: ProposedSlot[] }) => {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const respond = (action: "accept" | "reject") => {
    setError(null);
    const formData = new FormData();
    formData.set("action", action);
    if (action === "accept") {
      formData.set("date", slots[selected].date);
      formData.set("time", slots[selected].time);
    }
    startTransition(async () => {
      try {
        await respondToProposalAction(proposalId, formData);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't respond to that request — try again.");
      }
    });
  };

  return (
    <div className="mt-3 flex flex-col gap-2.5">
      <div className="flex flex-col gap-1.5">
        {slots.map((slot, index) => (
          <label key={`${slot.date}-${slot.time}`} className="flex items-center gap-2 text-xs text-text">
            <input type="radio" checked={selected === index} onChange={() => setSelected(index)} className="h-3.5 w-3.5 accent-primary" />
            {formatSlot(slot)}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => respond("accept")}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-on-primary disabled:opacity-60"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          Accept
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => respond("reject")}
          className="flex items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
          Decline
        </button>
      </div>
      {error ? <p className="text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
};
