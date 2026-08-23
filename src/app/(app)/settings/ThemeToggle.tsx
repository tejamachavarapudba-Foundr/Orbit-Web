"use client";

import { useTransition } from "react";
import { Laptop, Moon, Sun } from "lucide-react";

import { setThemeAction, type ThemeChoice } from "./actions";

const options: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Laptop }
];

export const ThemeToggle = ({ current }: { current: ThemeChoice }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => setThemeAction(value))}
          className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-bold transition ${
            current === value ? "border-primary/50 bg-primary-muted text-primary" : "border-border/70 text-muted hover:bg-muted-bg/70"
          }`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  );
};
