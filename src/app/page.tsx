import Link from "next/link";
import { About } from "@/components/home/about";
import { ContactBlock } from "@/components/home/contact-block";
import { EducationList } from "@/components/home/education-list";
import { ExperienceList } from "@/components/home/experience-list";
import { Hero } from "@/components/home/hero";
import { QuoteBlock } from "@/components/home/quote-block";
import { Skills } from "@/components/home/skills";
import { WorkList } from "@/components/home/work-list";
import { BackdropSection } from "@/components/site/backdrop-section";
import { BackdropStage } from "@/components/site/backdrop-stage";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section";

export default function Home() {
  return (
    <>
      <BackdropStage />
      <Hero />

      <BackdropSection id="about" backdrop="about">
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
      </BackdropSection>

      <BackdropSection id="experience" backdrop="experience">
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
      </BackdropSection>

      <BackdropSection id="education" backdrop="education">
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
      </BackdropSection>

      <BackdropSection id="work" backdrop="work">
        <Reveal>
          <SectionHeading
            index="04"
            label="Projects"
            title="What I have"
            accent="built."
            body="Systems with live demos and public code."
          />
        </Reveal>
        <Reveal className="mt-12">
          <WorkList limit={4} />
          <div className="mt-8 flex justify-end">
            <Link
              href="/work"
              className="text-accent text-sm font-medium hover:underline"
            >
              All projects
            </Link>
          </div>
        </Reveal>
      </BackdropSection>

      <BackdropSection id="skills" backdrop="skills">
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
      </BackdropSection>

      <BackdropSection
        id="quote"
        backdrop="quote"

        className="lg:py-40"
      >
        <Reveal>
          <QuoteBlock />
        </Reveal>
      </BackdropSection>

      <BackdropSection id="contact" backdrop="contact">
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
      </BackdropSection>
    </>
  );
}
