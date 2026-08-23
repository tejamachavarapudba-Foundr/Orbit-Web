import { FormHeader } from "@/components/FormHeader";

const sections = [
  {
    title: "What we collect",
    body: "Your profile details (name, headline, bio, role, skills), the posts, comments and messages you create, and basic usage data like which pages you visit."
  },
  {
    title: "How it's used",
    body: "To run the core product — showing your profile to others, powering search and discovery, matching you with relevant startups, jobs and people, and delivering notifications."
  },
  {
    title: "Who can see it",
    body: "Your public profile fields (name, headline, bio, posts) are visible to other signed-in members. Private data like your email and resume are only shared with people you explicitly apply to or message."
  },
  {
    title: "Your controls",
    body: "You can edit or remove your profile information at any time from your Profile page, and permanently delete your account and all associated data from the same place."
  },
  {
    title: "Data retention",
    body: "We keep your data for as long as your account is active. Deleting your account removes your profile, posts, and messages from the platform."
  }
];

export default function DataPrivacyPage() {
  return (
    <div className="max-w-140">
      <FormHeader title="Data & Privacy" description="What we collect and why" backHref="/settings" />

      <div className="glass flex flex-col gap-5 rounded-2xl p-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-1.5 text-sm font-bold text-text">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
