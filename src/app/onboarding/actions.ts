"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiError } from "@/lib/api";
import type { MemberRole } from "@/lib/onboarding-data";

export type OnboardingPayload = {
  memberRole: MemberRole;
  quickProfile: {
    fullName: string;
    headline: string;
    location: string;
    company: string;
    website: string;
    linkedinUrl: string;
  };
  roleProfile: { role: MemberRole; data: Record<string, unknown> };
  goals: string[];
};

export type OnboardingState = { error: string | null };

export const completeOnboardingAction = async (payload: OnboardingPayload): Promise<OnboardingState> => {
  try {
    await apiFetch("/profiles/me/onboarding/complete", { method: "POST", body: payload });
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "Couldn't save your profile — try again." };
  }

  redirect("/");
};
