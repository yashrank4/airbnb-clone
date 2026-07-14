"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { flatPhotos } from "@/data/loadListing";
import { useModalShell } from "@/hooks/useModalShell";

type LightboxProps = {
  // Global index into flatPhotos, or null when the lightbox is closed.
  index: number | null;
  onIndexChange: (next: number) => void;
  // Return to the grid view (grid icon / Escape), preserving scroll position.
  onReturnToGrid: () => void;
};

// Second-level full-screen photo viewer. Arrow swaps stay instant; open/close
// fades to match the photo-tour modal transition.
export default function Lightbox({
  index,
  onIndexChange,
  onReturnToGrid,
}: LightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const total = flatPhotos.length;
  const current = open ? flatPhotos[index] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  useModalShell({
    active: open,
    containerRef,
    onEscape: onReturnToGrid,
    onKeyDown: handleKeyDown,
  });

  const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg)] text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]";

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          key="lightbox"
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.section}, photo ${index + 1} of ${total}`}
          className="fixed inset-0 z-[110] flex flex-col bg-[var(--bg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 text-[var(--fg)]">
            <button
              type="button"
              aria-label="Back to all photos"
              onClick={onReturnToGrid}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon name="dot-grid" className="h-5 w-5" />
            </button>

            <span className="text-[15px] font-medium">{current.section}</span>

            <div className="flex items-center gap-2">
              <span
                aria-live="polite"
                className="text-[14px] font-normal text-[var(--fg-secondary)]"
              >
                {index + 1} of {total}
              </span>
              <button
                type="button"
                aria-label="Close photo"
                onClick={onReturnToGrid}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
              >
                <Icon name="cross" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={goPrev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${arrowClass}`}
            >
              <Icon name="chev-left-rounded-point" className="h-5 w-5" />
            </button>

            <div className="relative h-full w-full max-w-[1200px]">
              <Image
                key={current.url}
                src={current.url}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            <button
              type="button"
              aria-label="Next photo"
              onClick={goNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${arrowClass}`}
            >
              <Icon name="chev-rught-rounded-point" className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
