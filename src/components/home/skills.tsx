import { skillGroups } from "@/content/skills";

// Plain typographic columns. Deliberately not chips, so this section does
// not repeat the tag treatment used by work and experience.
export function Skills() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {skillGroups.map((g) => (
        <div key={g.title} className="border-line border-t pt-4">
          <h3 className="text-strong text-sm font-semibold">{g.title}</h3>
          <ul className="text-body mt-4 space-y-2 text-[15px]">
            {g.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
