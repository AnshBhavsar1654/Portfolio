import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ContactForm } from "@/components/home/contact-form";
import { CopyEmail } from "@/components/home/copy-email";
import { GitHubActivity } from "@/components/home/github-activity";
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

// Shared by the home page and /contact so the two never drift.
export function ContactBlock() {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="glass border-line rounded-[var(--radius-panel)] border p-8 lg:col-span-6">
        <CopyEmail />
        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {LINKS.map(({ label, href, name, tone }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="block transition-transform duration-(--dur-base) hover:-translate-y-0.5 active:scale-95"
              >
                <BrandIcon name={name} size={24} className={tone} />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-10 text-sm">{profile.edits.label}</p>
        <ul className="mt-3 space-y-1">
          <LinkRow
            label="Instagram"
            href={profile.edits.instagram}
            handle={profile.edits.instagramHandle}
            name="instagram"
            iconTone="text-brand-instagram"
          />
          <LinkRow
            label="YouTube"
            href={profile.edits.youtube}
            handle={profile.edits.youtubeHandle}
            name="youtube"
            iconTone="text-brand-youtube"
          />
        </ul>
      </div>
      <div className="lg:col-span-6">
        <ContactForm />
      </div>
      <div className="lg:col-span-12">
        <GitHubActivity />
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  handle,
  name,
  iconTone,
}: {
  label: string;
  href: string;
  handle?: string;
  name?: BrandName;
  iconTone?: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body hover:text-accent group border-line flex items-center justify-between border-b py-3 text-[15px] transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          {name ? (
            <BrandIcon name={name} size={16} className={iconTone} />
          ) : null}
          <span>
            {label}
            {handle ? <span className="text-muted ml-2">{handle}</span> : null}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          size={16}
          className="text-muted transition-transform duration-(--dur-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </li>
  );
}
