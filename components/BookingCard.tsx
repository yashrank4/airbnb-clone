"use client";

import { listing } from "@/data/loadListing";

// Hardcoded display values — not present in listing.json.
// Per data/listing.json._unresolved: "check-in/checkout dates in booking
// card (10/18/2026 to 10/23/2026 shown faintly)". The selected guest count
// shown in the reference ("2 guests") is a UI selection distinct from
// listing.capacity.guests (3), which is the *maximum* capacity for the unit.
const CHECK_IN = "10/18/2026";
const CHECK_OUT = "10/23/2026";
const SELECTED_GUESTS = 2;
const CANCELLATION_DATE = "17 October";

function TagIcon() {
  return (
    <img
      src="/icons/discount.svg"
      width={32}
      height={32}
      aria-hidden="true"
      className="shrink-0"
      alt=""
      loading="lazy"
    />
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="var(--fg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BookingCard() {
  const { price } = listing;

  return (
    <div className="w-[var(--booking-rail)] sticky top-[var(--booking-sticky-top)]">

      {/* Green promo row — sits above the main card, ~16px gap. */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-4">
        <div className="items-start gap-3">
          <TagIcon />
        </div>
        <div className="flex-1 leading-tight">
            <p className="text-[14px] font-normal text-[var(--fg)]">
              Get 10% off your next stay.
            </p>
            <a
              href="#terms"
              className="rounded text-[14px] font-medium text-[var(--fg)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              Terms apply
            </a>
          </div>
        <button
          type="button"
          aria-label="Claim 10% off discount"
          className="flex h-8.5 shrink-0 items-center justify-center rounded-lg bg-[var(--grey100)] px-3.5 py-2 text-center transition-colors duration-150 hover:bg-[var(--grey200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          <span className="w-full text-center text-[14px] font-medium text-[var(--fg)]">
            Claim
          </span>
        </button>
   
      </div>

      {/* Main booking card */}
      <div
        className="rounded-[var(--radius-img)] border border-[var(--border)] p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Price row */}
        <p className="mb-4">
          <span className="text-[22px] font-semibold underline text-[var(--fg)]">
            {price.raw}
          </span>{" "}
          <span className="text-[16px] font-normal text-[var(--fg-secondary)]">
            for {price.nights} nights
          </span>
        </p>

        {/* Date / guest control block */}
        <div className="rounded-lg border border-[var(--border-strong)]">
          <div className="grid grid-cols-2">
            <button
              type="button"
              aria-label={`Check-in date, ${CHECK_IN}`}
              className="flex flex-col items-start gap-0.5 rounded-tl-lg border-r border-[var(--border-strong)] px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--fg)]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--fg)]">
                Check-in
              </span>
              <span className="text-[14px] font-normal text-[var(--fg)]">
                {CHECK_IN}
              </span>
            </button>
            <button
              type="button"
              aria-label={`Checkout date, ${CHECK_OUT}`}
              className="flex flex-col items-start gap-0.5 rounded-tr-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--fg)]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--fg)]">
                Checkout
              </span>
              <span className="text-[14px] font-normal text-[var(--fg)]">
                {CHECK_OUT}
              </span>
            </button>
          </div>
          <button
            type="button"
            aria-label={`Guests, ${SELECTED_GUESTS} guests selected`}
            className="flex w-full items-center justify-between gap-2 rounded-b-lg border-t border-[var(--border-strong)] px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--fg)]"
          >
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--fg)]">
                Guests
              </span>
              <span className="text-[14px] font-normal text-[var(--fg)]">
                {SELECTED_GUESTS} guests
              </span>
            </span>
            <ChevronDownIcon />
          </button>
        </div>

        {/* Free cancellation strip */}
        <div className="mt-4 rounded-lg bg-[var(--bg-subtle)] px-4 py-3 text-center text-[14px] text-[var(--fg-secondary)]">
          Free cancellation before{" "}
          <span className="font-semibold text-[var(--fg)]">
            {CANCELLATION_DATE}
          </span>
        </div>

        {/* Reserve CTA */}
        <button
          type="button"
          className="mt-4 h-12 w-full rounded-full text-[16px] font-semibold text-white transition-[filter] duration-150 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--rausch-dark)] active:scale-[0.985]"
          style={{ background: "var(--reserve)" }}
        >
          Reserve
        </button>

        {/* Caption */}
        <p className="mt-4 text-center text-[14px] font-normal text-[var(--fg-secondary)]">
          You won&apos;t be charged yet
        </p>
      </div>
    </div>
  );
}
