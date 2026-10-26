import { skillGroups } from "@/content/skills";

// Tool index on frosted glass: one panel per group, echoing the experience
// ledger (glass keeps text readable over the halftone backdrop). Hovering a
// group lights its index and skill dots in accent — the highlight is
// hover-driven, not owned by one group. Deliberately not chips and never
// ranked: no bars, no percentages, no skill levels.
export function Skills() {
  return (
    <ul className="grid gap-4">
      {skillGroups.map((g, i) => (
        <li
          key={g.title}
          className="group glass border-line hover:border-accent/50 relative rounded-[var(--radius-panel)] border p-6 transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99] md:p-8"
        >
          <div className="grid gap-x-12 gap-y-5 md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr]">
            <div className="flex items-baseline gap-4 md:gap-6">
              <span
                aria-hidden
                className="accent-serif text-muted group-hover:text-accent text-3xl leading-none transition-colors duration-(--dur-base)"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-strong text-lg font-semibold tracking-tight md:text-xl">
                {g.title}
              </h3>
            </div>
            <ul className="text-body flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
              {g.skills.map((s) => (
                <li
                  key={s}
                  className="hover:text-strong flex items-center gap-2.5 transition-colors duration-(--dur-base)"
                >
                  <span
                    aria-hidden
                    className="bg-line group-hover:bg-accent h-1 w-1 shrink-0 rounded-full transition-colors"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
