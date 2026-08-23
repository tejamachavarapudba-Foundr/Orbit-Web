"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { withdrawProposalAction } from "./actions";

export const WithdrawButton = ({ proposalId }: { proposalId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Withdraw this meeting request?")) return;
        startTransition(async () => {
          await withdrawProposalAction(proposalId);
          router.refresh();
        });
      }}
      className="mt-3 rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70 disabled:opacity-60"
    >
      {isPending ? "Withdrawing..." : "Withdraw"}
    </button>
  );
};
