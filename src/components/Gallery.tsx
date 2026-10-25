"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/links";
import type { Photo } from "@/site";
import { Carousel } from "./Carousel";

/** Full-screen photo viewer: swipe or use the arrows, with a strip of thumbnails to jump around. */
export function Gallery({ title, photos, start, onClose }: { title: string; photos: Photo[] | null; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [jump, setJump] = useState(start);
  const box = useRef<HTMLDivElement>(null);
  const open = !!photos?.length;

  useEffect(() => {
    if (!open) return;
    setI(start);
    setJump(start);
    const last = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => box.current?.querySelector<HTMLElement>("[aria-roledescription=carousel] button, [data-close]")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      last?.focus?.();
    };
  }, [open, start, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={box} role="dialog" aria-modal="true" aria-label={`${title} photos`}
          className="fixed inset-0 z-50 grid grid-rows-[auto_1fr_auto] gap-3 bg-ink pb-[max(16px,env(safe-area-inset-bottom,0px))] pt-[max(12px,env(safe-area-inset-top,0px))] text-white"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="gutter flex items-center justify-between gap-3">
            <p className="min-w-0 truncate"><span className="font-display text-lg">{title}</span> <span className="text-white/60">· {i + 1} of {photos!.length}</span></p>
            <button type="button" data-close onClick={onClose} aria-label="Close photos" className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
              <X className="size-5" />
            </button>
          </div>

          <Carousel key={jump} photos={photos!} start={jump} large onIndex={setI} label={`${title} photos`}
            className="h-full min-h-0" imgClassName="max-h-full max-w-full object-contain sm:rounded-xl" />

          <div className="gutter grid gap-2">
            <p className="text-center text-sm text-white/75">{photos![i]?.alt}</p>
            <div className="no-scrollbar mx-auto flex max-w-full gap-2 overflow-x-auto">
              {photos!.map((p, k) => (
                <button key={p.src + k} type="button" onClick={() => { setJump(k); setI(k); }} aria-label={`Photo ${k + 1}: ${p.alt}`} aria-current={k === i}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-white" : "border-transparent opacity-55"}`}>
                  <img src={asset(`${p.src}-sm.jpg`)} alt="" className="h-14 w-20 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
