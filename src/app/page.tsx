import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
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
import { SectionHeading } from "@/components/site/section";

export default function Home() {
  return (
    <>
      <BackdropStage />
      <Hero />

      <BackdropSection id="about" backdrop="about">
        <SectionHeading
          index="01"
          label="About"
          title="A little"
          accent="about me."
        />
        <div className="mt-12">
          <About />
        </div>
      </BackdropSection>

      <BackdropSection id="experience" backdrop="experience">
        <SectionHeading
          index="02"
          label="Experience"
          title="Where I have"
          accent="worked."
          body="Production work at startups."
        />
        <div className="mt-12">
          <ExperienceList />
        </div>
      </BackdropSection>

      <BackdropSection id="education" backdrop="education">
        <SectionHeading
          index="03"
          label="Education"
          title="Where I"
          accent="studied."
        />
        <div className="mt-12">
          <EducationList />
        </div>
      </BackdropSection>

      <BackdropSection id="work" backdrop="work">
        <SectionHeading
          index="04"
          label="Projects"
          title="What I have"
          accent="built."
          body="Systems with live demos and public code."
        />
        <div className="mt-12">
          <WorkList limit={3} />
          <div className="mt-8 flex justify-end">
            <Link
              href="/work"
              className="link-sweep text-accent hover:text-accent-hover group inline-flex items-center gap-2 py-2 text-sm font-medium"
            >
              Show more
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

      <BackdropSection id="skills" backdrop="skills">
        <SectionHeading
          index="05"
          label="Skills"
          title="Tools I"
          accent="reach for."
        />
        <div className="mt-12">
          <Skills />
        </div>
      </BackdropSection>

      <BackdropSection id="quote" className="lg:py-40">
        {/* Two wide-screen pins drive the split-half prints (Dhoni left,
            Messi right) with the whole section's dissolve timing. They are
            hidden below lg, where each quote's own wrapper pin (see
            QuoteBlock) takes over: one screen-height block per quote with
            only its athlete printing behind it. Hidden pins have a zero
            rect, so the stage never mounts their prints. */}
        <div
          aria-hidden
          data-backdrop="quoteDhoni"
          className="absolute inset-0 hidden lg:block"
        />
        <div
          aria-hidden
          data-backdrop="quoteMessi"
          className="absolute inset-0 hidden lg:block"
        />
        <QuoteBlock />
      </BackdropSection>

      <BackdropSection id="contact" backdrop="contact">
        <SectionHeading
          index="06"
          label="Contact"
          title="Have a project?"
          accent="Or a role?"
          body="I take on full-stack builds, AI agents and data apps, and I'm also open to full-time roles. Replies within two days."
        />
        <div className="mt-12">
          <ContactBlock />
        </div>
      </BackdropSection>
    </>
  );
}
