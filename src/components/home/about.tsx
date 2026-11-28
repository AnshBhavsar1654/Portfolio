import { AboutInterests } from "@/components/home/about-interests";
import { SectionHeading } from "@/components/site/section";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const STATS = [
  { value: profile.cgpa, label: "CGPA" },
  { value: experience.length, label: "Roles" },
  { value: projects.length, label: "Projects" },
];

export function About() {
  const [intro, ...bio] = profile.about;

  return (
    <div className="about-layout">
      <div>
        <SectionHeading title="A little" accent="about me." />
        <p className="about-intro">{intro}</p>
        <div className="about-bio">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="about-stats">
          {STATS.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <AboutInterests />
    </div>
  );
}
