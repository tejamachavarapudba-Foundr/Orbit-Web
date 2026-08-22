import Link from "next/link";

import type { Profile } from "@/lib/types";

type ProfileCardProps = {
  profile: Profile;
};

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();
  const completion = profile.profileCompletion ?? 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="h-11.5 bg-gradient-to-r from-primary/90 to-purple-500" />
      <div className="-mt-6 px-4 pb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br from-orange-400 to-red-500 font-display text-lg font-bold text-white">
          {initial}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="font-display text-[15px] font-bold text-text">{profile.fullName || "Your name"}</span>
          {profile.identityVerified ? (
            <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-primary" title="Identity verified">
              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-muted">{profile.headline || "Add a headline to your profile"}</p>
      </div>

      <div className="border-t border-border px-4 py-3.5">
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span className="text-text">Profile strength</span>
          <span className="text-muted">{completion}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted-bg">
          <div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} />
        </div>
        <Link href={`/u/${profile.id}`} className="mt-3 block text-xs font-bold text-primary">
          View profile
        </Link>
      </div>
    </div>
  );
};
