import { FormHeader } from "@/components/FormHeader";

import { NewStartupForm } from "./NewStartupForm";

export default function NewStartupPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="List a new startup" backHref="/projects" />
      <NewStartupForm />
    </div>
  );
}
