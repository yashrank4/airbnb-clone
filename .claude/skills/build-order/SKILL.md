---
name: build-order
description: Canonical component build sequence and section list for the Airbnb clone. Consult when scaffolding or deciding what to build next.
---

# Build order (highest-fidelity-first)
1. tokens -> globals.css (CSS vars from airbnb-tokens)
2. /data/listing.json (populate from /reference/listing-full.png)
3. PhotoGrid  4. BookingCard  5. Header
6. Title + Share/Save  7. Overview meta + highlights + host
8. WhereYoullSleep  9. Amenities  10. Calendar
11. Reviews (bars + chips + cards)  12. Map  13. Host  14. ThingsToKnow  15. Footer
16. PhotoTour overlay  17. Lightbox overlay

Ship 3-15 as one page, then overlays.
Each component: match tokens -> hover/transitions (motion-engineer) -> a11y (a11y-auditor).