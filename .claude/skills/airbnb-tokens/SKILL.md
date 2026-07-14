---
name: airbnb-tokens
description: Canonical design tokens (color, type, spacing, radii, shadows) for the Airbnb clone. Consult before writing any styling so values stay consistent with the reference.
---

# Airbnb Clone Design Tokens (LOCKED)

Emit these as CSS custom properties on :root and reuse everywhere.

## Layout
page-max:1280px  gutter:80px  content-col:~740px  booking-rail:360px  col-gap:64px
header:67px  photo-grid-height:430px  grid-gap:8px  radius-img:12px (outer corners only)

## Type  (font stack: Inter, -apple-system, "Helvetica Neue", sans-serif)
h1:26/30/600  h2:22/26/600  subtitle:18/24/400  body:16/22/400
meta:14/18/400 var(--fg-secondary)  price:22/600  rating-hero:34/600

## Color
--fg:#222222; --fg-secondary:#6a6a6a;
--border:#dddddd; --border-strong:#b0b0b0;
--bg:#ffffff; --bg-subtle:#f7f7f7;
--rausch:#ff385c; --rausch-dark:#e00b41;
--claim-green:#0a7d33;
--overlay:rgba(0,0,0,0.92);
--shadow-card:0 6px 16px rgba(0,0,0,0.12);

## Booking card
w:360 border:1px var(--border) radius:12 shadow:var(--shadow-card) pad:24 sticky-top:100
price:22/600 + "for N nights" 16/400 secondary
date/guest grid: bordered, radius 8, var(--border-strong) dividers
reserve: full-width 48px radius:8 bg:var(--rausch) (hover var(--rausch-dark)) white 16/600
"You won't be charged yet": 14/400 secondary, centered

## Buttons
show-all-photos: white bg, 1px #222, radius 8, ~14/600, pad 7px 15px, subtle shadow