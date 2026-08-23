import { Briefcase, Rocket, Target, TrendingUp, Wrench } from "lucide-react";

export type MemberRole = "founder" | "investor" | "advisor" | "professional" | "service_provider";

export const ROLES: { value: MemberRole; label: string; description: string; Icon: typeof Rocket }[] = [
  { value: "founder", label: "Founder", description: "Build and grow your startup", Icon: Rocket },
  { value: "investor", label: "Investor", description: "Discover promising startups", Icon: TrendingUp },
  { value: "advisor", label: "Advisor", description: "Guide founders and teams", Icon: Target },
  { value: "professional", label: "Professional", description: "Find roles and opportunities", Icon: Briefcase },
  { value: "service_provider", label: "Service provider", description: "Offer services to startups", Icon: Wrench }
];

export const ROLE_LABEL: Record<MemberRole, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.label])) as Record<
  MemberRole,
  string
>;

export const ROLE_GOALS: Record<MemberRole, string[]> = {
  founder: ["Co-Founder", "CTO", "Developer", "Designer", "Advisor", "Investor", "Customers", "Partnerships"],
  investor: ["Startups", "Founders", "AI Companies", "SaaS Companies", "Revenue Generating Startups", "Early Stage Startups"],
  advisor: ["Product", "Technology", "Marketing", "Fundraising", "Sales"],
  professional: ["Jobs", "Networking", "Mentorship", "Freelance Work", "Startup Opportunities"],
  service_provider: ["Startup Clients", "Founder Connections", "Investor Network", "Consulting Opportunities"]
};

export const ROLE_GOAL_TITLE: Record<MemberRole, string> = {
  founder: "What are you looking for?",
  investor: "What do you want to discover?",
  advisor: "I want to help with:",
  professional: "What brings you to Orbit?",
  service_provider: "What are you looking for?"
};
