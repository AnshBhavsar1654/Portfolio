import { CountUp } from "@/components/site/count-up";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// Stats derived from content arrays, never typed by hand.
const STATS = [
  {
    value: Number.parseFloat(profile.cgpa),
    decimals: 2,
    label: "CGPA",
  },
  { value: experience.length, decimals: 0, label: "Roles held" },
  { value: projects.length, decimals: 0, label: "Projects shipped" },
];

// The portrait is the section backdrop (right side); this panel sits on the
// left, in front of it.
export function About() {
  return (
    <div className="glass border-line rounded-[var(--radius-panel)] border p-8 md:p-10 lg:max-w-3xl">
      <p className="text-strong text-2xl leading-snug tracking-tight text-pretty md:text-3xl">
        {profile.about}
      </p>
      <dl className="mt-12 grid grid-cols-3 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="border-line border-t pt-4">
            <dd className="accent-serif text-strong text-5xl leading-none md:text-7xl">
              <CountUp to={s.value} decimals={s.decimals} suffix="" />
            </dd>
            <dt className="text-muted mt-3 font-mono text-xs uppercase">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
