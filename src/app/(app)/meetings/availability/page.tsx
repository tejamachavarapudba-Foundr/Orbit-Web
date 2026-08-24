import { FormHeader } from "@/components/FormHeader";
import { apiFetch } from "@/lib/api";
import type { AvailabilitySlot } from "@/lib/types";

import { AvailabilityForm } from "./AvailabilityForm";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const existing = await apiFetch<AvailabilitySlot[]>("/meetings/availability/me");

  return (
    <div className="max-w-140">
      <FormHeader title="Set your availability" description="People booking a meeting with you can pick an open slot automatically." backHref="/meetings" />
      <AvailabilityForm existing={existing} />
    </div>
  );
}
