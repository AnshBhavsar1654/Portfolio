import type { Education } from "@/content/experience";
import { education } from "@/content/experience";
import { cn } from "@/lib/cn";

// Scorecard pair: the degree leads as a wide panel, school-level results sit
// in a compact side panel. Headline figures are set large in the accent
// serif; the rest is a short "focus" line instead of a run-on sentence.
// The bottom line (period + location) is pinned to the panel's floor via
// mt-auto so both cards align.

function Card({
  s,
  hero,
  index,
}: {
  s: Education;
  hero: boolean;
  index: number;
}) {
  return (
    <article
      className={cn(
        "glass border-line flex h-full flex-col rounded-[var(--radius-panel)] border",
        hero ? "p-6 md:p-10" : "p-6 md:p-8"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-muted font-mono text-xs tracking-(--tracking-eyebrow) uppercase">
          {hero ? "Undergraduate" : "School"}
        </p>
        <span
          aria-hidden
          className={cn(
            "accent-serif leading-none",
            hero ? "text-accent text-3xl" : "text-muted text-2xl"
          )}
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3
        className={cn(
          "text-strong mt-5 font-semibold tracking-tight",
          hero ? "text-3xl md:text-5xl" : "text-2xl"
        )}
      >
        {s.school}
      </h3>
      <p
        className={cn(
          "text-body mt-2",
          hero ? "text-base md:text-lg" : "text-sm"
        )}
      >
        {s.degree}
      </p>
      <dl
        className={cn(
          "flex flex-wrap",
          hero ? "mt-10 gap-x-10 gap-y-4" : "mt-7 gap-x-6 gap-y-4"
        )}
      >
        {s.scores.map((sc) => (
          <div key={sc.label}>
            <dd
              className={cn(
                "accent-serif text-accent leading-none",
                hero ? "text-6xl md:text-7xl" : "text-4xl"
              )}
            >
              {sc.value}
            </dd>
            <dt
              className={cn(
                "text-muted mt-2 font-mono uppercase",
                hero ? "text-[11px]" : "text-[10px]"
              )}
            >
              {sc.label}
            </dt>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-8">
        <p className="text-muted mb-2 font-mono text-[11px] tracking-(--tracking-eyebrow) uppercase">
          Focus
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {s.focus.map((f) => (
            <li
              key={f}
              className={cn(
                "border-line text-body rounded-full border",
                hero
                  ? "px-3 py-1 text-[13px]"
                  : "border-line px-2.5 py-0.5 font-mono text-[11px]"
              )}
            >
              {f}
            </li>
          ))}
        </ul>
        <p className="text-muted mt-7 flex flex-wrap gap-x-6 font-mono text-xs tabular-nums">
          <span>{s.period}</span>
          <span>{s.location}</span>
        </p>
      </div>
    </article>
  );
}

export function EducationList() {
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {education.map((s, i) => (
        <li key={s.school} className={cn(i === 0 && "lg:col-span-2")}>
          <Card s={s} hero={i === 0} index={i + 1} />
        </li>
      ))}
    </ul>
  );
}
