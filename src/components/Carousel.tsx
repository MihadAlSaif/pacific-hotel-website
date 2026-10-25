"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/links";
import type { Photo } from "@/site";

/**
 * Swipe through photos: drag or swipe on phones, arrows on computers, dots show where you are.
 * Uses the browser's own scroll snapping, so it feels native on touch screens.
 */
export function Carousel({
  photos, start = 0, onOpen, onIndex, large, className = "", imgClassName = "aspect-[4/3] w-full object-cover", label,
}: {
  photos: Photo[];
  start?: number;
  /** Tapping a photo, e.g. to open the full-screen gallery. */
  onOpen?: (index: number) => void;
  onIndex?: (index: number) => void;
  /** Use the large files (full-screen gallery). */
  large?: boolean;
  className?: string;
  imgClassName?: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(start);

  useEffect(() => {
    const el = track.current;
    if (el && start) el.scrollTo({ left: start * el.clientWidth, behavior: "instant" as ScrollBehavior });
  }, [start]);

  const go = useCallback((n: number) => {
    const el = track.current;
    if (!el) return;
    const to = Math.max(0, Math.min(photos.length - 1, n));
    el.scrollTo({ left: to * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" as ScrollBehavior : "smooth" });
  }, [photos.length]);

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const n = Math.round(el.scrollLeft / el.clientWidth);
    if (n !== i) {
      setI(n);
      onIndex?.(n);
    }
  }

  // Keep at most 5 dots visible, like the big booking sites, sliding along with the photo.
  const MAX = 5;
  const first = Math.max(0, Math.min(i - Math.floor(MAX / 2), photos.length - MAX));

  return (
    <div className={`group relative ${className}`} role="region" aria-roledescription="carousel" aria-label={label}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}>
      <div ref={track} onScroll={onScroll} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {photos.map((p, k) => (
          <div key={p.src + k} className="grid h-full w-full shrink-0 snap-center place-items-center" aria-roledescription="slide" aria-label={`${k + 1} of ${photos.length}`}>
            {onOpen ? (
              <button type="button" className="block h-full w-full" onClick={() => onOpen(k)} aria-label={`Open photo ${k + 1}: ${p.alt}`}>
                <img src={asset(`${p.src}${large ? "" : "-sm"}.jpg`)} alt={p.alt} className={imgClassName} loading={k === 0 ? "eager" : "lazy"} draggable={false} />
              </button>
            ) : (
              <img src={asset(`${p.src}${large ? "" : "-sm"}.jpg`)} alt={p.alt} className={imgClassName} loading={Math.abs(k - start) < 2 ? "eager" : "lazy"} draggable={false} />
            )}
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" disabled={i === 0}
            className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 disabled:invisible">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" disabled={i === photos.length - 1}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink shadow opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 disabled:invisible">
            <ChevronRight className="size-5" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5" aria-hidden="true">
            {photos.slice(first, first + MAX).map((p, k) => {
              const n = first + k;
              const edge = (n === first && first > 0) || (n === first + MAX - 1 && first + MAX < photos.length);
              return <span key={p.src + n} className={`rounded-full bg-white shadow transition-all ${n === i ? "size-2 opacity-100" : edge ? "size-1 opacity-60" : "size-1.5 opacity-60"}`} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
