"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { listing } from "@/data/loadListing";
import type { RatingCategories } from "@/types/listing";
import Icon, { type IconName } from "@/components/Icon";

// Rating breakdown rows — data key on rating.categories, display label, icon.
const CATEGORY_ROWS: {
  key: keyof RatingCategories;
  label: string;
  icon: IconName;
}[] = [
  { key: "cleanliness", label: "Cleanliness", icon: "spray-bottle" },
  { key: "accuracy", label: "Accuracy", icon: "check-circle" },
  { key: "checkin", label: "Check-in", icon: "key" },
  { key: "communication", label: "Communication", icon: "message" },
  { key: "location", label: "Location", icon: "map" },
  { key: "value", label: "Value", icon: "tag" },
];

const AVATAR_PALETTE = [
  ["bg-green-100", "text-green-600"],
  ["bg-red-100", "text-red-600"],
  ["bg-blue-100", "text-blue-600"],
  ["bg-yellow-100", "text-yellow-700"],
  ["bg-purple-100", "text-purple-600"],
  ["bg-pink-100", "text-pink-600"],
  ["bg-teal-100", "text-teal-600"],
  ["bg-orange-100", "text-orange-600"],
  ["bg-cyan-100", "text-cyan-600"],
  ["bg-emerald-100", "text-emerald-600"],
  ["bg-lime-100", "text-lime-600"],
  ["bg-rose-100", "text-rose-600"],
] as const;

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} avatar`}
        width={42}
        height={42}
        className="h-[42px] w-[42px] shrink-0 rounded-full object-cover"
      />
    );
  }

  const [bgColor, textColor] = colorForName(name);

  return (
    <div
      className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${bgColor} ${textColor} text-[17px] font-medium`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[var(--fg)]">
      {Array.from({ length: count }).map((_, index) => (
        <Icon key={index} name="start" className="h-2.5 w-2.5 shrink-0" />
      ))}
    </span>
  );
}

function ReviewBody({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);

  return (
    <div>
      <p
        ref={ref}
        className={`mt-2 whitespace-pre-line text-[16px] font-normal leading-[24px] text-[var(--fg)] ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 rounded text-[15px] font-medium text-[var(--fg)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

export default function Reviews() {
  const { rating, reviews, reviewTags } = listing;
  const categories = rating.categories;

  // Distribution bars for the "Overall rating" column (5 → 1). The reference
  // shows an almost-entirely-5-star listing, so we weight it heavily to 5.
  const distribution = [
    { star: 5, fill: 1 },
    { star: 4, fill: 0.04 },
    { star: 3, fill: 0 },
    { star: 2, fill: 0 },
    { star: 1, fill: 0 },
  ];

  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      {/* Guest favourite banner — big rating flanked by laurel wreaths. */}
      <div className="flex flex-col items-center py-6 text-center">
        <div className="flex items-end justify-center gap-2">
          <Image
            src="/images/laurel-left.png"
            alt=""
            width={40}
            height={64}
            className="h-[110px] w-auto"
            aria-hidden="true"
          />
          <span className="text-[100px] font-semibold leading-none text-[var(--fg)]">
            {rating.overall}
          </span>
          <Image
            src="/images/laurel-right.png"
            alt=""
            width={40}
            height={64}
            className="h-[110px] w-auto"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 text-[24px] font-semibold leading-[28px] text-[var(--fg)]">
          Guest favourite
        </p>
        <p className="mt-2 max-w-[420px] text-[15px] font-normal leading-[20px] text-[var(--fg-secondary)]">
          This home is a guest favourite based on ratings, reviews and
          reliability
        </p>
        <button
          type="button"
          className="mt-3 rounded text-[14px] font-semibold text-[var(--fg)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          How reviews work
        </button>
      </div>

      {/* Overall rating + category breakdown */}
      <div className="mt-6 grid grid-cols-[1.4fr_repeat(6,1fr)] divide-x divide-[var(--border)]">
 
        {/* Overall rating with distribution bars */}
        <div className="px-6">
          <p className="mb-3 text-[14px] font-medium leading-[18px] text-[var(--fg)]">
            Overall rating
          </p>
          <div className="space-y-2">
            {distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-2">
                <span className="w-2 text-[12px] leading-none text-[var(--fg)]">
                  {row.star}
                </span>
                <span className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--fg)]"
                    style={{ width: `${row.fill * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Six category columns — label + score at top, icon below. */}
        {CATEGORY_ROWS.map(({ key, label, icon }) => (
          <div key={label} className="flex flex-col px-6">
            <p className="pb-3 text-[14px] font-medium leading-[18px] text-[var(--fg)]">
              {label}
            </p>
            <p className="pb-2 text-[16px] font-semibold text-[var(--fg)]">
              {categories[key].toFixed(1)}
            </p>
            <span className="text-[var(--fg)]">
              <Icon name={icon} className="h-8 w-8" />
            </span>
          </div>
        ))}
      </div>

      {/* Review keyword chips — a single row that scrolls horizontally. Each is
          a rounded card: icon + keyword + mention count. */}
      <div className="mt-10 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviewTags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            aria-label={`${tag.label}, ${tag.count} mentions`}
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-[15px] font-normal text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <img
              src={tag.image}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
            />
            {tag.label}
            <span className="text-[var(--fg-secondary)]">{tag.count}</span>
          </button>
        ))}
   
      </div>

      {/* Review cards — two columns */}
      <div className="mt-10 grid grid-cols-2 gap-x-20 gap-y-12">
        {reviews.map((review) => (
          <article key={`${review.name}-${review.date}`}>
            <div className="flex items-center gap-3">
              <Avatar name={review.name} src={review.avatar || undefined} />
              <div>
                <p className="text-[15px] font-medium leading-[19px] text-[var(--fg)]">
                  {review.name}
                </p>
                <p className="text-[14px] font-normal leading-[18px] text-[var(--fg-secondary)]">
                  {review.timeOnAirbnb}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Stars count={review.stars} />
              <span className="text-[13px] text-[var(--fg)]">·</span>
              <span className="text-[13px] font-normal text-[var(--fg-secondary)]">
                {review.date}
              </span>
            </div>
            <ReviewBody text={review.text} />
          </article>
        ))}
      </div>

      <button
        type="button"
        className="mt-10 rounded-lg border border-[var(--fg)] px-6 py-3.5 text-[16px] font-medium text-[var(--fg)] transition-all duration-200 ease-in-out hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)] active:scale-95"
        style={{
          transition: "background-color 0.18s, color 0.18s, border-color 0.18s, transform 0.13s"
        }}
      >
        Show all {rating.count} reviews
      </button>
 
 
    </section>
  );
}
