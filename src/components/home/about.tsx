import Image from "next/image";
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

export function About() {
  return (
    <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
      <figure className="lg:col-span-4">
        <div className="border-line bg-surface relative -rotate-2 overflow-hidden rounded-[var(--radius-panel)] border p-2 transition-transform duration-(--dur-slow) ease-(--ease-out-soft) hover:rotate-0">
          <Image
            src={profile.aboutImage}
            alt={`${profile.name} at work`}
            width={800}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 380px"
            className="aspect-[4/5] w-full rounded-[calc(var(--radius-panel)-8px)] object-cover"
          />
        </div>
        <figcaption className="text-muted mt-4 font-mono text-xs uppercase">
          {profile.location}
        </figcaption>
      </figure>
      <div className="lg:col-span-8">
        <p className="text-strong text-2xl leading-snug tracking-tight text-pretty md:text-3xl">
          {profile.about}
        </p>
        <dl className="mt-14 grid grid-cols-3 gap-6">
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
    </div>
  );
}
