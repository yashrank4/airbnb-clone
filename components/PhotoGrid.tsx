"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { listing } from "@/data/loadListing";

interface PhotoGridProps {
  onOpenPhotoTour: (section?: string) => void;
}

// 3x3 dot-grid icon used inside the "Show all photos" pill — real Airbnb
// geometry (from site-assets/dot-grid.svg), currentColor-driven.
function DotGridIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
      style={{ fill: "currentColor" }}
    >
      <path
        fillRule="evenodd"
        d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
      />
    </svg>
  );
}

// Shared classes for every clickable photo cell. Cells carry NO corner radius:
// the 12px outer rounding lives on the grid container (overflow-hidden), which
// clips the four outer corners automatically and keeps interior corners square
// — mirroring the reference's `border-radius:12px; overflow:hidden` on the grid.
const cellButtonClass =
  "group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0 focus-visible:z-10";

const imageClass =
  "object-cover transition-[filter] duration-200 ease-out group-hover:brightness-90";

type HeroTile = {
  url: string;
  alt: string;
  section: string;
  // CSS grid placement for the 3-col / 2-row hero collage.
  className?: string;
  sizes: string;
  priority?: boolean;
};

export default function PhotoGrid({ onOpenPhotoTour }: PhotoGridProps) {
  const { heroPhotos, totalPhotos, title } = listing;
  const [big, topLeft, topRight, bottomLeft, bottomRight] = heroPhotos;
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tiles: HeroTile[] = [
    {
      ...big,
      className: "row-span-2",
      sizes: "(min-width: 1128px) 553px, 100vw",
      priority: true,
    },
    {
      ...topLeft,
      sizes: "(min-width: 1128px) 269px, 100vw",
    },
    {
      ...topRight,
      sizes: "(min-width: 1128px) 269px, 100vw",
    },
    {
      ...bottomLeft,
      sizes: "(min-width: 1128px) 269px, 100vw",
    },
    {
      ...bottomRight,
      sizes: "(min-width: 1128px) 269px, 100vw",
    },
  ];

  // Arrow-key roving focus across the 5 hero tiles (grid order):
  //   0 spans both rows | 1  2
  //                     | 3  4
  const focusTile = useCallback((index: number) => {
    const next = ((index % tiles.length) + tiles.length) % tiles.length;
    cellRefs.current[next]?.focus();
  }, [tiles.length]);

  const onCellKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (index === 0) focusTile(1);
          else if (index === 1) focusTile(2);
          else if (index === 3) focusTile(4);
          else if (index === 2) focusTile(0);
          else if (index === 4) focusTile(3);
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (index === 0) focusTile(2);
          else if (index === 1) focusTile(0);
          else if (index === 2) focusTile(1);
          else if (index === 3) focusTile(0);
          else if (index === 4) focusTile(3);
          break;
        case "ArrowDown":
          event.preventDefault();
          if (index === 0) focusTile(3);
          else if (index === 1) focusTile(3);
          else if (index === 2) focusTile(4);
          else if (index === 3) focusTile(1);
          else if (index === 4) focusTile(2);
          break;
        case "ArrowUp":
          event.preventDefault();
          if (index === 0) focusTile(1);
          else if (index === 1) focusTile(0);
          else if (index === 2) focusTile(0);
          else if (index === 3) focusTile(1);
          else if (index === 4) focusTile(2);
          break;
        case "Home":
          event.preventDefault();
          focusTile(0);
          break;
        case "End":
          event.preventDefault();
          focusTile(tiles.length - 1);
          break;
        default:
          break;
      }
    },
    [focusTile, tiles.length],
  );

  return (
    <div
      className="relative mx-auto w-full max-w-[1120px]"
      role="region"
      aria-label={`${title} photo gallery`}
    >
      <p id="hero-photos-hint" className="sr-only">
        Five featured photos. Use arrow keys to move between photos. Enter or
        Space opens the photo tour for that room.
      </p>

      <div
        role="group"
        aria-describedby="hero-photos-hint"
        className="grid aspect-[1120/494] grid-cols-[35fr_17fr_17fr] grid-rows-2 gap-[var(--grid-gap)] overflow-hidden rounded-[var(--radius-img)]"
      >
        {tiles.map((tile, index) => (
          <button
            key={`${tile.url}-${index}`}
            ref={(el) => {
              cellRefs.current[index] = el;
            }}
            type="button"
            onClick={() => onOpenPhotoTour(tile.section)}
            onKeyDown={(event) => onCellKeyDown(event, index)}
            aria-label={`Photo ${index + 1} of ${tiles.length}: ${tile.alt}. Opens ${tile.section} in the photo tour.`}
            aria-haspopup="dialog"
            className={[cellButtonClass, tile.className].filter(Boolean).join(" ")}
          >
            {/* Decorative — name comes from the button aria-label to avoid
                screen readers announcing the image twice. */}
            <Image
              src={tile.url}
              alt=""
              fill
              sizes={tile.sizes}
              className={imageClass}
              priority={tile.priority}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpenPhotoTour()}
        aria-label={`Show all ${totalPhotos} photos`}
        aria-haspopup="dialog"
        className="absolute bottom-6 right-6 flex h-8 items-center gap-2 rounded-lg border border-[var(--fg)] bg-[var(--bg)] px-[15px] py-[7px] text-[12px] font-semibold text-[var(--fg)] shadow-[var(--shadow-card)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--bg-subtle)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
      >
        <DotGridIcon />
        Show all photos
      </button>
    </div>
  );
}
