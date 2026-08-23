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

  const myProjects = allProjects.filter((p) => p.ownerId === me.id);
  const people = allProfiles.filter((p) => p.id !== me.id);

  return (
    <div className="max-w-140">
      <FormHeader title="New meeting" backHref="/meetings" />
      <NewMeetingForm myProjects={myProjects} people={people} />
    </div>
  );
}
