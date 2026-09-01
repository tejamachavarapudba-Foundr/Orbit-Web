"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import type { Profile } from "@/lib/types";

import { CreateCommunityModal } from "./CreateCommunityModal";

export const CreateCommunityButton = ({ people }: { people: Profile[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="glass flex flex-col gap-2.5 rounded-2xl p-4 text-left transition hover:-translate-y-0.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white">
          <UserPlus className="h-5 w-5" strokeWidth={2} />
        </span>
        <h2 className="text-sm font-bold text-text">Create a community</h2>
        <p className="text-xs text-muted">Start a group and invite people to join.</p>
      </button>

      <CreateCommunityModal people={people} open={open} onClose={() => setOpen(false)} />
    </>
  );
};
