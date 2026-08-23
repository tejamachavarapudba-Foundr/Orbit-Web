"use client";

import { useRef, useTransition } from "react";
import { Camera } from "lucide-react";

import { uploadAvatarAction } from "./actions";

export const AvatarUploadForm = ({ initial, avatarUrl }: { initial: string; avatarUrl: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => startTransition(() => uploadAvatarAction(formData))}
      className="relative -mt-9 h-18 w-18"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="h-18 w-18 rounded-full border-[3px] border-surface object-cover shadow-md" />
      ) : (
        <div className="flex h-18 w-18 items-center justify-center rounded-full border-[3px] border-surface bg-gradient-to-br from-orange-400 to-rose-500 font-display text-2xl font-bold text-white shadow-md shadow-rose-500/20">
          {initial}
        </div>
      )}
      <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-primary text-on-primary shadow-md">
        <Camera className="h-3.5 w-3.5" strokeWidth={2} />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          hidden
          disabled={isPending}
          onChange={() => formRef.current?.requestSubmit()}
        />
      </label>
    </form>
  );
};
