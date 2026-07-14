import Image from "next/image";
import { listing } from "@/data/loadListing";

// "Where you'll sleep" — a titled section rendering each sleeping area as a
// card: rounded photo on top, label + bed detail beneath. Two areas (Bedroom,
// Living room) sit side by side on the left content column.
export default function WhereYoullSleep() {
  const { sleeping } = listing;

  return (
    <section
      id="sleeping"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
        Where you&rsquo;ll sleep
      </h2>

      <ul className="mt-6 grid grid-cols-2 gap-4">
        {sleeping.map((area) => (
          <li key={area.label} className="flex flex-col">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
              <Image
                src={area.img}
                alt={area.label}
                fill
                sizes="(min-width: 1128px) 340px, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[16px] font-medium leading-[20px] text-[var(--fg)]">
              {area.label}
            </p>
            <p className="mt-0.5 text-[15px] font-normal leading-[19px] text-[var(--fg-secondary)]">
              {area.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
