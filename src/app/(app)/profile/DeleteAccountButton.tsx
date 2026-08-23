"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteAccountAction } from "./actions";

export const DeleteAccountButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm("Permanently delete your account? This removes your profile, posts and messages and can't be undone.")) return;
    startTransition(() => deleteAccountAction());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-danger/30 px-4 py-3 text-sm font-bold text-danger transition hover:bg-danger-bg/50 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" strokeWidth={2} />
      {isPending ? "Deleting..." : "Delete account"}
    </button>
  );
};
