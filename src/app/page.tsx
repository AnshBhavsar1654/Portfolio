import Link from "next/link";
import { About } from "@/components/home/about";
import { ContactBlock } from "@/components/home/contact-block";
import { EducationList } from "@/components/home/education-list";
import { ExperienceList } from "@/components/home/experience-list";
import { Hero } from "@/components/home/hero";
import { QuoteBlock } from "@/components/home/quote-block";
import { Skills } from "@/components/home/skills";
import { WorkList } from "@/components/home/work-list";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="about" first>
        <Reveal>
          <SectionHeading
            index="01"
            label="About"
            title="A little"
            accent="about me."
          />
        </Reveal>
        <Reveal className="mt-12">
          <About />
        </Reveal>
      </Section>

      <Section id="experience">
        <Reveal>
          <SectionHeading
            index="02"
            label="Experience"
            title="Where I have"
            accent="worked."
            body="Production work at startups."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ExperienceList />
        </Reveal>
      </Section>

      <Section id="education">
        <Reveal>
          <SectionHeading
            index="03"
            label="Education"
            title="Where I"
            accent="studied."
          />
        </Reveal>
        <Reveal className="mt-12">
          <EducationList />
        </Reveal>
      </Section>

      <Section id="work">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            index="04"
            label="Work"
            title="Proof, not"
            accent="promises."
          />
          <Link
            href="/work"
            className="text-accent text-sm font-medium hover:underline"
          >
            All projects
          </Link>
        </Reveal>
        <Reveal className="mt-12">
          <WorkList limit={4} />
        </Reveal>
      </Section>

      <Section id="skills">
        <Reveal>
          <SectionHeading
            index="05"
            label="Skills"
            title="Tools I"
            accent="reach for."
            body="Grouped by what they do, not ranked."
          />
        </Reveal>
        <Reveal className="mt-12">
          <Skills />
        </Reveal>
      </Section>

      <Section first className="py-24 md:py-40">
        <Reveal>
          <QuoteBlock />
        </Reveal>
      </Section>
      <Section id="contact">
        <Reveal>
          <SectionHeading
            index="06"
            label="Contact"
            title="Have a product problem?"
            accent="Bring it."
            body="I take on full-stack builds, AI agents, and data apps. Replies within two days."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ContactBlock />
        </Reveal>
      </Section>
    </>
  );
}
