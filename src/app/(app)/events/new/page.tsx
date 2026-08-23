import { FormHeader } from "@/components/FormHeader";

import { NewEventForm } from "./NewEventForm";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="Create an event" backHref="/events" />
      <NewEventForm />
    </div>
  );
}
