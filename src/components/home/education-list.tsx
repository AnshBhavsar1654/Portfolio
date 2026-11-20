import { education } from "@/content/experience";
import { cn } from "@/lib/cn";

// Quiet ledger: hairline-ruled rows inside one glass panel (the panel keeps
// the small mono text readable over the halftone print). Each row is
// three columns on wide screens: period and place in mono on the left, the
// school, degree, optional description and focus line in the middle, scores
// set large in the accent serif on the right edge. The first entry (the
// degree) leads in strong ink; the school is muted so the page reads in
// order of recency. Below md the columns stack: meta, text, then scores.

export function EducationList() {
  return (
    <ol className="glass border-line rounded-[var(--radius-panel)] border px-6 md:px-10">
      {education.map((s, i) => {
        const lead = i === 0;
        return (
          <li
            key={s.school}
            className="border-line grid gap-x-10 gap-y-5 border-t py-8 first:border-t-0 md:grid-cols-[11rem_1fr_auto] md:py-10"
          >
            <p className="text-muted font-mono text-xs leading-relaxed tabular-nums">
              {s.period}
              <span className="mt-1 block">{s.location}</span>
            </p>
            <div>
              <h3
                className={cn(
                  "text-3xl font-semibold tracking-tight md:text-4xl",
                  lead ? "text-strong" : "text-muted"
                )}
              >
                {s.school}
              </h3>
              <p className="text-body mt-2 text-base md:text-lg">{s.degree}</p>
              {s.description ? (
                <p className="text-body mt-4 max-w-[62ch] text-[15px] leading-relaxed">
                  {s.description}
                </p>
              ) : null}
              <ul className="text-muted mt-5 flex flex-wrap gap-y-2 font-mono text-[11px]">
                {s.focus.map((f, fi) => (
                  <li
                    key={f}
                    className={cn(
                      fi < s.focus.length - 1 &&
                        "after:mx-2.5 after:content-['·']"
                    )}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="flex gap-x-8 md:justify-end md:text-right">
              {s.scores.map((sc) => (
                <div key={sc.label}>
                  <dd
                    className={cn(
                      "accent-serif text-accent leading-none",
                      lead ? "text-6xl md:text-7xl" : "text-5xl md:text-6xl"
                    )}
                  >
                    {sc.value}
                  </dd>
                  <dt className="text-muted mt-2 font-mono text-[11px]">
                    {sc.label}
                  </dt>
                </div>
              ))}
            </dl>
          </li>
        );
      })}
    </ol>
  );
}
