import { education } from "@/content/experience";

// Same scorecard grammar as the experience list, without the disclosure.
// Headline figures are set large in the display serif; the rest is a short
// "focus" line instead of a run-on sentence.
export function EducationList() {
  return (
    <ul className="divide-line divide-y">
      {education.map((s, i) => (
        <li
          key={s.school}
          className="grid gap-x-6 gap-y-5 px-3 py-8 first:pt-0 md:grid-cols-[3rem_1fr_14rem]"
        >
          <span className="text-muted hidden pt-2 font-mono text-xs tabular-nums md:block">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-strong text-2xl font-semibold tracking-tight md:text-4xl">
              {s.school}
            </p>
            <p className="text-body mt-2 text-base">{s.degree}</p>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {s.scores.map((sc) => (
                <div key={sc.label}>
                  <dd className="accent-serif text-accent text-5xl leading-none">
                    {sc.value}
                  </dd>
                  <dt className="text-muted mt-2 font-mono text-[11px] uppercase">
                    {sc.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="text-muted mt-6 mb-2 font-mono text-[11px] tracking-(--tracking-eyebrow) uppercase">
              Focus
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {s.focus.map((f) => (
                <li
                  key={f}
                  className="border-line text-body rounded-full border px-3 py-1 text-[13px]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-muted font-mono text-xs tabular-nums md:pt-2">
            <p>{s.period}</p>
            <p className="mt-1">{s.location}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
