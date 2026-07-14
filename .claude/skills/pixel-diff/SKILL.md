---
name: pixel-diff
description: Workflow for visually diffing the built clone against the reference screenshot to catch spacing/color/type mismatches. Use during QA passes on any view.
---

# Pixel-Diff Workflow

Reference: /reference/listing-full.png (full-page capture @1440 wide).

1. Screenshot the built view at 1440px wide, same scroll position as reference.
2. Overlay against the reference at 50% opacity.
3. Check in priority order: column widths -> section vertical rhythm ->
   type size/weight -> text/border color -> radii -> shadows -> hover states.
4. For each mismatch record: element, expected (reference), actual, fix.
5. Re-run after fixes. Stop when no diff is perceptible at 100% zoom.

Common miss areas: gutter (80px), booking-card sticky offset (100px),
photo-grid corner radii (outer-only 12px), meta text color (#6a6a6a not #999),
reserve CTA color (#ff385c), content max-width (1280px).