import { skillGroups } from "@/content/skills";

// Batting order: numbered groups, plain typographic lists. Deliberately not
// chips, so this section does not repeat the tag treatment used elsewhere.
export function Skills() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {skillGroups.map((g, i) => (
        <div
          key={g.title}
          className="border-line bg-surface hover:border-accent/50 group rounded-[var(--radius-panel)] border p-6 transition-colors duration-(--dur-base)"
        >
          <p className="accent-serif text-accent text-6xl leading-none">
            {i + 1}
          </p>
          <h3 className="text-strong mt-6 text-lg font-semibold tracking-tight">
            {g.title}
          </h3>
          <ul className="text-body mt-4 space-y-2 text-[15px]">
            {g.skills.map((s) => (
              <li
                key={s}
                className="hover:text-strong flex items-center gap-2 transition-transform duration-(--dur-base) hover:translate-x-1"
              >
                <span
                  aria-hidden
                  className="bg-line group-hover:bg-accent h-1 w-1 rounded-full transition-colors"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
