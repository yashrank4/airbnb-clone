"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { listing } from "@/data/loadListing";
import Icon from "@/components/Icon";
import type { NearbyStay } from "@/types/listing";

const VISIBLE = 5;

function StayCard({ stay }: { stay: NearbyStay }) {
  return (
    <a
      href="#"
      className="group block min-w-0 shrink-0 basis-[calc((100%-80px)/5)] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--bg-subtle)]">
        <Image
          src={stay.img}
          alt={stay.title}
          fill
          sizes="230px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-2 line-clamp-2 text-[14px] font-medium leading-[18px] text-[var(--fg)]">
        {stay.title}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-[13px] font-normal text-[var(--fg)]">
        <span>{stay.price}</span>
        <Icon name="start" className="h-2.5 w-2.5 shrink-0" aria-hidden />
        <span>{stay.rating}</span>
      </p>
    </a>
  );
}

export default function MoreStaysNearby() {
  const { nearbyStays } = listing;
  const trackRef = useRef<HTMLDivElement>(null);
  const programmaticRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(nearbyStays.length / VISIBLE));

  const unlock = useCallback(() => {
    programmaticRef.current = false;
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  const syncPage = useCallback(() => {
    if (programmaticRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setPage(0);
      return;
    }
    const next = Math.round((track.scrollLeft / maxScroll) * (pages - 1));
    setPage(Math.max(0, Math.min(pages - 1, next)));
  }, [pages]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScrollEnd = () => unlock();

    syncPage();
    track.addEventListener("scroll", syncPage, { passive: true });
    track.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", syncPage);
    return () => {
      track.removeEventListener("scroll", syncPage);
      track.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", syncPage);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [syncPage, unlock]);

  const goTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(pages - 1, next));
    if (clamped === page) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const left =
      pages <= 1 ? 0 : (clamped / (pages - 1)) * Math.max(0, maxScroll);

    programmaticRef.current = true;
    setPage(clamped);
    track.scrollTo({ left, behavior: "smooth" });

    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(unlock, 500);
  };

  if (nearbyStays.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
          More stays nearby
        </h2>

        <div className="flex items-center gap-2">
          <span
            className="mr-1.5 text-[14px] font-normal text-[var(--fg-secondary)]"
            aria-live="polite"
          >
            {page + 1} / {pages}
          </span>
          <button
            type="button"
            aria-label="Previous stays"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <Icon name="chev-left" className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Next stays"
            disabled={page >= pages - 1}
            onClick={() => goTo(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <Icon name="chev-right" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="More stays nearby"
        className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {nearbyStays.map((stay) => (
          <StayCard key={`${stay.title}-${stay.price}`} stay={stay} />
        ))}
      </div>
    </section>
  );
}
