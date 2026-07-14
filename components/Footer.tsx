import Icon from "@/components/Icon";

// Footer link columns — standard Airbnb groupings. The reference capture ends
// before the footer, so these mirror the live site's canonical structure.
const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Support",
    links: [
      "Help Centre",
      "AirCover",
      "Anti-discrimination",
      "Disability support",
      "Cancellation options",
      "Report neighbourhood concern",
    ],
  },
  {
    title: "Hosting",
    links: [
      "Airbnb your home",
      "AirCover for Hosts",
      "Hosting resources",
      "Community forum",
      "Hosting responsibly",
    ],
  },
  {
    title: "Airbnb",
    links: [
      "Newsroom",
      "New features",
      "Careers",
      "Investors",
      "Gift cards",
      "Airbnb.org emergency stays",
    ],
  },
];

const LEGAL_LINKS = ["Privacy", "Terms", "Sitemap", "Company details"];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)] py-12">
        <div className="grid grid-cols-3 gap-x-12 border-b border-[var(--border)] pb-8">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[14px] font-medium text-[var(--fg)]">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="rounded text-[14px] font-normal text-[var(--fg)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-6 text-[14px] font-normal text-[var(--fg)]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© 2026 Airbnb, Inc.</span>
            {LEGAL_LINKS.map((link) => (
              <span key={link} className="flex items-center gap-2">
                <span aria-hidden="true">·</span>
                <a
                  href="#"
                  className="rounded underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
                >
                  {link}
                </a>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="flex items-center gap-2 rounded font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              <Icon name="globe" className="h-4 w-4" />
              English (IN)
            </button>
            <button
              type="button"
              className="rounded font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
            >
              ₹ INR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
