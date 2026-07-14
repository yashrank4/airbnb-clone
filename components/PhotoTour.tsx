"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { listing } from "@/data/loadListing";
import { useModalShell } from "@/hooks/useModalShell";
import Lightbox from "@/components/Lightbox";

type PhotoTourProps = {
  open: boolean;
  onClose: () => void;
  // When set, land on this photo-section name after open (hero tile clicks).
  initialSection?: string | null;
};

type PhotoRow =
  | { type: "full"; urls: [string] }
  | { type: "pair"; urls: [string, string] };

function layoutRows(photos: string[]): PhotoRow[] {
  const rows: PhotoRow[] = [];
  let i = 0;
  let fullNext = true;

  while (i < photos.length) {
    if (fullNext) {
      rows.push({ type: "full", urls: [photos[i]] });
      i += 1;
      fullNext = false;
    } else if (i + 1 < photos.length) {
      rows.push({ type: "pair", urls: [photos[i], photos[i + 1]] });
      i += 2;
      fullNext = true;
    } else {
      rows.push({ type: "full", urls: [photos[i]] });
      i += 1;
    }
  }

  return rows;
}

function useSectionOffsets() {
  return useMemo(() => {
    const offsets: number[] = [];
    let running = 0;
    for (const section of listing.photoSections) {
      offsets.push(running);
      running += section.photos.length;
    }
    return offsets;
  }, []);
}

export default function PhotoTour({
  open,
  onClose,
  initialSection = null,
}: PhotoTourProps) {
  const { photoSections } = listing;
  const sectionOffsets = useSectionOffsets();

  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const savedScroll = useRef(0);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useModalShell({
    active: open && lightboxIndex === null,
    containerRef,
    onEscape: onClose,
  });

  useEffect(() => {
    if (!open) return;
    backRef.current?.focus();
    const url = new URL(window.location.href);
    url.searchParams.set("modal", "photos");
    window.history.replaceState(window.history.state, "", url);

    return () => {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("modal");
      window.history.replaceState(window.history.state, "", cleanUrl);
    };
  }, [open]);

  // Land on the hero-clicked section (instant) once the feed mounts.
  useEffect(() => {
    if (!open) return;

    const targetIndex = initialSection
      ? photoSections.findIndex((s) => s.section === initialSection)
      : 0;
    const index = targetIndex >= 0 ? targetIndex : 0;

    // Double rAF: refs + layout settle after the modal paints.
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const el = sectionRefs.current[index];
        const feed = feedRef.current;
        if (!feed) return;
        if (index === 0 || !el) {
          feed.scrollTop = 0;
        } else {
          feed.scrollTop = el.offsetTop - 16;
        }
        setActiveSection(index);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [open, initialSection, photoSections]);

  useEffect(() => {
    if (!open || lightboxIndex !== null) return;
    const feed = feedRef.current;
    if (!feed) return;

    const onScroll = () => {
      const scrollTop = feed.scrollTop;
      let current = 0;
      for (let i = 0; i < sectionRefs.current.length; i += 1) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        if (el.offsetTop - 80 <= scrollTop) current = i;
      }
      setActiveSection(current);
    };

    feed.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => feed.removeEventListener("scroll", onScroll);
  }, [open, lightboxIndex]);

  const jumpToSection = useCallback((i: number) => {
    const el = sectionRefs.current[i];
    const feed = feedRef.current;
    if (el && feed) {
      feed.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
      setActiveSection(i);
    }
  }, []);

  const openLightbox = useCallback((globalIndex: number) => {
    savedScroll.current = feedRef.current?.scrollTop ?? 0;
    setLightboxIndex(globalIndex);
  }, []);

  const returnToGrid = useCallback(() => {
    setLightboxIndex(null);
    requestAnimationFrame(() => {
      if (feedRef.current) feedRef.current.scrollTop = savedScroll.current;
      backRef.current?.focus();
    });
  }, []);

  // Drop lightbox state when the tour closes so it doesn't linger during exit.
  useEffect(() => {
    if (!open) setLightboxIndex(null);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="photo-tour"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Photo tour"
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
        <header className="relative z-[5] flex h-[88px] shrink-0 items-center px-8">
          <button
            ref={backRef}
            type="button"
            aria-label="Close photo tour"
            onClick={onClose}
            className="ml-[-8px] flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <Icon name="chev-left" className="h-[18px] w-[18px]" />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-medium text-[var(--fg)]">
            Photo tour
          </h2>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon name="share" className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Save"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon
                name="heart"
                className="h-[18px] w-[18px]"
                style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }}
              />
            </button>
          </div>
        </header>

        <div ref={feedRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1024px] px-6 pb-24">
            <nav
              aria-label="Photo categories"
              className="pb-6 pt-1"
            >
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(photoSections.length, 9)}, minmax(0, 1fr))`,
                }}
              >
                {photoSections.map((section, i) => {
                  const isActive = activeSection === i;
                  return (
                    <button
                      key={section.section}
                      type="button"
                      aria-label={section.section}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => jumpToSection(i)}
                      className="flex flex-col gap-2 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
                    >
                      <div className="relative aspect-[106/100] w-full overflow-hidden rounded-lg bg-[var(--bg-subtle)]">
                        <Image
                          src={section.photos[0]}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[13px] font-normal text-[var(--fg-secondary)]">
                        {section.section}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {photoSections.map((section, si) => {
              const rows = layoutRows(section.photos);
              const baseIndex = sectionOffsets[si];
              let photoCursor = 0;

              return (
                <section
                  key={section.section}
                  id={`tour-room-${si}`}
                  ref={(el) => {
                    sectionRefs.current[si] = el;
                  }}
                  className="grid grid-cols-1 items-start gap-x-[60px] gap-y-5 py-8 md:grid-cols-2"
                >
                  <div className="sticky top-5 self-start">
                    <h3 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--fg)]">
                      {section.section}
                    </h3>
                    {section.facilities.length > 0 ? (
                      <p className="mt-2 text-[16px] font-normal leading-[1.4] text-[var(--fg-secondary)]">
                        {section.facilities.join("  ·  ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3">
                    {rows.map((row) => {
                      const start = photoCursor;
                      photoCursor += row.urls.length;

                      return (
                        <div
                          key={`${section.section}-${start}`}
                          className={`grid gap-3 ${
                            row.type === "pair" ? "grid-cols-2" : "grid-cols-1"
                          }`}
                        >
                          {row.urls.map((url, ri) => {
                            const globalIndex = baseIndex + start + ri;
                            return (
                              <button
                                key={url}
                                type="button"
                                onClick={() => openLightbox(globalIndex)}
                                aria-label={`${listing.title} image ${globalIndex + 1}`}
                                className="relative block aspect-[3/2] w-full overflow-hidden rounded-lg bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
                              >
                                <Image
                                  src={url}
                                  alt={section.section}
                                  fill
                                  sizes={
                                    row.type === "pair"
                                      ? "(min-width: 768px) 250px, 50vw"
                                      : "(min-width: 768px) 500px, 100vw"
                                  }
                                  className="object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Lightbox
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onReturnToGrid={returnToGrid}
      />
    </>
  );
}
