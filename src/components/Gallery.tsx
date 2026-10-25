"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/site";

/** Full-screen photo viewer: arrows, swipe-free buttons, keyboard and thumbnails. */
export function Gallery({ title, photos, start, onClose }: { title: string; photos: Photo[] | null; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const box = useRef<HTMLDivElement>(null);
  const open = !!photos?.length;

  useEffect(() => {
    if (!open) return;
    setI(start);
    const last = document.activeElement as HTMLElement | null;
    const n = photos!.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    setTimeout(() => box.current?.querySelector<HTMLElement>("[data-close]")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      last?.focus?.();
    };
  }, [open, photos, start, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={box} role="dialog" aria-modal="true" aria-label={`${title} photos`}
          className="fixed inset-0 z-50 grid grid-rows-[auto_1fr_auto] gap-3 bg-ink/95 pb-[max(16px,env(safe-area-inset-bottom,0px))] pt-[max(12px,env(safe-area-inset-top,0px))] text-white"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="gutter flex items-center justify-between gap-3">
            <p className="min-w-0 truncate"><span className="font-display text-lg">{title}</span> <span className="text-white/60">· {i + 1} of {photos!.length}</span></p>
            <button type="button" data-close onClick={onClose} aria-label="Close photos" className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-2xl">×</button>
          </div>

          <div className="relative grid min-h-0 place-items-center px-2 sm:px-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img key={i} src={`${photos![i]!.src}.jpg`} alt={photos![i]!.alt} className="max-h-[calc(100dvh-210px)] max-w-full rounded-xl object-contain"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} />
            </AnimatePresence>
            {photos!.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => setI((x) => (x - 1 + photos!.length) % photos!.length)}
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-2xl sm:left-4">‹</button>
                <button type="button" aria-label="Next photo" onClick={() => setI((x) => (x + 1) % photos!.length)}
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-2xl sm:right-4">›</button>
              </>
            )}
          </div>

          <div className="gutter">
            <p className="mb-2 text-center text-sm text-white/75">{photos![i]!.alt}</p>
            <div className="mx-auto flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-center">
              {photos!.map((p, k) => (
                <button key={p.src} type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}: ${p.alt}`} aria-current={k === i}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-white" : "border-transparent opacity-60"}`}>
                  <img src={`${p.src}-sm.jpg`} alt="" className="h-14 w-20 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
