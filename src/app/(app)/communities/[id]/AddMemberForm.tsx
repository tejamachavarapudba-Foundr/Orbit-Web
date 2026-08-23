"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { addMemberAction } from "../actions";
import type { ConnectedProfile } from "@/lib/types";

type AddMemberFormProps = {
  communityId: string;
  candidates: ConnectedProfile[];
};

export const AddMemberForm = ({ communityId, candidates }: AddMemberFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (candidates.length === 0) {
    return <p className="text-xs text-muted">All your connections are already in this community.</p>;
  }

  return (
    <form
      action={(formData) => {
        const userId = String(formData.get("userId") ?? "");
        if (!userId) return;
        startTransition(async () => {
          await addMemberAction(communityId, userId);
          router.refresh();
        });
      }}
      className="flex items-center gap-2"
    >
      <select
        name="userId"
        required
        defaultValue=""
        className="h-9 flex-1 rounded-lg border border-border/70 bg-muted-bg/60 px-2.5 text-xs text-text outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
      >
        <option value="" disabled>
          Add a connection...
        </option>
        {candidates.map((c) => (
          <option key={c.profile.id} value={c.profile.id}>
            {c.profile.fullName}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-500 px-3 py-2 text-xs font-bold text-on-primary disabled:opacity-60"
      >
        <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
        Add
      </button>
    </form>
  );
};
