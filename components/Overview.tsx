"use client";

import Image from "next/image";
import { useState } from "react";
import { listing } from "@/data/loadListing";
import Icon, { type IconName } from "@/components/Icon";

const HIGHLIGHT_ICONS: Record<string, IconName> = {
  fireoutside: "fireoutside",
  cool: "fan",
  "self-checkin": "door",
};

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default function Overview() {
  const { capacity, rating, host, highlights, description } = listing;
  const [expanded, setExpanded] = useState(false);

  const metaLine = [
    pluralize(capacity.guests, "guest"),
    pluralize(capacity.bedrooms, "bedroom"),
    pluralize(capacity.beds, "bed"),
    pluralize(capacity.baths, "bathroom"),
  ].join(" · ");

  return (
    <div>
      <section className="pb-6">
        <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
          Entire serviced apartment in Candolim, India
        </h2>
        <p className="mt-1.5 text-[16px] font-normal text-[var(--fg)]">
          {metaLine}
        </p>
      </section>

      <section className="">
        <div className="mt-2 flex items-center justify-between gap-5.5 rounded-2xl border border-[var(--line)] px-7 py-4">
          <div className="flex items-center gap-1">
            <Image
              src="/icons/laurel-left.svg"
              alt=""
              width={22.5}
              height={36}
              className="h-[36px] w-auto"
              aria-hidden="true"
            />
            <p className="text-center text-[15px] font-medium leading-[1.15] text-[var(--fg)]">
              Guest
              <br />
              favourite
            </p>
            <Image
              src="/icons/laurel-left.svg"
              alt=""
              width={22.5}
              height={36}
              className="h-[36px] w-auto scale-x-[-1]"
              aria-hidden="true"
            />
          </div>

          <p className="flex-1 text-[14px] font-normal leading-[1.3] text-[var(--fg)]">
            One of the most loved homes on Airbnb, according to guests
          </p>

          <div className="flex items-center gap-5.5">
            <div className="flex flex-col items-center justify-start gap-1 leading-[1.3]">
              <span className="text-[20px] font-semibold leading-none text-[var(--fg)]">
                {rating.overall}
              </span>
              <span className="flex items-center gap-0.5 text-[var(--fg)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="start" className="h-2.5 w-2.5 shrink-0" />
                ))}
              </span>
            </div>
            <div className="h-10 w-px bg-[var(--line)]" aria-hidden="true" />
            <div className="flex flex-col items-center justify-start gap-1 leading-[1.3]">
              <span className="text-[20px] font-semibold leading-none text-[var(--fg)]">
                {rating.count}
              </span>
              <span className="text-[13px] font-medium text-[var(--fg)]">
                Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-4 border-b border-[var(--border)] py-6.5">
        <Image
          src="/images/host.jpeg"
          alt={`${host.name} avatar`}
          width={46}
          height={46}
          className="h-[46px] w-[46px] shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-[16px] font-medium leading-[20px] text-[var(--fg)]">
            Hosted by {host.name}
          </p>
          <p className="mt-[2px] text-[14px] font-normal leading-[18px] text-[var(--fg-secondary)]">
            {pluralize(host.yearsHosting, "year")} hosting
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6 border-b border-[var(--border)] py-6">
        {highlights.map((highlight) => {
          const iconName = HIGHLIGHT_ICONS[highlight.icon];
          return (
            <div key={highlight.title} className="flex items-start gap-6">
              {iconName ? (
                <span className="text-[var(--fg)]">
                  <Icon name={iconName} className="h-6 w-6 shrink-0" />
                </span>
              ) : null}
              <div>
                <p className="text-[14px] font-medium leading-[20px] text-[var(--fg)]">
                  {highlight.title}
                </p>
                <p className="mt-[2px] text-[14px] font-normal leading-[18px] text-[var(--fg-secondary)]">
                  {highlight.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="pt-6">
        <div className="rounded-xl bg-[var(--bg-subtle)] px-[18px] py-4">
          <p className="text-[14px] font-normal text-[var(--fg)]">
            Some info has been automatically translated.{" "}
            <button
              type="button"
              className="rounded text-[14px] font-medium text-[var(--fg)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              Show original
            </button>
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] pb-6 pt-6">
        <p
          className={`whitespace-pre-line text-[16px] font-normal leading-[24px] text-[var(--fg)] ${
            expanded
              ? ""
              : "max-h-[96px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_62%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_62%,transparent)]"
          }`}
        >
          {description}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-[14px] flex items-center gap-1.5 rounded text-[16px] font-medium text-[var(--fg)] underline underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          {expanded ? "Show less" : "Show more"}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>
    </div>
  );
}
