import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { Profile } from "@/lib/types";

import { NewCommunityForm } from "./NewCommunityForm";

export const dynamic = "force-dynamic";

export default async function NewCommunityPage() {
  const me = await getMe();
  const allProfiles = await apiFetch<Profile[]>("/profiles");
  const people = allProfiles.filter((p) => p.id !== me.id);

  return (
    <div className="max-w-140">
      <FormHeader title="Create a community" backHref="/communities" />
      <NewCommunityForm people={people} />
    </div>
  );
}
