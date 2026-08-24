"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PostMedia } from "@/lib/types";

type PostMediaCarouselProps = {
  media: PostMedia[];
};

export const PostMediaCarousel = ({ media }: PostMediaCarouselProps) => {
  const [index, setIndex] = useState(0);

  if (media.length === 0) return null;

  const item = media[index];
  const goTo = (next: number) => setIndex(((next % media.length) + media.length) % media.length);

  return (
    <div className="relative flex max-h-125 items-center justify-center overflow-hidden bg-muted-bg/70">
      {item.type === "VIDEO" ? (
        <video key={item.id} src={item.url} controls className="max-h-125 w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={item.id} src={item.url} alt="" className="max-h-125 w-full object-contain" />
      )}

      {media.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          >
            <ChevronLeft className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          >
            <ChevronRight className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2 py-1">
            {media.map((m, i) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>

          <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10.5px] font-semibold text-white">
            {index + 1}/{media.length}
          </div>
        </>
      ) : null}
    </div>
  );
};
