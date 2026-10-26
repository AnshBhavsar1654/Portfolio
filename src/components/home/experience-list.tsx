import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// Career ledger on frosted glass: one panel per role (glass keeps text
// readable over the halftone backdrop). Compared to the old timeline, the
// dot rail and floating period chips are gone — period + location lead as a
// mono ledger column, the org name is the headline and the serif index sits
// in the corner like a scorecard. Nothing hidden behind a click: every
// bullet is always visible. Numbers inside bullets (500+, 95%, 60%) are
// picked out so results scan fast. Tags read as ledger footnotes: a mono
// line, not pill chips (chips are the Work treatment).

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

export function ExperienceList() {
  return (
    <ol className="grid gap-4">
      {experience.map((e, i) => {
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
            <div className="grid gap-x-12 gap-y-6 md:grid-cols-[10rem_1fr]">
              <div className="font-mono text-xs tabular-nums">
                <p
                  className={cn(
                    "whitespace-nowrap",
                    current ? "text-accent" : "text-body"
                  )}
                >
                  {e.period}
                </p>
                <p className="text-muted mt-2">{e.location}</p>
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
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-strong hover:text-accent text-3xl font-semibold tracking-tight transition-colors duration-(--dur-base) md:text-4xl">
                    {e.org}
                  </h3>
                  <span
                    aria-hidden
                    className={cn(
                      "accent-serif text-3xl leading-none",
                      current ? "text-accent" : "text-muted"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-muted mt-2 text-sm">{e.role}</p>
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
                  {e.tags.map((t) => (
                    <li
                      key={t}
                      className="after:mx-2.5 after:content-['·'] last:after:content-none"
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
