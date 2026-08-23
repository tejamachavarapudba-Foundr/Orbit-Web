import { FormHeader } from "@/components/FormHeader";

import { FaqAccordion } from "./FaqAccordion";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <FormHeader title="FAQ" description="Common questions" backHref="/settings" />
      <FaqAccordion />
    </div>
  );
}
