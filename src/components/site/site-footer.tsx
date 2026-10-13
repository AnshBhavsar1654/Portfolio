import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { BrandIcon, type BrandName } from "@/components/site/brand-icon";
import { profile } from "@/content/profile";

const LINKS: { label: string; href: string; name: BrandName; tone: string }[] =
  [
    {
      label: "GitHub",
      href: profile.socials.github,
      name: "github",
      tone: "text-brand-github",
    },
    {
      label: "LeetCode",
      href: profile.socials.leetcode,
      name: "leetcode",
      tone: "text-brand-leetcode",
    },
    {
      label: "LinkedIn",
      href: profile.socials.linkedin,
      name: "linkedin",
      tone: "text-brand-linkedin",
    },
    {
      label: "Instagram",
      href: profile.socials.instagram,
      name: "instagram",
      tone: "text-brand-instagram",
    },
    { label: "X", href: profile.socials.x, name: "x", tone: "text-brand-x" },
  ];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-line bg-bg relative z-10 overflow-hidden border-t">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted text-sm">
            <span className="text-strong font-medium">{profile.name}</span>
            <span className="ml-3">&copy; {year} All rights reserved.</span>
            <span className="ml-3">
              Created by{" "}
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-strong hover:text-accent underline underline-offset-4 transition-colors"
              >
                Ansh
              </a>
            </span>
          </p>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          >
            <Link
              className="text-muted hover:text-strong group relative inline-flex items-center gap-1.5"
              href="/resume"
            >
              <FileText aria-hidden size={16} className="text-accent" />
              <RollLabel label="Resume" tone="text-accent" />
            </Link>
            {LINKS.map(({ label, href, name, tone }) => (
              <a
                key={label}
                className="text-muted hover:text-strong group relative inline-flex items-center gap-1.5"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon name={name} size={16} className={tone} />
                <RollLabel label={label} tone={tone} />
              </a>
            ))}
            <a
              className="text-muted hover:text-strong group relative inline-flex items-center gap-1.5"
              href={`mailto:${profile.email}`}
            >
              <EnvelopeSimple
                aria-hidden
                size={16}
                className="text-brand-gmail"
              />
              <RollLabel label="Email" tone="text-brand-gmail" />
            </a>
          </nav>
        </div>
        <p className="text-muted mt-6 text-sm">
          {profile.edits.label} on{" "}
          <a
            className="hover:text-strong underline underline-offset-4"
            href={profile.edits.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{" "}
          &middot;{" "}
          <a
            className="hover:text-strong underline underline-offset-4"
            href={profile.edits.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
        </p>
      </div>
      <p
        aria-hidden
        className="accent-serif text-strong/10 -mb-[0.18em] pt-8 text-center text-[clamp(4rem,17vw,16rem)] leading-[0.85] whitespace-nowrap select-none"
      >
        {profile.name}
      </p>
    </footer>
  );
}

// In-place label roll: the same text rises out in muted and back in wearing
// the app's colour. Transform-only, so it stays cheap; the folio duration
// token collapses to zero under reduced motion.
function RollLabel({ label, tone }: { label: string; tone: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-(--dur-base) group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 block translate-y-full transition-transform duration-(--dur-base) group-hover:translate-y-0 group-focus-visible:translate-y-0 ${tone}`}
      >
        {label}
      </span>
    </span>
  );
}
