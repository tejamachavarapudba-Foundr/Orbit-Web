import { Check } from "lucide-react";

type VerifiedBadgeProps = {
  size?: "sm" | "md";
};

const sizes = {
  sm: { box: "h-3.5 w-3.5", icon: "h-2 w-2" },
  md: { box: "h-4.5 w-4.5", icon: "h-2.5 w-2.5" }
};

/** A small filled checkmark badge, meant to sit inline right after a verified user's name. */
export const VerifiedBadge = ({ size = "sm" }: VerifiedBadgeProps) => {
  const { box, icon } = sizes[size];

  return (
    <span
      aria-label="Identity verified"
      title="Identity verified"
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-primary ${box}`}
    >
      <Check className={`text-on-primary ${icon}`} strokeWidth={3.5} />
    </span>
  );
};
