import { NewCommunityForm } from "./NewCommunityForm";

export default function NewCommunityPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <h1 className="mb-4 px-1 font-display text-lg font-bold text-text">Start a community</h1>
      <NewCommunityForm />
    </div>
  );
}
