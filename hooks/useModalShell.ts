"use client";

import { useEffect } from "react";

type ModalShellOptions = {
  active: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onEscape: () => void;
  // Extra keydown handling (e.g. arrow navigation in the lightbox). Runs before
  // the built-in Escape/Tab handling; call preventDefault to stop the default.
  onKeyDown?: (event: KeyboardEvent) => void;
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

// Shared modal plumbing for the photo tour + lightbox: locks body scroll,
// closes on Escape, and traps Tab focus within the container. Intentionally has
// NO open/close animation — the photo tour is a pure instant-cut feature.
export function useModalShell({
  active,
  containerRef,
  onEscape,
  onKeyDown,
}: ModalShellOptions) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key === "Tab" && container) {
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (event.shiftKey && activeEl === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeEl === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, containerRef, onEscape, onKeyDown]);
}
