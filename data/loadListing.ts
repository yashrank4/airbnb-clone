import raw from "./listing.json";
import type { Listing } from "@/types/listing";

export const listing = raw as Listing;

// Flat, ordered index of every tour photo, tagged with the section it belongs
// to. Drives the lightbox: `flatPhotos[i]` maps a global index to its url +
// room name, and `flatPhotos.length` is the "N of 43" counter denominator.
export interface FlatPhoto {
  url: string;
  section: string;
  alt: string;
}

export const flatPhotos: FlatPhoto[] = listing.photoSections.flatMap((s) =>
  s.photos.map((url, i) => ({
    url,
    section: s.section,
    alt: `${s.section} photo ${i + 1}`,
  })),
);