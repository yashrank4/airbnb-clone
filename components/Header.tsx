"use client";

import Image from "next/image";
import Icon from "@/components/Icon";

// Real property thumbnail (searchbar-house.png) shown at the far left of the
// search pill — the actual asset used on the reference.
function PillThumbnail() {
  return (
    <Image
      src="/images/searchbar-house.png"
      alt=""
      width={48}
      height={48}
      aria-hidden="true"
      className="shrink-0 rounded-full block object-fill ml-[-6px]"
    />
  );
}

export default function Header() {
  return (
    <header className="h-[var(--header-h)] w-full border-b border-[var(--border)] bg-[var(--bg)]">
      <div
        className="h-full w-full grid px-[var(--gutter)]"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Left — logo */}
        <div className="flex justify-start">
          <a
            href="/"
            aria-label="Airbnb homepage"
            className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--rausch)]"
          >
            {/* Wordmark tinted rausch via color (the icon fills currentColor). */}
            <Icon
              name="airbnb-logo-with-text"
              className="w-auto text-[var(--rausch)]"
              style={{ height: "32px" }}
            />
          </a>
        </div>

        {/* Center — search pill */}
        <div
          className="justify-self-center inline-flex items-center h-12 px-2 border border-[var(--border)] rounded-[40px] shadow-[0_1px_4px_#00000014] bg-[var(--bg)] transition-shadow duration-200 hover:shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        >
          {/* Combined home icon and "Anywhere" button as a single component */}
          <button
            type="button"
            className="flex items-center px-4 gap-2 text-[14px] font-medium text-[var(--fg)] bg-transparent h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)] cursor-pointer"
            tabIndex={0}
            style={{ height: "48px" }}
          >
            <PillThumbnail />
            Anywhere
          </button>
          <span className="h-6 w-px bg-[var(--border)] mx-0" aria-hidden="true"></span>
          <button
            type="button"
            className="px-4 text-[14px] font-medium text-[var(--fg)] bg-transparent h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)] cursor-pointer"
            tabIndex={0}
            style={{ height: "48px" }}
          >
            Anytime
          </button>
          <span className="h-6 w-px bg-[var(--border)] mx-0" aria-hidden="true"></span>
          <button
            type="button"
            className="px-4 text-[14px] font-normal text-[var(--fg-secondary)] bg-transparent h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)] cursor-pointer"
            tabIndex={0}
            style={{ height: "48px" }}
          >
            Add guests
          </button>
          {/* Decorative — the whole pill is the button; this must not be a
              nested interactive element (invalid HTML, breaks keyboard/AT). */}
          <button
            type="button"
            aria-label="Search"
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--rausch)] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rausch)]"
          >
            {/* Heavier stroke (4) than the source file's default (2) to match
                the bold search glyph inside the small rausch circle. */}
            <Icon
              name="search"
              className="h-3.5 w-3.5 shrink-0"
              style={{ strokeWidth: 4 }}
            />
          </button>
     
        </div>
   
   

        {/* Right — controls */}
        <div className="flex justify-end items-center gap-2">
          <div className="flex justify-end items-center gap-[var(--grid-gap)]">
            <button
              type="button"
              className="rounded-full px-3.5 py-3 text-[14px] font-medium text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              Become a host
            </button>

            <button
              type="button"
              aria-label="Choose a language and region"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[var(--fg)] transition-colors duration-150 hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon name="globe" className="h-4 w-4 shrink-0" />
            </button>

            <button
              type="button"
              aria-label="Main navigation menu"
              aria-haspopup="menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-subtle)] transition-colors duration-150 hover:bg-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon name="ham" className="h-4 w-4 shrink-0" />
            </button>
          </div>
     
        </div>
      </div>
 
    </header>
  );
}
