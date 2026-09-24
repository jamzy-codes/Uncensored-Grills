import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_FORMSPREE_RECAPTCHA_SITE_KEY || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://uncensoredgrills.vercel.app"),
  title: {
    default: "Uncensored Grills — Unfiltered Conversations with Web3 Builders",
    template: "%s | Uncensored Grills",
  },
  description:
    "The place where the people shaping Web3 and internet culture come to talk, discover, debate, and connect. Hosted by Dipo.",
  keywords: [
    "Web3 podcast",
    "crypto podcast",
    "Web3 founders interview",
    "Dipo",
    "Uncensored Grills",
    "blockchain interviews",
    "Web3 builders",
  ],
  authors: [{ name: "Dipo", url: "https://x.com/0xDipo" }],
  creator: "Dipo",
  openGraph: {
    type: "website",
    url: "https://uncensoredgrills.vercel.app",
    title: "Uncensored Grills — Unfiltered Conversations with Web3 Builders",
    description:
      "The place where the people shaping Web3 and internet culture come to talk, discover, debate, and connect.",
    siteName: "Uncensored Grills",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Uncensored Grills — Web3 human intelligence show",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uncensored Grills — Unfiltered Conversations with Web3 Builders",
    description:
      "The place where the people shaping Web3 and internet culture come to talk, discover, debate, and connect.",
    site: "@the_grillers",
    creator: "@0xDipo",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://uncensoredgrills.vercel.app",
  },
};

const podcastSchema = {
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  name: "Uncensored Grills",
  description:
    "The place where the people shaping Web3 and internet culture come to talk, discover, debate, and connect.",
  url: "https://uncensoredgrills.vercel.app",
  sameAs: [
    "https://x.com/the_grillers",
    "https://youtube.com/@uncensoredgrill",
  ],
  author: {
    "@type": "Person",
    name: "Dipo",
    sameAs: "https://x.com/0xDipo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
        />
      </head>
      <body>
        {RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}
        {children}
        <Analytics />
      </body>
    </html>
  );
}



