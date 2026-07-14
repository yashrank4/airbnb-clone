"use client";

import { useRef, useState } from "react";
import { listing } from "@/data/loadListing";
import Icon, { type IconName } from "@/components/Icon";
import AmenitiesModal from "@/components/AmenitiesModal";

// Maps an amenity label (data/listing.json) to the icon that reproduces the
// reference. The two disabled alarms are assigned per the reference DOM, where
// their glyphs are swapped relative to the icon filenames.
const AMENITY_ICONS: Record<string, IconName> = {
  Kitchen: "knifespoon",
  Wifi: "wifi",
  "Dedicated workspace": "table",
  "Free parking on premises": "car",
  Pool: "swimming-pool",
  "Hot tub": "jacuzzi",
  "Pets allowed": "pet",
  "Exterior security cameras on property": "security-camera",
  "Carbon monoxide alarm": "smoke-alarm-disabled",
  "Smoke alarm": "carbon-monoxide-alarm-disabled",
};

export default function Amenities() {
  const { amenities, amenitiesTotal } = listing;
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <section
      id="amenities"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
        What this place offers
      </h2>

      {/* Two-column grid, row-major flow (Kitchen | Wifi, Workspace | Parking,
          …) matching the reference. Each item is itself a grid — a fixed 24px
          icon column + label — so icons and labels align across every row. */}
      <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-4">
        {amenities.map((amenity) => {
          const iconName = AMENITY_ICONS[amenity.label] ?? "home";
          return (
            <div
              key={amenity.label}
              className="grid grid-cols-[24px_1fr] items-center gap-x-4 py-1"
            >
              <span
                className={
                  amenity.available
                    ? "text-[var(--fg)]"
                    : "text-[var(--fg-secondary)]"
                }
                aria-hidden
              >
                <Icon name={iconName} className="h-6 w-6" />
              </span>
              <span
                className={`text-[16px] font-normal leading-[20px] ${
                  amenity.available
                    ? "text-[var(--fg)]"
                    : "text-[var(--fg-secondary)] line-through"
                }`}
              >
                {amenity.available
                  ? amenity.label
                  : `${amenity.label} (unavailable)`}
              </span>
            </div>
          );
        })}
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-8 rounded-lg border border-[var(--fg)] px-6 py-3.5 text-[16px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
      >
        Show all {amenitiesTotal} amenities
      </button>

      <AmenitiesModal open={modalOpen} onClose={closeModal} />
    </section>
  );
}
