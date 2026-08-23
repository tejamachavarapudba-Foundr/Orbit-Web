import { FormHeader } from "@/components/FormHeader";

import { NewStartupForm } from "./NewStartupForm";

export default function NewStartupPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="List a new startup" backHref="/projects" />
      <NewStartupForm />
    </div>
  );
}
