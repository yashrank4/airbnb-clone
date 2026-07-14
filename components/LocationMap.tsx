import { listing } from "@/data/loadListing";
import Icon from "@/components/Icon";

export default function LocationMap() {
  const { location, neighbourhood } = listing;

  return (
    <section
      id="location"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
        Where you&rsquo;ll be
      </h2>
      <p className="mb-6 mt-2 text-[16px] font-medium text-[var(--fg)]">
        {location}
      </p>

      <div
        className="relative h-[480px] w-full overflow-hidden rounded-xl bg-[#e8eef0]"
        role="img"
        aria-label={`Map of ${location}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(circle at 30% 40%, #cfe3c8 0 6%, transparent 6%)",
              "radial-gradient(circle at 70% 60%, #cfe3c8 0 8%, transparent 8%)",
              "linear-gradient(115deg, #acd3e6 0 34%, #e9f0e4 34% 100%)",
            ].join(", "),
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <button
          type="button"
          aria-label="Search"
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--fg)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          <Icon name="search" className="h-4 w-4" />
        </button>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[var(--fg)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <Icon name="plut" className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[var(--fg)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--fg)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <Icon name="home" className="h-[26px] w-[26px]" />
        </div>
      </div>

      <p className="mt-[18px] text-[14px] font-normal text-[var(--fg)]">
        Exact location will be provided after booking.
      </p>

      <div className="mt-10">
        <h3 className="text-[18px] font-medium leading-[22px] text-[var(--fg)]">
          Neighbourhood highlights
        </h3>
        <p className="mt-3 max-w-[640px] text-[15px] font-normal leading-[1.5] text-[var(--fg)]">
          {neighbourhood}
        </p>
        <button
          type="button"
          className="mt-[18px] flex items-center gap-1.5 rounded text-[16px] font-medium text-[var(--fg)] underline underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
        >
          Show more
          <Icon name="chev-right" className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>
    </section>
  );
}
