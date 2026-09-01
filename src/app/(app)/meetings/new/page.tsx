import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Profile, TrendingStartup } from "@/lib/types";

import { NewMeetingForm } from "./NewMeetingForm";

export const dynamic = "force-dynamic";

type ProjectRow = TrendingStartup & { ownerId: string };

export default async function NewMeetingPage() {
  const me = await getMe();
  const [allProjects, allProfiles] = await Promise.all([
    apiFetch<ProjectRow[]>("/projects"),
    apiFetch<Profile[]>("/profiles")
  ]);

  // Every user should be able to request a meeting about any existing
  // startup on the platform, not just one they own — restricting this to
  // `ownerId === me.id` left the dropdown empty (and the feature unusable)
  // for anyone who hasn't listed a startup themselves, e.g. an investor
  // wanting to discuss a founder's startup. The backend's own resolver
  // (meetings.service.ts resolveInvitees) already accepts any project id
  // and just invites its owner — it never required the caller to own it.
  const otherProjects = allProjects.filter((p) => p.ownerId !== me.id);
  const people = allProfiles.filter((p) => p.id !== me.id);

  return (
    <div className="max-w-140">
      <FormHeader title="New meeting" backHref="/meetings" />
      <NewMeetingForm projects={otherProjects} people={people} />
    </div>
  );
}
