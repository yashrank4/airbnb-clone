import type { Metadata } from "next";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import "./globals.css";

// Airbnb Cereal is loaded via a raw @font-face in globals.css (self-hosted from
// /public/fonts). No next/font wiring — the family is referenced by name.

export const metadata: Metadata = {
  title: "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10 - Airbnb",
  description:
    "Entire serviced apartment in Candolim, India. Private jacuzzi 1BHK stay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* Header is full-bleed (full width, gutter-only inner padding). */}
        <Header />
        {/* Sticky secondary nav — hidden at top, slides down on scroll past
            the hero grid (fixed top-0 z-50, self-managed visibility). */}
        <SubNav />
        {/* Page content lives in the centered content column so individual
            sections don't each repeat the max-width + gutter padding. */}
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--gutter)]">
          {children}
        </div>
        {/* Full-bleed footer lives outside the content column. */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
