"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { listing } from "@/data/loadListing";
import Icon from "@/components/Icon";

// Scroll past the hero photo grid (header 67px + ~24px title block + 430px
// grid + margin) before the sub-nav is allowed to appear.
const SCROLL_THRESHOLD = 520;

const SECTIONS = [
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
] as const;

function ReserveButton({ tabIndex }: { tabIndex: number }) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      className="h-10 shrink-0 rounded-full border-none px-5 text-[14px] font-medium text-white transition-[filter,transform] duration-150 ease-out hover:brightness-95 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
      style={{ background: "var(--reserve)" }}
    >
      Reserve
    </button>
  );
}

export default function SubNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const tickingRef = useRef(false);

  // Show/hide on scroll position.
  useEffect(() => {
    function handleScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > SCROLL_THRESHOLD);
        tickingRef.current = false;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: whichever existing section anchor is closest to the top of
  // the viewport becomes active. No-ops gracefully for missing anchors.
  useEffect(() => {
    const targets = SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const topMost = visibleEntries.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top
            ? entry
            : closest
        );
        setActive(topMost.target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const { price, rating } = listing;

  return (
    <motion.div
      initial={false}
      animate={visible ? "visible" : "hidden"}
      variants={
        prefersReducedMotion
          ? {
              visible: { y: 0, opacity: 1, transition: { duration: 0 } },
              hidden: { y: "-100%", opacity: 0, transition: { duration: 0 } },
            }
          : {
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.22, ease: "easeOut" },
              },
              hidden: {
                y: "-100%",
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              },
            }
      }
      className="fixed top-0 left-0 z-50 h-[66px] w-full border-b border-[var(--border)] bg-[var(--bg)]"
      aria-hidden={!visible}
    >
      <nav
        className="mx-auto flex h-full max-w-[var(--page-max)] items-center justify-between px-[var(--gutter)]"
        aria-label="Listing sections"
      >
        {/* Left — section links */}
        <ul className="flex items-center gap-1">
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  tabIndex={visible ? 0 : -1}
                  aria-current={isActive ? "location" : undefined}
                  className="relative px-2 py-[22px] text-[14px] font-medium text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
                >
                  {section.label}
                  <span
                    className="absolute bottom-3 left-2 right-2 h-0.5 bg-[var(--fg)] transition-opacity duration-200"
                    style={{ opacity: isActive ? 1 : 0 }}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right — price / rating / reserve */}
        <div className="flex items-center gap-5">
          <div className="text-right leading-tight">
            <p>
              <span className="text-[15px] font-medium text-[var(--fg)]">
                {price.raw}
              </span>{" "}
              <span className="text-[13px] font-normal text-[var(--ink)]">
                for {price.nights} nights
              </span>
            </p>
            <p className="flex items-center justify-end gap-1 text-[13px] font-normal text-[var(--fg)]">
              <Icon name="start" className="h-3 w-3 shrink-0" />
              {rating.overall} · {rating.count} reviews
            </p>
          </div>

          <ReserveButton tabIndex={visible ? 0 : -1} />
        </div>
      </nav>
    </motion.div>
  );
}
