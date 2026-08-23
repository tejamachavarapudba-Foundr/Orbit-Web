import { NewStartupForm } from "./NewStartupForm";

export default function NewStartupPage() {
  return (
    <div className="mx-auto max-w-140 px-5 py-5">
      <h1 className="mb-4 px-1 font-display text-lg font-bold text-text">List a new startup</h1>
      <NewStartupForm />
    </div>
  );
}
