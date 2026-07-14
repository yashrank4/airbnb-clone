import Image from "next/image";
import { listing } from "@/data/loadListing";
import Icon from "@/components/Icon";

const LETTER_COLORS: Record<string, { bg: string; fg: string }> = {
  S: { bg: "rgb(253, 231, 239)", fg: "rgb(212, 53, 110)" },
  A: { bg: "rgb(231, 240, 253)", fg: "rgb(58, 110, 204)" },
  V: { bg: "rgb(239, 234, 247)", fg: "rgb(139, 111, 196)" },
};

const FALLBACK_COLORS = [
  { bg: "rgb(247, 237, 226)", fg: "rgb(193, 133, 42)" },
  { bg: "rgb(232, 245, 233)", fg: "rgb(56, 142, 60)" },
  { bg: "rgb(239, 234, 247)", fg: "rgb(139, 111, 196)" },
];

function initialColor(name: string) {
  const letter = name.charAt(0).toUpperCase();
  if (LETTER_COLORS[letter]) return LETTER_COLORS[letter];
  return FALLBACK_COLORS[letter.charCodeAt(0) % FALLBACK_COLORS.length];
}

function CoHostAvatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} avatar`}
        width={34}
        height={34}
        className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
      />
    );
  }

  const { bg, fg } = initialColor(name);
  return (
    <div
      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[13px] font-medium"
      style={{ background: bg, color: fg }}
      role="img"
      aria-label={`${name} avatar`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function HostSection() {
  const { host, coHosts } = listing;

  return (
    <section
      id="host"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      <h2 className="text-[22px] font-medium leading-[26px] text-[var(--fg)]">
        Meet your host
      </h2>

      <div className="mt-6 grid grid-cols-[340px_minmax(0,1fr)] items-start gap-x-12">
        <div>
          <div className="grid grid-cols-[1fr_100px] items-center rounded-[20px] border border-[var(--border)] bg-[var(--bg)] px-6 py-[30px] shadow-[var(--shadow-card)]">
            <div className="text-center">
              <div className="relative mx-auto mb-3 h-[88px] w-[88px]">
                <Image
                  src="/images/host.jpeg"
                  alt={`${host.name} avatar`}
                  width={88}
                  height={88}
                  className="h-[88px] w-[88px] rounded-full object-cover"
                />
                {host.superhost ? (
                  <span
                    className="absolute right-0 bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[var(--rausch)] text-white"
                    aria-label="Superhost"
                    role="img"
                  >
                    <Icon name="check-circle" className="h-[15px] w-[15px]" />
                  </span>
                ) : null}
              </div>
              <p className="text-[26px] font-medium leading-[30px] text-[var(--fg)]">
                {host.name}
              </p>
              <p className="mt-1 text-[13px] font-normal text-[var(--fg)]">
                Host
              </p>
            </div>

            <div className="border-l border-[var(--border)] pl-5">
              <div className="py-2.5">
                <p className="text-[20px] font-medium leading-none text-[var(--fg)]">
                  {host.reviews.toLocaleString()}
                </p>
                <p className="mt-1 text-[12px] font-normal text-[var(--fg)]">
                  Reviews
                </p>
              </div>
              <div className="border-t border-[var(--border)] py-2.5">
                <p className="text-[20px] font-medium leading-none text-[var(--fg)]">
                  {host.rating}★
                </p>
                <p className="mt-1 text-[12px] font-normal text-[var(--fg)]">
                  Rating
                </p>
              </div>
              <div className="border-t border-[var(--border)] pt-2.5">
                <p className="text-[20px] font-medium leading-none text-[var(--fg)]">
                  {host.yearsHosting}
                </p>
                <p className="mt-1 text-[12px] font-normal text-[var(--fg)]">
                  Years hosting
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-[22px] flex flex-col gap-3.5">
            {host.bornInThe ? (
              <li className="flex items-center gap-3.5 text-[15px] font-normal text-[var(--fg)]">
                <Icon name="baloon" className="h-6 w-6 shrink-0" />
                Born in the {host.bornInThe}
              </li>
            ) : null}
            {host.school ? (
              <li className="flex items-center gap-3.5 text-[15px] font-normal text-[var(--fg)]">
                <Icon name="grad-hat" className="h-6 w-6 shrink-0" />
                Where I went to school: {host.school}
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          {coHosts.length > 0 ? (
            <div className="mb-[30px]">
              <h3 className="mb-4 text-[18px] font-medium text-[var(--fg)]">
                Co-Hosts
              </h3>
              <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
                {coHosts.map((coHost) => (
                  <li
                    key={coHost.name}
                    className="flex items-center gap-2.5 text-[14px] font-normal text-[var(--fg)]"
                  >
                    <CoHostAvatar
                      name={coHost.name}
                      src={coHost.avatar || undefined}
                    />
                    {coHost.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h3 className="mb-4 text-[18px] font-medium text-[var(--fg)]">
            Host details
          </h3>
          <div className="text-[15px] leading-[1.6] text-[var(--fg)]">
            {host.responseRate != null ? (
              <p>Response rate: {host.responseRate}%</p>
            ) : null}
            {host.responseTime ? <p>{host.responseTime}</p> : null}
          </div>

          <button
            type="button"
            className="mt-[18px] rounded-lg bg-[#f2f2f2] px-6 py-3.5 text-[15px] font-medium text-[var(--fg)] transition-colors hover:bg-[#ebebeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
          >
            Message host
          </button>

          <p className="mt-[30px] flex items-start gap-2.5 text-[12px] font-normal leading-[16px] text-[var(--fg-secondary)]">
            <Icon name="shield" className="mt-0.5 h-6 w-6 shrink-0 text-[var(--fg)]" />
            <span>
              To help protect your payment, always use Airbnb to send money and
              communicate with hosts.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
