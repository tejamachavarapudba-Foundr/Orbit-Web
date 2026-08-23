import Link from "next/link";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Profile } from "@/lib/types";

type ProfileCardProps = {
  profile: Profile;
};

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();
  const completion = profile.profileCompletion ?? 0;

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="h-12 bg-gradient-to-r from-primary/80 via-indigo-400/70 to-purple-400/70" />
      <div className="-mt-6 px-4 pb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br from-orange-400 to-rose-500 font-display text-lg font-bold text-white shadow-md shadow-rose-500/20">
          {initial}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="font-display text-[15px] font-bold text-text">{profile.fullName || "Your name"}</span>
          {profile.identityVerified ? <VerifiedBadge /> : null}
        </div>
        <p className="mt-0.5 text-xs text-muted">{profile.headline || "Add a headline to your profile"}</p>
      </div>

      <div className="border-t border-border/60 px-4 py-3.5">
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span className="text-text">Profile strength</span>
          <span className="text-muted">{completion}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted-bg/80">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400" style={{ width: `${completion}%` }} />
        </div>
        <Link href={`/u/${profile.id}`} className="mt-3 block text-xs font-bold text-primary">
          View profile
        </Link>
      </div>
    </div>
  );
};
