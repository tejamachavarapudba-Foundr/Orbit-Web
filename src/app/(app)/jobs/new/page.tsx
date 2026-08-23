import { NewJobForm } from "./NewJobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <h1 className="mb-4 px-1 font-display text-lg font-bold text-text">Post a job</h1>
      <NewJobForm />
    </div>
  );
}
