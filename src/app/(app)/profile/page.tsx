import { VerifiedBadge } from "@/components/VerifiedBadge";
import { apiFetch } from "@/lib/api";
import type { AuthMe } from "@/lib/types";
import { getMe } from "@/lib/auth";

import { AvatarUploadForm } from "./AvatarUploadForm";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { EditProfileForm } from "./EditProfileForm";
import { ResumeCard } from "./ResumeCard";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const me = await getMe();
  const { profile } = me;
  const initial = (profile.fullName || "?").charAt(0).toUpperCase();
  const completion = profile.profileCompletion ?? 0;

  return (
    <div className="max-w-140">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="h-16 bg-gradient-to-r from-primary via-indigo-400 to-purple-400" />
        <div className="px-5 pb-5">
          <AvatarUploadForm initial={initial} avatarUrl={profile.avatarUrl} />

          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="font-display text-lg font-bold text-text">{profile.fullName || "Your name"}</h1>
            {profile.identityVerified ? <VerifiedBadge /> : null}
          </div>
          <p className="text-sm text-muted">{profile.headline || "Add a headline to your profile"}</p>

          <div className="mt-3 border-t border-border/60 pt-3">
            <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
              <span className="text-text">Profile strength</span>
              <span className="text-muted">{completion}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted-bg/80">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <EditProfileForm profile={profile} />
      </div>

      <div className="mt-4">
        <ResumeCard fileName={profile.resumeFileName} fileSize={profile.resumeFileSize} />
      </div>

      <div className="mt-4">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
