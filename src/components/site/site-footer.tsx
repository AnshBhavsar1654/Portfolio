import Link from "next/link";
import { profile } from "@/content/profile";

const LINKS = [
  { label: "GitHub", href: profile.socials.github },
  { label: "LinkedIn", href: profile.socials.linkedin },
  { label: "Instagram", href: profile.socials.instagram },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-muted text-sm">
          <span className="text-strong font-medium">{profile.name}</span>
          <span className="ml-3">&copy; {year}</span>
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          <Link className="text-muted hover:text-strong" href="/resume">
            Resume
          </Link>
          {LINKS.map((l) => (
            <a
              key={l.label}
              className="text-muted hover:text-strong"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
          <a
            className="text-muted hover:text-strong"
            href={`mailto:${profile.email}`}
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
