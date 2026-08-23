import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import type { ConnectedProfile } from "@/lib/types";

import { NewMeetingForm } from "./NewMeetingForm";

export const dynamic = "force-dynamic";

export default async function NewMeetingPage() {
  const me = await getMe();
  const connections = await apiFetch<ConnectedProfile[]>(`/connections/${me.id}`);

  return (
    <div className="max-w-140">
      <FormHeader title="Request a meeting" backHref="/meetings" />
      <NewMeetingForm connections={connections} />
    </div>
  );
}
