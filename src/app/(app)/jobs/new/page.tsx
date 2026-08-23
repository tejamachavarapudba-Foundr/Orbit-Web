import { FormHeader } from "@/components/FormHeader";

import { NewJobForm } from "./NewJobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Post a job" backHref="/jobs" />
      <NewJobForm />
    </div>
  );
}
