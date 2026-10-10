import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { ThemeScript } from "@/components/site/theme-script";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site-url";
import { mono, sans } from "./fonts";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Ansh Bhavsar | LLM Engineer & AI/ML Innovator",
    template: "%s | Ansh Bhavsar",
  },
  description:
    "Ansh Bhavsar builds evaluable LLM systems, RAG pipelines, and full-stack data apps. Nirma CS, Serin AI, IEEE published.",
  openGraph: {
    type: "website",
    title: "Ansh Bhavsar | LLM Engineer",
    description: "Evaluable LLM systems, RAG, and full-stack data apps.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Founding Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressCountry: "IN",
  },
  email: `mailto:${profile.email}`,
  alumniOf: profile.university,
  knowsAbout: ["LLM evaluation", "RAG", "machine translation"],
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
      className={`${sans.variable} ${mono.variable}`}
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
