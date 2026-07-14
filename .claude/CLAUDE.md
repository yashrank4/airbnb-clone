# Airbnb Clone — Project Guide

## Goal
Pixel-perfect, behavior-perfect desktop clone of the reference at
https://airbnb-clone-umber-two.vercel.app — visual, motion, and a11y parity.
Desktop only (≥1128px primary). No mobile.

## Hard rules
- NEVER copy source from the reference URL (lift-and-shift = disqualification).
  Rebuild from observed layout/behavior only. WebFetch/curl are denied on purpose.
- The reference is a full-page screenshot at  .claude/reference/listing-full.png — treat it
  as the single source of truth for visuals. Diff against it during QA.
- All measurements are LOCKED in .claude/skills/airbnb-tokens. Use them verbatim;
  do not re-estimate. If the screenshot disagrees with a token, trust the screenshot.
- Every interactive element: keyboard-operable, visible focus ring, correct ARIA.
- Prefer partial diffs over full-file rewrites when editing.

## Stack
Next.js (App Router) + TypeScript + Tailwind + Framer Motion.
Static image assets in /public/images. No backend.

## Data
All content (title, price, reviews, amenities, host, etc.) comes from /data/listing.json,
typed by /types/listing.ts. Components import `{ listing }` from "@/data/loadListing".
Never read content off the screenshot — the screenshot is for visual/layout fidelity only.

## Locked layout (measured from reference — do NOT re-derive)
content max-width 1280px, 80px gutters. Left content ~740px | booking rail ~360px, gap 64px.
Header 67px. Photo grid: big-left rowspan-2 + 2x2 right, 8px gap, outer corners 12px, ~430px tall.

## Style
- 2-space indent, double quotes, semicolons, trailing commas.
- Tailwind for layout; CSS vars (airbnb-tokens skill) for the palette.
- Components in /components, one concern each. No barrel files.

## Views to ship
1. Listing page  2. Photo Tour overlay  3. Lightbox overlay

## Definition of done (per component)
- Matches token spec.  - Hover/scroll transitions match.
- Tab order + focus trap correct.  - No console warnings.

## Delegation
- Layout/visual work → ui-engineer
- Animations/transitions → motion-engineer
- Keyboard/focus/ARIA → a11y-auditor