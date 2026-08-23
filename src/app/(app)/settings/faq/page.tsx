import { FormHeader } from "@/components/FormHeader";

import { FaqAccordion } from "./FaqAccordion";

export default function FaqPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="FAQ" description="Common questions" backHref="/settings" />
      <FaqAccordion />
    </div>
  );
}
