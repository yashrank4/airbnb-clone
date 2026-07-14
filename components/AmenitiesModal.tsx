"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { listing } from "@/data/loadListing";
import Icon, { type IconName } from "@/components/Icon";
import { useModalShell } from "@/hooks/useModalShell";

type AmenitiesModalProps = {
  open: boolean;
  onClose: () => void;
};

// "Show all amenities" modal — a centered dialog listing every amenity grouped
// by category (Bathroom, Kitchen and dining, …). Closes on Escape, backdrop
// click, or the close button; locks body scroll and traps Tab focus.
export default function AmenitiesModal({ open, onClose }: AmenitiesModalProps) {
  const { amenityGroups } = listing;
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useModalShell({
    active: open,
    containerRef,
    onEscape: onClose,
  });

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close amenities dialog"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenities-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-[780px] flex-col overflow-hidden rounded-xl bg-[var(--bg)] shadow-[var(--shadow-card)]"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="shrink-0 px-6 pt-6">
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
              >
                <Icon name="cross" className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-12 pb-12 pt-6">
              <h2
                id="amenities-modal-title"
                className="text-[22px] font-medium leading-[26px] text-[var(--fg)]"
              >
                What this place offers
              </h2>

              {amenityGroups.map((group) => (
                <div key={group.title} className="mt-8">
                  <h3 className="text-[18px] font-medium leading-[22px] text-[var(--fg)]">
                    {group.title}
                  </h3>
                  <ul className="mt-2">
                    {group.items.map((item, index) => (
                      <li
                        key={`${item.label}-${index}`}
                        className="grid grid-cols-[24px_1fr] items-center gap-x-4 border-b border-[var(--border)] py-4"
                      >
                        <span
                          className={
                            item.available
                              ? "text-[var(--fg)]"
                              : "text-[var(--fg-secondary)]"
                          }
                        >
                          <Icon
                            name={item.icon as IconName}
                            className="h-6 w-6"
                          />
                        </span>
                        <span
                          className={`text-[16px] font-normal leading-[20px] ${
                            item.available
                              ? "text-[var(--fg)]"
                              : "text-[var(--fg-secondary)] line-through"
                          }`}
                        >
                          {item.available
                            ? item.label
                            : `${item.label} (unavailable)`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
