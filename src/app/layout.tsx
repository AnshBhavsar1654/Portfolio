import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { ThemeScript } from "@/components/site/theme-script";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site-url";
import { mono, sans, serif } from "./fonts";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Ansh Bhavsar | Founding Engineer & Full-Stack Developer",
    template: "%s | Ansh Bhavsar",
  },
  description:
    "Ansh Bhavsar builds full-stack products, AI agents, and evaluable LLM systems. Nirma CS, Serin AI founding engineer.",
  openGraph: {
    type: "website",
    url: siteUrl.origin,
    title: "Ansh Bhavsar | Founding Engineer",
    description: "Full-stack products, AI agents, and evaluable LLM systems.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.website,
  jobTitle: "Founding Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressCountry: "IN",
  },
  email: `mailto:${profile.email}`,
  alumniOf: profile.university,
  knowsAbout: [
    "full-stack development",
    "AI agents",
    "LLM evaluation",
    "RAG",
    "machine translation",
  ],
  sameAs: [profile.socials.github, profile.socials.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-bg text-body font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#main"
          className="focus:bg-accent focus:text-on-accent sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-full focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
