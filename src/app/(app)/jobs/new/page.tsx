import { FormHeader } from "@/components/FormHeader";

import { NewJobForm } from "./NewJobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="Post a job" backHref="/jobs" />
      <NewJobForm />
    </div>
  );
}
