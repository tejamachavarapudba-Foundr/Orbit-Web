import { NewEventForm } from "./NewEventForm";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <h1 className="mb-4 px-1 font-display text-lg font-bold text-text">Create an event</h1>
      <NewEventForm />
    </div>
  );
}
