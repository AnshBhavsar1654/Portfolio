import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// Timeline ledger on frosted glass: one panel per role (glass keeps the
// ledger readable over the halftone print, since panels get no halo veil).
// The mono period column is sticky on wide screens so it stays a ledger
// reference while the row scrolls inside its panel; location carries a map
// pin. A hairline rail with a node dot per role runs down the content
// column — accent + glow ring for the present role. Role leads the headline;
// the org sits on its own line in the accent serif, linked to its LinkedIn
// (url comes from content). Bullets keep their dash markers and number
// emphasis; tags read as a mono footnote cloud, not pill chips (chips are
// the Projects treatment).

const NUMBER = /((?<![A-Za-z])\d+(?:[.,]\d+)*\+?%?(?![A-Za-z]))/g;

function withNumbers(text: string) {
  return text.split(NUMBER).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-strong font-semibold tabular-nums">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function Org({ org, url }: { org: string; url?: string }) {
  if (!url) return org;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/lnk hover:text-accent-hover inline-flex items-baseline gap-1 underline-offset-4 transition-colors duration-(--dur-base) hover:underline"
    >
      {org}
      <ArrowUpRight
        aria-hidden
        size={16}
        weight="bold"
        className="transition-transform duration-(--dur-base) group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5"
      />
    </a>
  );
}

export function ExperienceList() {
  return (
    <ol className="grid gap-4">
      {experience.map((e) => {
        const current = /present/i.test(e.period);
        return (
          <li
            key={`${e.org}-${e.role}`}
            className={cn(
              "glass rounded-[var(--radius-panel)] border p-6 transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99] md:p-8",
              current
                ? "border-accent/40"
                : "border-line hover:border-accent/40"
            )}
          >
            <div className="grid gap-x-10 gap-y-6 md:grid-cols-[10rem_1fr] lg:gap-x-12">
              <div className="font-mono text-xs tabular-nums md:sticky md:top-32 md:self-start">
                <p
                  className={cn(
                    "whitespace-nowrap",
                    current ? "text-accent" : "text-body"
                  )}
                >
                  {e.period}
                </p>
                <p className="text-muted mt-2 inline-flex items-center gap-1.5">
                  <MapPin aria-hidden size={12} weight="fill" />
                  {e.location}
                </p>
                {current ? (
                  <p className="text-accent mt-4 flex items-center gap-2 text-[10px] tracking-(--tracking-eyebrow) uppercase">
                    <span
                      aria-hidden
                      className="bg-accent h-1.5 w-1.5 rounded-full"
                    />
                    Now
                  </p>
                ) : null}
              </div>
              <div className="border-line relative md:border-l md:pl-10">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[0.6rem] -left-[5.5px] h-2.5 w-2.5 rounded-full",
                    current
                      ? "bg-accent ring-accent-wash ring-4"
                      : "border-line bg-surface-2 border"
                  )}
                />
                <h3 className="text-strong text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
                  {e.role}
                  <span className="accent-serif text-accent mt-1.5 block text-[1.05em]">
                    <Org org={e.org} url={e.url} />
                  </span>
                </h3>
                <ul className="text-body mt-7 grid max-w-[72ch] gap-x-10 gap-y-3 text-[15px] leading-relaxed sm:grid-cols-2">
                  {e.bullets.map((b) => (
                    <li
                      key={b}
                      className="before:bg-accent relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-2.5"
                    >
                      {withNumbers(b)}
                    </li>
                  ))}
                </ul>
                <ul className="text-muted mt-7 flex flex-wrap gap-y-2 font-mono text-[11px]">
                  {e.tags.map((t, ti) => (
                    <li
                      key={t}
                      className={cn(
                        ti < e.tags.length - 1 &&
                          "after:mx-2.5 after:content-['·']"
                      )}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
