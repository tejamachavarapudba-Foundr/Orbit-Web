import { FormHeader } from "@/components/FormHeader";

import { NewEventForm } from "./NewEventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Create an event" backHref="/events" />
      <NewEventForm />
    </div>
  );
}
