import { FormHeader } from "@/components/FormHeader";

import { NewCommunityForm } from "./NewCommunityForm";

export default function NewCommunityPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="Start a community" backHref="/communities" />
      <NewCommunityForm />
    </div>
  );
}
