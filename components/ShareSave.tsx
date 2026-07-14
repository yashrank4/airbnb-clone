"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

// Share + Save cluster shown at the top-right of the listing title row.
// Buttons press down (scale 0.9) on tap; a dark toast slides up from the
// bottom to confirm the action, matching the reference.
export default function ShareSave() {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show a toast, auto-dismissing after ~2.6s. Re-triggers reset the timer.
  const showToast = (message: string) => {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const buttonClass =
    "h-8.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[14px] font-medium text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]";

  return (
    <>
      <div className="flex shrink-0 items-center justify-end gap-[2px]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className={buttonClass}
          aria-label="Share listing"
          onClick={() => showToast("Share options")}
        >
          <Icon name="share" className="h-4 w-4 shrink-0" />
          <span className="underline underline-offset-2">Share</span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className={buttonClass}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          onClick={() => {
            const next = !saved;
            setSaved(next);
            showToast(next ? "Added to wishlist" : "Removed from wishlist");
          }}
        >
          {/* Heart: hollow outline when unsaved; filled rausch when saved. */}
          <Icon
            name="heart"
            className="h-4 w-4 shrink-0"
            style={
              saved
                ? { fill: "var(--rausch)", stroke: "var(--rausch)", strokeWidth: 3 }
                : { fill: "none", stroke: "currentColor", strokeWidth: 3 }
            }
          />
          <span className="underline underline-offset-2">{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </div>

      {/* Toast — slides up from the bottom, dark pill, auto-dismisses. */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#222222] px-5 py-4 text-[14px] font-medium text-white shadow-[var(--shadow-card)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
