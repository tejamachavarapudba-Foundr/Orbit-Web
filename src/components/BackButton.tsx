"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Used only when there's no history to go back to (e.g. a direct link). */
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export const BackButton = ({ fallbackHref = "/", label = "Back", className = "mb-4" }: BackButtonProps) => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-text ${className}`}
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      {label}
    </button>
  );
};
