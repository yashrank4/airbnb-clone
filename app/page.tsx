"use client";

import { useCallback, useRef, useState } from "react";
import BookingCard from "@/components/BookingCard";
import Overview from "@/components/Overview";
import PhotoGrid from "@/components/PhotoGrid";
import ShareSave from "@/components/ShareSave";
import WhereYoullSleep from "@/components/WhereYoullSleep";
import Amenities from "@/components/Amenities";
import Calendar from "@/components/Calendar";
import Reviews from "@/components/Reviews";
import LocationMap from "@/components/LocationMap";
import HostSection from "@/components/HostSection";
import ThingsToKnow from "@/components/ThingsToKnow";
import MoreStaysNearby from "@/components/MoreStaysNearby";
import PhotoTour from "@/components/PhotoTour";
import { listing } from "@/data/loadListing";

export default function Home() {
  const [tourOpen, setTourOpen] = useState(false);
  // Section to land on when opening from a hero tile; null = start of tour.
  const [tourSection, setTourSection] = useState<string | null>(null);
  // Remember the element that opened the tour so focus returns there on close.
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleOpenPhotoTour = useCallback((section?: string) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setTourSection(section ?? null);
    setTourOpen(true);
  }, []);

  const handleClosePhotoTour = useCallback(() => {
    setTourOpen(false);
    setTourSection(null);
    triggerRef.current?.focus();
  }, []);

  return (
    // The content column (max-width + gutter padding) is applied once in the
    // root layout, so sections here only handle their own vertical rhythm.
    <main id="main-content">
      <a
        href="#photos"
        className="absolute left-[-10000px] top-4 z-[200] rounded-lg bg-[var(--bg)] px-4 py-2 text-[14px] font-medium text-[var(--fg)] shadow-[var(--shadow-card)] focus:left-[var(--gutter)] focus:outline-none focus:ring-2 focus:ring-[var(--fg)]"
      >
        Skip to listing photos
      </a>
      {/* Title row — title left, Share/Save right, above the photo grid. */}
      <section className="flex items-start justify-between pt-8 pb-4.5">
        <h1 className="text-[26px] font-medium leading-[30px]">
          {listing.title}
        </h1>
        <ShareSave />
      </section>

      {/* Anchor target for the SubNav "Photos" link. Scroll-margin keeps the
          section clear of the fixed sub-nav when jumped to. */}
      <section
        id="photos"
        className="scroll-mt-24"
        aria-label="Listing photos"
      >
        <PhotoGrid onOpenPhotoTour={handleOpenPhotoTour} />
      </section>

      {/* Two-column body — reference grid (from devtools):
          grid-template-columns: minmax(0, 1fr) 372px; gap: 0 96px.
          Left = scrollable content sections; right = sticky booking rail. */}
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)_372px] items-start gap-x-24">
        <div>
          <Overview />
          <WhereYoullSleep />
          <Amenities />
          <Calendar />
        </div>
        <BookingCard />
      </div>

      {/* Full-width sections below the two-column body. */}
      <Reviews />
      <LocationMap />
      <HostSection />
      <ThingsToKnow />
      <MoreStaysNearby />

      <PhotoTour
        open={tourOpen}
        onClose={handleClosePhotoTour}
        initialSection={tourSection}
      />
    </main>
  );
}
