import { FormHeader } from "@/components/FormHeader";

import { NewCommunityForm } from "./NewCommunityForm";

export default function NewCommunityPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Start a community" backHref="/communities" />
      <NewCommunityForm />
    </div>
  );
}
