"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import type { Profile } from "@/lib/types";

import { NewCommunityForm } from "./new/NewCommunityForm";

type CreateCommunityModalProps = {
  people: Profile[];
  open: boolean;
  onClose: () => void;
};

// Mobile presents "Create a community" as a bottom-sheet modal, not a full
// pushed screen — kept distinct from Events' full-page create flow, since
// the two features are intentionally different weights on mobile (a
// lightweight roster vs. a rich multi-field event with date/time pickers).
export const CreateCommunityModal = ({ people, open, onClose }: CreateCommunityModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm sm:items-center sm:px-4 sm:py-10">
      <div className="glass-strong w-full max-w-lg rounded-t-3xl p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text">Create a community</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70 hover:text-text"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>
        <NewCommunityForm people={people} />
      </div>
    </div>,
    document.body
  );
};
