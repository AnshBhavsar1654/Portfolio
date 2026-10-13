import { experience } from "@/content/experience";
import { cn } from "@/lib/cn";

// A career timeline. A rail runs down the left with one dot per role; the
// period sits beside it and each role is a card with every bullet visible
// (nothing hidden behind a click). The current role gets the accent.
// Numbers inside bullets (500+, 95%, 60%) are picked out so results scan fast.

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
    <ol className="relative">
      <span
        aria-hidden
        className="bg-line absolute top-2 bottom-2 left-[0.4375rem] w-px md:left-[11.5rem]"
      />
      {experience.map((e) => {
        const current = /present/i.test(e.period);
        return (
          <li
            key={`${e.org}-${e.role}`}
            className="relative grid gap-x-12 pb-10 pl-8 last:pb-0 md:grid-cols-[10rem_1fr] md:pl-0"
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-2 left-0 h-3.5 w-3.5 rounded-full border-2 md:left-[11.0625rem]",
                current
                  ? "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-wash)]"
                  : "border-line bg-bg"
              )}
            />
            <div className="md:pt-1 md:text-right">
              <div className="glass border-line text-body inline-block rounded-xl border px-3 py-2 font-mono text-xs tabular-nums">
                <p
                  className={cn("whitespace-nowrap", current && "text-accent")}
                >
                  {e.period}
                </p>
                <p className="mt-1">{e.location}</p>
              </div>
            </div>
            <article
              className={cn(
                "mt-3 rounded-[var(--radius-panel)] border p-6 transition-colors duration-(--dur-base) md:mt-0 md:p-8",
                current
                  ? "border-accent/50 glass bg-accent-wash"
                  : "border-line glass hover:border-accent/40"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-strong text-2xl font-semibold tracking-tight md:text-3xl">
                    {e.org}
                  </h3>
                  <p className="text-muted mt-1 text-sm">{e.role}</p>
                </div>
                {current ? (
                  <span className="bg-accent text-on-accent rounded-full px-3 py-1 font-mono text-[10px] uppercase">
                    Now
                  </span>
                ) : null}
              </div>
              <ul className="text-body mt-6 space-y-3 text-[15px] leading-relaxed">
                {e.bullets.map((b) => (
                  <li
                    key={b}
                    className="before:bg-accent relative max-w-[68ch] pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                  >
                    {withNumbers(b)}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <li
                    key={t}
                    className="border-line text-muted rounded-full border px-3 py-1 font-mono text-[11px]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
