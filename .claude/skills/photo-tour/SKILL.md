---
name: photo-tour
description: Complete behavioral + structural spec for the "Show all photos" Photo Tour and its lightbox. Consult before building the photo tour, gallery grid, or lightbox. Defines the exact (minimal, instant-cut) interaction model — do not add animations not listed here.
---

# Photo Tour + Lightbox

CRITICAL: All view changes are INSTANT CUTS. No fade, slide, crossfade, or
smooth-scroll anywhere. The ONLY animation in the entire feature is the back
button's circular grey hover highlight. Adding any other transition is a
fidelity failure.

## Entry point (listing page)
- Hero grid bottom-right thumbnail carries a white pill button: 3x3 dot-grid icon
  + "Show all photos", raised with subtle drop shadow so it reads over any photo.

## Opening
- Click opens an in-place full-viewport MODAL, not a route change.
- Reflect state in URL via a query param (e.g. ?modal=photos). Use shallow routing
  so no navigation/re-render flash.
- Open transition: INSTANT. No fade/slide.

## Modal header (grid view)
- Slim bar: back arrow (top-left), "Photo tour" title (centered),
  share + save/heart icons (top-right).
- Back arrow hover: circular grey background appears behind the icon. This is the
  ONLY hover animation in the feature.

## Category thumbnail row (below header)
- Horizontal row of rounded-square thumbnails, one per area, label underneath.
- Areas (from reference): Living room, Full kitchen, Bedroom, Full bathroom, Gym,
  Exterior, Pool, Additional photos.
- Click a thumbnail: jump INSTANTLY to that section (no smooth scroll — snap via
  element.scrollIntoView({ behavior: "auto" }) or direct scrollTop set).

## Scrollable feed (grid view body)
- Long vertical feed, one section per area. Each section:
  - heading (e.g. "Gym")
  - a line of amenity tags
  - one large hero photo for the room
  - a 2-column grid of secondary photos

## Lightbox (second level)
- Opens on clicking any individual photo. Full-screen.
- Dark minimal header: grid icon (top-left, returns to grid view), room name
  (center), image counter "20 of 43" (top-right), close X.
- Large circular arrow buttons on left/right screen edges.
- Arrow click: image swaps INSTANTLY, counter updates. No crossfade/slide.
- Keyboard: ArrowLeft/ArrowRight navigate, ESC closes lightbox.
- Grid icon returns to the scrollable grid view AND preserves scroll position —
  user lands back at the same section. (Capture scrollTop before opening lightbox,
  restore on return.)

## Closing
- Grid-view back arrow closes the whole tour, returns to listing page. INSTANT.

## a11y (still required despite no animation)
- Modal: role=dialog, aria-modal=true, aria-label="Photo tour". Focus trap.
- Lightbox: same modal semantics; counter in aria-live=polite.
- Focus returns to the "Show all photos" trigger on full close.
- The design is already motion-free; nothing to disable under prefers-reduced-motion.