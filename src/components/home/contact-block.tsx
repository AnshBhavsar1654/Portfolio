import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ContactForm } from "@/components/home/contact-form";
import { CopyEmail } from "@/components/home/copy-email";
import { profile } from "@/content/profile";

const LINKS = [
  { label: "GitHub", href: profile.socials.github },
  { label: "LinkedIn", href: profile.socials.linkedin },
  { label: "Instagram", href: profile.socials.instagram },
];

// Shared by the home page and /contact so the two never drift.
export function ContactBlock() {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <CopyEmail />
        <ul className="mt-10 space-y-1">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body hover:text-accent group border-line flex items-center justify-between border-b py-3 text-[15px] transition-colors"
              >
                {l.label}
                <ArrowUpRight
                  aria-hidden
                  size={16}
                  className="text-muted transition-transform duration-(--dur-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-6">
        <ContactForm />
      </div>
    </div>
  );
}
