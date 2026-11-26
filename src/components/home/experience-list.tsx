import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { Timeline } from "@/components/ui/timeline";
import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

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
    <Timeline
      data={experience.map((e) => ({
        title: e.period,
        content: (
          <article className="bg-surface border-line rounded-(--radius-panel) border p-(--space-4) sm:p-(--space-5) md:p-(--space-6)">
            <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
              <h3 className="text-strong text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
                {e.role}
                <span className="accent-serif text-accent mt-1.5 block">
                  <Org org={e.org} url={e.url} />
                </span>
              </h3>
              <p className="text-muted font-mono text-xs tabular-nums md:text-right">
                <span className="flex items-center gap-1.5 md:justify-end">
                  <MapPin aria-hidden size={12} weight="fill" />
                  {e.location}
                </span>
              </p>
            </div>
            <ul className="text-body mt-8 grid max-w-(--measure-body) gap-3 text-(length:--text-body-m) leading-(--leading-body)">
              {e.bullets.map((b) => (
                <li
                  key={b}
                  className="before:bg-accent relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                >
                  {withNumbers(b)}
                </li>
              ))}
            </ul>
            <ul className="text-muted mt-8 flex flex-wrap gap-y-2 font-mono text-(length:--text-caption-s)">
              {e.tags.map((t, ti) => (
                <li
                  key={t}
                  className={cn(
                    ti < e.tags.length - 1 && "after:mx-2.5 after:content-['·']"
                  )}
                >
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ),
      }))}
    />
  );
}
