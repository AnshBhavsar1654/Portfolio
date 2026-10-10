import { CountUp } from "@/components/site/count-up";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { publications } from "@/content/research";

// Stats derived from content arrays, never typed by hand.
const STATS = [
  {
    value: Number.parseFloat(profile.cgpa),
    decimals: 2,
    suffix: "",
    label: "CGPA",
  },
  { value: publications.length, decimals: 0, suffix: "", label: "IEEE papers" },
  { value: experience.length, decimals: 0, suffix: "", label: "Internships" },
  { value: 500, decimals: 0, suffix: "+", label: "Resumes ranked" },
];

export function About() {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <p className="text-strong text-xl leading-snug tracking-tight text-pretty md:text-2xl lg:col-span-7">
        {profile.about}
      </p>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-5">
        {STATS.map((s) => (
          <div key={s.label} className="border-line border-t pt-4">
            <dd className="text-strong text-5xl font-semibold tracking-tighter">
              <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
            <dt className="text-muted mt-2 text-sm">{s.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
