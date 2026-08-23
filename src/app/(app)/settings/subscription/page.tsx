import { Check, Sparkles } from "lucide-react";

import { FormHeader } from "@/components/FormHeader";

const features = [
  "Unlimited posts, comments and reactions",
  "Unlimited connections and follows",
  "Startup and founder discovery matches",
  "Direct messaging",
  "Job listings and applications",
  "Events and meetings"
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Subscription" description="Manage your plan" backHref="/settings" />

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <div className="font-display text-base font-bold text-text">Free plan</div>
            <div className="text-xs font-semibold text-success">Active</div>
          </div>
        </div>

        <div className="mt-5 border-t border-border/60 pt-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">What&apos;s included</h2>
          <div className="flex flex-col gap-2.5">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-text">
                <Check className="h-4 w-4 flex-shrink-0 text-success" strokeWidth={2.5} />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
