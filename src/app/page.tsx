import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import Link from "next/link";
import { About } from "@/components/home/about";
import { ContactBlock } from "@/components/home/contact-block";
import { EducationList } from "@/components/home/education-list";
import { ExperienceList } from "@/components/home/experience-list";
import { Hero } from "@/components/home/hero";
import { MountainScenery } from "@/components/home/mountain-scenery";
import { QuoteBlock } from "@/components/home/quote-block";
import { Skills } from "@/components/home/skills";
import { WorkList } from "@/components/home/work-list";
import { BackdropSection } from "@/components/site/backdrop-section";
import { BackdropStage } from "@/components/site/backdrop-stage";
import { SectionHeading } from "@/components/site/section";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <MountainScenery hero={<Hero />}>
      <BackdropStage />

      <BackdropSection id="about">
        <About />
      </BackdropSection>

      <BackdropSection id="experience">
        <SectionHeading
          label="Experience"
          title="Where I have"
          accent="worked."
        />
        <div className="mt-12">
          <ExperienceList />
        </div>
      </BackdropSection>

      <BackdropSection id="education">
        <SectionHeading label="Education" title="Where I" accent="studied." />
        <div className="mt-12">
          <EducationList />
        </div>
      </BackdropSection>

      <BackdropSection id="work">
        <SectionHeading label="Projects" title="What I have" accent="built." />
        <div className="mt-12">
          <WorkList limit={3} />
          <div className="mt-8 flex justify-end">
            <Link
              href="/work"
              className="link-sweep text-accent hover:text-accent-hover group inline-flex items-center gap-2 py-2 text-sm font-medium"
            >
              All projects
              <ArrowRight
                aria-hidden
                size={16}
                weight="bold"
                className="transition-transform duration-(--dur-base) ease-(--ease-base) group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </BackdropSection>

      <BackdropSection id="skills">
        <SectionHeading label="Skills" title="Tools I" accent="reach for." />
        <div className="mt-12">
          <Skills />
        </div>
      </BackdropSection>

      <BackdropSection id="quote" print>
        <QuoteBlock />
      </BackdropSection>

      <BackdropSection id="contact">
        <SectionHeading
          label="Contact"
          title="Have a project?"
          accent="Or a role?"
          body={profile.contact.availability}
        />
        <div className="mt-12">
          <ContactBlock />
        </div>
      </BackdropSection>
    </MountainScenery>
  );
}
