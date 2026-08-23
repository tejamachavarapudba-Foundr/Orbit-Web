"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do matches work?", a: "We surface founders, investors and collaborators based on your role, goals and activity — the more complete your profile, the better your matches." },
  { q: "What's the difference between following and connecting?", a: "Connecting is mutual — both people approve the request, and it unlocks direct messaging. Following is one-way, like a subscription to someone's public posts, without an approval step." },
  { q: "How do I save a post for later?", a: "Tap the bookmark icon on any post. Saved posts show up under Settings → Saved, or in your sidebar's Saved posts shortcut." },
  { q: "Can I change my role after onboarding?", a: "Yes — update your role and role-specific details any time from your Profile page." },
  { q: "How do I delete my account?", a: "Go to your Profile page and scroll to the bottom — Delete account permanently removes your profile, posts and messages." },
  { q: "Is Orbit free to use?", a: "Yes, all core features are free. See Settings → Subscription for what's included." }
];

export const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-col divide-y divide-border/60">
        {faqs.map((item, index) => (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-sm font-bold text-text">{item.q}</span>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted transition ${openIndex === index ? "rotate-180" : ""}`} strokeWidth={2} />
            </button>
            {openIndex === index ? <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{item.a}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
