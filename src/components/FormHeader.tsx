import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

type FormHeaderProps = {
  title: string;
  description?: string;
  backHref: string;
  /** Show an X "close" affordance instead of a "< Back" chevron — use for
   * modal-like flows where the back destination isn't a browsing history. */
  variant?: "back" | "close";
};

export const FormHeader = ({ title, description, backHref, variant = "back" }: FormHeaderProps) => (
  <div className="mb-4 flex items-center gap-3">
    <Link
      href={backHref}
      aria-label={variant === "close" ? "Close" : "Back"}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-muted-bg/70 hover:text-text"
    >
      {variant === "close" ? <X className="h-4.5 w-4.5" strokeWidth={2} /> : <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />}
    </Link>
    <div className="min-w-0">
      <h1 className="font-display text-lg font-bold text-text">{title}</h1>
      {description ? <p className="text-xs text-muted">{description}</p> : null}
    </div>
  </div>
);
