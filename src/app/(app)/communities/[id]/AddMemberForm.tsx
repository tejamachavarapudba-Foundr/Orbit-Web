"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { PeoplePicker } from "@/components/PeoplePicker";
import { addMembersAction } from "../actions";
import type { Profile } from "@/lib/types";

type AddMemberFormProps = {
  communityId: string;
  people: Profile[];
  existingMemberIds: Set<string>;
};

export const AddMemberForm = ({ communityId, people, existingMemberIds }: AddMemberFormProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState<Profile[]>([]);
  const [isPending, startTransition] = useTransition();
  const selectedIds = new Set(selected.map((p) => p.id));

  const toggle = (person: Profile) => {
    setSelected((prev) => (prev.some((p) => p.id === person.id) ? prev.filter((p) => p.id !== person.id) : [...prev, person]));
  };

  const submit = () => {
    if (selected.length === 0) return;
    startTransition(async () => {
      await addMembersAction(communityId, selected.map((p) => p.id));
      setSelected([]);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <PeoplePicker people={people} selectedIds={selectedIds} onToggle={toggle} disabledIds={existingMemberIds} />
      <button
        type="button"
        onClick={submit}
        disabled={isPending || selected.length === 0}
        className="flex items-center justify-center gap-1.5 self-start rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary disabled:opacity-60"
      >
        <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
        {isPending ? "Adding..." : "Add to community"}
      </button>
    </div>
  );
};
