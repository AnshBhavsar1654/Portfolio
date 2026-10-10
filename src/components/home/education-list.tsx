import { education } from "@/content/experience";

// Static rows in the experience-list visual language: period on the left,
// school on the right. A single entry, so no disclosure needed.
export function EducationList() {
  return (
    <ul className="divide-line divide-y">
      {education.map((s) => (
        <li
          key={s.school}
          className="grid gap-x-10 gap-y-2 py-7 first:pt-0 md:grid-cols-[200px_1fr]"
        >
          <div className="text-muted font-mono text-xs tabular-nums md:pt-1.5">
            <p>{s.period}</p>
            <p className="mt-1">{s.location}</p>
          </div>
          <div>
            <p className="text-strong text-xl font-semibold tracking-tight">
              {s.school}
            </p>
            <p className="text-muted mt-0.5 text-sm">{s.degree}</p>
            <p className="text-body mt-4 max-w-[68ch] text-[15px] leading-relaxed">
              {s.detail}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
